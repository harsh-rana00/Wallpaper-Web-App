import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'All', 'Minimalist', 'Cyberpunk', 'Space', 'Nature', 'Abstract', 'City', 'Anime', 'Aesthetic',
  'Vaporwave', '3D Renders', 'Macro', 'Architecture', 'Ocean', 'Forest', 'Retro',
  'Animals', 'Dark', 'Neon', 'Mountains', 'Cars', 'Cyber', 'Futuristic',
  'Synthwave', 'Sunset', 'Lo-Fi', 'Cybernetic', 'Galactic', 'Minimal', 'Urban',
  'Texture', 'Art', 'Landscape', 'Cyberpunk City', 'Cosmic', 'Floral', 'Vintage', 'Sci-Fi'
];

export default function AccountTab({ 
  currentUser, 
  onUpdateUser, 
  settingsBox, 
  favoritesCount,
  theme,
  onToggleTheme,
  onBack
}) {
  // Profile form state
  const [username, setUsername] = useState(currentUser.username || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [bio, setBio] = useState('');
  
  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference state
  const [defaultOrientation, setDefaultOrientation] = useState('landscape');
  const [defaultCategory, setDefaultCategory] = useState('All');

  // Messages state
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

  // Load biography and preferences from database on mount
  useEffect(() => {
    async function loadAccountDetails() {
      if (settingsBox) {
        const savedBio = await settingsBox.get('user_bio');
        if (savedBio) setBio(savedBio);

        const savedAccount = await settingsBox.get('user_account');
        if (savedAccount) {
          setUsername(savedAccount.username || currentUser.username);
          setEmail(savedAccount.email || currentUser.email);
        }

        const savedOrientation = await settingsBox.get('pref_orientation');
        if (savedOrientation) {
          setDefaultOrientation(savedOrientation);
        }

        const savedCategory = await settingsBox.get('pref_category');
        if (savedCategory) {
          setDefaultCategory(savedCategory);
        }
      }
    }
    loadAccountDetails();
  }, [settingsBox, currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!username.trim() || !email.trim()) {
      setProfileMsg({ type: 'error', text: 'Username and Email are required fields.' });
      return;
    }

    try {
      // 1. Get saved account details
      const savedAccount = await settingsBox.get('user_account') || {};
      const updatedAccount = {
        ...savedAccount,
        username: username.trim(),
        email: email.trim()
      };

      // 2. Write to settings_box
      await settingsBox.put('user_account', updatedAccount);
      await settingsBox.put('user_bio', bio.trim());
      await settingsBox.put('current_user', { username: username.trim(), email: email.trim() });
      await settingsBox.put('pref_orientation', defaultOrientation);
      await settingsBox.put('pref_category', defaultCategory);

      // 3. Update app context
      onUpdateUser({ username: username.trim(), email: email.trim() });

      setProfileMsg({ type: 'success', text: 'Profile changes saved successfully!' });
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Failed to update profile settings:', err);
      setProfileMsg({ type: 'error', text: 'Error saving changes. Try again.' });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecurityMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'Please fill in all security fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      const savedAccount = await settingsBox.get('user_account');
      
      // If no account exists (signed in as guest) or password verification fails
      const currentSavedPass = savedAccount ? savedAccount.password : 'password'; // 'password' is default dev pass

      if (currentPassword !== currentSavedPass) {
        setSecurityMsg({ type: 'error', text: 'Incorrect current password.' });
        return;
      }

      // Update password in user_account credentials
      const updatedAccount = {
        ...(savedAccount || { username: currentUser.username, email: currentUser.email }),
        password: newPassword
      };

      await settingsBox.put('user_account', updatedAccount);
      
      setSecurityMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSecurityMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Failed to update credentials:', err);
      setSecurityMsg({ type: 'error', text: 'Error updating password. Try again.' });
    }
  };

  return (
    <div className="account-tab animate-fade" style={{ maxWidth: 'var(--max-width)', margin: '32px auto', padding: '0 24px' }}>
      
      {/* Back button */}
      <div className="back-button-container" style={{ marginBottom: '24px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
          style={{ 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)', 
            color: 'var(--text-primary)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '8px 18px',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          ← Back to Wallpapers
        </button>
      </div>

      {/* Intro Dashboard Info */}
      <div className="account-hero glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="user-avatar gradient-bg font-display" style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: 'white', boxShadow: 'var(--neon-purple-shadow)' }}>
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: '800' }}>{username}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{email}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', fontStyle: bio ? 'normal' : 'italic' }}>
            {bio || '"Add a brief biography to complete your AeroHub account."'}
          </p>
        </div>
        
        {/* Quick Diagnostics */}
        <div className="account-stats-row" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="stat-pill">
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Favorites</span>
            <strong className="font-display" style={{ fontSize: '1.6rem', color: 'var(--accent-pink)' }}>{favoritesCount}</strong>
          </div>
          <div className="stat-pill">
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Active Theme</span>
            <strong className="font-display" style={{ fontSize: '1.2rem', color: 'var(--accent-purple)', display: 'block', marginTop: '6px', textTransform: 'capitalize' }}>{theme} Mode</strong>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="account-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Card 1: Profile Settings */}
        <div className="glass-panel profile-settings-card">
          <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            👤 Profile Information
          </h3>

          {profileMsg.text && (
            <div style={{
              background: profileMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: profileMsg.type === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
              color: profileMsg.type === 'success' ? 'var(--income-green)' : 'var(--expense-red)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label" htmlFor="acc-username">Username</label>
              <input
                id="acc-username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="acc-email">Email Address</label>
              <input
                id="acc-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="acc-bio">Biography</label>
              <textarea
                id="acc-bio"
                className="form-input"
                rows="3"
                placeholder="Write a brief tagline about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ resize: 'none', width: '100%', minHeight: '80px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" htmlFor="acc-orientation">Preferred Wallpaper Orientation</label>
              <select
                id="acc-orientation"
                className="form-input"
                value={defaultOrientation}
                onChange={(e) => setDefaultOrientation(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="landscape">Landscape (Desktop Monitor aspect-ratio)</option>
                <option value="portrait">Portrait (Smartphone Screen aspect-ratio)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" htmlFor="acc-category">Preferred Wallpaper Category</label>
              <select
                id="acc-category"
                className="form-input"
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Card 2: Security & Password */}
        <div className="glass-panel security-settings-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔒 Security & Password
            </h3>

            {securityMsg.text && (
              <div style={{
                background: securityMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: securityMsg.type === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                color: securityMsg.type === 'success' ? 'var(--income-green)' : 'var(--expense-red)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {securityMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="sec-current-pass">Current Password</label>
                <input
                  id="sec-current-pass"
                  type="password"
                  className="form-input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sec-new-pass">New Password</label>
                <input
                  id="sec-new-pass"
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label" htmlFor="sec-confirm-pass">Confirm New Password</label>
                <input
                  id="sec-confirm-pass"
                  type="password"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-purple) 100%)', boxShadow: 'none' }}>
                Change Password
              </button>
            </form>
          </div>

          {/* Quick preference toggles */}
          <div className="preferences-quick-row" style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyC: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>Visual Mode Selector</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick switch between Light / Dark interfaces</span>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={onToggleTheme}
                style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                {theme === 'dark' ? '☀️ Light Theme' : '🌙 Dark Theme'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
