const chatService = require('../services/chatService');

/* -------------------- Get Chat Messages -------------------- */

exports.getMessages = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const messages = await chatService.getMessages(bookingId, req.user._id);

    res.status(200).json({
      status: "success",
      data: messages
    });

  } catch (err) {
    next(err);
  }
};
