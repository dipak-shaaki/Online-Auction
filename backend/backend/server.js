const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User= require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const auctionRoutes = require('./routes/auctionRoutes');
app.use('/api/items', auctionRoutes);

const bidRoutes = require('./routes/bidRoutes');
app.use('/api/bids', bidRoutes);

const updateAuctionStatuses = require('./utils/auctionScheduler');
setInterval(updateAuctionStatuses, 60 * 1000); // every 1 minute



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.get('/', (req, res) => res.send('Auction backend running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const createDefaultAdmin = async () => {
  const adminEmail = 'admin@auction.com';
  const adminExists = await User.findOne({ email: adminEmail });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Auction Admin',
      email: adminEmail,
      password: hashedPassword,
      location: 'Global',
      currency: 'USD',
      role: 'admin'
    });
    console.log('Default admin account created');
  } else {
    console.log('Admin already exists');
  }
};

createDefaultAdmin();