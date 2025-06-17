const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String],
  category: String,
  basePrice: Number,
  currentBid: Number,
  bidCount: { type: Number, default: 0 },
  auctionType: { type: String, enum: ['timed', 'live'], default: 'timed' },
  reservePrice: Number,
  buyNowPrice: Number,
  startTime: Date,
  endTime: Date,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bids: [{
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    maxAutoBid: Number,
    time: Date,
  }]
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
