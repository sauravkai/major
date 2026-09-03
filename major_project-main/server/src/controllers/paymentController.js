import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { PLANS, getPlan } from '../config/plans.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import {
  createRazorpayOrder,
  fetchRazorpayPayment,
  isRazorpayConfigured,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from '../services/razorpayService.js';

/**
 * The auth middleware falls back to demo identities that have no database row,
 * so paid actions require a real persisted account.
 */
const resolveAccount = async (req) => {
  if (!req.user || !mongoose.isValidObjectId(req.user._id)) return null;
  return User.findById(req.user._id);
};

const activateSubscription = async (user, plan, paymentId) => {
  const now = Date.now();
  const activeUntil = user.subscription?.currentPeriodEnd;
  const start = activeUntil && activeUntil.getTime() > now ? activeUntil.getTime() : now;

  user.subscription = {
    plan: plan.plan,
    status: 'active',
    billingCycle: plan.billingCycle,
    currentPeriodEnd: new Date(start + plan.durationDays * 24 * 60 * 60 * 1000),
    lastPaymentId: paymentId,
  };
  await user.save();
};

export const getPlans = async (req, res) => {
  res.json({
    success: true,
    data: {
      plans: Object.values(PLANS),
      keyId: config.razorpayKeyId,
      enabled: isRazorpayConfigured(),
    },
  });
};

export const createOrder = async (req, res, next) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Payments are not configured on this server.',
      });
    }

    const plan = getPlan(req.body.planId);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Unknown plan' });
    }

    const account = await resolveAccount(req);
    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Sign in with a registered account to purchase a plan.',
      });
    }

    const order = await createRazorpayOrder({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `rcpt_${account._id}_${Date.now()}`.slice(0, 40),
      notes: { planId: plan.id, userId: account._id.toString() },
    });

    await Payment.create({
      user: account._id,
      planId: plan.id,
      billingCycle: plan.billingCycle,
      amount: plan.amount,
      currency: plan.currency,
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: config.razorpayKeyId,
        plan,
        customer: { name: account.name, email: account.email },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;

    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const account = await resolveAccount(req);
    if (!account || !payment.user.equals(account._id)) {
      return res.status(403).json({ success: false, message: 'Order does not belong to this account' });
    }

    if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
      payment.status = 'failed';
      payment.failureReason = 'Signature verification failed';
      await payment.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Confirm with Razorpay that the payment really was captured for this order and amount.
    const remote = await fetchRazorpayPayment(paymentId);
    if (
      remote.order_id !== orderId ||
      remote.amount !== payment.amount ||
      !['captured', 'authorized'].includes(remote.status)
    ) {
      payment.status = 'failed';
      payment.failureReason = `Unexpected payment state: ${remote.status}`;
      await payment.save();
      return res.status(400).json({ success: false, message: 'Payment could not be confirmed' });
    }

    if (payment.status !== 'paid') {
      payment.status = 'paid';
      payment.razorpayPaymentId = paymentId;
      await payment.save();
      await activateSubscription(account, getPlan(payment.planId), paymentId);
    }

    res.json({ success: true, data: { subscription: account.subscription } });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const account = await resolveAccount(req);
    if (!account) {
      return res.json({ success: true, data: { plan: 'free', status: 'inactive' } });
    }
    res.json({ success: true, data: account.subscription });
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const account = await resolveAccount(req);
    if (!account) return res.json({ success: true, data: [] });

    const payments = await Payment.find({ user: account._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

/**
 * Razorpay webhook. Mounted with a raw body parser so the signature can be checked
 * against the exact bytes Razorpay signed.
 */
export const handleWebhook = async (req, res, next) => {
  try {
    const rawBody = req.body instanceof Buffer ? req.body : Buffer.from('');
    if (!verifyWebhookSignature({ rawBody, signature: req.headers['x-razorpay-signature'] })) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const entity = event.payload?.payment?.entity;
    if (!entity) return res.json({ success: true });

    const payment = await Payment.findOne({ razorpayOrderId: entity.order_id });
    if (!payment) return res.json({ success: true });

    if (event.event === 'payment.captured' && payment.status !== 'paid') {
      payment.status = 'paid';
      payment.razorpayPaymentId = entity.id;
      await payment.save();

      const account = await User.findById(payment.user);
      if (account) await activateSubscription(account, getPlan(payment.planId), entity.id);
    } else if (event.event === 'payment.failed') {
      payment.status = 'failed';
      payment.failureReason = entity.error_description || 'Payment failed';
      await payment.save();
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
