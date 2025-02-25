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

// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

// Middleware
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

// Server port - this should be 3001 (backend port)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 