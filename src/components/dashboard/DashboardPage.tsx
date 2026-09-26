import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTaskBoard } from '../../context/TaskBoardContext';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Activity
} from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export const DashboardPage: React.FC<{ onOpenCreateTask: () => void }> = ({ onOpenCreateTask }) => {
  const { projects, tasks, teamMembers, isLoading, error, reloadAll } = useTaskBoard();

  // Metrics computation with useMemo
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recently updated tasks (top 6 sorted by updatedAt desc)
    const recentTasks = [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);

    // Project progress breakdown
    const projectProgressList = projects.map((p) => {
      const pTasks = tasks.filter((t) => t.projectId === p.id);
      const pDone = pTasks.filter((t) => t.status === 'completed').length;
      const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;
      return {
        ...p,
        totalTasks: pTasks.length,
        doneTasks: pDone,
        percentage: pct
      };
    });

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      highPriorityTasks,
      overallProgress,
      recentTasks,
      projectProgressList
    };
  }, [projects, tasks]);

  const memberMap = useMemo(() => {
    const map = new Map();
    teamMembers.forEach((m) => map.set(m.id, m));
    return map;
  }, [teamMembers]);

  const projectMap = useMemo(() => {
    const map: Record<string, string> = {};
    projects.forEach((p) => (map[p.id] = p.name));
    return map;
  }, [projects]);

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <EmptyState
          type="error"
          title="Failed to load dashboard metrics"
          description={error}
          onAction={reloadAll}
          actionLabel="Retry Dashboard Loading"
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Executive Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Operations Dashboard
            </h2>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                borderColor: 'rgba(16, 185, 129, 0.3)'
              }}
            >
              <Activity size={12} /> Real-time
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            High-level overview of project velocity, pending workloads, and critical priorities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onOpenCreateTask}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards Grid (Requirement Section 1 & 3) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Total Projects */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              TOTAL PROJECTS
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FolderKanban size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{metrics.totalProjects}</div>
          <Link
            to="/projects"
            style={{
              fontSize: '0.75rem',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <span>View all projects</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Total Tasks */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              TOTAL TASKS
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckSquare size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{metrics.totalTasks}</div>
          <Link
            to="/tasks"
            style={{
              fontSize: '0.75rem',
              color: '#3b82f6',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <span>Explore task backlog</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Completed Tasks */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              COMPLETED TASKS
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981' }}>
            {metrics.completedTasks}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {metrics.overallProgress}% overall completion
          </span>
        </div>

        {/* Pending Tasks */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              PENDING TASKS
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f59e0b' }}>
            {metrics.pendingTasks}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {metrics.inProgressTasks} currently in-progress
          </span>
        </div>

        {/* High-Priority Tasks */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              HIGH PRIORITY
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertCircle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ef4444' }}>
            {metrics.highPriorityTasks}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requires immediate focus</span>
        </div>
      </div>

      {/* Main Grid: Project Progress Breakdown + Recently Updated Tasks Feed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Project Progress Overview (Requirement Section 3) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Project Progress Overview</h3>
            </div>
            <Link
              to="/projects"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}
            >
              All Projects
            </Link>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time delivery progress per project without opening each individual backlog.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginTop: '0.5rem' }}>
            {metrics.projectProgressList.map((project) => (
              <div key={project.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.35rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                    className="hover-underline"
                  >
                    {project.name}
                  </Link>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {project.percentage}% ({project.doneTasks}/{project.totalTasks})
                  </span>
                </div>

                <div
                  style={{
                    height: '8px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--bg-app)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${project.percentage}%`,
                      background:
                        project.percentage === 100
                          ? '#10b981'
                          : 'linear-gradient(90deg, #4f46e5 0%, #38bdf8 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Updated Tasks Feed (Requirement Section 3) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#3b82f6" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recently Updated Tasks</h3>
            </div>
            <Link
              to="/tasks"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}
            >
              View Board
            </Link>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Latest updates and status changes across the team.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {metrics.recentTasks.map((task) => {
              const assignee = memberMap.get(task.assigneeId);
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className={`badge badge-${task.status}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        {task.status}
                      </span>
                      <span className={`badge badge-${task.priority}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        {task.priority}
                      </span>
                    </div>

                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </div>

                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      Project: {projectMap[task.projectId] || 'General'}
                    </div>
                  </div>

                  {assignee && (
                    <img
                      src={assignee.avatar}
                      alt={assignee.name}
                      title={assignee.name}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
