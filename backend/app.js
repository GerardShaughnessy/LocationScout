require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const photoRoutes = require('./routes/photoRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/locations', photoRoutes);
app.use('/api/locations', ratingRoutes);
app.use('/api/search', searchRoutes);

// Protected test route
app.get('/api/test', protect, (req, res) => {
  res.json({ 
    message: 'You accessed a protected route!',
    user: req.user 
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'LocationScout API running!' });
});

// Update these lines for Railway deployment
const PORT = process.env.PORT || 3001;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
}); 