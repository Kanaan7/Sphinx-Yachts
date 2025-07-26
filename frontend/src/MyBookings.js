// frontend/src/pages/MyBookings.js
import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress, Card, CardContent
} from '@mui/material';

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    setError(''); setBookings(null); setLoading(true);
    const qs = new URLSearchParams();
    if (email) qs.append('email', email);
    if (id)    qs.append('id', id);
    try {
      const res = await fetch(`/api/bookings?${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lookup failed');
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>My Bookings</Typography>

      <Box component="form" onSubmit={handleLookup} sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Email"
          type="email"
          required={!id}
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Booking ID"
          placeholder="(optional)"
          value={id}
          onChange={e => setId(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Lookup'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {bookings && bookings.map(b => (
        <Card key={b._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography><strong>ID:</strong> {b._id}</Typography>
            <Typography><strong>Vehicle:</strong> {b.vehicleType}</Typography>
            <Typography><strong>Date:</strong> {b.date}</Typography>
            <Typography><strong>Time:</strong> {b.startTime}–{b.endTime}</Typography>
            <Typography><strong>Paid via:</strong> {b.paymentMethod}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MyBookings;
