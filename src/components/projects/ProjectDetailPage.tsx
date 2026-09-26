import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { useSettings } from '../../context/SettingsContext';
import { useTaskFilter } from '../../hooks/useTaskFilter';
import { TaskFiltersBar } from '../tasks/TaskFiltersBar';
import { TaskColumn } from '../tasks/TaskColumn';
import { TaskTableView } from '../tasks/TaskTableView';
import { TaskModal } from '../tasks/TaskModal';
import { TaskDeleteModal } from '../tasks/TaskDeleteModal';
import { StressTestModal } from '../tasks/StressTestModal';
import { ProjectModal } from './ProjectModal';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Task, TaskStatus } from '../../types';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Kanban,
  List,
  AlertTriangle
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    projects,
    tasks,
    teamMembers,
    isLoading,
    error,
    filters,
    clearFilters,
    updateTask,
    reloadAll
  } = useTaskBoard();

  const { preferences, setTaskViewMode } = useSettings();

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);

  // Find target project
  const currentProject = projects.find((p) => p.id === id);

  // Filter tasks belonging strictly to this project
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => t.projectId === id);
  }, [tasks, id]);

  // Project map for components
  const projectMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (currentProject) map[currentProject.id] = currentProject.name;
    return map;
  }, [currentProject]);

  // Filter & search memoized
  const { filteredTasks, totalCount, filteredCount, executionTimeMs } = useTaskFilter(projectTasks, filters);

  const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'todo'), [filteredTasks]);
  const inProgressTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'in-progress'), [filteredTasks]);
  const completedTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'completed'), [filteredTasks]);

  // Statistics
  const completedCount = projectTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = projectTasks.filter((t) => t.status === 'in-progress').length;
  const todoCount = projectTasks.filter((t) => t.status === 'todo').length;
  const highPriorityCount = projectTasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;
  const progressPct = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

  const assignedMembers = teamMembers.filter((m) => currentProject?.teamMemberIds?.includes(m.id));

  // Loading & Error states
  if (isLoading) {
    return (
      <div className="page-wrapper">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <EmptyState
          type="error"
          title="Could not load project details"
          description={error}
          onAction={reloadAll}
          actionLabel="Retry Loading"
        />
      </div>
    );
  }

  // Handle invalid project ID (Requirement 13)
  if (!currentProject) {
    return (
      <div className="page-wrapper">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/projects" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', gap: '0.4rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>
        </div>

        <div
          role="alert"
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            maxWidth: '600px',
            margin: '2rem auto'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Project Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            The requested project ID <code style={{ color: 'var(--accent-primary)' }}>"{id}"</code> could not be found in active memory or local storage.
          </p>
          <Link to="/projects" className="btn btn-primary">
            Explore All Projects
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="page-wrapper">
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/projects"
          className="btn btn-ghost btn-sm"
          style={{ display: 'inline-flex', gap: '0.35rem', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          <span>Projects</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentProject?.name}</span>
        </Link>
      </div>

      {/* Project Overview Hero Card */}
      {currentProject && (
        <div
          className="card"
          style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%)',
            border: '1px solid var(--border-strong)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      currentProject.status === 'completed'
                        ? 'var(--color-done-bg)'
                        : 'var(--color-progress-bg)',
                    color:
                      currentProject.status === 'completed'
                        ? 'var(--color-done-text)'
                        : 'var(--color-progress-text)'
                  }}
                >
                  {currentProject.status.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentProject.name}</h2>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {currentProject.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsEditProjectOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Edit2 size={14} />
                <span>Edit Project</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={15} />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Project KPI & Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                PROGRESS
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {progressPct}%
              </div>
              <div
                style={{
                  height: '5px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginTop: '0.35rem'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    backgroundColor: progressPct === 100 ? '#10b981' : 'var(--accent-primary)'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                TASK BREAKDOWN
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                <span style={{ color: 'var(--color-done-text)' }}>{completedCount} Done</span> •{' '}
                <span style={{ color: 'var(--color-progress-text)' }}>{inProgressCount} Active</span> •{' '}
                <span style={{ color: 'var(--color-todo-text)' }}>{todoCount} Todo</span> •{' '}
                <span style={{ color: '#ef4444' }}>{highPriorityCount} High</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                OWNER & DEADLINE
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {currentProject.owner} (Due: {currentProject.dueDate})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                COLLABORATORS
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}>
                {assignedMembers.map((m, idx) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    title={`${m.name} (${m.role})`}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--bg-card)',
                      marginLeft: idx > 0 ? '-6px' : 0
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Filters Bar */}
      <TaskFiltersBar onOpenStressTestModal={() => setIsStressTestOpen(true)} />

      {/* Task View Mode Switcher and Count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Project Tasks</h3>
          <span className="badge" style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
            {filteredCount} of {totalCount} matching
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (Rendered in {executionTimeMs.toFixed(2)}ms)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              aria-label="Board view"
            >
              <Kanban size={14} />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setTaskViewMode('table')}
              className={`btn btn-sm ${preferences.taskViewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
              aria-label="Table view"
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setTaskToEdit(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Task List / Board Area */}
      {projectTasks.length === 0 ? (
        <EmptyState
          type="no-tasks"
          title="No tasks in this project yet"
          description="Get started by organizing work into Todo, In Progress, or Completed tasks."
          onAction={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          actionLabel="Create First Task"
        />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          type="no-filter-results"
          onAction={clearFilters}
          actionLabel="Clear Filters"
        />
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
        <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem' }}>
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
        defaultProjectId={id}
      />

      <TaskDeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        task={taskToDelete}
      />

      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        projectToEdit={currentProject}
      />

      <StressTestModal
        isOpen={isStressTestOpen}
        onClose={() => setIsStressTestOpen(false)}
        defaultProjectId={id}
      />
    </div>
  );
};
