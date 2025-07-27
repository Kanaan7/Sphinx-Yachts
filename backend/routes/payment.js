// backend/routes/payment.js
const express = require('express');
const router  = express.Router();
const Stripe  = require('stripe');
const stripe  = Stripe(process.env.STRIPE_SECRET_KEY);

// Map your services to prices (in cents)
const PRICE_CENTS = {
  '15-person Yacht': 15000,
  '20-person Yacht': 20000,
  '25-person Yacht': 25000,
  'Jet Ski':          8000
};

// POST /api/payments/create-payment-intent
// body: { vehicleType }
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { vehicleType } = req.body;
    const amount = PRICE_CENTS[vehicleType] || 0;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      automatic_payment_methods: { enabled: true }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment Intent error:', err);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

module.exports = router;
