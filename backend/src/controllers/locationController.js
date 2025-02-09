const Location = require('../models/Location');
const MapService = require('../services/mapService');
const StorageService = require('../services/storageService');

class LocationController {
  async getLocations(req, res) {
    try {
      const { bounds, types, search } = req.query;
      let query = {};

      // Add bounds filtering if provided
      if (bounds) {
        const [swLng, swLat, neLng, neLat] = bounds.split(',').map(Number);
        query.coordinates = {
          $geoWithin: {
            $box: [[swLng, swLat], [neLng, neLat]]
          }
        };
      }

      // Add type filtering
      if (types) {
        query.type = { $in: types.split(',') };
      }

      // Add text search
      if (search) {
        query.$text = { $search: search };
      }

      const locations = await Location.find(query)
        .limit(100) // Limit results for performance
        .populate('createdBy', 'name email');

      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createLocation(req, res) {
    try {
      const { name, description, coordinates, type } = req.body;
      
      // Handle photo uploads
      const photoUrls = [];
      if (req.files) {
        for (const file of req.files) {
          const url = await StorageService.uploadPhoto(file);
          photoUrls.push(url);
        }
      }

      const location = new Location({
        name,
        description,
        coordinates: {
          type: 'Point',
          coordinates: coordinates.split(',').map(Number)
        },
        type,
        photos: photoUrls,
        createdBy: req.user._id
      });

      await location.save();
      res.status(201).json(location);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOfflineRegionData(req, res) {
    try {
      const { bounds, zoom } = req.body;
      
      // Validate request size to prevent excessive downloads
      const tileCount = MapService.calculateTileCount(bounds, zoom);
      if (tileCount > 1000) {
        return res.status(400).json({ 
          error: 'Requested region too large. Please select a smaller area.' 
        });
      }

      // Get locations within bounds
      const locations = await Location.find({
        coordinates: {
          $geoWithin: {
            $box: [
              [bounds.sw.lng, bounds.sw.lat],
              [bounds.ne.lng, bounds.ne.lat]
            ]
          }
        }
      }).select('name coordinates type photos.thumbnail');

      // Get map tiles for offline use
      const mapData = await MapService.getOfflineMapData(bounds, zoom);

      res.json({
        locations,
        mapData,
        timestamp: new Date(),
        expiresIn: '7d' // Data valid for 7 days
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LocationController(); 