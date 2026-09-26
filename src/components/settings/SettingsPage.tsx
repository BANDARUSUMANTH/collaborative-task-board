import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { Sun, Moon, Maximize2, Minimize2, Kanban, List, RotateCcw, Database, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { preferences, setTheme, setLayoutDensity, setTaskViewMode } = useSettings();
  const { resetAllData } = useTaskBoard();

  return (
    <div className="page-wrapper" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Preferences & System Configuration</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Manage your personal workspace appearance, layout density, and diagnostic controls.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Appearance & Color Scheme (Requirement Section 7) */}
        <section className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Interface Appearance & Theme
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Toggle between high-contrast dark mode and crisp light mode. Your choice persists across page refreshes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Dark Theme Button */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className="card card-interactive"
              style={{
                padding: '1.25rem',
                border: preferences.theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: '#111827',
                color: '#f8fafc',
                textAlign: 'left',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Moon size={22} color="#818cf8" />
                {preferences.theme === 'dark' && (
                  <span style={{ backgroundColor: 'var(--accent-primary)', borderRadius: '50%', padding: '2px', color: '#fff', display: 'flex' }}>
                    <Check size={14} />
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>Dark Theme</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Deep palette tailored for reduced eye strain during extended development sessions.
              </div>
            </button>

            {/* Light Theme Button */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className="card card-interactive"
              style={{
                padding: '1.25rem',
                border: preferences.theme === 'light' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                textAlign: 'left',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Sun size={22} color="#f59e0b" />
                {preferences.theme === 'light' && (
                  <span style={{ backgroundColor: 'var(--accent-primary)', borderRadius: '50%', padding: '2px', color: '#fff', display: 'flex' }}>
                    <Check size={14} />
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>Light Theme</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Clean, high-clarity daylight aesthetic with optimal typographical contrast.
              </div>
            </button>
          </div>
        </section>

        {/* Layout Density (Requirement Section 7) */}
        <section className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Layout Spacing & Density
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Adjust the padding, card gaps, and row heights to fit more content on screen.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setLayoutDensity('comfortable')}
              className="card card-interactive"
              style={{
                padding: '1.25rem',
                border: preferences.layoutDensity === 'comfortable' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Maximize2 size={20} color="var(--accent-primary)" />
                {preferences.layoutDensity === 'comfortable' && (
                  <span style={{ backgroundColor: 'var(--accent-primary)', borderRadius: '50%', padding: '2px', color: '#fff', display: 'flex' }}>
                    <Check size={14} />
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Comfortable Density</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Relaxed padding and generous breathing room for high readability.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLayoutDensity('compact')}
              className="card card-interactive"
              style={{
                padding: '1.25rem',
                border: preferences.layoutDensity === 'compact' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Minimize2 size={20} color="var(--accent-primary)" />
                {preferences.layoutDensity === 'compact' && (
                  <span style={{ backgroundColor: 'var(--accent-primary)', borderRadius: '50%', padding: '2px', color: '#fff', display: 'flex' }}>
                    <Check size={14} />
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Compact Density</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tighter margins and row heights, ideal for data-dense power-user workflows.
              </div>
            </button>
          </div>
        </section>

        {/* Task View Preference (Requirement Section 7) */}
        <section className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Default Task View
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Select your preferred default presentation mode for projects and tasks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setTaskViewMode('board')}
              className="card card-interactive"
              style={{
                padding: '1.25rem',
                border: preferences.taskViewMode === 'board' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Kanban size={20} color="var(--accent-primary)" />
                {preferences.taskViewMode === 'board' && (
                  <span style={{ backgroundColor: 'var(--accent-primary)', borderRadius: '50%', padding: '2px', color: '#fff', display: 'flex' }}>
                    <Check size={14} />
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Kanban Board Mode</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Three visual workflow columns: Todo, In Progress, and Completed.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTaskViewMode('table')}
              className="card card-interactive"
              style={{
                padding: '1.25rem',
                border: preferences.taskViewMode === 'table' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <List size={20} color="var(--accent-primary)" />
                {preferences.taskViewMode === 'table' && (
                  <span style={{ backgroundColor: 'var(--accent-primary)', borderRadius: '50%', padding: '2px', color: '#fff', display: 'flex' }}>
                    <Check size={14} />
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Data Table Mode</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tabular grid with direct column headers and compact action controls.
              </div>
            </button>
          </div>
        </section>

        {/* System Reset & Data Maintenance */}
        <section className="card" style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Database size={18} color="#ef4444" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Data Maintenance & Reset</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Restore the application to the original clean enterprise seed dataset (useful for re-testing complete user flows).
          </p>

          <button
            type="button"
            onClick={resetAllData}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}
          >
            <RotateCcw size={16} />
            <span>Reset All Data to Seed State</span>
          </button>
        </section>
      </div>
    </div>
  );
};
