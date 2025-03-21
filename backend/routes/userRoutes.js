const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Refresh token
router.post('/refresh-token', userController.refreshToken);

// Delete account
router.delete('/:id', protect, userController.deleteAccount);

module.exports = router; 