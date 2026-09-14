import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Plus, 
  Award, 
  Trash2, 
  Bell, 
  Sparkles, 
  Calendar as CalendarIcon, 
  ChevronRight,
  TrendingUp,
  Zap,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HabitTracker = () => {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit, selectedDate } = useApp();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Wellness');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    addHabit({
      title: newHabitTitle.trim(),
      category: newHabitCategory
    });

    setNewHabitTitle('');
  };

  const requestNotifications = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('Routinix Habit Streaks Active 🔥', {
          body: "You'll receive periodic reminders to complete your wellness and hydration streaks.",
          icon: '/routinix_3d_monogram.jpg'
        });
      }
    });
  };

  // Calculate completion percentage for selected date
  const completedTodayCount = habits.filter(h => h.completedDates && h.completedDates.includes(selectedDate)).length;
  const totalHabitsCount = habits.length;
  const completionPercentage = totalHabitsCount > 0 ? Math.round((completedTodayCount / totalHabitsCount) * 100) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  const filteredHabits = habits.filter(h => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Completed') return h.completedDates && h.completedDates.includes(selectedDate);
    if (selectedFilter === 'Pending') return !h.completedDates || !h.completedDates.includes(selectedDate);
    return h.category === selectedFilter;
  });

  // Circular Progress calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 3D Habit Streak Hero Banner — Soothing Green & White Glassmorphism */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(52, 211, 153, 0.06) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '28px',
          padding: '2rem',
          boxShadow: '0 16px 40px rgba(16, 185, 129, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glowing Background Aura */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            
            {/* 3D Glowing Streak Flame Icon Badge */}
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.35)',
              fontSize: '2.4rem'
            }}>
              🔥
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Habit & Routine Streaks</h2>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}>
                  {maxStreak} Days Best Streak 🔥
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Build unwavering discipline through daily habit momentum and automated check-ins.
              </p>
            </div>
          </div>

          {/* 3D Circular Progress Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="url(#emeraldGradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <defs>
                  <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>

              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  {completionPercentage}%
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {completedTodayCount}/{totalHabitsCount} DONE
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button 
                onClick={requestNotifications}
                className="nav-btn"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  background: notificationsEnabled ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
                  color: notificationsEnabled ? '#10b981' : 'var(--text-main)',
                  border: '1px solid ' + (notificationsEnabled ? '#10b981' : 'var(--card-border)')
                }}
              >
                <Bell size={14} />
                <span>{notificationsEnabled ? 'Reminders Active' : 'Enable Reminders'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Completed', 'Health', 'Wellness', 'Fitness', 'Learning'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: selectedFilter === tab ? '#10b981' : 'var(--bg-secondary)',
              color: selectedFilter === tab ? '#ffffff' : 'var(--text-muted)',
              border: '1px solid ' + (selectedFilter === tab ? '#10b981' : 'var(--card-border)'),
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid: Habits Checklist Feed & Add Habit Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        
        {/* Left: Active Habits Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Award size={20} style={{ color: '#10b981' }} />
            Daily Habit Goals ({filteredHabits.length})
          </h3>

          {filteredHabits.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredHabits.map((habit) => {
                const isCompleted = habit.completedDates && habit.completedDates.includes(selectedDate);
                const streak = habit.streak || 0;

                return (
                  <div 
                    key={habit.id}
                    className="card"
                    style={{
                      padding: '1.15rem',
                      borderRadius: '20px',
                      background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'var(--card-bg)',
                      border: '1px solid ' + (isCompleted ? '#10b981' : 'var(--card-border)'),
                      boxShadow: isCompleted ? '0 8px 25px rgba(16, 185, 129, 0.12)' : 'var(--card-shadow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    <div 
                      onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: 1 }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: isCompleted ? '2px solid #10b981' : '2px solid var(--text-muted)',
                        background: isCompleted ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                        transition: 'all var(--transition-fast)'
                      }}>
                        {isCompleted && <Check size={18} strokeWidth={3} />}
                      </div>

                      <div>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)'
                        }}>
                          {habit.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {habit.category} • Tap to toggle status
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* 3D Flame Streak Counter Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.8rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                        color: '#f59e0b',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        boxShadow: '0 2px 10px rgba(245, 158, 11, 0.2)'
                      }}>
                        <Flame size={15} fill="#f59e0b" />
                        <span>{streak}d</span>
                      </div>

                      <button 
                        onClick={() => deleteHabit(habit.id)}
                        className="action-btn-sm"
                        title="Delete Habit"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              No habits found under this filter. Create a new habit below!
            </div>
          )}
        </div>

        {/* Right: Add New Habit & Habit Science Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Create Habit Form */}
          <div className="card" style={{ borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Plus size={18} style={{ color: '#10b981' }} />
              Add New Habit Goal
            </h3>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Habit Name</label>
                <input 
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Morning 20-min Yoga, Drink 500ml Water"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                >
                  <option value="Health">💧 Health & Hydration</option>
                  <option value="Wellness">🧘 Wellness & Mindfulness</option>
                  <option value="Fitness">🏋️ Fitness & Movement</option>
                  <option value="Nutrition">🥗 Meals & Nutrition</option>
                  <option value="Learning">📖 Learning & Productivity</option>
                </select>
              </div>

              <button 
                type="submit"
                className="btn-primary"
                style={{
                  padding: '0.85rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                }}
              >
                + Create Daily Habit Goal
              </button>
            </form>
          </div>

          {/* Motivational Habit Streak Science Card */}
          <div 
            className="card"
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(52, 211, 153, 0.04) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', color: '#10b981', fontWeight: 800, fontSize: '0.95rem' }}>
              <Sparkles size={18} />
              <span>The Power of Continuous Streaks</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Research shows it takes <strong>21 to 66 days</strong> of consistent daily micro-habits to build permanent neural pathways. Keeping your Routinix flame streak alive creates lasting momentum!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
