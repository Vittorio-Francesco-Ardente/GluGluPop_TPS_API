import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Layout';
import { 
  VideoCard, 
  ActionButtons, 
  FilmList, 
  StatCard,
  FilmCard,
  GroupCard,
  MenuItem,
  ToggleSwitch,
  ProgressBar,
  GuideStep,
  EmptyState
} from '../components/Cards';

// ============================================
// HOME PAGE
// ============================================
export function HomePage() {
  const { likedFilms, watchlistFilms, swipeCount } = useApp();

  return (
    <main className="page">
      <VideoCard />
      <ActionButtons />
      
      <div className="section">
        <p className="section-title">In programmazione</p>
        <FilmList />
      </div>

      <div className="stats-grid">
        <StatCard value={likedFilms.length} label="Preferiti" />
        <StatCard value={watchlistFilms.length} label="Da vedere" />
        <StatCard value={swipeCount} label="Valutati" />
      </div>
    </main>
  );
}

// ============================================
// SALVATI PAGE
// ============================================
export function SalvatiPage() {
  const { 
    likedFilms, 
    watchlistFilms, 
    activeTab, 
    setActiveTab,
    removeFilm,
    openSheet,
    setCurrentPage
  } = useApp();

  const currentList = activeTab === 'liked' ? likedFilms : watchlistFilms;

  const handleDetails = (film) => {
    openSheet('filmDetails', film);
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>La tua libreria</h1>
        <p className="text-secondary">Film salvati e preferiti</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          Preferiti
        </button>
        <button 
          className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          Da vedere
        </button>
      </div>

      {currentList.length === 0 ? (
        <EmptyState
          icon={Icons.Film}
          title="Nessun film salvato"
          description="Esplora il catalogo e salva i tuoi preferiti"
          actionLabel="Esplora film"
          onAction={() => setCurrentPage('home')}
        />
      ) : (
        <div className="films-list">
          {currentList.map(film => (
            <FilmCard
              key={film.id}
              film={film}
              type={activeTab}
              onDetails={handleDetails}
              onRemove={removeFilm}
            />
          ))}
        </div>
      )}
    </main>
  );
}

// ============================================
// GRUPPI PAGE
// ============================================
export function GruppiPage() {
  const { groups, openSheet } = useApp();

  const handleOpenGroup = (index) => {
    openSheet('groupDetail', index);
  };

  return (
    <main className="page">
      <div className="page-header-row">
        <div>
          <h1>Gruppi</h1>
          <p className="text-secondary">Scegli cosa guardare insieme</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => openSheet('createGroup')}
        >
          <Icons.Plus />
          Nuovo
        </button>
      </div>

      {/* Guide */}
      <div className="section">
        <p className="section-title">Come funziona</p>
        <GuideStep 
          number={1} 
          title="Crea un gruppo" 
          description="Dai un nome al tuo gruppo e aggiungi una descrizione per identificarlo facilmente."
        />
        <GuideStep 
          number={2} 
          title="Invita i tuoi amici" 
          description="Aggiungi membri inserendo le loro email. Riceveranno un invito per unirsi al gruppo."
        />
        <GuideStep 
          number={3} 
          title="Proponi i film" 
          description="Ogni membro può proporre film dal catalogo. Sfoglia e aggiungi quelli che ti interessano."
        />
        <GuideStep 
          number={4} 
          title="Decidete insieme" 
          description="Votate i film proposti e scoprite quali piacciono a tutti. Il match perfetto per la vostra serata!"
        />
      </div>

      <p className="section-title">I tuoi gruppi</p>
      
      {groups.length === 0 ? (
        <div className="no-groups">
          <p className="text-muted">Non hai ancora creato nessun gruppo</p>
          <button 
            className="btn-outline"
            onClick={() => openSheet('createGroup')}
          >
            Crea il tuo primo gruppo
          </button>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map((group, index) => (
            <GroupCard
              key={index}
              group={group}
              index={index}
              onClick={handleOpenGroup}
            />
          ))}
        </div>
      )}
    </main>
  );
}

// ============================================
// PROFILO PAGE
// ============================================
export function ProfiloPage() {
  const { 
    likedFilms, 
    watchlistFilms, 
    swipeCount,
    isDarkTheme,
    toggleTheme
  } = useApp();

  const genrePreferences = [
    { label: 'Fantascienza', value: 42 },
    { label: 'Thriller', value: 28 },
    { label: 'Azione', value: 18 },
    { label: 'Drammatico', value: 12 }
  ];

  return (
    <main className="page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span>MR</span>
        </div>
        <div className="profile-info">
          <h1>Mario Rossi</h1>
          <p className="text-muted">mario.rossi@email.com</p>
          <p className="text-secondary text-sm">Membro dal Gennaio 2024</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard value={likedFilms.length} label="Preferiti" />
        <StatCard value={watchlistFilms.length} label="Da vedere" />
        <StatCard value={swipeCount} label="Valutati" />
      </div>

      {/* Genre Preferences */}
      <div className="card preferences-card">
        <h3>I tuoi generi preferiti</h3>
        <div className="preferences-list">
          {genrePreferences.map(genre => (
            <ProgressBar 
              key={genre.label} 
              label={genre.label} 
              value={genre.value} 
            />
          ))}
        </div>
      </div>

      {/* Settings */}
      <p className="section-title">Impostazioni</p>
      <div className="settings-list">
        <MenuItem 
          icon={Icons.Sun} 
          label="Tema scuro"
          rightElement={
            <ToggleSwitch active={isDarkTheme} onToggle={toggleTheme} />
          }
        />
        <MenuItem icon={Icons.Bell} label="Notifiche" />
        <MenuItem icon={Icons.Lock} label="Privacy e sicurezza" />
        <MenuItem icon={Icons.Help} label="Centro assistenza" />
        <MenuItem icon={Icons.File} label="Termini e condizioni" />
      </div>

      <button className="btn-secondary full-width logout-btn">
        <Icons.LogOut />
        Esci dall'account
      </button>

      <p className="version-text">GluGluPop v1.0.0</p>
    </main>
  );
}
