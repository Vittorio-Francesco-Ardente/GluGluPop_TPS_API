// ============================================
// TASTEDIVE API SERVICE
// Suggerimenti per affinità di contenuti
// ============================================

import { API_CONFIG } from '../config/api';

const { BASE_URL, API_KEY } = API_CONFIG.TASTEDIVE;

// TasteDive ha limitazioni CORS, quindi usiamo JSONP o un proxy
// In produzione, usa un backend proxy

// Helper per le richieste (con JSONP fallback)
const fetchTasteDive = async (params = {}) => {
  const searchParams = new URLSearchParams({
    k: API_KEY,
    ...params
  });

  try {
    // Tentativo diretto (potrebbe fallire per CORS)
    const response = await fetch(`${BASE_URL}/similar?${searchParams}`);
    if (!response.ok) {
      throw new Error(`TasteDive API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('TasteDive fetch error:', error);
    // Fallback: restituisci dati vuoti o usa cache locale
    return { Similar: { Results: [] } };
  }
};

// ============================================
// SIMILAR CONTENT
// ============================================

// Ottieni contenuti simili
export const getSimilarContent = async (query, options = {}) => {
  const {
    type = null,        // 'movie', 'show', 'music', 'book', 'author', 'game', 'podcast'
    info = 1,           // 0 = solo nomi, 1 = con descrizioni
    limit = 10          // numero risultati
  } = options;

  const params = {
    q: query,
    info,
    limit
  };

  if (type) {
    params.type = type;
  }

  const data = await fetchTasteDive(params);
  return transformResults(data);
};

// Ottieni film simili
export const getSimilarMovies = async (movieTitle, limit = 10) => {
  return getSimilarContent(movieTitle, {
    type: 'movie',
    limit,
    info: 1
  });
};

// Ottieni serie TV simili
export const getSimilarShows = async (showTitle, limit = 10) => {
  return getSimilarContent(showTitle, {
    type: 'show',
    limit,
    info: 1
  });
};

// Ottieni musica simile (per colonne sonore)
export const getSimilarMusic = async (artistOrSong, limit = 10) => {
  return getSimilarContent(artistOrSong, {
    type: 'music',
    limit,
    info: 1
  });
};

// Ottieni libri simili (per adattamenti)
export const getSimilarBooks = async (bookTitle, limit = 10) => {
  return getSimilarContent(bookTitle, {
    type: 'book',
    limit,
    info: 1
  });
};

// ============================================
// MULTIPLE QUERIES
// ============================================

// Suggerimenti basati su più film
export const getRecommendationsFromMultiple = async (titles, options = {}) => {
  const {
    type = 'movie',
    limit = 15,
    info = 1
  } = options;

  // TasteDive accetta query multiple separate da virgola
  const query = titles.slice(0, 5).join(', '); // Max 5 per query

  const params = {
    q: query,
    type,
    limit,
    info
  };

  const data = await fetchTasteDive(params);
  
  // Filtra i risultati rimuovendo i titoli di input
  const inputTitlesLower = titles.map(t => t.toLowerCase());
  const results = transformResults(data);
  
  return {
    ...results,
    results: results.results.filter(
      r => !inputTitlesLower.includes(r.name.toLowerCase())
    )
  };
};

// ============================================
// TASTE PROFILE
// ============================================

// Genera profilo di gusto basato su lista di preferiti
export const generateTasteProfile = async (likedTitles) => {
  if (!likedTitles.length) {
    return {
      recommendations: [],
      genres: [],
      themes: []
    };
  }

  // Ottieni raccomandazioni
  const recs = await getRecommendationsFromMultiple(likedTitles, {
    type: 'movie',
    limit: 20
  });

  // Analizza pattern nelle descrizioni
  const allDescriptions = recs.results
    .map(r => r.description)
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Estrai temi comuni
  const themeKeywords = {
    'sci-fi': ['science fiction', 'sci-fi', 'futuristic', 'space', 'alien'],
    'thriller': ['thriller', 'suspense', 'tension', 'mystery'],
    'action': ['action', 'fight', 'chase', 'explosive'],
    'drama': ['drama', 'emotional', 'relationship', 'family'],
    'comedy': ['comedy', 'funny', 'humor', 'hilarious'],
    'horror': ['horror', 'scary', 'terror', 'frightening'],
    'romance': ['romance', 'love', 'romantic', 'relationship'],
    'adventure': ['adventure', 'journey', 'quest', 'exploration']
  };

  const detectedThemes = [];
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    const matches = keywords.filter(kw => allDescriptions.includes(kw)).length;
    if (matches > 0) {
      detectedThemes.push({ theme, score: matches });
    }
  }

  detectedThemes.sort((a, b) => b.score - a.score);

  return {
    recommendations: recs.results,
    themes: detectedThemes.slice(0, 5).map(t => t.theme),
    basedOn: likedTitles
  };
};

// ============================================
// CROSS-MEDIA RECOMMENDATIONS
// ============================================

// Suggerimenti cross-media (film -> musica, libri, etc.)
export const getCrossMediaRecommendations = async (title) => {
  const [movies, shows, music, books] = await Promise.all([
    getSimilarMovies(title, 5),
    getSimilarShows(title, 5),
    getSimilarMusic(title, 5),
    getSimilarBooks(title, 3)
  ]);

  return {
    movies: movies.results,
    shows: shows.results,
    music: music.results,
    books: books.results
  };
};

// ============================================
// TRANSFORMERS
// ============================================

function transformResults(data) {
  const info = data.Similar?.Info || [];
  const results = data.Similar?.Results || [];

  return {
    query: info.map(i => ({
      name: i.Name,
      type: i.Type
    })),
    results: results.map(r => ({
      name: r.Name,
      type: r.Type,
      description: r.wTeaser || r.wUrl ? r.wTeaser : null,
      wikipediaUrl: r.wUrl || null,
      youtubeUrl: r.yUrl || null,
      youtubeId: r.yID || null
    }))
  };
}

// ============================================
// LOCAL FALLBACK DATA
// ============================================

// Database locale per fallback quando API non disponibile
const localSimilarityData = {
  'Inception': ['Interstellar', 'The Matrix', 'Memento', 'Shutter Island', 'Tenet', 'The Prestige'],
  'Interstellar': ['Inception', 'Gravity', 'The Martian', 'Arrival', '2001: A Space Odyssey', 'Contact'],
  'The Dark Knight': ['Batman Begins', 'The Dark Knight Rises', 'Joker', 'Logan', 'Watchmen'],
  'Pulp Fiction': ['Reservoir Dogs', 'Kill Bill', 'Snatch', 'Lock Stock', 'Fight Club'],
  'The Godfather': ['Goodfellas', 'Scarface', 'The Godfather Part II', 'Casino', 'Once Upon a Time in America']
};

// Fallback locale
export const getLocalSimilar = (title) => {
  const key = Object.keys(localSimilarityData).find(
    k => k.toLowerCase() === title.toLowerCase()
  );
  
  if (key) {
    return localSimilarityData[key].map(name => ({
      name,
      type: 'movie',
      description: null
    }));
  }
  
  return [];
};

// Export default
export default {
  getSimilarContent,
  getSimilarMovies,
  getSimilarShows,
  getSimilarMusic,
  getSimilarBooks,
  getRecommendationsFromMultiple,
  generateTasteProfile,
  getCrossMediaRecommendations,
  getLocalSimilar
};
