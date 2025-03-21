const UserActivity = require('../models/UserActivity');

const activityController = {
  // Get user's activity history
  getUserActivity: async (req, res) => {
    try {
      const activities = await UserActivity.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(50);
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new activity
  createActivity: async (userId, type, description, metadata = {}) => {
    try {
      const activity = await UserActivity.create({
        userId,
        type,
        description,
        metadata
      });
      return activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      return null;
    }
  }
};

module.exports = activityController; 