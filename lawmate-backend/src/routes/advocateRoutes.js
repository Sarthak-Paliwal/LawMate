const express = require('express');
const advocateController = require('../controllers/advocateController');
const { protect, role } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', advocateController.list);

router.get('/profile', protect, role('advocate'), advocateController.getMyProfile);
router.put('/profile', protect, role('advocate'), advocateController.updateProfile);
router.put('/profile/picture', protect, role('advocate'), upload.single('profilePicture'), advocateController.uploadProfilePicture);

router.post('/compare', protect, role('user'), advocateController.compareAdvocates);

module.exports = router;
