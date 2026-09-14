import React from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  Droplet, 
  Dumbbell, 
  Target, 
  Users, 
  MessageSquare,
  Plus, 
  Settings, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  ChevronRight,
  ShieldCheck,
  Zap,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { 
    theme, 
    toggleTheme, 
    setIsQuickAddOpen, 
    setIsSettingsOpen, 
    waterLogs, 
    waterGoal, 
    habits, 
    selectedDate 
  } = useApp();
  const { user, setIsAuthModalOpen, openAuthWithTab, setIsPrivacyModalOpen, logout } = useAuth();

  // Metrics for badges
  const dateWaterLogs = waterLogs.filter(log => log.date === selectedDate);
  const totalWater = dateWaterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
  const waterPercent = Math.min(100, Math.round((totalWater / (waterGoal || 1)) * 100));

  const completedHabits = habits.filter(h => h.completedDates && h.completedDates.includes(selectedDate)).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Full Dashboard',
      icon: <LayoutDashboard size={20} />,
      color: '#38bdf8',
      badge: 'Home'
    },
    {
      id: 'finances',
      label: 'Finances & 2FA',
      icon: <PieChart size={20} />,
      color: '#f59e0b',
      badge: 'Secure'
    },
    {
      id: 'hydration',
      label: 'Hydration',
      icon: <Droplet size={20} />,
      color: '#06b6d4',
      badge: `${waterPercent}%`
    },
    {
      id: 'workouts',
      label: 'Workouts',
      icon: <Dumbbell size={20} />,
      color: '#8b5cf6',
      badge: 'Fitness'
    },
    {
      id: 'habits',
      label: 'Habit Streaks',
      icon: <Target size={20} />,
      color: '#ec4899',
      badge: `${completedHabits}/${habits.length}`
    },
    {
      id: 'community',
      label: 'Community Yoga',
      icon: <Users size={20} />,
      color: '#10b981',
      badge: 'Social'
    },
    {
      id: 'advice_chat',
      label: 'Community Help Chat',
      icon: <MessageSquare size={20} />,
      color: '#06b6d4',
      badge: 'Live QA'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}

      {/* Main Sidebar Container */}
      <aside 
        className={`sidebar-nav ${isOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'var(--card-bg)',
          backdropFilter: 'var(--glass-backdrop)',
          WebkitBackdropFilter: 'var(--glass-backdrop)',
          borderRight: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem',
          zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        {/* Top Header & Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', padding: '0.25rem 0.5rem' }}>
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
                boxShadow: '0 4px 18px rgba(245, 197, 66, 0.35), 0 0 10px rgba(6, 182, 212, 0.4)',
                border: '1.5px solid rgba(245, 197, 66, 0.6)',
                flexShrink: 0
              }}>
                <img 
                  src="/routinx_3d_clock_icon.jpg" 
                  alt="RoutinX 3D Clock Icon" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              <div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #38bdf8 50%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1
                }}>
                  ROUTINX
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  HEALTH • FINANCES • 3D
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              className="mobile-close-btn"
              onClick={onClose}
              style={{ display: 'none', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Action Add CTA Button */}
          <button 
            className="btn-primary" 
            onClick={() => {
              setIsQuickAddOpen(true);
              if (onClose) onClose();
            }}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
            }}
          >
            <Plus size={18} />
            <span>+ Quick Log Entry</span>
          </button>

          {/* Navigation Links Menu */}
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.6rem', paddingLeft: '0.5rem' }}>
            Main Menu
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--accent-primary-light)' : 'transparent',
                    border: '1px solid ' + (isActive ? 'var(--accent-primary)' : 'transparent'),
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: isActive ? 'var(--accent-primary)' : item.color, display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <span 
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)'
                    }}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Preferences */}
        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Quick Settings, Theme & Privacy Policy */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                className="action-btn-sm"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--card-border)',
                  color: theme === 'dark' ? '#f59e0b' : '#6366f1'
                }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button 
                className="action-btn-sm"
                onClick={() => setIsSettingsOpen(true)}
                title="Settings"
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-muted)'
                }}
              >
                <Settings size={18} />
              </button>

              <button 
                className="action-btn-sm"
                onClick={() => setIsPrivacyModalOpen(true)}
                title="Privacy Policy & Security"
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--card-border)',
                  color: '#10b981'
                }}
              >
                <ShieldCheck size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.04em' }}>
              AES-256 Vault
            </div>
          </div>

          {/* User Profile / Guest State / Sign In CTAs */}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--card-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: user.isGuest ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                      {user.isGuest ? '🔒 Local Guest' : '✓ Synced Account'}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  title="Sign out"
                  style={{ color: 'var(--text-muted)', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>

              {/* If in Guest Mode, prompt to sync / create account */}
              {user.isGuest && (
                <button
                  onClick={() => openAuthWithTab('signup')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.12) 100%)',
                    border: '1px solid rgba(6,182,212,0.35)',
                    color: '#06b6d4',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Sparkles size={13} />
                  <span>Sync & Save Account</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className="btn-primary"
                onClick={() => openAuthWithTab('signin')}
                style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', fontSize: '0.85rem' }}
              >
                <User size={15} />
                <span>Sign In / Register</span>
              </button>

              <button 
                onClick={() => openAuthWithTab('guest')}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🔒 Continue as Guest (Private)
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
