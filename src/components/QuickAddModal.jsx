import React, { useState } from 'react';
import { X, DollarSign, Activity, Utensils, Coffee, Car, Mountain, ShoppingBag, Clock, MapPin, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickAddModal = () => {
  const { isQuickAddOpen, setIsQuickAddOpen, addLogEntry, selectedDate, settings } = useApp();

  const [entryType, setEntryType] = useState('expense'); // 'expense' | 'activity'
  
  // Expense Form Fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  
  // Activity Form Fields
  const [activityCategory, setActivityCategory] = useState('trekking');
  const [duration, setDuration] = useState('1 hr 30 mins');
  const [distance, setDistance] = useState('');
  const [elevation, setElevation] = useState('');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [location, setLocation] = useState('');

  // Shared Fields
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');

  if (!isQuickAddOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (entryType === 'expense') {
      addLogEntry({
        type: 'expense',
        title: title.trim(),
        amount: parseFloat(amount) || 0,
        category,
        paymentMethod,
        date: selectedDate,
        time,
        notes
      });
    } else {
      addLogEntry({
        type: 'activity',
        title: title.trim(),
        category: activityCategory,
        duration,
        distance: parseFloat(distance) || 0,
        elevation: parseFloat(elevation) || 0,
        difficulty,
        location: location.trim(),
        date: selectedDate,
        time,
        notes
      });
    }

    // Reset fields
    setTitle('');
    setAmount('');
    setNotes('');
    setDistance('');
    setElevation('');
    setLocation('');
    setIsQuickAddOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsQuickAddOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {/* Switcher Tab between Expense & Activity */}
          <div className="tab-group" style={{ margin: 0 }}>
            <button 
              className={`tab-item ${entryType === 'expense' ? 'active' : ''}`}
              onClick={() => setEntryType('expense')}
            >
              <DollarSign size={16} />
              <span>Expense Log</span>
            </button>
            <button 
              className={`tab-item ${entryType === 'activity' ? 'active' : ''}`}
              onClick={() => setEntryType('activity')}
            >
              <Activity size={16} />
              <span>Activity & Trekking</span>
            </button>
          </div>

          <button onClick={() => setIsQuickAddOpen(false)} className="action-btn-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              {entryType === 'expense' ? 'Expense Title' : 'Activity Name'}
            </label>
            <input 
              type="text"
              required
              className="form-input"
              placeholder={entryType === 'expense' ? 'e.g. Avocado Toast & Iced Latte' : 'e.g. Pine Ridge Peak Trek'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {entryType === 'expense' ? (
            <>
              {/* Expense Specific Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount ({settings.currency})</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    className="form-input" 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="food">🍔 Food & Meals</option>
                    <option value="drinks">☕ Drinks & Coffee</option>
                    <option value="travel">🚗 Travel & Transport</option>
                    <option value="trekking_gear">🥾 Outdoor & Trek Gear</option>
                    <option value="shopping">🛍️ Shopping & Supplies</option>
                    <option value="other">💳 Other Expense</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select 
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Digital Wallet">Digital Wallet / Apple Pay</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input 
                    type="time" 
                    className="form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Activity & Trekking Specific Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={activityCategory}
                    onChange={(e) => setActivityCategory(e.target.value)}
                  >
                    <option value="trekking">🏔️ Outdoor Trekking & Hike</option>
                    <option value="fitness">🏃 Running & Fitness</option>
                    <option value="routine">💻 Work & Routine</option>
                    <option value="leisure">🎨 Leisure & Wellness</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. 2 hrs 15 mins"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              {/* Special Outdoor Metrics for Trekking */}
              {(activityCategory === 'trekking' || activityCategory === 'fitness') && (
                <div className="form-row" style={{ background: 'var(--accent-trekking-bg)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: 'var(--accent-trekking)' }}>Distance (km)</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="e.g. 8.5"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: 'var(--accent-trekking)' }}>Elevation Gain (m)</label>
                    <input 
                      type="number"
                      className="form-input"
                      placeholder="e.g. 450"
                      value={elevation}
                      onChange={(e) => setElevation(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location / Trail Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Emerald Pass Trailhead"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select 
                    className="form-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes & Highlights</label>
            <textarea 
              rows="2"
              className="form-textarea"
              placeholder="Add optional notes or memorable moments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', marginTop: '0.5rem' }}>
            Save Entry to Routine
          </button>
        </form>
      </div>
    </div>
  );
};
