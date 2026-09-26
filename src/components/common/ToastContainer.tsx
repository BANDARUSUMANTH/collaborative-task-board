import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notification Center"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '420px',
        width: 'calc(100vw - 3rem)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        let icon = <Info size={20} color="#3b82f6" />;
        let borderColor = 'var(--border-subtle)';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={20} color="#10b981" />;
          borderColor = 'rgba(16, 185, 129, 0.4)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={20} color="#ef4444" />;
          borderColor = 'rgba(239, 68, 68, 0.4)';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={20} color="#f59e0b" />;
          borderColor = 'rgba(245, 158, 11, 0.4)';
        }

        return (
          <div
            key={toast.id}
            role="alert"
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${borderColor}`,
              boxShadow: 'var(--shadow-xl)',
              padding: '1rem 1.25rem',
              display: 'flex',
              gap: '0.875rem',
              alignItems: 'flex-start',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                {toast.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </p>
              {toast.action && (
                <button
                  type="button"
                  onClick={toast.action.onClick}
                  className="btn btn-sm btn-primary"
                  style={{ marginTop: '0.6rem' }}
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="btn-icon"
              style={{ padding: '0.25rem', marginTop: '-0.25rem', marginRight: '-0.5rem' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
