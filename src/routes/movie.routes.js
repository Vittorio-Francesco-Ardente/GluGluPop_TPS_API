const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');

// Tutte le route protette - serve essere autenticati
// Perché? Per tracciare quali film l'utente ha già visto e non riproporli

// ============================================
// DISCOVER - Film da swipare
// ============================================
router.get('/discover', protect, movieController.discoverMovies);

// ============================================
// TRENDING - Film popolari
// ============================================
router.get('/trending', protect, movieController.getTrendingMovies);

// ============================================
// SEARCH - Cerca film
// ============================================
router.get('/search', protect, movieController.searchMovies);

// ============================================
// GENRES - Lista generi
// ============================================
router.get('/genres', protect, movieController.getGenres);

// ============================================
// DETTAGLI FILM SINGOLO
// ============================================
router.get('/:id', protect, movieController.getMovieDetails);

// ============================================
// FILM SIMILI
// ============================================
router.get('/:id/similar', protect, movieController.getSimilarMovies);

// ============================================
// TRAILER SINGOLO
// ============================================
router.get('/:id/trailer', protect, movieController.getMovieTrailer);

module.exports = router;
