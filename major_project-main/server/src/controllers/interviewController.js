import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import { Interview } from '../models/Interview.js';
import { InterviewResult } from '../models/InterviewResult.js';
import { Submission } from '../models/Submission.js';
import { User } from '../models/User.js';
import { generateFinalReport } from '../services/aiService.js';
import { ValidationError, optionalString, requireEmail, requireString } from '../utils/validation.js';

const INTERVIEW_TYPES = ['one-to-one', 'ai-mock'];

const isParticipant = (interview, user) => {
  const userId = String(user._id);
  const ids = [interview.candidateId, interview.interviewerId]
    .map((value) => (value && value._id ? value._id : value))
    .filter(Boolean)
    .map(String);
  return ids.includes(userId) || user.role === 'admin';
};

export const createInterview = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Sign in with a registered account to schedule interviews' });
    }

    const type = req.body?.type || 'one-to-one';
    if (!INTERVIEW_TYPES.includes(type)) throw new ValidationError(`type must be one of: ${INTERVIEW_TYPES.join(', ')}`);

    const title = requireString(req.body?.title || 'Technical Evaluation Round', 'title', { max: 140 });
    const durationMinutes = Math.min(240, Math.max(5, Number.parseInt(req.body?.durationMinutes, 10) || 45));
    const scheduledAt = req.body?.scheduledAt ? new Date(req.body.scheduledAt) : new Date();
    if (Number.isNaN(scheduledAt.getTime())) throw new ValidationError('scheduledAt must be a valid date');

    let candidateId = req.user._id;
    let interviewerId = null;

    if (type === 'one-to-one') {
      if (req.user.role === 'candidate') {
        return res.status(403).json({ success: false, message: 'Only interviewers can schedule live interviews' });
      }
      const candidateEmail = requireEmail(req.body?.candidateEmail);
      const candidate = await User.findOne({ email: candidateEmail }).select('_id');
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'No registered candidate with that email address' });
      }
      candidateId = candidate._id;
      interviewerId = req.user._id;
    }

    const interview = await Interview.create({
      title,
      type,
      interviewerId,
      candidateId,
      problems: Array.isArray(req.body?.problems)
        ? req.body.problems.slice(0, 10).map((problem) => requireString(problem, 'problem', { max: 140 }))
        : [],
      problemId: mongoose.isValidObjectId(req.body?.problemId) ? req.body.problemId : null,
      roomId: `room-${randomUUID().slice(0, 8)}`,
      scheduledAt,
      durationMinutes,
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

export const getUserInterviews = async (req, res, next) => {
  try {
    if (req.user.isDemo) return res.json({ success: true, count: 0, data: [] });

    const interviews = await Interview.find({
      $or: [{ candidateId: req.user._id }, { interviewerId: req.user._id }],
    })
      .populate('problemId', 'title slug difficulty')
      .populate('candidateId', 'name email avatar')
      .populate('interviewerId', 'name email avatar')
      .sort({ scheduledAt: -1 })
      .limit(100);

    res.json({ success: true, count: interviews.length, data: interviews });
  } catch (error) {
    next(error);
  }
};

export const getInterviewByRoomId = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ roomId: String(req.params.roomId) })
      .populate('problemId')
      .populate('candidateId', 'name email avatar title')
      .populate('interviewerId', 'name email avatar title');

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (!isParticipant(interview, req.user)) {
      return res.status(403).json({ success: false, message: 'You are not a participant of this interview' });
    }

    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

export const endInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ success: false, message: 'Interview not found' });

    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (!isParticipant(interview, req.user)) {
      return res.status(403).json({ success: false, message: 'You are not a participant of this interview' });
    }

    interview.status = 'completed';
    interview.endedAt = new Date();
    await interview.save();

    const submissions = await Submission.find({ interviewId: interview._id });
    const reportData = await generateFinalReport({
      interview,
      submissions,
      sessionScores: Array.isArray(req.body?.sessionScores) ? req.body.sessionScores : [],
      transcriptHistory: Array.isArray(req.body?.transcriptHistory) ? req.body.transcriptHistory : [],
      topic: optionalString(req.body?.topic, 'topic', { max: 80 }) || 'React.js',
    });

    const result = await InterviewResult.findOneAndUpdate(
      { interviewId: interview._id },
      {
        interviewId: interview._id,
        candidateId: interview.candidateId,
        interviewerId: interview.interviewerId,
        ...reportData,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: 'Interview completed and evaluation scorecard generated.',
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewReport = async (req, res, next) => {
  try {
    const { interviewId } = req.params;
    if (!mongoose.isValidObjectId(interviewId)) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const result = await InterviewResult.findOne({ interviewId }).populate('interviewId');
    if (!result) return res.status(404).json({ success: false, message: 'Report not found' });

    const owners = [result.candidateId, result.interviewerId].filter(Boolean).map(String);
    if (!owners.includes(String(req.user._id)) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You cannot view this report' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
