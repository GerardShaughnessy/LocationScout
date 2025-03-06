const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');
const { standardLimiter, mapTileLimiter } = require('../middleware/rateLimiter');
const { locationValidationRules, validate } = require('../middleware/validation');
const upload = require('../middleware/multer');

// Apply rate limiting to all routes
router.use(standardLimiter);

// Get locations with optional filtering
router.get('/', auth, locationController.getLocations);

// Create new location
router.post('/', 
  auth,
  locationValidationRules,
  validate,
  upload.array('photos', 10),
  locationController.createLocation
);

// Get offline map data (with special rate limit)
router.post('/offline-region',
  auth,
  mapTileLimiter,
  locationController.getOfflineRegionData
);

// ... rest of the routes ...

module.exports = router; 