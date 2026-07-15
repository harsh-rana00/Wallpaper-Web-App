import React, { useState, useEffect, useMemo } from 'react';
import { DownloadIcon, HeartIcon, MonitorIcon, SmartphoneIcon } from './Icons';
import WallpaperCard from './WallpaperCard';

const getResizedUrl = (url, resType, isPortrait) => {
  if (!url) return '';
  if (url.startsWith('/wallpapers/')) return url;
  
  let width, height;
  if (resType === '1080p') {
    width = isPortrait ? 1080 : 1920;
    height = isPortrait ? 1920 : 1080;
  } else if (resType === '2k') {
    width = isPortrait ? 1440 : 2560;
    height = isPortrait ? 2560 : 1440;
  } else if (resType === '4k') {
    width = isPortrait ? 2160 : 3840;
    height = isPortrait ? 3840 : 2160;
  } else {
    return url;
  }

  if (url.includes('images.unsplash.com') || url.includes('images.pexels.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=compress&cs=tinysrgb&fit=max&w=${width}&h=${height}`;
  }

  return url;
};

export default function PreviewModal({ 
  isOpen, 
  onClose, 
  wallpaper, 
  isFavorite, 
  onToggleFavorite,
  wallpapers = [],
  onSelectWallpaper,
  favorites = [],
  onCategoryChange
}) {
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'phone' or 'desktop', default to desktop
  const [timeState, setTimeState] = useState({ time: '09:41', date: 'Tuesday, July 7' });
  const [selectedRes, setSelectedRes] = useState('1080p'); // default to 1080p resolution
  const [recommendationLimit, setRecommendationLimit] = useState(12);
  const [imgSrc, setImgSrc] = useState('');

  // Reset scroll position and limit when active wallpaper changes
  useEffect(() => {
    const body = document.querySelector('.preview-modal-body');
    if (body) {
      body.scrollTop = 0;
    }
    setRecommendationLimit(12);
  }, [wallpaper]);

  // Find related wallpapers based on the current wallpaper's category
  const relatedWallpapersAll = useMemo(() => {
    if (!wallpapers || wallpapers.length === 0 || !wallpaper) return [];
    
    // First, try matching same category, excluding the current wallpaper
    let matched = wallpapers.filter(w => w.id !== wallpaper.id && w.category === wallpaper.category);
    
    // Then other wallpapers
    const otherWallpapers = wallpapers.filter(w => w.id !== wallpaper.id && w.category !== wallpaper.category);
    
    return [...matched, ...otherWallpapers];
  }, [wallpapers, wallpaper]);

  const relatedWallpapers = useMemo(() => {
    return relatedWallpapersAll.slice(0, recommendationLimit);
  }, [relatedWallpapersAll, recommendationLimit]);

  const handleSeeMore = () => {
    if (recommendationLimit < relatedWallpapersAll.length) {
      setRecommendationLimit(prev => prev + 12);
    } else {
      if (onCategoryChange) {
        onCategoryChange(wallpaper.category);
      }
      onClose();
    }
  };

  // Update clock state dynamically for realism
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString('en-US', options);
      
      setTimeState({
        time: `${hours}:${minutes}`,
        date: dateStr
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 60); // update every minute
    return () => clearInterval(interval);
  }, []);

  // Initialize layout preview to match the wallpaper's natural orientation
  useEffect(() => {
    if (isOpen && wallpaper) {
      const isWallpaperPortrait = wallpaper.width < wallpaper.height;
      setPreviewDevice(isWallpaperPortrait ? 'phone' : 'desktop');
    }
  }, [isOpen, wallpaper]);

  const isPortrait = previewDevice === 'phone';
  const isWallpaperPortrait = wallpaper ? wallpaper.width < wallpaper.height : false;

  // 1. Download source resolution computation (matches selected device view crop)
  const baseSrc = wallpaper
    ? (isPortrait 
      ? (wallpaper.src.portrait || wallpaper.src.large2x || wallpaper.src.original)
      : (wallpaper.src.landscape || wallpaper.src.original || wallpaper.src.large2x))
    : '';
  const displaySrc = getResizedUrl(baseSrc, selectedRes, isPortrait);
  const downloadUrl = wallpaper ? (wallpaper.src.original || displaySrc) : '';

  // 2. Stable preview source (matches native wallpaper orientation to prevent reload flashing)
  const previewBaseSrc = wallpaper
    ? (isWallpaperPortrait 
      ? (wallpaper.src.portrait || wallpaper.src.original || wallpaper.src.large2x)
      : (wallpaper.src.landscape || wallpaper.src.original || wallpaper.src.large2x))
    : '';
  const previewSrc = getResizedUrl(previewBaseSrc, '1080p', isWallpaperPortrait);
  const lowResUrl = wallpaper ? (wallpaper.src.medium || previewBaseSrc) : '';

  // Progressive Image Loading
  useEffect(() => {
    if (!isOpen || !wallpaper) return;
    setImgSrc(lowResUrl);
    const img = new Image();
    img.src = previewSrc;
    img.onload = () => {
      setImgSrc(previewSrc);
    };
  }, [previewSrc, lowResUrl, isOpen, wallpaper]);

  const isOrientationMatched = (previewDevice === 'phone' && isWallpaperPortrait) || (previewDevice === 'desktop' && !isWallpaperPortrait);
  const fgObjectFit = isOrientationMatched ? 'cover' : 'contain';

  if (!isOpen || !wallpaper) return null;

  const handleDownload = () => {
    const isPortrait = previewDevice === 'phone';
    const targetUrl = getResizedUrl(downloadUrl, selectedRes, isPortrait);

    fetch(targetUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = `AeroPaper-${wallpaper.id}-${selectedRes}-${previewDevice}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(() => {
        window.open(targetUrl, '_blank');
      });
  };

  return (
    <div className="preview-modal-overlay animate-fade" onClick={onClose}>
      <div className="preview-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="preview-top-bar">
          <div className="device-switcher-pills">
            <button 
              className={`switch-pill ${previewDevice === 'phone' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('phone')}
            >
              <SmartphoneIcon size={16} />
              <span>Mobile View</span>
            </button>
            <button 
              className={`switch-pill ${previewDevice === 'desktop' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('desktop')}
            >
              <MonitorIcon size={16} />
              <span>Desktop View</span>
            </button>
          </div>

          <div className="modal-right-actions">
            <button 
              className={`action-btn-circle ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(wallpaper)}
              title="Add to Favorites"
            >
              <HeartIcon size={20} fill={isFavorite ? 'var(--accent-pink)' : 'none'} />
            </button>
            <button className="action-btn-circle" onClick={handleDownload} title="Download Wallpaper">
              <DownloadIcon size={20} />
            </button>
            <button 
              className="btn btn-secondary close-btn-text" 
              onClick={onClose} 
              title="Back to Feed"
              style={{ 
                padding: '6px 14px', 
                borderRadius: 'var(--radius-sm)', 
                fontSize: '0.8rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: 'var(--error)', 
                border: '1px solid rgba(239, 68, 68, 0.25)',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="preview-modal-body">
          {/* Device Canvas Area */}
          <div className="device-canvas">
            <div className="device-container">
            {previewDevice === 'phone' ? (
              // High Fidelity Phone Mockup
              <div 
                className="phone-mockup" 
                style={{ 
                  backgroundColor: wallpaper.avg_color || '#0c0c0e'
                }}
              >
                {/* Background Blur Layer */}
                <img 
                  className="mockup-bg-blur"
                  src={imgSrc || lowResUrl}
                  alt=""
                />
                {/* Crisp Foreground Layer */}
                <img 
                  className="mockup-fg-image"
                  src={imgSrc || lowResUrl}
                  alt="Phone Wallpaper Preview"
                  style={{ 
                    objectFit: fgObjectFit
                  }}
                />

                {/* UI Overlay */}
                <div className="phone-mockup-info">
                  {/* Status Bar */}
                  <div className="phone-status-bar">
                    <span className="status-time">{timeState.time}</span>
                    <div className="status-icons">
                      <svg width="15" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M2 3h1v8H2zm3-2h1v10H5zm3-2h1v12H8zm3 4h1v8h-1zm3 2h1v6h-1z"/></svg>
                      <svg width="15" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M15.3 4.3a8.6 8.6 0 0 0-13.6 0c-.3.4-.2.9.2 1.2l6 4.7a1 1 0 0 0 1.2 0l6-4.7c.4-.3.5-.8.2-1.2z"/></svg>
                      <svg width="18" height="12" viewBox="0 0 20 12" fill="currentColor"><rect x="1" y="2" width="15" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1"/><rect x="3" y="4" width="11" height="4" rx="0.5"/><path d="M17 4.5v3a1.5 1.5 0 0 0 1.5 1.5h.5V3h-.5A1.5 1.5 0 0 0 17 4.5z"/></svg>
                    </div>
                  </div>

                  {/* Lock Screen Time/Date widget */}
                  <div className="phone-mockup-time">
                    <p>{timeState.date}</p>
                    <h2>{timeState.time}</h2>
                  </div>

                  {/* Bottom shortcuts (Flashlight & Camera circles) */}
                  <div className="phone-mockup-bottom">
                    <div className="phone-mockup-shortcut">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                    </div>
                    <div className="phone-mockup-shortcut">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </div>
                  </div>

                  {/* Home indicator bar */}
                  <div className="phone-mockup-bar"></div>
                </div>
              </div>
            ) : (
              // High Fidelity Desktop Monitor Mockup
              <div className="desktop-view-wrapper">
                <div 
                  className="desktop-mockup" 
                  style={{ 
                    backgroundColor: wallpaper.avg_color || '#0c0c0e'
                  }}
                >
                  {/* Background Blur Layer */}
                  <img 
                    className="mockup-bg-blur"
                    src={imgSrc || lowResUrl}
                    alt=""
                  />
                  {/* Crisp Foreground Layer */}
                  <img 
                    className="mockup-fg-image"
                    src={imgSrc || lowResUrl}
                    alt="Desktop Wallpaper Preview"
                    style={{ 
                      objectFit: fgObjectFit
                    }}
                  />

                  {/* UI Overlay */}
                  <div className="desktop-mockup-screen">
                    {/* Top OS System Menu Bar */}
                    <div className="desktop-mockup-menubar">
                      <div className="desktop-mockup-left-menu">
                        <span style={{ fontWeight: '800' }}></span>
                        <span>Finder</span>
                        <span>File</span>
                        <span>Edit</span>
                        <span>Go</span>
                        <span>Window</span>
                        <span>Help</span>
                      </div>
                      <div className="desktop-mockup-right-menu" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>📶</span>
                        <span>🔋 100%</span>
                        <span>{timeState.time}</span>
                      </div>
                    </div>

                    {/* Mock Desktop Icons */}
                    <div className="desktop-mockup-icons">
                      <div className="desktop-file-icon">
                        <div className="desktop-mockup-icon font-display" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>Mac</div>
                        <span style={{ fontSize: '0.5rem', marginTop: '2px', textAlign: 'center', display: 'block', textShadow: '1px 1px 2px black' }}>Macintosh HD</span>
                      </div>
                      <div className="desktop-file-icon">
                        <div className="desktop-mockup-icon font-display" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>📁</div>
                        <span style={{ fontSize: '0.5rem', marginTop: '2px', textAlign: 'center', display: 'block', textShadow: '1px 1px 2px black' }}>Wallpapers</span>
                      </div>
                    </div>

                    {/* Mock Dock with dynamic scale triggers */}
                    <div className="desktop-mockup-dock">
                      <div className="desktop-mockup-dock-item" style={{ background: '#3b82f6' }}></div>
                      <div className="desktop-mockup-dock-item" style={{ background: '#10b981' }}></div>
                      <div className="desktop-mockup-dock-item" style={{ background: '#ef4444' }}></div>
                      <div className="desktop-mockup-dock-item" style={{ background: '#f59e0b' }}></div>
                      <div className="desktop-mockup-dock-item" style={{ background: '#8b5cf6' }}></div>
                    </div>
                  </div>
                </div>
                <div className="desktop-mockup-stand"></div>
                <div className="desktop-mockup-base"></div>
              </div>
            )}
          </div>
        </div>

        {/* Photographer Info Overlay Footer */}
        <div className="preview-footer">
          <div>
            <p className="photographer-credit" style={{ margin: 0 }}>
              Shot by <a href={wallpaper.photographer_url} target="_blank" rel="noopener noreferrer">{wallpaper.photographer}</a>
            </p>
            <p className="original-resolution" style={{ margin: '4px 0 0 0' }}>
              Original Resolution: {wallpaper.width} &times; {wallpaper.height}px
            </p>
          </div>
          
          <div className="download-res-selector" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resolution:</span>
            <div className="res-buttons-group">
              {[
                { value: '1080p', label: '1080p (Full HD)', desc: previewDevice === 'phone' ? '1080x1920' : '1920x1080' },
                { value: '2k', label: '2K (QHD)', desc: previewDevice === 'phone' ? '1440x2560' : '2560x1440' },
                { value: '4k', label: '4K (Ultra HD)', desc: previewDevice === 'phone' ? '2160x3840' : '3840x2160' }
              ].map(res => (
                <button
                  key={res.value}
                  type="button"
                  className={`res-btn ${selectedRes === res.value ? 'active' : ''}`}
                  onClick={() => setSelectedRes(res.value)}
                >
                  <span className="res-btn-label">{res.label}</span>
                  <span className="res-btn-desc">{res.desc}</span>
                </button>
              ))}
            </div>

            <button className="btn btn-primary" onClick={handleDownload} style={{ padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontSize: '0.90rem', height: '42px' }}>
              <DownloadIcon size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Recommended Wallpapers Grid Section */}
        {relatedWallpapers.length > 0 && (
          <div className="related-section animate-fade">
            <h3 className="related-title font-display">Recommended Wallpapers</h3>
            <div className={`related-grid ${previewDevice === 'phone' ? 'portrait' : 'landscape'}`}>
              {relatedWallpapers.map((relWallpaper) => (
                <WallpaperCard
                  key={relWallpaper.id}
                  wallpaper={relWallpaper}
                  isFavorite={favorites.some(fav => fav.id === relWallpaper.id)}
                  onToggleFavorite={onToggleFavorite}
                  onPreview={onSelectWallpaper}
                  orientation={previewDevice === 'phone' ? 'portrait' : 'landscape'}
                />
              ))}
            </div>
            
            <div className="see-more-container">
              <button 
                type="button" 
                className="see-more-btn font-display" 
                onClick={handleSeeMore}
              >
                <span>See More Wallpapers</span>
                <span className="see-more-arrow">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    <style dangerouslySetInnerHTML={{ __html: `
        .preview-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(4, 4, 6, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(16px);
        }
        .preview-modal-content {
          width: 98vw;
          max-width: 1560px;
          height: 96vh;
          max-height: 1040px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          box-shadow: 0 30px 70px rgba(0,0,0,0.8), var(--neon-purple-shadow);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .preview-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(7, 7, 10, 0.4);
        }
        .device-switcher-pills {
          display: flex;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--glass-border);
          padding: 3px;
          border-radius: var(--radius-full);
        }
        .switch-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .switch-pill:hover {
          color: white;
        }
        .switch-pill.active {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .modal-right-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .action-btn-circle:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          transform: scale(1.08) translateY(-1px);
        }
        .action-btn-circle:active {
          transform: scale(0.95);
        }
        .action-btn-circle.active {
          color: var(--accent-pink) !important;
          border-color: rgba(236, 72, 153, 0.45) !important;
          background: rgba(236, 72, 153, 0.1) !important;
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.2) !important;
          animation: heartBeatPulse 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        @keyframes heartBeatPulse {
          0% { transform: scale(1); }
          30% { transform: scale(1.22); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .action-btn-circle.close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border-color: var(--error);
        }
        .preview-modal-body {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
        .preview-modal-body::-webkit-scrollbar {
          width: 8px;
        }
        .preview-modal-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .preview-modal-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
        }
        .preview-modal-body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .device-canvas {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.25);
          padding: 4px;
          min-height: 480px;
          height: 76vh;
          max-height: 820px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }
        .desktop-view-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          --mockup-h-limit: min(68vh, 640px);
          --mockup-w: min(94vw, calc(var(--mockup-h-limit) * 1.778));
          --mockup-h: calc(var(--mockup-w) / 1.778);
        }
        .desktop-mockup {
          position: relative !important;
          overflow: hidden !important;
          width: var(--mockup-w) !important;
          height: var(--mockup-h) !important;
          border: solid #1f2937 !important;
          border-width: calc(var(--mockup-w) * 0.015) !important;
          border-bottom-width: calc(var(--mockup-w) * 0.028) !important;
          border-radius: calc(var(--mockup-w) * 0.015) !important;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), var(--neon-cyan-shadow) !important;
        }
        .desktop-mockup-stand {
          width: calc(var(--mockup-w) * 0.185) !important;
          height: calc(var(--mockup-w) * 0.081) !important;
        }
        .desktop-mockup-base {
          width: calc(var(--mockup-w) * 0.304) !important;
          height: max(4px, calc(var(--mockup-w) * 0.01)) !important;
        }
        .desktop-mockup-menubar {
          font-size: calc(var(--mockup-w) * 0.011) !important;
          padding: calc(var(--mockup-w) * 0.003) calc(var(--mockup-w) * 0.008) !important;
          border-radius: calc(var(--mockup-w) * 0.005) !important;
        }
        .desktop-mockup-dock {
          padding: calc(var(--mockup-w) * 0.005) calc(var(--mockup-w) * 0.01) !important;
          border-radius: calc(var(--mockup-w) * 0.008) !important;
          gap: calc(var(--mockup-w) * 0.008) !important;
          margin-bottom: calc(var(--mockup-w) * 0.003) !important;
        }
        .desktop-mockup-dock-item {
          width: calc(var(--mockup-w) * 0.02) !important;
          height: calc(var(--mockup-w) * 0.02) !important;
          border-radius: calc(var(--mockup-w) * 0.005) !important;
        }
        .desktop-mockup-icons {
          gap: calc(var(--mockup-w) * 0.015) !important;
          margin-top: calc(var(--mockup-w) * 0.015) !important;
        }
        .desktop-file-icon {
          width: calc(var(--mockup-w) * 0.065) !important;
        }
        .desktop-mockup-icon {
          width: calc(var(--mockup-w) * 0.026) !important;
          height: calc(var(--mockup-w) * 0.026) !important;
          border-radius: calc(var(--mockup-w) * 0.006) !important;
        }
        .desktop-mockup-screen {
          z-index: 5 !important;
        }
        .phone-mockup {
          --phone-h-limit: min(72vh, 720px);
          --phone-w: min(90vw, calc(var(--phone-h-limit) * 0.48));
          --phone-h-final: calc(var(--phone-w) / 0.48);

          position: relative !important;
          overflow: hidden !important;
          width: var(--phone-w) !important;
          height: var(--phone-h-final) !important;
          border: solid #1f2937 !important;
          border-width: calc(var(--phone-w) * 0.042) !important;
          border-radius: calc(var(--phone-w) * 0.133) !important;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), var(--neon-purple-shadow) !important;
        }
        .phone-mockup::before {
          content: '' !important;
          position: absolute !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background-color: #1f2937 !important;
          z-index: 10 !important;
          width: calc(var(--phone-w) * 0.224) !important;
          height: calc(var(--phone-w) * 0.067) !important;
          border-radius: calc(var(--phone-w) * 0.033) !important;
          top: calc(var(--phone-w) * 0.024) !important;
        }
        .phone-mockup-info {
          padding: calc(var(--phone-w) * 0.1) calc(var(--phone-w) * 0.048) calc(var(--phone-w) * 0.06) calc(var(--phone-w) * 0.048) !important;
          z-index: 5 !important;
        }
        .phone-status-bar {
          font-size: calc(var(--phone-w) * 0.036) !important;
          padding: 0 calc(var(--phone-w) * 0.03) !important;
        }
        .phone-status-bar svg {
          width: calc(var(--phone-w) * 0.045) !important;
          height: calc(var(--phone-w) * 0.036) !important;
        }
        .phone-mockup-time {
          margin-top: calc(var(--phone-w) * 0.042) !important;
        }
        .phone-mockup-time h2 {
          font-size: calc(var(--phone-w) * 0.15) !important;
        }
        .phone-mockup-time p {
          font-size: calc(var(--phone-w) * 0.042) !important;
          margin-top: calc(var(--phone-w) * 0.012) !important;
        }
        .phone-mockup-shortcut {
          width: calc(var(--phone-w) * 0.115) !important;
          height: calc(var(--phone-w) * 0.115) !important;
        }
        .phone-mockup-shortcut svg {
          width: calc(var(--phone-w) * 0.048) !important;
          height: calc(var(--phone-w) * 0.048) !important;
        }
        .phone-mockup-bar {
          width: calc(var(--phone-w) * 0.3) !important;
          height: calc(var(--phone-w) * 0.012) !important;
          bottom: calc(var(--phone-w) * 0.024) !important;
        }
        .mockup-bg-blur {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          filter: blur(24px) brightness(0.65) !important;
          transform: scale(1.15) !important;
          z-index: 1 !important;
          pointer-events: none;
        }
        .mockup-fg-image {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 2 !important;
          pointer-events: none;
        }

        .related-section {
          padding: 32px 24px 64px 24px;
          border-top: 1px solid var(--glass-border);
          background: rgba(0, 0, 0, 0.15);
        }
        .related-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-primary);
          letter-spacing: 0.5px;
        }
        .related-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(4, 1fr);
        }
        .related-grid.portrait {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 992px) {
          .related-grid, .related-grid.portrait {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .related-grid, .related-grid.portrait {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .related-grid, .related-grid.portrait {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .see-more-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 36px;
          width: 100%;
        }
        .see-more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 48px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          border: 2px solid rgba(168, 85, 247, 0.3);
          color: white;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          outline: none;
        }
        .see-more-btn:hover {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.35);
          transform: translateY(-2.5px);
        }
        .see-more-btn:active {
          transform: scale(0.96) translateY(0);
          transition: transform 0.1s;
        }
        .see-more-btn:focus-visible {
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.4);
        }
        .see-more-arrow {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-size: 1.2rem;
        }
        .see-more-btn:hover .see-more-arrow {
          transform: translateX(6px);
        }
        
        [data-theme='light'] .see-more-btn {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%);
          border-color: rgba(124, 58, 237, 0.25);
          color: var(--accent-purple);
        }
        [data-theme='light'] .see-more-btn:hover {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          border-color: transparent;
          color: white;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.35);
        }

        .desktop-view-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .phone-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0 10px;
          letter-spacing: 0.2px;
        }
        .status-icons {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .desktop-file-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
          cursor: pointer;
        }
        .preview-footer {
          padding: 10px 24px;
          border-top: 1px solid var(--glass-border);
          background: rgba(7, 7, 10, 0.4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .photographer-credit {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .photographer-credit a {
          color: var(--accent-cyan);
          text-decoration: none;
          font-weight: 600;
        }
        .photographer-credit a:hover {
          text-decoration: underline;
          color: var(--accent-purple);
        }
        .original-resolution {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .res-buttons-group {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .res-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 160px;
          height: 56px;
          box-sizing: border-box;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          cursor: pointer;
          outline: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .res-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          color: var(--text-primary);
          border-color: var(--glass-border-hover);
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .res-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.4);
          border-color: var(--accent-purple);
        }
        .res-btn:active {
          transform: scale(0.96) translateY(0);
          transition: transform 0.1s;
        }
        .res-btn.active {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(168, 85, 247, 0.35);
          transform: translateY(0);
        }
        .res-btn.active:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(168, 85, 247, 0.45);
        }
        .res-btn-label {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }
        .res-btn-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-weight: 500;
          transition: color 0.2s ease;
          line-height: 1.1;
        }
        .res-btn.active .res-btn-desc {
          color: rgba(255, 255, 255, 0.85);
        }
        [data-theme='light'] .res-btn {
          background: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.08);
          color: var(--text-secondary);
        }
        [data-theme='light'] .res-btn:hover {
          background: rgba(0, 0, 0, 0.06);
          color: var(--text-primary);
          border-color: rgba(0, 0, 0, 0.16);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        [data-theme='light'] .res-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.4);
          border-color: var(--accent-purple);
        }
        [data-theme='light'] .res-btn.active {
          background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-purple) 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35);
        }

        @media (max-width: 992px) {
          /* Responsive sizing handled natively by fluid CSS variables */
        }

        @media (max-width: 768px) {
          .preview-modal-content {
            height: 95vh;
            max-height: none;
          }
          .device-canvas {
            padding: 16px 10px;
            min-height: auto !important;
          }
          .preview-footer {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 12px;
          }
        }

        @media (max-width: 580px) {
          .preview-top-bar {
            flex-direction: column;
            gap: 12px;
            padding: 12px 16px;
            align-items: center;
          }
          .modal-right-actions {
            width: 100%;
            justify-content: center;
            gap: 8px;
          }
          .device-switcher-pills {
            width: 100%;
            justify-content: center;
          }
          .switch-pill {
            flex: 1;
            justify-content: center;
          }
          .res-buttons-group {
            width: 100%;
            display: flex;
            gap: 8px;
          }
          .res-btn {
            flex: 1;
            width: auto;
            min-width: 0;
            height: 52px;
            padding: 8px 8px;
          }
        }

        @media (max-width: 480px) {
          .preview-modal-content {
            height: 98vh;
            width: 98vw;
            border-radius: var(--radius-md);
          }
          .device-canvas {
            min-height: auto !important;
            padding: 12px 6px;
          }
          .desktop-mockup-dock {
            display: none;
          }
          .preview-footer {
            padding: 8px;
            gap: 8px;
          }
          .download-res-selector {
            width: 100%;
            justify-content: center;
          }
          .res-buttons-group {
            width: 100%;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}
