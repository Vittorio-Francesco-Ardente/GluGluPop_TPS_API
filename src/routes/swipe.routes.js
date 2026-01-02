const express = require('express');
const router = express.Router();
const {
  createSwipe,
  getLikes,
  getHistory,
  getSeenIds,
  deleteSwipe,
  getStats
} = require('../controllers/swipeController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validateRequest');

// Tutte le rotte richiedono autenticazione
router.use(protect);

router.post('/', validate(schemas.swipe), createSwipe);
router.get('/likes', getLikes);
router.get('/history', getHistory);
router.get('/seen-ids', getSeenIds);
router.get('/stats', getStats);
router.delete('/:movieId', deleteSwipe);

module.exports = router;