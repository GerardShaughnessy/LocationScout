require('dotenv').config();
const mongoose = require('mongoose');
const UserActivity = require('../models/UserActivity');
const User = require('../models/User');

const seedActivities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a test user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found in database');
      process.exit(1);
    }

    // Create some test activities
    const activities = [
      {
        userId: user._id,
        type: 'login',
        description: 'User logged in successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      },
      {
        userId: user._id,
        type: 'profile_update',
        description: 'Updated profile information',
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        userId: user._id,
        type: 'location_create',
        description: 'Created a new location',
        timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
      }
    ];

    // Insert activities
    await UserActivity.insertMany(activities);
    console.log('Test activities created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding activities:', error);
    process.exit(1);
  }
};

seedActivities(); 