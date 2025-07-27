// frontend/src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Your publishable key from .env: “REACT_APP_STRIPE_PUBLISHABLE_KEY”
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Find the root container in your HTML
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app wrapped in Stripe Elements
root.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>
);
