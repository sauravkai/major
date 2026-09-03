/**
 * Subscription catalog. Amounts are in paise (Razorpay's smallest currency unit).
 */
export const PLANS = {
  pro_monthly: {
    id: 'pro_monthly',
    plan: 'pro',
    name: 'Pro Evaluator',
    billingCycle: 'monthly',
    amount: 149900,
    currency: 'INR',
    durationDays: 30,
  },
  pro_yearly: {
    id: 'pro_yearly',
    plan: 'pro',
    name: 'Pro Evaluator (Annual)',
    billingCycle: 'yearly',
    amount: 1199900,
    currency: 'INR',
    durationDays: 365,
  },
};

export const getPlan = (planId) => PLANS[planId] || null;
