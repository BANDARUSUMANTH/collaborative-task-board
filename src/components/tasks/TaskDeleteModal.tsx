import React, { useState } from 'react';
import { Task } from '../../types';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface TaskDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskDeleteModal: React.FC<TaskDeleteModalProps> = ({ isOpen, onClose, task }) => {
  const { deleteTask } = useTaskBoard();
  const [isDeleting, setIsDeleting] = useState(false);

  const dialogRef = useModalFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    closeOnEscape: !isDeleting
  });

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onClose();
    } catch {
      // toast will display error
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
        aria-labelledby="delete-dialog-title"
        className="modal-dialog"
        style={{ maxWidth: '440px' }}
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

          <h3 id="delete-dialog-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Delete Task?
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: 'var(--text-primary)' }}>"{task.title}"</strong>? This action will remove the item from the project backlog.
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
