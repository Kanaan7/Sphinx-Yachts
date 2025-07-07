// backend/routes/bookings.js

const express = require('express');
const Booking = require('../models/Booking');
const router  = express.Router();

// GET all bookings (for admin or owner view)
router.get('/', async (_req, res) => {
  try {
    const all = await Booking.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST a new booking
router.post('/', async (req, res) => {
  try {
    // Expecting req.body to contain:
    // { name, email, vehicleType, date, startTime, endTime, paymentMethod }
    const b = new Booking(req.body);
    await b.save();
    res.status(201).json(b);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
