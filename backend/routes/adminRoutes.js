const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminMiddleware');
const router = express.Router();

// Promote a user to admin (only by existing admin)
router.post('/promote/:userId', auth, adminCheck, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({ message: `User ${user.email} promoted to admin.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// Demote an admin to user (only by existing admin)
router.post('/demote/:userId', auth, adminCheck, async (req, res    ) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    user.role = 'user';
    await user.save();

    res.json({ message: `User ${user.email} demoted to user.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});