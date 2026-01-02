const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware per proteggere le rotte
 * Verifica il token JWT nell'header Authorization
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Controlla header Authorization: "Bearer TOKEN"
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accesso non autorizzato. Token mancante.'
      });
    }

    // Verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trova utente con Sequelize
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    // Aggiungi utente alla richiesta
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token non valido o scaduto'
    });
  }
};

module.exports = { protect };