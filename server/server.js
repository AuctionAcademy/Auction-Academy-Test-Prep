import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env from the project root (where package.json is)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('');
  console.error('============================================================');
  console.error('  ERROR: STRIPE_SECRET_KEY is not set!');
  console.error('============================================================');
  console.error('');
  console.error('  To fix this, create a .env file in the project root:');
  console.error('');
  console.error('    cp .env.example .env');
  console.error('');
  console.error('  Then edit .env and set your Stripe secret key:');
  console.error('');
  console.error('    STRIPE_SECRET_KEY=sk_test_your_key_here');
  console.error('');
  console.error('  Get your key from: https://dashboard.stripe.com/apikeys');
  console.error('============================================================');
  console.error('');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Create a Stripe Checkout Session for $0.01 USD one-time payment
app.post('/api/create-checkout-session', async (req, res) => {
  const { userEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Auction Academy Exam Prep - Full Access',
              description: 'One-time payment for complete auctioneer exam prep access across all 7 states',
            },
            unit_amount: 1, // $0.01 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// Verify a completed payment session
app.get('/api/verify-session', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json({
      paid: session.payment_status === 'paid',
      customerEmail: session.customer_email,
    });
  } catch (error) {
    console.error('Session verification error:', error.message);
    res.status(500).json({ error: 'Failed to verify session.' });
  }
});

app.listen(PORT, () => {
  console.log(`Stripe server running on http://localhost:${PORT}`);
});
