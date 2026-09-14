import React from 'react';
import { 
  Menu, 
  Calendar, 
  Plus, 
  Sun, 
  Moon, 
  Settings, 
  User, 
  LogOut, 
  Sparkles, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  Lock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleSidebar, activeTabTitle, onReplayIntro }) => {
  const { 
    theme, 
    toggleTheme, 
    selectedDate, 
    setSelectedDate, 
    setIsQuickAddOpen, 
    setIsSettingsOpen, 
    setActiveTab,
    expenseRemindersEnabled,
    requestExpenseNotificationPermission,
    sendTestExpenseNotification
  } = useApp();

  const { 
    user, 
    openAuthWithTab, 
    setIsAuthModalOpen, 
    setIsPrivacyModalOpen, 
    logout 
  } = useAuth();

  return (
    <header 
      className="top-navbar" 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-backdrop)',
        WebkitBackdropFilter: 'var(--glass-backdrop)',
        borderBottom: '1px solid var(--card-border)',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all var(--transition-normal)'
      }}
    >
      {/* Left: Mobile Sidebar Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title="Toggle Navigation Menu"
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)'
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            {activeTabTitle || 'Full Dashboard'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ROUTINX PLATFORM
          </div>
        </div>
      </div>

      {/* Center / Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        
        {/* Guest Mode Visual Privacy & Sync Indicator Badge */}
        {user && user.isGuest ? (
          <div 
            onClick={() => openAuthWithTab('signup')}
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(245,197,66,0.1) 100%)',
              border: '1px solid rgba(6,182,212,0.35)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(6,182,212,0.15)'
            }}
            title="Your data is stored locally on this device. Click to sync with a permanent account."
          >
            <Lock size={13} color="#06b6d4" />
            <span>Guest (Local Only)</span>
            <span style={{ color: '#06b6d4', textDecoration: 'underline', marginLeft: '2px' }}>Sync Now</span>
          </div>
        ) : !user ? (
          <button
            onClick={() => openAuthWithTab('signin')}
            className="nav-btn hide-on-mobile"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', gap: '0.4rem' }}
          >
            <User size={15} />
            <span>Sign In / Guest</span>
          </button>
        ) : null}

        {/* Date Selector */}
        <div className="date-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)' }}>
          <Calendar size={16} style={{ color: 'var(--accent-primary)' }} />
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
          />
        </div>

        {/* Native Expense Reminder Notifications Button */}
        <button
          className="nav-btn"
          onClick={() => {
            if (!expenseRemindersEnabled) {
              requestExpenseNotificationPermission();
            } else {
              sendTestExpenseNotification();
            }
          }}
          title={expenseRemindersEnabled ? "Expense Reminders Active (Click to Test Native Alert)" : "Enable Native Daily Expense Logging Notifications"}
          style={{
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            background: expenseRemindersEnabled ? 'rgba(16,185,129,0.12)' : 'var(--bg-secondary)',
            border: '1px solid ' + (expenseRemindersEnabled ? '#10b981' : 'var(--card-border)'),
            color: expenseRemindersEnabled ? '#10b981' : 'var(--text-muted)'
          }}
        >
          <Bell size={16} />
          <span className="hide-on-mobile">{expenseRemindersEnabled ? 'Reminders On' : 'Remind Me'}</span>
        </button>

        {/* Quick Advice Chat Shortcut */}
        <button 
          className="nav-btn hide-on-mobile"
          onClick={() => setActiveTab('advice_chat')}
          title="Open Community Help Chat"
          style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <MessageSquare size={16} color="#06b6d4" />
          <span>Help Chat</span>
        </button>

        {/* Privacy Policy Shortcut */}
        <button
          className="nav-btn hide-on-mobile"
          onClick={() => setIsPrivacyModalOpen(true)}
          title="View Privacy Policy & Security Architecture"
          style={{ padding: '0.55rem', borderRadius: 'var(--radius-md)' }}
        >
          <ShieldCheck size={16} color="#10b981" />
        </button>

        {/* Replay 3D Startup Animation Button */}
        {onReplayIntro && (
          <button
            className="nav-btn hide-on-mobile"
            onClick={onReplayIntro}
            title="Replay 3D Startup Animation"
            style={{ padding: '0.55rem', borderRadius: 'var(--radius-md)' }}
          >
            <Sparkles size={16} color="#f5c542" />
          </button>
        )}

        {/* Quick Log CTA */}
        <button 
          className="btn-primary"
          onClick={() => setIsQuickAddOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}
        >
          <Plus size={16} />
          <span className="hide-on-mobile">Add Log</span>
        </button>

        {/* Theme Switcher */}
        <button 
          className="nav-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{ padding: '0.55rem', borderRadius: 'var(--radius-md)' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Settings button */}
        <button 
          className="nav-btn"
          onClick={() => setIsSettingsOpen(true)}
          title="Application Settings"
          style={{ padding: '0.55rem', borderRadius: 'var(--radius-md)' }}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
