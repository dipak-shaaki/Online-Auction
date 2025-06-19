const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const AuctionItem = require('../models/AuctionItem');
const auth = require('../middleware/authMiddleware');
const { isUser } = require('../middleware/roleMiddleware');

// Place a bid
router.post('/:auctionId', auth, async (req, res) => {
  const { amount } = req.body;
  const auctionId = req.params.auctionId;

  try {
    const item = await AuctionItem.findById(auctionId);
    if (!item) return res.status(404).json({ message: 'Auction item not found' });

    const now = new Date();

    // Check if auction is live or valid time
    if (item.status !== 'live' || now < item.startTime || now > item.endTime) {
      return res.status(403).json({ message: 'Auction is not currently live' });
    }

    const currentAmount = item.currentBid?.amount || item.startingPrice;
    if (amount <= currentAmount)
      return res.status(400).json({ message: 'Bid must be higher than current bid' });

    // Save new bid
    const newBid = new Bid({
      user: req.user.id,
      auctionItem: auctionId,
      amount
    });
    await newBid.save();

    // Update auction
    item.currentBid = { amount, bidder: req.user.id };
    item.bids.push({
      user: req.user.id,
      amount,
      timestamp: new Date()
    });
    await item.save();

    // Emit real-time bid update (if using Socket.IO)
    req.io?.to(auctionId).emit('newBid', {
      amount,
      user: req.user.id,
      time: new Date()
    });

    res.status(201).json({ message: 'Bid placed successfully', bid: newBid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error placing bid' });
  }
});

router.post('/:auctionId', auth, isUser, async (req, res) => {
  const { amount } = req.body;
  const auctionId = req.params.auctionId;

  try {
    const item = await AuctionItem.findById(auctionId);
    if (!item) return res.status(404).json({ message: 'Auction item not found' });

    if (String(item.owner) === String(req.user.id)) {
      return res.status(403).json({ message: 'You cannot bid on your own item' });
    }

    // ... (rest of your bid logic)
  } catch (err) {
    res.status(500).json({ message: 'Error placing bid' });
  }
});


module.exports = router;
