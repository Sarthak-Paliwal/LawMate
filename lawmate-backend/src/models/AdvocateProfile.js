const mongoose = require('mongoose');

const advocateProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },

  bio: { 
    type: String, 
    trim: true 
  },

  specialization: [{ 
    type: String, 
    trim: true 
  }],

  experience: { 
    type: Number, 
    default: 0 
  },

  barCouncilNumber: { 
    type: String, 
    trim: true 
  },

  hourlyRate: { 
    type: Number 
  },

  location: {
    type: String,
    trim: true
  },

  profilePicture: {
    type: String, // Base64 data URL, e.g. "data:image/jpeg;base64,..."
    default: null
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  reviewCount: {
    type: Number,
    default: 0
  },

  casesHandled: {
    type: Number,
    default: 0
  },

  isAvailable: { 
    type: Boolean, 
    default: true 
  },

}, { timestamps: true });

/* -------------------- Indexes -------------------- */

advocateProfileSchema.index({ specialization: 1 });
advocateProfileSchema.index({ experience: -1 });
advocateProfileSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('AdvocateProfile', advocateProfileSchema);
