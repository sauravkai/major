import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';

/** One structured line per request; no bodies or headers are logged. */
export const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || randomUUID();
  const startedAt = process.hrtime.bigint();

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    logger[res.statusCode >= 500 ? 'error' : 'info']('request', {
      requestId,
      method: req.method,
      path: req.originalUrl.split('?')[0],
      status: res.statusCode,
      durationMs: Math.round(durationMs),
    });
  });

  next();
};
