const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Upload route working!' });
});

// Get upload URL endpoint
router.post('/get-upload-url', uploadController.getUploadUrl);

module.exports = router; 