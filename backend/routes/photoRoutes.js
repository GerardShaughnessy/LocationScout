const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const photoController = require('../controllers/photoController');

// Get upload URL and add photo to location
router.post('/:locationId/upload-url', protect, photoController.getPhotoUploadUrl);
router.post('/:locationId/photos', protect, photoController.addPhotoToLocation);

module.exports = router; 