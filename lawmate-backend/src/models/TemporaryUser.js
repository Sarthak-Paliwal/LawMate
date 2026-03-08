const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const temporaryUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'advocate', 'admin'], required: true },
  phone: { type: String },
  profileImage: { type: String, default: '' },
  
  // Advocate Fields
  barCouncilId: { type: String, trim: true },
  enrollmentYear: { type: Number },
  stateBarCouncil: { type: String, trim: true },
  
  // OTP Verification Fields
  otp: { type: String, select: false },

  
  // TTL Index: automatically delete document when this expires
  otpExpiresAt: { type: Date, select: false, expires: 0 },


}, { timestamps: true });

temporaryUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('TemporaryUser', temporaryUserSchema);
