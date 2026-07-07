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
  isCategoriesOpen
}) {
  const [wallpapers, setWallpapers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' or 'portrait'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [previewWallpaper, setPreviewWallpaper] = useState(null);

  // Load preferences from settings_box on mount
  useEffect(() => {
    async function loadPreferences() {
      if (settingsBox) {
        const savedOrientation = await settingsBox.get('pref_orientation');
        if (savedOrientation) {
          setOrientation(savedOrientation);
        }
        const savedCategory = await settingsBox.get('pref_category');
        if (savedCategory) {
          setActiveCategory(savedCategory);
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
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWallpapers(nextPage, false);
  };

  const handleCategoryChange = (category) => {
    onResetSearch();
    setActiveCategory(category);
  };

  const handleOrientationChange = (newOrientation) => {
    setOrientation(newOrientation);
  };

  const displayedWallpapers = showFavoritesOnly ? favorites : wallpapers;

  return (
    <div className="wallpaper-tab animate-fade">
      {/* Intro hero for wallpapers */}
      {!showFavoritesOnly && !searchQuery && activeCategory === 'All' && (
        <div className="hero-section" style={{ maxWidth: 'var(--max-width)', margin: '32px auto 0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div className="hero-content" style={{ padding: '44px 32px', borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(12px)' }}>
            <h2 className="hero-title" style={{ fontFamily: 'var(--font-body)', fontSize: '1.45rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.25px', color: 'var(--text-primary)' }}>
              Personalize Your Screen
            </h2>
            <p className="hero-subtitle" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', lineHeight: '1.7' }}>
              Explore premium curated wallpapers for mobile and desktop screens. Try them on inside our simulated device mockups and download them in 1080p, 2K, or 4K resolutions.
            </p>
          </div>
        </div>
      )}

      <main className="main-content">
        <WallpaperGrid
          wallpapers={displayedWallpapers}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onPreview={setPreviewWallpaper}
          orientation={orientation}
          onOrientationChange={handleOrientationChange}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
          isFallbackActive={isFallbackActive}
          showFavoritesOnly={showFavoritesOnly}
          onOpenSettings={onOpenSettings}
          isCategoriesOpen={isCategoriesOpen}
        />

        {/* Load More Button */}
        {!showFavoritesOnly && !isLoading && wallpapers.length > 0 && hasMore && (
          <div className="load-more-container" style={{ display: 'flex', justifyC: 'center', justifyContent: 'center', marginBottom: '60px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleLoadMore} 
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-full)', padding: '12px 30px' }}
            >
              Load More Wallpapers
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
      />
    </div>
  );
}
