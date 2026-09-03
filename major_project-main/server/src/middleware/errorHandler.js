import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Server Error';
  let expose = Boolean(err.expose) || status < 500;

  if (err.name === 'CastError') {
    status = 404;
    message = 'Resource not found';
    expose = true;
  } else if (err.code === 11000) {
    status = 409;
    message = 'A record with that value already exists';
    expose = true;
  } else if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    expose = true;
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request payload is too large';
    expose = true;
  }

  logger.error('Request failed', {
    method: req.method,
    path: req.originalUrl,
    status,
    error: err.message,
    stack: config.isProduction ? undefined : err.stack,
  });

  res.status(status).json({
    success: false,
    message: expose ? message : 'Something went wrong. Please try again later.',
  });
};
