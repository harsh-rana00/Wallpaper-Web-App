import React, { useState } from 'react';
import WallpaperCard from './WallpaperCard';
import { MonitorIcon, SmartphoneIcon, HeartIcon, SearchIcon, InfoIcon } from './Icons';

const CATEGORIES = [
  'All', 'Minimalist', 'Cyberpunk', 'Space', 'Nature', 'Abstract', 'City', 'Anime', 'Aesthetic',
  'Vaporwave', '3D Renders', 'Macro', 'Architecture', 'Ocean', 'Forest', 'Retro',
  'Animals', 'Dark', 'Neon', 'Mountains', 'Cars', 'Cyber', 'Futuristic',
  'Synthwave', 'Sunset', 'Lo-Fi', 'Cybernetic', 'Galactic', 'Minimal', 'Urban',
  'Texture', 'Art', 'Landscape', 'Cyberpunk City', 'Cosmic', 'Floral', 'Vintage', 'Sci-Fi'
];

export default function WallpaperGrid({
  wallpapers,
  favorites,
  onToggleFavorite,
  onPreview,
  orientation,
  onOrientationChange,
  activeCategory,
  onCategoryChange,
  isLoading,
  isFallbackActive,
  showFavoritesOnly,
  onOpenSettings,
  isCategoriesOpen
}) {
  return (
    <section className="wallpaper-section" style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Collapsible Categories Drawer */}
      {!showFavoritesOnly && isCategoriesOpen && (
        <div className="categories-section animate-fade" style={{ marginBottom: '24px' }}>
          <div className="categories-pill-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '20px 24px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--glass-border)' }}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                onClick={() => onCategoryChange(category)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  background: activeCategory === category ? 'linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%)' : 'rgba(0,0,0,0.1)',
                  color: activeCategory === category ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Orientation switcher row */}
      <div className="filters-container" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '32px' }}>
        <div className="orientation-switch glass-panel" style={{ padding: '4px', borderRadius: 'var(--radius-full)' }}>
          <button
            className={`switch-btn ${orientation === 'landscape' ? 'active' : ''}`}
            onClick={() => onOrientationChange('landscape')}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <MonitorIcon size={18} />
            <span>Desktop Wallpapers</span>
          </button>
          <button
            className={`switch-btn ${orientation === 'portrait' ? 'active' : ''}`}
            onClick={() => onOrientationChange('portrait')}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <SmartphoneIcon size={18} />
            <span>Mobile Wallpapers</span>
          </button>
        </div>
      </div>

      {/* Fallback Banner Alert */}
      {isFallbackActive && !showFavoritesOnly && (
        <div className="demo-banner animate-fade-in glass-panel" onClick={onOpenSettings}>
          <div className="demo-banner-content">
            <span className="demo-badge">DEMO MODE</span>
            <p>
              Displaying premium curated fallbacks. <strong>Click here to add your free Pexels API Key</strong> to unlock millions of high-definition wallpapers!
            </p>
          </div>
          <button className="demo-action-btn">Connect Key</button>
        </div>
      )}

      {/* Favorites Title Header */}
      {showFavoritesOnly && (
        <div className="favorites-header animate-fade-in">
          <div className="favorites-title-group">
            <HeartIcon size={24} className="fav-title-icon" fill="var(--accent-pink)" />
            <h2 className="font-display">My Favorite Collection ({favorites.length})</h2>
          </div>
          <button 
            className="btn-back-feed font-display" 
            onClick={() => window.location.hash = 'wallpapers'}
            title="Back to Wallpaper Feed"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="18" 
              height="18" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="back-arrow-icon"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Feed</span>
          </button>
        </div>
      )}

      {/* Wallpapers Display Grid */}
      {wallpapers.length > 0 ? (
        <div className={`wallpapers-grid ${orientation}`}>
          {wallpapers.map((wallpaper) => (
            <WallpaperCard
              key={wallpaper.id}
              wallpaper={wallpaper}
              isFavorite={favorites.some(fav => fav.id === wallpaper.id)}
              onToggleFavorite={onToggleFavorite}
              onPreview={onPreview}
              orientation={orientation}
            />
          ))}
        </div>
      ) : (
        // Empty States
        !isLoading && (
          <div className="empty-state-container animate-fade-in glass-panel">
            {showFavoritesOnly ? (
              <>
                <div className="empty-state-icon-circle fav-empty">
                  <HeartIcon size={44} className="empty-icon" />
                </div>
                <h3 className="font-display">Your Gallery is Empty</h3>
                <p>Heart wallpapers you love to build your personal visual collection.</p>
              </>
            ) : (
              <>
                <div className="empty-state-icon-circle search-empty">
                  <SearchIcon size={44} className="empty-icon" />
                </div>
                <h3 className="font-display">No Wallpapers Found</h3>
                <p>We couldn't find matching wallpapers for your query. Try editing your keywords.</p>
              </>
            )}
          </div>
        )
      )}

      {/* Skeleton Loading State Grid */}
      {isLoading && (
        <div className={`wallpapers-grid ${orientation}`}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <div 
              key={`skeleton-${idx}`} 
              className={`skeleton-card-container ${orientation}`}
              style={{ aspectRatio: orientation === 'portrait' ? '9/16' : '16/10' }}
            >
              <span className="skeleton-wave"></span>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .wallpaper-section {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 40px 24px;
        }
        .filters-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .orientation-switch {
          display: flex;
          padding: 4px;
          border-radius: var(--radius-full);
          background: rgba(12, 13, 20, 0.4);
          border: 1px solid var(--glass-border);
        }
        .switch-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .switch-btn.active {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          color: white;
          box-shadow: var(--neon-purple-shadow);
        }
        .categories-pill-wrapper {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 0;
          max-width: 100%;
          scrollbar-width: none; /* Firefox */
        }
        .categories-pill-wrapper::-webkit-scrollbar {
          display: none; /* Safari/Chrome */
        }
        .category-pill {
          padding: 10px 20px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          white-space: nowrap;
          border: 1px solid var(--glass-border);
        }
        .category-pill.active {
          background: rgba(139, 92, 246, 0.1);
          border-color: var(--accent-purple);
          color: white;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
        }
        .demo-banner {
          background: linear-gradient(90deg, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
          border: 1px solid rgba(236, 72, 153, 0.2);
          border-radius: var(--radius-md);
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .demo-banner:hover {
          border-color: var(--accent-pink);
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.15);
          transform: translateY(-2px);
        }
        .demo-banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .demo-badge {
          background: var(--accent-pink);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          letter-spacing: 1px;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.4);
        }
        .demo-banner-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .demo-banner-content p strong {
          color: white;
        }
        .demo-action-btn {
          background: transparent;
          border: 1px solid var(--accent-pink);
          color: var(--accent-pink);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .demo-banner:hover .demo-action-btn {
          background: var(--accent-pink);
          color: white;
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.3);
        }
        .favorites-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .favorites-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .favorites-header h2 {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .fav-title-icon {
          animation: heartPulse 1.2s infinite alternate ease-in-out;
          display: inline-flex;
          align-items: center;
        }
        .btn-back-feed {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 8px 18px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-back-feed:hover {
          background: var(--glass-bg-hover);
          border-color: var(--glass-border-hover);
          color: var(--text-primary);
          transform: translateX(-2px);
          box-shadow: var(--neon-purple-shadow);
        }
        .back-arrow-icon {
          transition: transform 0.3s ease;
        }
        .btn-back-feed:hover .back-arrow-icon {
          transform: translateX(-4px);
        }
        @keyframes heartPulse {
          to {
            transform: scale(1.15);
          }
        }
        .wallpapers-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }
        .wallpapers-grid.portrait {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        }
        @media (min-width: 1200px) {
          .wallpapers-grid, .wallpapers-grid.portrait {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        .empty-state-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          text-align: center;
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          max-width: 600px;
          margin: 40px auto;
        }
        .empty-state-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .fav-empty {
          background: rgba(236, 72, 153, 0.1);
          color: var(--accent-pink);
          border: 1px solid rgba(236, 72, 153, 0.2);
        }
        .search-empty {
          background: rgba(6, 182, 212, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .empty-icon {
          opacity: 0.8;
        }
        .empty-state-container h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .empty-state-container p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          max-width: 320px;
          line-height: 1.6;
        }
        .skeleton-card-container {
          position: relative;
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }
        .skeleton-wave {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent);
          transform: translateX(-100%);
          animation: skeletonPulse 1.5s infinite;
        }

        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .orientation-switch {
            justify-content: center;
          }
          .demo-banner {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            padding: 20px;
          }
          .demo-banner-content {
            flex-direction: column;
            gap: 10px;
          }
          .demo-action-btn {
            width: 100%;
          }
        }
      `}} />
    </section>
  );
}
