// frontend/src/AvailabilityPage.js

import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem
} from '@mui/material';

// Helpers
const toMinutes = t => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const toTimeString = mins => {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
};

function computeFreeSlots(bookings) {
  const businessStart = toMinutes('08:00');
  const businessEnd   = toMinutes('20:00');

  const sorted = bookings
    .map(b => ({ start: toMinutes(b.startTime), end: toMinutes(b.endTime) }))
    .sort((a, b) => a.start - b.start);

  const free = [];
  let pointer = businessStart;

  for (const b of sorted) {
    if (b.start > pointer) {
      free.push({ start: toTimeString(pointer), end: toTimeString(b.start) });
    }
    pointer = Math.max(pointer, b.end);
  }
  if (pointer < businessEnd) {
    free.push({ start: toTimeString(pointer), end: toTimeString(businessEnd) });
  }
  return free;
}

export default function AvailabilityPage() {
  const [date, setDate]               = useState('');
  const [vehicleType, setVehicleType] = useState('15-person Yacht');
  const [slots, setSlots]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (!date) return;
    setError('');
    setLoading(true);

    fetch(`/api/bookings?date=${date}&vehicleType=${encodeURIComponent(vehicleType)}`)
      .then(async res => {
        if (res.status === 404) {
          // no bookings → treat as empty array
          return [];
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || res.statusText);
        }
        return res.json();
      })
      .then(booked => {
        // booked is [] if no reservations
        setSlots(computeFreeSlots(booked));
      })
      .catch(() => {
        setError('Unable to load availability.');
        setSlots([]);
      })
      .finally(() => setLoading(false));
  }, [date, vehicleType]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Check Availability
      </Typography>

      <TextField
        label="Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={e => setDate(e.target.value)}
        fullWidth
      />

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="service-label">Service</InputLabel>
        <Select
          labelId="service-label"
          label="Service"
          value={vehicleType}
          onChange={e => setVehicleType(e.target.value)}
        >
          <MenuItem value="15-person Yacht">15‑person Yacht</MenuItem>
          <MenuItem value="20-person Yacht">20‑person Yacht</MenuItem>
          <MenuItem value="25-person Yacht">25‑person Yacht</MenuItem>
          <MenuItem value="Jet Ski">Jet Ski</MenuItem>
        </Select>
      </FormControl>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && slots.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Available Slots</Typography>
          <List>
            {slots.map(({ start, end }) => (
              <ListItem key={start}>
                {start} – {end}
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {!loading && !error && date && slots.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          All slots are free for this date & service.
        </Alert>
      )}
    </Box>
  );
}
