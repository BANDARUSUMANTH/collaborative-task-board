import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        padding: '1rem 0'
      }}
    >
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            height: '80px',
            background:
              'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonWave 1.5s infinite',
            borderRadius: 'var(--radius-md)'
          }}
        />
      ))}
      <style>{`
        @keyframes skeletonWave {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
