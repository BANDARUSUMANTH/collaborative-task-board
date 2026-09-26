import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, LayoutDensity, TaskViewMode, UserPreferences } from '../types';

interface SettingsContextType {
  preferences: UserPreferences;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLayoutDensity: (density: LayoutDensity) => void;
  setTaskViewMode: (mode: TaskViewMode) => void;
}

const STORAGE_KEY = 'pulseboard_user_preferences_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  layoutDensity: 'comfortable',
  taskViewMode: 'board'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PREFERENCES;
  });

  // Apply to DOM attributes whenever preferences change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preferences.theme);
    document.documentElement.setAttribute('data-density', preferences.layoutDensity);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  const setTheme = (theme: Theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const toggleTheme = () => {
    setPreferences((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const setLayoutDensity = (layoutDensity: LayoutDensity) => {
    setPreferences((prev) => ({ ...prev, layoutDensity }));
  };

  const setTaskViewMode = (taskViewMode: TaskViewMode) => {
    setPreferences((prev) => ({ ...prev, taskViewMode }));
  };

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        setTheme,
        toggleTheme,
        setLayoutDensity,
        setTaskViewMode
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
