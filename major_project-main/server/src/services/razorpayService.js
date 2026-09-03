import crypto from 'crypto';
import axios from 'axios';
import { config } from '../config/env.js';

const RAZORPAY_API = 'https://api.razorpay.com/v1';

export const isRazorpayConfigured = () =>
  Boolean(config.razorpayKeyId && config.razorpayKeySecret);

const authHeader = () => ({
  username: config.razorpayKeyId,
  password: config.razorpayKeySecret,
});

/**
 * Create a Razorpay order. `amount` is in the smallest currency unit (paise for INR).
 */
export const createRazorpayOrder = async ({ amount, currency, receipt, notes }) => {
  const { data } = await axios.post(
    `${RAZORPAY_API}/orders`,
    { amount, currency, receipt, notes, payment_capture: 1 },
    { auth: authHeader() }
  );
  return data;
};

export const fetchRazorpayPayment = async (paymentId) => {
  const { data } = await axios.get(`${RAZORPAY_API}/payments/${paymentId}`, {
    auth: authHeader(),
  });
  return data;
};

const safeCompare = (a, b) => {
  const expected = Buffer.from(a, 'utf8');
  const actual = Buffer.from(b, 'utf8');
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
};

/**
 * Verify the checkout handler signature: HMAC-SHA256(order_id|payment_id, key_secret).
 */
export const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  if (!signature) return false;
  const expected = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return safeCompare(expected, signature);
};

/**
 * Verify a webhook delivery: HMAC-SHA256(raw request body, webhook_secret).
 */
export const verifyWebhookSignature = ({ rawBody, signature }) => {
  if (!signature || !config.razorpayWebhookSecret) return false;
  const expected = crypto
    .createHmac('sha256', config.razorpayWebhookSecret)
    .update(rawBody)
    .digest('hex');
  return safeCompare(expected, signature);
};
