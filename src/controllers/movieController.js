const axios = require('axios');

// Configurazione TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL;

/**
 * Helper per fare richieste a TMDB
 * Centralizza la logica di chiamata e gestione errori
 */
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'it-IT', // Film in italiano
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    throw new Error('Errore nel recupero dei film da TMDB');
  }
};

// ============================================
// OTTIENI FILM POPOLARI/DISCOVER
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
      include_adult: false, // Escludi contenuti per adulti
      include_video: false
    };

    // Aggiungi filtri opzionali
    if (genre) params.with_genres = genre;
    if (year) params.primary_release_year = year;

    const data = await tmdbRequest('/discover/movie', params);

    // Formato i dati per il frontend
    const movies = data.results.map(movie => ({
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
    const { timeWindow = 'week' } = req.query; // 'day' o 'week'

    const data = await tmdbRequest(`/trending/movie/${timeWindow}`);

    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      genres: movie.genre_ids
    }));

    res.status(200).json({
      success: true,
      data: { movies }
    });
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
