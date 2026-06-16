export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = null;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
    details = Object.keys(err.keyPattern);
  }

  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};