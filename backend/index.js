// backend/index.js

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');
const nodemailer = require('nodemailer');

const bookingRoutes = require('./routes/booking');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 2) Booking API
app.use('/api/bookings', bookingRoutes);

// 3) Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New message from ${name}`,
      text: `
You have a new contact submission:

Name: ${name}
Email: ${email}

Message:
${message}
      `.trim()
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('💥 Mail error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

// 4) Start server (API only)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
