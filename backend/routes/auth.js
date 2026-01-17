const express = require('express');
const { login, register, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
// HAPUS DULU validateLogin import

const router = express.Router();

// Public routes - TANPA VALIDATION DULU
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/profile', authenticate, getProfile);

module.exports = router;