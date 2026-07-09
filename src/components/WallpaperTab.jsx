import React, { useState, useEffect } from 'react';
import WallpaperGrid from './WallpaperGrid';
import PreviewModal from './PreviewModal';
import { getWallpapers } from '../services/pexels';

export default function WallpaperTab({
  searchQuery,
  onResetSearch,
  favoritesBox,
  settingsBox,
  favorites,
  onToggleFavorite,
  showFavoritesOnly,
  onOpenSettings,
  isCategoriesOpen,
  activeCategory,
  onCategoryChange
}) {
  const [wallpapers, setWallpapers] = useState([]);
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' or 'portrait'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [previewWallpaper, setPreviewWallpaper] = useState(null);
  const [columns, setColumns] = useState(4);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Reset pagination limit on visual state change
  useEffect(() => {
    setHasLoadedMore(false);
  }, [searchQuery, activeCategory, orientation, showFavoritesOnly]);

  // Handle responsive column calculations
  useEffect(() => {
    const updateColumns = () => {
      const grid = document.querySelector('.wallpapers-grid');
      if (grid) {
        const computedStyle = window.getComputedStyle(grid);
        const colString = computedStyle.gridTemplateColumns;
        const colCount = colString.trim().split(/\s+/).length;
        if (colCount > 0) {
          setColumns(colCount);
        }
      } else {
        // Precise layout math fallback
        const w = window.innerWidth;
        if (w >= 1200) {
          setColumns(4);
        } else {
          const cardWidth = orientation === 'portrait' ? 200 : 300;
          const padding = 32;
          const gap = 16;
          const availableWidth = Math.min(w, 1680) - padding;
          const approxCols = Math.floor((availableWidth + gap) / (cardWidth + gap));
          setColumns(Math.max(1, approxCols));
        }
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    const timeoutId = setTimeout(updateColumns, 100);
    return () => {
      window.removeEventListener('resize', updateColumns);
      clearTimeout(timeoutId);
    };
  }, [orientation, wallpapers]);

  // Load preferences from settings_box on mount
  useEffect(() => {
    async function loadPreferences() {
      if (settingsBox) {
        const savedOrientation = await settingsBox.get('pref_orientation');
        if (savedOrientation) {
          setOrientation(savedOrientation);
        }
      }
    }
    loadPreferences();
  }, [settingsBox]);

  // Sync state to load wallpapers when search, category, or orientation changes
  useEffect(() => {
    if (!showFavoritesOnly) {
      fetchWallpapers(1, true);
    }
  }, [searchQuery, activeCategory, orientation, showFavoritesOnly]);

  const fetchWallpapers = async (pageNum, isNewQuery = false) => {
    setIsLoading(true);
    if (isNewQuery) {
      setWallpapers([]);
      setPage(1);
    }

    const queryToUse = activeCategory !== 'All' ? activeCategory : searchQuery;

    try {
      const result = await getWallpapers({
        query: queryToUse,
        orientation,
        page: pageNum
      });

      setIsFallbackActive(result.isFallback);
      
      setWallpapers(prev => {
        if (isNewQuery) return result.photos;
        // Deduplicate records
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNewPhotos = result.photos.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNewPhotos];
      });

      setHasMore(result.photos.length > 0 && result.photos.length >= 8);
    } catch (error) {
      console.error('Failed fetching wallpapers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setHasLoadedMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWallpapers(nextPage, false);
  };

  // Category change handler is now managed at the root App level

  const handleOrientationChange = (newOrientation) => {
    setOrientation(newOrientation);
  };

  const displayedWallpapers = showFavoritesOnly ? favorites : wallpapers;
  
  const showLimit = !showFavoritesOnly && !hasLoadedMore;
  const maxVisible = showLimit ? columns * 10 : displayedWallpapers.length;
  const visibleWallpapers = displayedWallpapers.slice(0, maxVisible);

  return (
    <div className="wallpaper-tab animate-fade">
      {/* Intro hero for wallpapers */}
      {!showFavoritesOnly && !searchQuery && activeCategory === 'All' && (
        <div className="hero-section" style={{ maxWidth: 'var(--max-width)', margin: '48px auto 0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div className="hero-content" style={{ padding: '56px 40px', borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)' }}>
            <h2 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.25px', color: 'var(--text-primary)' }}>
              Personalize Your Screen
            </h2>
            <p className="hero-subtitle" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.7' }}>
              Explore premium desktop and mobile wallpapers in stunning 1080p, 2K, and 4K quality.
            </p>
          </div>
        </div>
      )}

      <main className="main-content">
        <WallpaperGrid
          wallpapers={visibleWallpapers}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onPreview={setPreviewWallpaper}
          orientation={orientation}
          onOrientationChange={handleOrientationChange}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          isLoading={isLoading}
          isFallbackActive={isFallbackActive}
          showFavoritesOnly={showFavoritesOnly}
          onOpenSettings={onOpenSettings}
          isCategoriesOpen={isCategoriesOpen}
        />

        {/* Load More Button */}
        {!showFavoritesOnly && wallpapers.length > 0 && (hasMore || wallpapers.length > maxVisible) && (
          <div className="load-more-container">
            <button 
              className="load-more-btn" 
              onClick={handleLoadMore} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-tech"></span>
                  <span>Loading Wallpapers...</span>
                </>
              ) : (
                <span>Load More Wallpapers</span>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Simulator Modal */}
      <PreviewModal
        isOpen={!!previewWallpaper}
        onClose={() => setPreviewWallpaper(null)}
        wallpaper={previewWallpaper}
        isFavorite={previewWallpaper ? favorites.some(fav => fav.id === previewWallpaper.id) : false}
        onToggleFavorite={onToggleFavorite}
        wallpapers={showFavoritesOnly ? favorites : wallpapers}
        onSelectWallpaper={setPreviewWallpaper}
        favorites={favorites}
        onCategoryChange={onCategoryChange}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .load-more-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 64px 0 80px 0;
          width: 100%;
        }
        .load-more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 44px;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.35);
          color: var(--text-primary);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--neon-purple-shadow);
        }
        [data-theme='light'] .load-more-btn {
          background: rgba(124, 58, 237, 0.04);
          border-color: rgba(124, 58, 237, 0.25);
          color: var(--text-primary);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.05);
        }
        .load-more-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          color: white;
          border-color: transparent;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 25px rgba(139, 92, 246, 0.35), var(--neon-purple-shadow);
        }
        .load-more-btn:active:not(:disabled) {
          transform: translateY(-1px) scale(1.0);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }
        .load-more-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--glass-border);
          color: var(--text-muted);
          box-shadow: none;
        }
        .spinner-tech {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
