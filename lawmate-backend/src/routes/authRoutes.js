const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.post('/profile-image', protect, upload.single('profileImage'), authController.uploadProfileImage);
router.post('/upload-id-proof', protect, upload.single('idProof'), authController.uploadIdProof);

module.exports = router;
