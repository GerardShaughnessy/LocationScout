const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const activityController = require('../controllers/activityController');

// Get user's activity history
router.get('/users/:userId/activity', protect, activityController.getUserActivity);

module.exports = router; 