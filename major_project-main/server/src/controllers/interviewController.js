import { Interview } from '../models/Interview.js';
import { InterviewResult } from '../models/InterviewResult.js';
import { Submission } from '../models/Submission.js';
import { generateFinalReport } from '../services/aiService.js';
import { v4 as uuidv4 } from 'uuid';

const inMemoryInterviews = [
  {
    _id: 'int_demo_101',
    title: 'Senior React Developer Round',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex.rivera@example.com',
    role: 'Full Stack',
    time: 'Now Live',
    roomId: 'demo-101',
    status: 'Live',
    scheduledAt: new Date().toISOString(),
    durationMinutes: 45,
    problemTitle: 'Two Sum',
    problems: ['Two Sum']
  },
  {
    _id: 'int_demo_102',
    title: 'Backend Node.js & Docker Evaluation',
    candidateName: 'Jordan Lee',
    candidateEmail: 'jordan.lee@example.com',
    role: 'Backend Engineer',
    time: 'Today, 4:00 PM',
    roomId: 'demo-102',
    status: 'Scheduled',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    durationMinutes: 45,
    problemTitle: 'Valid Parentheses',
    problems: ['Valid Parentheses']
  }
];

export const createInterview = async (req, res, next) => {
  try {
    const {
      title,
      type,
      candidateName,
      candidateEmail,
      role,
      problemTitle,
      problemId,
      problems,
      scheduledAt,
      durationMinutes,
    } = req.body;
    const roomId = `room-${uuidv4().substring(0, 8)}`;

    const newInterview = {
      _id: 'int_' + Date.now(),
      title: title || 'Technical Evaluation Round',
      type: type || 'one-to-one',
      interviewerId: req.user?._id || 'i1',
      candidateName: candidateName || (candidateEmail ? candidateEmail.split('@')[0] : 'Alex Rivera'),
      candidateEmail: candidateEmail || 'candidate@example.com',
      role: role || 'Software Developer',
      problemTitle: problemTitle || 'Two Sum',
      problems: problems || [],
      roomId,
      status: 'Scheduled',
      time: scheduledAt ? new Date(scheduledAt).toLocaleString() : 'Scheduled',
      scheduledAt: scheduledAt || new Date().toISOString(),
      durationMinutes: durationMinutes || 45,
    };

    try {
      const dbRecord = await Interview.create({
        title: newInterview.title,
        type: newInterview.type,
        interviewerId: req.user?._id && req.user._id !== 'i1' ? req.user._id : null,
        candidateId: req.user?._id || '661a00000000000000000001',
        roomId,
        scheduledAt: newInterview.scheduledAt,
        durationMinutes: newInterview.durationMinutes,
        problems: newInterview.problems,
      });
      newInterview._id = dbRecord._id.toString();
    } catch (dbErr) {
      console.warn('[Interview Controller] DB save fallback to memory store.');
    }

    inMemoryInterviews.unshift(newInterview);
    res.status(201).json({ success: true, data: newInterview });
  } catch (error) {
    next(error);
  }
};

export const getUserInterviews = async (req, res, next) => {
  try {
    let dbInterviews = [];
    try {
      const userId = req.user?._id || req.user?.id;
      dbInterviews = await Interview.find({
        $or: [{ candidateId: userId }, { interviewerId: userId }],
      })
        .populate('problemId', 'title slug difficulty')
        .populate('candidateId', 'name email avatar')
        .populate('interviewerId', 'name email avatar')
        .sort({ scheduledAt: -1 });
    } catch (e) {
      dbInterviews = [];
    }

    const combined = [...inMemoryInterviews, ...dbInterviews];
    const unique = Array.from(
      new Map(combined.map((item) => [item.roomId || item._id?.toString(), item])).values()
    );

    res.json({ success: true, count: unique.length, data: unique });
  } catch (error) {
    res.json({ success: true, count: inMemoryInterviews.length, data: inMemoryInterviews });
  }
};

export const getInterviewByRoomId = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    let interview = null;

    try {
      interview = await Interview.findOne({ roomId })
        .populate('problemId')
        .populate('candidateId', 'name email avatar title')
        .populate('interviewerId', 'name email avatar title');
    } catch (e) {
      interview = null;
    }

    if (!interview) {
      interview = inMemoryInterviews.find((i) => i.roomId === roomId);
    }

    if (!interview) {
      interview = {
        _id: 'mock_int_id',
        roomId,
        title: 'Senior Frontend Engineering Interview',
        type: roomId.includes('ai') ? 'ai-mock' : 'one-to-one',
        status: 'in-progress',
        durationMinutes: 45,
        candidateName: 'Demo Candidate',
        candidateId: { name: 'Demo Candidate', email: 'candidate@test.com' },
        interviewerId: { name: 'Tech Lead Interviewer', email: 'interviewer@test.com' },
        problemTitle: 'Two Sum',
        problems: ['Two Sum'],
      };
    }

    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';

const inMemoryResults = new Map();

export const endInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sessionScores, transcriptHistory, topic } = req.body || {};
    let interview = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      interview = await Interview.findById(id).catch(() => null);
    }
    if (!interview) {
      interview = inMemoryInterviews.find((i) => i.roomId === id || i._id === id);
    }

    if (interview && mongoose.Types.ObjectId.isValid(interview._id)) {
      interview.status = 'completed';
      interview.endedAt = new Date();
      await interview.save().catch(() => {});
    } else if (interview) {
      interview.status = 'completed';
    }

    let submissions = [];
    if (mongoose.Types.ObjectId.isValid(id)) {
      submissions = await Submission.find({ interviewId: id }).catch(() => []);
    }

    const reportData = await generateFinalReport({
      interview: interview || { type: 'one-to-one' },
      submissions,
      sessionScores: sessionScores || [],
      transcriptHistory: transcriptHistory || [],
      topic: topic || 'React.js',
    });

    let result = null;
    if (mongoose.Types.ObjectId.isValid(id) && mongoose.Types.ObjectId.isValid(req.user?._id)) {
      try {
        result = await InterviewResult.create({
          interviewId: id,
          candidateId: interview ? interview.candidateId : req.user._id,
          interviewerId: interview ? interview.interviewerId : null,
          ...reportData,
        });
      } catch (e) {
        result = null;
      }
    }

    if (!result) {
      result = {
        _id: 'res_' + Date.now(),
        interviewId: id,
        candidateId: req.user?._id || 'c1',
        ...reportData,
      };
    }

    inMemoryResults.set(id, result);
    inMemoryResults.set(result._id, result);

    res.json({
      success: true,
      message: 'Interview completed and AI evaluation scorecard generated successfully.',
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewReport = async (req, res, next) => {
  try {
    const { interviewId } = req.params;
    let result = null;

    if (inMemoryResults.has(interviewId)) {
      result = inMemoryResults.get(interviewId);
    } else if (mongoose.Types.ObjectId.isValid(interviewId)) {
      try {
        result = await InterviewResult.findOne({ interviewId }).populate('interviewId');
      } catch (e) {
        result = null;
      }
    }

    if (!result) {
      const reportData = await generateFinalReport({
        interview: { type: 'one-to-one' },
        submissions: [],
      });
      result = {
        _id: interviewId || 'res_demo',
        interviewId,
        candidateId: req.user?._id || 'c1',
        ...reportData,
      };
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
