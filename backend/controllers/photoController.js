const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const Location = require('../models/Location');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const photoController = {
  // Get upload URL
  getPhotoUploadUrl: async (req, res) => {
    try {
      const { locationId } = req.params;
      const { fileName, fileType } = req.body;

      // Check if location exists and user has access
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      const key = `locations/${locationId}/photos/${Date.now()}-${fileName}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      res.json({
        uploadUrl,
        key,
        photoUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add photo to location
  addPhotoToLocation: async (req, res) => {
    try {
      const { locationId } = req.params;
      const { photoUrl, caption } = req.body;

      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      location.photos.push({
        url: photoUrl,
        caption,
        uploadedBy: req.user._id,
        uploadDate: new Date()
      });

      await location.save();
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = photoController; 