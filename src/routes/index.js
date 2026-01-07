const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const swipeRoutes = require('./swipe.routes');
const groupRoutes = require('./group.routes');
const recommendationRoutes = require('./recommendation.routes');
const movieRoutes = require('./movie.routes');

// Usa le routes
router.use('/auth', authRoutes);
router.use('/swipes', swipeRoutes);
router.use('/groups', groupRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/movies', movieRoutes);

// ============================================
// HEALTH CHECK
// ============================================
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎬 GluGluPop API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ============================================
// API STATUS - Mostra tutti gli endpoints
// ============================================
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    environment: process.env.NODE_ENV,
    database: 'SQLite',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Registrazione utente',
        'POST /api/auth/login': 'Login utente',
        'GET /api/auth/me': 'Profilo utente (🔒)',
        'PUT /api/auth/preferences': 'Aggiorna preferenze (🔒)',
        'PUT /api/auth/profile': 'Aggiorna profilo (🔒)'
      },
      swipes: {
        'POST /api/swipes': 'Registra swipe (🔒)',
        'GET /api/swipes/likes': 'Lista film piaciuti (🔒)',
        'GET /api/swipes/history': 'Storico swipes (🔒)',
        'GET /api/swipes/seen-ids': 'IDs film già visti (🔒)',
        'GET /api/swipes/stats': 'Statistiche swipe (🔒)',
        'DELETE /api/swipes/:movieId': 'Rimuovi swipe (🔒)'
      },
      groups: {
        'GET /api/groups': 'I miei gruppi (🔒)',
        'POST /api/groups': 'Crea gruppo (🔒)',
        'POST /api/groups/join': 'Unisciti a gruppo (🔒)',
        'GET /api/groups/:id': 'Dettagli gruppo (🔒)',
        'POST /api/groups/:id/vote': 'Vota film (🔒)',
        'GET /api/groups/:id/matches': 'Match del gruppo (🔒)',
        'DELETE /api/groups/:id/leave': 'Esci dal gruppo (🔒)',
        'DELETE /api/groups/:id': 'Elimina gruppo (🔒)'
      },
      recommendations: {
        'GET /api/recommendations/profile': 'Profilo raccomandazioni (🔒)',
        'GET /api/recommendations/similar': 'Film simili ai liked (🔒)',
        'GET /api/recommendations/genres': 'Generi consigliati (🔒)'
      },
      movies: {
        'GET /api/movies/discover': 'Scopri film con filtri (🔒)',
        'GET /api/movies/trending': 'Film popolari della settimana (🔒)',
        'GET /api/movies/search?q=titolo': 'Cerca film per titolo (🔒)',
        'GET /api/movies/genres': 'Lista generi disponibili (🔒)',
        'GET /api/movies/:id': 'Dettagli completi film (🔒)',
        'GET /api/movies/:id/similar': 'Film simili (🔒)'
      }
    },
    legend: '🔒 = Richiede token JWT'
  });
});

module.exports = router;