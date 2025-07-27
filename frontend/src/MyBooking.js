// frontend/src/MyBookings.js

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem } from '@mui/material';

export default function MyBookings() {
  const [email, setEmail]         = useState('');
  const [bookings, setBookings]   = useState([]);
  const [error, setError]         = useState('');

  const handleFind = async () => {
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error((await res.json()).error);
      setBookings(await res.json());
      setError('');
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>My Bookings</Typography>
      <TextField
        label="Your Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleFind}>Find</Button>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      <List sx={{ mt: 2 }}>
        {bookings.map(b => (
          <ListItem key={b._id}>
            {b.date} – {b.startTime} to {b.endTime} on {b.vehicleType}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
