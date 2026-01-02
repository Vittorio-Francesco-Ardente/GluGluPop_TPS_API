const express = require('express');
const router = express.Router();
const {
  getRecommendationProfile,
  getSimilarMoviesData,
  getGenreRecommendations
} = require('../controllers/recommendationController');
const { protect } = require('../middlewares/authMiddleware');

// Tutte le rotte richiedono autenticazione
router.use(protect);

router.get('/profile', getRecommendationProfile);
router.get('/similar', getSimilarMoviesData);
router.get('/genres', getGenreRecommendations);

module.exports = router;