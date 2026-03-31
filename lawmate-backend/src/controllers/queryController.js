const LegalQuery = require('../models/LegalQuery');
const decisionService = require('../services/decisionService');
const aiService = require('../services/aiService');
const queryService = require('../services/queryService');

/**
 * Lightweight server-side gibberish detector.
 * Returns true if the text is likely random/non-meaningful input.
 */
function isGibberish(text) {
  if (!text || typeof text !== 'string') return true;
  const t = text.trim();
  if (t.length < 10) return false; // short inputs are checked by length alone

  // Repeated characters: aaaaa, jjjjjj
  if ((/(.)(\1){4,}/).test(t)) return true;

  const cleaned = t.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length === 0) return true;

  // Vowel ratio check
  const vowels = (cleaned.match(/[aeiou]/g) || []).length;
  const ratio = vowels / cleaned.length;
  if (cleaned.length > 10 && (ratio < 0.10 || ratio > 0.92)) return true;

  // Long consonant clusters without vowels
  if ((/[^aeiou ]{9,}/).test(cleaned)) return true;

  // Mostly numbers/symbols
  const letters = (t.match(/[a-zA-Z]/g) || []).length;
  if (t.length > 8 && letters / t.length < 0.35) return true;

  return false;
}


exports.analyzeQuery = async (req, res, next) => {
  try {
    const { category, subcategory, description } = req.body;

    if (!description) {
      return res.status(400).json({
        status: 'fail',
        message: 'Description is required',
      });
    }

    if (isGibberish(description)) {
      return res.status(422).json({
        status: 'fail',
        message: 'Your query does not appear to describe a valid legal situation. Please provide a clear description of your problem.',
      });
    }

    // 1. Get Deterministic Rule-Based Decision
    const ruleDecision = decisionService.analyzeRuleBased(category, subcategory);

    // 2. AI Enhancement
    const aiResponse = await aiService.generateLegalInsight({
        category,
        subcategory,
        description,
        ruleDecision
    });

    // 3. Merge Logic (AI enhances Rule-based)
    // We prioritize AI specific details if available (and not error), otherwise fallback to rules
    const finalDecision = {
        legalNature: ruleDecision.legalNature, // Rule is source of truth for nature
        severity: (aiResponse.severity !== "Unknown") ? aiResponse.severity : ruleDecision.severity,
        recommendedAction: aiResponse.recommendedActions?.length > 0 ? aiResponse.recommendedActions : ruleDecision.recommendedAction,
        relevantActs: aiResponse.relevantActs?.length > 0 ? aiResponse.relevantActs : ruleDecision.relevantActs,
        estimatedTime: ruleDecision.estimatedTime,
        estimatedCost: ruleDecision.estimatedCost,
        worthItAnalysis: ruleDecision.worthItAnalysis,
        nextSteps: ruleDecision.nextSteps
    };

    // 4. Save to Database
    const newQuery = await LegalQuery.create({
        user: req.user.id,
        queryType: 'resolver',
        category,
        subCategory: subcategory,
        description,
        decision: finalDecision,
        aiAnalysis: {
            legalInsight: aiResponse.legalInsight || "Legal insight unavailable at this moment.",
            fullResponse: aiResponse
        }
    });

    res.status(201).json({
      status: 'success',
      data: {
        ...finalDecision,
        legalInsight: newQuery.aiAnalysis.legalInsight,
        queryId: newQuery._id
      }
    });

  } catch (error) {
    next(error);
  }
};

/* -------------------- Create Query (Simple Chat) -------------------- */

exports.createQuery = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        status: 'fail',
        message: 'Question is required'
      });
    }

    if (isGibberish(question)) {
      return res.status(422).json({
        status: 'fail',
        message: 'Your query does not appear to be a valid question. Please describe your legal concern clearly.',
      });
    }

    const query = await queryService.createQuery(req.user.id, question);

    res.status(201).json({
      status: 'success',
      data: query
    });

  } catch (error) {
    next(error);
  }
};

/* -------------------- Get My Queries -------------------- */

exports.getMyQueries = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.type) {
      filter.queryType = req.query.type;
    }
    
    const queries = await LegalQuery.find(filter).sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: queries.length,
      data: queries
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- Delete Query -------------------- */

exports.deleteQuery = async (req, res, next) => {
  try {
    const query = await LegalQuery.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!query) {
      return res.status(404).json({
        status: 'fail',
        message: 'Query not found or not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Query deleted'
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- Reopen Query -------------------- */

exports.reopenQuery = async (req, res, next) => {
  try {
    const query = await LegalQuery.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'open' },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        status: 'fail',
        message: 'Query not found or not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      data: query
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- Save Query -------------------- */

exports.saveQuery = async (req, res, next) => {
  try {
    const query = await LegalQuery.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isSaved: true },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        status: 'fail',
        message: 'Query not found or not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      data: query
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- Clear All Queries -------------------- */

exports.clearAllQueries = async (req, res, next) => {
  try {
    const filter = { user: req.user.id, isSaved: { $ne: true } };
    if (req.query.type) {
      filter.queryType = req.query.type;
    }
    await LegalQuery.deleteMany(filter);

    res.status(200).json({
      status: 'success',
      message: 'All queries cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};
