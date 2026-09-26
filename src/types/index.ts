export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type ProjectStatus = 'planning' | 'active' | 'review' | 'completed' | 'on-hold';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: ProjectStatus;
  dueDate: string;
  createdAt: string;
  teamMemberIds: string[];
}

export type SortField = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  status: TaskStatus | 'all';
  priority: Priority | 'all';
  assigneeId: string | 'all';
  sortBy: SortField;
  sortDirection: SortDirection;
}

export type Theme = 'light' | 'dark';
export type LayoutDensity = 'comfortable' | 'compact';
export type TaskViewMode = 'board' | 'list' | 'table';

export interface UserPreferences {
  theme: Theme;
  layoutDensity: LayoutDensity;
  taskViewMode: TaskViewMode;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NetworkConfig {
  latencyMs: number;
  simulateError: boolean;
}
