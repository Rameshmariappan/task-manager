import { mockTasks } from './mockData'
import {
  FilterState,
  SortState,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskFields,
} from './types'

// Priority ordinal for sort — typed as Record<TaskPriority, number> so TypeScript
// enforces completeness if TaskPriority gains a new value.
const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 }

// new Date('YYYY-MM-DD') parses as UTC midnight, which is wrong in UTC+ timezones.
// Constructing with numeric parts gives local midnight instead.
function parseDateInputAsLocal(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed
}

export class TaskManager {
  #tasks: Task[]
  #onUpdate: () => void

  constructor(onUpdate: () => void) {
    this.#onUpdate = onUpdate
    // Deep-copy mock data so mutations don't affect the source array
    this.#tasks = mockTasks.map((t) => ({ ...t, tags: [...t.tags] }))
  }

  getTasks(): Task[] {
    return [...this.#tasks]
  }

  addTask(fields: UpdateTaskFields): void {
    const newTask: Task = {
      ...fields,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    this.#tasks.push(newTask)
    this.#onUpdate()
  }

  updateTask(id: string, fields: Partial<UpdateTaskFields>): void {
    this.#tasks = this.#tasks.map((task) =>
      task.id === id ? { ...task, ...fields } : task
    )
    this.#onUpdate()
  }

  deleteTask(id: string): void {
    this.#tasks = this.#tasks.filter((task) => task.id !== id)
    this.#onUpdate()
  }

  moveTo(id: string, newStatus: TaskStatus): void {
    this.#tasks = this.#tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    )
    this.#onUpdate()
  }

  getFilteredAndSortedTasks(filters: FilterState, sort?: SortState): Task[] {
    let result = [...this.#tasks]

    // Apply priority filter
    if (filters.priority !== undefined) {
      result = result.filter((task) => task.priority === filters.priority)
    }

    // Apply assignee filter
    if (filters.assignee !== undefined) {
      result = result.filter((task) => task.assignee === filters.assignee)
    }

    // Apply sort (optional)
    if (sort !== undefined) {
      result.sort((a, b) => {
        if (sort.by === 'dueDate') {
          const dateA = parseDateInputAsLocal(a.dueDate).getTime()
          const dateB = parseDateInputAsLocal(b.dueDate).getTime()
          return sort.direction === 'asc' ? dateA - dateB : dateB - dateA
        } else {
          // sort.by === 'priority'
          const orderA = PRIORITY_ORDER[a.priority]
          const orderB = PRIORITY_ORDER[b.priority]
          return sort.direction === 'asc' ? orderA - orderB : orderB - orderA
        }
      })
    }

    return result
  }

  isOverdue(task: Task): boolean {
    if (task.status === 'done') return false
    const due = parseDateInputAsLocal(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return due < today
  }
}
