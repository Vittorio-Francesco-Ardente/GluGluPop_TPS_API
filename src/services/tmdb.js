// ============================================
// TMDb API SERVICE
// The Movie Database - Catalogo Film e Serie TV
// ============================================

import { API_CONFIG, MOVIE_GENRES } from '../config/api';

const { BASE_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE, LANGUAGE } = API_CONFIG.TMDB;

// Helper per costruire URL immagini
export const getImageUrl = (path, size = POSTER_SIZE) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Helper per le richieste
const fetchTMDb = async (endpoint, params = {}) => {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: LANGUAGE,
    ...params
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`);
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('TMDb fetch error:', error);
    throw error;
  }
};

// ============================================
// FILM ENDPOINTS
// ============================================

// Film popolari
export const getPopularMovies = async (page = 1) => {
  const data = await fetchTMDb('/movie/popular', { page });
  return {
    ...data,
    results: data.results.map(transformMovie)
  };
};

// Film in tendenza (oggi/settimana)
export const getTrendingMovies = async (timeWindow = 'week') => {
  const data = await fetchTMDb(`/trending/movie/${timeWindow}`);
  return {
    ...data,
    results: data.results.map(transformMovie)
  };
};

// Film in uscita
export const getNowPlayingMovies = async (page = 1) => {
  const data = await fetchTMDb('/movie/now_playing', { page, region: 'IT' });
  return {
    ...data,
    results: data.results.map(transformMovie)
  };
};

// Film in arrivo
export const getUpcomingMovies = async (page = 1) => {
  const data = await fetchTMDb('/movie/upcoming', { page, region: 'IT' });
  return {
    ...data,
    results: data.results.map(transformMovie)
  };
};

// Film top rated
export const getTopRatedMovies = async (page = 1) => {
  const data = await fetchTMDb('/movie/top_rated', { page });
  return {
    ...data,
    results: data.results.map(transformMovie)
  };
};

// Dettagli film
export const getMovieDetails = async (movieId) => {
  const data = await fetchTMDb(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,watch/providers,recommendations,similar'
  });
  return transformMovieDetails(data);
};

// Cerca film
export const searchMovies = async (query, page = 1) => {
  if (!query.trim()) return { results: [], total_results: 0 };
  
  const data = await fetchTMDb('/search/movie', { query, page });
  return {
    ...data,
    results: data.results.map(transformMovie)
  };
};

// Film per genere
export const getMoviesByGenre = async (genreId, page = 1) => {
  const data = await fetchTMDb('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc'
  });
  return {
    ...data,
    results: data.results.map(transformMovie)
  };
};

// Film simili
export const getSimilarMovies = async (movieId) => {
  const data = await fetchTMDb(`/movie/${movieId}/similar`);
  return data.results.map(transformMovie);
};

// Film raccomandati
export const getRecommendedMovies = async (movieId) => {
  const data = await fetchTMDb(`/movie/${movieId}/recommendations`);
  return data.results.map(transformMovie);
};

// Lista generi
export const getGenres = async () => {
  const data = await fetchTMDb('/genre/movie/list');
  return data.genres;
};

// ============================================
// SERIE TV ENDPOINTS
// ============================================

// Serie TV popolari
export const getPopularTVShows = async (page = 1) => {
  const data = await fetchTMDb('/tv/popular', { page });
  return {
    ...data,
    results: data.results.map(transformTVShow)
  };
};

// Dettagli serie TV
export const getTVShowDetails = async (tvId) => {
  const data = await fetchTMDb(`/tv/${tvId}`, {
    append_to_response: 'credits,videos,watch/providers,recommendations'
  });
  return transformTVShowDetails(data);
};

// Cerca serie TV
export const searchTVShows = async (query, page = 1) => {
  if (!query.trim()) return { results: [], total_results: 0 };
  
  const data = await fetchTMDb('/search/tv', { query, page });
  return {
    ...data,
    results: data.results.map(transformTVShow)
  };
};

// ============================================
// RICERCA MULTI (Film + Serie + Persone)
// ============================================

export const searchMulti = async (query, page = 1) => {
  if (!query.trim()) return { results: [], total_results: 0 };
  
  const data = await fetchTMDb('/search/multi', { query, page });
  return {
    ...data,
    results: data.results.map(item => {
      if (item.media_type === 'movie') return transformMovie(item);
      if (item.media_type === 'tv') return transformTVShow(item);
      return item;
    })
  };
};

// ============================================
// PERSONE
// ============================================

export const getPersonDetails = async (personId) => {
  const data = await fetchTMDb(`/person/${personId}`, {
    append_to_response: 'movie_credits,tv_credits'
  });
  return data;
};

export const searchPeople = async (query, page = 1) => {
  const data = await fetchTMDb('/search/person', { query, page });
  return data;
};

// ============================================
// WATCH PROVIDERS (Streaming)
// ============================================

export const getMovieWatchProviders = async (movieId, region = 'IT') => {
  const data = await fetchTMDb(`/movie/${movieId}/watch/providers`);
  return data.results?.[region] || null;
};

export const getTVWatchProviders = async (tvId, region = 'IT') => {
  const data = await fetchTMDb(`/tv/${tvId}/watch/providers`);
  return data.results?.[region] || null;
};

// ============================================
// TRANSFORMERS
// ============================================

// Trasforma dati film base
function transformMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
    releaseDate: movie.release_date,
    rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : null,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    poster: getImageUrl(movie.poster_path),
    backdrop: getImageUrl(movie.backdrop_path, BACKDROP_SIZE),
    synopsis: movie.overview,
    genreIds: movie.genre_ids || [],
    genres: (movie.genre_ids || []).map(id => MOVIE_GENRES[id]).filter(Boolean),
    adult: movie.adult,
    mediaType: 'movie'
  };
}

// Trasforma dati film dettagliati
function transformMovieDetails(movie) {
  const base = transformMovie(movie);
  
  // Estrai trailer YouTube
  const trailer = movie.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  ) || movie.videos?.results?.find(
    v => v.site === 'YouTube'
  );

  // Estrai crew principale
  const crew = {};
  if (movie.credits?.crew) {
    const director = movie.credits.crew.find(c => c.job === 'Director');
    const writer = movie.credits.crew.find(c => c.job === 'Screenplay' || c.job === 'Writer');
    const composer = movie.credits.crew.find(c => c.job === 'Original Music Composer');
    const dop = movie.credits.crew.find(c => c.job === 'Director of Photography');
    const editor = movie.credits.crew.find(c => c.job === 'Editor');
    const producer = movie.credits.crew.find(c => c.job === 'Producer');

    if (director) crew.regia = director.name;
    if (writer) crew.sceneggiatura = writer.name;
    if (composer) crew.musiche = composer.name;
    if (dop) crew.fotografia = dop.name;
    if (editor) crew.montaggio = editor.name;
    if (producer) crew.produzione = producer.name;
  }

  // Estrai cast principale (primi 10)
  const cast = movie.credits?.cast?.slice(0, 10).map(c => ({
    id: c.id,
    name: c.name,
    character: c.character,
    photo: getImageUrl(c.profile_path)
  })) || [];

  // Estrai piattaforme streaming per Italia
  const watchProviders = movie['watch/providers']?.results?.IT;
  const platforms = [];
  if (watchProviders?.flatrate) {
    platforms.push(...watchProviders.flatrate.map(p => ({
      id: p.provider_id,
      name: p.provider_name,
      logo: getImageUrl(p.logo_path, 'w92')
    })));
  }

  // Calcola durata formattata
  const duration = movie.runtime 
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
    : null;

  return {
    ...base,
    genres: movie.genres?.map(g => g.name) || [],
    duration,
    runtime: movie.runtime,
    budget: movie.budget,
    revenue: movie.revenue,
    tagline: movie.tagline,
    status: movie.status,
    productionCompanies: movie.production_companies?.map(c => c.name) || [],
    productionCountries: movie.production_countries?.map(c => c.name) || [],
    spokenLanguages: movie.spoken_languages?.map(l => l.name) || [],
    crew,
    cast,
    trailer: trailer ? {
      key: trailer.key,
      name: trailer.name,
      url: `https://www.youtube.com/watch?v=${trailer.key}`,
      embedUrl: `${API_CONFIG.YOUTUBE.EMBED_URL}/${trailer.key}`
    } : null,
    platforms,
    recommendations: movie.recommendations?.results?.slice(0, 10).map(transformMovie) || [],
    similar: movie.similar?.results?.slice(0, 10).map(transformMovie) || [],
    imdbId: movie.imdb_id,
    homepage: movie.homepage
  };
}

