const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const { protect } = require('../middleware/auth'); 
const { analyzeLimiter } = require('../middleware/rateLimiter');

router.use(protect); // Protect all query routes

router.get('/', queryController.getMyQueries);
router.post('/', queryController.createQuery);
router.post('/analyze', analyzeLimiter, queryController.analyzeQuery);
router.delete('/clear-all', queryController.clearAllQueries);
router.delete('/:id', queryController.deleteQuery);
router.patch('/:id/save', queryController.saveQuery);
router.patch('/:id/reopen', queryController.reopenQuery);

module.exports = router;
