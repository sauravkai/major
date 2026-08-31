import { Session } from '../models/Session.js';

export const createSession = async (req, res, next) => {
  try {
    const { userId, type, ipAddress, location, device, userAgent } = req.body;

    // Mark all previous active sessions as inactive for this user
    if (type === 'login') {
      await Session.updateMany(
        { userId, isActive: true },
        { isActive: false }
      );
    }

    const session = await Session.create({
      userId,
      type,
      ipAddress: ipAddress || req.ip || '',
      location: location || '',
      device: device || '',
      userAgent: userAgent || req.headers['user-agent'] || '',
      isActive: type === 'login',
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    
    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?._id || req.user?.id;

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId },
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.json({
      success: true,
      message: 'Session revoked successfully',
      session,
    });
  } catch (error) {
    next(error);
  }
};
