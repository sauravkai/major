import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { config } from '../config/env.js';
import { getDemoUser } from '../config/demo.js';
import { verifyGoogleIdToken } from '../services/googleAuthService.js';
import { logger } from '../utils/logger.js';
import {
  ValidationError,
  optionalString,
  requireEmail,
  requirePassword,
  requireSelfAssignableRole,
  requireString,
} from '../utils/validation.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpire });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  title: user.title,
  bio: user.bio,
  skills: user.skills,
  subscription: user.subscription,
  stats: user.stats,
});

const recordLoginSession = async (req, user) => {
  try {
    await Session.updateMany({ userId: user._id, isActive: true }, { isActive: false });
    await Session.create({
      userId: user._id,
      type: 'login',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
      device: req.headers['user-agent'] || 'Unknown Device',
      isActive: true,
    });
  } catch (error) {
    logger.warn('Could not record login session', { error: error.message });
  }
};

export const register = async (req, res, next) => {
  try {
    const name = requireString(req.body?.name, 'name', { min: 2, max: 80 });
    const email = requireEmail(req.body?.email);
    const password = requirePassword(req.body?.password);
    const role = requireSelfAssignableRole(req.body?.role);

    if (await User.exists({ email })) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role });
    await recordLoginSession(req, user);

    res.status(201).json({ success: true, token: generateToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const email = requireEmail(req.body?.email);
    const password = requireString(req.body?.password, 'password', { max: 128 });

    const user = await User.findOne({ email }).select('+password');
    // Same response for unknown accounts and wrong passwords to avoid user enumeration.
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await recordLoginSession(req, user);
    res.json({ success: true, token: generateToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

/**
 * Password-less sign-in for the seeded showcase roles. Disabled unless DEMO_MODE is on.
 */
export const demoLogin = async (req, res, next) => {
  try {
    if (!config.demoMode) {
      return res.status(404).json({ success: false, message: 'Demo sign-in is disabled on this server' });
    }

    const demoUser = getDemoUser(req.body?.role);
    if (!demoUser) {
      return res.status(400).json({ success: false, message: 'Unknown demo role' });
    }

    const token = jwt.sign(
      { id: demoUser.id, role: demoUser.role, name: demoUser.name, email: demoUser.email, demo: true },
      config.jwtSecret,
      { expiresIn: '12h' }
    );

    res.json({ success: true, token, user: { ...demoUser, isDemo: true } });
  } catch (error) {
    next(error);
  }
};

/**
 * Google sign-in. The client sends the ID token issued by Google Identity Services;
 * the server verifies it before trusting any profile field.
 */
export const googleAuth = async (req, res, next) => {
  try {
    if (!config.googleClientId) {
      return res.status(503).json({ success: false, message: 'Google sign-in is not configured on this server' });
    }

    const idToken = requireString(req.body?.credential ?? req.body?.idToken, 'credential', { max: 4096 });
    const profile = await verifyGoogleIdToken(idToken);
    const role = requireSelfAssignableRole(req.body?.role);

    let user = await User.findOne({ email: profile.email });
    let created = false;

    if (!user) {
      user = await User.create({
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        // Google accounts authenticate through Google; this password is never usable.
        password: `google:${crypto.randomUUID()}`,
        role,
        avatar: profile.picture || '',
      });
      created = true;
    }

    await recordLoginSession(req, user);
    res.status(created ? 201 : 200).json({ success: true, token: generateToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (req.user.isDemo) return res.json({ success: true, user: req.user });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'Account not found' });

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Demo accounts cannot be modified' });
    }

    const updates = {
      name: optionalString(req.body?.name, 'name', { min: 2, max: 80 }),
      title: optionalString(req.body?.title, 'title', { max: 120 }),
      bio: optionalString(req.body?.bio, 'bio', { max: 1000 }),
      location: optionalString(req.body?.location, 'location', { max: 120 }),
      website: optionalString(req.body?.website, 'website', { max: 200 }),
      avatar: optionalString(req.body?.avatar, 'avatar', { max: 2048 }),
    };

    if (req.body?.skills !== undefined) {
      if (!Array.isArray(req.body.skills)) throw new ValidationError('skills must be an array');
      updates.skills = req.body.skills.slice(0, 50).map((skill) => requireString(skill, 'skill', { max: 40 }));
    }

    if (req.body?.socialLinks !== undefined) {
      const links = req.body.socialLinks;
      if (typeof links !== 'object' || links === null) throw new ValidationError('socialLinks must be an object');
      updates.socialLinks = {
        github: optionalString(links.github, 'socialLinks.github', { max: 200 }) || '',
        linkedin: optionalString(links.linkedin, 'socialLinks.linkedin', { max: 200 }) || '',
        twitter: optionalString(links.twitter, 'socialLinks.twitter', { max: 200 }) || '',
      };
    }

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'Account not found' });

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Demo accounts cannot be modified' });
    }

    const currentPassword = requireString(req.body?.currentPassword, 'currentPassword', { max: 128 });
    const newPassword = requirePassword(req.body?.newPassword, 'newPassword');

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'Account not found' });

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    // Existing sessions belong to the old credentials.
    await Session.updateMany({ userId: user._id, isActive: true }, { isActive: false }).catch(() => {});

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Demo accounts cannot be modified' });
    }

    const avatar = requireString(req.body?.avatar, 'avatar', { max: 2048 });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'Account not found' });

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user.isDemo && mongoose.isValidObjectId(req.user._id)) {
      await Session.updateMany({ userId: req.user._id, isActive: true }, { isActive: false });
    }
    res.json({ success: true, message: 'Signed out' });
  } catch (error) {
    next(error);
  }
};
