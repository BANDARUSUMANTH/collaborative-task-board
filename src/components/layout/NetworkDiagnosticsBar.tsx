import React from 'react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { Wifi, AlertOctagon, RotateCcw, Activity } from 'lucide-react';

export const NetworkDiagnosticsBar: React.FC = () => {
  const {
    simulateError,
    setSimulateError,
    latencyMs,
    setLatencyMs,
    resetAllData,
    reloadAll
  } = useTaskBoard();

  return (
    <aside
      aria-label="API Diagnostic & Simulation Controls"
      style={{
        backgroundColor: simulateError ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-sidebar)',
        borderBottom: `1px solid ${simulateError ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}`,
        padding: '0.45rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.8rem',
        transition: 'background-color 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: 700,
            color: simulateError ? '#ef4444' : '#10b981'
          }}
        >
          {simulateError ? <AlertOctagon size={14} /> : <Wifi size={14} />}
          {simulateError ? 'SIMULATED 500 ERROR MODE' : 'MOCK API ONLINE'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
          <Activity size={13} />
          <span>Latency:</span>
          <select
            value={latencyMs}
            onChange={(e) => setLatencyMs(Number(e.target.value))}
            aria-label="Simulated Network Latency"
            style={{
              padding: '0.15rem 0.4rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-input)',
              fontSize: '0.75rem'
            }}
          >
            <option value={0}>0ms (Instant)</option>
            <option value={250}>250ms (Normal)</option>
            <option value={600}>600ms (Realistic 3G)</option>
            <option value={1500}>1500ms (Slow Network)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setSimulateError(!simulateError)}
          className={`btn btn-sm ${simulateError ? 'btn-danger' : 'btn-secondary'}`}
          title="Toggle server 500 errors to test error handling & rollback"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
        >
          <AlertOctagon size={13} />
          {simulateError ? 'Disable Error Sim' : 'Simulate Failed API'}
        </button>

        <button
          type="button"
          onClick={reloadAll}
          className="btn btn-sm btn-ghost"
          title="Re-fetch all projects and tasks"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
        >
          <RotateCcw size={13} />
          Refresh
        </button>

        <button
          type="button"
          onClick={resetAllData}
          className="btn btn-sm btn-ghost"
          title="Reset tasks and projects to initial state"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: 'var(--text-muted)' }}
        >
          Reset Data
        </button>
      </div>
    </aside>
  );
};
