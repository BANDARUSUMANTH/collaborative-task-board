import React from 'react';
import { BrowserRouter, Routes, Route, useOutletContext } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ProjectsPage } from './components/projects/ProjectsPage';
import { ProjectDetailPage } from './components/projects/ProjectDetailPage';
import { TasksPage } from './components/tasks/TasksPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { NotFoundPage } from './components/common/NotFoundPage';
import { TaskBoardProvider } from './context/TaskBoardContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';

// Helper component to pass layout context to DashboardPage
const DashboardWrapper: React.FC = () => {
  const context = useOutletContext<{ onOpenCreateTask: () => void }>();
  return <DashboardPage onOpenCreateTask={context?.onOpenCreateTask || (() => {})} />;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <SettingsProvider>
        <TaskBoardProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<DashboardWrapper />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TaskBoardProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};

export default App;
