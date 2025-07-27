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
  Typography
} from '@mui/material';

// Helper to compute free slots between 08:00–20:00 given booked intervals
function computeFreeSlots(bookings) {
  const toMinutes = t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const toTimeString = mins => {
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };
  const businessStart = toMinutes('08:00');
  const businessEnd   = toMinutes('20:00');

  // Map & sort bookings
  const sorted = bookings
    .map(b => ({
      start: toMinutes(b.startTime),
      end:   toMinutes(b.endTime)
    }))
    .sort((a, b) => a.start - b.start);

  const freeSlots = [];
  let pointer = businessStart;

  for (const b of sorted) {
    if (b.start > pointer) {
      freeSlots.push({
        start: toTimeString(pointer),
        end:   toTimeString(b.start)
      });
    }
    pointer = Math.max(pointer, b.end);
  }

  if (pointer < businessEnd) {
    freeSlots.push({
      start: toTimeString(pointer),
      end:   toTimeString(businessEnd)
    });
  }

  return freeSlots;
}

export default function AvailabilityPage() {
  const [date, setDate]               = useState('');
  const [vehicleType, setVehicleType] = useState('15-person Yacht');
  const [slots, setSlots]             = useState([]);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (!date || !vehicleType) return;

    setError('');
    (async () => {
      try {
        const res = await fetch(
          `/api/bookings?date=${date}&vehicleType=${encodeURIComponent(vehicleType)}`
        );
        if (!res.ok) throw new Error((await res.json()).error || 'Error loading availability');
        const booked = await res.json();
        setSlots(computeFreeSlots(booked));
      } catch (e) {
        console.error(e);
        setError('Unable to load availability.');
        setSlots([]);
      }
    })();
  }, [date, vehicleType]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
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

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {!error && slots.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Available Slots
          </Typography>
          {slots.map(slot => (
            <Typography key={slot.start}>
              {slot.start} – {slot.end}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
