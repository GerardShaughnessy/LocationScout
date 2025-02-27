const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Location = require('../models/Location');

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

module.exports = router; 