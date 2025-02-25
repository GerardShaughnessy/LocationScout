const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

// Important: This needs to be a separate router
router.get('/', protect, searchController.searchLocations);

module.exports = router; 