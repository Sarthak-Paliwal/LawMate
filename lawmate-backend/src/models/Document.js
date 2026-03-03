const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  type: { 
    type: String, 
    enum: ['Legal Notice', 'Rent Agreement', 'General Affidavit', 'RTI Application', 'Consumer Complaint'], 
    required: true 
  },

  data: { 
    type: Object, 
    required: true 
  },

  content: { 
    type: String, 
    required: true 
  }, // The final HTML/Text content

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Document', documentSchema);
