require('dotenv').config();
const mongoose = require('mongoose');

console.log('Starting connection test...');
console.log('Using URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hides password

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    console.log('Connection state:', mongoose.connection.readyState);
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Add connection event listeners
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});

// Add timeout
setTimeout(() => {
  console.log('Connection attempt timed out');
  process.exit(1);
}, 5000); 