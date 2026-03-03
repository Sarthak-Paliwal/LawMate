const express = require('express');
const bookingController = require('../controllers/bookingController');
const { protect, role } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/:advocateId', role('user'), bookingController.create);
router.get('/', bookingController.getMyBookings);
router.patch('/:id/status', role('advocate'), bookingController.updateStatus);
router.post('/:id/rate', role('user'), bookingController.rateBooking);

module.exports = router;
