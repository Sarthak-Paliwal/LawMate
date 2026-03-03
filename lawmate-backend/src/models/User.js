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
  isVerified: { 
    type: Boolean, 
    default: function() {
      // By default, regular users are considered "verified" since they don't need approval
      // Advocates need manual approval, so they default to false
      return this.role === 'user'; 
    }
  },

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
