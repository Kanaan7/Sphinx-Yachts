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
} from '@mui/material';

const BookingForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        paymentMethod,
      }),
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error || 'Booking failed');
      return;
    }
    alert('✅ Booking successful!');
    // Optionally clear the form:
    setName('');
    setEmail('');
    setVehicleType('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setPaymentMethod('');
  };

  return (
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
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" align="center">
        Book Your Ride
      </Typography>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <TextField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextField
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <FormControl required>
        <InputLabel id="vehicle-label">Vehicle</InputLabel>
        <Select
          labelId="vehicle-label"
          label="Vehicle"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <MenuItem value="15-person Yacht">15‑person Yacht</MenuItem>
          <MenuItem value="20-person Yacht">20‑person Yacht</MenuItem>
          <MenuItem value="25-person Yacht">25‑person Yacht</MenuItem>
          <MenuItem value="Jet Ski">Jet Ski</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <TextField
        label="Start Time"
        type="time"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }} // 5-minute steps
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />

      <TextField
        label="End Time"
        type="time"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />

      <FormControl required>
        <InputLabel id="payment-label">Payment Method</InputLabel>
        <Select
          labelId="payment-label"
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="Credit Card">Credit Card</MenuItem>
          <MenuItem value="PayPal">PayPal</MenuItem>
          <MenuItem value="Cash">Cash on Pickup</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" size="large">
        Book Now
      </Button>
    </Box>
  );
};

export default BookingForm;
