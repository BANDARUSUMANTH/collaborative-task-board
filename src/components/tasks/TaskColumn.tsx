import React from 'react';
import { Task, TeamMember, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  teamMembers: TeamMember[];
  projectMap: Record<string, string>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onDropTask?: (taskId: string, targetStatus: TaskStatus) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  teamMembers,
  projectMap,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onDropTask
}) => {
  const memberMap = React.useMemo(() => {
    const map = new Map<string, TeamMember>();
    teamMembers.forEach((m) => map.set(m.id, m));
    return map;
  }, [teamMembers]);

  let accentColor = '#64748b';
  if (status === 'in-progress') accentColor = '#3b82f6';
  if (status === 'completed') accentColor = '#10b981';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('column-drag-hover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('column-drag-hover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('column-drag-hover');
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onDropTask) {
      onDropTask(taskId, status);
    }
  };

  return (
    <section
      aria-label={`${title} Column`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: 1,
        minWidth: '300px',
        backgroundColor: 'var(--bg-app)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 260px)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, background-color 0.2s ease'
      }}
    >
      {/* Column Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}80`
            }}
          />
          <h3 style={{ fontSize: '0.975rem', fontWeight: 700 }}>{title}</h3>
        </div>

        <span
          className="badge"
          style={{
            backgroundColor: 'var(--bg-app)',
            color: 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Column Body / Scroll Area */}
      <div
        style={{
          padding: '1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          flex: 1
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            No tasks in {title.toLowerCase()}
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', task.id);
              }}
              style={{ cursor: 'grab' }}
            >
              <TaskCard
                task={task}
                assignee={memberMap.get(task.assigneeId)}
                projectName={projectMap[task.projectId]}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            </div>
          ))
        )}
      </div>

      <style>{`
        .column-drag-hover {
          border-color: var(--accent-primary) !important;
          background-color: var(--accent-light) !important;
        }
      `}</style>
    </section>
  );
};
