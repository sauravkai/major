import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

const unauthorized = (res, message = 'Authentication required') =>
  res.status(401).json({ success: false, message });

const bearerToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token || null;
};

/**
 * Resolve the caller from a signed token. Demo tokens carry no database row and
 * are only honoured while DEMO_MODE is on.
 */
export const resolveUserFromToken = async (token) => {
  const decoded = jwt.verify(token, config.jwtSecret);

  if (decoded.demo) {
    if (!config.demoMode) return null;
    return {
      _id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      isDemo: true,
    };
  }

  if (!mongoose.isValidObjectId(decoded.id)) return null;
  const user = await User.findById(decoded.id).select('-password');
  return user || null;
};

export const protect = async (req, res, next) => {
  const token = bearerToken(req);
  if (!token) return unauthorized(res);

  try {
    const user = await resolveUserFromToken(token);
    if (!user) return unauthorized(res, 'Session is no longer valid');
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return unauthorized(res, 'Session expired, please sign in again');
    if (error.name === 'JsonWebTokenError') return unauthorized(res, 'Invalid authentication token');
    return next(error);
  }
};

/** Attach the caller when a valid token is present, but let anonymous requests through. */
export const optionalAuth = async (req, res, next) => {
  const token = bearerToken(req);
  if (!token) return next();

  try {
    const user = await resolveUserFromToken(token);
    if (user) req.user = user;
  } catch {
    // An unusable token is treated as an anonymous request on public routes.
  }
  return next();
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return unauthorized(res);
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action',
    });
  }
  return next();
};

/** Callers backed by a real database row; demo identities cannot own persisted resources. */
export const requirePersistedAccount = (req, res, next) => {
  if (!req.user) return unauthorized(res);
  if (req.user.isDemo || !mongoose.isValidObjectId(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Sign in with a registered account to perform this action',
    });
  }
  return next();
};
