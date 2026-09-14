import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Plus, 
  Bell, 
  BellOff, 
  RefreshCw, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Sliders, 
  Calendar, 
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HydrationTracker = () => {
  const { 
    waterLogs, 
    addWaterEntry, 
    deleteWaterEntry, 
    waterGoal, 
    setWaterGoal, 
    waterUnit, 
    setWaterUnit,
    selectedDate 
  } = useApp();

  const [customAmount, setCustomAmount] = useState('');
  const [reminderActive, setReminderActive] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(60); // minutes
  const [timerCountdown, setTimerCountdown] = useState(60 * 60); // seconds
  const [showToast, setShowToast] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(waterGoal);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);

  // Drinking Schedule Configuration
  const [scheduleStart, setScheduleStart] = useState('07:00');
  const [scheduleEnd, setScheduleEnd] = useState('22:00');
  const [completedSlots, setCompletedSlots] = useState({});

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsAllowed(true);
    }
  }, []);

  // Filter logs for selected date
  const dateWaterLogs = waterLogs.filter(log => log.date === selectedDate);
  const totalWaterToday = dateWaterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);

  // Calculations for display
  const isOz = waterUnit === 'oz';
  const displayTotal = isOz ? (totalWaterToday * 0.033814).toFixed(1) : totalWaterToday;
  const displayGoal = isOz ? (waterGoal * 0.033814).toFixed(0) : waterGoal;
  const unitLabel = isOz ? 'oz' : 'ml';
  const percentage = Math.min(Math.round((totalWaterToday / (waterGoal || 1)) * 100), 100);

  // Generate drinking schedule slots between scheduleStart and scheduleEnd
  const generateScheduleSlots = () => {
    const slots = [];
    const [startH] = scheduleStart.split(':').map(Number);
    const [endH] = scheduleEnd.split(':').map(Number);
    const stepHours = Math.max(1, Math.round(reminderInterval / 60) || 2);

    let current = startH;
    let slotId = 1;
    while (current <= endH) {
      const timeStr = `${current.toString().padStart(2, '0')}:00`;
      const targetAmount = Math.round(waterGoal / Math.max(1, Math.floor((endH - startH) / stepHours) + 1));
      slots.push({
        id: `slot_${slotId}`,
        time: timeStr,
        amountMl: targetAmount,
        label: current < 12 ? 'Morning Boost' : current < 17 ? 'Afternoon Energy' : 'Evening Hydration'
      });
      current += stepHours;
      slotId++;
    }
    return slots;
  };

  const scheduleSlots = generateScheduleSlots();

  // Countdown timer for reminders
  useEffect(() => {
    if (!reminderActive) return;

    const timer = setInterval(() => {
      setTimerCountdown((prev) => {
        if (prev <= 1) {
          triggerReminderAlert();
          return reminderInterval * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reminderActive, reminderInterval]);

  const requestBrowserNotifications = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setNotificationsAllowed(true);
        new Notification('Routinix Hydration Reminders Active 💧', {
          body: `You will be notified every ${reminderInterval} minutes to stay hydrated.`,
          icon: '/routinix_3d_monogram.jpg'
        });
      }
    });
  };

  const triggerReminderAlert = () => {
    setShowToast(true);

    // Browser desktop push notification if allowed
    if (notificationsAllowed && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Time to Hydrate! 💧', {
        body: `Drink a refreshing glass of water to maintain your peak daily energy.`,
        icon: '/routinix_3d_monogram.jpg'
      });
    }

    // Play subtle chime sound using Web Audio API synthesis
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}

    setTimeout(() => setShowToast(false), 6000);
  };

  const handleQuickAdd = (mlAmount) => {
    addWaterEntry({
      amountMl: mlAmount,
      time: new Date().toTimeString().slice(0, 5),
      date: selectedDate
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!val) return;
    const mlVal = isOz ? val * 29.5735 : val;
    handleQuickAdd(Math.round(mlVal));
    setCustomAmount('');
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const parsed = parseInt(tempGoal);
    if (parsed > 0) {
      setWaterGoal(parsed);
      setIsEditingGoal(false);
    }
  };

  const toggleSlotDone = (slot) => {
    const isDone = !!completedSlots[slot.id];
    setCompletedSlots(prev => ({ ...prev, [slot.id]: !isDone }));
    if (!isDone) {
      handleQuickAdd(slot.amountMl);
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Toast Alert Banner */}
      {showToast && (
        <div style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          color: 'white',
          padding: '1.1rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)',
          animation: 'slideUp 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>
              <Droplet size={24} />
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem' }}>Hydration Interval Alert! 💧</strong>
              <div style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '0.1rem' }}>
                Time for your scheduled drink. Keep your hydration streak flowing!
              </div>
            </div>
          </div>
          <button 
            onClick={() => handleQuickAdd(250)}
            style={{ background: 'white', color: '#06b6d4', padding: '0.45rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            + Log 250ml Glass
          </button>
        </div>
      )}

      {/* Main Hydration Status Card */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)', 
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 12px 35px rgba(6, 182, 212, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#ffffff', boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)' }}>
              <Droplet size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Hydration Intake & Schedule</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Water Goals, Drinking Timetable & Smart Interval Reminders</span>
            </div>
          </div>

          {/* Unit Toggle & Goal Edit Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="action-btn-sm"
              onClick={() => { setIsEditingGoal(!isEditingGoal); setTempGoal(waterGoal); }}
              title="Configure Daily Goal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <Sliders size={15} color="#06b6d4" />
              <span>Set Goal</span>
            </button>

            {/* Unit Toggle */}
            <div className="tab-group" style={{ margin: 0 }}>
              <button 
                className={`tab-item ${!isOz ? 'active' : ''}`}
                onClick={() => setWaterUnit('ml')}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
              >
                ml
              </button>
              <button 
                className={`tab-item ${isOz ? 'active' : ''}`}
                onClick={() => setWaterUnit('oz')}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
              >
                fl oz
              </button>
            </div>
          </div>
        </div>

        {/* Goal Edit Slider Panel */}
        {isEditingGoal && (
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}>
            <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Customize Daily Water Target</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#06b6d4' }}>
                  {isOz ? `${(tempGoal * 0.033814).toFixed(0)} fl oz` : `${tempGoal} ml`}
                </span>
              </div>

              <input 
                type="range"
                min="1000"
                max="5000"
                step="100"
                value={tempGoal}
                onChange={(e) => setTempGoal(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[2000, 2500, 3000, 3500].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setTempGoal(preset)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: tempGoal === preset ? '#06b6d4' : 'var(--bg-secondary)',
                      color: tempGoal === preset ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid var(--card-border)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isOz ? `${Math.round(preset * 0.033814)} oz` : `${preset} ml`}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="nav-btn" 
                  onClick={() => setIsEditingGoal(false)}
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '0.4rem 1.1rem', fontSize: '0.82rem' }}
                >
                  Save Daily Target
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Visual Progress Cylinder & Quick Presets Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          
          {/* Progress Cylinder Meter */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 4px 15px rgba(0, 0, 0, 0.2), 0 8px 25px rgba(6, 182, 212, 0.2)',
              overflow: 'hidden',
              border: '2px solid rgba(6, 182, 212, 0.4)'
            }}>
              {/* Dynamic Animated Liquid Filling Effect */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${percentage}%`,
                background: 'linear-gradient(180deg, #06b6d4 0%, #3b82f6 100%)',
                transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.88
              }} />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  {percentage}%
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {displayTotal} / {displayGoal} {unitLabel}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.88rem' }}>
              {percentage >= 100 ? (
                <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={16} /> Daily Goal Completed! Great job!
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{(displayGoal - displayTotal).toFixed(1)} {unitLabel}</strong> remaining today
                </span>
              )}
            </div>
          </div>

          {/* Quick Presets Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Quick Log Presets</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button 
                className="nav-btn"
                style={{ background: 'var(--bg-secondary)', justifyContent: 'flex-start', padding: '0.75rem' }}
                onClick={() => handleQuickAdd(250)}
              >
                <span style={{ fontSize: '1.3rem' }}>🥛</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Small Glass</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOz ? '8.5 oz' : '250 ml'}</div>
                </div>
              </button>

              <button 
                className="nav-btn"
                style={{ background: 'var(--bg-secondary)', justifyContent: 'flex-start', padding: '0.75rem' }}
                onClick={() => handleQuickAdd(500)}
              >
                <span style={{ fontSize: '1.3rem' }}>🥤</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Water Bottle</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOz ? '17 oz' : '500 ml'}</div>
                </div>
              </button>

              <button 
                className="nav-btn"
                style={{ background: 'var(--bg-secondary)', justifyContent: 'flex-start', padding: '0.75rem' }}
                onClick={() => handleQuickAdd(750)}
              >
                <span style={{ fontSize: '1.3rem' }}>🥾</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sports Flask</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOz ? '25 oz' : '750 ml'}</div>
                </div>
              </button>

              <button 
                className="nav-btn"
                style={{ background: 'var(--bg-secondary)', justifyContent: 'flex-start', padding: '0.75rem' }}
                onClick={() => handleQuickAdd(1000)}
              >
                <span style={{ fontSize: '1.3rem' }}>🪣</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Large Jug</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOz ? '34 oz' : '1000 ml'}</div>
                </div>
              </button>
            </div>

            {/* Custom Amount Form */}
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input 
                type="number"
                step="any"
                className="form-input"
                placeholder={`Custom amount in ${unitLabel}...`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: '0 1.2rem' }}>
                Add
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Grid: Drinking Schedule Planner & Interval Reminder System */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        
        {/* Module A: Daily Drinking Schedule Planner */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Calendar size={18} style={{ color: '#06b6d4' }} />
              Daily Drinking Schedule
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>{scheduleStart}</span> - <span>{scheduleEnd}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {scheduleSlots.map((slot) => {
              const isDone = !!completedSlots[slot.id];
              return (
                <div 
                  key={slot.id}
                  onClick={() => toggleSlotDone(slot)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    background: isDone ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-primary)',
                    border: '1px solid ' + (isDone ? '#10b981' : 'var(--card-border)'),
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: isDone ? '2px solid #10b981' : '2px solid var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isDone ? '#10b981' : 'transparent',
                      color: '#ffffff'
                    }}>
                      {isDone && <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isDone ? '#10b981' : 'var(--text-main)' }}>
                        {slot.time} • {slot.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Target: {isOz ? `${(slot.amountMl * 0.033814).toFixed(0)} oz` : `${slot.amountMl} ml`}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isDone ? '#10b981' : '#06b6d4' }}>
                    {isDone ? '✓ Completed' : '+ Mark Drank'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module B: Periodic Reminder & Push Notification System */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Bell size={18} style={{ color: '#06b6d4' }} />
                Smart Periodic Reminders
              </h3>

              <button 
                className={`nav-btn ${reminderActive ? 'btn-primary' : ''}`}
                onClick={() => setReminderActive(!reminderActive)}
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
              >
                {reminderActive ? <Bell size={14} /> : <BellOff size={14} />}
                <span>{reminderActive ? 'Active' : 'Muted'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Reminder Frequency:</span>
                <select 
                  className="form-select"
                  style={{ width: 'auto', padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}
                  value={reminderInterval}
                  onChange={(e) => {
                    const newInt = parseInt(e.target.value);
                    setReminderInterval(newInt);
                    setTimerCountdown(newInt * 60);
                  }}
                >
                  <option value={30}>Every 30 mins</option>
                  <option value={45}>Every 45 mins</option>
                  <option value={60}>Every 1 hour</option>
                  <option value={90}>Every 1.5 hours</option>
                  <option value={120}>Every 2 hours</option>
                </select>
              </div>

              {reminderActive && (
                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <Clock size={18} color="#06b6d4" />
                    <span>Next Reminder in:</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: '#06b6d4' }}>
                    {formatCountdown(timerCountdown)}
                  </span>
                </div>
              )}

              {/* Desktop Browser Notifications Button */}
              <button 
                className="nav-btn"
                style={{
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  background: notificationsAllowed ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                  color: notificationsAllowed ? '#10b981' : 'var(--text-main)',
                  border: '1px solid ' + (notificationsAllowed ? '#10b981' : 'var(--card-border)')
                }}
                onClick={requestBrowserNotifications}
              >
                <Bell size={14} />
                <span>{notificationsAllowed ? '✓ Desktop Push Alerts Enabled' : 'Enable Desktop Notifications'}</span>
              </button>

              <button 
                className="nav-btn"
                style={{ justifyContent: 'center', fontSize: '0.82rem' }}
                onClick={triggerReminderAlert}
              >
                <Volume2 size={14} />
                <span>Test Audio Chime & Alert</span>
              </button>
            </div>
          </div>

          {/* Today's Water Log History */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.6rem', color: 'var(--text-muted)' }}>Today's Recorded Logs:</h4>
            {dateWaterLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
                {dateWaterLogs.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Droplet size={14} color="#06b6d4" />
                      <span>+{isOz ? (item.amountMl * 0.033814).toFixed(1) : item.amountMl} {unitLabel}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                      <button onClick={() => deleteWaterEntry(item.id)} className="action-btn-sm">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>No logs yet today.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
