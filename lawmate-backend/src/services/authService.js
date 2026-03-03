const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

  const user = await User.create({ 
    name, 
    email, 
    password, 
    role, 
    phone,
    ...(role === 'advocate' && { barCouncilId, enrollmentYear, stateBarCouncil })
  });

  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage || '',
      isVerified: user.isVerified,
      barCouncilId: user.barCouncilId,
      enrollmentYear: user.enrollmentYear,
      stateBarCouncil: user.stateBarCouncil
    },
    token
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
      isVerified: user.isVerified,
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
