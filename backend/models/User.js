const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['owner', 'customer'], default: 'customer' }
});

// hash on save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// helper: compare cleartext to hash
UserSchema.methods.comparePassword = function(plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

module.exports = mongoose.model('User', UserSchema);
