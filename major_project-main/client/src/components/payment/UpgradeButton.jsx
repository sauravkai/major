import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

const loadCheckoutScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay));
      existing.addEventListener('error', () => reject(new Error('Checkout script failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Checkout script failed to load'));
    document.body.appendChild(script);
  });

export const UpgradeButton = ({ planId, className = '', children, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const startCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/#pricing', planId } });
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const Razorpay = await loadCheckoutScript();
      const { data } = await API.post('/payments/order', { planId });
      const order = data.data;

      const checkout = new Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'INTERVIEW.AI',
        description: order.plan.name,
        prefill: { name: order.customer.name, email: order.customer.email },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            const verified = await API.post('/payments/verify', response);
            setStatus('success');
            onSuccess?.(verified.data.data.subscription);
          } catch (verifyError) {
            setStatus('error');
            setError(verifyError.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });

      checkout.on('payment.failed', (response) => {
        setStatus('error');
        setError(response.error?.description || 'Payment failed');
      });

      checkout.open();
    } catch (requestError) {
      setStatus('error');
      setError(requestError.response?.data?.message || requestError.message || 'Unable to start checkout');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={status === 'loading' || status === 'success'}
        className={`flex items-center justify-center gap-2 disabled:opacity-60 ${className}`}
      >
        {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === 'idle' && !user && <Lock className="w-4 h-4" />}
        {status === 'success' ? 'Plan Activated' : children}
      </button>
      {error && <p className="text-xs text-rose-500 text-center mt-2">{error}</p>}
    </div>
  );
};
