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

// Converters
const toMinutes = t => t.split(':').reduce((m, x, i) => m + (i===0 ? +x * 60 : +x), 0);
const toTime    = m => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;

// Build free slots
function computeFreeSlots(bookings) {
  const startDay = toMinutes('08:00');
  const endDay   = toMinutes('20:00');
  const intervals = bookings
    .map(b => ({ s: toMinutes(b.startTime), e: toMinutes(b.endTime) }))
    .sort((a,b)=>a.s-b.s);

  const free = [];
  let cursor = startDay;

  for (const { s, e } of intervals) {
    if (s > cursor) free.push({ from: cursor, to: s });
    cursor = Math.max(cursor, e);
  }
  if (cursor < endDay) free.push({ from: cursor, to: endDay });
  return free.map(({from,to})=>({ start: toTime(from), end: toTime(to) }));
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
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(booked => {
        const free = computeFreeSlots(booked);
        setSlots(free);
      })
      .catch(() => {
        setError('Unable to load availability.');
        setSlots([]);
      })
      .finally(() => setLoading(false));
  }, [date, vehicleType]);

  return (
    <Box sx={{ maxWidth:400, mx:'auto', mt:4, p:2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Check Availability
      </Typography>

      <TextField
        label="Date" type="date"
        InputLabelProps={{ shrink:true }}
        value={date} onChange={e=>setDate(e.target.value)}
        fullWidth
      />

      <FormControl fullWidth sx={{ mt:2 }}>
        <InputLabel>Service</InputLabel>
        <Select
          value={vehicleType}
          label="Service"
          onChange={e=>setVehicleType(e.target.value)}
        >
          <MenuItem value="15-person Yacht">15‑person Yacht</MenuItem>
          <MenuItem value="20-person Yacht">20‑person Yacht</MenuItem>
          <MenuItem value="25-person Yacht">25‑person Yacht</MenuItem>
          <MenuItem value="Jet Ski">Jet Ski</MenuItem>
        </Select>
      </FormControl>

      {loading && (
        <Box sx={{ display:'flex', justifyContent:'center', mt:3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt:3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && date && (
        slots.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mt:3 }}>Available Slots</Typography>
            <List>
              {slots.map(({start,end})=>(
                <ListItem key={start}>{start} – {end}</ListItem>
              ))}
            </List>
          </>
        ) : (
          <Alert severity="success" sx={{ mt:3 }}>
            🎉 All slots are free from 08:00 to 20:00 on {date}!
          </Alert>
        )
      )}
    </Box>
  );
}
