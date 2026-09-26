import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '24px',
          backgroundColor: 'var(--accent-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 16px var(--accent-glow)'
        }}
      >
        <Compass size={48} color="var(--accent-primary)" />
      </div>

      <span
        style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--accent-primary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}
      >
        HTTP 404 Error
      </span>

      <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Page Not Found</h1>

      <p
        style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          maxWidth: '480px',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}
      >
        The workspace route, project ID, or requested destination does not exist or has been moved to another cluster.
      </p>

      <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
};
