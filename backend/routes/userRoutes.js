const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Refresh token
router.post('/refresh-token', userController.refreshToken);

module.exports = router; 