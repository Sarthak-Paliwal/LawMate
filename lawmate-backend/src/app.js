const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* -------------------- Core Middleware -------------------- */

// Enable CORS (configure CLIENT_URL in .env for production)
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

/* -------------------- API Routes -------------------- */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));
app.use('/api/legal-acts', require('./routes/legalActRoutes'));
app.use('/api/advocates', require('./routes/advocateRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

/* -------------------- Health Check -------------------- */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "LawMate API is running"
  });
});

/* -------------------- 404 Handler -------------------- */

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found"
  });
});

/* -------------------- Global Error Handler -------------------- */

app.use(errorHandler);

module.exports = app;
