const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  advocate: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  message: { 
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: ['pending', 'slots_proposed', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },

  proposedSlots: [{
    date: { type: Date, required: true },
    time: { type: String, required: true }
  }],

  confirmedSlot: {
    date: { type: Date },
    time: { type: String }
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  scheduledAt: { 
    type: Date 
  },

}, { timestamps: true });

/* -------------------- Indexes -------------------- */

bookingSchema.index({ user: 1 });
bookingSchema.index({ advocate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
