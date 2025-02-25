const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ratingController = require('../controllers/ratingController');

// Add rating and comment routes
router.post('/:locationId/ratings', protect, ratingController.addRating);
router.post('/:locationId/comments', protect, ratingController.addComment);

module.exports = router; 