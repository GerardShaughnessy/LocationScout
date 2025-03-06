const Location = require('../models/Location');

const ratingController = {
  // Add rating to location
  addRating: async (req, res) => {
    try {
      const { locationId } = req.params;
      const { score, department } = req.body;

      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      // Add new rating
      location.ratings.push({
        score,
        department,
        user: req.user._id,
        date: new Date()
      });

      await location.save();
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add comment to location
  addComment: async (req, res) => {
    try {
      const { locationId } = req.params;
      const { text, department } = req.body;

      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      // Add new comment
      location.comments.push({
        text,
        department,
        user: req.user._id,
        date: new Date()
      });

      await location.save();
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = ratingController; 