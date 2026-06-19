import { Task } from './types'

// Mock data satisfying all constraints (R06–R11):
// - ≥ 10 tasks total
// - ≥ 3 todo, ≥ 3 in-progress, ≥ 3 done
// - ≥ 3 high, ≥ 3 medium, ≥ 3 low priority
// - ≥ 3 overdue (past dueDate AND status !== 'done')
// - ≥ 4 distinct full-name assignees
// - ≥ 6 tasks with tags
//
// Today's date (when this was written): 2026-06-18
// Overdue candidates: dueDate < 2026-06-18 AND status !== 'done'

export const mockTasks: Task[] = [
  // ---- TODO (5 tasks, 3 overdue) ----
  {
    id: 'task-001',
    title: 'Design authentication flow for mobile app',
    description:
      'Create wireframes and high-fidelity mockups for the sign-in, sign-up, and password reset screens. Ensure the flow handles OAuth providers and MFA.',
    priority: 'high',
    dueDate: '2026-05-10', // overdue
    assignee: 'Alice Johnson',
    status: 'todo',
    tags: ['design', 'auth', 'mobile'],
    createdAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'task-002',
    title: 'Implement pagination for task list API',
    description:
      'Add cursor-based pagination to the GET /tasks endpoint. Include total count, next cursor, and limit parameters.',
    priority: 'medium',
    dueDate: '2026-05-20', // overdue
    assignee: 'Bob Smith',
    status: 'todo',
    tags: ['backend', 'api', 'performance'],
    createdAt: '2026-04-05T10:30:00.000Z',
  },
  {
    id: 'task-003',
    title: 'Write unit tests for TaskManager class',
    description:
      'Cover all public methods with Jest tests: addTask, updateTask, deleteTask, moveTo, getFilteredAndSortedTasks, isOverdue.',
    priority: 'high',
    dueDate: '2026-06-01', // overdue
    assignee: 'Carol Davis',
    status: 'todo',
    tags: ['testing', 'backend'],
    createdAt: '2026-04-10T08:00:00.000Z',
  },
  {
    id: 'task-004',
    title: 'Set up CI/CD pipeline with GitHub Actions',
    description:
      'Configure automated testing, linting, and deployment to staging on every push to main. Include Slack notification on build failure.',
    priority: 'low',
    dueDate: '2026-07-15',
    assignee: 'David Lee',
    status: 'todo',
    tags: ['devops', 'ci-cd'],
    createdAt: '2026-04-15T14:00:00.000Z',
  },
  {
    id: 'task-005',
    title: 'Update README with setup instructions',
    description:
      'Document local development setup, environment variables, and architecture overview for new contributors.',
    priority: 'low',
    dueDate: '2026-07-30',
    assignee: 'Alice Johnson',
    status: 'todo',
    tags: [],
    createdAt: '2026-04-20T11:00:00.000Z',
  },

  // ---- IN PROGRESS (4 tasks, 1 overdue) ----
  {
    id: 'task-006',
    title: 'Build Kanban board drag-and-drop',
    description:
      'Implement native HTML5 DnD for reordering tasks between columns. Handle dragover, dragleave (relatedTarget guard), and drop events correctly.',
    priority: 'high',
    dueDate: '2026-06-10', // overdue (in-progress + past date)
    assignee: 'Carol Davis',
    status: 'in-progress',
    tags: ['frontend', 'ux', 'interaction'],
    createdAt: '2026-04-22T09:30:00.000Z',
  },
  {
    id: 'task-007',
    title: 'Integrate Stripe payment gateway',
    description:
      'Add subscription billing with Stripe Checkout. Handle webhooks for payment success, failure, and cancellation events.',
    priority: 'high',
    dueDate: '2026-07-01',
    assignee: 'Bob Smith',
    status: 'in-progress',
    tags: ['payments', 'backend', 'integration'],
    createdAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'task-008',
    title: 'Implement real-time notifications',
    description:
      'Use WebSockets to push task assignment and deadline reminders to connected clients. Fallback to polling every 30s if WebSocket is unavailable.',
    priority: 'medium',
    dueDate: '2026-07-20',
    assignee: 'David Lee',
    status: 'in-progress',
    tags: ['websockets', 'realtime', 'notifications'],
    createdAt: '2026-05-05T10:00:00.000Z',
  },
  {
    id: 'task-009',
    title: 'Optimize database queries for dashboard',
    description:
      'Profile slow queries on the dashboard overview page. Add indexes, rewrite N+1 queries, and implement query result caching with Redis.',
    priority: 'medium',
    dueDate: '2026-08-01',
    assignee: 'Alice Johnson',
    status: 'in-progress',
    tags: ['performance', 'database'],
    createdAt: '2026-05-10T09:00:00.000Z',
  },

  // ---- DONE (4 tasks — past dates should NOT show as overdue) ----
  {
    id: 'task-010',
    title: 'Set up project scaffolding',
    description:
      'Initialize Next.js 16 project with TypeScript, Tailwind CSS v4, shadcn/ui, and ESLint. Configure path aliases and directory structure.',
    priority: 'high',
    dueDate: '2026-04-15', // past, but done → not overdue
    assignee: 'Bob Smith',
    status: 'done',
    tags: ['setup', 'devops'],
    createdAt: '2026-04-01T08:00:00.000Z',
  },
  {
    id: 'task-011',
    title: 'Design system colour tokens',
    description:
      'Define all CSS custom properties for priority colours, status colours, and surface backgrounds in the @theme block.',
    priority: 'medium',
    dueDate: '2026-04-20', // past, done → not overdue
    assignee: 'Carol Davis',
    status: 'done',
    tags: ['design', 'css'],
    createdAt: '2026-04-05T09:00:00.000Z',
  },
  {
    id: 'task-012',
    title: 'Create domain type definitions',
    description:
      'Define Task, TaskStatus, TaskPriority, UpdateTaskFields, FormState, ViewType, SortState, and FilterState in types.ts.',
    priority: 'low',
    dueDate: '2026-04-25', // past, done → not overdue
    assignee: 'David Lee',
    status: 'done',
    tags: ['typescript', 'architecture'],
    createdAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'task-013',
    title: 'Deploy staging environment',
    description:
      'Provision a staging server on Vercel, configure environment variables, and run a smoke test against the deployed build.',
    priority: 'medium',
    dueDate: '2026-05-05', // past, done → not overdue
    assignee: 'Alice Johnson',
    status: 'done',
    tags: [],
    createdAt: '2026-04-20T08:00:00.000Z',
  },
]

