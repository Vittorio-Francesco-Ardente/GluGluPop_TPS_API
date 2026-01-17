/**
 * ============================================
 * GLUGLUPOP v2.0 - Cinema Experience App
 * ============================================
 * 
 * STRUCTURE:
 * 1. Configuration
 * 2. Internationalization (i18n)
 * 3. API Services
 * 4. App State & Core
 * 5. UI Controllers
 * 6. Event Handlers
 * 7. Utilities
 * 8. Initialization
 * 
 * ============================================
 */

// ============================================
// 1. CONFIGURATION
// ============================================
const CONFIG = {
    // App Info
    APP: {
        NAME: 'GluGluPop',
        VERSION: '2.0.0',
        SPLASH_DURATION: 2500
    },
    
    // TMDb API
    TMDB: {
        API_KEY: 'c4439fc09e7e33c2472635214c87f38c',
        BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_URL: 'https://image.tmdb.org/t/p',
        LANGUAGE: 'it-IT'
    },
    
    // YouTube Embed
    YOUTUBE: {
        EMBED_URL: 'https://www.youtube.com/embed'
    },
    
    // TheCocktailDB
    COCKTAIL: {
        BASE_URL: 'https://www.thecocktaildb.com/api/json/v1/1'
    },
    
    // Spoonacular
    SPOONACULAR: {
        API_KEY: '308a0867947d4105a9443b014bed876b',
        BASE_URL: 'https://api.spoonacular.com'
    },
    
    // Genre mappings
    GENRES: {
        28: 'Azione', 12: 'Avventura', 16: 'Animazione', 35: 'Commedia',
        80: 'Crime', 99: 'Documentario', 18: 'Drammatico', 10751: 'Famiglia',
        14: 'Fantasy', 36: 'Storia', 27: 'Horror', 10402: 'Musica',
        9648: 'Mistero', 10749: 'Romance', 878: 'Fantascienza',
        10770: 'Film TV', 53: 'Thriller', 10752: 'Guerra', 37: 'Western'
    },
    
    // Pairing mappings
    DRINK_MAP: {
        'Azione': 'margarita', 'Fantascienza': 'blue lagoon', 'Drammatico': 'martini',
        'Commedia': 'mojito', 'Horror': 'bloody mary', 'Romance': 'bellini',
        'Thriller': 'negroni', 'Avventura': 'mai tai', 'default': 'old fashioned'
    },
    
    FOOD_MAP: {
        'Azione': 'nachos', 'Fantascienza': 'popcorn', 'Drammatico': 'cheese',
        'Commedia': 'pizza', 'Horror': 'candy', 'Romance': 'chocolate',
        'Thriller': 'bruschetta', 'Avventura': 'tacos', 'default': 'popcorn'
    }
};

