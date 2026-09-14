import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Database, Key, CheckCircle2, Download, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PrivacyPolicyModal = () => {
  const { isPrivacyModalOpen, setIsPrivacyModalOpen, user } = useAuth();

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsPrivacyModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.15) 100%)',
              border: '1px solid rgba(16,185,129,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2 }}>
                RoutinX Privacy Policy & Security Architecture
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Version 2.5 • Zero-Knowledge Financial & Routine Protection
              </p>
            </div>
          </div>
          <button onClick={() => setIsPrivacyModalOpen(false)} className="action-btn-sm">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="modal-body" style={{ overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Executive Commitment Card */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(16,185,129,0.06) 100%)',
            border: '1px solid rgba(6,182,212,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
              <Lock size={16} />
              <span>Zero-Knowledge Privacy Guarantee</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              At <strong>RoutinX</strong>, your financial transactions, daily routines, and fitness metrics are your private property. We do not sell, monetize, or transmit your individual expense details to third-party ad brokers.
            </p>
          </div>

          {/* Key Security Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            
            {/* Pillar 1 */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--card-border)',
              display: 'flex',
              gap: '0.85rem'
            }}>
              <Database size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  1. Local-First Client Storage (Guest & Standard)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  In Guest Mode, all expense records, meal logs, and habit streaks reside strictly in your browser's encrypted local storage. Nothing leaves your physical device unless you choose to sync.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--card-border)',
              display: 'flex',
              gap: '0.85rem'
            }}>
              <Key size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  2. Two-Factor Authentication & Biometric Shields
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Sensitive actions like transaction exports, budget resets, or bank feeds are guarded with optional TOTP authenticator codes or device biometrics.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--card-border)',
              display: 'flex',
              gap: '0.85rem'
            }}>
              <EyeOff size={20} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  3. Bank Sync & OAuth Privacy
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  When using Google or Apple Sign-In, RoutinX only receives tokenized credentials. We never store bank passwords or raw card numbers.
                </p>
              </div>
            </div>

          </div>

          {/* User Data Rights */}
          <div style={{
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--card-border)'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              Your Rights & Complete Data Ownership
            </h4>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li><strong>Export Anytime:</strong> Download your entire dataset as JSON from App Settings.</li>
              <li><strong>Permanent Purge:</strong> 1-click irreversible data deletion right from the device settings.</li>
              <li><strong>Zero Tracking:</strong> No cross-site behavioral telemetry or hidden tracking pixels.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 Protected under Global Data Privacy & ISO-27001 Standards
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setIsPrivacyModalOpen(false)}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
