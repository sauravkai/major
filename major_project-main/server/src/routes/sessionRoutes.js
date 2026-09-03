import express from 'express';
import { getUserSessions, revokeSession } from '../controllers/sessionController.js';
import { protect, requirePersistedAccount } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, requirePersistedAccount, getUserSessions);
router.put('/:sessionId/revoke', protect, requirePersistedAccount, revokeSession);

export default router;
