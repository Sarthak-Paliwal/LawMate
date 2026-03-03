const mongoose = require('mongoose');

const legalQuerySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String }, // For simple chat
  response: { type: String }, // For simple chat response
  category: { type: String },
  subCategory: { type: String },
  description: { type: String },

  status: { type: String, enum: ['open', 'closed'], default: 'open' },

  // Rule-based decision
  decision: {
    legalNature: { type: String },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    recommendedAction: [{ type: String }],
    relevantActs: [{ type: String }],
    estimatedTime: { type: String },
    estimatedCost: { type: String },
    nextSteps: [{ type: String }],
  },

  // AI-based analysis (optional/enhancement)
  aiAnalysis: {
    legalInsight: { type: String },
    fullResponse: { type: mongoose.Schema.Types.Mixed }, // flexible for JSON
  },

  isSaved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LegalQuery', legalQuerySchema);
