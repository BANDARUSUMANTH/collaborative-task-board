import React, { useState, useEffect } from 'react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, Filter, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { TaskStatus, Priority, SortField } from '../../types';

interface TaskFiltersBarProps {
  onOpenStressTestModal?: () => void;
}

export const TaskFiltersBar: React.FC<TaskFiltersBarProps> = ({ onOpenStressTestModal }) => {
  const { filters, setFilter, clearFilters, teamMembers } = useTaskBoard();

  // Local search text with debouncing
  const [searchTerm, setSearchTerm] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Sync debounced search to global filter state
  useEffect(() => {
    setFilter('searchQuery', debouncedSearch);
  }, [debouncedSearch, setFilter]);

  // Keep local search term updated if filters are reset externally
  useEffect(() => {
    setSearchTerm(filters.searchQuery);
  }, [filters.searchQuery]);

  // Compute active filters count
  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.priority !== 'all' ? 1 : 0) +
    (filters.assigneeId !== 'all' ? 1 : 0);

  return (
    <div
      className="card"
      style={{
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      {/* Top row: Search input + Stress test quick action */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            id="task-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title (debounced)..."
            aria-label="Search tasks by title"
            className="form-input"
            style={{ paddingLeft: '2.5rem', paddingRight: searchTerm ? '2.5rem' : '1rem' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilter('searchQuery', '');
              }}
              className="btn-icon"
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0.2rem'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {onOpenStressTestModal && (
          <button
            type="button"
            onClick={onOpenStressTestModal}
            className="btn btn-secondary"
            title="Benchmark 1,000 tasks rendering and filtering (Section 10 Requirement)"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <SlidersHorizontal size={15} />
            <span>1,000 Tasks Benchmark</span>
          </button>
        )}
      </div>

      {/* Filter and Sort Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Filter size={14} /> Filter:
          </span>

          {/* Status Filter */}
          <select
            id="filter-status-select"
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value as TaskStatus | 'all')}
            className="form-select"
            aria-label="Filter by task status"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            id="filter-priority-select"
            value={filters.priority}
            onChange={(e) => setFilter('priority', e.target.value as Priority | 'all')}
            className="form-select"
            aria-label="Filter by task priority"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Assignee Filter */}
          <select
            id="filter-assignee-select"
            value={filters.assigneeId}
            onChange={(e) => setFilter('assigneeId', e.target.value)}
            className="form-select"
            aria-label="Filter by team member assignee"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
          >
            <option value="all">All Assignees</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <ArrowUpDown size={14} /> Sort:
          </span>

          <select
            id="sort-by-select"
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value as SortField)}
            className="form-select"
            aria-label="Sort tasks by"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setFilter('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')
            }
            className="btn btn-secondary btn-sm"
            aria-label={`Sort direction: ${filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
            title="Toggle sort direction"
          >
            {filters.sortDirection.toUpperCase()}
          </button>

          {/* Clear Filters Action */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-ghost btn-sm"
              style={{ color: '#ef4444', fontWeight: 600 }}
              aria-label="Clear all active filters"
            >
              Clear Filters ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips / Indicators */}
      {activeFiltersCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
            paddingTop: '0.4rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active filters:</span>

          {filters.searchQuery && (
            <span className="badge" style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}>
              Query: "{filters.searchQuery}"
              <X
                size={12}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearchTerm('');
                  setFilter('searchQuery', '');
                }}
              />
            </span>
          )}

          {filters.status !== 'all' && (
            <span className={`badge badge-${filters.status}`}>
              Status: {filters.status}
              <X
                size={12}
                style={{ cursor: 'pointer' }}
                onClick={() => setFilter('status', 'all')}
              />
            </span>
          )}

          {filters.priority !== 'all' && (
            <span className={`badge badge-${filters.priority}`}>
              Priority: {filters.priority}
              <X
                size={12}
                style={{ cursor: 'pointer' }}
                onClick={() => setFilter('priority', 'all')}
              />
            </span>
          )}

          {filters.assigneeId !== 'all' && (
            <span className="badge" style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-primary)' }}>
              Assignee: {teamMembers.find((m) => m.id === filters.assigneeId)?.name || filters.assigneeId}
              <X
                size={12}
                style={{ cursor: 'pointer' }}
                onClick={() => setFilter('assigneeId', 'all')}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
