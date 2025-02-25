const Location = require('../models/Location');

const locationController = {
  // Create new location
  createLocation: async (req, res) => {
    try {
      const location = await Location.create({
        ...req.body,
        createdBy: req.user._id
      });
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all locations (based on privacy settings)
  getLocations: async (req, res) => {
    try {
      const locations = await Location.find({
        $or: [
          { privacy: 'public' },
          { privacy: 'shared' },
          { createdBy: req.user._id }
        ]
      });
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get location by ID
  getLocationById: async (req, res) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }
      
      // Check privacy settings
      if (location.privacy === 'private' && 
          location.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update location
  updateLocation: async (req, res) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      // Check ownership
      if (location.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedLocation = await Location.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete location
  deleteLocation: async (req, res) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      // Check ownership
      if (location.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await location.remove();
      res.json({ message: 'Location removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = locationController; 