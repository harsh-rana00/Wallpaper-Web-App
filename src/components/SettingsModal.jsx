import React, { useState, useEffect } from 'react';
import { getApiKey, setApiKey, hasApiKey } from '../services/pexels';
import { CloseIcon, ExternalLinkIcon, CheckIcon } from './Icons';

export default function SettingsModal({ isOpen, onClose, onKeySaved }) {
  const [apiKey, setApiKeyValue] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKeyValue(getApiKey());
      setIsSaved(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    
    if (cleanKey && cleanKey.length < 20) {
      setError('Please enter a valid Pexels API key (typically 56 characters).');
      return;
    }
    
    setApiKey(cleanKey);
    setIsSaved(true);
    setError('');
    
    if (onKeySaved) {
      onKeySaved(cleanKey);
    }
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKey('');
    setApiKeyValue('');
    setIsSaved(false);
    setError('');
    if (onKeySaved) {
      onKeySaved('');
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content glass-panel">
        <button className="modal-close" onClick={onClose} aria-label="Close settings">
          <CloseIcon size={24} />
        </button>
        
        <h2 className="modal-title font-display">API Configuration</h2>
        
        <p className="modal-description">
          AeroPaper connects directly to the <strong>Pexels API</strong> to fetch high-definition wallpapers. 
          To unlock the complete library, configure your free API Key below.
        </p>

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group">
            <label className="form-label" htmlFor="api-key-input">Pexels API Key</label>
            <input
              id="api-key-input"
              type="password"
              className="form-input"
              placeholder="Paste your Pexels API key here..."
              value={apiKey}
              onChange={(e) => {
                setApiKeyValue(e.target.value);
                setError('');
                setIsSaved(false);
              }}
            />
            {error && <span className="error-text">{error}</span>}
          </div>

          <div className="form-actions">
            {hasApiKey() && (
              <button type="button" className="btn btn-danger" onClick={handleClear}>
                Remove Key
              </button>
            )}
            <button 
              type="submit" 
              className={`btn gradient-btn ${isSaved ? 'btn-success' : ''}`}
              disabled={isSaved}
            >
              {isSaved ? (
                <>
                  <CheckIcon size={18} />
                  <span>Saved Successfully!</span>
                </>
              ) : 'Save API Key'}
            </button>
          </div>
        </form>

        <div className="onboarding-guide">
          <h3>How to get a free Pexels API Key?</h3>
          <ol>
            <li>
              Sign up or log in to <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer">Pexels <ExternalLinkIcon /></a>.
            </li>
            <li>
              Go to the <a href="https://www.pexels.com/api/new/" target="_blank" rel="noopener noreferrer">Pexels API Documentation <ExternalLinkIcon /></a>.
            </li>
            <li>
              Request an API key (it is approved instantly for personal use!).
            </li>
            <li>
              Copy the key and paste it in the field above.
            </li>
          </ol>
          <div className="onboarding-disclaimer">
            Your API key is saved directly in your browser's local storage and is only used to query Pexels directly. No data is sent to external servers.
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(4, 4, 6, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(12px);
        }
        .modal-content {
          width: 100%;
          max-width: 520px;
          border-radius: var(--radius-lg);
          padding: 40px;
          position: relative;
          color: var(--text-primary);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), var(--neon-purple-shadow);
          border: 1px solid var(--glass-border);
        }
        .modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .modal-close:hover {
          color: var(--accent-pink);
          transform: rotate(90deg);
        }
        .modal-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .modal-description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .settings-form {
          margin-bottom: 28px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        .form-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          color: white;
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent-purple);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
        }
        .error-text {
          color: var(--error);
          font-size: 0.8rem;
          display: block;
          margin-top: 6px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn {
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-danger {
          background: transparent;
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
        }
        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border-color: var(--error);
        }
        .btn-success {
          background: var(--success);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .onboarding-guide {
          border-top: 1px solid var(--glass-border);
          padding-top: 20px;
        }
        .onboarding-guide h3 {
          font-family: var(--font-display);
          font-size: 0.95rem;
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        .onboarding-guide ol {
          padding-left: 18px;
          margin-bottom: 16px;
        }
        .onboarding-guide li {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 6px;
        }
        .onboarding-guide a {
          color: var(--accent-cyan);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .onboarding-guide a:hover {
          text-decoration: underline;
          color: var(--accent-purple);
        }
        .onboarding-disclaimer {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}} />
    </div>
  );
}
