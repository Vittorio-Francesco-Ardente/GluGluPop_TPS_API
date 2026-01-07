const axios = require('axios');

// Configurazione TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL;

/**
 * Helper per fare richieste a TMDB
 * Centralizza la logica di chiamata e gestione errori. semplifica il resto del programma.
 */
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY, //la chiave si trova in .env
        language: 'it-IT', // per ora richiede film in italiano
        ...params //questo indica gli altri parametri che verranno passati
      }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    throw new Error('Errore nel recupero dei film da TMDB');
  }
};

// ============================================
// TRAILER CACHE + HELPER
// ============================================
// Semplice cache in memoria per evitare chiamate ripetute a TMDB
// Key: movieId, Value: { key: string|null, expiresAt: number }
const TRAILER_TTL_MS = 1000 * 60 * 60 * 6; // 6 ore
const trailerCache = new Map();

const getCachedTrailer = (id) => {
  const entry = trailerCache.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    trailerCache.delete(id);
    return null;
  }
  return entry.key;
};

const setCachedTrailer = (id, key) => {
  trailerCache.set(id, { key, expiresAt: Date.now() + TRAILER_TTL_MS });
};

// Ritorna la YouTube key del trailer, se presente (altrimenti null)
const getTrailerKey = async (movieId) => {
  const cached = getCachedTrailer(movieId);
  if (cached !== null && cached !== undefined) return cached;

  // Prima prova lingua italiana, poi fallback a inglese
  const byLang = async (lang) => {
    const data = await tmdbRequest(`/movie/${movieId}/videos`, { language: lang });
    const trailer = data?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );
    return trailer?.key || null;
  };

  let key = await byLang('it-IT');
  if (!key) {
    key = await byLang('en-US');
  }

  setCachedTrailer(movieId, key || null);
  return key;
};

// ============================================
// OTTIENI FILM
// GET /api/movies/discover
// ============================================
/**
 * Scopri film con filtri opzionali
 * Usato per lo swipe principale dell'app
 */
exports.discoverMovies = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      genre = '', 
      year = '',
      sort_by = 'popularity.desc'
    } = req.query;

    // Parametri per TMDB
    const params = {
      page,
      sort_by,
      include_adult: false, // Escludi contenuti per adulti per ora
      include_video: false
    };

    // Aggiungi filtri opzionali
    if (genre) params.with_genres = genre;
    if (year) params.primary_release_year = year;

    const data = await tmdbRequest('/discover/movie', params);

    // contiene il formato dei dati da usare nel frontend.
    const moviesBase = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      genres: movie.genre_ids // IDs dei generi
    }));
    
    // inserisci il codice del trailer in moviesBase
    const movies = await Promise.all(
      moviesBase.map(async (m) => ({
        ...m,
        trailer: await getTrailerKey(m.id)
      }))
    );

    res.status(200).json({
      success: true,
      data: {
        movies,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI DETTAGLI FILM
// GET /api/movies/:id
// ============================================
/**
 * Dettagli completi di un singolo film
 * Include cast, generi dettagliati, runtime, ecc.
 */
exports.getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Richiedi dettagli + credits (cast) in una chiamata
    const data = await tmdbRequest(`/movie/${id}`, {
      append_to_response: 'credits,videos'
    });

    // Formatta i dati
    const movie = {
      id: data.id,
      title: data.title,
      originalTitle: data.original_title,
      overview: data.overview,
      poster: data.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${data.poster_path}` : null,
      backdrop: data.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${data.backdrop_path}` : null,
      releaseDate: data.release_date,
      runtime: data.runtime,
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
      genres: data.genres, // Array completo con id e nome
      budget: data.budget,
      revenue: data.revenue,
      
      // Cast (primi 10 attori)
      cast: data.credits?.cast?.slice(0, 10).map(person => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profilePath: person.profile_path ? `${TMDB_IMAGE_BASE_URL}/w185${person.profile_path}` : null
      })) || [],

      // Trailer (primo video YouTube)
      trailer: data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key || null
    };

    res.status(200).json({
      success: true,
      data: { movie }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CERCA FILM
// GET /api/movies/search?q=titolo
// ============================================
/**
 * Cerca film per titolo
 */
exports.searchMovies = async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query di ricerca mancante'
      });
    }

    const data = await tmdbRequest('/search/movie', {
      query: q,
      page,
      include_adult: false
    });

    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average
    }));

    res.status(200).json({
      success: true,
      data: {
        movies,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI FILM TRENDING
// GET /api/movies/trending
// ============================================
/**
 * Film più popolari del momento
 * Ottimo per homepage o "Scopri"
 */
exports.getTrendingMovies = async (req, res, next) => {
  try {
    const { timeWindow = 'week', withTrailer } = req.query; // 'day' o 'week'

    const data = await tmdbRequest(`/trending/movie/${timeWindow}`);

    let movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      genres: movie.genre_ids
    }));

    const includeTrailer = withTrailer === 'true' || withTrailer === '1';
    if (includeTrailer && Array.isArray(movies) && movies.length) {
      const enriched = await Promise.all(
        movies.map(async (m) => ({
          ...m,
          trailer: await getTrailerKey(m.id)
        }))
      );
      movies = enriched;
    }

    res.status(200).json({
      success: true,
      data: { movies }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// TRAILER SINGOLO
// GET /api/movies/:id/trailer
// ============================================
exports.getMovieTrailer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const key = await getTrailerKey(id);
    res.status(200).json({ success: true, data: { trailer: key } });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI LISTA GENERI
// GET /api/movies/genres
// ============================================
/**
 * Lista completa dei generi disponibili
 * Utile per filtri e per convertire genre_ids in nomi
 */
exports.getGenres = async (req, res, next) => {
  try {
    const data = await tmdbRequest('/genre/movie/list');

    res.status(200).json({
      success: true,
      data: {
        genres: data.genres
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OTTIENI FILM SIMILI
// GET /api/movies/:id/similar
// ============================================
/**
 * Film simili a quello specificato
 * Utile per raccomandazioni
 */
exports.getSimilarMovies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const data = await tmdbRequest(`/movie/${id}/similar`, { page });

    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average
    }));

    res.status(200).json({
      success: true,
      data: { movies }
    });
  } catch (error) {
    next(error);
  }
};
