import React, { memo } from 'react';
import { Task, TeamMember } from '../../types';
import {
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  assignee?: TeamMember;
  projectName?: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = memo(
  ({ task, assignee, projectName, onEdit, onDelete, onStatusChange }) => {
    const isOverdue =
      task.status !== 'completed' &&
      Boolean(task.dueDate) &&
      new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

    const getPriorityIcon = () => {
      switch (task.priority) {
        case 'high':
          return <AlertCircle size={13} aria-hidden="true" />;
        case 'medium':
          return <Clock size={13} aria-hidden="true" />;
        case 'low':
        default:
          return <CheckCircle2 size={13} aria-hidden="true" />;
      }
    };

    return (
      <article
        className="card card-interactive"
        aria-labelledby={`task-title-${task.id}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          position: 'relative'
        }}
      >
        {/* Top Header: Project tag + Priority badge + Actions menu */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span
              className={`badge badge-${task.priority}`}
              aria-label={`Priority: ${task.priority}`}
            >
              {getPriorityIcon()}
              <span>{task.priority}</span>
            </span>

            {projectName && (
              <span
                style={{
                  fontSize: '0.725rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  maxWidth: '130px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={projectName}
              >
                {projectName}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="btn-icon"
              title="Edit task"
              aria-label={`Edit ${task.title}`}
              style={{ padding: '0.25rem' }}
            >
              <Edit2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="btn-icon"
              title="Delete task"
              aria-label={`Delete ${task.title}`}
              style={{ padding: '0.25rem', color: '#ef4444' }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h4
          id={`task-title-${task.id}`}
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--text-primary)',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            opacity: task.status === 'completed' ? 0.75 : 1
          }}
        >
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description && (
          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {task.description}
          </p>
        )}

        {/* Meta Footer: Assignee & Due Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: 'auto',
            fontSize: '0.8rem'
          }}
        >
          {/* Assignee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            {assignee ? (
              <>
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--border-subtle)'
                  }}
                />
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    maxWidth: '90px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={assignee.name}
                >
                  {assignee.name}
                </span>
              </>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
            )}
          </div>

          {/* Due Date with overdue alert */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600,
              color: isOverdue ? '#ef4444' : 'var(--text-muted)'
            }}
            title={isOverdue ? 'Overdue task deadline!' : `Due on ${task.dueDate}`}
          >
            <Calendar size={13} />
            <span>{task.dueDate}</span>
          </div>
        </div>

        {/* Quick Status Bar / Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.5rem',
            fontSize: '0.75rem'
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value as Task['status'])}
            aria-label={`Change status for task ${task.title}`}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 700,
              color:
                task.status === 'completed'
                  ? 'var(--color-done-text)'
                  : task.status === 'in-progress'
                  ? 'var(--color-progress-text)'
                  : 'var(--color-todo-text)',
              cursor: 'pointer',
              padding: '0.1rem 0.2rem'
            }}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </article>
    );
  },
  // Custom equality comparison for React.memo to ensure 60fps rendering with 1,000 tasks!
  (prevProps, nextProps) => {
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.title === nextProps.task.title &&
      prevProps.task.description === nextProps.task.description &&
      prevProps.task.status === nextProps.task.status &&
      prevProps.task.priority === nextProps.task.priority &&
      prevProps.task.dueDate === nextProps.task.dueDate &&
      prevProps.task.assigneeId === nextProps.task.assigneeId &&
      prevProps.task.updatedAt === nextProps.task.updatedAt &&
      prevProps.assignee?.id === nextProps.assignee?.id &&
      prevProps.projectName === nextProps.projectName
    );
  }
);
