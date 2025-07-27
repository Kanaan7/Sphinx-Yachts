// backend/routes/booking.js

const express    = require('express');
const router     = express.Router();
const Booking    = require('../models/Booking');
const nodemailer = require('nodemailer');

// Configure a single shared transporter using your SMTP env vars
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,  // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/bookings
//  • Saves the booking
//  • Attempts to email the owner & the user without blocking on failure
router.post('/', async (req, res) => {
  const { name, email, vehicleType, date, startTime, endTime, paymentMethod } = req.body;
  if (!name || !email || !vehicleType || !date || !startTime || !endTime || !paymentMethod) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    // 1) Save booking to MongoDB
    const booking = await Booking.create({ name, email, vehicleType, date, startTime, endTime, paymentMethod });

    // 2) Send owner notification (log but don’t throw)
    const ownerMail = transporter.sendMail({
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
    }).catch(err => console.error('❌ Owner email failed:', err));

    // 3) Send user confirmation (log but don’t throw)
    const userMail = transporter.sendMail({
      from: `"Sphinx Yachts" <${process.env.EMAIL_USER}>`,
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

    // wait for both attempts (optional)
    await Promise.all([ownerMail, userMail]);

    // 4) Respond with the created booking
    return res.status(201).json(booking);

  } catch (err) {
    console.error('Booking route error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings?email=…&id=…
// Lookup bookings by user email and/or booking ID
router.get('/', async (req, res) => {
  const { email, id } = req.query;
  if (!email && !id) {
    return res.status(400).json({ error: 'Provide email and/or id' });
  }

  const filter = {};
  if (email) filter.email = email;
  if (id)    filter._id    = id;

  try {
    const bookings = await Booking.find(filter).sort({ date: 1 });
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
