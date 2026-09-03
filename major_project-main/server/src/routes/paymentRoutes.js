import express from 'express';
import {
  createOrder,
  getPaymentHistory,
  getPlans,
  getSubscription,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/subscription', protect, getSubscription);
router.get('/history', protect, getPaymentHistory);

export default router;
