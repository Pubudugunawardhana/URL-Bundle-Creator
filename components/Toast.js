'use client';
import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

export default function Toast({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0 && message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, message, onClose]);

  if (!message) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`,
        color: 'var(--text-primary)',
        borderRadius: '12px',
        boxShadow: 'var(--glass-shadow)',
        animation: 'toastSlideDown 0.3s ease-out forwards'
      }}>
        {type === 'error' ? <AlertCircle size={20} color="var(--danger-color)" /> : <CheckCircle size={20} color="var(--success-color)" />}
        <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</span>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
            marginLeft: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <X size={18} />
        </button>
      </div>
    </>
  );
}
