const LegalQuery = require('../models/LegalQuery');
const aiService = require('./aiService');

/* -------------------- Fallback Mock Responses -------------------- */

const MOCK_RESPONSES = [
  'Based on general legal principles, you may have grounds to seek remedy. It is advisable to consult a qualified advocate with your specific documents.',
  'Indian law typically requires evidence and documentation. You should gather relevant papers and approach the appropriate forum within the limitation period.',
  'This type of matter often falls under civil/criminal jurisdiction. A detailed consultation with an advocate would help clarify your options.',
  'The applicable law may vary by state. We recommend getting legal advice tailored to your situation and jurisdiction.',
];

const getRandomResponse = (question) => {
  const idx = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[idx] + ` (Query: "${question.substring(0, 50)}...")`;
};

/* -------------------- Create Query -------------------- */

exports.createQuery = async (userId, question) => {
  if (!question || question.trim() === "") {
    const e = new Error("Question is required");
    e.statusCode = 400;
    throw e;
  }

  let response;

  try {
    // Try AI first
    response = await aiService.generateLegalResponse(question);
  } catch (error) {
    // Fallback to mock if AI fails
    response = getRandomResponse(question);
  }

  const query = await LegalQuery.create({
    user: userId,
    question: question.trim(),
    response
  });

  return query;
};

/* -------------------- Get User Queries -------------------- */

exports.getUserQueries = async (userId) => {
  return LegalQuery
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
};
