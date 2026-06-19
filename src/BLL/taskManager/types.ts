export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string      // YYYY-MM-DD
  assignee: string
  status: TaskStatus
  tags: string[]
  createdAt: string    // ISO string from new Date().toISOString()
}

// Fields the user can set when creating or editing a task.
// Excludes id (auto-generated) and createdAt (auto-generated).
export interface UpdateTaskFields {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string      // YYYY-MM-DD
  assignee: string
  tags: string[]
  status: TaskStatus
}

// Modal form state. Tags is a raw comma-separated string before parsing.
// Differs from UpdateTaskFields because the form input for tags is text, not string[].
export interface FormState {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string      // YYYY-MM-DD — matches <input type="date"> format
  assignee: string
  tags: string         // raw input: "backend, auth, ux"
  status: TaskStatus
}

// Active view type — used by useLocalStorage and ViewToggle.
export type ViewType = 'kanban' | 'list'

// Sort parameters — passed to getFilteredAndSortedTasks().
export interface SortState {
  by: 'dueDate' | 'priority'
  direction: 'asc' | 'desc'
}

// Filter parameters — passed to getFilteredAndSortedTasks().
export interface FilterState {
  priority?: TaskPriority
  assignee?: string
}
