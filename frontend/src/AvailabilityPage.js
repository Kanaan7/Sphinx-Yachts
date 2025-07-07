// frontend/src/AvailabilityPage.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Alert,
  Divider
} from '@mui/material';
import axios from 'axios';

const SERVICES = [
  { key: 'boat_15', label: '15-Person Yacht' },
  { key: 'boat_20', label: '20-Person Yacht' },
  { key: 'boat_25', label: '25-Person Yacht' },
  { key: 'jetski',  label: 'Jet Ski' }
];

// Define your daily business hours
const BUSINESS_HOURS = { start: '08:00', end: '20:00' };

export default function AvailabilityPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [service, setService] = useState(SERVICES[0].key);
  const [availability, setAvailability] = useState({});
  const [error, setError] = useState('');

  // Helper: compute free intervals given booked ones
  function computeFreeSlots(booked = []) {
    const slots = [];
    let cursor = BUSINESS_HOURS.start;

    booked
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .forEach(({ startTime, endTime }) => {
        if (cursor < startTime) {
          slots.push({ start: cursor, end: startTime });
        }
        cursor = endTime;
      });

    if (cursor < BUSINESS_HOURS.end) {
      slots.push({ start: cursor, end: BUSINESS_HOURS.end });
    }
    return slots;
  }

  useEffect(() => {
    setError('');
    axios
      .get(`/api/bookings/availability?date=${date}`)
      .then(res => setAvailability(res.data))
      .catch(() => {
        setError('Unable to load availability.');
        setAvailability({});
      });
  }, [date]);

  const bookedSlots = availability[service] || [];
  const freeSlots   = computeFreeSlots(bookedSlots);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Check Availability
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="Service"
          value={service}
          onChange={e => setService(e.target.value)}
        >
          {SERVICES.map(s => (
            <MenuItem key={s.key} value={s.key}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {!error && (
        <>
          <Typography variant="h6">
            Booked for {SERVICES.find(s => s.key===service).label} on {date}
          </Typography>
          {bookedSlots.length ? (
            <List dense>
              {bookedSlots.map((slot, i) => (
                <ListItem key={i}>
                  <ListItemText primary={`${slot.startTime} – ${slot.endTime}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No bookings — fully available!</Typography>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">
            Free Slots ({BUSINESS_HOURS.start}–{BUSINESS_HOURS.end})
          </Typography>
          {freeSlots.length ? (
            <List dense>
              {freeSlots.map((slot, i) => (
                <ListItem key={i}>
                  <ListItemText primary={`${slot.start} – ${slot.end}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Sorry, no free time left today.</Typography>
          )}
        </>
      )}
    </Container>
  );
}
