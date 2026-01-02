const Joi = require('joi');

/**
 * Middleware generico per validazione con Joi
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Errore validazione',
        errors
      });
    }
    
    next();
  };
};

// ============================================
// SCHEMI DI VALIDAZIONE
// ============================================
const schemas = {
  // Registrazione utente
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email non valida',
      'any.required': 'Email obbligatoria'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password minimo 6 caratteri',
      'any.required': 'Password obbligatoria'
    }),
    username: Joi.string().min(3).max(20).required().messages({
      'string.min': 'Username minimo 3 caratteri',
      'string.max': 'Username massimo 20 caratteri',
      'any.required': 'Username obbligatorio'
    })
  }),
  
  // Login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  // Swipe su film
  swipe: Joi.object({
    movieId: Joi.number().required(),
    movieTitle: Joi.string().required(),
    moviePoster: Joi.string().allow('', null),
    movieGenres: Joi.array().items(Joi.number()),
    action: Joi.string().valid('like', 'skip', 'superlike').required()
  }),
  
  // Creazione gruppo
  createGroup: Joi.object({
    name: Joi.string().max(50).required()
  }),
  
  // Voto gruppo
  groupVote: Joi.object({
    movieId: Joi.number().required(),
    movieTitle: Joi.string().required(),
    moviePoster: Joi.string().allow('', null),
    vote: Joi.string().valid('like', 'skip').required()
  })
};

module.exports = { validate, schemas };