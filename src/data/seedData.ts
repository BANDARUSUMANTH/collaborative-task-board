import { Project, Task, TeamMember } from '../types';

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Sarah Connor',
    email: 'sarah.connor@pulseboard.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Principal Engineer'
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@pulseboard.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Product Designer'
  },
  {
    id: 'user-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@pulseboard.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Frontend Architect'
  },
  {
    id: 'user-4',
    name: 'Marcus Chen',
    email: 'marcus.chen@pulseboard.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'DevOps & Reliability'
  },
  {
    id: 'user-5',
    name: 'Priya Sharma',
    email: 'priya.sharma@pulseboard.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    role: 'QA Specialist'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Cloud Native Microservices Migration',
    description: 'Transition monolithic core services to Kubernetes-orchestrated resilient microservices with OpenTelemetry.',
    owner: 'Sarah Connor',
    status: 'active',
    dueDate: '2026-11-15',
    createdAt: '2026-08-01T09:00:00Z',
    teamMemberIds: ['user-1', 'user-4', 'user-5']
  },
  {
    id: 'proj-2',
    name: 'Enterprise Design System 2.0',
    description: 'Build accessible, token-driven WCAG 2.1 AA compliant UI component library with dark/light themes and zero-runtime CSS.',
    owner: 'Elena Rostova',
    status: 'active',
    dueDate: '2026-10-30',
    createdAt: '2026-08-10T11:00:00Z',
    teamMemberIds: ['user-2', 'user-3', 'user-5']
  },
  {
    id: 'proj-3',
    name: 'AI-Powered Workflow Automation',
    description: 'Integrate real-time task recommendation, natural language search, and automated ticket classification pipelines.',
    owner: 'Alex Rivera',
    status: 'planning',
    dueDate: '2026-12-20',
    createdAt: '2026-09-01T14:30:00Z',
    teamMemberIds: ['user-1', 'user-2', 'user-3']
  },
  {
    id: 'proj-4',
    name: 'Global SOC2 Security Compliance Audit',
    description: 'Implement audit logging, automated vulnerability scanning, and strict role-based access control policies across all endpoints.',
    owner: 'Marcus Chen',
    status: 'review',
    dueDate: '2026-10-10',
    createdAt: '2026-08-15T08:15:00Z',
    teamMemberIds: ['user-4', 'user-5']
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    title: 'Configure Istio Service Mesh with mTLS',
    description: 'Deploy Istio service mesh across primary and secondary clusters to enforce mutual TLS encryption and traffic telemetry.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'user-4',
    dueDate: '2026-10-05',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-24T16:30:00Z'
  },
  {
    id: 'task-102',
    projectId: 'proj-1',
    title: 'Migrate User Authentication Service',
    description: 'Extract JWT auth controller into standalone Go microservice with Redis session caching and rate limiting.',
    status: 'completed',
    priority: 'high',
    assigneeId: 'user-1',
    dueDate: '2026-09-20',
    createdAt: '2026-09-05T09:15:00Z',
    updatedAt: '2026-09-19T17:45:00Z'
  },
  {
    id: 'task-103',
    projectId: 'proj-1',
    title: 'Implement Distributed Tracing via OpenTelemetry',
    description: 'Instrument HTTP and gRPC middleware with OpenTelemetry trace propagators and export traces to Grafana Tempo.',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'user-4',
    dueDate: '2026-10-18',
    createdAt: '2026-09-12T11:20:00Z',
    updatedAt: '2026-09-12T11:20:00Z'
  },
  {
    id: 'task-104',
    projectId: 'proj-2',
    title: 'Build Accessible Modal Dialog with Focus Trap',
    description: 'Ensure modal supports Tab key cycle, Escape key dismissal, aria-modal, and focus restoration to trigger button.',
    status: 'completed',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: '2026-09-22',
    createdAt: '2026-09-08T08:30:00Z',
    updatedAt: '2026-09-21T14:10:00Z'
  },
  {
    id: 'task-105',
    projectId: 'proj-2',
    title: 'Design Dark Mode Color Tokens & Contrast Check',
    description: 'Establish 4.5:1 minimum contrast ratios across all semantic text and interactive surface elements.',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 'user-2',
    dueDate: '2026-10-02',
    createdAt: '2026-09-11T13:40:00Z',
    updatedAt: '2026-09-23T11:00:00Z'
  },
  {
    id: 'task-106',
    projectId: 'proj-2',
    title: 'Add Virtualized List Component for Large Datasets',
    description: 'Implement windowed DOM rendering to smoothly handle tables with 10,000+ items without frame drops.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: '2026-10-14',
    createdAt: '2026-09-15T15:00:00Z',
    updatedAt: '2026-09-15T15:00:00Z'
  },
  {
    id: 'task-107',
    projectId: 'proj-3',
    title: 'Fine-tune BERT Model for Ticket Priority Classification',
    description: 'Prepare training dataset from historical Jira tickets and benchmark accuracy against baseline heuristics.',
    status: 'todo',
    priority: 'low',
    assigneeId: 'user-1',
    dueDate: '2026-11-01',
    createdAt: '2026-09-14T09:00:00Z',
    updatedAt: '2026-09-14T09:00:00Z'
  },
  {
    id: 'task-108',
    projectId: 'proj-4',
    title: 'Perform Automated Penetration Testing on REST APIs',
    description: 'Run OWASP ZAP and custom fuzzing scripts against production staging endpoints to verify zero CVE leaks.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'user-5',
    dueDate: '2026-09-29',
    createdAt: '2026-09-16T12:00:00Z',
    updatedAt: '2026-09-25T10:15:00Z'
  },
  {
    id: 'task-109',
    projectId: 'proj-4',
    title: 'Implement Centralized Audit Logging Pipeline',
    description: 'Stream all mutation API events with client IP, user ID, and diff payload to encrypted AWS S3 storage.',
    status: 'completed',
    priority: 'medium',
    assigneeId: 'user-4',
    dueDate: '2026-09-18',
    createdAt: '2026-09-04T10:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z'
  }
];
