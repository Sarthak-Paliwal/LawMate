const fs = require('fs');

const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler caught:", err);
  try { fs.appendFileSync('error.log', new Date().toISOString() + ' - ' + err.stack + '\n'); } catch (e) {}
  
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /* -------------------- Mongoose Bad ObjectId -------------------- */
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  /* -------------------- Mongoose Duplicate Key -------------------- */
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  /* -------------------- Mongoose Validation Error -------------------- */
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(err.needsEmailVerification !== undefined && { needsEmailVerification: err.needsEmailVerification }),
    ...(err.needsPhoneVerification !== undefined && { needsPhoneVerification: err.needsPhoneVerification }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = errorHandler;
