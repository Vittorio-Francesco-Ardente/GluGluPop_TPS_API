import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { 
  Header, 
  BottomNav, 
  Toast, 
  Overlay,
  FilmDetailsSheet,
  CreateGroupSheet,
  GroupDetailSheet,
  SearchSheet
} from './components/Layout';
import { HomePage, SalvatiPage, GruppiPage, ProfiloPage } from './pages';
import './index.css';

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'salvati':
        return <SalvatiPage />;
      case 'gruppi':
        return <GruppiPage />;
      case 'profilo':
        return <ProfiloPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="container">
      <Header />
      {renderPage()}
      <BottomNav />
      
      {/* Sheets */}
      <Overlay />
      <FilmDetailsSheet />
      <CreateGroupSheet />
      <GroupDetailSheet />
      <SearchSheet />
      
      {/* Toast */}
      <Toast />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
