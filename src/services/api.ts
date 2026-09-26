import { Project, Task, TeamMember } from '../types';
import { INITIAL_MEMBERS, INITIAL_PROJECTS, INITIAL_TASKS } from '../data/seedData';

const STORAGE_KEYS = {
  PROJECTS: 'pulseboard_projects_v1',
  TASKS: 'pulseboard_tasks_v1',
  MEMBERS: 'pulseboard_members_v1',
  SIMULATE_ERROR: 'pulseboard_simulate_error',
  LATENCY: 'pulseboard_latency_ms'
};

class MockApiService {
  private simulateError: boolean = false;
  private latencyMs: number = 250;

  constructor() {
    this.loadStateFromStorage();
  }

  private loadStateFromStorage() {
    try {
      const err = localStorage.getItem(STORAGE_KEYS.SIMULATE_ERROR);
      if (err) this.simulateError = JSON.parse(err);
      const lat = localStorage.getItem(STORAGE_KEYS.LATENCY);
      if (lat) this.latencyMs = Number(lat);

      if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      }
    } catch {
      // Fallback for environments where localStorage is unavailable (e.g. some test runners)
    }
  }

  public getSimulateError(): boolean {
    return this.simulateError;
  }

  public setSimulateError(value: boolean) {
    this.simulateError = value;
    try {
      localStorage.setItem(STORAGE_KEYS.SIMULATE_ERROR, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  public getLatency(): number {
    return this.latencyMs;
  }

  public setLatency(ms: number) {
    this.latencyMs = ms;
    try {
      localStorage.setItem(STORAGE_KEYS.LATENCY, String(ms));
    } catch {
      // ignore
    }
  }

  private async delay(): Promise<void> {
    if (this.latencyMs <= 0) return;
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }

  private checkFailure(actionName: string) {
    if (this.simulateError) {
      throw new Error(`[Simulated 500 Network Failure]: ${actionName} failed. The server is temporarily unavailable.`);
    }
  }

  // --- DATA ACCESS HELPERS ---
  private readProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(INITIAL_PROJECTS));
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_PROJECTS));
    }
  }

  private writeProjects(projects: Project[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }

  private readTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(INITIAL_TASKS));
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_TASKS));
    }
  }

  private writeTasks(tasks: Task[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }

  // --- TEAM MEMBERS ---
  public async getTeamMembers(): Promise<TeamMember[]> {
    await this.delay();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return data ? JSON.parse(data) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  }

  // --- PROJECTS API ---
  public async getProjects(): Promise<Project[]> {
    await this.delay();
    this.checkFailure('Fetching projects');
    return this.readProjects();
  }

  public async getProjectById(id: string): Promise<Project | null> {
    await this.delay();
    this.checkFailure(`Fetching project ${id}`);
    const projects = this.readProjects();
    const project = projects.find((p) => p.id === id);
    return project || null;
  }

  public async createProject(data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    await this.delay();
    this.checkFailure('Creating project');
    const projects = this.readProjects();
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    projects.unshift(newProject);
    this.writeProjects(projects);
    return newProject;
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await this.delay();
    this.checkFailure(`Updating project ${id}`);
    const projects = this.readProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Project with id "${id}" not found.`);
    }
    const updated = { ...projects[index], ...updates };
    projects[index] = updated;
    this.writeProjects(projects);
    return updated;
  }

  public async deleteProject(id: string): Promise<void> {
    await this.delay();
    this.checkFailure(`Deleting project ${id}`);
    const projects = this.readProjects().filter((p) => p.id !== id);
    this.writeProjects(projects);

    // Cascade delete associated tasks
    const tasks = this.readTasks().filter((t) => t.projectId !== id);
    this.writeTasks(tasks);
  }

  // --- TASKS API ---
  public async getTasks(projectId?: string): Promise<Task[]> {
    await this.delay();
    this.checkFailure('Fetching tasks');
    const tasks = this.readTasks();
    if (projectId) {
      return tasks.filter((t) => t.projectId === projectId);
    }
    return tasks;
  }

  public async getTaskById(id: string): Promise<Task | null> {
    await this.delay();
    this.checkFailure(`Fetching task ${id}`);
    const tasks = this.readTasks();
    const task = tasks.find((t) => t.id === id);
    return task || null;
  }

  public async createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await this.delay();
    this.checkFailure('Creating task');
    const tasks = this.readTasks();
    const now = new Date().toISOString();
    const newTask: Task = {
      ...data,
      id: `task-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now
    };
    tasks.unshift(newTask);
    this.writeTasks(tasks);
    return newTask;
  }

  public async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await this.delay();
    this.checkFailure(`Updating task ${id}`);
    const tasks = this.readTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id "${id}" was not found.`);
    }
    const updated: Task = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    tasks[index] = updated;
    this.writeTasks(tasks);
    return updated;
  }

  public async deleteTask(id: string): Promise<void> {
    await this.delay();
    this.checkFailure(`Deleting task ${id}`);
    const tasks = this.readTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) {
      throw new Error(`Task with id "${id}" does not exist.`);
    }
    this.writeTasks(filtered);
  }

  // --- PERFORMANCE 1,000 TASKS STRESS TEST GENERATOR (Requirement 10) ---
  public async bulkGenerateTasks(projectId: string, count: number = 1000): Promise<Task[]> {
    await this.delay();
    this.checkFailure('Generating 1,000 tasks');
    const existing = this.readTasks();
    const priorities: Task['priority'][] = ['low', 'medium', 'high'];
    const statuses: Task['status'][] = ['todo', 'in-progress', 'completed'];
    const members = INITIAL_MEMBERS.map((m) => m.id);

    const generated: Task[] = [];
    const baseTime = Date.now();

    for (let i = 1; i <= count; i++) {
      const priority = priorities[i % priorities.length];
      const status = statuses[i % statuses.length];
      const assigneeId = members[i % members.length];
      const dueDate = new Date(baseTime + (i % 60) * 86400000).toISOString().split('T')[0];

      generated.push({
        id: `perf-task-${baseTime}-${i}`,
        projectId,
        title: `[Stress Test #${i}] Automated workload stress item with index ${i}`,
        description: `High-frequency virtualized benchmark task #${i} created to validate sub-millisecond filtering, debouncing, and memoization under 1,000+ item loads.`,
        status,
        priority,
        assigneeId,
        dueDate,
        createdAt: new Date(baseTime - (i % 30) * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    const combined = [...generated, ...existing];
    this.writeTasks(combined);
    return combined;
  }

  // --- SYSTEM RESET ---
  public async resetToSeedData(): Promise<void> {
    await this.delay();
    this.writeProjects(JSON.parse(JSON.stringify(INITIAL_PROJECTS)));
    this.writeTasks(JSON.parse(JSON.stringify(INITIAL_TASKS)));
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    } catch {
      // ignore
    }
  }
}

export const api = new MockApiService();
