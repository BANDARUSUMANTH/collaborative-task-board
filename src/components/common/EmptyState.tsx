import React from 'react';
import { SearchX, FilterX, FolderPlus, AlertCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-search-results' | 'no-filter-results' | 'no-projects' | 'error';
  title?: string;
  description?: string;
  searchQuery?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  searchQuery,
  onAction,
  actionLabel
}) => {
  let icon = <FolderPlus size={48} color="var(--accent-primary)" />;
  let defaultTitle = 'No items found';
  let defaultDesc = 'Get started by creating a new entry.';

  if (type === 'no-search-results') {
    icon = <SearchX size={48} color="var(--text-muted)" />;
    defaultTitle = 'No matching tasks found';
    defaultDesc = searchQuery
      ? `We couldn't find any tasks matching "${searchQuery}". Try checking for typos or searching with different keywords.`
      : 'No tasks matched your search query.';
  } else if (type === 'no-filter-results') {
    icon = <FilterX size={48} color="var(--text-muted)" />;
    defaultTitle = 'No tasks match selected filters';
    defaultDesc = 'Try adjusting your status, priority, or assignee filter parameters to view tasks.';
  } else if (type === 'no-tasks') {
    icon = <FolderPlus size={48} color="var(--accent-primary)" />;
    defaultTitle = 'No tasks in this project yet';
    defaultDesc = 'Create your first task to start organizing work and tracking team progress.';
  } else if (type === 'no-projects') {
    icon = <FolderPlus size={48} color="var(--accent-primary)" />;
    defaultTitle = 'No active projects';
    defaultDesc = 'Start by initiating your first collaborative project workspace.';
  } else if (type === 'error') {
    icon = <AlertCircle size={48} color="#ef4444" />;
    defaultTitle = 'Unable to load content';
    defaultDesc = 'A network or server communication error occurred. Please try again.';
  }

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--bg-card)',
        border: '1px dashed var(--border-strong)',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        {icon}
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        {title || defaultTitle}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          maxWidth: '460px',
          lineHeight: 1.5,
          marginBottom: onAction ? '1.5rem' : 0
        }}
      >
        {description || defaultDesc}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {type === 'error' && <RefreshCw size={16} />}
          {actionLabel || (type === 'error' ? 'Retry Request' : 'Clear Filters')}
        </button>
      )}
    </div>
  );
};
