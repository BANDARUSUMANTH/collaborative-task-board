import React from 'react';
import { Link } from 'react-router-dom';
import { Project, Task, TeamMember } from '../../types';
import {
  Calendar,
  User,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  teamMembers: TeamMember[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  teamMembers,
  onEdit,
  onDelete
}) => {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const assignedMembers = teamMembers.filter((m) => project.teamMemberIds?.includes(m.id));

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%'
      }}
    >
      {/* Top Header: Status badge & Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          className="badge"
          style={{
            backgroundColor:
              project.status === 'completed'
                ? 'var(--color-done-bg)'
                : project.status === 'active'
                ? 'var(--color-progress-bg)'
                : 'var(--color-med-bg)',
            color:
              project.status === 'completed'
                ? 'var(--color-done-text)'
                : project.status === 'active'
                ? 'var(--color-progress-text)'
                : 'var(--color-med-text)',
            borderColor:
              project.status === 'completed'
                ? 'var(--color-done-border)'
                : project.status === 'active'
                ? 'var(--color-progress-border)'
                : 'var(--color-med-border)'
          }}
        >
          {project.status.toUpperCase()}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="btn-icon"
            title="Edit project parameters"
            aria-label={`Edit ${project.name}`}
            style={{ padding: '0.25rem' }}
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="btn-icon"
            title="Delete project"
            aria-label={`Delete ${project.name}`}
            style={{ padding: '0.25rem', color: '#ef4444' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Project Title & Description */}
      <div>
        <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              marginBottom: '0.35rem',
              color: 'var(--text-primary)'
            }}
          >
            {project.name}
          </h3>
        </Link>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Progress Bar & Percentage */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.4rem',
            color: 'var(--text-secondary)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={13} /> Completion
          </span>
          <span style={{ color: 'var(--text-primary)' }}>
            {completionPercentage}% ({completedTasks}/{totalTasks} tasks)
          </span>
        </div>

        <div
          style={{
            height: '7px',
            borderRadius: '999px',
            backgroundColor: 'var(--bg-app)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${completionPercentage}%`,
              borderRadius: '999px',
              background:
                completionPercentage === 100
                  ? '#10b981'
                  : 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)',
              transition: 'width 0.5s ease-out'
            }}
          />
        </div>
      </div>

      {/* Owner & Due Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
          marginTop: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <User size={13} />
          <span>Owner: <strong>{project.owner}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Calendar size={13} />
          <span>Due: {project.dueDate}</span>
        </div>
      </div>

      {/* Footer: Member avatars & Open Project Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {assignedMembers.slice(0, 4).map((member, idx) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              title={`${member.name} (${member.role})`}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--bg-card)',
                marginLeft: idx > 0 ? '-8px' : 0
              }}
            />
          ))}
          {assignedMembers.length > 4 && (
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-card)',
                marginLeft: '-8px'
              }}
            >
              +{assignedMembers.length - 4}
            </span>
          )}
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="btn btn-sm btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-primary)', fontWeight: 700 }}
        >
          <span>Open Project</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
