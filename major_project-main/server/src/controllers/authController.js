import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'candidate',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        stats: user.stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        stats: user.stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({
        success: true,
        user: req.user,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: true,
        user: req.user,
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: true, user: req.user });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, title, bio, skills, avatar } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const updated = { ...req.user, name, title, bio, skills, avatar };
      return res.json({ success: true, user: updated });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, title, bio, skills, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: user || req.user });
  } catch (error) {
    next(error);
  }
};
