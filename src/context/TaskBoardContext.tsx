import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Task, TeamMember, FilterState } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface TaskBoardContextType {
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  // CRUD Task
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  // CRUD Project
  createProject: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  // Benchmark & Reset
  generateStressTestTasks: (projectId: string, count?: number) => Promise<void>;
  resetAllData: () => Promise<void>;
  reloadAll: () => Promise<void>;
  // Network simulation
  simulateError: boolean;
  setSimulateError: (value: boolean) => void;
  latencyMs: number;
  setLatencyMs: (ms: number) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  assigneeId: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc'
};

const TaskBoardContext = createContext<TaskBoardContextType | undefined>(undefined);

export const TaskBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const [simulateError, setSimulateErrorState] = useState<boolean>(api.getSimulateError());
  const [latencyMs, setLatencyMsState] = useState<number>(api.getLatency());

  const { showSuccess, showError, showInfo } = useToast();

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [membersData, projectsData, tasksData] = await Promise.all([
        api.getTeamMembers(),
        api.getProjects(),
        api.getTasks()
      ]);
      setTeamMembers(membersData);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch application data.';
      setError(msg);
      showError('Connection Failure', msg, () => loadAll());
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const setSimulateError = (value: boolean) => {
    api.setSimulateError(value);
    setSimulateErrorState(value);
    showInfo(
      value ? 'Simulated 500 Network Error Activated' : 'Network Mode Normal',
      value
        ? 'Future API requests will simulate server failure to demonstrate error handling.'
        : 'API requests will now succeed normally.'
    );
  };

  const setLatencyMs = (ms: number) => {
    api.setLatency(ms);
    setLatencyMsState(ms);
  };

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // --- TASK ACTIONS ---
  const createTask = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    try {
      const created = await api.createTask(data);
      setTasks((prev) => [created, ...prev]);
      showSuccess('Task Created', `"${created.title}" was added successfully.`);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create task.';
      showError('Creation Error', msg);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    // Optimistic snapshot
    const originalTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );

    try {
      const updated = await api.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showSuccess('Task Updated', `"${updated.title}" has been updated.`);
      return updated;
    } catch (err: unknown) {
      // Rollback on failure
      setTasks(originalTasks);
      const msg = err instanceof Error ? err.message : 'Could not update task.';
      showError('Update Failed', `${msg} Changes have been rolled back.`);
      throw err;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    const originalTasks = [...tasks];
    const taskToDelete = tasks.find((t) => t.id === id);
    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTask(id);
      showSuccess('Task Deleted', `"${taskToDelete?.title || 'Task'}" has been permanently removed.`);
    } catch (err: unknown) {
      // Rollback
      setTasks(originalTasks);
      const msg = err instanceof Error ? err.message : 'Failed to delete task.';
      showError('Deletion Failed', `${msg} The task was restored.`);
      throw err;
    }
  };

  // --- PROJECT ACTIONS ---
  const createProject = async (data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    try {
      const created = await api.createProject(data);
      setProjects((prev) => [created, ...prev]);
      showSuccess('Project Created', `Project "${created.name}" created.`);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create project.';
      showError('Project Creation Failed', msg);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
    const originalProjects = [...projects];
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    try {
      const updated = await api.updateProject(id, updates);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showSuccess('Project Updated', `Project "${updated.name}" updated.`);
      return updated;
    } catch (err: unknown) {
      setProjects(originalProjects);
      const msg = err instanceof Error ? err.message : 'Failed to update project.';
      showError('Project Update Failed', msg);
      throw err;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    const originalProjects = [...projects];
    const originalTasks = [...tasks];
    const projectToDelete = projects.find((p) => p.id === id);

    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));

    try {
      await api.deleteProject(id);
      showSuccess('Project Deleted', `Project "${projectToDelete?.name}" and all associated tasks removed.`);
    } catch (err: unknown) {
      setProjects(originalProjects);
      setTasks(originalTasks);
      const msg = err instanceof Error ? err.message : 'Failed to delete project.';
      showError('Project Deletion Failed', msg);
      throw err;
    }
  };

  // --- STRESS TEST 1,000 TASKS ---
  const generateStressTestTasks = async (projectId: string, count: number = 1000) => {
    setIsLoading(true);
    try {
      const updatedTasks = await api.bulkGenerateTasks(projectId, count);
      setTasks(updatedTasks);
      showSuccess(
        '1,000 Tasks Benchmark Injected',
        `Successfully generated 1,000 tasks for project. Observe smooth 60fps rendering, instant filtering, and sub-millisecond sorting!`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Stress test failed.';
      showError('Stress Test Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAllData = async () => {
    setIsLoading(true);
    try {
      await api.resetToSeedData();
      await loadAll();
      showSuccess('System Reset', 'All projects, tasks, and data restored to default seed state.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed.';
      showError('Reset Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskBoardContext.Provider
      value={{
        projects,
        tasks,
        teamMembers,
        isLoading,
        error,
        filters,
        setFilter,
        clearFilters,
        createTask,
        updateTask,
        deleteTask,
        createProject,
        updateProject,
        deleteProject,
        generateStressTestTasks,
        resetAllData,
        reloadAll: loadAll,
        simulateError,
        setSimulateError,
        latencyMs,
        setLatencyMs
      }}
    >
      {children}
    </TaskBoardContext.Provider>
  );
};

export const useTaskBoard = () => {
  const context = useContext(TaskBoardContext);
  if (!context) {
    throw new Error('useTaskBoard must be used within a TaskBoardProvider');
  }
  return context;
};
