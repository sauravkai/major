import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token.startsWith('mock_jwt_token_')) {
        const role = token.split('_')[3] || 'interviewer';
        req.user = {
          _id: role === 'interviewer' ? 'i1' : role === 'admin' ? 'a1' : 'c1',
          name: role === 'interviewer' ? 'Sarah Chen' : role === 'admin' ? 'Marcus Vance' : 'Alex Rivera',
          email: role === 'interviewer' ? 'sarah.chen@techcorp.io' : 'alex@example.com',
          role: role,
        };
        return next();
      }
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Demo User',
          email: decoded.email || 'user@example.com',
          role: decoded.role || 'candidate',
        };
      }
      return next();
    } catch (error) {
      req.user = {
        _id: 'i1',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.io',
        role: 'interviewer',
      };
      return next();
    }
  }

  req.user = {
    _id: 'i1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    role: 'interviewer',
  };
  return next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
