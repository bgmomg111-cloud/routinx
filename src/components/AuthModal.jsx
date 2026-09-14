import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  RefreshCw,
  Key,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authInitialTab,
    loginAsGuest, 
    loginWithGoogle, 
    loginWithApple,
    loginWithEmail,
    signupWithEmail,
    syncGuestAccount,
    user,
    setIsPrivacyModalOpen 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup' | 'guest'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2FAPreference, setEnable2FAPreference] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (authInitialTab) {
      setActiveTab(authInitialTab);
    }
  }, [authInitialTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }
    setErrorMessage('');
    loginWithEmail(email, password);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    setErrorMessage('');
    if (user && user.isGuest) {
      // Sync the existing guest account into the registered profile!
      syncGuestAccount(name, email, 'email');
    } else {
      signupWithEmail(name, email, password);
    }
  };

  const handleSocialGoogle = () => {
    loginWithGoogle();
  };

  const handleSocialApple = () => {
    loginWithApple();
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div 
        className="modal-content auth-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '100%',
          borderRadius: '24px',
          background: 'var(--card-bg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(6,182,212,0.15)',
          border: '1px solid var(--card-border)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div 
          className="modal-header" 
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--card-border)',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(245,197,66,0.04) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#070f22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(245,197,66,0.35)',
              border: '1.5px solid rgba(245,197,66,0.6)',
              flexShrink: 0
            }}>
              <img
                src="/routinx_3d_clock_icon.jpg"
                alt="RoutinX 3D Icon"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {user && user.isGuest ? 'Upgrade & Sync Guest Account' : 'Welcome to RoutinX'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Daily Routines, Expenses & 3D Habit Streaks
              </p>
            </div>
          </div>
          <button onClick={() => setIsAuthModalOpen(false)} className="action-btn-sm">
            <X size={20} />
          </button>
        </div>

        {/* Guest Warning & Sync Notice if currently in Guest Mode */}
        {user && user.isGuest && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(6,182,212,0.08) 100%)',
            borderBottom: '1px solid rgba(245,158,11,0.25)',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.82rem',
            color: 'var(--text-main)'
          }}>
            <Sparkles size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span>
              <strong>Local Mode Active:</strong> Creating an account will automatically sync all your current expense & habit logs!
            </span>
          </div>
        )}

        {/* Tab Selection Bar (Sign In / Create Account / Guest) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: '0.5rem 1.5rem 0',
          gap: '0.5rem',
          borderBottom: '1px solid var(--card-border)'
        }}>
          <button
            onClick={() => { setActiveTab('signin'); setErrorMessage(''); }}
            style={{
              padding: '0.75rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              borderBottom: activeTab === 'signin' ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
              color: activeTab === 'signin' ? 'var(--accent-primary)' : 'var(--text-muted)',
              background: 'transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
            style={{
              padding: '0.75rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              borderBottom: activeTab === 'signup' ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
              color: activeTab === 'signup' ? 'var(--accent-primary)' : 'var(--text-muted)',
              background: 'transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          
          {errorMessage && (
            <div style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Social Sign In Buttons: Google & Apple */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            
            {/* Google Sign-In Button */}
            <button 
              className="google-auth-btn" 
              onClick={handleSocialGoogle}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Apple Sign-In Button */}
            <button 
              onClick={handleSocialApple}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: '#000000',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.9.04-2.02.6-2.66 1.35-.57.65-.99 1.71-.93 2.76 1.01.08 1.96-.49 2.58-1.24z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
            <span style={{ padding: '0 0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR USE EMAIL</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
          </div>

          {/* Form Content Based on Tab */}
          {activeTab === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  marginTop: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Sign In to RoutinX</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Create Account Form */
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="alex.explorer@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enable2FAPreference}
                  onChange={(e) => setEnable2FAPreference(e.target.checked)}
                />
                <span>Enable 2FA Protection & Biometric Verification</span>
              </label>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  marginTop: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}
              >
                <span>{user && user.isGuest ? 'Sync & Finalize Account' : 'Create Secure Account'}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}

          {/* Prominent Guest Account Access Card with Local Storage & Privacy Notice */}
          {(!user || !user.isGuest) && (
            <div style={{ marginTop: '1.25rem' }}>
              <div 
                onClick={loginAsGuest}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(245,197,66,0.05) 100%)',
                  border: '1.5px dashed rgba(6,182,212,0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      Continue as Guest (1-Click Instant)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      🔒 100% Private: Stored locally on this device • Sync anytime later
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4', background: 'rgba(6,182,212,0.15)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  Guest
                </span>
              </div>
            </div>
          )}

          {/* Privacy Policy & Security Architecture Footer Link */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#06b6d4',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0
              }}
            >
              <ShieldCheck size={14} />
              <span>Read Privacy Policy & Security Architecture</span>
            </button>

            <span>AES-256 Client Vault</span>
          </div>

        </div>
      </div>
    </div>
  );
};
