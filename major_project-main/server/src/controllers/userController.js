import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Interview } from '../models/Interview.js';
import { CodingProblem } from '../models/CodingProblem.js';
import { Submission } from '../models/Submission.js';
import { requireRole } from '../utils/validation.js';

export const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(),
    ]);

    res.json({ success: true, count: users.length, total, page, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = requireRole(req.body?.role);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (String(req.user._id) === id && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot remove your own admin role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProblems, totalInterviews, totalSubmissions] = await Promise.all([
      User.countDocuments(),
      CodingProblem.countDocuments(),
      Interview.countDocuments(),
      Submission.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalProblems, totalInterviews, totalSubmissions },
    });
  } catch (error) {
    next(error);
  }
};