// Trasforma dati serie TV base
function transformTVShow(show) {
  return {
    id: show.id,
    title: show.name,
    originalTitle: show.original_name,
    year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
    firstAirDate: show.first_air_date,
    rating: show.vote_average ? Math.round(show.vote_average * 10) / 10 : null,
    voteCount: show.vote_count,
    popularity: show.popularity,
    poster: getImageUrl(show.poster_path),
    backdrop: getImageUrl(show.backdrop_path, BACKDROP_SIZE),
    synopsis: show.overview,
    genreIds: show.genre_ids || [],
    genres: (show.genre_ids || []).map(id => MOVIE_GENRES[id]).filter(Boolean),
    mediaType: 'tv'
  };
}

// Trasforma dati serie TV dettagliati
function transformTVShowDetails(show) {
  const base = transformTVShow(show);
  
  const trailer = show.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const cast = show.credits?.cast?.slice(0, 10).map(c => ({
    id: c.id,
    name: c.name,
    character: c.character,
    photo: getImageUrl(c.profile_path)
  })) || [];

  const watchProviders = show['watch/providers']?.results?.IT;
  const platforms = [];
  if (watchProviders?.flatrate) {
    platforms.push(...watchProviders.flatrate.map(p => ({
      id: p.provider_id,
      name: p.provider_name,
      logo: getImageUrl(p.logo_path, 'w92')
    })));
  }

  return {
    ...base,
    genres: show.genres?.map(g => g.name) || [],
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    episodeRunTime: show.episode_run_time?.[0],
    status: show.status,
    networks: show.networks?.map(n => n.name) || [],
    createdBy: show.created_by?.map(c => c.name) || [],
    cast,
    trailer: trailer ? {
      key: trailer.key,
      name: trailer.name,
      url: `https://www.youtube.com/watch?v=${trailer.key}`,
      embedUrl: `${API_CONFIG.YOUTUBE.EMBED_URL}/${trailer.key}`
    } : null,
    platforms,
    recommendations: show.recommendations?.results?.slice(0, 10).map(transformTVShow) || []
  };
}

// Export default con tutti i metodi
export default {
  getPopularMovies,
  getTrendingMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getMovieDetails,
  searchMovies,
  getMoviesByGenre,
  getSimilarMovies,
  getRecommendedMovies,
  getGenres,
  getPopularTVShows,
  getTVShowDetails,
  searchTVShows,
  searchMulti,
  getPersonDetails,
  searchPeople,
  getMovieWatchProviders,
  getTVWatchProviders,
  getImageUrl
};
