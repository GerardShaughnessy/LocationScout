const Location = require('../models/Location');

const searchController = {
  // Search locations
  searchLocations: async (req, res) => {
    try {
      const {
        query,
        category,
        minSquareFootage,
        maxSquareFootage,
        hasParking,
        hasElevator,
        minSafetyRating
      } = req.query;

      // Build search criteria
      const searchCriteria = {
        $or: [
          { privacy: 'public' },
          { privacy: 'shared' },
          { createdBy: req.user._id }
        ]
      };

      // Add text search if query provided
      if (query) {
        searchCriteria.$or = [
          { name: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } }
        ];
      }

      // Add filters
      if (category) searchCriteria.category = category;
      if (minSquareFootage) searchCriteria['specs.squareFootage'] = { $gte: parseInt(minSquareFootage) };
      if (maxSquareFootage) searchCriteria['specs.squareFootage'] = { ...searchCriteria['specs.squareFootage'], $lte: parseInt(maxSquareFootage) };
      if (hasParking === 'true') searchCriteria['specs.parking'] = { $exists: true, $ne: null };
      if (hasElevator === 'true') searchCriteria['specs.elevator'] = true;
      if (minSafetyRating) searchCriteria['neighborhood.safetyRating'] = { $gte: parseInt(minSafetyRating) };

      const locations = await Location.find(searchCriteria)
        .populate('createdBy', 'name email')
        .sort('-createdAt');

      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = searchController; 