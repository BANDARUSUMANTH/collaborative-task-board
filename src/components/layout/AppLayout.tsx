import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { NetworkDiagnosticsBar } from './NetworkDiagnosticsBar';
import { ToastContainer } from '../common/ToastContainer';
import { TaskModal } from '../tasks/TaskModal';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const location = useLocation();

  // Dynamic header title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/projects/') && path.length > 10) return 'Project Details';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/tasks')) return 'Task Board';
    if (path.startsWith('/settings')) return 'Preferences';
    return 'Collaborative Task Board';
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* API Diagnostics & Simulation Control Bar */}
        <NetworkDiagnosticsBar />

        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          pageTitle={getPageTitle()}
        />

        {/* Route Page Body */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet context={{ onOpenCreateTask: () => setIsCreateTaskOpen(true) }} />
        </main>
      </div>

      {/* Global Accessible Task Creation Modal */}
      <TaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />

      {/* Accessible Notifications Toast Stack */}
      <ToastContainer />
    </div>
  );
};
