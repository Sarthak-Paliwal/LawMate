const bookingService = require('../services/bookingService');

/* -------------------- Create Booking -------------------- */

exports.create = async (req, res, next) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        status: "fail",
        message: "Only users can create bookings"
      });
    }

    const { advocateId } = req.params;

    if (!advocateId) {
      return res.status(400).json({
        status: "fail",
        message: "Advocate ID is required"
      });
    }

    const booking = await bookingService.create(
      req.user._id,
      advocateId,
      req.body
    );

    res.status(201).json({
      status: "success",
      data: booking
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Get My Bookings -------------------- */

exports.getMyBookings = async (req, res, next) => {
  try {
    let bookings;

    if (req.user.role === 'advocate') {
      bookings = await bookingService.getAdvocateBookings(req.user._id);
    } else {
      bookings = await bookingService.getUserBookings(req.user._id);
    }

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: bookings
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Update Booking Status -------------------- */

exports.updateStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'advocate') {
      return res.status(403).json({
        status: "fail",
        message: "Only advocates can update booking status"
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: "fail",
        message: "Status is required"
      });
    }

    const booking = await bookingService.updateStatus(
      id,
      req.user._id,
      status
    );

    res.status(200).json({
      status: "success",
      data: booking
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Rate Booking -------------------- */

exports.rateBooking = async (req, res, next) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        status: "fail",
        message: "Only users can rate a booking"
      });
    }

    const { id } = req.params;
    const { rating } = req.body;

    if (!rating) {
      return res.status(400).json({
        status: "fail",
        message: "Rating is required"
      });
    }

    const booking = await bookingService.rateBooking(
      id,
      req.user._id,
      Number(rating)
    );

    res.status(200).json({
      status: "success",
      data: booking
    });

  } catch (err) {
    next(err);
  }
};
