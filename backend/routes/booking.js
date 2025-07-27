// backend/routes/booking.js

const express    = require('express');
const router     = express.Router();
const Booking    = require('../models/Booking');
const nodemailer = require('nodemailer');

// Shared transporter for owner & user notifications
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/bookings
// • Saves booking to MongoDB
// • Emails owner & sends confirmation to user (errors are logged, not thrown)
router.post('/', async (req, res) => {
  const { name, email, vehicleType, date, startTime, endTime, paymentMethod } = req.body;
  if (!name || !email || !vehicleType || !date || !startTime || !endTime || !paymentMethod) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    // 1) Save booking
    const booking = await Booking.create({ name, email, vehicleType, date, startTime, endTime, paymentMethod });

    // 2) Notify owner
    transporter.sendMail({
      from: `"Sphinx Yachts" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
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
    }).catch(err => console.error('❌ Owner email failed:', err));

    // 3) Confirmation to user
    transporter.sendMail({
      from: `"Sphinx Yachts" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Sphinx Yachts Booking Confirmation',
      html: `
        <h2>Thank you for booking with Sphinx Yachts!</h2>
        <p>Hi ${name},</p>
        <ul>
          <li><strong>Vehicle:</strong> ${vehicleType}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${startTime} – ${endTime}</li>
          <li><strong>Payment:</strong> ${paymentMethod}</li>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
        </ul>
        <p>We look forward to seeing you on the water!</p>
        <p>— The Sphinx Yachts Team</p>
      `
    }).catch(err => console.error('❌ Confirmation email failed:', err));

    // 4) Respond success
    return res.status(201).json(booking);

  } catch (err) {
    console.error('Booking route error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings
// Modes:
//  • Availability:   ?date=YYYY-MM-DD&vehicleType=…
//  • My Bookings:    ?email=…        OR    ?id=…
router.get('/', async (req, res) => {
  const { date, vehicleType, email, id } = req.query;

  // Determine intent
  if (date && vehicleType) {
    // availability lookup
  } else if (email || id) {
    // my‑bookings lookup
  } else {
    return res
      .status(400)
      .json({ error: 'Provide date+vehicleType for availability OR email/id for bookings' });
  }

  // Build filter
  const filter = {};
  if (date && vehicleType) {
    filter.date        = date;
    filter.vehicleType = vehicleType;
  }
  if (email) filter.email = email;
  if (id)    filter._id   = id;

  try {
    const bookings = await Booking.find(filter).sort({ startTime: 1 });
    if (!bookings.length) {
      return res.status(404).json({ error: 'No bookings found' });
    }
    return res.json(bookings);
  } catch (err) {
    console.error('Lookup error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
