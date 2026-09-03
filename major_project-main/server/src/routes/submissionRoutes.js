import express from 'express';
import { runCode, submitCode, getSubmissions } from '../controllers/submissionController.js';
import { protect } from '../middleware/auth.js';
import { codeRunLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/run', protect, codeRunLimiter, runCode);
router.post('/submit', protect, codeRunLimiter, submitCode);
router.get('/my', protect, getSubmissions);

export default router;
