const express = require('express');
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/:bookingId', chatController.getMessages);

module.exports = router;
