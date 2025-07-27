// frontend/src/BookingForm.js

import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function BookingForm() {
  const stripe   = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    name: '',
    email: '',
    vehicleType: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack]     = useState({ open: false, severity: 'success', message: '' });

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack(s => ({ ...s, open: false }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // 1) Create PaymentIntent
      const piRes = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleType: form.vehicleType })
      });
      const piData = await piRes.json();
      if (!piRes.ok) throw new Error(piData.error || 'Payment failed to initialize');

      // 2) Confirm card payment
      const { error: stripeError } = await stripe.confirmCardPayment(piData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });
      if (stripeError) throw new Error(stripeError.message);

      // 3) Create booking record
      const bkRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const bkData = await bkRes.json();
      if (!bkRes.ok) throw new Error(bkData.error || 'Booking failed');

      setSnack({ open: true, severity: 'success', message: 'Payment & booking successful!' });
      setForm({ name:'', email:'', vehicleType:'', date:'', startTime:'', endTime:'' });
      elements.getElement(CardElement).clear();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h5" align="center">Pay & Book</Typography>

        <TextField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <FormControl required>
          <InputLabel>Vehicle</InputLabel>
          <Select
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
          >
            <MenuItem value="15-person Yacht">15‑person Yacht</MenuItem>
            <MenuItem value="20-person Yacht">20‑person Yacht</MenuItem>
            <MenuItem value="25-person Yacht">25‑person Yacht</MenuItem>
            <MenuItem value="Jet Ski">Jet Ski</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Date"
          name="date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={handleChange}
          required
        />

        <TextField
          label="Start Time"
          name="startTime"
          type="time"
          InputLabelProps={{ shrink: true }}
          value={form.startTime}
          onChange={handleChange}
          required
        />

        <TextField
          label="End Time"
          name="endTime"
          type="time"
          InputLabelProps={{ shrink: true }}
          value={form.endTime}
          onChange={handleChange}
          required
        />

        {/* Stripe Card Element */}
        <Box
          sx={{
            p: 2,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 1
          }}
        >
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !stripe}
        >
          {loading ? <CircularProgress size={24} /> : 'Pay & Book'}
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
