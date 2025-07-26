// backend/routes/booking.js

const express    = require('express');
const router     = express.Router();
const Booking    = require('../models/Booking');
const nodemailer = require('nodemailer');

// Initialize a single shared transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  const { name, email, vehicleType, date, startTime, endTime, paymentMethod } = req.body;

  // Basic validation
  if (!name || !email || !vehicleType || !date || !startTime || !endTime || !paymentMethod) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    // 1) Save booking
    const booking = await Booking.create({
      name,
      email,
      vehicleType,
      date,
      startTime,
      endTime,
      paymentMethod
    });

    // 2) Email the site owner
    await transporter.sendMail({
      from: `"Sphinx Yachts" <${process.env.EMAIL_USER}>`,
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
        <p>ID: ${booking._id}</p>
      `
    });

    // 3) Confirmation email to user
    await transporter.sendMail({
      from: `"Sphinx Yachts" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Sphinx Yachts Booking Confirmation',
      html: `
        <h2>Thank you for booking with Sphinx Yachts!</h2>
        <p>Hi ${name},</p>
        <p>We’ve received your booking:</p>
        <ul>
          <li><strong>Vehicle:</strong> ${vehicleType}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${startTime} – ${endTime}</li>
          <li><strong>Payment:</strong> ${paymentMethod}</li>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
        </ul>
        <p>We look forward to seeing you on the water!</p>
        <p>— The Sphinx Yachts Team</p>
      `
    });

    // 4) Reply
    return res.status(201).json(booking);

  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
