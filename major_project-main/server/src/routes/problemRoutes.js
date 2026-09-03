import express from 'express';
import {
  getProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getProblems);
router.get('/:slug', optionalAuth, getProblemBySlug);
router.post('/', protect, authorize('admin', 'interviewer'), createProblem);
router.put('/:id', protect, authorize('admin', 'interviewer'), updateProblem);
router.delete('/:id', protect, authorize('admin'), deleteProblem);

export default router;