// Constraint verification (manual):
// Total: 13 tasks ✓ (≥ 10)
// Todo: task-001..005 = 5 ✓ (≥ 3)
// In-progress: task-006..009 = 4 ✓ (≥ 3)
// Done: task-010..013 = 4 ✓ (≥ 3)
//
// High priority: task-001, 003, 006, 007, 010 = 5 ✓ (≥ 3)
// Medium priority: task-002, 008, 009, 011, 013 = 5 ✓ (≥ 3)
// Low priority: task-004, 005, 012 = 3 ✓ (≥ 3)
//
// Overdue (past dueDate + status !== 'done'):
//   task-001: 2026-05-10, todo ✓
//   task-002: 2026-05-20, todo ✓
//   task-003: 2026-06-01, todo ✓
//   task-006: 2026-06-10, in-progress ✓
// = 4 overdue ✓ (≥ 3)
//
// Distinct assignees: Alice Johnson, Bob Smith, Carol Davis, David Lee = 4 ✓ (≥ 4)
//
// Tasks with tags:
//   task-001: ['design','auth','mobile'] ✓
//   task-002: ['backend','api','performance'] ✓
//   task-003: ['testing','backend'] ✓
//   task-004: ['devops','ci-cd'] ✓
//   task-006: ['frontend','ux','interaction'] ✓
//   task-007: ['payments','backend','integration'] ✓
//   task-008: ['websockets','realtime','notifications'] ✓
//   task-009: ['performance','database'] ✓
//   task-010: ['setup','devops'] ✓
//   task-011: ['design','css'] ✓
//   task-012: ['typescript','architecture'] ✓
// = 11 tasks with tags ✓ (≥ 6)
