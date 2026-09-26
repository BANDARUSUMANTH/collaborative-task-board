import React from 'react';
import { Task, TeamMember } from '../../types';
import { Edit2, Trash2, Calendar, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface TaskTableViewProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  projectMap: Record<string, string>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export const TaskTableView: React.FC<TaskTableViewProps> = ({
  tasks,
  teamMembers,
  projectMap,
  onEditTask,
  onDeleteTask,
  onStatusChange
}) => {
  const memberMap = React.useMemo(() => {
    const map = new Map<string, TeamMember>();
    teamMembers.forEach((m) => map.set(m.id, m));
    return map;
  }, [teamMembers]);

  return (
    <div
      className="card"
      style={{
        overflowX: 'auto',
        padding: 0,
        borderRadius: 'var(--radius-xl)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--bg-app)',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Task Title</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Project</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Priority</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Assignee</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Due Date</th>
            <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const assignee = memberMap.get(task.assigneeId);
            const isOverdue =
              task.status !== 'completed' &&
              Boolean(task.dueDate) &&
              new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

            return (
              <tr
                key={task.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.15s ease'
                }}
                className="table-row-hover"
              >
                {/* Title */}
                <td style={{ padding: 'var(--table-padding-y) 1.25rem', maxWidth: '300px' }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      opacity: task.status === 'completed' ? 0.75 : 1
                    }}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {task.description}
                    </div>
                  )}
                </td>

                {/* Project */}
                <td style={{ padding: 'var(--table-padding-y) 1rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {projectMap[task.projectId] || 'General'}
                  </span>
                </td>

                {/* Status Switcher */}
                <td style={{ padding: 'var(--table-padding-y) 1rem' }}>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task, e.target.value as Task['status'])}
                    className="form-select"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.5rem',
                      width: 'auto',
                      fontWeight: 600
                    }}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>

                {/* Priority */}
                <td style={{ padding: 'var(--table-padding-y) 1rem' }}>
                  <span className={`badge badge-${task.priority}`}>
                    {task.priority === 'high' ? (
                      <AlertCircle size={12} />
                    ) : task.priority === 'medium' ? (
                      <Clock size={12} />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    <span>{task.priority}</span>
                  </span>
                </td>

                {/* Assignee */}
                <td style={{ padding: 'var(--table-padding-y) 1rem' }}>
                  {assignee ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <img
                        src={assignee.avatar}
                        alt={assignee.name}
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{assignee.name}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unassigned</span>
                  )}
                </td>

                {/* Due Date */}
                <td style={{ padding: 'var(--table-padding-y) 1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.8rem',
                      color: isOverdue ? '#ef4444' : 'var(--text-secondary)',
                      fontWeight: isOverdue ? 700 : 500
                    }}
                  >
                    <Calendar size={13} />
                    <span>{task.dueDate}</span>
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: 'var(--table-padding-y) 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="btn-icon"
                      title="Edit task"
                      aria-label={`Edit ${task.title}`}
                      style={{ padding: '0.25rem' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task)}
                      className="btn-icon"
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                      style={{ padding: '0.25rem', color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <style>{`
        .table-row-hover:hover {
          background-color: var(--bg-card-hover);
        }
      `}</style>
    </div>
  );
};
