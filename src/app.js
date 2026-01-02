const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());

// ============================================
// CORS - Permetti richieste dal frontend
// ============================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// ============================================
// RATE LIMITING - Protezione spam
// ============================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // 100 richieste per IP
  message: {
    success: false,
    message: 'Troppe richieste, riprova tra 15 minuti'
  }
});
app.use('/api', limiter);

// ============================================
// BODY PARSER
// ============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// LOGGING (solo in development)
// ============================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================================
// ROUTES
// ============================================
app.use('/api', routes);

// ============================================
// 404 HANDLER
// ============================================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trovata`
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use(errorHandler);

module.exports = app;