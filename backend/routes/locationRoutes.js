const { upload, cloudinary } = require('../config/cloudinary');

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