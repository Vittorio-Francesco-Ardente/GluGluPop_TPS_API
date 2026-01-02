const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePreferences,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validateRequest');

// Rotte pubbliche (no token)
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);

// Rotte protette (richiedono token)
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.put('/profile', protect, updateProfile);

module.exports = router;