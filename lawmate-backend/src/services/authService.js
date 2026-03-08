const User = require('../models/User');
const TemporaryUser = require('../models/TemporaryUser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('./emailService');

/* -------------------- Token Generator -------------------- */

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment variables");
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/* -------------------- Register -------------------- */

exports.register = async (body) => {
  const { name, email, password, role, phone, barCouncilId, enrollmentYear, stateBarCouncil } = body;

  const exists = await User.findOne({ email });
  if (exists) {
    const e = new Error('User already exists with this email');
    e.statusCode = 400;
    throw e;
  }

  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Remove any stale temporary registrations for this email
  await TemporaryUser.deleteMany({ email });

  const tempUser = await TemporaryUser.create({ 
    name, 
    email, 
    password, 
    role, 
    phone, 
    otp,
    otpExpiresAt,
    ...(role === 'advocate' && { barCouncilId, enrollmentYear, stateBarCouncil })
  });

  // Try to send the OTP email in the background 
  emailService.sendVerificationOTP(tempUser.email, otp).catch(err => {
    console.error(`Failed to send email to ${tempUser.email}`, err);
  });

  return {
    message: 'Registration successful. Please check your email for the OTP.',
    user: {
      email: tempUser.email,
      phone: tempUser.phone
    }
  };
};

/* -------------------- Login -------------------- */

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const e = new Error('Invalid credentials');
    e.statusCode = 401;
    throw e;
  }

  // Check verification BEFORE password match to prevent guessing passwords of unverified users
  if (!user.isEmailVerified) {
    const e = new Error('Please verify your email address.');
    // Using 403 so the frontend knows it's an authorization/verification block
    e.statusCode = 403;
    e.isVerificationRequired = true;
    e.needsEmailVerification = !user.isEmailVerified;
    throw e;
  }

  const match = await user.matchPassword(password);

  if (!match) {
    const e = new Error('Invalid credentials');
    e.statusCode = 401;
    throw e;
  }

  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage || '',
      isEmailVerified: user.isEmailVerified,
      isAdvocateVerified: user.isAdvocateVerified,
      barCouncilId: user.barCouncilId,
      enrollmentYear: user.enrollmentYear,
      stateBarCouncil: user.stateBarCouncil
    },
    token
  };
};

/* -------------------- Get Current User -------------------- */

exports.getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const e = new Error('User not found');
    e.statusCode = 404;
    throw e;
  }

  return user;
};

/* -------------------- Update Profile Image -------------------- */

exports.updateProfileImage = async (userId, imageUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { profileImage: imageUrl },
    { new: true }
  );

  if (!user) {
    const e = new Error('User not found');
    e.statusCode = 404;
    throw e;
  }

  return user;
};

/* -------------------- Update ID Proof Document -------------------- */

exports.updateIdProof = async (userId, documentUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { idProofDocumentUrl: documentUrl },
    { new: true }
  );

  if (!user) {
    const e = new Error('User not found');
    e.statusCode = 404;
    throw e;
  }

  return user;
};

/* -------------------- OTP Verification -------------------- */
exports.verifyRegistrationOTPs = async (email, emailOtp) => {
  const tempUser = await TemporaryUser.findOne({ email }).select('+otp +otpExpiresAt +password');

  if (!tempUser) {
    const e = new Error('Registration session not found or has expired. Please register again.');
    e.statusCode = 404;
    throw e;
  }

  if (!tempUser.otp || !tempUser.otpExpiresAt || tempUser.otpExpiresAt < new Date()) {
    const e = new Error('Email OTP has expired or is invalid. Please register again.');
    e.statusCode = 400;
    throw e;
  }

  if (tempUser.otp !== emailOtp) {
    const e = new Error('Invalid Email OTP');
    e.statusCode = 400;
    throw e;
  }

  // All OTPs match and aren't expired. Let's create the final User!
  const newUser = await User.create({
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password, // already hashed by TemporaryUser model pre-save
    role: tempUser.role,
    phone: tempUser.phone,
    profileImage: tempUser.profileImage,
    barCouncilId: tempUser.barCouncilId,
    enrollmentYear: tempUser.enrollmentYear,
    stateBarCouncil: tempUser.stateBarCouncil,
    isEmailVerified: true,
    isPhoneVerified: false, // phone verifications are disabled temporarily
  });

  // After generating the final user, delete the temporary one
  await TemporaryUser.deleteOne({ _id: tempUser._id });

  const token = generateToken(newUser._id);
  
  return {
    message: 'Registered and verified successfully!',
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isEmailVerified: newUser.isEmailVerified,
      isPhoneVerified: newUser.isPhoneVerified,
      isAdvocateVerified: newUser.isAdvocateVerified,
      phone: newUser.phone
    },
    token
  };
};

exports.resendOTP = async (email) => {
  // Check TemporaryUser first to resend verification OTPs
  let tempUser = await TemporaryUser.findOne({ email });

  if (!tempUser) {
    const e = new Error('No pending registration found for this email.');
    e.statusCode = 404;
    throw e;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  tempUser.otp = otp;
  tempUser.otpExpiresAt = otpExpiresAt;
  await tempUser.save();

  emailService.sendVerificationOTP(tempUser.email, otp).catch(err => {
    console.error(`Failed to send email to ${tempUser.email}`, err);
  });

  return { message: 'OTP sent successfully' };
};