// ============================================
// 2. INTERNATIONALIZATION (i18n)
// ============================================
const i18n = {
    currentLang: 'it',
    
    translations: {
        it: {
            // General
            loading: 'Caricamento film...',
            error: 'Errore nel caricamento',
            retry: 'Riprova',
            save: 'Salva',
            cancel: 'Annulla',
            confirm: 'Conferma',
            delete: 'Elimina',
            
            // Navigation
            home: 'Home',
            saved: 'Salvati',
            groups: 'Gruppi',
            profile: 'Profilo',
            
            // Home
            details: 'Dettagli',
            nowPlaying: 'In programmazione',
            favorites: 'Preferiti',
            toWatch: 'Da vedere',
            rated: 'Valutati',
            
            // Saved
            yourLibrary: 'La tua libreria',
            savedMovies: 'Film salvati e preferiti',
            searchSaved: 'Cerca nei tuoi film...',
            noSavedMovies: 'Nessun film salvato',
            exploreAndSave: 'Esplora il catalogo e salva i tuoi preferiti',
            exploreMovies: 'Esplora film',
            
            // Groups
            chooseTogetherDesc: 'Scegli cosa guardare insieme',
            new: 'Nuovo',
            howItWorks: 'Come funziona',
            createGroup: 'Crea un gruppo',
            createGroupDesc: 'Dai un nome al tuo gruppo e aggiungi una descrizione.',
            inviteFriends: 'Invita i tuoi amici',
            inviteFriendsDesc: 'Aggiungi membri inserendo le loro email.',
            proposeMovies: 'Proponi i film',
            proposeMoviesDesc: 'Ogni membro può proporre film dal catalogo.',
            decideTogether: 'Decidete insieme',
            decideTogetherDesc: 'Votate i film e scoprite i match perfetti!',
            yourGroups: 'I tuoi gruppi',
            noGroupsYet: 'Non hai ancora creato nessun gruppo',
            createFirstGroup: 'Crea il tuo primo gruppo',
            createNewGroup: 'Crea nuovo gruppo',
            groupName: 'Nome del gruppo *',
            groupNamePlaceholder: 'Es. Serata cinema',
            description: 'Descrizione',
            descriptionPlaceholder: 'Una breve descrizione (opzionale)',
            inviteFriend: 'Invita un amico (email)',
            
            // Profile
            memberSince: 'Membro dal Gennaio 2024',
            favoriteGenres: 'I tuoi generi preferiti',
            settings: 'Impostazioni',
            language: 'Lingua',
            darkTheme: 'Tema scuro',
            notifications: 'Notifiche',
            privacy: 'Privacy e sicurezza',
            helpCenter: 'Centro assistenza',
            clearData: 'Cancella dati',
            logout: 'Esci dall\'account',
            editProfile: 'Modifica profilo',
            name: 'Nome',
            shareActivity: 'Condividi attività',
            showProfile: 'Mostra profilo pubblico',
            needHelp: 'Hai bisogno di altro aiuto?',
            contactUs: 'Contattaci',
            
            // Search
            searchPlaceholder: 'Cerca film, regista, genere...',
            searchHint: 'Cerca per titolo, regista o genere',
            noResults: 'Nessun risultato per',
            
            // Toasts
            addedToFavorites: 'Aggiunto ai preferiti ❤️',
            addedToWatchlist: 'Aggiunto alla watchlist 📑',
            alreadyInFavorites: 'Già nei preferiti',
            alreadyInWatchlist: 'Già nella watchlist',
            movieSkipped: 'Film saltato',
            movieRemoved: 'Film rimosso',
            groupCreated: 'Gruppo creato 🎉',
            groupDeleted: 'Gruppo eliminato',
            memberInvited: 'Membro invitato 📧',
            movieAddedToGroup: 'Film aggiunto 🎬',
            alreadyInGroup: 'Film già nel gruppo',
            profileSaved: 'Profilo salvato ✓',
            dataClearedSuccess: 'Dati cancellati',
            enterName: 'Inserisci un nome',
            languageChanged: 'Lingua cambiata',
            
            // Dialogs
            clearDataTitle: 'Cancella tutti i dati?',
            clearDataMessage: 'Questa azione rimuoverà tutti i film salvati, i gruppi e le preferenze.',
            deleteGroupTitle: 'Eliminare questo gruppo?',
            deleteGroupMessage: 'Questa azione è irreversibile.',
            
            // Film Details
            synopsis: 'Trama',
            crew: 'Crew',
            cast: 'Cast',
            availableOn: 'Disponibile su',
            recommendedFor: 'Consigliato per la visione',
            director: 'Regia',
            screenplay: 'Sceneggiatura',
            music: 'Musiche',
            cinematography: 'Fotografia',
            synopsisNotAvailable: 'Trama non disponibile.',
            
            // Members
            members: 'Membri',
            admin: 'Admin',
            proposedMovies: 'Film proposti',
            noMoviesProposed: 'Nessun film proposto',
            addMovies: 'Aggiungi film',
            invite: 'Invita',
            memberEmail: 'Email del membro:'
        },
        
        en: {
            // General
            loading: 'Loading movies...',
            error: 'Loading error',
            retry: 'Retry',
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            delete: 'Delete',
            
            // Navigation
            home: 'Home',
            saved: 'Saved',
            groups: 'Groups',
            profile: 'Profile',
            
            // Home
            details: 'Details',
            nowPlaying: 'Now Playing',
            favorites: 'Favorites',
            toWatch: 'Watchlist',
            rated: 'Rated',
            
            // Saved
            yourLibrary: 'Your Library',
            savedMovies: 'Saved and favorite movies',
            searchSaved: 'Search your movies...',
            noSavedMovies: 'No saved movies',
            exploreAndSave: 'Explore the catalog and save your favorites',
            exploreMovies: 'Explore movies',
            
            // Groups
            chooseTogetherDesc: 'Choose what to watch together',
            new: 'New',
            howItWorks: 'How it works',
            createGroup: 'Create a group',
            createGroupDesc: 'Give your group a name and add a description.',
            inviteFriends: 'Invite your friends',
            inviteFriendsDesc: 'Add members by entering their email.',
            proposeMovies: 'Propose movies',
            proposeMoviesDesc: 'Each member can propose movies from the catalog.',
            decideTogether: 'Decide together',
            decideTogetherDesc: 'Vote for movies and discover perfect matches!',
            yourGroups: 'Your groups',
            noGroupsYet: 'You haven\'t created any groups yet',
            createFirstGroup: 'Create your first group',
            createNewGroup: 'Create new group',
            groupName: 'Group name *',
            groupNamePlaceholder: 'E.g. Movie night',
            description: 'Description',
            descriptionPlaceholder: 'A brief description (optional)',
            inviteFriend: 'Invite a friend (email)',
            
            // Profile
            memberSince: 'Member since January 2024',
            favoriteGenres: 'Your favorite genres',
            settings: 'Settings',
            language: 'Language',
            darkTheme: 'Dark theme',
            notifications: 'Notifications',
            privacy: 'Privacy & Security',
            helpCenter: 'Help Center',
            clearData: 'Clear data',
            logout: 'Log out',
            editProfile: 'Edit profile',
            name: 'Name',
            shareActivity: 'Share activity',
            showProfile: 'Show public profile',
            needHelp: 'Need more help?',
            contactUs: 'Contact us',
            
            // Search
            searchPlaceholder: 'Search movies, director, genre...',
            searchHint: 'Search by title, director or genre',
            noResults: 'No results for',
            
            // Toasts
            addedToFavorites: 'Added to favorites ❤️',
            addedToWatchlist: 'Added to watchlist 📑',
            alreadyInFavorites: 'Already in favorites',
            alreadyInWatchlist: 'Already in watchlist',
            movieSkipped: 'Movie skipped',
            movieRemoved: 'Movie removed',
            groupCreated: 'Group created 🎉',
            groupDeleted: 'Group deleted',
            memberInvited: 'Member invited 📧',
            movieAddedToGroup: 'Movie added 🎬',
            alreadyInGroup: 'Movie already in group',
            profileSaved: 'Profile saved ✓',
            dataClearedSuccess: 'Data cleared',
            enterName: 'Enter a name',
            languageChanged: 'Language changed',
            
            // Dialogs
            clearDataTitle: 'Clear all data?',
            clearDataMessage: 'This action will remove all saved movies, groups and preferences.',
            deleteGroupTitle: 'Delete this group?',
            deleteGroupMessage: 'This action cannot be undone.',
            
            // Film Details
            synopsis: 'Synopsis',
            crew: 'Crew',
            cast: 'Cast',
            availableOn: 'Available on',
            recommendedFor: 'Recommended for viewing',
            director: 'Director',
            screenplay: 'Screenplay',
            music: 'Music',
            cinematography: 'Cinematography',
            synopsisNotAvailable: 'Synopsis not available.',
            
            // Members
            members: 'Members',
            admin: 'Admin',
            proposedMovies: 'Proposed movies',
            noMoviesProposed: 'No movies proposed',
            addMovies: 'Add movies',
            invite: 'Invite',
            memberEmail: 'Member email:'
        }
    },
    
    // Get translation
    t(key) {
        return this.translations[this.currentLang]?.[key] || this.translations['it'][key] || key;
    },
    
    // Set language
    setLanguage(lang) {
        this.currentLang = lang;
        CONFIG.TMDB.LANGUAGE = lang === 'en' ? 'en-US' : 'it-IT';
        this.updateUI();
        Storage.set('language', lang);
    },
    
    // Update all UI elements with translations
    updateUI() {
        // Update data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        
        // Update data-i18n-placeholder elements
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    }
};

