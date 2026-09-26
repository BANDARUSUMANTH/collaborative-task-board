import React, { useState, useMemo } from 'react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { useSettings } from '../../context/SettingsContext';
import { useTaskFilter } from '../../hooks/useTaskFilter';
import { TaskFiltersBar } from './TaskFiltersBar';
import { TaskColumn } from './TaskColumn';
import { TaskTableView } from './TaskTableView';
import { TaskModal } from './TaskModal';
import { TaskDeleteModal } from './TaskDeleteModal';
import { StressTestModal } from './StressTestModal';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Task, TaskStatus } from '../../types';
import { Kanban, List, Plus, Gauge } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    projects,
    teamMembers,
    isLoading,
    error,
    filters,
    clearFilters,
    updateTask,
    reloadAll
  } = useTaskBoard();

  const { preferences, setTaskViewMode } = useSettings();

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);

  // Map project id to name for quick lookup
  const projectMap = useMemo(() => {
    const map: Record<string, string> = {};
    projects.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [projects]);

  // Memoized filter and sort pipeline
  const { filteredTasks, totalCount, filteredCount, executionTimeMs } = useTaskFilter(tasks, filters);

  // Separate tasks into columns for Kanban board
  const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'todo'), [filteredTasks]);
  const inProgressTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'in-progress'), [filteredTasks]);
  const completedTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'completed'), [filteredTasks]);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    await updateTask(task.id, { status: newStatus });
  };

  const handleDropTask = async (taskId: string, targetStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      await updateTask(task.id, { status: targetStatus });
    }
  };

  // Determine empty state classification
  const isSearchActive = Boolean(filters.searchQuery.trim());
  const isFilterActive =
    filters.status !== 'all' || filters.priority !== 'all' || filters.assigneeId !== 'all';

  return (
    <div className="page-wrapper">
      {/* Top Header: Title + Benchmark speed indicator + View Toggle + Create Task */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Master Task Board</h2>
            <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', fontWeight: 700 }}>
              {filteredCount} of {totalCount} tasks
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Collaborative task management, real-time status transitions, and team workload distribution.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Performance speed indicator */}
          <div
            title={`Filtered ${totalCount} items in ${executionTimeMs.toFixed(2)}ms using useMemo`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}
          >
            <Gauge size={14} color="#10b981" />
            <span>Filter Time: <strong>{executionTimeMs.toFixed(2)}ms</strong></span>
          </div>

          {/* View mode toggle (Board vs Table) */}
          <div
            style={{
              display: 'inline-flex',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              padding: '0.2rem'
            }}
          >
            <button
              type="button"
              onClick={() => setTaskViewMode('board')}
              className={`btn btn-sm ${preferences.taskViewMode === 'board' ? 'btn-primary' : 'btn-ghost'}`}
              aria-label="Kanban board view"
              style={{ padding: '0.3rem 0.6rem' }}
            >
              <Kanban size={15} />
              <span style={{ fontSize: '0.75rem' }}>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setTaskViewMode('table')}
              className={`btn btn-sm ${preferences.taskViewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
              aria-label="Table list view"
              style={{ padding: '0.3rem 0.6rem' }}
            >
              <List size={15} />
              <span style={{ fontSize: '0.75rem' }}>Table</span>
            </button>
          </div>

          {/* Create Task Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter, Search, and Sort Bar */}
      <TaskFiltersBar onOpenStressTestModal={() => setIsStressTestOpen(true)} />

      {/* Content Rendering: Loading / Error / Empty / Active Views */}
      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <EmptyState
          type="error"
          title="Could not retrieve tasks"
          description={error}
          onAction={reloadAll}
          actionLabel="Retry Loading Tasks"
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          type="no-tasks"
          title="No tasks have been created yet"
          description="Click the button below to add your first collaborative task."
          onAction={handleOpenCreateModal}
          actionLabel="Create First Task"
        />
      ) : filteredTasks.length === 0 ? (
        isSearchActive ? (
          <EmptyState
            type="no-search-results"
            searchQuery={filters.searchQuery}
            onAction={clearFilters}
            actionLabel="Reset Search & Filters"
          />
        ) : isFilterActive ? (
          <EmptyState
            type="no-filter-results"
            onAction={clearFilters}
            actionLabel="Clear Active Filters"
          />
        ) : (
          <EmptyState
            type="no-tasks"
            onAction={clearFilters}
            actionLabel="Reset Filters"
          />
        )
      ) : preferences.taskViewMode === 'table' ? (
        <TaskTableView
          tasks={filteredTasks}
          teamMembers={teamMembers}
          projectMap={projectMap}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      ) : (
        /* Kanban Board View */
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '1rem'
          }}
        >
          <TaskColumn
            status="todo"
            title="To Do"
            tasks={todoTasks}
            teamMembers={teamMembers}
            projectMap={projectMap}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            status="in-progress"
            title="In Progress"
            tasks={inProgressTasks}
            teamMembers={teamMembers}
            projectMap={projectMap}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            status="completed"
            title="Completed"
            tasks={completedTasks}
            teamMembers={teamMembers}
            projectMap={projectMap}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onDropTask={handleDropTask}
          />
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <TaskDeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        task={taskToDelete}
      />

      <StressTestModal
        isOpen={isStressTestOpen}
        onClose={() => setIsStressTestOpen(false)}
      />
    </div>
  );
};
