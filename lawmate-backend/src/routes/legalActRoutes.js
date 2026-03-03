const express = require('express');
const legalActController = require('../controllers/legalActController');

const router = express.Router();

router.get('/', legalActController.getAll);
router.get('/categories', legalActController.getCategories);
router.get('/:id', legalActController.getById);

module.exports = router;