// ============================================
// 3. API SERVICES
// ============================================
const API = {
    // TMDb fetch wrapper
    async tmdbFetch(endpoint, params = {}) {
        const url = new URL(`${CONFIG.TMDB.BASE_URL}${endpoint}`);
        url.searchParams.append('api_key', CONFIG.TMDB.API_KEY);
        url.searchParams.append('language', CONFIG.TMDB.LANGUAGE);
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDb Error: ${res.status}`);
        return res.json();
    },

    // Get trending movies
    async getTrending() {
        const data = await this.tmdbFetch('/trending/movie/week');
        return data.results.map(m => this.transformMovie(m));
    },

    // Get movie details
    async getMovieDetails(id) {
        const data = await this.tmdbFetch(`/movie/${id}`, {
            append_to_response: 'credits,videos,watch/providers'
        });
        return this.transformMovieDetails(data);
    },

    // Search movies
    async searchMovies(query) {
        if (!query.trim()) return [];
        const data = await this.tmdbFetch('/search/movie', { query });
        return data.results.map(m => this.transformMovie(m));
    },

    // Transform basic movie data
    transformMovie(m) {
        return {
            id: m.id,
            title: m.title,
            year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            rating: m.vote_average ? (m.vote_average / 2).toFixed(1) : null,
            poster: m.poster_path ? `${CONFIG.TMDB.IMAGE_URL}/w500${m.poster_path}` : null,
            backdrop: m.backdrop_path ? `${CONFIG.TMDB.IMAGE_URL}/w1280${m.backdrop_path}` : null,
            genre: m.genre_ids?.[0] ? CONFIG.GENRES[m.genre_ids[0]] : 'Film',
            genreId: m.genre_ids?.[0]
        };
    },

    // Transform detailed movie data
    transformMovieDetails(m) {
        const trailer = m.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const director = m.credits?.crew?.find(c => c.job === 'Director');
        const writer = m.credits?.crew?.find(c => c.job === 'Screenplay' || c.job === 'Writer');
        const composer = m.credits?.crew?.find(c => c.job === 'Original Music Composer');
        const dop = m.credits?.crew?.find(c => c.job === 'Director of Photography');
        
        const providers = m['watch/providers']?.results?.IT;
        const platforms = providers?.flatrate?.map(p => p.provider_name) || [];

        return {
            id: m.id,
            title: m.title,
            year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            rating: m.vote_average ? (m.vote_average / 2).toFixed(1) : null,
            poster: m.poster_path ? `${CONFIG.TMDB.IMAGE_URL}/w500${m.poster_path}` : null,
            backdrop: m.backdrop_path ? `${CONFIG.TMDB.IMAGE_URL}/w1280${m.backdrop_path}` : null,
            genre: m.genres?.[0]?.name || 'Film',
            genreId: m.genres?.[0]?.id,
            duration: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}min` : null,
            synopsis: m.overview,
            trailer: trailer?.key || null,
            cast: m.credits?.cast?.slice(0, 8).map(c => c.name) || [],
            crew: {
                regia: director?.name,
                sceneggiatura: writer?.name,
                musiche: composer?.name,
                fotografia: dop?.name
            },
            platforms
        };
    },

    // Get drink pairing
    async getDrinkPairing(genre) {
        const searchTerm = CONFIG.DRINK_MAP[genre] || CONFIG.DRINK_MAP['default'];
        try {
            const res = await fetch(`${CONFIG.COCKTAIL.BASE_URL}/search.php?s=${searchTerm}`);
            const data = await res.json();
            if (data.drinks?.[0]) {
                const d = data.drinks[0];
                return {
                    name: d.strDrink,
                    description: `${d.strCategory} - ${d.strAlcoholic}`,
                    image: d.strDrinkThumb
                };
            }
        } catch (e) {
            console.error('Drink API error:', e);
        }
        return { name: 'Cinema Cocktail', description: 'A classic for movie night' };
    },

    // Get food pairing
    async getFoodPairing(genre) {
        const searchTerm = CONFIG.FOOD_MAP[genre] || CONFIG.FOOD_MAP['default'];
        try {
            const res = await fetch(`${CONFIG.SPOONACULAR.BASE_URL}/recipes/complexSearch?query=${searchTerm}&number=1&apiKey=${CONFIG.SPOONACULAR.API_KEY}`);
            const data = await res.json();
            if (data.results?.[0]) {
                return {
                    name: data.results[0].title,
                    description: 'Perfect for your movie night',
                    image: data.results[0].image
                };
            }
        } catch (e) {
            console.error('Food API error:', e);
        }
        return { name: 'Gourmet Popcorn', description: 'The timeless classic' };
    }
};

// ============================================
// 4. STORAGE
// ============================================
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

