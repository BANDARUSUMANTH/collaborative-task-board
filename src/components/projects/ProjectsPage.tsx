import React, { useState } from 'react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { ProjectDeleteModal } from './ProjectDeleteModal';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { Project } from '../../types';
import { Plus, Search } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, tasks, teamMembers, isLoading, error, reloadAll } = useTaskBoard();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    if (searchQuery.trim() && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && project.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
  };

  return (
    <div className="page-wrapper">
      {/* Top Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Project Portfolio</h2>
            <span
              className="badge"
              style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', fontWeight: 700 }}
            >
              {projects.length} Total
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Oversee collaborative roadmaps, member assignments, and completion milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name..."
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState
          type="error"
          title="Could not load projects"
          description={error}
          onAction={reloadAll}
          actionLabel="Retry Loading"
        />
      ) : projects.length === 0 ? (
        <EmptyState
          type="no-projects"
          onAction={handleOpenCreate}
          actionLabel="Create First Project"
        />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          type="no-search-results"
          searchQuery={searchQuery}
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
          actionLabel="Clear Filters"
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks}
              teamMembers={teamMembers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      <ProjectDeleteModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        project={projectToDelete}
      />
    </div>
  );
};
