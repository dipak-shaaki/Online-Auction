const mongoose = require('mongoose');

const auctionItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['Art', 'Antiques', 'Jewelry', 'Watches', 'Collectibles', 'Electronics', 'Other'],
    required: true
  },
  images: [String],
  startingPrice: { type: Number, required: true },
  predictedPrice: Number,

  currentBid: {
    amount: { type: Number, default: 0 },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },

  bids: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ],

  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auctionType: {
    type: String,
    enum: ['time-based', 'live'],
    default: 'time-based'
  },

  status: {
    type: String,
    enum: ['upcoming', 'live', 'ended'],
    default: 'upcoming'
  },

  startTime: Date,
  endTime: Date,

  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('AuctionItem', auctionItemSchema);
