/**
 * validateQuery.js
 * Detects whether a user-entered query is meaningful or gibberish.
 * Returns { valid: boolean, reason: string | null }
 */

// Common legal/meaningful English words (fast inclusion check)
const LEGAL_KEYWORDS = [
  'accident', 'agreement', 'appeal', 'arrest', 'assault', 'bail', 'bank',
  'breach', 'bribe', 'case', 'child', 'civil', 'claim', 'complaint', 'contract',
  'court', 'crime', 'criminal', 'custody', 'damage', 'debt', 'defamation',
  'dispute', 'divorce', 'document', 'employment', 'eviction', 'evidence',
  'family', 'fight', 'fine', 'fire', 'fired', 'fraud', 'government', 'harm',
  'help', 'hire', 'hit', 'home', 'house', 'husband', 'injury', 'insurance',
  'issue', 'jail', 'job', 'land', 'landlord', 'lawsuit', 'lawyer', 'lease',
  'legal', 'liability', 'license', 'loan', 'money', 'murder', 'negligence',
  'notice', 'offence', 'offense', 'order', 'payment', 'penalty', 'police',
  'property', 'prosecution', 'rape', 'rent', 'report', 'rights', 'robbery',
  'salary', 'scam', 'sentence', 'settlement', 'slander', 'stolen', 'sue',
  'tenant', 'termination', 'theft', 'threaten', 'traffic', 'trial', 'vehicle',
  'violence', 'warrant', 'wife', 'witness', 'work', 'worker',
  // common verbs/articles that indicate real sentences
  'the', 'and', 'was', 'has', 'have', 'are', 'were', 'been', 'with', 'from',
  'that', 'this', 'they', 'them', 'what', 'when', 'where', 'which', 'while',
  'about', 'after', 'against', 'before', 'between', 'because', 'during',
  'into', 'through', 'under', 'upon', 'within', 'without', 'would', 'could',
  'should', 'want', 'need', 'like', 'know', 'think', 'told', 'said', 'came',
  'went', 'made', 'gave', 'took', 'paid', 'filed', 'signed', 'lost',
];

/**
 * Checks if a string has a realistic ratio of actual dictionary-like words.
 */
function hasRealWords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  if (words.length === 0) return false;

  const matched = words.filter((w) => LEGAL_KEYWORDS.includes(w));
  // At least 1 known meaningful word per 8 words, or at least 1 match in short texts
  return matched.length >= 1 || words.length <= 4;
}

/**
 * Checks for excessive repeated characters like "aaaa", "hhhhhh", "jjjjj"
 */
function hasExcessiveRepeat(text) {
  return /(.)\1{4,}/.test(text); // same char repeated 5+ times
}

/**
 * Checks if string looks like random key-mashing (very low vowel ratio or all consonants clusters)
 */
function looksLikeKeyMash(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length === 0) return false;

  const vowels = (cleaned.match(/[aeiou]/g) || []).length;
  const vowelRatio = vowels / cleaned.length;

  // Genuine text typically has ~35-50% vowels
  // Key-mashing tends to hit <15% or >90% vowels
  if (cleaned.length > 10 && (vowelRatio < 0.12 || vowelRatio > 0.90)) return true;

  // Long unbroken consonant clusters (8+ consonants without a vowel) signal gibberish
  if (/[^aeiou ]{8,}/.test(cleaned)) return true;

  return false;
}

/**
 * Checks if text is mostly numbers/special characters with very few letters
 */
function isMostlyNonAlpha(text) {
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  return text.trim().length > 5 && letters / text.trim().length < 0.4;
}

/**
 * Main validation function.
 * @param {string} text - The query text to validate
 * @param {number} [minLength=20] - Minimum character length required
 * @returns {{ valid: boolean, reason: string | null }}
 */
export function validateQuery(text, minLength = 20) {
  const trimmed = (text || '').trim();

  if (!trimmed) {
    return { valid: false, reason: 'Please describe your situation before proceeding.' };
  }

  if (trimmed.length < minLength) {
    return {
      valid: false,
      reason: `Please provide more detail (at least ${minLength} characters).`,
    };
  }

  if (hasExcessiveRepeat(trimmed)) {
    return {
      valid: false,
      reason: 'Your description appears to contain repeated characters. Please describe your legal situation clearly.',
    };
  }

  if (looksLikeKeyMash(trimmed)) {
    return {
      valid: false,
      reason: 'Your input appears to be random text. Please describe your legal query in plain English.',
    };
  }

  if (isMostlyNonAlpha(trimmed)) {
    return {
      valid: false,
      reason: 'Please use words to describe your situation, not just numbers or symbols.',
    };
  }

  if (!hasRealWords(trimmed)) {
    return {
      valid: false,
      reason: 'Your query doesn\'t seem to describe a legal situation. Please use plain English to explain your problem.',
    };
  }

  return { valid: true, reason: null };
}

/**
 * Lightweight version for the chat input (shorter minimum length).
 * @param {string} text
 * @returns {{ valid: boolean, reason: string | null }}
 */
export function validateChatQuery(text) {
  return validateQuery(text, 10);
}
