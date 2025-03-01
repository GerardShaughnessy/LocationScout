const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Location = require('../models/Location');
const { upload, cloudinary } = require('../config/cloudinary');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().populate('createdBy', 'name');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single location
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('photos.uploadedBy', 'name');
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new location
router.post('/', protect, async (req, res) => {
  try {
    const { name, address, description, coordinates, features } = req.body;
    
    const location = new Location({
      name,
      address,
      description,
      coordinates,
      features: features || [],
      createdBy: req.user.id
    });
    
    const savedLocation = await location.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a location
router.put('/:id', protect, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check if user is the creator of the location
    if (location.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this location' });
    }
    
    const { name, address, description, coordinates, features } = req.body;
    
    location.name = name || location.name;
    location.address = address || location.address;
    location.description = description || location.description;
    location.coordinates = coordinates || location.coordinates;
    location.features = features || location.features;
    
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a location
router.delete('/:id', protect, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check if user is the creator of the location
    if (location.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this location' });
    }
    
    await location.deleteOne();
    res.json({ message: 'Location removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get locations created by the logged-in user
router.get('/user', protect, async (req, res) => {
  try {
    const locations = await Location.find({ createdBy: req.user.id });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a test route to create a sample location
router.get('/create-test', async (req, res) => {
  try {
    // Check if we already have locations
    const existingLocations = await Location.find();
    
    if (existingLocations.length > 0) {
      return res.json({ message: 'Test locations already exist', count: existingLocations.length });
    }
    
    // Create a test location
    const testLocation = new Location({
      name: 'Test Location',
      address: '123 Test Street, Test City',
      description: 'This is a test location created automatically.',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      },
      features: ['Parking', 'Restrooms', 'Electricity'],
      createdBy: '64f5a53e9d312e1f0d7be123' // Replace with a valid user ID from your database
    });
    
    await testLocation.save();
    
    res.json({ message: 'Test location created successfully', location: testLocation });
  } catch (error) {
    console.error('Error creating test location:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upload images to a location
router.post('/:id/images', protect, upload.array('images', 5), async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check if user is authorized to modify this location
    if (location.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    const newImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));
    
    location.images = [...location.images, ...newImages];
    await location.save();
    
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an image from a location
router.delete('/:id/images/:imageId', protect, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check if user is authorized to modify this location
    if (location.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    const imageToDelete = location.images.find(img => img._id.toString() === req.params.imageId);
    
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.publicId);
    
    // Remove from location
    location.images = location.images.filter(img => img._id.toString() !== req.params.imageId);
    await location.save();
    
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check if user already reviewed this location
    const alreadyReviewed = location.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Location already reviewed' });
    }
    
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user.id,
    };
    
    location.reviews.push(review);
    
    location.numReviews = location.reviews.length;
    
    location.rating =
      location.reviews.reduce((acc, item) => item.rating + acc, 0) /
      location.reviews.length;
    
    await location.save();
    
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    const review = location.reviews.find(
      (r) => r._id.toString() === req.params.reviewId
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is authorized to delete this review
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Remove the review
    location.reviews = location.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );
    
    location.numReviews = location.reviews.length;
    
    if (location.numReviews > 0) {
      location.rating =
        location.reviews.reduce((acc, item) => item.rating + acc, 0) /
        location.reviews.length;
    } else {
      location.rating = 0;
    }
    
    await location.save();
    
    res.status(200).json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 