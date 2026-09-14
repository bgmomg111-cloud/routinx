import React from 'react';
import { Mountain, Compass, MapPin, Award, TrendingUp, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrekkingHighlightCard = () => {
  const { logs, setIsQuickAddOpen } = useApp();

  const trekkingLogs = logs.filter(log => log.type === 'activity' && log.category === 'trekking');

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: 'var(--accent-trekking-bg)', padding: '0.4rem', borderRadius: 'var(--radius-md)', color: '#10b981' }}>
            <Mountain size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Outdoor & Trekking Journal</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Adventure & Hike Logbook</span>
          </div>
        </div>
        <button 
          className="nav-btn"
          style={{ background: 'var(--accent-trekking-bg)', color: '#10b981', borderColor: 'transparent' }}
          onClick={() => setIsQuickAddOpen(true)}
        >
          <Plus size={16} />
          <span>Log Hike</span>
        </button>
      </div>

      {trekkingLogs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {trekkingLogs.slice(0, 3).map(trek => (
            <div key={trek.id} style={{ background: 'var(--card-bg)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="#10b981" />
                  {trek.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {trek.location ? `${trek.location} • ` : ''}{trek.date} ({trek.duration})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#10b981' }}>
                  {trek.distance} km
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  +{trek.elevation}m elevation
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <Compass size={32} style={{ margin: '0 auto 0.5rem auto', color: '#10b981', opacity: 0.6 }} />
          No outdoor hikes or treks recorded yet. Click <strong>Log Hike</strong> to record your trail stats!
        </div>
      )}
    </div>
  );
};
