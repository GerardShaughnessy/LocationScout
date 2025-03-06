const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/User');

const setupTestDB = async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await mongoose.connection.dropDatabase();
};

const generateAuthToken = async () => {
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  await user.save();
  
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = {
  setupTestDB,
  generateAuthToken
}; 