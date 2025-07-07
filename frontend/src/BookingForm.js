// frontend/src/BookingForm.js

import React, { useState } from 'react';
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box
} from '@mui/material';
import axios from 'axios';

const VEHICLES = [
  { value: 'boat_15', label: '15-Person Yacht ($400/hr)' },
  { value: 'boat_20', label: '20-Person Yacht ($400/hr)' },
  { value: 'boat_25', label: '25-Person Yacht ($400/hr)' },
  { value: 'jetski', label: 'Jet Ski ($150/hr)' }
];

export default function BookingForm() {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    vehicleType: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await axios.post('/api/bookings', {
        ...form,
        hours:
          (new Date(`${form.date}T${form.endTime}`) -
           new Date(`${form.date}T${form.startTime}`)) /
          (1000 * 60 * 60)
      });
      setMessage(`Booking confirmed! Total cost: $${data.totalCost}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to submit booking.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Book Your Ride
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Your Name"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email Address"
          name="customerEmail"
          value={form.customerEmail}
          onChange={handleChange}
          type="email"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Select Vehicle"
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {VEHICLES.map(v => (
            <MenuItem key={v.value} value={v.value}>
              {v.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date"
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Start Time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            type="time"
            required
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="End Time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            type="time"
            required
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: '#C49B66',    // override to your gold
            '&:hover': { backgroundColor: '#B38A5A' }
          }}
        >
          {loading ? 'Submitting…' : 'Submit Booking'}
        </Button>

        {message && (
          <Typography sx={{ mt: 3 }} color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
