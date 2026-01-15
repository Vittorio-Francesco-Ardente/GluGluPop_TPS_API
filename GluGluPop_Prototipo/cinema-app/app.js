/**
 * ============================================
 * GLUGLUPOP - Cinema Experience App
 * ============================================
 * 
 * API utilizzate:
 * - TMDb: catalogo film, trailer, cast, piattaforme
 * - TheCocktailDB: suggerimenti drink
 * - Spoonacular: abbinamenti cibo
 */

// ============================================
// CONFIGURAZIONE API
// ============================================
const CONFIG = {
    // TMDb - Registrati su https://www.themoviedb.org/settings/api
    TMDB: {
        API_KEY: 'c4439fc09e7e33c2472635214c87f38c', // <-- Inserisci la tua API key qui
        BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_URL: 'https://image.tmdb.org/t/p',
        LANGUAGE: 'it-IT'
    },
    // YouTube Embed
    YOUTUBE: {
        EMBED_URL: 'https://www.youtube.com/embed',
        LANGUAGE: 'it-IT'
    },
    // TheCocktailDB - Gratuita
    COCKTAIL: {
        BASE_URL: 'https://www.thecocktaildb.com/api/json/v1/1',
        LANGUAGE: 'it-IT'
    },
    // Spoonacular - Registrati su https://spoonacular.com/food-api
    SPOONACULAR: {
        API_KEY: '308a0867947d4105a9443b014bed876b', // <-- Inserisci la tua API key qui
        BASE_URL: 'https://api.spoonacular.com',
        LANGUAGE: 'it-IT'
    },
    // Generi TMDb
    GENRES: {
        28: 'Azione', 12: 'Avventura', 16: 'Animazione', 35: 'Commedia',
        80: 'Crime', 99: 'Documentario', 18: 'Drammatico', 10751: 'Famiglia',
        14: 'Fantasy', 36: 'Storia', 27: 'Horror', 10402: 'Musica',
        9648: 'Mistero', 10749: 'Romance', 878: 'Fantascienza',
        10770: 'Film TV', 53: 'Thriller', 10752: 'Guerra', 37: 'Western'
    },
    // Drink per genere
    DRINK_MAP: {
        'Azione': 'margarita', 'Fantascienza': 'blue lagoon', 'Drammatico': 'martini',
        'Commedia': 'mojito', 'Horror': 'bloody mary', 'Romance': 'bellini',
        'Thriller': 'negroni', 'Avventura': 'mai tai', 'default': 'old fashioned'
    },
    // Cibo per genere
    FOOD_MAP: {
        'Azione': 'nachos', 'Fantascienza': 'popcorn', 'Drammatico': 'cheese',
        'Commedia': 'pizza', 'Horror': 'candy', 'Romance': 'chocolate',
        'Thriller': 'bruschetta', 'Avventura': 'tacos', 'default': 'popcorn'
    }
};

