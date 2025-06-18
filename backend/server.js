const express = require('express');
const http = require('http'); //  Required
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');


const app = express();


const server = http.createServer(app); //  create server manually
const io = socketIo(server, {
  cors: { origin: '*' }
});
// Attach Socket.IO to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

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


// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinAuctionRoom', (auctionId) => {
    socket.join(auctionId);
    console.log(`User joined room: ${auctionId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


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