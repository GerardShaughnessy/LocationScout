console.log('Starting MongoDB connection test...');

require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }); 