import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from './AuthContext';
import './Payment.css';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#001829',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#dc2626',
    },
  },
};

function CheckoutForm({ onSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { user, markAsPaid } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create a payment method using the card element
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          email: user?.email,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // In production, you would send paymentMethod.id to your backend
      // to create a PaymentIntent and confirm the payment.
      // For now, we simulate a successful payment.
      console.log('Payment method created:', paymentMethod.id);
      
      // Mark the user as paid
      markAsPaid();
      onSuccess();
    } catch {
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="price-display">
        <span className="price-label">Full Access</span>
        <span className="price-amount">$100.00 <span className="price-currency">USD</span></span>
        <span className="price-description">One-time payment for complete exam prep access</span>
      </div>

      <div className="card-element-container">
        <label>Card Details</label>
        <div className="card-element-wrapper">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && <div className="payment-error">{error}</div>}

      <button 
        type="submit" 
        className="pay-btn"
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : 'Pay $100.00'}
      </button>

      <button type="button" className="pay-back-btn" onClick={onBack}>
        ← Go Back
      </button>

      <p className="secure-note">🔒 Payments are securely processed by Stripe</p>
    </form>
  );
}

function Payment({ onSuccess, onBack }) {
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

        <Elements stripe={stripePromise}>
          <CheckoutForm onSuccess={onSuccess} onBack={onBack} />
        </Elements>
      </div>
    </div>
  );
}

export default Payment;
