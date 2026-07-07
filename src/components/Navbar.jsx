import React, { useState } from 'react';
import { SearchIcon, HeartIcon, SettingsIcon, InfoIcon } from './Icons';
import { hasApiKey } from '../services/pexels';

export default function Navbar({ 
  onSearch, 
  onToggleFavorites, 
  showFavoritesOnly, 
  onOpenSettings, 
  favoritesCount,
  isFallbackActive
}) {
  const [searchVal, setSearchVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchVal.trim());
  };

  const handleClearSearch = () => {
    setSearchVal('');
    onSearch('');
  };

  const apiKeyConfigured = hasApiKey();

  return (
    <header className="navbar-header glass-panel">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={handleClearSearch}>
          <span className="logo-icon gradient-bg"></span>
          <h1 className="logo-text font-display">AeroPaper</h1>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="navbar-search-form">
          <div className="search-input-container">
            <SearchIcon className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search wallpapers (e.g. Space, Minimalist, Cyberpunk)..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            {searchVal && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={handleClearSearch}
              >
                &times;
              </button>
            )}
          </div>
        </form>

        {/* Quick actions panel */}
        <div className="navbar-actions">
          {/* Fallback Data Badge Warning */}
          {isFallbackActive && (
            <div className="fallback-badge" onClick={onOpenSettings} title="Click to add your Pexels key for live images!">
              <InfoIcon size={14} />
              <span>Demo Mode</span>
            </div>
          )}

          {/* Favorites List Toggle Button */}
          <button 
            className={`action-btn fav-btn ${showFavoritesOnly ? 'active' : ''}`}
            onClick={onToggleFavorites}
            title={showFavoritesOnly ? "Show All Wallpapers" : "Show Favorites"}
          >
            <HeartIcon size={20} fill={showFavoritesOnly ? 'var(--accent-pink)' : 'none'} />
            {favoritesCount > 0 && (
              <span className="badge badge-pink">{favoritesCount}</span>
            )}
          </button>

          {/* Settings Trigger */}
          <button 
            className="action-btn settings-btn" 
            onClick={onOpenSettings}
            title="Configure Pexels API"
          >
            <SettingsIcon size={20} />
            {!apiKeyConfigured && (
              <span className="dot-alert" title="API key not set! Click to configure."></span>
            )}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-header {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--header-height);
          z-index: 100;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(7, 7, 10, 0.75);
        }
        .navbar-container {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: block;
          position: relative;
          box-shadow: var(--neon-purple-shadow);
        }
        .logo-icon::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: var(--bg-primary);
          border-radius: 5px;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .navbar-search-form {
          flex: 1;
          max-width: 580px;
        }
        .search-input-container {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-full);
          padding: 12px 20px 12px 48px;
          color: white;
          font-family: var(--font-body);
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent-purple);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.15);
          background: rgba(0, 0, 0, 0.5);
        }
        .search-clear-btn {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.3rem;
          cursor: pointer;
          line-height: 1;
        }
        .search-clear-btn:hover {
          color: white;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .action-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: var(--glass-border-hover);
        }
        .action-btn.active {
          background: rgba(236, 72, 153, 0.1);
          border-color: var(--accent-pink);
          color: var(--accent-pink);
        }
        .badge {
          position: absolute;
          top: -3px;
          right: -3px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .badge-pink {
          background: var(--accent-pink);
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.4);
        }
        .dot-alert {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          background-color: var(--error);
          border-radius: var(--radius-full);
          border: 1.5px solid var(--bg-primary);
          box-shadow: 0 0 8px var(--error);
        }
        .fallback-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(236, 72, 153, 0.08);
          border: 1px solid rgba(236, 72, 153, 0.25);
          color: var(--accent-pink);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .fallback-badge:hover {
          background: rgba(236, 72, 153, 0.15);
          border-color: var(--accent-pink);
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.1);
        }

        @media (max-width: 768px) {
          .logo-text {
            display: none;
          }
          .navbar-search-form {
            max-width: none;
          }
          .fallback-badge span {
            display: none;
          }
          .fallback-badge {
            padding: 8px;
          }
        }
      `}} />
    </header>
  );
}
