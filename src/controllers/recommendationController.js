const { Swipe, User } = require('../models');
const { Op } = require('sequelize');

// ============================================
// OTTIENI PROFILO RACCOMANDAZIONI
// GET /api/recommendations/profile
// ============================================
exports.getRecommendationProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Ottieni tutti i like dell'utente
    const likes = await Swipe.findAll({
      where: {
        userId,
        action: { [Op.in]: ['like', 'superlike'] }
      }
    });

    // Conta frequenza generi
    const genreCount = {};
    likes.forEach(like => {
      const genres = like.movieGenres || [];
      genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    // Ordina generi per frequenza
    const favoriteGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genreId, count]) => ({
        genreId: parseInt(genreId),
        count
      }));

    // Ottieni IDs film già visti
    const allSwipes = await Swipe.findAll({
      where: { userId },
      attributes: ['movieId']
    });
    const seenMovieIds = allSwipes.map(s => s.movieId);

    // Statistiche
    const totalSwipes = allSwipes.length;
    const totalLikes = likes.length;

    res.status(200).json({
      success: true,
      data: {
        favoriteGenres,
        seenMovieIds,
        stats: {
          totalLikes,
          totalSwipes,
          likeRate: totalSwipes > 0 
            ? ((totalLikes / totalSwipes) * 100).toFixed(1) + '%'
            : '0%'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI FILM SIMILI AI LIKED (IDs per query TMDb)
// GET /api/recommendations/similar
// ============================================
exports.getSimilarMoviesData = async (req, res, next) => {
  try {
    // Ottieni ultimi 10 like
    const recentLikes = await Swipe.findAll({
      where: {
        userId: req.user.id,
        action: { [Op.in]: ['like', 'superlike'] }
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['movieId', 'movieTitle']
    });

    res.status(200).json({
      success: true,
      data: {
        recentLikedMovies: recentLikes.map(l => ({
          movieId: l.movieId,
          movieTitle: l.movieTitle
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// SUGGERIMENTI BASATI SUI GENERI PREFERITI
// GET /api/recommendations/genres
// ============================================
exports.getGenreRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Ottieni tutti i like
    const likes = await Swipe.findAll({
      where: {
        userId,
        action: { [Op.in]: ['like', 'superlike'] }
      }
    });

    // Conta generi
    const genreCount = {};
    likes.forEach(like => {
      const genres = like.movieGenres || [];
      genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    // Top 3 generi
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genreId]) => parseInt(genreId));

    // Film già visti
    const allSwipes = await Swipe.findAll({
      where: { userId },
      attributes: ['movieId']
    });
    const seenMovieIds = allSwipes.map(s => s.movieId);

    res.status(200).json({
      success: true,
      data: {
        recommendedGenreIds: topGenres,
        excludeMovieIds: seenMovieIds,
        message: 'Usa questi generi per chiamare TMDb /discover/movie'
      }
    });
  } catch (error) {
    next(error);
  }
};