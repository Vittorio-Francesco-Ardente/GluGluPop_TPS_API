import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ApiServices from '../services';

const { TMDb, CocktailDB, Spoonacular } = ApiServices;

const AppContext = createContext();

// ============================================
// HOOK PER LOCALSTORAGE
// ============================================
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// ============================================
// APP PROVIDER
// ============================================
export function AppProvider({ children }) {
  // ==========================================
  // STATE - Navigazione e UI
  // ==========================================
  const [currentPage, setCurrentPage] = useState('home');
  const [activeSheet, setActiveSheet] = useState(null);
  const [sheetContent, setSheetContent] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [activeTab, setActiveTab] = useState('liked');

  // ==========================================
  // STATE - Film e Catalogo
  // ==========================================
  const [films, setFilms] = useState([]);
  const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
  const [currentFilmDetails, setCurrentFilmDetails] = useState(null);
  const [isLoadingFilms, setIsLoadingFilms] = useState(true);
  const [filmsError, setFilmsError] = useState(null);

  // ==========================================
  // STATE - Preferiti e Watchlist (persistenti)
  // ==========================================
  const [likedFilms, setLikedFilms] = useLocalStorage('likedFilms', []);
  const [watchlistFilms, setWatchlistFilms] = useLocalStorage('watchlistFilms', []);
  const [swipeCount, setSwipeCount] = useLocalStorage('swipeCount', 0);
  const [groups, setGroups] = useLocalStorage('groups', []);

  // ==========================================
  // STATE - Impostazioni (persistenti)
  // ==========================================
  const [isMuted, setIsMuted] = useLocalStorage('isMuted', false);
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('theme', true);

  // ==========================================
  // STATE - Pairing
  // ==========================================
  const [currentPairing, setCurrentPairing] = useState(null);

  // ==========================================
  // EFFECTS - Tema
  // ==========================================
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkTheme]);

  // ==========================================
  // EFFECTS - Carica film all'avvio
  // ==========================================
  useEffect(() => {
    loadInitialFilms();
  }, []);

  // ==========================================
  // API - Carica film iniziali
  // ==========================================
  const loadInitialFilms = useCallback(async () => {
    setIsLoadingFilms(true);
    setFilmsError(null);

    try {
      // Carica film in tendenza
      const trendingData = await TMDb.getTrendingMovies('week');
      
      if (trendingData.results.length > 0) {
        setFilms(trendingData.results);
        // Carica dettagli del primo film
        await loadFilmDetails(trendingData.results[0].id);
      }
    } catch (error) {
      console.error('Error loading films:', error);
      setFilmsError('Errore nel caricamento dei film');
    } finally {
      setIsLoadingFilms(false);
    }
  }, []);

  // ==========================================
  // API - Carica dettagli film
  // ==========================================
  const loadFilmDetails = useCallback(async (movieId) => {
    try {
      const details = await TMDb.getMovieDetails(movieId);
      
      // Carica pairing in parallelo
      const genre = details.genres?.[0] || 'Drammatico';
      const [drinkPairing, foodPairing] = await Promise.allSettled([
        CocktailDB.getDrinkPairingForMovie(genre),
        Spoonacular.getFoodPairingForMovie(genre)
      ]);

      const pairing = {
        drink: drinkPairing.status === 'fulfilled' ? drinkPairing.value : CocktailDB.getLocalDrinkPairing(genre),
        food: foodPairing.status === 'fulfilled' ? foodPairing.value : Spoonacular.getLocalFoodPairing(genre)
      };

      setCurrentFilmDetails(details);
      setCurrentPairing(pairing);
      
      return { details, pairing };
    } catch (error) {
      console.error('Error loading film details:', error);
      throw error;
    }
  }, []);

  // ==========================================
  // API - Cerca film
  // ==========================================
  const searchFilms = useCallback(async (query) => {
    if (!query.trim()) return [];
    
    try {
      const data = await TMDb.searchMovies(query);
      return data.results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, []);

  // ==========================================
  // API - Carica più film (paginazione)
  // ==========================================
  const loadMoreFilms = useCallback(async () => {
    try {
      const nextPage = Math.floor(films.length / 20) + 2;
      const data = await TMDb.getTrendingMovies('week');
      
      // In realtà per paginazione useremmo page parameter
      // Per ora aggiungiamo film popolari
      const popularData = await TMDb.getPopularMovies(nextPage);
      
      setFilms(prev => [...prev, ...popularData.results]);
    } catch (error) {
      console.error('Error loading more films:', error);
    }
  }, [films.length]);

  // ==========================================
  // FILM CORRENTE
  // ==========================================
  const currentFilm = useMemo(() => {
    if (currentFilmDetails) {
      return currentFilmDetails;
    }
    return films[currentFilmIndex] || null;
  }, [currentFilmDetails, films, currentFilmIndex]);

  // ==========================================
  // ACTIONS - Toast
  // ==========================================
  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  }, []);

  // ==========================================
  // ACTIONS - Tema
  // ==========================================
  const toggleTheme = useCallback(() => {
    setIsDarkTheme(prev => !prev);
  }, [setIsDarkTheme]);

  // ==========================================
  // ACTIONS - Audio
  // ==========================================
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, [setIsMuted]);

  // ==========================================
  // ACTIONS - Navigazione film
  // ==========================================
  const loadFilm = useCallback(async (index) => {
    if (index < 0 || index >= films.length) return;
    
    setCurrentFilmIndex(index);
    const film = films[index];
    
    if (film?.id) {
      await loadFilmDetails(film.id);
    }
  }, [films, loadFilmDetails]);

  const nextFilm = useCallback(async () => {
    const nextIndex = (currentFilmIndex + 1) % films.length;
    await loadFilm(nextIndex);
    
    // Carica più film se siamo vicini alla fine
    if (nextIndex >= films.length - 3) {
      loadMoreFilms();
    }
  }, [currentFilmIndex, films.length, loadFilm, loadMoreFilms]);

  // ==========================================
  // ACTIONS - Swipe
  // ==========================================
  const swipeFilm = useCallback(async (direction) => {
    setSwipeCount(prev => prev + 1);
    
    if (direction === 'right' && currentFilm && !likedFilms.find(f => f.id === currentFilm.id)) {
      const filmToSave = {
        id: currentFilm.id,
        title: currentFilm.title,
        year: currentFilm.year,
        rating: currentFilm.rating,
        poster: currentFilm.poster,
        genres: currentFilm.genres,
        crew: currentFilm.crew || { regia: 'N/A' }
      };
      setLikedFilms(prev => [...prev, filmToSave]);
      showToast('Aggiunto ai preferiti');
    } else if (direction === 'left') {
      showToast('Film saltato');
    }
    
    // Passa al prossimo film dopo un delay per l'animazione
    setTimeout(() => {
      nextFilm();
    }, 400);
    
    return direction;
  }, [currentFilm, likedFilms, setLikedFilms, setSwipeCount, showToast, nextFilm]);

  // ==========================================
  // ACTIONS - Watchlist
  // ==========================================
  const saveToWatchlist = useCallback(() => {
    if (!currentFilm) return;
    
    if (!watchlistFilms.find(f => f.id === currentFilm.id)) {
      const filmToSave = {
        id: currentFilm.id,
        title: currentFilm.title,
        year: currentFilm.year,
        rating: currentFilm.rating,
        poster: currentFilm.poster,
        genres: currentFilm.genres,
        crew: currentFilm.crew || { regia: 'N/A' }
      };
      setWatchlistFilms(prev => [...prev, filmToSave]);
      showToast('Aggiunto alla watchlist');
    } else {
      showToast('Già nella watchlist');
    }
  }, [currentFilm, watchlistFilms, setWatchlistFilms, showToast]);

  // ==========================================
  // ACTIONS - Aggiungi a preferiti
  // ==========================================
  const addToLiked = useCallback(async (filmId) => {
    let film = films.find(f => f.id === filmId);
    
    if (!film) {
      // Carica dettagli se non in lista
      try {
        film = await TMDb.getMovieDetails(filmId);
      } catch (error) {
        showToast('Errore nel caricamento');
        return;
      }
    }
    
    if (!likedFilms.find(f => f.id === filmId)) {
      const filmToSave = {
        id: film.id,
        title: film.title,
        year: film.year,
        rating: film.rating,
        poster: film.poster,
        genres: film.genres,
        crew: film.crew || { regia: 'N/A' }
      };
      setLikedFilms(prev => [...prev, filmToSave]);
      showToast('Aggiunto ai preferiti');
    } else {
      showToast('Già nei preferiti');
    }
    setActiveSheet(null);
  }, [films, likedFilms, setLikedFilms, showToast]);

  // ==========================================
  // ACTIONS - Aggiungi a watchlist
  // ==========================================
  const addToWatchlist = useCallback(async (filmId) => {
    let film = films.find(f => f.id === filmId);
    
    if (!film) {
      try {
        film = await TMDb.getMovieDetails(filmId);
      } catch (error) {
        showToast('Errore nel caricamento');
        return;
      }
    }
    
    if (!watchlistFilms.find(f => f.id === filmId)) {
      const filmToSave = {
        id: film.id,
        title: film.title,
        year: film.year,
        rating: film.rating,
        poster: film.poster,
        genres: film.genres,
        crew: film.crew || { regia: 'N/A' }
      };
      setWatchlistFilms(prev => [...prev, filmToSave]);
      showToast('Aggiunto alla watchlist');
    } else {
      showToast('Già nella watchlist');
    }
    setActiveSheet(null);
  }, [films, watchlistFilms, setWatchlistFilms, showToast]);

  // ==========================================
  // ACTIONS - Rimuovi film
  // ==========================================
  const removeFilm = useCallback((id, type) => {
    if (type === 'liked') {
      setLikedFilms(prev => prev.filter(f => f.id !== id));
    } else {
      setWatchlistFilms(prev => prev.filter(f => f.id !== id));
    }
    showToast('Film rimosso');
  }, [setLikedFilms, setWatchlistFilms, showToast]);

  // ==========================================
  // ACTIONS - Gruppi
  // ==========================================
  const createGroup = useCallback((name, description, email) => {
    if (!name.trim()) {
      showToast('Inserisci un nome');
      return false;
    }
    
    const members = ['Tu'];
    if (email) members.push(email.split('@')[0]);
    
    setGroups(prev => [...prev, {
      id: Date.now(),
      name,
      description,
      members,
      films: [],
      createdAt: new Date().toISOString()
    }]);
    
    setActiveSheet(null);
    showToast('Gruppo creato');
    return true;
  }, [setGroups, showToast]);

  const deleteGroup = useCallback((index) => {
    setGroups(prev => prev.filter((_, i) => i !== index));
    setActiveSheet(null);
    showToast('Gruppo eliminato');
  }, [setGroups, showToast]);

  const addFilmToGroup = useCallback((groupIndex, filmId) => {
    const film = films.find(f => f.id === filmId) || currentFilm;
    const group = groups[groupIndex];
    
    if (!group) return;
    
    if (!group.films.find(f => f.id === filmId)) {
      const updatedGroups = [...groups];
      updatedGroups[groupIndex] = {
        ...group,
        films: [...group.films, {
          id: film.id,
          title: film.title,
          year: film.year,
          poster: film.poster
        }]
      };
      setGroups(updatedGroups);
      showToast('Film aggiunto al gruppo');
    } else {
      showToast('Film già nel gruppo');
    }
  }, [films, currentFilm, groups, setGroups, showToast]);

  const inviteToGroup = useCallback((index, email) => {
    if (email && email.includes('@')) {
      const updatedGroups = [...groups];
      updatedGroups[index] = {
        ...updatedGroups[index],
        members: [...updatedGroups[index].members, email.split('@')[0]]
      };
      setGroups(updatedGroups);
      showToast('Membro invitato');
    }
  }, [groups, setGroups, showToast]);

  // ==========================================
  // ACTIONS - Sheet
  // ==========================================
  const openSheet = useCallback((sheetType, content = null) => {
    setActiveSheet(sheetType);
    setSheetContent(content);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
    setSheetContent(null);
  }, []);

  // ==========================================
  // API - Ottieni dettagli film per sheet
  // ==========================================
  const openFilmDetailsSheet = useCallback(async (filmId) => {
    try {
      const details = await TMDb.getMovieDetails(filmId);
      
      // Carica pairing
      const genre = details.genres?.[0] || 'Drammatico';
      const [drinkPairing, foodPairing] = await Promise.allSettled([
        CocktailDB.getDrinkPairingForMovie(genre),
        Spoonacular.getFoodPairingForMovie(genre)
      ]);

      const filmWithPairing = {
        ...details,
        pairing: {
          drink: drinkPairing.status === 'fulfilled' ? drinkPairing.value : CocktailDB.getLocalDrinkPairing(genre),
          food: foodPairing.status === 'fulfilled' ? foodPairing.value : Spoonacular.getLocalFoodPairing(genre)
        }
      };

      openSheet('filmDetails', filmWithPairing);
    } catch (error) {
      console.error('Error loading film details:', error);
      showToast('Errore nel caricamento dettagli');
    }
  }, [openSheet, showToast]);

  // ==========================================
  // VALUE OBJECT
  // ==========================================
  const value = useMemo(() => ({
    // Data
    films,
    currentFilm,
    currentFilmIndex,
    currentFilmDetails,
    currentPairing,
    likedFilms,
    watchlistFilms,
    swipeCount,
    groups,
    
    // Loading states
    isLoadingFilms,
    filmsError,
    
    // UI State
    currentPage,
    isMuted,
    isDarkTheme,
    activeSheet,
    sheetContent,
    toast,
    activeTab,
    
    // Navigation
    setCurrentPage,
    
    // Film actions
    loadFilm,
    nextFilm,
    swipeFilm,
    saveToWatchlist,
    addToLiked,
    addToWatchlist,
    removeFilm,
    searchFilms,
    loadFilmDetails,
    loadMoreFilms,
    
    // Settings
    toggleMute,
    toggleTheme,
    
    // Groups
    createGroup,
    deleteGroup,
    addFilmToGroup,
    inviteToGroup,
    
    // UI
    openSheet,
    closeSheet,
    openFilmDetailsSheet,
    showToast,
    setActiveTab,
    
    // API Services (per accesso diretto se necessario)
    ApiServices
  }), [
    films,
    currentFilm,
    currentFilmIndex,
    currentFilmDetails,
    currentPairing,
    likedFilms,
    watchlistFilms,
    swipeCount,
    groups,
    isLoadingFilms,
    filmsError,
    currentPage,
    isMuted,
    isDarkTheme,
    activeSheet,
    sheetContent,
    toast,
    activeTab,
    loadFilm,
    nextFilm,
    swipeFilm,
    saveToWatchlist,
    addToLiked,
    addToWatchlist,
    removeFilm,
    searchFilms,
    loadFilmDetails,
    loadMoreFilms,
    toggleMute,
    toggleTheme,
    createGroup,
    deleteGroup,
    addFilmToGroup,
    inviteToGroup,
    openSheet,
    closeSheet,
    openFilmDetailsSheet,
    showToast,
    setActiveTab
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================
// HOOK PERSONALIZZATO
// ============================================
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
