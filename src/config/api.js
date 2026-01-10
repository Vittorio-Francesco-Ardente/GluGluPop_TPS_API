// ============================================
// API CONFIGURATION
// ============================================
// Per sicurezza, in produzione usa variabili d'ambiente (.env)
// REACT_APP_TMDB_API_KEY=your_key
// REACT_APP_YOUTUBE_API_KEY=your_key
// etc.

export const API_CONFIG = {
  // TMDb - The Movie Database
  // Registrati su: https://www.themoviedb.org/settings/api
  TMDB: {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.REACT_APP_TMDB_API_KEY || 'YOUR_TMDB_API_KEY',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    POSTER_SIZE: 'w500',
    BACKDROP_SIZE: 'w1280',
    LANGUAGE: 'it-IT'
  },

  // YouTube Data API v3
  // Registrati su: https://console.cloud.google.com/apis/credentials
  YOUTUBE: {
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
    API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
    EMBED_URL: 'https://www.youtube.com/embed'
  },

  // TasteDive API (ex TasteKid)
  // Registrati su: https://tastedive.com/read/api
  TASTEDIVE: {
    BASE_URL: 'https://tastedive.com/api',
    API_KEY: process.env.REACT_APP_TASTEDIVE_API_KEY || 'YOUR_TASTEDIVE_API_KEY'
  },

  // Spoonacular API
  // Registrati su: https://spoonacular.com/food-api
  SPOONACULAR: {
    BASE_URL: 'https://api.spoonacular.com',
    API_KEY: process.env.REACT_APP_SPOONACULAR_API_KEY || 'YOUR_SPOONACULAR_API_KEY'
  },

  // TheCocktailDB API
  // API gratuita: https://www.thecocktaildb.com/api.php
  COCKTAILDB: {
    BASE_URL: 'https://www.thecocktaildb.com/api/json/v1/1',
    // API key gratuita per sviluppo
    API_KEY: '1'
  },

  // Watchmode API (alternativa a JustWatch che non ha API pubblica)
  // Registrati su: https://api.watchmode.com/
  WATCHMODE: {
    BASE_URL: 'https://api.watchmode.com/v1',
    API_KEY: process.env.REACT_APP_WATCHMODE_API_KEY || 'YOUR_WATCHMODE_API_KEY'
  }
};

// Mapping regioni per streaming
export const STREAMING_REGIONS = {
  IT: 'it',
  US: 'us',
  UK: 'gb',
  DE: 'de',
  FR: 'fr',
  ES: 'es'
};

// Mapping provider streaming
export const STREAMING_PROVIDERS = {
  8: { name: 'Netflix', logo: 'netflix' },
  9: { name: 'Prime Video', logo: 'prime' },
  337: { name: 'Disney+', logo: 'disney' },
  119: { name: 'Prime Video', logo: 'prime' },
  350: { name: 'Apple TV+', logo: 'apple' },
  359: { name: 'SkyGo', logo: 'sky' },
  109: { name: 'NOW TV', logo: 'now' },
  39: { name: 'NOW TV', logo: 'now' },
  531: { name: 'Paramount+', logo: 'paramount' }
};

// Generi film per mapping
export const MOVIE_GENRES = {
  28: 'Azione',
  12: 'Avventura',
  16: 'Animazione',
  35: 'Commedia',
  80: 'Crime',
  99: 'Documentario',
  18: 'Drammatico',
  10751: 'Famiglia',
  14: 'Fantasy',
  36: 'Storia',
  27: 'Horror',
  10402: 'Musica',
  9648: 'Mistero',
  10749: 'Romance',
  878: 'Fantascienza',
  10770: 'Film TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Western'
};
