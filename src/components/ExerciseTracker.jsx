import React, { useState } from 'react';
import { Dumbbell, Plus, Flame, Clock, Zap, Heart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExerciseTracker = () => {
  const { workoutLogs, addWorkoutEntry, deleteWorkoutEntry, selectedDate } = useApp();

  const [exerciseName, setExerciseName] = useState('');
  const [workoutCategory, setWorkoutCategory] = useState('Strength');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('60');
  const [duration, setDuration] = useState('45'); // mins
  const [calories, setCalories] = useState('280');

  // Filter logs for selected date
  const dateWorkouts = workoutLogs.filter(log => log.date === selectedDate);
  const totalCaloriesToday = dateWorkouts.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const totalDurationToday = dateWorkouts.reduce((acc, curr) => acc + (curr.duration || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    addWorkoutEntry({
      name: exerciseName.trim(),
      category: workoutCategory,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: parseFloat(weight) || 0,
      duration: parseInt(duration) || 0,
      calories: parseInt(calories) || 0,
      time: new Date().toTimeString().slice(0, 5),
      date: selectedDate
    });

    setExerciseName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Stat Summary Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-fitness-bg)', color: '#8b5cf6' }}>
            <Dumbbell size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Daily Workouts</div>
            <div className="stat-value">{dateWorkouts.length} Session(s)</div>
            <div className="stat-subtext">Selected Date</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-danger-bg)', color: '#ef4444' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Calories Burned</div>
            <div className="stat-value">{totalCaloriesToday} kcal</div>
            <div className="stat-subtext">Estimated Energy</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-travel-bg)', color: '#3b82f6' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Active Workout Time</div>
            <div className="stat-value">{totalDurationToday} mins</div>
            <div className="stat-subtext">Total Training Time</div>
          </div>
        </div>
      </div>

      {/* Main Form & Workout Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Workout Logger Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} style={{ color: '#8b5cf6' }} />
            Log Exercise & Workout
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Exercise Name</label>
              <input 
                type="text" 
                required
                className="form-input" 
                placeholder="e.g. Barbell Squats, 5K Run, Push-ups"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={workoutCategory}
                  onChange={(e) => setWorkoutCategory(e.target.value)}
                >
                  <option value="Strength">🏋️ Strength Training</option>
                  <option value="Cardio">🏃 Cardio & Running</option>
                  <option value="HIIT">⚡ HIIT & Circuit</option>
                  <option value="Mobility">🧘 Mobility & Stretching</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (mins)</label>
                <input 
                  type="number"
                  className="form-input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            {workoutCategory === 'Strength' && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Sets</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reps</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Calories Burned (kcal)</label>
              <input 
                type="number"
                className="form-input"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}>
              Save Workout Log
            </button>
          </form>
        </div>

        {/* Workout Log Feed */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={18} style={{ color: '#8b5cf6' }} />
            Today's Workout Sessions
          </h3>

          {dateWorkouts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dateWorkouts.map((item) => (
                <div key={item.id} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Zap size={14} color="#8b5cf6" />
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {item.category} • {item.duration} mins
                      {item.sets > 0 && ` • ${item.sets} sets x ${item.reps} reps (${item.weight}kg)`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>
                      🔥 {item.calories} kcal
                    </span>
                    <button 
                      onClick={() => deleteWorkoutEntry(item.id)}
                      className="action-btn-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No workouts logged for this day. Fill in the exercise form to log your daily training!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
