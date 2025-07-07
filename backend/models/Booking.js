// backend/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true },
  vehicleType:    { type: String, required: true },    // e.g. "15-Person Yacht"
  date:           { type: String, required: true },    // "YYYY-MM-DD"
  startTime:      { type: String, required: true },    // "HH:MM"
  endTime:        { type: String, required: true },    // "HH:MM"
  paymentMethod:  { type: String, default: 'unpaid' }, // e.g. "stripe", "cash"
  createdAt:      { type: Date,   default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
