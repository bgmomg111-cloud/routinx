import React, { useState } from 'react';
import { 
  Utensils, Coffee, Car, Mountain, ShoppingBag, CreditCard, 
  Trash2, Search, Filter, Activity, Clock, MapPin, Compass 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RoutineTimeline = () => {
  const { logs, selectedDate, deleteLogEntry, settings, setIsQuickAddOpen, resetToSampleData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter logs for selected date
  const dateLogs = logs.filter(log => log.date === selectedDate);

  // Apply Search & Category Filter
  const filteredLogs = dateLogs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterCategory === 'all') return matchesSearch;
    return matchesSearch && log.category === filterCategory;
  });

  // Helper for Category Icons & Styling
  const getCategoryMeta = (type, category) => {
    if (type === 'expense') {
      switch (category) {
        case 'food':
          return { icon: <Utensils size={20} color="#f59e0b" />, bg: 'var(--accent-food-bg)', label: 'Food & Meals' };
        case 'drinks':
          return { icon: <Coffee size={20} color="#06b6d4" />, bg: 'var(--accent-drink-bg)', label: 'Drinks' };
        case 'travel':
          return { icon: <Car size={20} color="#3b82f6" />, bg: 'var(--accent-travel-bg)', label: 'Travel' };
        case 'trekking_gear':
          return { icon: <Mountain size={20} color="#10b981" />, bg: 'var(--accent-trekking-bg)', label: 'Outdoor Gear' };
        case 'shopping':
          return { icon: <ShoppingBag size={20} color="#ec4899" />, bg: 'var(--accent-shopping-bg)', label: 'Shopping' };
        default:
          return { icon: <CreditCard size={20} color="#6366f1" />, bg: 'var(--accent-primary-light)', label: 'General' };
      }
    } else {
      switch (category) {
        case 'trekking':
          return { icon: <Mountain size={20} color="#10b981" />, bg: 'var(--accent-trekking-bg)', label: 'Trekking' };
        case 'fitness':
          return { icon: <Activity size={20} color="#8b5cf6" />, bg: 'var(--accent-fitness-bg)', label: 'Fitness' };
        default:
          return { icon: <Compass size={20} color="#6366f1" />, bg: 'var(--accent-primary-light)', label: 'Routine' };
      }
    }
  };

  return (
    <div className="timeline-feed">
      {/* Search & Filter Header */}
      <div className="timeline-header">
        <h2 style={{ fontSize: '1.25rem' }}>Daily Routine Timeline</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="search-box">
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search timeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: 'var(--radius-full)' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="food">🍔 Food</option>
            <option value="drinks">☕ Drinks</option>
            <option value="travel">🚗 Travel</option>
            <option value="trekking">🏔️ Trekking</option>
            <option value="fitness">🏃 Fitness</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredLogs.length > 0 ? (
        filteredLogs.map(item => {
          const meta = getCategoryMeta(item.type, item.category);

          return (
            <div key={item.id} className={`item-card type-${item.type}`}>
              <div className="item-left">
                <div className="item-icon" style={{ background: meta.bg }}>
                  {meta.icon}
                </div>
                <div className="item-details">
                  <div className="item-title">
                    <span>{item.title}</span>
                    <span className="badge" style={{ background: meta.bg, color: 'var(--text-main)' }}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="item-sub">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={13} /> {item.time}
                    </span>
                    
                    {item.type === 'expense' ? (
                      <span>Via {item.paymentMethod}</span>
                    ) : (
                      <>
                        {item.duration && <span>• {item.duration}</span>}
                        {item.distance > 0 && <span>• 🥾 {item.distance} km</span>}
                        {item.elevation > 0 && <span>• ⛰️ {item.elevation} m</span>}
                        {item.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <MapPin size={12} /> {item.location}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {item.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="item-right">
                {item.type === 'expense' ? (
                  <span className="item-amount amount-expense">
                    -{settings.currency}{item.amount.toFixed(2)}
                  </span>
                ) : (
                  <span className="item-amount amount-activity">
                    {item.difficulty || 'Active'}
                  </span>
                )}

                <div className="item-actions">
                  <button 
                    onClick={() => deleteLogEntry(item.id)}
                    className="action-btn-sm"
                    title="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="card empty-state">
          <div className="empty-icon">🧭</div>
          <h3>No logs recorded for this day</h3>
          <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 1.25rem 0' }}>
            Start your daily routine tracking by adding food, drinks, travel expenses or an outdoor trek.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={() => setIsQuickAddOpen(true)}>
              + Add First Entry
            </button>
            <button className="nav-btn" onClick={resetToSampleData}>
              Load Sample Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
