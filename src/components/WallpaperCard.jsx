import React, { useState } from 'react';
import { HeartIcon, DownloadIcon, MonitorIcon, SmartphoneIcon } from './Icons';

export default function WallpaperCard({ 
  wallpaper, 
  isFavorite, 
  onToggleFavorite, 
  onPreview, 
  orientation 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { photographer, photographer_url, src, avg_color } = wallpaper;
  
  // Choose the display source depending on available scales
  const displaySrc = orientation === 'portrait' ? (src.portrait || src.medium) : (src.landscape || src.large2x || src.medium);
  const downloadUrl = src.original || displaySrc;

  const handleDownload = (e) => {
    e.stopPropagation();
    // Since Pexels/Unsplash CDN block simple client-side triggers due to CORS,
    // opening in a new tab is the most reliable way to let the user save it,
    // or we can fetch as a blob and trigger a download link.
    // Let's implement fetch as blob to trigger direct browser download!
    // If it fails due to CORS, we fallback to opening in new tab.
    fetch(downloadUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = `AeroPaper-${wallpaper.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(() => {
        window.open(downloadUrl, '_blank');
      });
  };

  return (
    <div className={`wallpaper-card-wrapper animate-fade ${orientation}`}>
      <div 
        className="wallpaper-card glass-panel" 
        onClick={() => onPreview(wallpaper)}
        style={{ 
          backgroundColor: avg_color || 'var(--bg-tertiary)',
          aspectRatio: orientation === 'portrait' ? '9/16' : '16/10',
          cursor: 'pointer'
        }}
      >
        {/* Loading Spinner/Skeleton */}
        {!imageLoaded && (
          <div className="card-skeleton">
            <span className="skeleton-glow"></span>
          </div>
        )}
        
        {/* Image Element */}
        <img
          src={displaySrc}
          alt={`Wallpaper by ${photographer}`}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Hover Action Overlay */}
        <div className="card-overlay">
          {/* Top Actions: Favorite & Device Toggle */}
          <div className="overlay-top">
            <button 
              className={`overlay-action-btn favorite-btn ${isFavorite ? 'active' : ''}`} 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(wallpaper); }}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <HeartIcon size={18} fill={isFavorite ? 'var(--accent-pink)' : 'none'} />
            </button>
          </div>

          {/* Bottom Actions: Photographer details and main "Try On" trigger */}
          <div className="overlay-bottom">
            <div className="photographer-info">
              <span className="by-label">By</span>
              <a 
                href={photographer_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="photographer-name"
                onClick={(e) => e.stopPropagation()}
              >
                {photographer}
              </a>
            </div>
            
            <div className="overlay-actions-row">
              <button 
                className="preview-trigger-btn gradient-btn"
                onClick={() => onPreview(wallpaper)}
                title="Try On Device"
              >
                {orientation === 'portrait' ? <SmartphoneIcon size={16} /> : <MonitorIcon size={16} />}
                <span>Try On</span>
              </button>
              
              <button 
                className="overlay-action-btn download-btn"
                onClick={handleDownload}
                title="Download Full Resolution"
              >
                <DownloadIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .wallpaper-card-wrapper {
          width: 100%;
          position: relative;
          opacity: 0;
        }
        .wallpaper-card {
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          border: 1px solid var(--glass-border);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          cursor: pointer;
        }
        .wallpaper-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 12px 30px rgba(0,0,0,0.5), var(--neon-purple-shadow);
          border-color: var(--glass-border-hover);
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.5s ease, transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .card-image.loaded {
          opacity: 1;
        }
        .wallpaper-card:hover .card-image {
          transform: scale(1.08);
        }
        .card-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
        }
        .skeleton-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transform: translateX(-100%);
          animation: skeletonPulse 1.6s infinite;
        }
        @keyframes skeletonPulse {
          to {
            transform: translateX(100%);
          }
        }
        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.75) 100%);
          opacity: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          transition: opacity 0.3s ease;
          z-index: 10;
        }
        .wallpaper-card:hover .card-overlay {
          opacity: 1;
        }
        .overlay-top {
          display: flex;
          justify-content: flex-end;
        }
        .overlay-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(12, 13, 20, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .overlay-action-btn:hover {
          background: var(--bg-primary);
          color: white;
          border-color: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
        }
        .overlay-action-btn.favorite-btn.active {
          color: var(--accent-pink);
          border-color: rgba(236, 72, 153, 0.4);
          background: rgba(236, 72, 153, 0.15);
        }
        .overlay-bottom {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .photographer-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }
        .by-label {
          color: var(--text-muted);
        }
        .photographer-name {
          color: white;
          text-decoration: none;
          font-weight: 500;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .photographer-name:hover {
          color: var(--accent-cyan);
          text-decoration: underline;
        }
        .overlay-actions-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-trigger-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.8rem;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }
        .download-btn {
          border-radius: var(--radius-sm);
        }
      `}} />
    </div>
  );
}
