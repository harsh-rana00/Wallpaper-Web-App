import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import WallpaperTab from './components/WallpaperTab';
import AccountTab from './components/AccountTab';
import SettingsModal from './components/SettingsModal';
import Hive from './services/hive';
import { DatabaseIcon, SearchIcon, HeartIcon, SettingsIcon, SunIcon, MoonIcon, FilterIcon, LogoIcon } from './components/Icons';
import { CATEGORIES } from './components/WallpaperGrid';

const getCategoryEmoji = (cat) => {
  const mapping = {
    'All': '🌐', 'Minimalist': '▫️', 'Cyberpunk': '⚡', 'Space': '🚀', 'Nature': '🌿', 
    'Abstract': '🔮', 'City': '🌆', 'Anime': '🌸', 'Aesthetic': '✨', 'Vaporwave': '🌴', 
    '3D Renders': '📐', 'Macro': '🔍', 'Architecture': '🏛️', 'Ocean': '🌊', 'Forest': '🌲', 
    'Retro': '📻', 'Animals': '🦊', 'Dark': '🌙', 'Neon': '🚥', 'Mountains': '🏔️', 
    'Cars': '🏎️', 'Cyber': '👾', 'Futuristic': '🛸', 'Synthwave': '🌅', 'Sunset': '🌇', 
    'Lo-Fi': '☕', 'Cybernetic': '🤖', 'Galactic': '🌌', 'Minimal': '➖', 'Urban': '🏙️', 
    'Texture': '🕸️', 'Art': '🎨', 'Landscape': '🏞️', 'Cyberpunk City': '🌃', 'Cosmic': '🪐', 
    'Floral': '💐', 'Vintage': '📺', 'Sci-Fi': '📡',
    'Steampunk': '⚙️', 'Glitch Art': '🌀', 'Solarpunk': '🌻', 'Retro-Wave': '🕶️', 'Deep Space': '🪐', 
    'Abstract Shapes': '🧬', 'Low Poly': '💎', 'Fantasy': '🏰', 'Space Nebula': '☄️', 'Cyber-Street': '🛣️', 
    'Pixel Art': '👾', 'Vector': '✒️', 'Holographic': '💿', 'Monochrome': '☯️', 'Aurora': '🌉', 
    'Dark Synth': '🎹', 'Surrealism': '👁️', 'Pastel': '🍡', 'Matrix': '📟', 'Cyber-Forest': '🌳', 'Interstellar': '🌠', 'Show More Categories': '➕'
  };
  return mapping[cat] || '🖼️';
};



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
  const [activeCategory, setActiveCategory] = useState('All');
  
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
        setShowFavoritesOnly(false);
      } else if (hash === 'favorites') {
        setActiveTab('wallpapers');
        setShowFavoritesOnly(true);
      } else {
        setActiveTab('wallpapers');
        setShowFavoritesOnly(false);
      }
    };

    handleHashChange(); // Run on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when activeTab or showFavoritesOnly changes programmatically
  useEffect(() => {
    let expectedHash = activeTab;
    if (activeTab === 'wallpapers' && showFavoritesOnly) {
      expectedHash = 'favorites';
    }
    if (window.location.hash.replace('#', '') !== expectedHash) {
      window.location.hash = expectedHash;
    }
  }, [activeTab, showFavoritesOnly]);

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

        // Load category configuration
        const savedCategory = await setBox.get('pref_category');
        if (savedCategory) {
          setActiveCategory(savedCategory);
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

  const handleCategoryChange = async (category) => {
    if (category === 'Show More Categories') {
      setIsCategoriesOpen(false);
      setTimeout(() => {
        const searchInput = document.querySelector('.search-pill-input') || document.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 350); // wait for drawer slide-up animation to complete
      return;
    }

    setSearchQuery('');
    setActiveCategory(category);
    setIsCategoriesOpen(false); // Smooth UX auto-closes categories drawer
    if (settingsBox) {
      await settingsBox.put('pref_category', category);
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
          
          {/* Left Section: Logo + Tab Switcher */}
          <div className="navbar-left-group">
            <div className="navbar-brand" onClick={() => { setActiveTab('wallpapers'); setSearchQuery(''); setShowFavoritesOnly(false); }}>
              <LogoIcon size={30} className="brand-logo-svg" />
              <h1 className="logo-text font-display">AeroHub</h1>
            </div>

            {/* Module Tab Switcher */}
            <div className="tab-switcher">
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
          </div>

          {/* Right Section: Actions */}
          <div className="navbar-right-group">
            {/* Search Input (Wallpapers only) */}
            {activeTab === 'wallpapers' && (
              <div className="search-pill-container">
                <SearchIcon className="search-pill-icon" size={24} />
                <input
                  type="text"
                  className="search-pill-input"
                  placeholder="Search wallpapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-pill-clear" onClick={() => setSearchQuery('')}>&times;</button>
                )}
              </div>
            )}

            {/* Categories Toggler (Wallpapers only) */}
            {activeTab === 'wallpapers' && !showFavoritesOnly && (
              <button
                className={`btn-categories-pill ${isCategoriesOpen ? 'active' : ''}`}
                onClick={() => setIsCategoriesOpen(prev => !prev)}
              >
                <FilterIcon size={15} />
                <span>Categories</span>
                <span className="arrow-down">▾</span>
              </button>
            )}

            {/* Favorites Heart (Wallpapers only) */}
            {activeTab === 'wallpapers' && (
              <button 
                className={`action-btn-pill heart-btn ${showFavoritesOnly ? 'active' : ''}`}
                onClick={() => setShowFavoritesOnly(prev => !prev)}
                title={showFavoritesOnly ? "Show Feed" : "Show Favorites"}
              >
                <HeartIcon size={18} fill={showFavoritesOnly ? 'var(--accent-pink)' : 'none'} />
                {favorites.length > 0 && <span className="nav-badge-glow">{favorites.length}</span>}
              </button>
            )}

            {/* Dark/Light Switcher */}
            <button className="action-btn-pill theme-btn" onClick={handleToggleTheme} title="Switch Theme">
              {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            {/* Settings Trigger */}
            <button className="action-btn-pill settings-btn" onClick={() => setIsSettingsOpen(true)} title="API settings">
              <SettingsIcon size={18} />
            </button>

            {/* Profile Action button / Avatar chip */}
            <div className="profile-chip" onClick={handleLogout} title="Click to log out">
              <div className="profile-avatar gradient-bg">
                {currentUser.username.substring(0, 1).toUpperCase()}
              </div>
              <div className="profile-info">
                <span className="profile-username">{currentUser.username}</span>
                <span className="profile-action-text">Logout</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Categories Drawer Dropdown Overlay */}
      {activeTab === 'wallpapers' && !showFavoritesOnly && isCategoriesOpen && (
        <>
          <div className="categories-backdrop" onClick={() => setIsCategoriesOpen(false)} />
          <div className="categories-drawer animate-slide-down">
            <div className="categories-card-grid">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`category-card ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  <span className="category-card-emoji">
                    {getCategoryEmoji(category)}
                  </span>
                  <span className="category-card-name">
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

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
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
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
        .navbar-left-group {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .navbar-right-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease;
        }
        .brand-logo-svg {
          filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.2));
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .navbar-brand:hover .brand-logo-svg {
          transform: rotate(12deg) scale(1.08);
          filter: drop-shadow(0 0 10px var(--accent-cyan));
        }
        .logo-text {
          transition: filter 0.3s ease;
        }
        .navbar-brand:hover .logo-text {
          filter: brightness(1.15);
        }

        .tab-switcher {
          display: flex;
          background: rgba(0, 0, 0, 0.22);
          border: 1px solid var(--glass-border);
          padding: 4px;
          border-radius: var(--radius-full);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
        }
        [data-theme='light'] .tab-switcher {
          background: rgba(0, 0, 0, 0.05);
        }
        .tab-btn {
          padding: 8px 18px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          border-radius: var(--radius-full);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }
        .tab-btn:hover {
          color: var(--text-primary);
        }
        .tab-btn.active {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .search-pill-container {
          position: relative;
          display: flex;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .search-pill-icon {
          position: absolute;
          left: 20px;
          color: var(--text-secondary);
          pointer-events: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-pill-input {
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(168, 85, 247, 0.25);
          padding: 13px 24px 13px 56px;
          border-radius: var(--radius-full);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          width: 320px;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.04);
        }
        [data-theme='light'] .search-pill-input {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(0, 0, 0, 0.12);
        }
        .search-pill-input:focus {
          width: 420px;
          background: rgba(0, 0, 0, 0.4);
          border-color: var(--accent-purple);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.22), var(--neon-purple-shadow);
        }
        [data-theme='light'] .search-pill-input:focus {
          background: rgba(255, 255, 255, 0.98);
          border-color: var(--accent-purple);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.15);
        }
        .search-pill-container:focus-within .search-pill-icon {
          color: var(--accent-purple);
          filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.6));
          transform: scale(1.08);
        }
        @media (max-width: 820px) {
          .search-pill-input {
            width: 200px;
            padding: 10px 18px 10px 46px;
            font-size: 0.88rem;
          }
          .search-pill-input:focus {
            width: 260px;
          }
          .search-pill-icon {
            left: 14px;
          }
        }
        @media (max-width: 480px) {
          .search-pill-input {
            width: 140px;
          }
          .search-pill-input:focus {
            width: 180px;
          }
        }
        .search-pill-clear {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          transition: all 0.2s ease;
        }
        .search-pill-clear:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
        [data-theme='light'] .search-pill-clear:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .btn-categories-pill {
          background: rgba(0,0,0,0.15);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }
        [data-theme='light'] .btn-categories-pill {
          background: rgba(0,0,0,0.04);
        }
        .btn-categories-pill:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--glass-border-hover);
        }
        [data-theme='light'] .btn-categories-pill:hover {
          background: rgba(0,0,0,0.06);
        }
        .btn-categories-pill.active {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .btn-categories-pill .arrow-down {
          font-size: 0.75rem;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-categories-pill.active .arrow-down {
          transform: rotate(180deg);
        }

        .action-btn-pill {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        [data-theme='light'] .action-btn-pill {
          background: rgba(0,0,0,0.02);
          border-color: rgba(0, 0, 0, 0.06);
        }
        .action-btn-pill:hover {
          background: rgba(255,255,255,0.08);
          color: var(--text-primary);
          border-color: var(--glass-border-hover);
          transform: translateY(-1px);
        }
        [data-theme='light'] .action-btn-pill:hover {
          background: rgba(0,0,0,0.05);
        }
        
        .action-btn-pill.heart-btn:hover {
          border-color: rgba(236, 72, 153, 0.5);
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.2);
          color: var(--accent-pink);
        }
        .action-btn-pill.heart-btn.active {
          background: rgba(236,72,153,0.08);
          border-color: var(--accent-pink);
          color: var(--accent-pink);
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.25);
        }
        .action-btn-pill.theme-btn:hover {
          border-color: rgba(6, 182, 212, 0.5);
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
          color: var(--accent-cyan);
        }
        .action-btn-pill.settings-btn:hover {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
          color: var(--accent-purple);
        }

        .nav-badge-glow {
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
          box-shadow: 0 0 6px var(--accent-pink);
          animation: badgePulse 2s infinite;
        }

        @keyframes badgePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.6);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(236, 72, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
          }
        }

        .profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid var(--glass-border);
          padding: 4px 12px 4px 4px;
          border-radius: var(--radius-full);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }
        [data-theme='light'] .profile-chip {
          background: rgba(0,0,0,0.03);
        }
        .profile-chip:hover {
          border-color: rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.05);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.08);
        }
        .profile-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.8rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.3s ease;
        }
        .profile-chip:hover .profile-avatar {
          transform: scale(1.05);
        }
        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.1;
        }
        .profile-username {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: color 0.3s ease;
        }
        .profile-action-text {
          font-size: 0.6rem;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .profile-chip:hover .profile-username {
          color: var(--expense-red);
        }
        .profile-chip:hover .profile-action-text {
          color: var(--expense-red);
        }

        @media (max-width: 992px) {
          .search-pill-input {
            width: 130px;
          }
          .search-pill-input:focus {
            width: 160px;
          }
        }

        @media (max-width: 768px) {
          .logo-text {
            display: none;
          }
          .navbar-left-group {
            gap: 16px;
          }
          .navbar-container {
            padding: 0 16px;
          }
        }

        @media (max-width: 580px) {
          .profile-info {
            display: none;
          }
          .profile-chip {
            padding: 4px;
          }
          .search-pill-input {
            width: 100px;
          }
          .search-pill-input:focus {
            width: 120px;
          }
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

        /* Categories Drawer & Card Styles */
        .categories-backdrop {
          position: fixed;
          top: var(--header-height);
          left: 0;
          width: 100vw;
          height: calc(100vh - var(--header-height));
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 98;
          animation: fadeIn 0.25s ease forwards;
        }

        .categories-drawer {
          position: fixed;
          top: var(--header-height);
          left: 0;
          width: 100%;
          max-height: calc(100vh - var(--header-height));
          overflow-y: auto;
          z-index: 99;
          background: rgba(8, 9, 18, 0.96);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          padding: 32px 24px;
          animation: slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        [data-theme='light'] .categories-drawer {
          background: rgba(245, 247, 251, 0.96);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .categories-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
          gap: 12px;
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
        }

        [data-theme='light'] .category-card {
          background: rgba(0, 0, 0, 0.02);
        }

        .category-card:hover {
          background: var(--glass-bg-hover);
          border-color: var(--glass-border-hover);
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: var(--neon-purple-shadow);
        }

        .category-card.active {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
        }

        .category-card-emoji {
          font-size: 1.85rem;
          transition: transform 0.25s ease;
        }

        .category-card:hover .category-card-emoji {
          transform: scale(1.18) rotate(6deg);
        }

        .category-card-name {
          font-size: 0.8rem;
          font-weight: 600;
          font-family: var(--font-display);
          letter-spacing: 0.2px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
