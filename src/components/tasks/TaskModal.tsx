import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../../types';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import { X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultProjectId?: string;
}

interface FormErrors {
  title?: string;
  projectId?: string;
  assigneeId?: string;
  dueDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultProjectId
}) => {
  const { projects, teamMembers, createTask, updateTask } = useTaskBoard();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const initialInputRef = useRef<HTMLInputElement | null>(null);

  // Focus trap hook for accessibility (Requirement 5 & 11)
  const dialogRef = useModalFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    initialFocusRef: initialInputRef,
    closeOnEscape: !isSubmitting
  });

  // Populate or reset form fields on open or when taskToEdit changes
  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setProjectId(taskToEdit.projectId);
      setAssigneeId(taskToEdit.assigneeId);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId || (projects.length > 0 ? projects[0].id : ''));
      setAssigneeId(teamMembers.length > 0 ? teamMembers[0].id : '');
      setStatus('todo');
      setPriority('medium');
      const defaultDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
      setDueDate(defaultDate);
    }
    setErrors({});
    setSubmissionError(null);
  }, [isOpen, taskToEdit]);

  // Synchronize options if they load asynchronously while create modal is open
  useEffect(() => {
    if (isOpen && !taskToEdit) {
      if (!projectId && (defaultProjectId || projects.length > 0)) {
        setProjectId(defaultProjectId || projects[0]?.id || '');
      }
      if (!assigneeId && teamMembers.length > 0) {
        setAssigneeId(teamMembers[0]?.id || '');
      }
    }
  }, [isOpen, taskToEdit, defaultProjectId, projects, teamMembers, projectId, assigneeId]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }

    if (!projectId) {
      newErrors.projectId = 'Please select a project.';
    }

    if (!assigneeId) {
      newErrors.assigneeId = 'Please select an assignee.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent duplicate submissions

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          projectId,
          assigneeId,
          status,
          priority,
          dueDate
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          projectId,
          assigneeId,
          status,
          priority,
          dueDate
        });
      }

      // Close modal on success
      onClose();
    } catch (err: unknown) {
      // PRESERVE FORM DATA ON FAILURE (Requirement 5)
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to save task. Your form input has been preserved.';
      setSubmissionError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="modal-dialog"
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 id="task-modal-title" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {taskToEdit
                ? 'Update task parameters, assignment or status'
                : 'Define task details and assign to a team collaborator'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Server / Network Error Banner */}
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
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{submissionError}</span>
              </div>
            )}

            {/* Task Title */}
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                <span>Task Title <strong style={{ color: '#ef4444' }}>*</strong></span>
                {errors.title && (
                  <span id="title-error" className="form-error">
                    {errors.title}
                  </span>
                )}
              </label>
              <input
                ref={initialInputRef}
                id="task-title-input"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. Implement resilient circuit breaker pattern"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
                disabled={isSubmitting}
              />
            </div>

            {/* Project Select & Assignee Select (Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="task-project-select" className="form-label">
                  <span>Project <strong style={{ color: '#ef4444' }}>*</strong></span>
                  {errors.projectId && (
                    <span id="project-error" className="form-error">{errors.projectId}</span>
                  )}
                </label>
                <select
                  id="task-project-select"
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    if (errors.projectId) setErrors((prev) => ({ ...prev, projectId: undefined }));
                  }}
                  className={`form-select ${errors.projectId ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={!!errors.projectId}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-assignee-select" className="form-label">
                  <span>Assignee <strong style={{ color: '#ef4444' }}>*</strong></span>
                  {errors.assigneeId && (
                    <span id="assignee-error" className="form-error">{errors.assigneeId}</span>
                  )}
                </label>
                <select
                  id="task-assignee-select"
                  value={assigneeId}
                  onChange={(e) => {
                    setAssigneeId(e.target.value);
                    if (errors.assigneeId) setErrors((prev) => ({ ...prev, assigneeId: undefined }));
                  }}
                  className={`form-select ${errors.assigneeId ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={!!errors.assigneeId}
                >
                  <option value="">Select Assignee</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status, Priority, Due Date (3 columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="task-status-select" className="form-label">
                  Status
                </label>
                <select
                  id="task-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-priority-select" className="form-label">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task['priority'])}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-duedate-input" className="form-label">
                  <span>Due Date <strong style={{ color: '#ef4444' }}>*</strong></span>
                  {errors.dueDate && (
                    <span id="duedate-error" className="form-error">{errors.dueDate}</span>
                  )}
                </label>
                <input
                  id="task-duedate-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
                  }}
                  className={`form-input ${errors.dueDate ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={!!errors.dueDate}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="task-desc-textarea" className="form-label">
                Task Description
              </label>
              <textarea
                id="task-desc-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide architectural context, acceptance criteria, or links..."
                className="form-textarea"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer Controls */}
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
                  <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
