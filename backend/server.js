const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app); // Correct server
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Attach io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/items', auctionRoutes);
app.use('/api/bids', bidRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinAuctionRoom', (auctionId) => {
    socket.join(auctionId);
    console.log(`User joined room: ${auctionId}`);
  });

  socket.on('disconnect', () => {
    console.log(' User disconnected');
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

// Homepage
app.get('/', (req, res) => res.send('Auction backend running!'));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Schedule Auction Status Updates
const updateAuctionStatuses = require('./utils/auctionScheduler');
setInterval(() => updateAuctionStatuses(io), 60 * 1000); // pass io to scheduler

// Create default admin
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
    console.log(' Default admin account created');
  } else {
    console.log(' Admin already exists');
  }
};

createDefaultAdmin();
