import React from 'react';
import { 
  DollarSign, Droplet, Dumbbell, Target, Sparkles, Plus, 
  TrendingUp, ArrowRight, Flame, ShieldCheck, Mountain, Users, Clock, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { TrekkingHighlightCard } from './TrekkingHighlightCard';

export const HomeOverview = ({ onNavigate }) => {
  const { 
    logs, 
    waterLogs, 
    waterGoal, 
    waterUnit, 
    addWaterEntry,
    workoutLogs, 
    habits, 
    toggleHabitCompletion,
    settings, 
    selectedDate,
    setIsQuickAddOpen,
    expenseRemindersEnabled,
    requestExpenseNotificationPermission,
    sendTestExpenseNotification
  } = useApp();
  const { user, openAuthWithTab, setIsPrivacyModalOpen } = useAuth();

  // Filter for selected date
  const dateLogs = logs.filter(log => log.date === selectedDate);
  const expenses = dateLogs.filter(log => log.type === 'expense');
  const dateWaterLogs = waterLogs.filter(log => log.date === selectedDate);
  const dateWorkouts = workoutLogs.filter(log => log.date === selectedDate);

  // Stats
  const totalSpentToday = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetLimit = settings.dailyBudget || 100;
  const budgetRemaining = Math.max(0, budgetLimit - totalSpentToday);
  const budgetPercentage = Math.min(Math.round((totalSpentToday / budgetLimit) * 100), 100);

  const totalWaterToday = dateWaterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
  const isOz = waterUnit === 'oz';
  const waterPercent = Math.min(Math.round((totalWaterToday / (waterGoal || 1)) * 100), 100);

  const totalCalories = dateWorkouts.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const totalWorkoutMins = dateWorkouts.reduce((acc, curr) => acc + (curr.duration || 0), 0);

  const completedHabitsCount = habits.filter(h => h.completedDates && h.completedDates.includes(selectedDate)).length;
  const totalHabitsCount = habits.length;
  const habitsPercent = totalHabitsCount > 0 ? Math.round((completedHabitsCount / totalHabitsCount) * 100) : 0;

  // Dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const userName = user ? user.name.split(' ')[0] : 'Explorer';

  return (
    <div className="overview-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome Banner */}
      <div 
        className="card hero-banner" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.12) 50%, rgba(236, 72, 153, 0.08) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', fontSize: '0.8rem', fontWeight: 600, color: '#06b6d4', marginBottom: '0.8rem' }}>
              <Sparkles size={14} /> Daily Overview & Live Metrics
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {greeting}, <span style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #38bdf8 50%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{userName}</span>! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Here is your synchronized snapshot for <strong style={{ color: 'var(--text-main)' }}>{selectedDate}</strong>. All modules are tracking your expenses, hydration goals, and workout consistency.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={() => setIsQuickAddOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}
            >
              <Plus size={18} />
              <span>Quick Log</span>
            </button>
            
            <button 
              className="nav-btn"
              onClick={() => onNavigate('hydration')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}
            >
              <Droplet size={16} color="#06b6d4" />
              <span>Hydrate (+250ml)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guest Privacy & Cloud Sync Banner (Visible when user is in Guest Mode) */}
      {user && user.isGuest && (
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(245, 197, 66, 0.08) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.2)',
              color: '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Private Guest Account (100% Zero-Knowledge)</span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 800 }}>
                  Stored Locally
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Your financial transactions & habits stay strictly on this device. Create or connect an account anytime to sync seamlessly across devices.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => openAuthWithTab('signup')}
              className="btn-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Sparkles size={14} />
              <span>Sync Account Now</span>
            </button>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="nav-btn"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
            >
              Privacy Details
            </button>
          </div>
        </div>
      )}

      {/* Native Expense Reminders Prompt Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.06) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Native Expense Logging Notifications
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {expenseRemindersEnabled 
                ? '✓ Native daily notifications active: You will receive automated check-in alerts to log food, drink, and travel costs.'
                : 'Turn on browser notifications to get timely daily reminders after meals and commute to keep your expenses up to date.'
              }
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => {
              if (!expenseRemindersEnabled) {
                requestExpenseNotificationPermission();
              } else {
                sendTestExpenseNotification();
              }
            }}
            className={expenseRemindersEnabled ? "nav-btn" : "btn-primary"}
            style={{
              padding: '0.55rem 1rem',
              fontSize: '0.82rem',
              background: expenseRemindersEnabled ? 'rgba(16, 185, 129, 0.15)' : undefined,
              color: expenseRemindersEnabled ? '#10b981' : undefined,
              borderColor: expenseRemindersEnabled ? '#10b981' : undefined
            }}
          >
            {expenseRemindersEnabled ? '🔔 Test Native Alert' : '🔔 Enable Reminders'}
          </button>
        </div>
      </div>

      {/* 4 Core Metrics Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
        
        {/* Metric 1: Finances */}
        <div 
          className="card stat-widget"
          onClick={() => onNavigate('finances')}
          style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-food-bg)', color: '#f59e0b', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <DollarSign size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: budgetPercentage > 90 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: budgetPercentage > 90 ? '#ef4444' : '#10b981' }}>
              {budgetPercentage}% of Budget
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Spending</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.2rem 0 0.5rem' }}>
            {settings.currency}{totalSpentToday.toFixed(2)}
          </div>
          
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.6rem' }}>
            <div style={{ width: `${budgetPercentage}%`, height: '100%', background: budgetPercentage > 90 ? 'var(--accent-danger)' : '#f59e0b', transition: 'width 0.4s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>{settings.currency}{budgetRemaining.toFixed(2)} remaining</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Metric 2: Hydration */}
        <div 
          className="card stat-widget"
          onClick={() => onNavigate('hydration')}
          style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-drink-bg)', color: '#06b6d4', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Droplet size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              {waterPercent}% Reached
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hydration Goal</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.2rem 0 0.5rem' }}>
            {isOz ? (totalWaterToday * 0.033814).toFixed(1) : totalWaterToday} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {isOz ? (waterGoal * 0.033814).toFixed(0) : waterGoal} {waterUnit}</span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.6rem' }}>
            <div style={{ width: `${waterPercent}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)', transition: 'width 0.4s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>{dateWaterLogs.length} sips logged</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Metric 3: Workouts */}
        <div 
          className="card stat-widget"
          onClick={() => onNavigate('workouts')}
          style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-fitness-bg)', color: '#8b5cf6', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Dumbbell size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              {dateWorkouts.length} Session(s)
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calories & Fitness</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.2rem 0 0.5rem' }}>
            {totalCalories} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kcal</span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.6rem' }}>
            <div style={{ width: `${Math.min(100, (totalCalories / 500) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)', transition: 'width 0.4s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>{totalWorkoutMins} mins active time</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Metric 4: Habit Streaks */}
        <div 
          className="card stat-widget"
          onClick={() => onNavigate('habits')}
          style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-shopping-bg)', color: '#ec4899', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Target size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Flame size={12} /> {habits.reduce((max, h) => Math.max(max, h.streak || 0), 0)}d Top Streak
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Habit Consistency</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.2rem 0 0.5rem' }}>
            {completedHabitsCount} / {totalHabitsCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Done</span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.6rem' }}>
            <div style={{ width: `${habitsPercent}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899 0%, #10b981 100%)', transition: 'width 0.4s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>{habitsPercent}% completion rate</span>
            <ChevronRight size={14} />
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* Left Column: Today's Activity & Spending Feed */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--accent-primary)" />
                Today's Activity Stream
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expenses, drinks, workouts, and adventures</p>
            </div>
            <button 
              className="nav-btn" 
              onClick={() => onNavigate('habits')}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Full Timeline
            </button>
          </div>

          {dateLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {dateLogs.slice(0, 5).map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--card-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      background: item.type === 'expense' ? 'var(--accent-food-bg)' : 'var(--accent-trekking-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.type === 'expense' ? '#f59e0b' : '#10b981'
                    }}>
                      {item.type === 'expense' ? <DollarSign size={18} /> : <Mountain size={18} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time} • {item.category}</div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '1rem', color: item.type === 'expense' ? 'var(--text-main)' : '#10b981' }}>
                    {item.type === 'expense' ? `-${settings.currency}${item.amount.toFixed(2)}` : (item.difficulty || 'Active')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No entries logged for today yet</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Use Quick Log or tap any module to add entries.</p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Interactive Modules & Community Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Quick Habit Checkmarks Widget */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} color="#ec4899" />
                  Quick Habit Check-In
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1-Click Streak Logging</span>
              </div>
              <button 
                className="nav-btn" 
                onClick={() => onNavigate('habits')}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
              >
                Manage
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {habits.slice(0, 3).map(habit => {
                const isDone = habit.completedDates && habit.completedDates.includes(selectedDate);
                return (
                  <div 
                    key={habit.id}
                    onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.95rem',
                      borderRadius: 'var(--radius-md)',
                      background: isDone ? 'var(--accent-primary-light)' : 'var(--bg-primary)',
                      border: '1px solid ' + (isDone ? 'var(--accent-primary)' : 'var(--card-border)'),
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <CheckCircle2 size={18} style={{ color: isDone ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-main)' }}>
                        {habit.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Flame size={12} /> {habit.streak || 0}d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trekking Highlight Card Component */}
          <TrekkingHighlightCard />

          {/* Community Yoga Spotlight */}
          <div 
            className="card" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#10b981" />
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Community Spotlight</span>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                Trending
              </span>
            </div>
            
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.3rem' }}>Morning Vinyasa Flow (30 Mins)</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Created by @YogaMaster99 • Boost flexibility, mindfulness, and morning focus.
            </p>
            
            <button 
              className="btn-primary" 
              onClick={() => onNavigate('community')}
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <span>Explore Community Routines</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
