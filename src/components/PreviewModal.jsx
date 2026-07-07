import React, { useState, useEffect } from 'react';
import { CloseIcon, DownloadIcon, HeartIcon, MonitorIcon, SmartphoneIcon } from './Icons';

export default function PreviewModal({ isOpen, onClose, wallpaper, isFavorite, onToggleFavorite }) {
  const [previewDevice, setPreviewDevice] = useState('phone'); // 'phone' or 'desktop'
  const [timeState, setTimeState] = useState({ time: '09:41', date: 'Tuesday, July 7' });
  const [selectedRes, setSelectedRes] = useState('original');

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

  // Determine initial layout preview on load based on image aspect ratio
  useEffect(() => {
    if (isOpen && wallpaper) {
      if (wallpaper.width && wallpaper.height) {
        setPreviewDevice(wallpaper.width > wallpaper.height ? 'desktop' : 'phone');
      }
    }
  }, [isOpen, wallpaper]);

  if (!isOpen || !wallpaper) return null;

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
      return `${baseUrl}?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;
    }

    return url;
  };

  const isPortrait = previewDevice === 'phone';
  const baseSrc = isPortrait 
    ? (wallpaper.src.portrait || wallpaper.src.large2x || wallpaper.src.original)
    : (wallpaper.src.landscape || wallpaper.src.original || wallpaper.src.large2x);

  const displaySrc = getResizedUrl(baseSrc, selectedRes, isPortrait);

  const downloadUrl = wallpaper.src.original || displaySrc;

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

        {/* Device Canvas Area */}
        <div className="device-canvas">
          <div className="device-container">
            {previewDevice === 'phone' ? (
              // High Fidelity Phone Mockup
              <div 
                className="phone-mockup" 
                style={{ backgroundImage: `url(${displaySrc})` }}
              >
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
                  style={{ backgroundImage: `url(${displaySrc})` }}
                >
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
          
          <div className="download-res-selector" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resolution:</span>
            <select 
              value={selectedRes} 
              onChange={(e) => setSelectedRes(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="original">Original ({wallpaper.width}x{wallpaper.height})</option>
              <option value="4k">4K UHD ({previewDevice === 'phone' ? '2160x3840' : '3840x2160'})</option>
              <option value="2k">2K QHD ({previewDevice === 'phone' ? '1440x2560' : '2560x1440'})</option>
              <option value="1080p">1080p FHD ({previewDevice === 'phone' ? '1080x1920' : '1920x1080'})</option>
            </select>

            <button className="btn btn-primary" onClick={handleDownload} style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <DownloadIcon size={16} />
              <span>Download</span>
            </button>
          </div>
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
          width: 100%;
          max-width: 840px;
          height: 90vh;
          max-height: 740px;
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
          padding: 20px 24px;
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
          transition: all 0.2s ease;
        }
        .action-btn-circle:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }
        .action-btn-circle.active {
          color: var(--accent-pink);
          border-color: rgba(236, 72, 153, 0.4);
          background: rgba(236, 72, 153, 0.15);
        }
        .action-btn-circle.close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border-color: var(--error);
        }
        .device-canvas {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          padding: 30px;
          overflow: hidden;
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
          padding: 16px 24px;
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

        @media (max-width: 768px) {
          .preview-modal-content {
            height: 95vh;
            max-height: none;
          }
          .device-canvas {
            padding: 10px;
          }
          .desktop-mockup {
            width: 320px;
            height: 190px;
            border-width: 8px;
            border-bottom-width: 14px;
          }
          .desktop-mockup-stand {
            width: 70px;
            height: 40px;
          }
          .desktop-mockup-base {
            width: 120px;
            height: 5px;
          }
          .desktop-mockup-icon {
            width: 16px;
            height: 16px;
          }
          .desktop-mockup-dock {
            padding: 3px 6px;
            border-radius: 6px;
            gap: 4px;
          }
          .desktop-mockup-dock-item {
            width: 12px;
            height: 12px;
            border-radius: 3px;
          }
          .preview-footer {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 12px;
          }
        }
      `}} />
    </div>
  );
}
