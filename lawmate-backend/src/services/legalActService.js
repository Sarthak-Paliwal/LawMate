const LegalAct = require('../models/LegalAct');

/* -------------------- Get All Acts (With Search + Category + Pagination) -------------------- */

exports.getAll = async (search, category, page = 1, limit = 100) => {

  const conditions = [];

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    conditions.push({
      $or: [
        { name: regex },
        { shortName: regex },
        { description: regex },
        { 'sections.title': regex },
        { 'sections.content': regex }
      ]
    });
  }

  if (category) {
    conditions.push({ category });
  }

  const filter = conditions.length > 0
    ? (conditions.length === 1 ? conditions[0] : { $and: conditions })
    : {};

  const skip = (page - 1) * limit;

  const acts = await LegalAct.find(filter)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await LegalAct.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: acts
  };
};

/* -------------------- Get Distinct Categories -------------------- */

exports.getCategories = async () => {
  const categories = await LegalAct.distinct('category');
  return categories.sort();
};

/* -------------------- Get Act By ID -------------------- */

exports.getById = async (id) => {

  const act = await LegalAct.findById(id).lean();

  if (!act) {
    const e = new Error('Legal act not found');
    e.statusCode = 404;
    throw e;
  }

  return act;
};
