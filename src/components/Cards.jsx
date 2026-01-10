import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from './Layout';
import { API_CONFIG } from '../config/api';

// ============================================
// VIDEO CARD (Swipeable) - Con API YouTube
// ============================================
export function VideoCard() {
  const { currentFilm, currentFilmDetails, isMuted, swipeFilm, openFilmDetailsSheet, isLoadingFilms } = useApp();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  // Loading state
  if (isLoadingFilms || !currentFilm) {
    return (
      <div className="video-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>Caricamento film...</p>
        </div>
      </div>
    );
  }

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff * 0.5}px) rotate(${diff * 0.02}deg)`;
      cardRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const diff = currentX.current - startX.current;
    
    if (cardRef.current) {
      cardRef.current.style.transition = '';
      
      if (Math.abs(diff) > 100) {
        const direction = diff > 0 ? 'right' : 'left';
        setSwipeDirection(direction);
        swipeFilm(direction);
        
        setTimeout(() => {
          setSwipeDirection(null);
          if (cardRef.current) {
            cardRef.current.style.transform = '';
          }
        }, 400);
      } else {
        cardRef.current.style.transform = '';
      }
    }
    
    startX.current = 0;
    currentX.current = 0;
  };

  const getSwipeClass = () => {
    if (swipeDirection === 'left') return 'swipe-left';
    if (swipeDirection === 'right') return 'swipe-right';
    return '';
  };

  // Costruisci URL embed YouTube
  const trailerKey = currentFilmDetails?.trailer?.key || currentFilm?.trailer?.key;
  const muteParam = isMuted ? '1' : '0';
  
  let youtubeUrl = null;
  if (trailerKey) {
    youtubeUrl = `${API_CONFIG.YOUTUBE.EMBED_URL}/${trailerKey}?autoplay=1&mute=${muteParam}&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&hl=it`;
  }

  // Usa backdrop come fallback
  const backdropUrl = currentFilm.backdrop || currentFilm.poster;

  // Dati del film
  const title = currentFilm.title || 'Titolo non disponibile';
  const year = currentFilm.year || '';
  const duration = currentFilmDetails?.duration || currentFilm.duration || '';
  const rating = currentFilm.rating || 'N/A';
  const genres = currentFilm.genres || [];
  const genre = genres[0] || 'Film';
  const director = currentFilmDetails?.crew?.regia || currentFilm.crew?.regia || '';

  return (
    <div 
      ref={cardRef}
      className={`video-card card-swipe ${getSwipeClass()}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {youtubeUrl ? (
        <iframe
          className="video-iframe"
          src={youtubeUrl}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
        />
      ) : (
        <div 
          className="video-backdrop"
          style={{ 
            backgroundImage: `url('${backdropUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%'
          }}
        />
      )}
      
      <div className="video-gradient" />
      
      <div className="video-content">
        <div className="film-tags">
          <span className="film-tag">{genre}</span>
          {duration && <span className="film-tag">{duration}</span>}
        </div>
        
        <h2 className="film-title">{title}</h2>
        <p className="film-meta">
          {director && `${director} · `}{year}
        </p>
        
        <div className="film-actions-row">
          <div className="rating-badge">
            <Icons.Star />
            <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
          </div>
          <button 
            className="details-btn"
            onClick={() => openFilmDetailsSheet(currentFilm.id)}
          >
            <span>Dettagli</span>
            <Icons.ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ACTION BUTTONS
// ============================================
export function ActionButtons() {
  const { swipeFilm, saveToWatchlist, isLoadingFilms } = useApp();

  return (
    <div className="action-buttons">
      <button 
        className="action-btn skip" 
        onClick={() => swipeFilm('left')}
        title="Salta"
        disabled={isLoadingFilms}
      >
        <Icons.X />
      </button>
      <button 
        className="action-btn" 
        onClick={saveToWatchlist}
        title="Salva"
        disabled={isLoadingFilms}
      >
        <Icons.Bookmark />
      </button>
      <button 
        className="action-btn like" 
        onClick={() => swipeFilm('right')}
        title="Mi piace"
        disabled={isLoadingFilms}
      >
        <Icons.Heart />
      </button>
    </div>
  );
}

// ============================================
// FILM LIST (Thumbnails) - Con dati API
// ============================================
export function FilmList() {
  const { films, currentFilmIndex, loadFilm, isLoadingFilms } = useApp();

  if (isLoadingFilms) {
    return (
      <div className="film-list">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="film-thumb skeleton"
            style={{ 
              flexShrink: 0, 
              width: '64px', 
              height: '96px',
              background: 'var(--bg-tertiary)'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="film-list">
      {films.slice(0, 10).map((film, index) => (
        <div
          key={film.id}
          className={`film-thumb ${index === currentFilmIndex ? 'active' : ''}`}
          style={{ 
            backgroundImage: film.poster ? `url('${film.poster}')` : 'none',
            backgroundColor: film.poster ? 'transparent' : 'var(--bg-tertiary)'
          }}
          onClick={() => loadFilm(index)}
        />
      ))}
    </div>
  );
}

// ============================================
// STAT CARD
// ============================================
export function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

// ============================================
// FILM CARD (for saved list) - Con dati API
// ============================================
export function FilmCard({ film, type, onDetails, onRemove }) {
  const genres = Array.isArray(film.genres) ? film.genres : [];
  const genre = genres[0] || 'Film';
  const director = film.crew?.regia || '';

  return (
    <div className="card film-card fade-in">
      <div 
        className="film-card-poster"
        style={{ 
          backgroundImage: film.poster ? `url('${film.poster}')` : 'none',
          backgroundColor: film.poster ? 'transparent' : 'var(--bg-tertiary)'
        }}
      />
      <div className="film-card-content">
        <h3>{film.title}</h3>
        <p className="text-muted">
          {director && `${director} · `}{film.year}
        </p>
        <div className="film-card-meta">
          <div className="rating-small">
            <Icons.Star />
            <span>{film.rating ? film.rating.toFixed(1) : 'N/A'}</span>
          </div>
          <span className="tag">{genre}</span>
        </div>
        <div className="film-card-actions">
          <button className="btn-primary small" onClick={() => onDetails(film)}>
            Dettagli
          </button>
          <button className="btn-secondary small" onClick={() => onRemove(film.id, type)}>
            Rimuovi
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// GROUP CARD
// ============================================
export function GroupCard({ group, index, onClick }) {
  return (
    <div className="group-card fade-in" onClick={() => onClick(index)}>
      <div className="group-card-header">
        <div>
          <h3>{group.name}</h3>
          <p className="text-muted">{group.description || 'Nessuna descrizione'}</p>
        </div>
        <span className="tag">{group.films?.length || 0} film</span>
      </div>
      <div className="group-card-footer">
        <div className="members-avatars">
          {group.members?.slice(0, 4).map((member, i) => (
            <div key={i} className="member-avatar">
              {member.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-muted text-sm">
          {group.members?.length || 0} {group.members?.length === 1 ? 'membro' : 'membri'}
        </span>
      </div>
    </div>
  );
}

// ============================================
// MENU ITEM
// ============================================
export function MenuItem({ icon: Icon, label, onClick, rightElement }) {
  return (
    <div className="menu-item" onClick={onClick}>
      <Icon />
      <span className="menu-label">{label}</span>
      {rightElement || <Icons.ChevronRight />}
    </div>
  );
}

// ============================================
// TOGGLE SWITCH
// ============================================
export function ToggleSwitch({ active, onToggle }) {
  return (
    <div 
      className={`toggle-switch ${active ? 'active' : ''}`}
      onClick={onToggle}
    />
  );
}

// ============================================
// PROGRESS BAR
// ============================================
export function ProgressBar({ value, label }) {
  return (
    <div className="progress-item">
      <div className="progress-header">
        <span>{label}</span>
        <span className="text-muted">{value}%</span>
      </div>
      <div className="progress-bar">
        <div className="fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ============================================
// GUIDE STEP
// ============================================
export function GuideStep({ number, title, description }) {
  return (
    <div className="guide-step">
      <div className="guide-number">{number}</div>
      <div className="guide-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon />
      </div>
      <p className="empty-title">{title}</p>
      <p className="empty-description">{description}</p>
      {actionLabel && (
        <button className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ============================================
// CAST CARD
// ============================================
export function CastCard({ person }) {
  return (
    <div className="cast-card">
      <div 
        className="cast-photo"
        style={{ 
          backgroundImage: person.photo ? `url('${person.photo}')` : 'none',
          backgroundColor: person.photo ? 'transparent' : 'var(--bg-tertiary)'
        }}
      >
        {!person.photo && (
          <Icons.User />
        )}
      </div>
      <p className="cast-name">{person.name}</p>
      {person.character && (
        <p className="cast-character">{person.character}</p>
      )}
    </div>
  );
}

// ============================================
// PLATFORM BADGE
// ============================================
export function PlatformBadge({ platform }) {
  return (
    <div className="platform-badge">
      {platform.logo ? (
        <img src={platform.logo} alt={platform.name} className="platform-logo" />
      ) : (
        <span className="tag">{platform.name}</span>
      )}
    </div>
  );
}

// ============================================
// PAIRING CARD
// ============================================
export function PairingCard({ type, pairing }) {
  const isDrink = type === 'drink';
  
  return (
    <div className="pairing-card">
      <div className="pairing-icon">
        {isDrink ? <Icons.Drink /> : <Icons.Food />}
      </div>
      <p className="pairing-title">{pairing.name}</p>
      <p className="pairing-desc">{pairing.description}</p>
      {pairing.ingredients && (
        <div className="pairing-ingredients">
          <p className="ingredients-label">Ingredienti:</p>
          <p className="ingredients-list">
            {Array.isArray(pairing.ingredients) 
              ? pairing.ingredients.slice(0, 4).join(', ')
              : pairing.ingredients
            }
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// SEARCH RESULT CARD
// ============================================
export function SearchResultCard({ film, onClick }) {
  const genres = Array.isArray(film.genres) ? film.genres : [];
  const genre = genres[0] || 'Film';

  return (
    <div className="card search-result" onClick={onClick}>
      <div 
        className="search-result-poster"
        style={{ 
          backgroundImage: film.poster ? `url('${film.poster}')` : 'none',
          backgroundColor: film.poster ? 'transparent' : 'var(--bg-tertiary)'
        }}
      />
      <div className="search-result-info">
        <h3>{film.title}</h3>
        <p>{film.year}</p>
        <span className="tag">{genre}</span>
      </div>
    </div>
  );
}

// ============================================
// LOADING SPINNER
// ============================================
export function LoadingSpinner({ message = 'Caricamento...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

// ============================================
// ERROR MESSAGE
// ============================================
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <Icons.AlertCircle />
      <p>{message}</p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry}>
          Riprova
        </button>
      )}
    </div>
  );
}
