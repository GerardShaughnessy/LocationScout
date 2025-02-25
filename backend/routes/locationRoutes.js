const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// We'll add the controller next
const locationController = require('../controllers/locationController');

// Routes
router.post('/', protect, locationController.createLocation);
router.get('/', protect, locationController.getLocations);
router.get('/:id', protect, locationController.getLocationById);
router.put('/:id', protect, locationController.updateLocation);
router.delete('/:id', protect, locationController.deleteLocation);

module.exports = router; 