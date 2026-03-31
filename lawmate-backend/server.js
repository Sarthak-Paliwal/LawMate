require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const app = require('./src/app');
const chatService = require('./src/services/chatService');
const Booking = require('./src/models/Booking');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");

    // Create HTTP server and attach Socket.io
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || '*',
        credentials: true,
      },
    });

    // Socket.io authentication middleware
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id?.toString(); // ensure plain string
        next();
      } catch (err) {
        console.error(`❌ Socket auth failed: ${err.message}`);
        next(new Error('Invalid token'));
      }
    });

    // Socket.io connection handler
    io.on('connection', (socket) => {
      console.log(`🔌 User connected: ${socket.userId} (socket.id=${socket.id})`);

      // Join a booking chat room
      socket.on('join-room', async (bookingId) => {
        try {
          const booking = await Booking.findById(bookingId).lean();
          if (!booking) {
            console.log(`❌ join-room: booking ${bookingId} not found`);
            return;
          }

          const bookingUserId = booking.user.toString();
          const bookingAdvocateId = booking.advocate.toString();
          console.log(`🔍 join-room check: socket.userId=${socket.userId}, booking.user=${bookingUserId}, booking.advocate=${bookingAdvocateId}`);

          const isParticipant =
            bookingUserId === socket.userId ||
            bookingAdvocateId === socket.userId;

          if (!isParticipant) {
            console.log(`❌ join-room DENIED: ${socket.userId} is NOT a participant of ${bookingId}`);
            return;
          }

          socket.join(bookingId);
          const roomSockets = await io.in(bookingId).fetchSockets();
          console.log(`📌 User ${socket.userId} joined room ${bookingId} (socket.id=${socket.id}). Room now has ${roomSockets.length} socket(s): [${roomSockets.map(s => s.userId).join(', ')}]`);
        } catch (err) {
          console.error('Join room error:', err.message);
        }
      });

      // Leave a chat room
      socket.on('leave-room', (bookingId) => {
        socket.leave(bookingId);
      });

      // Send a message
      socket.on('send-message', async ({ bookingId, text }) => {
        try {
          if (!text || !text.trim()) return;

          console.log(`📨 send-message from ${socket.userId} (socket.id=${socket.id}) to room ${bookingId}: "${text.substring(0, 50)}"`);

          const message = await chatService.saveMessage(
            bookingId,
            socket.userId,
            text
          );

          // Log room membership before broadcast
          const roomSockets = await io.in(bookingId).fetchSockets();
          console.log(`📢 Broadcasting to room ${bookingId} — ${roomSockets.length} socket(s) in room: [${roomSockets.map(s => `${s.userId}(${s.id})`).join(', ')}]`);

          // Broadcast to all participants in the room
          io.to(bookingId).emit('new-message', message);
        } catch (err) {
          console.error('Send message error:', err.message);
          socket.emit('message-error', { error: err.message });
        }
      });

      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.userId}`);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 LawMate server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
