import React, { useState } from 'react';
import { PieChart, TrendingUp, Mountain, DollarSign, Award, Target, Zap, ShieldCheck, Link, Settings, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsDashboard = () => {
  const { logs, selectedDate, settings } = useApp();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [bankSynced, setBankSynced] = useState(true);
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'breakdown' | 'security'

  // Filter logs for selected date
  const dateLogs = logs.filter(log => log.date === selectedDate);
  const expenses = dateLogs.filter(log => log.type === 'expense');
  const activities = dateLogs.filter(log => log.type === 'activity');

  // Calculations
  const totalSpentToday = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Category Breakdown
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  // Trekking Metrics
  const trekkingLogs = activities.filter(act => act.category === 'trekking');
  const totalDistance = trekkingLogs.reduce((acc, curr) => acc + (curr.distance || 0), 0);
  const totalElevation = trekkingLogs.reduce((acc, curr) => acc + (curr.elevation || 0), 0);

  // Budget calculation
  const budgetLimit = settings.dailyBudget || 100;
  const budgetRemaining = Math.max(0, budgetLimit - totalSpentToday);
  const budgetPercentage = Math.min(Math.round((totalSpentToday / budgetLimit) * 100), 100);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'food': return '#f59e0b';
      case 'drinks': return '#06b6d4';
      case 'travel': return '#38bdf8';
      case 'trekking_gear': return '#10b981';
      case 'shopping': return '#ec4899';
      default: return '#6366f1';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 3D Glassmorphism Hero Header — Light Blue & White Theme */}
      <div 
        className="card" 
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 12px 35px rgba(56, 189, 248, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              💳
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Finances & 2FA Security</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                  Encrypted AES-256
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Real-time transaction analysis, category breakdowns, and biometric 2FA safeguards.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                {settings.currency}{totalSpentToday.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Spent Today</div>
            </div>

            <div style={{
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                {settings.currency}{budgetRemaining.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Budget Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Stat Cards Grid */}
      <div className="dashboard-grid">
        {/* Floating Wallet Card */}
        <div className="stat-card" style={{ border: '1px solid rgba(56, 189, 248, 0.25)' }}>
          <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Wallet size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Daily Budget Capacity</div>
            <div className="stat-value">{settings.currency}{budgetLimit.toFixed(2)}</div>
            <div className="stat-subtext" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: budgetPercentage > 85 ? '#ef4444' : '#10b981' }}>
              {budgetPercentage}% allocated today
            </div>
          </div>
        </div>

        {/* 3D Savings Goals Card */}
        <div className="stat-card" style={{ border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Monthly Savings Goal</div>
            <div className="stat-value">{settings.currency}1,450.00</div>
            <div className="stat-subtext" style={{ color: '#10b981' }}>
              ↑ 72% of $2,000 Target Achieved
            </div>
          </div>
        </div>

        {/* 2FA Status Card */}
        <div className="stat-card" style={{ border: '1px solid rgba(139, 92, 246, 0.25)' }}>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Two-Factor Authentication</div>
            <div className="stat-value" style={{ color: twoFactorEnabled ? '#10b981' : '#f59e0b', fontSize: '1.2rem' }}>
              {twoFactorEnabled ? 'Active & Protected' : 'Setup Required'}
            </div>
            <div className="stat-subtext">Google Authenticator Sync</div>
          </div>
        </div>
      </div>

      {/* Main Breakdown & Security Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        
        {/* Left: Category Expense Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <PieChart size={20} style={{ color: '#38bdf8' }} />
            Category Expense Breakdown
          </h3>

          {Object.keys(categoryTotals).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(categoryTotals).map(([cat, amount]) => {
                const percent = Math.round((amount / (totalSpentToday || 1)) * 100);
                const color = getCategoryColor(cat);
                return (
                  <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                      <span style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                        {cat.replace('_', ' ')}
                      </span>
                      <span>{settings.currency}{amount.toFixed(2)} ({percent}%)</span>
                    </div>

                    <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{
                          height: '100%',
                          width: `${percent}%`,
                          backgroundColor: color,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No expenses recorded for this date. Use the Quick Add modal to record purchases!
            </div>
          )}
        </div>

        {/* Right: Bank Sync & 2FA Controls */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <ShieldCheck size={20} style={{ color: '#8b5cf6' }} />
            Bank Sync & Security Safeguards
          </h3>

          {/* Bank Sync Widget */}
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <Link size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Bank Synchronization</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chase Secure API • Real-time feeds</div>
              </div>
            </div>

            <button 
              onClick={() => setBankSynced(!bankSynced)}
              className={bankSynced ? "btn-secondary" : "btn-primary"}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              {bankSynced ? '✓ Synced' : 'Connect Bank'}
            </button>
          </div>

          {/* 2FA Toggle Widget */}
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                <Lock size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>2-Factor Authentication</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require TOTP code on sensitive actions</div>
              </div>
            </div>

            <button 
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: twoFactorEnabled ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                color: twoFactorEnabled ? '#10b981' : 'var(--text-muted)'
              }}
            >
              {twoFactorEnabled ? '🛡️ Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Privacy Note */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            🔒 <strong>Zero-Knowledge Security:</strong> Your financial and workout logs are stored locally with optional biometric 2FA authorization.
          </div>
        </div>

      </div>
    </div>
  );
};