// ============================================
// API SERVICES
// ============================================
const API = {
    // Fetch TMDb
    async tmdbFetch(endpoint, params = {}) {
        const url = new URL(`${CONFIG.TMDB.BASE_URL}${endpoint}`);
        url.searchParams.append('api_key', CONFIG.TMDB.API_KEY);
        url.searchParams.append('language', CONFIG.TMDB.LANGUAGE);
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDb Error: ${res.status}`);
        return res.json();
    },

    // Film in tendenza
    async getTrending() {
        const data = await this.tmdbFetch('/trending/movie/week');
        return data.results.map(m => this.transformMovie(m));
    },

    // Dettagli film completi
    async getMovieDetails(id) {
        const data = await this.tmdbFetch(`/movie/${id}`, {
            append_to_response: 'credits,videos,watch/providers'
        });
        return this.transformMovieDetails(data);
    },

    // Cerca film
    async searchMovies(query) {
        if (!query.trim()) return [];
        const data = await this.tmdbFetch('/search/movie', { query });
        return data.results.map(m => this.transformMovie(m));
    },

    // Trasforma film base
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

    // Trasforma film con dettagli
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

    // Drink pairing
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
        return { name: 'Cocktail del cinema', description: 'Un classico per la serata film' };
    },

    // Food pairing
    async getFoodPairing(genre) {
        const searchTerm = CONFIG.FOOD_MAP[genre] || CONFIG.FOOD_MAP['default'];
        try {
            const res = await fetch(`${CONFIG.SPOONACULAR.BASE_URL}/recipes/complexSearch?query=${searchTerm}&number=1&apiKey=${CONFIG.SPOONACULAR.API_KEY}`);
            const data = await res.json();
            if (data.results?.[0]) {
                return {
                    name: data.results[0].title,
                    description: 'Perfetto per la tua serata cinema',
                    image: data.results[0].image
                };
            }
        } catch (e) {
            console.error('Food API error:', e);
        }
        return { name: 'Popcorn gourmet', description: 'Il classico intramontabile' };
    }
};

// ============================================
// APP STATE
// ============================================
const App = {
    state: {
        films: [],
        currentIndex: 0,
        currentDetails: null,
        likedFilms: [],
        watchlistFilms: [],
        swipeCount: 0,
        groups: [],
        isMuted: false,
        isDarkTheme: true
    },

    // DOM Helpers
    $(id) { return document.getElementById(id); },
    $$(sel) { return document.querySelectorAll(sel); },

    // ============================================
    // INITIALIZATION
    // ============================================
    async init() {
        this.loadFromStorage();
        this.initTheme();
        this.bindEvents();
        await this.loadFilms();
    },

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
                this.showError('Nessun film trovato');
            }
        } catch (error) {
            console.error('Load error:', error);
            this.showError('Errore nel caricamento. Verifica la tua API key TMDb.');
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

    // ============================================
    // UI UPDATES
    // ============================================
    showLoading(show) {
        this.$('loadingState').style.display = show ? 'flex' : 'none';
        this.$('homeContent').style.display = show ? 'none' : 'block';
        this.$('errorState').style.display = 'none';
    },

    showError(msg) {
        this.$('loadingState').style.display = 'none';
        this.$('homeContent').style.display = 'none';
        this.$('errorState').style.display = 'flex';
        this.$('errorText').textContent = msg;
    },

    updateVideoCard(film) {
        const details = this.state.currentDetails || film;
        
        this.$('filmTitle').textContent = details.title || '-';
        this.$('filmMeta').textContent = `${details.crew?.regia || 'Regista'} · ${details.year || ''}`;
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
        this.$('filmList').innerHTML = this.state.films.slice(0, 15).map((f, i) => `
            <div class="film-thumb ${i === 0 ? 'active' : ''}" data-index="${i}"
                 style="background-image: url('${f.poster || ''}');"></div>
        `).join('');
    },

    updateStats() {
        ['statLiked', 'homeStatLiked'].forEach(id => {
            this.$(id).textContent = this.state.likedFilms.length;
        });
        ['statWatchlist', 'homeStatWatchlist'].forEach(id => {
            this.$(id).textContent = this.state.watchlistFilms.length;
        });
        ['statSwiped', 'homeStatSwiped'].forEach(id => {
            this.$(id).textContent = this.state.swipeCount;
        });
        this.updateGenreStats();
    },

    updateGenreStats() {
        const counts = {};
        [...this.state.likedFilms, ...this.state.watchlistFilms].forEach(f => {
            if (f.genre) counts[f.genre] = (counts[f.genre] || 0) + 1;
        });
        
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
        
        const container = this.$('genreStats');
        if (sorted.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--text-muted);">Salva film per vedere le tue preferenze</p>';
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

    updateMuteIcon() {
        const icon = this.$('muteIcon');
        icon.innerHTML = this.state.isMuted
            ? `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
               <line x1="23" y1="9" x2="17" y2="15"></line>
               <line x1="17" y1="9" x2="23" y2="15"></line>`
            : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
               <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
    },

    // ============================================
    // FILM ACTIONS
    // ============================================
    async swipeFilm(direction) {
        const card = this.$('videoCard');
        card.classList.add(`swipe-${direction}`);
        this.state.swipeCount++;

        const film = this.state.currentDetails || this.state.films[this.state.currentIndex];
        
        if (direction === 'right' && film && !this.state.likedFilms.find(f => f.id === film.id)) {
            this.state.likedFilms.push(this.simplifyFilm(film));
            this.showToast('Aggiunto ai preferiti ❤️');
        } else if (direction === 'left') {
            this.showToast('Film saltato');
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
            this.showToast('Aggiunto alla watchlist 📑');
            this.updateStats();
            this.saveToStorage();
        } else {
            this.showToast('Già nella watchlist');
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
        content.innerHTML = '<div class="loading-state" style="min-height: 200px;"><div class="spinner"></div><p>Caricamento...</p></div>';
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
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Trama</h3>
                    <p class="synopsis">${film.synopsis || 'Trama non disponibile.'}</p>
                </div>

                ${film.crew && Object.values(film.crew).some(v => v) ? `
                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Crew</h3>
                    <div class="crew-list">
                        ${film.crew.regia ? `<div class="detail-row"><span class="detail-label">Regia</span><span class="detail-value">${film.crew.regia}</span></div>` : ''}
                        ${film.crew.sceneggiatura ? `<div class="detail-row"><span class="detail-label">Sceneggiatura</span><span class="detail-value">${film.crew.sceneggiatura}</span></div>` : ''}
                        ${film.crew.musiche ? `<div class="detail-row"><span class="detail-label">Musiche</span><span class="detail-value">${film.crew.musiche}</span></div>` : ''}
                        ${film.crew.fotografia ? `<div class="detail-row"><span class="detail-label">Fotografia</span><span class="detail-value">${film.crew.fotografia}</span></div>` : ''}
                    </div>
                </div>
                ` : ''}

                ${film.cast?.length ? `
                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Cast</h3>
                    <p class="cast-list">${film.cast.join(', ')}</p>
                </div>
                ` : ''}

                ${film.platforms?.length ? `
                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Disponibile su</h3>
                    <div class="platforms-list">
                        ${film.platforms.map(p => `<span class="tag">${p}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="section">
                    <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Consigliato per la visione</h3>
                    <div class="pairing-grid">
                        <div class="pairing-card">
                            <div class="pairing-icon">
                                <svg viewBox="0 0 24 24"><path d="M8 22h8M12 11V22M17 2l-1 5h-8l-1-5M5.5 7h13l-1.4 5.6a2 2 0 0 1-1.9 1.4H8.8a2 2 0 0 1-1.9-1.4L5.5 7z"/></svg>
                            </div>
                            <p class="pairing-title">${drink.name}</p>
                            <p class="pairing-desc">${drink.description}</p>
                        </div>
                        <div class="pairing-card">
                            <div class="pairing-icon">
                                <svg viewBox="0 0 24 24"><path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM15.42 15.42l6.37-6.37M10.75 6.36L15.12 2l6.37 6.37-4.36 4.36"/></svg>
                            </div>
                            <p class="pairing-title">${food.name}</p>
                            <p class="pairing-desc">${food.description}</p>
                        </div>
                    </div>
                </div>

                <div class="sheet-actions">
                    <button onclick="App.addToLiked(${film.id})" class="btn-primary">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        Preferiti
                    </button>
                    <button onclick="App.addToWatchlistById(${film.id})" class="btn-secondary">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                        Da vedere
                    </button>
                </div>
            `;
        } catch (error) {
            content.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-muted);">Errore nel caricamento</p>';
        }
    },

    async addToLiked(id) {
        try {
            const film = await API.getMovieDetails(id);
            if (!this.state.likedFilms.find(f => f.id === id)) {
                this.state.likedFilms.push(this.simplifyFilm(film));
                this.showToast('Aggiunto ai preferiti ❤️');
                this.updateStats();
                this.saveToStorage();
            } else {
                this.showToast('Già nei preferiti');
            }
        } catch (e) {
            this.showToast('Errore');
        }
        this.closeSheet();
    },

    async addToWatchlistById(id) {
        try {
            const film = await API.getMovieDetails(id);
            if (!this.state.watchlistFilms.find(f => f.id === id)) {
                this.state.watchlistFilms.push(this.simplifyFilm(film));
                this.showToast('Aggiunto alla watchlist 📑');
                this.updateStats();
                this.saveToStorage();
            } else {
                this.showToast('Già nella watchlist');
            }
        } catch (e) {
            this.showToast('Errore');
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
        this.showToast('Film rimosso');
    },

    // ============================================
    // SAVED LIST
    // ============================================
    renderSavedList(type) {
        const list = type === 'liked' ? this.state.likedFilms : this.state.watchlistFilms;
        const container = this.$(type === 'liked' ? 'likedList' : 'watchlistList');

        if (list.length === 0) {
            container.innerHTML = '';
            this.$('emptyState').style.display = 'block';
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
                            <button class="btn-primary small" onclick="App.showFilmDetails(${f.id})">Dettagli</button>
                            <button class="btn-secondary small" onclick="App.removeFilm(${f.id}, '${type}')">Rimuovi</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    },

    // ============================================
    // SEARCH
    // ============================================
    async searchFilms(query) {
        const container = this.$('searchResults');
        
        if (!query.trim()) {
            container.innerHTML = '<p class="search-hint">Cerca per titolo, regista o genere</p>';
            return;
        }

        container.innerHTML = '<div class="loading-state" style="min-height: 100px;"><div class="spinner"></div></div>';

        try {
            const results = await API.searchMovies(query);
            if (results.length === 0) {
                container.innerHTML = `<p class="search-hint">Nessun risultato per "${query}"</p>`;
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
            container.innerHTML = '<p class="search-hint">Errore nella ricerca</p>';
        }
    },

    // ============================================
    // GROUPS
    // ============================================
    createGroup() {
        const name = this.$('groupNameInput').value.trim();
        const desc = this.$('groupDescInput').value.trim();
        const email = this.$('groupEmailInput').value.trim();

        if (!name) {
            this.showToast('Inserisci un nome');
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
        this.showToast('Gruppo creato 🎉');
    },

    renderGroups() {
        const container = this.$('groupsList');
        
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
                            <p>${g.description || 'Nessuna descrizione'}</p>
                        </div>
                        <span class="tag">${g.films.length} film</span>
                    </div>
                    <div class="group-card-footer">
                        <div class="members-avatars">
                            ${g.members.map(m => `<div class="member-avatar">${m.charAt(0).toUpperCase()}</div>`).join('')}
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
            <p class="text-muted" style="margin-bottom: 24px;">${g.description || 'Nessuna descrizione'}</p>

            <div class="section" style="margin-top: 0;">
                <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Membri (${g.members.length})</h3>
                ${g.members.map((m, i) => `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 8px;">
                        <div class="member-avatar" style="margin: 0;">${m.charAt(0).toUpperCase()}</div>
                        <span style="flex: 1;">${m}</span>
                        ${i === 0 ? '<span class="tag">Admin</span>' : ''}
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Film proposti (${g.films.length})</h3>
                ${g.films.length === 0 
                    ? '<p class="text-muted" style="text-align: center; padding: 20px; background: var(--bg-secondary); border-radius: 10px;">Nessun film proposto</p>'
                    : g.films.map(f => `
                        <div class="card" style="display: flex; gap: 12px; padding: 12px; margin-bottom: 8px;">
                            <div style="width: 48px; height: 72px; border-radius: 6px; background-image: url('${f.poster}'); background-size: cover;"></div>
                            <div>
                                <p style="font-weight: 600; margin: 0;">${f.title}</p>
                                <p class="text-muted" style="font-size: 12px; margin: 4px 0 0 0;">${f.year}</p>
                            </div>
                        </div>
                    `).join('')}
            </div>

            <div class="section">
                <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Aggiungi film</h3>
                <div class="film-list">
                    ${this.state.films.slice(0, 10).map(f => `
                        <div class="film-thumb" onclick="App.addFilmToGroup(${index}, ${f.id})" style="background-image: url('${f.poster}');"></div>
                    `).join('')}
                </div>
            </div>

            <div class="sheet-actions">
                <button class="btn-primary" onclick="App.inviteToGroup(${index})">Invita</button>
                <button class="btn-secondary" onclick="App.deleteGroup(${index})">Elimina</button>
            </div>
        `;

        this.openSheet('groupDetailSheet');
    },

    async addFilmToGroup(groupIndex, filmId) {
        const group = this.state.groups[groupIndex];
        if (!group || group.films.find(f => f.id === filmId)) {
            this.showToast('Film già nel gruppo');
            return;
        }

        try {
            const film = await API.getMovieDetails(filmId);
            group.films.push(this.simplifyFilm(film));
            this.saveToStorage();
            this.openGroupDetail(groupIndex);
            this.showToast('Film aggiunto 🎬');
        } catch (e) {
            this.showToast('Errore');
        }
    },

    inviteToGroup(index) {
        const email = prompt('Email del membro:');
        if (email && email.includes('@')) {
            this.state.groups[index].members.push(email.split('@')[0]);
            this.saveToStorage();
            this.openGroupDetail(index);
            this.showToast('Membro invitato 📧');
        }
    },

    deleteGroup(index) {
        if (confirm('Eliminare questo gruppo?')) {
            this.state.groups.splice(index, 1);
            this.closeSheet();
            this.renderGroups();
            this.saveToStorage();
            this.showToast('Gruppo eliminato');
        }
    },

    // ============================================
    // NAVIGATION
    // ============================================
    switchPage(name) {
        this.$$('.page').forEach(p => p.classList.remove('active'));
        this.$(name + 'Page').classList.add('active');

        this.$$('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector(`[data-page="${name}"]`).classList.add('active');

        if (name === 'salvati') this.renderSavedList('liked');
        if (name === 'gruppi') this.renderGroups();
    },

    // ============================================
    // SHEETS
    // ============================================
    openSheet(id) {
        this.$(id).classList.add('open');
        this.$('overlay').classList.add('open');
    },

    closeSheet() {
        this.$$('.bottom-sheet').forEach(s => s.classList.remove('open'));
        this.$('overlay').classList.remove('open');
    },

    // ============================================
    // TOAST
    // ============================================
    showToast(msg) {
        this.$('toastText').textContent = msg;
        this.$('toast').classList.add('show');
        setTimeout(() => this.$('toast').classList.remove('show'), 2500);
    },

    // ============================================
    // THEME
    // ============================================
    initTheme() {
        if (!this.state.isDarkTheme) {
            document.documentElement.setAttribute('data-theme', 'light');
            this.$('themeToggle').classList.remove('active');
        }
        this.updateMuteIcon();
    },

    toggleTheme() {
        this.state.isDarkTheme = !this.state.isDarkTheme;
        localStorage.setItem('theme', this.state.isDarkTheme ? 'dark' : 'light');

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

    // ============================================
    // STORAGE
    // ============================================
    saveToStorage() {
        localStorage.setItem('likedFilms', JSON.stringify(this.state.likedFilms));
        localStorage.setItem('watchlistFilms', JSON.stringify(this.state.watchlistFilms));
        localStorage.setItem('swipeCount', this.state.swipeCount.toString());
        localStorage.setItem('groups', JSON.stringify(this.state.groups));
        localStorage.setItem('isMuted', this.state.isMuted.toString());
    },

    loadFromStorage() {
        this.state.likedFilms = JSON.parse(localStorage.getItem('likedFilms')) || [];
        this.state.watchlistFilms = JSON.parse(localStorage.getItem('watchlistFilms')) || [];
        this.state.swipeCount = parseInt(localStorage.getItem('swipeCount')) || 0;
        this.state.groups = JSON.parse(localStorage.getItem('groups')) || [];
        this.state.isMuted = localStorage.getItem('isMuted') === 'true';
        this.state.isDarkTheme = localStorage.getItem('theme') !== 'light';
    },

    // ============================================
    // EVENTS
    // ============================================
    bindEvents() {
        // Navigation
        this.$$('.nav-item').forEach(item => {
            item.addEventListener('click', () => this.switchPage(item.dataset.page));
        });

        // Film list
        this.$('filmList').addEventListener('click', e => {
            const thumb = e.target.closest('.film-thumb');
            if (thumb) this.loadFilm(parseInt(thumb.dataset.index));
        });

        // Action buttons
        this.$('likeBtn').addEventListener('click', () => this.swipeFilm('right'));
        this.$('skipBtn').addEventListener('click', () => this.swipeFilm('left'));
        this.$('saveBtn').addEventListener('click', () => this.saveToWatchlist());
        this.$('detailsBtn').addEventListener('click', () => {
            const film = this.state.currentDetails || this.state.films[this.state.currentIndex];
            if (film) this.showFilmDetails(film.id);
        });

        // Header
        this.$('muteBtn').addEventListener('click', () => this.toggleMute());
        this.$('searchBtn').addEventListener('click', () => {
            this.openSheet('searchSheet');
            setTimeout(() => this.$('searchInput').focus(), 300);
        });

        // Theme
        this.$('themeMenuItem').addEventListener('click', () => this.toggleTheme());

        // Tabs
        this.$$('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.$$('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                this.$('likedList').style.display = tab === 'liked' ? 'block' : 'none';
                this.$('watchlistList').style.display = tab === 'watchlist' ? 'block' : 'none';
                this.renderSavedList(tab);
            });
        });

        // Groups
        this.$('newGroupBtn').addEventListener('click', () => this.openSheet('groupSheet'));
        this.$('createFirstGroup').addEventListener('click', () => this.openSheet('groupSheet'));
        this.$('confirmGroupBtn').addEventListener('click', () => this.createGroup());

        // Search
        let searchTimeout;
        this.$('searchInput').addEventListener('input', e => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => this.searchFilms(e.target.value), 300);
        });

        // Overlay
        this.$('overlay').addEventListener('click', () => this.closeSheet());

        // Touch swipe
        let startX = 0, currentX = 0, isDragging = false;
        const card = this.$('videoCard');

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
        }, { passive: true });

        card.addEventListener('touchend', () => {
            isDragging = false;
            const diff = currentX - startX;
            card.style.transition = '';

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
// START APP
// ============================================
document.addEventListener('DOMContentLoaded', () => App.init());
