import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectStatus } from '../../types';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit
}) => {
  const { createProject, updateProject, teamMembers } = useTaskBoard();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [dueDate, setDueDate] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const [errors, setErrors] = useState<{ name?: string; owner?: string; dueDate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const initialInputRef = useRef<HTMLInputElement | null>(null);

  const dialogRef = useModalFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    initialFocusRef: initialInputRef,
    closeOnEscape: !isSubmitting
  });

  useEffect(() => {
    if (!isOpen) return;

    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setOwner(projectToEdit.owner);
      setStatus(projectToEdit.status);
      setDueDate(projectToEdit.dueDate);
      setSelectedMemberIds(projectToEdit.teamMemberIds || []);
    } else {
      setName('');
      setDescription('');
      setOwner(teamMembers[0]?.name || 'Admin');
      setStatus('active');
      const defaultDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      setDueDate(defaultDate);
      setSelectedMemberIds(teamMembers.slice(0, 3).map((m) => m.id));
    }
    setErrors({});
    setSubmissionError(null);
  }, [isOpen, projectToEdit, teamMembers]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: { name?: string; owner?: string; dueDate?: string } = {};
    if (!name.trim()) errs.name = 'Project name is required.';
    if (!owner.trim()) errs.owner = 'Project owner is required.';
    if (!dueDate) errs.dueDate = 'Due date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (projectToEdit) {
        await updateProject(projectToEdit.id, {
          name: name.trim(),
          description: description.trim(),
          owner: owner.trim(),
          status,
          dueDate,
          teamMemberIds: selectedMemberIds
        });
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim(),
          owner: owner.trim(),
          status,
          dueDate,
          teamMemberIds: selectedMemberIds
        });
      }
      onClose();
    } catch (err: unknown) {
      setSubmissionError(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="modal-dialog"
      >
        <div className="modal-header">
          <div>
            <h2 id="project-modal-title" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {projectToEdit ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure collaborative project goals, schedule, and team allocation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="btn-icon"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {submissionError && (
              <div
                role="alert"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}
              >
                <AlertCircle size={18} />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="project-name-input" className="form-label">
                <span>Project Name <strong style={{ color: '#ef4444' }}>*</strong></span>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </label>
              <input
                ref={initialInputRef}
                id="project-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NextGen Microservices Platform"
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="project-desc-textarea" className="form-label">
                Project Description
              </label>
              <textarea
                id="project-desc-textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key architectural milestones, team objectives..."
                className="form-textarea"
                disabled={isSubmitting}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="project-owner-input" className="form-label">
                  <span>Project Lead / Owner <strong style={{ color: '#ef4444' }}>*</strong></span>
                  {errors.owner && <span className="form-error">{errors.owner}</span>}
                </label>
                <input
                  id="project-owner-input"
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={`form-input ${errors.owner ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-status-select" className="form-label">
                  Project Status
                </label>
                <select
                  id="project-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="project-due-input" className="form-label">
                <span>Target Completion Due Date <strong style={{ color: '#ef4444' }}>*</strong></span>
                {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
              </label>
              <input
                id="project-due-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`form-input ${errors.dueDate ? 'has-error' : ''}`}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <span className="form-label">Assigned Team Members</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                {teamMembers.map((member) => {
                  const isSelected = selectedMemberIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member.id)}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.75rem', gap: '0.35rem' }}
                    >
                      <img
                        src={member.avatar}
                        alt=""
                        style={{ width: '18px', height: '18px', borderRadius: '50%' }}
                      />
                      <span>{member.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ minWidth: '130px' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>{projectToEdit ? 'Save Changes' : 'Create Project'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
