import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PairingCard, CastCard, PlatformBadge, SearchResultCard, LoadingSpinner } from './Cards';

// ============================================
// ICONS
// ============================================
export const Icons = {
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  VolumeOn: () => (
    <svg viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  ),
  VolumeOff: () => (
    <svg viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Bookmark: () => (
    <svg viewBox="0 0 24 24">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Help: () => (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  File: () => (
    <svg viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  Film: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
      <line x1="7" y1="2" x2="7" y2="22"></line>
      <line x1="17" y1="2" x2="17" y2="22"></line>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <line x1="2" y1="7" x2="7" y2="7"></line>
      <line x1="2" y1="17" x2="7" y2="17"></line>
      <line x1="17" y1="7" x2="22" y2="7"></line>
      <line x1="17" y1="17" x2="22" y2="17"></line>
    </svg>
  ),
  Drink: () => (
    <svg viewBox="0 0 24 24">
      <path d="M8 22h8M12 11V22M17 2l-1 5h-8l-1-5M5.5 7h13l-1.4 5.6a2 2 0 0 1-1.9 1.4H8.8a2 2 0 0 1-1.9-1.4L5.5 7z"/>
    </svg>
  ),
  Food: () => (
    <svg viewBox="0 0 24 24">
      <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM15.42 15.42l6.37-6.37M10.75 6.36L15.12 2l6.37 6.37-4.36 4.36"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  ExternalLink: () => (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Tv: () => (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
      <polyline points="17 2 12 7 7 2"></polyline>
    </svg>
  )
};

// ============================================
// HEADER
// ============================================
export function Header() {
  const { isMuted, toggleMute, openSheet } = useApp();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <div className="logo-icon">
            <Icons.Play />
          </div>
          <span className="logo-text">GluGluPop</span>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={toggleMute}>
            {isMuted ? <Icons.VolumeOff /> : <Icons.VolumeOn />}
          </button>
          <button className="header-btn" onClick={() => openSheet('search')}>
            <Icons.Search />
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================
// BOTTOM NAVIGATION
// ============================================
export function BottomNav() {
  const { currentPage, setCurrentPage } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Icons.Home },
    { id: 'salvati', label: 'Salvati', icon: Icons.Heart },
    { id: 'gruppi', label: 'Gruppi', icon: Icons.Users },
    { id: 'profilo', label: 'Profilo', icon: Icons.User }
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-content">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ============================================
// TOAST
// ============================================
export function Toast() {
  const { toast } = useApp();

  return (
    <div className={`toast ${toast.show ? 'show' : ''}`}>
      <span>{toast.message}</span>
    </div>
  );
}

// ============================================
// OVERLAY
// ============================================
export function Overlay() {
  const { activeSheet, closeSheet } = useApp();

  return (
    <div 
      className={`overlay ${activeSheet ? 'open' : ''}`}
      onClick={closeSheet}
    />
  );
}

// ============================================
// BOTTOM SHEET
// ============================================
export function BottomSheet({ isOpen, children, maxHeight = '90vh' }) {
  return (
    <div 
      className={`bottom-sheet ${isOpen ? 'open' : ''}`}
      style={{ maxHeight }}
    >
      <div className="sheet-handle">
        <div className="handle-bar"></div>
      </div>
      {children}
    </div>
  );
}

// ============================================
// FILM DETAILS SHEET - Con dati API
// ============================================
export function FilmDetailsSheet() {
  const { activeSheet, sheetContent, closeSheet, addToLiked, addToWatchlist } = useApp();
  
  if (activeSheet !== 'filmDetails' || !sheetContent) return null;
  
  const film = sheetContent;
  const pairing = film.pairing;

  // Formatta crew labels
  const crewLabels = {
    regia: 'Regia',
    sceneggiatura: 'Sceneggiatura',
    musiche: 'Musiche',
    fotografia: 'Fotografia',
    montaggio: 'Montaggio',
    produzione: 'Produzione'
  };

  return (
    <BottomSheet isOpen={true}>
      <div className="sheet-content">
        {/* Header */}
        <div className="film-details-header">
          <div 
            className="film-details-poster"
            style={{ 
              backgroundImage: film.poster ? `url('${film.poster}')` : 'none',
              backgroundColor: film.poster ? 'transparent' : 'var(--bg-tertiary)'
            }}
          />
          <div className="film-details-info">
            <h2>{film.title}</h2>
            <p className="film-meta">{film.year} · {film.duration || ''}</p>
            <div className="film-badges">
              <div className="rating-pill">
                <Icons.Star />
                <span>{film.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              {film.genres?.slice(0, 2).map((genre, i) => (
                <span key={i} className="tag">{genre}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tagline */}
        {film.tagline && (
          <p className="film-tagline">"{film.tagline}"</p>
        )}

        {/* Synopsis */}
        <div className="section">
          <h3>Trama</h3>
          <p className="synopsis">{film.synopsis || 'Trama non disponibile.'}</p>
        </div>

        {/* Crew */}
        {film.crew && Object.keys(film.crew).length > 0 && (
          <div className="section">
            <h3>Crew</h3>
            <div className="crew-list">
              {Object.entries(film.crew).map(([key, value]) => (
                value && (
                  <div key={key} className="detail-row">
                    <span className="detail-label">{crewLabels[key] || key}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Cast */}
        {film.cast && film.cast.length > 0 && (
          <div className="section">
            <h3>Cast principale</h3>
            <div className="cast-scroll">
              {film.cast.slice(0, 8).map((person, i) => (
                <CastCard key={i} person={person} />
              ))}
            </div>
          </div>
        )}

        {/* Platforms */}
        {film.platforms && film.platforms.length > 0 && (
          <div className="section">
            <h3>Disponibile su</h3>
            <div className="platforms">
              {film.platforms.map((platform, i) => (
                <PlatformBadge key={i} platform={platform} />
              ))}
            </div>
          </div>
        )}

        {/* Pairing */}
        {pairing && (
          <div className="section">
            <h3>Consigliato per la visione</h3>
            <div className="pairing-grid">
              {pairing.drink && (
                <PairingCard type="drink" pairing={pairing.drink} />
              )}
              {pairing.food && (
                <PairingCard type="food" pairing={pairing.food} />
              )}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {film.recommendations && film.recommendations.length > 0 && (
          <div className="section">
            <h3>Film simili</h3>
            <div className="similar-scroll">
              {film.recommendations.slice(0, 6).map((similar) => (
                <div 
                  key={similar.id}
                  className="similar-film"
                  style={{ 
                    backgroundImage: similar.poster ? `url('${similar.poster}')` : 'none',
                    backgroundColor: similar.poster ? 'transparent' : 'var(--bg-tertiary)'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="sheet-actions">
          <button className="btn-primary" onClick={() => addToLiked(film.id)}>
            <Icons.Heart />
            Preferiti
          </button>
          <button className="btn-secondary" onClick={() => addToWatchlist(film.id)}>
            <Icons.Bookmark />
            Da vedere
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

// ============================================
// CREATE GROUP SHEET
// ============================================
export function CreateGroupSheet() {
  const { activeSheet, closeSheet, createGroup } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  if (activeSheet !== 'createGroup') return null;

  const handleSubmit = () => {
    if (createGroup(name, description, email)) {
      setName('');
      setDescription('');
      setEmail('');
    }
  };

  return (
    <BottomSheet isOpen={true} maxHeight="auto">
      <div className="sheet-content">
        <h2>Crea nuovo gruppo</h2>
        <div className="form-group">
          <label>Nome del gruppo *</label>
          <input
            type="text"
            className="input-field"
            placeholder="Es. Serata cinema"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Descrizione</label>
          <input
            type="text"
            className="input-field"
            placeholder="Una breve descrizione (opzionale)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Invita un amico (email)</label>
          <input
            type="email"
            className="input-field"
            placeholder="amico@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button className="btn-primary full-width" onClick={handleSubmit}>
          Crea gruppo
        </button>
      </div>
    </BottomSheet>
  );
}

// ============================================
// GROUP DETAIL SHEET
// ============================================
export function GroupDetailSheet() {
  const { activeSheet, sheetContent, closeSheet, groups, addFilmToGroup, inviteToGroup, deleteGroup, films } = useApp();

  if (activeSheet !== 'groupDetail' || sheetContent === null) return null;

  const groupIndex = sheetContent;
  const group = groups[groupIndex];

  if (!group) return null;

  const handleInvite = () => {
    const email = prompt('Email del membro:');
    if (email) inviteToGroup(groupIndex, email);
  };

  const handleDelete = () => {
    if (window.confirm('Eliminare questo gruppo?')) {
      deleteGroup(groupIndex);
    }
  };

  return (
    <BottomSheet isOpen={true}>
      <div className="sheet-content">
        <div className="group-header">
          <h2>{group.name}</h2>
          <p className="text-muted">{group.description || 'Nessuna descrizione'}</p>
        </div>

        <div className="section">
          <h3>Membri ({group.members?.length || 0})</h3>
          <div className="members-list">
            {group.members?.map((member, i) => (
              <div key={i} className="member-item">
                <div className="member-avatar-large">
                  {member.charAt(0).toUpperCase()}
                </div>
                <span className="member-name">{member}</span>
                {i === 0 && <span className="tag">Admin</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Film proposti ({group.films?.length || 0})</h3>
          {!group.films?.length ? (
            <p className="empty-message">Nessun film proposto</p>
          ) : (
            <div className="group-films">
              {group.films.map(f => (
                <div key={f.id} className="card film-mini">
                  <div 
                    className="film-mini-poster"
                    style={{ 
                      backgroundImage: f.poster ? `url('${f.poster}')` : 'none',
                      backgroundColor: f.poster ? 'transparent' : 'var(--bg-tertiary)'
                    }}
                  />
                  <div>
                    <p className="film-mini-title">{f.title}</p>
                    <p className="film-mini-year">{f.year}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3>Aggiungi film</h3>
          <div className="film-thumbs">
            {films?.slice(0, 10).map(f => (
              <div
                key={f.id}
                className="film-thumb"
                style={{ 
                  backgroundImage: f.poster ? `url('${f.poster}')` : 'none',
                  backgroundColor: f.poster ? 'transparent' : 'var(--bg-tertiary)'
                }}
                onClick={() => addFilmToGroup(groupIndex, f.id)}
              />
            ))}
          </div>
        </div>

        <div className="sheet-actions">
          <button className="btn-primary" onClick={handleInvite}>
            Invita amici
          </button>
          <button className="btn-secondary" onClick={handleDelete}>
            Elimina
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

// ============================================
// SEARCH SHEET - Con API
// ============================================
export function SearchSheet() {
  const { activeSheet, closeSheet, searchFilms, openFilmDetailsSheet } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchFilms(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchFilms]);

  if (activeSheet !== 'search') return null;

  const handleFilmClick = (film) => {
    openFilmDetailsSheet(film.id);
  };

  return (
    <BottomSheet isOpen={true}>
      <div className="search-header">
        <div className="search-input-wrapper">
          <Icons.Search />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Cerca film, regista, genere..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className="sheet-content">
        {loading ? (
          <LoadingSpinner message="Ricerca in corso..." />
        ) : !query.trim() ? (
          <p className="search-hint">Cerca per titolo, regista o genere</p>
        ) : results.length === 0 ? (
          <p className="search-hint">Nessun risultato per "{query}"</p>
        ) : (
          <div className="search-results">
            {results.map(film => (
              <SearchResultCard 
                key={film.id} 
                film={film} 
                onClick={() => handleFilmClick(film)}
              />
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
