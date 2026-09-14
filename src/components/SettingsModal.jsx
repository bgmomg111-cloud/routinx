import React from 'react';
import { X, Settings, Download, Upload, RefreshCw, Trash2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsModal = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    settings, 
    setSettings, 
    exportDataJSON, 
    importDataJSON, 
    resetToSampleData, 
    clearAllData 
  } = useApp();

  if (!isSettingsOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--accent-primary-light)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}>
              <Settings size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>App Settings & Data</h3>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className="action-btn-sm">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Preferences */}
          <div className="form-group">
            <label className="form-label">Currency Symbol</label>
            <select 
              className="form-select"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            >
              <option value="$">$ USD (US Dollar)</option>
              <option value="€">€ EUR (Euro)</option>
              <option value="£">£ GBP (British Pound)</option>
              <option value="₹">₹ INR (Indian Rupee)</option>
              <option value="¥">¥ JPY (Japanese Yen)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Daily Budget Limit</label>
            <input 
              type="number"
              className="form-input"
              value={settings.dailyBudget}
              onChange={(e) => setSettings({ ...settings, dailyBudget: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div style={{ margin: '1.5rem 0', height: '1px', background: 'var(--card-border)' }} />

          {/* Backup & Data Controls */}
          <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Data Backup & Management</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="nav-btn" style={{ justifyContent: 'center' }} onClick={exportDataJSON}>
              <Download size={16} />
              <span>Export Backup (JSON)</span>
            </button>

            <label className="nav-btn" style={{ justifyContent: 'center', cursor: 'pointer' }}>
              <Upload size={16} />
              <span>Import Data (JSON)</span>
              <input 
                type="file" 
                accept=".json" 
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    importDataJSON(e.target.files[0]);
                  }
                }}
              />
            </label>

            <button className="nav-btn" style={{ justifyContent: 'center' }} onClick={resetToSampleData}>
              <RefreshCw size={16} />
              <span>Reset to Demo Dataset</span>
            </button>

            <button className="nav-btn" style={{ justifyContent: 'center', color: 'var(--accent-danger)' }} onClick={() => {
              if (confirm('Are you sure you want to clear all log entries?')) {
                clearAllData();
              }
            }}>
              <Trash2 size={16} />
              <span>Clear All Logs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
