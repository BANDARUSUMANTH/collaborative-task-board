import { useMemo } from 'react';
import { Task, FilterState } from '../types';

const PRIORITY_WEIGHT: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export function useTaskFilter(tasks: Task[], filters: FilterState) {
  return useMemo(() => {
    const startTime = performance.now();
    const query = filters.searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      // 1. Text search by task title
      if (query && !task.title.toLowerCase().includes(query)) {
        return false;
      }

      // 2. Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // 3. Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // 4. Assignee filter
      if (filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) {
        return false;
      }

      return true;
    });

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'priority') {
        const weightA = PRIORITY_WEIGHT[a.priority] || 0;
        const weightB = PRIORITY_WEIGHT[b.priority] || 0;
        comparison = weightB - weightA; // High priority first by default
      } else if (filters.sortBy === 'dueDate') {
        const timeA = new Date(a.dueDate).getTime() || 0;
        const timeB = new Date(b.dueDate).getTime() || 0;
        comparison = timeA - timeB;
      } else if (filters.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else {
        // createdAt
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        comparison = timeB - timeA;
      }

      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });

    const executionTimeMs = performance.now() - startTime;

    return {
      filteredTasks: filtered,
      totalCount: tasks.length,
      filteredCount: filtered.length,
      executionTimeMs
    };
  }, [tasks, filters]);
}
