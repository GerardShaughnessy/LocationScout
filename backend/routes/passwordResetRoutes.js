const express = require('express');
const router = express.Router();
const { requestReset, resetPassword } = require('../controllers/passwordResetController');

// Request password reset
router.post('/request', requestReset);

// Reset password
router.post('/reset', resetPassword);

module.exports = router; 