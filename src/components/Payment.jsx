import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from './AuthContext';
import './Payment.css';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || '';

// Initialize Stripe only if we have a publishable key
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

function Payment({ onSuccess, onBack }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { user, markAsPaid } = useAuth();

  // Check for successful payment return from Stripe Checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('payment') === 'success') {
      markAsPaid();
      window.history.replaceState({}, '', window.location.pathname);
      onSuccess();
    } else if (params.get('payment') === 'cancelled') {
      setError('Payment was cancelled. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [markAsPaid, onSuccess]);

  const handleCheckout = async () => {
    setError('');
    setProcessing(true);

    if (!STRIPE_PUBLISHABLE_KEY) {
      setError('Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in the environment.');
      setProcessing(false);
      return;
    }

    if (!STRIPE_PRICE_ID) {
      setError('Stripe Price ID is not configured. Please set VITE_STRIPE_PRICE_ID in the environment.');
      setProcessing(false);
      return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        lineItems: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}?payment=success`,
        cancelUrl: `${window.location.origin}?payment=cancelled`,
        customerEmail: user?.email || undefined,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      setError(err.message || 'Unable to start checkout. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <img src="/auction-academy-logo.png" alt="Auction Academy" className="payment-logo" />
          <h2>Complete Your Purchase</h2>
          <p>Get full access to all exam prep materials</p>
        </div>

        <div className="payment-features">
          <div className="payment-feature">✅ Full 75-question practice exams</div>
          <div className="payment-feature">✅ Topic-specific quizzes</div>
          <div className="payment-feature">✅ Interactive flashcards</div>
          <div className="payment-feature">✅ Study games</div>
          <div className="payment-feature">✅ Comprehensive study guides</div>
          <div className="payment-feature">✅ All 7 state exam preparations</div>
        </div>

        <div className="checkout-form">
          <div className="price-display">
            <span className="price-label">Full Access</span>
            <span className="price-amount">$0.01 <span className="price-currency">USD</span></span>
            <span className="price-description">One-time payment for complete exam prep access</span>
          </div>

          {error && <div className="payment-error">{error}</div>}

          <button 
            className="pay-btn"
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? 'Redirecting to Stripe...' : 'Pay $0.01 with Stripe'}
          </button>

          <button type="button" className="pay-back-btn" onClick={onBack}>
            ← Go Back
          </button>

          <p className="secure-note">🔒 Payments are securely processed by Stripe</p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
