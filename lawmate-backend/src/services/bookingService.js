const Booking = require('../models/Booking');
const User = require('../models/User');

/* -------------------- Create Booking -------------------- */

exports.create = async (userId, advocateId, body) => {
  const { message, scheduledAt } = body || {};

  if (!advocateId) {
    const e = new Error("Advocate ID is required");
    e.statusCode = 400;
    throw e;
  }

  if (userId.toString() === advocateId.toString()) {
    const e = new Error("You cannot book yourself");
    e.statusCode = 400;
    throw e;
  }

  const advocate = await User.findById(advocateId);

  if (!advocate || advocate.role !== 'advocate') {
    const e = new Error("Invalid advocate selected");
    e.statusCode = 400;
    throw e;
  }

  const booking = await Booking.create({
    user: userId,
    advocate: advocateId,
    message: message || '',
    scheduledAt: scheduledAt || undefined,
  });

  return booking.populate([
    { path: 'user', select: 'name email phone' },
    { path: 'advocate', select: 'name email phone' }
  ]);
};

/* -------------------- Get User Bookings -------------------- */

exports.getUserBookings = async (userId) => {
  return Booking.find({ user: userId })
    .populate('advocate', 'name email phone')
    .sort({ createdAt: -1 })
    .lean();
};

/* -------------------- Get Advocate Bookings -------------------- */

exports.getAdvocateBookings = async (advocateId) => {
  return Booking.find({ advocate: advocateId })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .lean();
};

/* -------------------- Propose Appointment Slots -------------------- */

exports.proposeSlots = async (bookingId, advocateId, slots) => {
  if (!slots || !Array.isArray(slots) || slots.length < 1 || slots.length > 3) {
    const e = new Error("Please provide 1 to 3 appointment slots");
    e.statusCode = 400;
    throw e;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    advocate: advocateId
  });

  if (!booking) {
    const e = new Error("Booking not found");
    e.statusCode = 404;
    throw e;
  }

  if (booking.status !== 'pending') {
    const e = new Error("Slots can only be proposed for pending bookings");
    e.statusCode = 400;
    throw e;
  }

  booking.proposedSlots = slots.map(s => ({
    date: new Date(s.date),
    time: s.time
  }));
  booking.status = 'slots_proposed';
  await booking.save();

  return booking;
};

/* -------------------- Confirm Appointment Slot -------------------- */

exports.confirmSlot = async (bookingId, userId, slotIndex) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId
  });

  if (!booking) {
    const e = new Error("Booking not found");
    e.statusCode = 404;
    throw e;
  }

  if (booking.status !== 'slots_proposed') {
    const e = new Error("No slots to confirm for this booking");
    e.statusCode = 400;
    throw e;
  }

  if (slotIndex < 0 || slotIndex >= booking.proposedSlots.length) {
    const e = new Error("Invalid slot selection");
    e.statusCode = 400;
    throw e;
  }

  const chosen = booking.proposedSlots[slotIndex];
  booking.confirmedSlot = { date: chosen.date, time: chosen.time };
  booking.status = 'accepted';
  await booking.save();

  return booking;
};

/* -------------------- Update Booking Status -------------------- */

exports.updateStatus = async (bookingId, advocateId, status) => {

  const allowedStatuses = ['rejected', 'completed'];

  if (!allowedStatuses.includes(status)) {
    const e = new Error("Invalid status. Use propose-slots to accept, or reject/complete.");
    e.statusCode = 400;
    throw e;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    advocate: advocateId
  });

  if (!booking) {
    const e = new Error("Booking not found");
    e.statusCode = 404;
    throw e;
  }

  if (booking.status === 'rejected') {
    const e = new Error("Rejected bookings cannot be modified");
    e.statusCode = 400;
    throw e;
  }

  if (booking.status === 'pending' && status !== 'rejected') {
    const e = new Error("Pending bookings can only be rejected here. Use propose-slots to accept.");
    e.statusCode = 400;
    throw e;
  }

  if (booking.status === 'accepted' && status !== 'completed') {
    const e = new Error("Accepted bookings can only be marked completed");
    e.statusCode = 400;
    throw e;
  }

  booking.status = status;
  await booking.save();

  return booking;
};

/* -------------------- Rate Booking -------------------- */
const AdvocateProfile = require('../models/AdvocateProfile');

exports.rateBooking = async (bookingId, userId, rating) => {
  if (rating < 1 || rating > 5) {
    const e = new Error("Rating must be between 1 and 5");
    e.statusCode = 400;
    throw e;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId
  });

  if (!booking) {
    const e = new Error("Booking not found");
    e.statusCode = 404;
    throw e;
  }

  if (booking.status !== 'completed') {
    const e = new Error("Only completed bookings can be rated");
    e.statusCode = 400;
    throw e;
  }

  booking.rating = rating;
  await booking.save();

  // Recalculate advocate's average rating
  const stats = await Booking.aggregate([
    { 
      $match: { 
        advocate: booking.advocate, 
        rating: { $exists: true, $ne: null } 
      } 
    },
    { 
      $group: { 
        _id: '$advocate', 
        averageRating: { $avg: '$rating' }, 
        count: { $sum: 1 } 
      } 
    }
  ]);

  if (stats.length > 0) {
    await AdvocateProfile.findOneAndUpdate(
      { user: booking.advocate },
      { 
        rating: Math.round(stats[0].averageRating * 10) / 10, 
        reviewCount: stats[0].count 
      }
    );
  }

  return booking;
};
