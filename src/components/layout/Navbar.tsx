import React from 'react';
import { Menu, Sun, Moon, Maximize2, Minimize2, Plus } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenCreateTask: () => void;
  pageTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenCreateTask,
  pageTitle
}) => {
  const { preferences, toggleTheme, setLayoutDensity } = useSettings();

  const toggleDensity = () => {
    setLayoutDensity(preferences.layoutDensity === 'comfortable' ? 'compact' : 'comfortable');
  };

  return (
    <header className="top-navbar" aria-label="Page header and global controls">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn-icon"
          aria-label="Toggle navigation drawer"
          style={{ display: 'inline-flex' }}
        >
          <Menu size={20} />
        </button>

        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          {pageTitle}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Density Switcher */}
        <button
          type="button"
          onClick={toggleDensity}
          className="btn-icon"
          title={`Switch to ${preferences.layoutDensity === 'comfortable' ? 'Compact' : 'Comfortable'} layout density`}
          aria-label="Toggle layout density"
        >
          {preferences.layoutDensity === 'comfortable' ? (
            <Minimize2 size={18} />
          ) : (
            <Maximize2 size={18} />
          )}
        </button>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${preferences.theme === 'dark' ? 'Light' : 'Dark'} theme`}
          aria-label="Toggle color theme"
        >
          {preferences.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Global New Task Button */}
        <button
          type="button"
          onClick={onOpenCreateTask}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }}
        >
          <Plus size={16} />
          <span className="hide-mobile">New Task</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