// ============================================
// 5. APP STATE & CORE
// ============================================
const App = {
    // State
    state: {
        films: [],
        currentIndex: 0,
        currentDetails: null,
        likedFilms: [],
        watchlistFilms: [],
        swipeCount: 0,
        groups: [],
        isMuted: false,
        isDarkTheme: true,
        notifications: false,
        profile: {
            name: 'Mario Rossi',
            email: 'mario.rossi@email.com'
        }
    },

    // DOM helpers
    $(id) { return document.getElementById(id); },
    $$(sel) { return document.querySelectorAll(sel); },

    // ==========================================
    // INITIALIZATION
    // ==========================================
    async init() {
        this.loadFromStorage();
        this.initTheme();
        this.initLanguage();
        this.bindEvents();
        await this.loadFilms();
        this.hideSplash();
    },

    loadFromStorage() {
        this.state.likedFilms = Storage.get('likedFilms', []);
        this.state.watchlistFilms = Storage.get('watchlistFilms', []);
        this.state.swipeCount = Storage.get('swipeCount', 0);
        this.state.groups = Storage.get('groups', []);
        this.state.isMuted = Storage.get('isMuted', false);
        this.state.isDarkTheme = Storage.get('theme', 'dark') !== 'light';
        this.state.notifications = Storage.get('notifications', false);
        this.state.profile = Storage.get('profile', this.state.profile);
    },

    saveToStorage() {
        Storage.set('likedFilms', this.state.likedFilms);
        Storage.set('watchlistFilms', this.state.watchlistFilms);
        Storage.set('swipeCount', this.state.swipeCount);
        Storage.set('groups', this.state.groups);
        Storage.set('isMuted', this.state.isMuted);
        Storage.set('profile', this.state.profile);
    },

    hideSplash() {
        setTimeout(() => {
            const splash = this.$('splashScreen');
            const app = this.$('appContainer');
            
            if (splash) {
                splash.classList.add('hide');
                setTimeout(() => splash.remove(), 600);
            }
            
            if (app) {
                app.classList.remove('hidden');
            }
        }, CONFIG.APP.SPLASH_DURATION);
    },

    // ==========================================
    // THEME
    // ==========================================
    initTheme() {
        if (!this.state.isDarkTheme) {
            document.documentElement.setAttribute('data-theme', 'light');
            this.$('themeToggle')?.classList.remove('active');
        }
        this.updateMuteIcon();
        
        // Notifications toggle
        if (this.state.notifications) {
            this.$('notificationsToggle')?.classList.add('active');
        }
    },

    toggleTheme() {
        this.state.isDarkTheme = !this.state.isDarkTheme;
        Storage.set('theme', this.state.isDarkTheme ? 'dark' : 'light');

        if (this.state.isDarkTheme) {
            document.documentElement.removeAttribute('data-theme');
            this.$('themeToggle').classList.add('active');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            this.$('themeToggle').classList.remove('active');
        }
    },

    toggleMute() {
        this.state.isMuted = !this.state.isMuted;
        this.updateMuteIcon();
        if (this.state.currentDetails) this.updateVideoCard(this.state.currentDetails);
        this.saveToStorage();
    },

    updateMuteIcon() {
        const icon = this.$('muteIcon');
        if (!icon) return;
        
        icon.innerHTML = this.state.isMuted
            ? `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
               <line x1="23" y1="9" x2="17" y2="15"></line>
               <line x1="17" y1="9" x2="23" y2="15"></line>`
            : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
               <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
    },

    // ==========================================
    // LANGUAGE
    // ==========================================
    initLanguage() {
        const savedLang = Storage.get('language', 'it');
        i18n.currentLang = savedLang;
        CONFIG.TMDB.LANGUAGE = savedLang === 'en' ? 'en-US' : 'it-IT';
        
        const langSelect = this.$('languageSelect');
        if (langSelect) langSelect.value = savedLang;
        
        i18n.updateUI();
    },

    changeLanguage(lang) {
        i18n.setLanguage(lang);
        this.showToast(i18n.t('languageChanged'), '🌐');
        // Reload films with new language
        this.loadFilms();
    },

    // ==========================================
    // FILMS
    // ==========================================
    async loadFilms() {
        this.showLoading(true);
        try {
            this.state.films = await API.getTrending();
            if (this.state.films.length > 0) {
                await this.loadFilm(0);
                this.renderFilmList();
                this.showLoading(false);
                this.updateStats();
            } else {
                this.showError(i18n.t('error'));
            }
        } catch (error) {
            console.error('Load error:', error);
            this.showError(i18n.t('error'));
        }
    },

    async loadFilm(index) {
        if (index < 0 || index >= this.state.films.length) return;
        
        const film = this.state.films[index];
        this.state.currentIndex = index;
        
        try {
            this.state.currentDetails = await API.getMovieDetails(film.id);
            this.updateVideoCard(this.state.currentDetails);
            this.updateFilmThumbs();
        } catch (error) {
            console.error('Film details error:', error);
            this.updateVideoCard(film);
        }
    },

    // ==========================================
    // UI UPDATES
    // ==========================================
    showLoading(show) {
        const loading = this.$('loadingState');
        const content = this.$('homeContent');
        const error = this.$('errorState');
        
        if (loading) loading.style.display = show ? 'flex' : 'none';
        if (content) content.style.display = show ? 'none' : 'block';
        if (error) error.style.display = 'none';
    },

    showError(msg) {
        const loading = this.$('loadingState');
        const content = this.$('homeContent');
        const error = this.$('errorState');
        
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'none';
        if (error) {
            error.style.display = 'flex';
            this.$('errorText').textContent = msg;
        }
    },

    updateVideoCard(film) {
        const details = this.state.currentDetails || film;
        
        this.$('filmTitle').textContent = details.title || '-';
        this.$('filmMeta').textContent = `${details.crew?.regia || i18n.t('director')} · ${details.year || ''}`;
        this.$('filmGenre').textContent = details.genre || 'Film';
        this.$('filmDuration').textContent = details.duration || '-';
        this.$('filmRating').textContent = details.rating || '-';

        const container = this.$('videoContainer');
        if (details.trailer) {
            const mute = this.state.isMuted ? '1' : '0';
            container.innerHTML = `
                <iframe src="${CONFIG.YOUTUBE.EMBED_URL}/${details.trailer}?autoplay=1&mute=${mute}&loop=1&playlist=${details.trailer}&controls=0&showinfo=0&rel=0&modestbranding=1"
                    allow="autoplay; encrypted-media" allowfullscreen></iframe>
            `;
        } else {
            const img = details.backdrop || details.poster;
            container.innerHTML = img 
                ? `<div class="backdrop" style="background-image: url('${img}');"></div>`
                : `<div class="backdrop" style="background: var(--bg-tertiary);"></div>`;
        }
    },

    updateFilmThumbs() {
        this.$$('.film-thumb').forEach((el, i) => {
            el.classList.toggle('active', i === this.state.currentIndex);
        });
    },

    renderFilmList() {
        const container = this.$('filmList');
        if (!container) return;
        
        container.innerHTML = this.state.films.slice(0, 15).map((f, i) => `
            <div class="film-thumb ${i === 0 ? 'active' : ''}" data-index="${i}"
                 style="background-image: url('${f.poster || ''}');"></div>
        `).join('');
    },

    updateStats() {
        ['statLiked', 'homeStatLiked'].forEach(id => {
            const el = this.$(id);
            if (el) el.textContent = this.state.likedFilms.length;
        });
        ['statWatchlist', 'homeStatWatchlist'].forEach(id => {
            const el = this.$(id);
            if (el) el.textContent = this.state.watchlistFilms.length;
        });
        ['statSwiped', 'homeStatSwiped'].forEach(id => {
            const el = this.$(id);
            if (el) el.textContent = this.state.swipeCount;
        });
        this.updateGenreStats();
        this.updateProfile();
    },

    updateGenreStats() {
        const counts = {};
        [...this.state.likedFilms, ...this.state.watchlistFilms].forEach(f => {
            if (f.genre) counts[f.genre] = (counts[f.genre] || 0) + 1;
        });
        
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
        
        const container = this.$('genreStats');
        if (!container) return;
        
        if (sorted.length === 0) {
            container.innerHTML = `<p style="text-align: center; padding: 20px; color: var(--text-muted);">${i18n.t('exploreAndSave')}</p>`;
        } else {
            container.innerHTML = sorted.map(([genre, count]) => {
                const pct = Math.round((count / total) * 100);
                return `
                    <div class="progress-item">
                        <div class="progress-header">
                            <span>${genre}</span>
                            <span class="text-muted">${pct}%</span>
                        </div>
                        <div class="progress-bar"><div class="fill" style="width: ${pct}%;"></div></div>
                    </div>
                `;
            }).join('');
        }
    },

    updateProfile() {
        const initials = this.state.profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const initialsEl = this.$('profileInitials');
        const nameEl = this.$('profileName');
        const emailEl = this.$('profileEmail');
        
        if (initialsEl) initialsEl.textContent = initials;
        if (nameEl) nameEl.textContent = this.state.profile.name;
        if (emailEl) emailEl.textContent = this.state.profile.email;
    },

    // ==========================================
    // FILM ACTIONS
    // ==========================================
    async swipeFilm(direction) {
        const card = this.$('videoCard');
        card.classList.add(`swipe-${direction}`);
        this.state.swipeCount++;

        const film = this.state.currentDetails || this.state.films[this.state.currentIndex];
        
        if (direction === 'right' && film && !this.state.likedFilms.find(f => f.id === film.id)) {
            this.state.likedFilms.push(this.simplifyFilm(film));
            this.showToast(i18n.t('addedToFavorites'), '❤️');
        } else if (direction === 'left') {
            this.showToast(i18n.t('movieSkipped'), '👋');
        }

        this.saveToStorage();

        setTimeout(async () => {
            card.classList.remove(`swipe-${direction}`);
            card.style.transform = '';
            const next = (this.state.currentIndex + 1) % this.state.films.length;
            await this.loadFilm(next);
            this.updateStats();
        }, 400);
    },

    saveToWatchlist() {
        const film = this.state.currentDetails || this.state.films[this.state.currentIndex];
        if (!film) return;

        if (!this.state.watchlistFilms.find(f => f.id === film.id)) {
            this.state.watchlistFilms.push(this.simplifyFilm(film));
            this.showToast(i18n.t('addedToWatchlist'), '📑');
            this.updateStats();
            this.saveToStorage();
        } else {
            this.showToast(i18n.t('alreadyInWatchlist'), 'ℹ️');
        }
    },

    simplifyFilm(film) {
        return {
            id: film.id,
            title: film.title,
            year: film.year,
            rating: film.rating,
            poster: film.poster,
            genre: film.genre,
            crew: film.crew || {}
        };
    },

    async showFilmDetails(filmId) {
        const content = this.$('detailsContent');
        content.innerHTML = `<div class="loading-state" style="min-height: 200px;"><div class="spinner-3d"></div><p>${i18n.t('loading')}</p></div>`;
        this.openSheet('detailsSheet');

        try {
            const film = await API.getMovieDetails(filmId);
            const [drink, food] = await Promise.all([
                API.getDrinkPairing(film.genre),
                API.getFoodPairing(film.genre)
            ]);

            content.innerHTML = `
                <div class="film-details-header">
                    <div class="film-details-poster" style="background-image: url('${film.poster || ''}');"></div>
                    <div class="film-details-info">
                        <h2>${film.title}</h2>
                        <p class="meta">${film.year || ''} · ${film.duration || ''}</p>
                        <div class="film-badges">
                            <div class="rating-pill">
                                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <span>${film.rating || 'N/A'}</span>
                            </div>
                            <span class="tag">${film.genre}</span>
                        </div>
                    </div>
                </div>

                <div class="section" style="margin-top: 0;">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">${i18n.t('synopsis')}</h3>
                    <p class="synopsis">${film.synopsis || i18n.t('synopsisNotAvailable')}</p>
                </div>

                ${film.crew && Object.values(film.crew).some(v => v) ? `
                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">${i18n.t('crew')}</h3>
                    <div class="crew-list glass-card" style="padding: 4px 16px;">
                        ${film.crew.regia ? `<div class="detail-row" style="display: flex; padding: 12px 0; border-bottom: 1px solid var(--border);"><span style="width: 130px; color: var(--text-muted); font-size: 13px;">${i18n.t('director')}</span><span style="color: var(--text-secondary); font-size: 13px;">${film.crew.regia}</span></div>` : ''}
                        ${film.crew.sceneggiatura ? `<div class="detail-row" style="display: flex; padding: 12px 0; border-bottom: 1px solid var(--border);"><span style="width: 130px; color: var(--text-muted); font-size: 13px;">${i18n.t('screenplay')}</span><span style="color: var(--text-secondary); font-size: 13px;">${film.crew.sceneggiatura}</span></div>` : ''}
                        ${film.crew.musiche ? `<div class="detail-row" style="display: flex; padding: 12px 0; border-bottom: 1px solid var(--border);"><span style="width: 130px; color: var(--text-muted); font-size: 13px;">${i18n.t('music')}</span><span style="color: var(--text-secondary); font-size: 13px;">${film.crew.musiche}</span></div>` : ''}
                        ${film.crew.fotografia ? `<div class="detail-row" style="display: flex; padding: 12px 0;"><span style="width: 130px; color: var(--text-muted); font-size: 13px;">${i18n.t('cinematography')}</span><span style="color: var(--text-secondary); font-size: 13px;">${film.crew.fotografia}</span></div>` : ''}
                    </div>
                </div>
                ` : ''}

                ${film.cast?.length ? `
                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">${i18n.t('cast')}</h3>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">${film.cast.join(', ')}</p>
                </div>
                ` : ''}

                ${film.platforms?.length ? `
                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">${i18n.t('availableOn')}</h3>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${film.platforms.map(p => `<span class="tag">${p}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">${i18n.t('recommendedFor')}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="glass-card" style="padding: 16px;">
                            <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--glass-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--text-primary)" stroke-width="1.5" fill="none"><path d="M8 22h8M12 11V22M17 2l-1 5h-8l-1-5M5.5 7h13l-1.4 5.6a2 2 0 0 1-1.9 1.4H8.8a2 2 0 0 1-1.9-1.4L5.5 7z"/></svg>
                            </div>
                            <p style="font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">${drink.name}</p>
                            <p style="font-size: 11px; color: var(--text-muted); margin: 0;">${drink.description}</p>
                        </div>
                        <div class="glass-card" style="padding: 16px;">
                            <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--glass-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--text-primary)" stroke-width="1.5" fill="none"><path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM15.42 15.42l6.37-6.37M10.75 6.36L15.12 2l6.37 6.37-4.36 4.36"/></svg>
                            </div>
                            <p style="font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">${food.name}</p>
                            <p style="font-size: 11px; color: var(--text-muted); margin: 0;">${food.description}</p>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button onclick="App.addToLiked(${film.id})" class="btn-primary" style="flex: 1;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        ${i18n.t('favorites')}
                    </button>
                    <button onclick="App.addToWatchlistById(${film.id})" class="btn-secondary" style="flex: 1;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                        ${i18n.t('toWatch')}
                    </button>
                </div>
            `;
        } catch (error) {
            content.innerHTML = `<p style="text-align: center; padding: 40px; color: var(--text-muted);">${i18n.t('error')}</p>`;
        }
    },

    async addToLiked(id) {
        try {
            const film = await API.getMovieDetails(id);
            if (!this.state.likedFilms.find(f => f.id === id)) {
                this.state.likedFilms.push(this.simplifyFilm(film));
                this.showToast(i18n.t('addedToFavorites'), '❤️');
                this.updateStats();
                this.saveToStorage();
            } else {
                this.showToast(i18n.t('alreadyInFavorites'), 'ℹ️');
            }
        } catch (e) {
            this.showToast(i18n.t('error'), '❌');
        }
        this.closeSheet();
    },

    async addToWatchlistById(id) {
        try {
            const film = await API.getMovieDetails(id);
            if (!this.state.watchlistFilms.find(f => f.id === id)) {
                this.state.watchlistFilms.push(this.simplifyFilm(film));
                this.showToast(i18n.t('addedToWatchlist'), '📑');
                this.updateStats();
                this.saveToStorage();
            } else {
                this.showToast(i18n.t('alreadyInWatchlist'), 'ℹ️');
            }
        } catch (e) {
            this.showToast(i18n.t('error'), '❌');
        }
        this.closeSheet();
    },

    removeFilm(id, type) {
        if (type === 'liked') {
            this.state.likedFilms = this.state.likedFilms.filter(f => f.id !== id);
            this.renderSavedList('liked');
        } else {
            this.state.watchlistFilms = this.state.watchlistFilms.filter(f => f.id !== id);
            this.renderSavedList('watchlist');
        }
        this.updateStats();
        this.saveToStorage();
        this.showToast(i18n.t('movieRemoved'), '🗑️');
    },

    // ==========================================
    // SAVED LIST
    // ==========================================
    renderSavedList(type, searchQuery = '') {
        let list = type === 'liked' ? this.state.likedFilms : this.state.watchlistFilms;
        const container = this.$(type === 'liked' ? 'likedList' : 'watchlistList');
        
        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter(f => 
                f.title.toLowerCase().includes(query) ||
                f.genre?.toLowerCase().includes(query) ||
                f.crew?.regia?.toLowerCase().includes(query)
            );
        }

        if (list.length === 0) {
            container.innerHTML = '';
            this.$('emptyState').style.display = searchQuery ? 'none' : 'block';
            
            if (searchQuery) {
                container.innerHTML = `<p style="text-align: center; padding: 40px; color: var(--text-muted);">${i18n.t('noResults')} "${searchQuery}"</p>`;
            }
        } else {
            this.$('emptyState').style.display = 'none';
            container.innerHTML = list.map(f => `
                <div class="card film-card fade-in">
                    <div class="film-card-poster" style="background-image: url('${f.poster || ''}');"></div>
                    <div class="film-card-content">
                        <h3>${f.title}</h3>
                        <p class="meta">${f.crew?.regia || ''} · ${f.year || ''}</p>
                        <div class="film-card-meta">
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span>${f.rating || 'N/A'}</span>
                            <span class="tag">${f.genre || 'Film'}</span>
                        </div>
                        <div class="film-card-actions">
                            <button class="btn-primary small" onclick="App.showFilmDetails(${f.id})">${i18n.t('details')}</button>
                            <button class="btn-secondary small" onclick="App.removeFilm(${f.id}, '${type}')">${i18n.t('delete')}</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    },

    // ==========================================
    // SEARCH
    // ==========================================
    async searchFilms(query) {
        const container = this.$('searchResults');
        const clearBtn = this.$('clearSearchBtn');
        
        // Toggle clear button
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', !query.trim());
        }
        
        if (!query.trim()) {
            container.innerHTML = `<p class="search-hint">${i18n.t('searchHint')}</p>`;
            return;
        }

        container.innerHTML = `<div class="loading-state" style="min-height: 100px;"><div class="spinner-3d"></div></div>`;

        try {
            const results = await API.searchMovies(query);
            if (results.length === 0) {
                container.innerHTML = `<p class="search-hint">${i18n.t('noResults')} "${query}"</p>`;
            } else {
                container.innerHTML = `<div class="search-results-list">${results.map(f => `
                    <div class="search-result-card fade-in" onclick="App.showFilmDetails(${f.id})">
                        <div class="search-result-poster" style="background-image: url('${f.poster || ''}');"></div>
                        <div class="search-result-info">
                            <h3>${f.title}</h3>
                            <p>${f.year || ''}</p>
                            <span class="tag">${f.genre}</span>
                        </div>
                    </div>
                `).join('')}</div>`;
            }
        } catch (e) {
            container.innerHTML = `<p class="search-hint">${i18n.t('error')}</p>`;
        }
    },

    clearSearch() {
        const input = this.$('searchInput');
        if (input) {
            input.value = '';
            this.searchFilms('');
            input.focus();
        }
    },

    // ==========================================
    // GROUPS
    // ==========================================
    createGroup() {
        const name = this.$('groupNameInput').value.trim();
        const desc = this.$('groupDescInput').value.trim();
        const email = this.$('groupEmailInput').value.trim();

        if (!name) {
            this.showToast(i18n.t('enterName'), '⚠️');
            return;
        }

        const members = ['Tu'];
        if (email) members.push(email.split('@')[0]);

        this.state.groups.push({
            id: Date.now(),
            name,
            description: desc,
            members,
            films: []
        });

        this.$('groupNameInput').value = '';
        this.$('groupDescInput').value = '';
        this.$('groupEmailInput').value = '';

        this.closeSheet();
        this.renderGroups();
        this.saveToStorage();
        this.showToast(i18n.t('groupCreated'), '🎉');
    },

    renderGroups() {
        const container = this.$('groupsList');
        if (!container) return;
        
        if (this.state.groups.length === 0) {
            container.innerHTML = '';
            this.$('noGroups').style.display = 'block';
        } else {
            this.$('noGroups').style.display = 'none';
            container.innerHTML = this.state.groups.map((g, i) => `
                <div class="group-card fade-in" onclick="App.openGroupDetail(${i})">
                    <div class="group-card-header">
                        <div>
                            <h3>${g.name}</h3>
                            <p>${g.description || '-'}</p>
                        </div>
                        <span class="tag">${g.films.length} film</span>
                    </div>
                    <div class="group-card-footer">
                        <div class="members-avatars">
                            ${g.members.slice(0, 4).map(m => `<div class="member-avatar">${m.charAt(0).toUpperCase()}</div>`).join('')}
                        </div>
                        <span class="text-muted text-sm">${g.members.length} ${g.members.length === 1 ? 'membro' : 'membri'}</span>
                    </div>
                </div>
            `).join('');
        }
    },

    openGroupDetail(index) {
        const g = this.state.groups[index];
        if (!g) return;

        const content = this.$('groupDetailContent');
        content.innerHTML = `
            <h2>${g.name}</h2>
            <p class="text-muted" style="margin-bottom: 24px;">${g.description || '-'}</p>

            <div class="section" style="margin-top: 0;">
                <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">${i18n.t('members')} (${g.members.length})</h3>
                ${g.members.map((m, i) => `
                    <div class="glass-card" style="display: flex; align-items: center; gap: 12px; padding: 12px; margin-bottom: 8px;">
                        <div class="member-avatar" style="margin: 0;">${m.charAt(0).toUpperCase()}</div>
                        <span style="flex: 1;">${m}</span>
                        ${i === 0 ? `<span class="tag">${i18n.t('admin')}</span>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">${i18n.t('proposedMovies')} (${g.films.length})</h3>
                ${g.films.length === 0 
                    ? `<p class="text-muted" style="text-align: center; padding: 20px; background: var(--bg-secondary); border-radius: 10px;">${i18n.t('noMoviesProposed')}</p>`
                    : g.films.map(f => `
                        <div class="glass-card" style="display: flex; gap: 12px; padding: 12px; margin-bottom: 8px;">
                            <div style="width: 48px; height: 72px; border-radius: 6px; background-image: url('${f.poster}'); background-size: cover;"></div>
                            <div>
                                <p style="font-weight: 600; margin: 0;">${f.title}</p>
                                <p class="text-muted" style="font-size: 12px; margin: 4px 0 0 0;">${f.year}</p>
                            </div>
                        </div>
                    `).join('')}
            </div>

            <div class="section">
                <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">${i18n.t('addMovies')}</h3>
                <div class="film-list">
                    ${this.state.films.slice(0, 10).map(f => `
                        <div class="film-thumb" onclick="App.addFilmToGroup(${index}, ${f.id})" style="background-image: url('${f.poster}');"></div>
                    `).join('')}
                </div>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button class="btn-primary" style="flex: 1;" onclick="App.inviteToGroup(${index})">${i18n.t('invite')}</button>
                <button class="btn-secondary danger" style="flex: 1;" onclick="App.confirmDeleteGroup(${index})">${i18n.t('delete')}</button>
            </div>
        `;

        this.openSheet('groupDetailSheet');
    },

    async addFilmToGroup(groupIndex, filmId) {
        const group = this.state.groups[groupIndex];
        if (!group || group.films.find(f => f.id === filmId)) {
            this.showToast(i18n.t('alreadyInGroup'), 'ℹ️');
            return;
        }

        try {
            const film = await API.getMovieDetails(filmId);
            group.films.push(this.simplifyFilm(film));
            this.saveToStorage();
            this.openGroupDetail(groupIndex);
            this.showToast(i18n.t('movieAddedToGroup'), '🎬');
        } catch (e) {
            this.showToast(i18n.t('error'), '❌');
        }
    },

    inviteToGroup(index) {
        const email = prompt(i18n.t('memberEmail'));
        if (email && email.includes('@')) {
            this.state.groups[index].members.push(email.split('@')[0]);
            this.saveToStorage();
            this.openGroupDetail(index);
            this.showToast(i18n.t('memberInvited'), '📧');
        }
    },

    confirmDeleteGroup(index) {
        this.showConfirm(
            i18n.t('deleteGroupTitle'),
            i18n.t('deleteGroupMessage'),
            () => this.deleteGroup(index)
        );
    },

    deleteGroup(index) {
        this.state.groups.splice(index, 1);
        this.closeSheet();
        this.renderGroups();
        this.saveToStorage();
        this.showToast(i18n.t('groupDeleted'), '🗑️');
    },

    // ==========================================
    // PROFILE
    // ==========================================
    openEditProfile() {
        this.$('editNameInput').value = this.state.profile.name;
        this.$('editEmailInput').value = this.state.profile.email;
        this.openSheet('editProfileSheet');
    },

    saveProfile() {
        const name = this.$('editNameInput').value.trim();
        const email = this.$('editEmailInput').value.trim();
        
        if (name) this.state.profile.name = name;
        if (email) this.state.profile.email = email;
        
        this.saveToStorage();
        this.updateProfile();
        this.closeSheet();
        this.showToast(i18n.t('profileSaved'), '✓');
    },

    toggleNotifications() {
        this.state.notifications = !this.state.notifications;
        Storage.set('notifications', this.state.notifications);
        this.$('notificationsToggle').classList.toggle('active', this.state.notifications);
    },

    confirmClearData() {
        this.showConfirm(
            i18n.t('clearDataTitle'),
            i18n.t('clearDataMessage'),
            () => this.clearAllData()
        );
    },

    clearAllData() {
        Storage.clear();
        this.state.likedFilms = [];
        this.state.watchlistFilms = [];
        this.state.swipeCount = 0;
        this.state.groups = [];
        this.updateStats();
        this.showToast(i18n.t('dataClearedSuccess'), '🗑️');
    },

    // ==========================================
    // NAVIGATION
    // ==========================================
    switchPage(name) {
        this.$$('.page').forEach(p => p.classList.remove('active'));
        const page = this.$(name + 'Page');
        if (page) page.classList.add('active');

        this.$$('.nav-item').forEach(n => n.classList.remove('active'));
        const navItem = document.querySelector(`[data-page="${name}"]`);
        if (navItem) navItem.classList.add('active');

        if (name === 'salvati') this.renderSavedList('liked');
        if (name === 'gruppi') this.renderGroups();
        if (name === 'profilo') this.updateStats();
    },

    // ==========================================
    // SHEETS & MODALS
    // ==========================================
    openSheet(id) {
        this.$(id)?.classList.add('open');
        this.$('overlay')?.classList.add('open');
    },

    closeSheet() {
        this.$$('.bottom-sheet').forEach(s => s.classList.remove('open'));
        this.$('overlay')?.classList.remove('open');
    },

    showConfirm(title, message, onConfirm) {
        this.$('confirmTitle').textContent = title;
        this.$('confirmMessage').textContent = message;
        this.$('confirmDialog').classList.add('open');
        
        this._confirmCallback = onConfirm;
    },

    handleConfirm(confirmed) {
        this.$('confirmDialog').classList.remove('open');
        if (confirmed && this._confirmCallback) {
            this._confirmCallback();
        }
        this._confirmCallback = null;
    },

    // ==========================================
    // TOAST
    // ==========================================
    showToast(msg, icon = '') {
        const toast = this.$('toast');
        const textEl = this.$('toastText');
        const iconEl = this.$('toastIcon');
        
        if (iconEl) iconEl.textContent = icon;
        if (textEl) textEl.textContent = msg;
        
        toast?.classList.add('show');
        setTimeout(() => toast?.classList.remove('show'), 2500);
    },

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        // Navigation
        this.$$('.nav-item').forEach(item => {
            item.addEventListener('click', () => this.switchPage(item.dataset.page));
        });

        // Film list clicks
        this.$('filmList')?.addEventListener('click', e => {
            const thumb = e.target.closest('.film-thumb');
            if (thumb) this.loadFilm(parseInt(thumb.dataset.index));
        });

        // Action buttons
        this.$('likeBtn')?.addEventListener('click', () => this.swipeFilm('right'));
        this.$('skipBtn')?.addEventListener('click', () => this.swipeFilm('left'));
        this.$('saveBtn')?.addEventListener('click', () => this.saveToWatchlist());
        this.$('detailsBtn')?.addEventListener('click', () => {
            const film = this.state.currentDetails || this.state.films[this.state.currentIndex];
            if (film) this.showFilmDetails(film.id);
        });

        // Header buttons
        this.$('muteBtn')?.addEventListener('click', () => this.toggleMute());
        this.$('searchBtn')?.addEventListener('click', () => {
            this.openSheet('searchSheet');
            setTimeout(() => this.$('searchInput')?.focus(), 300);
        });

        // Language
        this.$('languageSelect')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Theme
        this.$('themeMenuItem')?.addEventListener('click', () => this.toggleTheme());

        // Notifications
        this.$('notificationsMenuItem')?.addEventListener('click', () => this.toggleNotifications());

        // Privacy
        this.$('privacyMenuItem')?.addEventListener('click', () => this.openSheet('privacySheet'));

        // Help
        this.$('helpMenuItem')?.addEventListener('click', () => this.openSheet('helpSheet'));

        // Clear Data
        this.$('clearDataMenuItem')?.addEventListener('click', () => this.confirmClearData());

        // Edit Profile
        this.$('editProfileBtn')?.addEventListener('click', () => this.openEditProfile());
        this.$('saveProfileBtn')?.addEventListener('click', () => this.saveProfile());

        // Tabs
        this.$$('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.$$('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                
                const likedList = this.$('likedList');
                const watchlistList = this.$('watchlistList');
                
                if (likedList) likedList.classList.toggle('hidden', tab !== 'liked');
                if (watchlistList) watchlistList.classList.toggle('hidden', tab !== 'watchlist');
                
                this.renderSavedList(tab);
            });
        });

        // Groups
        this.$('newGroupBtn')?.addEventListener('click', () => this.openSheet('groupSheet'));
        this.$('createFirstGroup')?.addEventListener('click', () => this.openSheet('groupSheet'));
        this.$('confirmGroupBtn')?.addEventListener('click', () => this.createGroup());

        // Search
        let searchTimeout;
        this.$('searchInput')?.addEventListener('input', e => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => this.searchFilms(e.target.value), 300);
        });

        this.$('clearSearchBtn')?.addEventListener('click', () => this.clearSearch());

        // Saved search
        let savedSearchTimeout;
        this.$('savedSearchInput')?.addEventListener('input', e => {
            clearTimeout(savedSearchTimeout);
            const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'liked';
            savedSearchTimeout = setTimeout(() => this.renderSavedList(activeTab, e.target.value), 200);
        });

        // Overlay
        this.$('overlay')?.addEventListener('click', () => this.closeSheet());

        // Confirm dialog
        this.$('confirmCancel')?.addEventListener('click', () => this.handleConfirm(false));
        this.$('confirmOk')?.addEventListener('click', () => this.handleConfirm(true));

        // Touch swipe on video card
        this.initTouchSwipe();
    },

    initTouchSwipe() {
        let startX = 0, currentX = 0, isDragging = false;
        const card = this.$('videoCard');
        if (!card) return;

        card.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        card.addEventListener('touchmove', e => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            card.style.transform = `translateX(${diff * 0.5}px) rotate(${diff * 0.02}deg)`;
            card.style.transition = 'none';
            
            // Show swipe indicators
            card.classList.toggle('swiping-left', diff < -30);
            card.classList.toggle('swiping-right', diff > 30);
        }, { passive: true });

        card.addEventListener('touchend', () => {
            isDragging = false;
            const diff = currentX - startX;
            card.style.transition = '';
            card.classList.remove('swiping-left', 'swiping-right');

            if (Math.abs(diff) > 100) {
                this.swipeFilm(diff > 0 ? 'right' : 'left');
            } else {
                card.style.transform = '';
            }
            startX = 0;
            currentX = 0;
        });
    }
};

// ============================================
// 8. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => App.init());
