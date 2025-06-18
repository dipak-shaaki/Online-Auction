const express = require('express');
const router = express.Router();
const AuctionItem = require('../models/AuctionItem');
const auth = require('../middleware/authMiddleware');

// Upload new item (requires login)
router.post('/upload', auth, async (req, res) => {
  try {
    const {
      title, description, category, images, startingPrice, startTime, endTime
    } = req.body;

    const newItem = new AuctionItem({
      title,
      description,
      category,
      images,
      startingPrice,
      seller: req.user.id,
      startTime,
      endTime,
      status: 'upcoming'
    });

    await newItem.save();
    res.status(201).json({ message: 'Item uploaded successfully', item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload item' });
  }
});

// Get all auction items (public)
router.get('/', async (req, res) => {
  try {
    const items = await AuctionItem.find().populate('seller', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

// Get single item (public)
router.get('/:id', async (req, res) => {
  try {
    const item = await AuctionItem.findById(req.params.id).populate('seller', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

module.exports = router;
