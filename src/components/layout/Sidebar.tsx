import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  Sparkles,
  Zap,
  X
} from 'lucide-react';
import { useTaskBoard } from '../../context/TaskBoardContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { projects } = useTaskBoard();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/projects', label: 'Projects', icon: <FolderKanban size={18} /> },
    { to: '/tasks', label: 'All Tasks', icon: <CheckSquare size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 35
          }}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main Navigation">
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.35)'
              }}
            >
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                PulseBoard
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Enterprise Task OS
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            style={{ display: isOpen ? 'flex' : 'none' }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Project Shortcuts */}
        <div style={{ padding: '1rem 1.25rem', flex: 1, overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Pinned Projects</span>
            <span
              style={{
                fontSize: '0.675rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                background: 'var(--bg-card-hover)'
              }}
            >
              {projects.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {projects.slice(0, 5).map((project) => (
              <NavLink
                key={project.id}
                to={`/projects/${project.id}`}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.45rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                })}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor:
                      project.status === 'completed'
                        ? '#10b981'
                        : project.status === 'active'
                        ? '#3b82f6'
                        : '#f59e0b',
                    flexShrink: 0
                  }}
                />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* User Workspace Info / Pro Badge */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-sidebar)'
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <Sparkles size={16} color="var(--accent-primary)" />
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Internal Workspace</div>
              <div style={{ color: 'var(--text-muted)' }}>High-Performance v2.0</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
