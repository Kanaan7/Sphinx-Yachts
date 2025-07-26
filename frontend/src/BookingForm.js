// frontend/src/components/BookingForm.js

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
  Alert
} from '@mui/material';

const BookingForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnack = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack(s => ({ ...s, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          vehicleType,
          date,
          startTime,
          endTime,
          paymentMethod
        })
      });
      const payload = await res.json();

      if (!res.ok) {
        setSnack({ open: true, message: payload.error || 'Booking failed', severity: 'error' });
      } else {
        setSnack({ open: true, message: 'Booking successful!', severity: 'success' });
        // reset form
        setName(''); setEmail('');
        setVehicleType(''); setDate('');
        setStartTime(''); setEndTime('');
        setPaymentMethod('');
      }
    } catch {
      setSnack({ open: true, message: 'Network error', severity: 'error' });
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
          maxWidth: 400, mx: 'auto', p: 3,
          display: 'flex', flexDirection: 'column', gap: 2,
          bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3
        }}
      >
        <Typography variant="h5" align="center">Book Your Ride</Typography>

        <TextField
          label="Full Name" value={name}
          onChange={e => setName(e.target.value)} required
        />

        <TextField
          label="Email Address" type="email" value={email}
          onChange={e => setEmail(e.target.value)} required
        />

        <FormControl required>
          <InputLabel id="vehicle-label">Vehicle</InputLabel>
          <Select
            labelId="vehicle-label" label="Vehicle"
            value={vehicleType} onChange={e => setVehicleType(e.target.value)}
          >
            <MenuItem value="15-person Yacht">15‑person Yacht</MenuItem>
            <MenuItem value="20-person Yacht">20‑person Yacht</MenuItem>
            <MenuItem value="25-person Yacht">25‑person Yacht</MenuItem>
            <MenuItem value="Jet Ski">Jet Ski</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Date" type="date" InputLabelProps={{ shrink: true }}
          value={date} onChange={e => setDate(e.target.value)} required
        />

        <TextField
          label="Start Time" type="time" InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }} value={startTime}
          onChange={e => setStartTime(e.target.value)} required
        />

        <TextField
          label="End Time" type="time" InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }} value={endTime}
          onChange={e => setEndTime(e.target.value)} required
        />

        <FormControl required>
          <InputLabel id="payment-label">Payment Method</InputLabel>
          <Select
            labelId="payment-label" label="Payment Method"
            value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="PayPal">PayPal</MenuItem>
            <MenuItem value="Cash">Cash on Pickup</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? 'Booking…' : 'Book Now'}
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingForm;
