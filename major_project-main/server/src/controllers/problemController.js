import mongoose from 'mongoose';
import { CodingProblem } from '../models/CodingProblem.js';

/** Hidden test cases are the grading oracle; they must never reach a candidate. */
const publicProblem = (problem, viewer) => {
  const plain = typeof problem.toObject === 'function' ? problem.toObject() : { ...problem };
  const privileged = viewer?.role === 'admin' || viewer?.role === 'interviewer';
  if (!privileged) {
    plain.testCases = (plain.testCases || []).filter((testCase) => !testCase.isHidden);
  }
  return plain;
};

export const getProblems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.category) filter.category = req.query.category;

    const problems = await CodingProblem.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: problems.length,
      data: problems.map((problem) => publicProblem(problem, req.user)),
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemBySlug = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findOne({ slug: String(req.params.slug) });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    res.json({ success: true, data: publicProblem(problem, req.user) });
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const problem = await CodingProblem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    res.json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const problem = await CodingProblem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    res.json({ success: true, message: 'Problem deleted successfully' });
  } catch (error) {
    next(error);
  }
};
