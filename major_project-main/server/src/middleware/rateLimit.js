import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

const build = (max, windowMs, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.isTest,
    message: { success: false, message },
  });

export const apiLimiter = build(config.apiRateLimitMax, 60 * 1000, 'Too many requests, please slow down');

export const authLimiter = build(
  config.authRateLimitMax,
  15 * 60 * 1000,
  'Too many authentication attempts, please try again later'
);

export const codeRunLimiter = build(
  config.codeRunRateLimitMax,
  60 * 1000,
  'Too many code executions, please wait a moment'
);
