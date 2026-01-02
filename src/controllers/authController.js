const { User } = require('../models');

// ============================================
// REGISTRAZIONE
// POST /api/auth/register
// ============================================
exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Controlla se utente esiste già
    const existingUser = await User.findOne({ 
      where: { email } 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email già registrata'
      });
    }

    const existingUsername = await User.findOne({ 
      where: { username } 
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username già in uso'
      });
    }

    // Crea utente
    const user = await User.create({
      email,
      password,
      username
    });

    // Genera token
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: 'Registrazione completata! 🎉',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// LOGIN
// POST /api/auth/login
// ============================================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Trova utente
    const user = await User.findOne({ 
      where: { email } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Verifica password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Genera token
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Login effettuato! 👋',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          genresPreferred: user.genresPreferred,
          totalLikes: user.totalLikes,
          totalSkips: user.totalSkips
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET PROFILO UTENTE CORRENTE
// GET /api/auth/me
// ============================================
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          genresPreferred: user.genresPreferred,
          totalLikes: user.totalLikes,
          totalSkips: user.totalSkips,
          totalWatched: user.totalWatched,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// AGGIORNA PREFERENZE
// PUT /api/auth/preferences
// ============================================
exports.updatePreferences = async (req, res, next) => {
  try {
    const { genresPreferred } = req.body;

    const user = await User.findByPk(req.user.id);

    if (genresPreferred) {
      user.genresPreferred = genresPreferred;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferenze aggiornate! ✅',
      data: {
        genresPreferred: user.genresPreferred
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// AGGIORNA PROFILO
// PUT /api/auth/profile
// ============================================
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findByPk(req.user.id);

    if (username) {
      // Controlla se username è già in uso
      const existingUsername = await User.findOne({ 
        where: { username } 
      });

      if (existingUsername && existingUsername.id !== user.id) {
        return res.status(400).json({
          success: false,
          message: 'Username già in uso'
        });
      }

      user.username = username;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profilo aggiornato! ✅',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};