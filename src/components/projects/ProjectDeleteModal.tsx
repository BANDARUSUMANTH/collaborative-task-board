import React, { useState } from 'react';
import { Project } from '../../types';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ProjectDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectDeleteModal: React.FC<ProjectDeleteModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const { deleteProject } = useTaskBoard();
  const [isDeleting, setIsDeleting] = useState(false);

  const dialogRef = useModalFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    closeOnEscape: !isDeleting
  });

  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      onClose();
    } catch {
      // error handled via toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        className="modal-dialog"
        style={{ maxWidth: '450px' }}
      >
        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h3 id="delete-project-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Delete Project?
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{project.name}"</strong>? All associated tasks belonging to this project will be deleted permanently.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="btn btn-secondary"
              style={{ minWidth: '100px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-danger"
              style={{ minWidth: '120px' }}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Deleting...</span>
                </>
              ) : (
                'Confirm Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
