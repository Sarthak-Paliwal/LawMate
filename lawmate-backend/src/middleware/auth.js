const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* -------------------- Protect Middleware -------------------- */

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const e = new Error('Not authorized, no token');
      e.statusCode = 401;
      throw e;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      const e = new Error('User not found');
      e.statusCode = 401;
      throw e;
    }

    req.user = user;
    next();

  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

/* -------------------- Role Middleware -------------------- */

const role = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const e = new Error('Not authorized');
      e.statusCode = 401;
      return next(e);
    }

    if (!roles.includes(req.user.role)) {
      const e = new Error('Access denied for this role');
      e.statusCode = 403;
      return next(e);
    }

    next();
  };
};

module.exports = { protect, role };
