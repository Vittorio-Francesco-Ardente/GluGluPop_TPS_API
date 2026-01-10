// ============================================
// CUSTOM HOOKS FOR API CALLS
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import ApiServices from '../services';

const { TMDb, YouTube, TasteDive, Spoonacular, CocktailDB } = ApiServices;

// ============================================
// GENERIC API HOOK
// ============================================

export function useApi(apiFunction, dependencies = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      if (mountedRef.current) {
        setData(result);
        setLoading(false);
      }
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Errore durante il caricamento');
        setLoading(false);
      }
      throw err;
    }
  }, [apiFunction]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
  }, dependencies);

  return { data, loading, error, execute, refetch: execute };
}

// ============================================
// MOVIE HOOKS
// ============================================

// Hook per film popolari
export function usePopularMovies(page = 1) {
  return useApi(() => TMDb.getPopularMovies(page), [page]);
}

// Hook per film in tendenza
export function useTrendingMovies(timeWindow = 'week') {
  return useApi(() => TMDb.getTrendingMovies(timeWindow), [timeWindow]);
}

// Hook per film in sala
export function useNowPlayingMovies(page = 1) {
  return useApi(() => TMDb.getNowPlayingMovies(page), [page]);
}

// Hook per film in arrivo
export function useUpcomingMovies(page = 1) {
  return useApi(() => TMDb.getUpcomingMovies(page), [page]);
}

// Hook per top rated
export function useTopRatedMovies(page = 1) {
  return useApi(() => TMDb.getTopRatedMovies(page), [page]);
}

// Hook per dettagli film
export function useMovieDetails(movieId) {
  return useApi(() => TMDb.getMovieDetails(movieId), [movieId], !!movieId);
}

// Hook per dettagli completi (con pairing)
export function useCompleteMovieDetails(movieId) {
  return useApi(() => ApiServices.getCompleteMovieDetails(movieId), [movieId], !!movieId);
}

// Hook per ricerca film
export function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await TMDb.searchMovies(searchQuery);
        setResults(data.results);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { query, results, loading, search, clear };
}

// Hook per ricerca multi (film + serie + persone)
export function useMultiSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ movies: [], tvShows: [], similar: [] });
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim()) {
      setResults({ movies: [], tvShows: [], similar: [] });
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await ApiServices.searchAll(searchQuery);
        setResults(data);
      } catch (error) {
        console.error('Multi search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  return { query, results, loading, search };
}

// ============================================
// HOME PAGE HOOK
// ============================================

export function useHomePageData() {
  return useApi(ApiServices.getHomePageData, []);
}

// ============================================
// RECOMMENDATIONS HOOKS
// ============================================

// Hook per raccomandazioni personalizzate
export function usePersonalizedRecommendations(likedMovies) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    if (!likedMovies?.length) {
      setRecommendations(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await ApiServices.getPersonalizedRecommendations(likedMovies);
      setRecommendations(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [likedMovies]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, error, refetch: fetchRecommendations };
}

// Hook per film simili
export function useSimilarMovies(movieId) {
  return useApi(() => TMDb.getSimilarMovies(movieId), [movieId], !!movieId);
}

// Hook per raccomandazioni TMDb
export function useRecommendedMovies(movieId) {
  return useApi(() => TMDb.getRecommendedMovies(movieId), [movieId], !!movieId);
}

// ============================================
// PAIRING HOOKS
// ============================================

// Hook per abbinamento drink
export function useDrinkPairing(genre) {
  return useApi(
    () => CocktailDB.getDrinkPairingForMovie(genre),
    [genre],
    !!genre
  );
}

// Hook per abbinamento cibo
export function useFoodPairing(genre) {
  return useApi(
    () => Spoonacular.getFoodPairingForMovie(genre),
    [genre],
    !!genre
  );
}

// Hook per esperienza cinema completa
export function useCinemaExperience(movie) {
  return useApi(
    () => ApiServices.getCinemaExperience(movie),
    [movie?.id],
    !!movie
  );
}

// ============================================
// TRAILER HOOKS
// ============================================

// Hook per cercare trailer
export function useTrailerSearch(movieTitle, year) {
  return useApi(
    () => YouTube.searchTrailer(movieTitle, year),
    [movieTitle, year],
    !!movieTitle
  );
}

// ============================================
// STREAMING PLATFORMS HOOKS
// ============================================

// Hook per piattaforme streaming
export function useWatchProviders(movieId) {
  return useApi(
    () => TMDb.getMovieWatchProviders(movieId),
    [movieId],
    !!movieId
  );
}

// ============================================
// INFINITE SCROLL HOOK
// ============================================

export function useInfiniteMovies(fetchFunction, initialPage = 1) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchFunction(page);
      setMovies(prev => [...prev, ...data.results]);
      setHasMore(page < data.total_pages);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, loading, hasMore]);

  const reset = useCallback(() => {
    setMovies([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  // Carica prima pagina
  useEffect(() => {
    loadMore();
  }, []);

  return { movies, loading, error, hasMore, loadMore, reset };
}

// ============================================
// CACHE HOOK
// ============================================

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

export function useCachedApi(key, apiFunction, dependencies = []) {
  const [data, setData] = useState(() => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    // Controlla cache
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      cache.set(key, { data: result, timestamp: Date.now() });
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [key, apiFunction]);

  useEffect(() => {
    execute();
  }, [execute, ...dependencies]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    execute();
  }, [key, execute]);

  return { data, loading, error, refetch: execute, invalidate };
}

// ============================================
// EXPORT
// ============================================

export default {
  useApi,
  usePopularMovies,
  useTrendingMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
  useMovieDetails,
  useCompleteMovieDetails,
  useMovieSearch,
  useMultiSearch,
  useHomePageData,
  usePersonalizedRecommendations,
  useSimilarMovies,
  useRecommendedMovies,
  useDrinkPairing,
  useFoodPairing,
  useCinemaExperience,
  useTrailerSearch,
  useWatchProviders,
  useInfiniteMovies,
  useCachedApi
};
