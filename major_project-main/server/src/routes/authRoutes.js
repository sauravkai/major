import express from 'express';
import {
  changePassword,
  demoLogin,
  getMe,
  googleAuth,
  login,
  logout,
  register,
  updateProfile,
  uploadAvatar,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.post('/demo', authLimiter, demoLogin);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', authLimiter, protect, changePassword);
router.put('/avatar', protect, uploadAvatar);

export default router;
