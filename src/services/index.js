// ============================================
// SERVICES INDEX
// Export centralizzato di tutti i servizi API
// ============================================

// TMDb - Catalogo Film e Serie TV
export { default as TMDbService } from './tmdb';
export * from './tmdb';

// YouTube - Trailer
export { default as YouTubeService } from './youtube';
export * from './youtube';

// TasteDive - Raccomandazioni per affinità
export { default as TasteDiveService } from './tastedive';
export * from './tastedive';

// Spoonacular - Abbinamenti cibo
export { default as SpoonacularService } from './spoonacular';
export * from './spoonacular';

// TheCocktailDB - Suggerimenti drink
export { default as CocktailDBService } from './cocktaildb';
export * from './cocktaildb';

// ============================================
// COMBINED SERVICES
// ============================================

import TMDb from './tmdb';
import YouTube from './youtube';
import TasteDive from './tastedive';
import Spoonacular from './spoonacular';
import CocktailDB from './cocktaildb';

/**
 * Ottieni tutti i dettagli di un film con trailer, piattaforme e abbinamenti
 * @param {number} movieId - ID TMDb del film
 * @returns {Promise<Object>} Dettagli completi del film
 */
export const getCompleteMovieDetails = async (movieId) => {
  try {
    // Ottieni dettagli base da TMDb
    const movieDetails = await TMDb.getMovieDetails(movieId);
    
    // Se non c'è trailer da TMDb, cerca su YouTube
    let trailer = movieDetails.trailer;
    if (!trailer) {
      const youtubeResults = await YouTube.searchTrailer(movieDetails.title, movieDetails.year);
      if (youtubeResults.length > 0) {
        trailer = {
          key: youtubeResults[0].id,
          name: youtubeResults[0].title,
          embedUrl: youtubeResults[0].embedUrl,
          url: youtubeResults[0].watchUrl
        };
      }
    }

    // Ottieni abbinamenti in parallelo
    const [drinkPairing, foodPairing, similarContent] = await Promise.allSettled([
      CocktailDB.getDrinkPairingForMovie(movieDetails.genres[0] || 'Drammatico'),
      Spoonacular.getFoodPairingForMovie(movieDetails.genres[0] || 'Drammatico'),
      TasteDive.getSimilarMovies(movieDetails.title, 5)
    ]);

    return {
      ...movieDetails,
      trailer,
      pairing: {
        drink: drinkPairing.status === 'fulfilled' ? drinkPairing.value : CocktailDB.getLocalDrinkPairing(movieDetails.genres[0]),
        food: foodPairing.status === 'fulfilled' ? foodPairing.value : Spoonacular.getLocalFoodPairing(movieDetails.genres[0])
      },
      similarFromTasteDive: similarContent.status === 'fulfilled' ? similarContent.value.results : []
    };
  } catch (error) {
    console.error('Error getting complete movie details:', error);
    throw error;
  }
};

/**
 * Cerca contenuti in tutti i servizi
 * @param {string} query - Termine di ricerca
 * @returns {Promise<Object>} Risultati da tutti i servizi
 */
export const searchAll = async (query) => {
  const [movies, tvShows, similar] = await Promise.allSettled([
    TMDb.searchMovies(query),
    TMDb.searchTVShows(query),
    TasteDive.getSimilarContent(query)
  ]);

  return {
    movies: movies.status === 'fulfilled' ? movies.value.results : [],
    tvShows: tvShows.status === 'fulfilled' ? tvShows.value.results : [],
    similar: similar.status === 'fulfilled' ? similar.value.results : []
  };
};

/**
 * Ottieni film per la home con tutti i dati necessari
 * @returns {Promise<Object>} Film per le varie sezioni della home
 */
export const getHomePageData = async () => {
  const [trending, nowPlaying, popular, topRated, upcoming] = await Promise.allSettled([
    TMDb.getTrendingMovies('week'),
    TMDb.getNowPlayingMovies(),
    TMDb.getPopularMovies(),
    TMDb.getTopRatedMovies(),
    TMDb.getUpcomingMovies()
  ]);

  return {
    trending: trending.status === 'fulfilled' ? trending.value.results.slice(0, 10) : [],
    nowPlaying: nowPlaying.status === 'fulfilled' ? nowPlaying.value.results.slice(0, 10) : [],
    popular: popular.status === 'fulfilled' ? popular.value.results.slice(0, 10) : [],
    topRated: topRated.status === 'fulfilled' ? topRated.value.results.slice(0, 10) : [],
    upcoming: upcoming.status === 'fulfilled' ? upcoming.value.results.slice(0, 10) : []
  };
};

/**
 * Genera raccomandazioni personalizzate basate sui preferiti
 * @param {Array} likedMovies - Lista di film preferiti
 * @returns {Promise<Object>} Raccomandazioni personalizzate
 */
export const getPersonalizedRecommendations = async (likedMovies) => {
  if (!likedMovies.length) {
    return { recommendations: [], basedOn: [] };
  }

  try {
    // Usa TasteDive per raccomandazioni basate su affinità
    const titles = likedMovies.slice(0, 5).map(m => m.title);
    const tasteProfile = await TasteDive.generateTasteProfile(titles);

    // Cerca i film raccomandati su TMDb per avere i dati completi
    const tmdbResults = await Promise.allSettled(
      tasteProfile.recommendations.slice(0, 10).map(rec =>
        TMDb.searchMovies(rec.name).then(r => r.results[0])
      )
    );

    const recommendations = tmdbResults
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => r.value);

    return {
      recommendations,
      themes: tasteProfile.themes,
      basedOn: titles
    };
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return { recommendations: [], basedOn: [] };
  }
};

/**
 * Ottieni abbinamenti completi per una serata cinema
 * @param {Object} movie - Oggetto film
 * @returns {Promise<Object>} Abbinamenti drink e cibo
 */
export const getCinemaExperience = async (movie) => {
  const genre = movie.genres?.[0] || movie.genre || 'Drammatico';

  const [drinks, food, mocktail] = await Promise.allSettled([
    CocktailDB.getMultipleDrinkPairings(genre, 3),
    Spoonacular.getMultipleFoodPairings(genre, 3),
    CocktailDB.getMocktailPairing(genre)
  ]);

  return {
    movie: movie.title,
    genre,
    drinks: drinks.status === 'fulfilled' ? drinks.value : { cocktails: [] },
    food: food.status === 'fulfilled' ? food.value : { recipes: [] },
    mocktail: mocktail.status === 'fulfilled' ? mocktail.value : CocktailDB.getLocalMocktail()
  };
};

// Export combinato di tutti i servizi
const ApiServices = {
  TMDb,
  YouTube,
  TasteDive,
  Spoonacular,
  CocktailDB,
  getCompleteMovieDetails,
  searchAll,
  getHomePageData,
  getPersonalizedRecommendations,
  getCinemaExperience
};

export default ApiServices;
