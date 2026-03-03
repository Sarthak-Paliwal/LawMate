const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, role } = require('../middleware/auth');

const router = express.Router();

// All routes below require admin privileges
router.use(protect);
router.use(role('admin'));

router.get('/pending-advocates', adminController.getPendingAdvocates);
router.post('/verify-advocate/:id', adminController.verifyAdvocate);

module.exports = router;
