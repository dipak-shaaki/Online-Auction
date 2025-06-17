const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String,
  currency: String,
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
