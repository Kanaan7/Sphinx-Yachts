// backend/routes/booking.js

const express    = require('express');
const router     = express.Router();
const Booking    = require('../models/Booking');
const nodemailer = require('nodemailer');

// Shared transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/bookings → save + email owner & user
router.post('/', async (req, res) => {
  const { name, email, vehicleType, date, startTime, endTime, paymentMethod } = req.body;
  if (!name || !email || !vehicleType || !date || !startTime || !endTime || !paymentMethod) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const booking = await Booking.create({ name, email, vehicleType, date, startTime, endTime, paymentMethod });

    // Notify owner
    transporter.sendMail({
      from: `"Sphinx Yachts" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New booking from ${name}`,
      html: `
        <h2>New Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Vehicle:</strong> ${vehicleType}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${startTime} – ${endTime}</p>
        <p><strong>Payment:</strong> ${paymentMethod}</p>
        <p><strong>ID:</strong> ${booking._id}</p>
      `
    }).catch(console.error);

    // Confirmation to user
    transporter.sendMail({
      from: `"Sphinx Yachts" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Booking Confirmation',
      html: `
        <h2>Thanks for booking!</h2>
        <p>Your booking ID is <strong>${booking._id}</strong>.</p>
      `
    }).catch(console.error);

    return res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings
// • Availability mode: ?date=YYYY-MM-DD&vehicleType=…  → always 200 + []
// • Lookup mode:       ?email=… or ?id=…             → 404 if none
router.get('/', async (req, res) => {
  const { date, vehicleType, email, id } = req.query;
  const isAvailability = date && vehicleType;
  const isLookup       = email || id;

  if (!isAvailability && !isLookup) {
    return res.status(400).json({
      error: 'Provide date+vehicleType for availability OR email/id for lookup'
    });
  }

  const filter = {};
  if (isAvailability) {
    filter.date        = date;
    filter.vehicleType = vehicleType;
  }
  if (email) filter.email = email;
  if (id)    filter._id   = id;

  try {
    const bookings = await Booking.find(filter).sort({ startTime: 1 });

    if (isAvailability) {
      // always return 200 with array (even empty)
      return res.json(bookings);
    } else {
      // lookup mode: 404 if none
      if (!bookings.length) {
        return res.status(404).json({ error: 'No bookings found' });
      }
      return res.json(bookings);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
