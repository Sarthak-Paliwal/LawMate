const Message = require('../models/Message');
const Booking = require('../models/Booking');

/* -------------------- Get Messages for a Booking -------------------- */

exports.getMessages = async (bookingId, userId) => {
  // Verify the user is a participant
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const e = new Error("Booking not found");
    e.statusCode = 404;
    throw e;
  }

  const isParticipant =
    booking.user.toString() === userId.toString() ||
    booking.advocate.toString() === userId.toString();

  if (!isParticipant) {
    const e = new Error("You are not a participant of this booking");
    e.statusCode = 403;
    throw e;
  }

  if (!['accepted', 'completed'].includes(booking.status)) {
    const e = new Error("Chat is only available for accepted or completed bookings");
    e.statusCode = 400;
    throw e;
  }

  const messages = await Message.find({ booking: bookingId })
    .populate('sender', 'name email role')
    .sort({ createdAt: 1 })
    .lean();

  return messages;
};

/* -------------------- Save a Message -------------------- */

exports.saveMessage = async (bookingId, senderId, text) => {
  const message = await Message.create({
    booking: bookingId,
    sender: senderId,
    text: text.trim(),
  });

  return message.populate('sender', 'name email role');
};
