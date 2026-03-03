const legalActService = require('../services/legalActService');

/* -------------------- Get All Legal Acts -------------------- */

exports.getAll = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const category = req.query.category || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;

    const result = await legalActService.getAll(search, category, page, limit);

    res.status(200).json({
      status: "success",
      ...result
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Get Distinct Categories -------------------- */

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await legalActService.getCategories();

    res.status(200).json({
      status: "success",
      data: categories
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Get Legal Act By ID -------------------- */

exports.getById = async (req, res, next) => {
  try {
    const act = await legalActService.getById(req.params.id);

    res.status(200).json({
      status: "success",
      data: act
    });

  } catch (err) {
    next(err);
  }
};
