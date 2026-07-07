import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import WallpaperTab from './components/WallpaperTab';
import AccountTab from './components/AccountTab';
import SettingsModal from './components/SettingsModal';
import Hive from './services/hive';
import { DatabaseIcon } from './components/Icons';

export default function App() {
  // Database boxes
  const [settingsBox, setSettingsBox] = useState(null);
  const [favoritesBox, setFavoritesBox] = useState(null);

  // App States
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('wallpapers'); // 'wallpapers' or 'account'
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  // Tab States (passed to children)
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Dialog Controllers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dbStats, setDbStats] = useState({ size: 0, status: 'Disconnected' });

  // URL Hash Sync for Browser Back/Forward navigation support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'account') {
        setActiveTab('account');
      } else {
        setActiveTab('wallpapers');
      }
    };

    handleHashChange(); // Run on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when activeTab changes programmatically
  useEffect(() => {
    if (window.location.hash.replace('#', '') !== activeTab) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // 1. Initialize Hive Database boxes
  useEffect(() => {
    async function initDb() {
      try {
        const setBox = await Hive.openBox('settings_box');
        const favBox = await Hive.openBox('favorites_box');

        setSettingsBox(setBox);
        setFavoritesBox(favBox);

        // Load logged in user
        const savedUser = await setBox.get('current_user');
        if (savedUser) {
          setCurrentUser(savedUser);
        }

        // Load theme configuration
        const savedTheme = await setBox.get('app_theme');
        if (savedTheme) {
          setTheme(savedTheme);
        }

        // Load wallpaper favorites, seed with default premium options on first load
        let savedFavs = await favBox.values();
        if (savedFavs.length === 0) {
          const seedFavs = [
            {
              id: 'f-l-10',
              width: 1920,
              height: 1080,
              url: 'https://unsplash.com/photos/nebula-galaxy-oMpwt14eeUM',
              photographer: 'Vincentiu Solomon',
              photographer_url: 'https://unsplash.com/@vincentiusolomon',
              src: {
                large2x: '/wallpapers/cosmic_nebula.png',
                original: '/wallpapers/cosmic_nebula.png',
                landscape: '/wallpapers/cosmic_nebula.png',
                medium: '/wallpapers/cosmic_nebula.png'
              },
              category: 'Space',
              avg_color: '#080816'
            },
            {
              id: 'f-p-9',
              width: 1080,
              height: 1920,
              url: 'https://unsplash.com/photos/vaporwave-neon-palm-tree-yZ-Z-M8v1Aw',
              photographer: 'Steve Johnson',
              photographer_url: 'https://unsplash.com/@steve_j',
              src: {
                large2x: '/wallpapers/minimal_hills.png',
                original: '/wallpapers/minimal_hills.png',
                portrait: '/wallpapers/minimal_hills.png',
                medium: '/wallpapers/minimal_hills.png'
              },
              category: 'Aesthetic',
              avg_color: '#2e1245'
            }
          ];
          for (const item of seedFavs) {
            await favBox.put(item.id, item);
          }
          savedFavs = seedFavs;
        }
        setFavorites(savedFavs);

        setIsDbLoaded(true);
      } catch (error) {
        console.error('Database connection error:', error);
        setDbError(error.message || 'Unknown database initialization error');
        setDbStats({ size: 0, status: 'Error Connecting' });
        setIsDbLoaded(true);
      }
    }
    initDb();
  }, []);

  // 2. Dynamic Theme management
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // 3. Diagnostics stats updater
  useEffect(() => {
    async function updateStats() {
      if (favoritesBox && settingsBox) {
        const favKeys = await favoritesBox.keys();
        const setKeys = await settingsBox.keys();
        setDbStats({
          size: favKeys.length + setKeys.length,
          status: 'Connected (IndexedDB)'
        });
      }
    }
    updateStats();
  }, [favorites, isDbLoaded]);

  // Auth actions
  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    if (settingsBox) {
      await settingsBox.put('current_user', user);
    }
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    setActiveTab('wallpapers');
    if (settingsBox) {
      await settingsBox.delete('current_user');
    }
  };

  const handleToggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (settingsBox) {
      await settingsBox.put('app_theme', nextTheme);
    }
  };

  // Favorite toggle callbacks
  const handleToggleFavorite = async (wallpaper) => {
    if (!favoritesBox) return;
    const isAlreadyFav = favorites.some(fav => fav.id === wallpaper.id);
    
    if (isAlreadyFav) {
      await favoritesBox.delete(wallpaper.id);
      setFavorites(prev => prev.filter(fav => fav.id !== wallpaper.id));
    } else {
      await favoritesBox.put(wallpaper.id, wallpaper);
      setFavorites(prev => [...prev, wallpaper]);
    }
  };

  // Return Loading spinner screen
  if (!isDbLoaded) {
    return (
      <div className="db-loader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px', backgroundColor: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: '44px', height: '44px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p className="loader-text font-display" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Loading AeroHub Databases...</p>
      </div>
    );
  }

  // Return Troubleshooting error page
  if (dbError) {
    return (
      <div className="db-loader-container" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '40px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--expense-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>⚠️</div>
          <h2 className="font-display" style={{ marginBottom: '12px', fontSize: '1.6rem' }}>Database Initialization Error</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
            AeroHub was unable to configure local storage. If you are browsing in <strong>Private/Incognito mode</strong>, modern browsers restrict local database operations. Please re-open in standard mode.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', textAlign: 'left', overflowX: 'auto', marginBottom: '28px' }}>
            Error details: {dbError}
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry Boot</button>
        </div>
      </div>
    );
  }

  // Return Auth login panel
  if (!currentUser) {
    return <Auth settingsBox={settingsBox} onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-layout">
      {/* Sticky Tab Header Navbar */}
      <header className="navbar-header">
        <div className="navbar-container">
          
          <div className="navbar-brand">
            <span className="logo-icon"></span>
            <h1 className="logo-text font-display">AeroHub</h1>
          </div>

          {/* Module Tab Switcher */}
          <div className="tab-switcher" style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
            <button
              className={`tab-btn ${activeTab === 'wallpapers' ? 'active' : ''}`}
              onClick={() => setActiveTab('wallpapers')}
            >
              Wallpapers
            </button>
            <button
              className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              My Account
            </button>
          </div>

          {/* Right quick Actions controls */}
          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Input (Wallpapers only) */}
            {activeTab === 'wallpapers' && (
              <div className="search-pill" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search wallpapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--glass-border)', padding: '10px 18px', borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', fontSize: '0.9rem', width: '200px', outline: 'none' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>&times;</button>
                )}
              </div>
            )}

            {/* Categories Toggler (Wallpapers only) */}
            {activeTab === 'wallpapers' && !showFavoritesOnly && (
              <button
                className="btn btn-secondary nav-categories-btn"
                onClick={() => setIsCategoriesOpen(prev => !prev)}
                style={{
                  background: isCategoriesOpen ? 'linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%)' : 'rgba(0,0,0,0.15)',
                  border: '1px solid var(--glass-border)',
                  color: isCategoriesOpen ? '#ffffff' : 'var(--text-primary)',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Categories</span>
                <span style={{ transition: 'transform 0.2s ease', transform: isCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '0.75rem' }}>▾</span>
              </button>
            )}

            {/* Favorites Heart (Wallpapers only) */}
            {activeTab === 'wallpapers' && (
              <button 
                className={`action-btn-circle-nav ${showFavoritesOnly ? 'active' : ''}`}
                onClick={() => setShowFavoritesOnly(prev => !prev)}
                title={showFavoritesOnly ? "Show Feed" : "Show Favorites"}
              >
                ❤️ {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
              </button>
            )}

            {/* Dark/Light Switcher */}
            <button className="action-btn-circle-nav" onClick={handleToggleTheme} title="Switch Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Settings Trigger */}
            <button className="action-btn-circle-nav" onClick={() => setIsSettingsOpen(true)} title="API settings">
              ⚙️
            </button>

            {/* Profile Action button */}
            <div className="user-profile-badge" onClick={handleLogout} title="Click to log out">
              <span>{currentUser.username}</span>
              <span className="profile-sign-out">Logout</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main active Tab container */}
      <main className="main-content">
        {activeTab === 'wallpapers' ? (
          <WallpaperTab
            searchQuery={searchQuery}
            onResetSearch={() => setSearchQuery('')}
            favoritesBox={favoritesBox}
            settingsBox={settingsBox}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isCategoriesOpen={isCategoriesOpen}
          />
        ) : (
          <AccountTab
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            settingsBox={settingsBox}
            favoritesCount={favorites.length}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onBack={() => setActiveTab('wallpapers')}
          />
        )}
      </main>

      {/* System Settings dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={() => {}}
      />

      {/* Database Diagnostic Footer */}
      <footer className="footer-diagnostics glass-card">
        <div className="diagnostics-container">
          <div className="diagnostics-brand">
            <DatabaseIcon className="db-diag-icon" size={16} />
            <span>Hive Database Diagnostics (AeroHubDB Engine)</span>
          </div>
          <div className="diagnostics-details">
            <span className="diag-pill">Status: <strong className="diag-active">{dbStats.status}</strong></span>
            <span className="diag-pill">Sync: <strong>Settings & Favorites</strong></span>
            <span className="diag-pill">Total Registry: <strong>{dbStats.size}</strong></span>
          </div>
        </div>
      </footer>

      {/* Visual background lights */}
      <div className="accent-bg glow-green" style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'var(--accent-purple)', filter: 'blur(140px)', opacity: 0.04, pointerEvents: 'none', zIndex: -1 }}></div>
      <div className="accent-bg glow-purple" style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'var(--accent-cyan)', filter: 'blur(140px)', opacity: 0.04, pointerEvents: 'none', zIndex: -1 }}></div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tab-btn {
          padding: 10px 22px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
          border-radius: var(--radius-full);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tab-btn.active {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          color: white;
          box-shadow: var(--neon-purple-shadow);
        }
        .action-btn-circle-nav {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          font-size: 0.95rem;
        }
        .action-btn-circle-nav:hover {
          background: rgba(255,255,255,0.08);
          color: var(--text-primary);
          border-color: var(--glass-border-hover);
        }
        .action-btn-circle-nav.active {
          background: rgba(236,72,153,0.1);
          border-color: var(--accent-pink);
          color: var(--accent-pink);
        }
        .nav-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: var(--accent-pink);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-profile-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          cursor: pointer;
          background: rgba(0,0,0,0.15);
          border: 1px solid var(--glass-border);
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }
        [data-theme='light'] .user-profile-badge {
          background: rgba(255,255,255,0.8);
        }
        .user-profile-badge:hover {
          border-color: var(--accent-purple);
        }
        .profile-sign-out {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 1px;
        }
        .user-profile-badge:hover .profile-sign-out {
          color: var(--expense-red);
        }
        .footer-diagnostics {
          border-radius: 0 !important;
          border-top: 1px solid var(--glass-border);
          background: rgba(12, 13, 20, 0.9);
          padding: 16px 24px;
          font-size: 0.8rem;
        }
        [data-theme='light'] .footer-diagnostics {
          background: rgba(255, 255, 255, 0.9);
        }
        .diagnostics-container {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          color: var(--text-secondary);
        }
        .diagnostics-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .db-diag-icon {
          color: var(--accent-cyan);
        }
        .diagnostics-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .diag-pill {
          background: rgba(0,0,0,0.15);
          border: 1px solid var(--glass-border);
          padding: 4px 10px;
          border-radius: 6px;
        }
        [data-theme='light'] .diag-pill {
          background: rgba(255,255,255,0.8);
        }
        .diag-active {
          color: var(--income-green);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
