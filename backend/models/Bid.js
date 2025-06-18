const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auctionItem: { type: mongoose.Schema.Types.ObjectId, ref: 'AuctionItem', required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);
