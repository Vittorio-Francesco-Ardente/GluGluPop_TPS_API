const { Swipe, User } = require('../models');
const { Op } = require('sequelize');

// ============================================
// REGISTRA SWIPE (like/skip/superlike)
// POST /api/swipes
// ============================================
exports.createSwipe = async (req, res, next) => {
  try {
    const { movieId, movieTitle, moviePoster, movieGenres, action } = req.body;
    const userId = req.user.id;

    // Controlla se esiste già uno swipe per questo film
    let swipe = await Swipe.findOne({
      where: { userId, movieId }
    });

    if (swipe) {
      // Aggiorna swipe esistente
      swipe.action = action;
      swipe.movieTitle = movieTitle;
      swipe.moviePoster = moviePoster;
      swipe.movieGenres = movieGenres;
      await swipe.save();
    } else {
      // Crea nuovo swipe
      swipe = await Swipe.create({
        userId,
        movieId,
        movieTitle,
        moviePoster,
        movieGenres,
        action
      });

      // Aggiorna statistiche utente
      const user = await User.findByPk(userId);
      if (action === 'like' || action === 'superlike') {
        user.totalLikes += 1;
      } else {
        user.totalSkips += 1;
      }
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: action === 'like' ? '❤️ Film aggiunto ai preferiti!' : '⏭️ Film saltato',
      data: { swipe }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI TUTTI I LIKE
// GET /api/swipes/likes
// ============================================
exports.getLikes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: likes } = await Swipe.findAndCountAll({
      where: {
        userId: req.user.id,
        action: { [Op.in]: ['like', 'superlike'] }
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      data: {
        likes,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI STORICO SWIPES
// GET /api/swipes/history
// ============================================
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const { count, rows: swipes } = await Swipe.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      data: {
        swipes,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI IDS FILM GIÀ VISTI (per non riproporli)
// GET /api/swipes/seen-ids
// ============================================
exports.getSeenIds = async (req, res, next) => {
  try {
    const swipes = await Swipe.findAll({
      where: { userId: req.user.id },
      attributes: ['movieId']
    });

    const seenIds = swipes.map(s => s.movieId);

    res.status(200).json({
      success: true,
      data: { seenIds }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ELIMINA SWIPE (rimuovi dai preferiti)
// DELETE /api/swipes/:movieId
// ============================================
exports.deleteSwipe = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const swipe = await Swipe.findOne({
      where: {
        userId: req.user.id,
        movieId
      }
    });

    if (!swipe) {
      return res.status(404).json({
        success: false,
        message: 'Swipe non trovato'
      });
    }

    // Aggiorna statistiche
    const user = await User.findByPk(req.user.id);
    if (swipe.action === 'like' || swipe.action === 'superlike') {
      user.totalLikes = Math.max(0, user.totalLikes - 1);
    } else {
      user.totalSkips = Math.max(0, user.totalSkips - 1);
    }
    await user.save();

    await swipe.destroy();

    res.status(200).json({
      success: true,
      message: 'Swipe eliminato! 🗑️'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// STATISTICHE SWIPE
// GET /api/swipes/stats
// ============================================
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalLikes = await Swipe.count({
      where: { userId, action: { [Op.in]: ['like', 'superlike'] } }
    });

    const totalSkips = await Swipe.count({
      where: { userId, action: 'skip' }
    });

    const totalSwipes = totalLikes + totalSkips;
    const likeRate = totalSwipes > 0 
      ? ((totalLikes / totalSwipes) * 100).toFixed(1) 
      : 0;

    // Generi più apprezzati
    const likedSwipes = await Swipe.findAll({
      where: { userId, action: { [Op.in]: ['like', 'superlike'] } }
    });

    const genreCount = {};
    likedSwipes.forEach(swipe => {
      const genres = swipe.movieGenres || [];
      genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const favoriteGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genreId, count]) => ({ genreId: parseInt(genreId), count }));

    res.status(200).json({
      success: true,
      data: {
        totalLikes,
        totalSkips,
        totalSwipes,
        likeRate: `${likeRate}%`,
        favoriteGenres
      }
    });
  } catch (error) {
    next(error);
  }
};