const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },

  password: { 
    type: String, 
    required: true, 
    minlength: 6, 
    maxlength: 128, 
    select: false 
  },

  role: { 
    type: String, 
    enum: ['user', 'advocate', 'admin'], 
    required: true 
  },

  phone: { type: String },

  profileImage: { type: String, default: '' },

  // Advocate Verification Fields
  barCouncilId: { type: String, trim: true },
  enrollmentYear: { type: Number },
  stateBarCouncil: { type: String, trim: true },
  idProofDocumentUrl: { type: String },
  isEmailVerified: { 
    type: Boolean, 
    default: false // Everyone needs to verify their email
  },
  isAdvocateVerified: {
    type: Boolean,
    default: false // Advocates must be manually verified by admins
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  // OTP Verification Fields
  otp: { type: String, select: false },
  otpExpiresAt: { type: Date, select: false },


}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
