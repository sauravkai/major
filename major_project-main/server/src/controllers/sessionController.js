import { Session } from '../models/Session.js';

export const getUserSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (req, res, next) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.sessionId, userId: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, message: 'Session revoked successfully', session });
  } catch (error) {
    next(error);
  }
};
