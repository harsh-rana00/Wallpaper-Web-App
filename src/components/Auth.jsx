import React, { useState } from 'react';
import { LogoIcon } from './Icons';


export default function Auth({ settingsBox, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      if (isLogin) {
        // Retrieve credentials from Hive Box
        const savedAccount = await settingsBox.get('user_account');
        
        // Mock default login for developer testing
        const isDefaultDev = username === 'admin' && password === 'password';
        
        if (isDefaultDev || (savedAccount && savedAccount.username === username && savedAccount.password === password)) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            onAuthSuccess({ 
              username: isDefaultDev ? 'Developer' : username, 
              email: isDefaultDev ? 'dev@aerohub.com' : savedAccount.email 
            });
          }, 800);
        } else {
          setError('Invalid username or password. Try username "admin" and password "password".');
        }
      } else {
        // Sign Up
        const newAccount = {
          username: username.trim(),
          email: email.trim(),
          password
        };

        // Save credentials to settings_box in IndexedDB
        await settingsBox.put('user_account', newAccount);
        
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(() => {
          onAuthSuccess({ username: newAccount.username, email: newAccount.email });
        }, 1000);
      }
    } catch (err) {
      console.error('Auth operation failed:', err);
      setError('An error occurred during authentication. Please try again.');
    }
  };

  const handleGuestMode = () => {
    onAuthSuccess({ username: 'Guest User', email: 'guest@aerohub.com' });
  };

  return (
    <div className="auth-wrapper animate-fade">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <LogoIcon size={42} className="auth-logo-svg" style={{ margin: '0 auto 12px auto', display: 'block', filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.35))' }} />
          <h2 className="auth-logo-text font-display">AeroHub</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to access your dashboard' : 'Create your workspace account'}
          </p>
        </div>

        {error && <div className="error-banner" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--expense-red)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
        {success && <div className="success-banner" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--income-green)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              type="text"
              className="form-input"
              placeholder="Enter username (e.g. admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="Enter password (e.g. password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <button type="button" className="btn btn-guest" onClick={handleGuestMode}>
            Continue as Guest
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <>
              Don't have an account? 
              <button className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { setIsLogin(false); setError(''); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account? 
              <button className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { setIsLogin(true); setError(''); }}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Decorative glows */}
      <div className="accent-bg glow-purple" style={{ opacity: 0.1, width: '50vw', height: '50vw', position: 'absolute', top: '-10%', left: '-10%', filter: 'blur(150px)', borderRadius: '50%', background: 'var(--accent-purple)', pointerEvents: 'none', zIndex: -1 }}></div>
      <div className="accent-bg glow-cyan" style={{ opacity: 0.1, width: '50vw', height: '50vw', position: 'absolute', bottom: '-10%', right: '-10%', filter: 'blur(150px)', borderRadius: '50%', background: 'var(--accent-cyan)', pointerEvents: 'none', zIndex: -1 }}></div>
    </div>
  );
}
