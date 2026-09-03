import mongoose from 'mongoose';
import { runCodeService } from '../services/codeRunnerService.js';
import { CodingProblem } from '../models/CodingProblem.js';
import { Submission } from '../models/Submission.js';
import { ValidationError, requireString } from '../utils/validation.js';

const findProblem = async (problemId) => {
  if (!problemId) return null;
  if (mongoose.isValidObjectId(problemId)) {
    const byId = await CodingProblem.findById(problemId);
    if (byId) return byId;
  }
  return CodingProblem.findOne({ slug: String(problemId) });
};

/** Run the visible test cases only; hidden cases stay reserved for submissions. */
export const runCode = async (req, res, next) => {
  try {
    const code = requireString(req.body?.code, 'code', { max: 200000 });
    const language = requireString(req.body?.language || 'javascript', 'language', { max: 20 });

    const problem = await findProblem(req.body?.problemId);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    const testCases = (problem.testCases || []).filter((testCase) => !testCase.isHidden);
    const result = await runCodeService({ code, language, testCases });

    res.json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

export const submitCode = async (req, res, next) => {
  try {
    const code = requireString(req.body?.code, 'code', { max: 200000 });
    const language = requireString(req.body?.language || 'javascript', 'language', { max: 20 });
    const { interviewId } = req.body || {};

    if (interviewId !== undefined && interviewId !== null && !mongoose.isValidObjectId(interviewId)) {
      throw new ValidationError('interviewId must be a valid id');
    }

    const problem = await findProblem(req.body?.problemId);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    const result = await runCodeService({ code, language, testCases: problem.testCases || [] });

    let submission = null;
    if (!req.user.isDemo && mongoose.isValidObjectId(req.user._id)) {
      submission = await Submission.create({
        userId: req.user._id,
        problemId: problem._id,
        interviewId: interviewId || null,
        code,
        language,
        status: result.status,
        passCount: result.passCount,
        totalCount: result.totalCount,
        executionTimeMs: result.executionTimeMs,
        testResults: result.testResults,
      });
    }

    res.status(201).json({ success: true, submission, result });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    if (req.user.isDemo) return res.json({ success: true, count: 0, data: [] });

    const submissions = await Submission.find({ userId: req.user._id })
      .populate('problemId', 'title difficulty slug')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    next(error);
  }
};
