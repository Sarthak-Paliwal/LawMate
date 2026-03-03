const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  number: { type: String, required: true, trim: true },
  title: { type: String, trim: true },
  content: { type: String, required: true, trim: true },
});

const LEGAL_CATEGORIES = [
  'Traffic Law', 'Land & Property', 'Criminal Defense', 'Family Law', 
  'Employment', 'Consumer Rights', 'Constitution', 'Business Law', 
  'Cyber Law', 'Health & Medical', 'Education Law', 'Human Rights',
  'Environment & Wildlife', 'Tax & Revenue', 'Other'
];

const legalActSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortName: { type: String, trim: true },
  year: { type: Number },
  description: { type: String, trim: true },
  category: { type: String, enum: LEGAL_CATEGORIES, default: 'Other' },
  sections: [sectionSchema],
}, { timestamps: true });

/* -------------------- Indexes -------------------- */

legalActSchema.index({ name: 1 });
legalActSchema.index({ shortName: 1 });
legalActSchema.index({ year: 1 });
legalActSchema.index({ category: 1 });

legalActSchema.index({
  name: 'text',
  shortName: 'text',
  description: 'text',
  'sections.title': 'text',
  'sections.content': 'text'
});

module.exports = mongoose.model('LegalAct', legalActSchema);
