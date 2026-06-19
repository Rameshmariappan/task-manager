import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { TaskManager } from './TaskManager'
import { Task, UpdateTaskFields } from './types'

// Helper: build a minimal valid UpdateTaskFields object
function makeFields(overrides: Partial<UpdateTaskFields> = {}): UpdateTaskFields {
  return {
    title: 'Test Task',
    description: 'A test task description',
    priority: 'medium',
    dueDate: '2099-12-31', // far future — never overdue
    assignee: 'Test User',
    tags: ['test'],
    status: 'todo',
    ...overrides,
  }
}

describe('TaskManager', () => {
  let manager: TaskManager
  let onUpdateSpy: Mock<() => void>

  beforeEach(() => {
    onUpdateSpy = vi.fn()
    manager = new TaskManager(onUpdateSpy)
  })

  // --- Test 1: addTask ---
  describe('addTask()', () => {
    it('adds a task to getTasks(), auto-generates id (UUID) and createdAt, and calls onUpdate once', () => {
      const before = manager.getTasks().length

      manager.addTask(makeFields({ title: 'Brand new task' }))

      const tasks = manager.getTasks()
      expect(tasks.length).toBe(before + 1)

      const added = tasks[tasks.length - 1]
      expect(added.title).toBe('Brand new task')

      // id must be a UUID v4 string
      expect(added.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )

      // createdAt must be a valid ISO string
      expect(() => new Date(added.createdAt).toISOString()).not.toThrow()
      expect(new Date(added.createdAt).toISOString()).toBe(added.createdAt)

      // onUpdate called exactly once
      expect(onUpdateSpy).toHaveBeenCalledTimes(1)
    })
  })

  // --- Test 2: deleteTask ---
  describe('deleteTask()', () => {
    it('removes the task from getTasks() and calls onUpdate once', () => {
      manager.addTask(makeFields({ title: 'Task to delete' }))
      onUpdateSpy.mockClear()

      const tasks = manager.getTasks()
      const target = tasks[tasks.length - 1]

      manager.deleteTask(target.id)

      const afterDelete = manager.getTasks()
      expect(afterDelete.find((t) => t.id === target.id)).toBeUndefined()
      expect(onUpdateSpy).toHaveBeenCalledTimes(1)
    })
  })

  // --- Test 3: isOverdue ---
  describe('isOverdue()', () => {
    function makeTask(overrides: Partial<Task>): Task {
      return {
        id: 'x',
        title: 'T',
        description: '',
        priority: 'medium',
        dueDate: '2020-01-01',
        assignee: 'A',
        status: 'todo',
        tags: [],
        createdAt: new Date().toISOString(),
        ...overrides,
      }
    }

    it('returns true for a past date + todo status', () => {
      expect(manager.isOverdue(makeTask({ dueDate: '2020-01-01', status: 'todo' }))).toBe(true)
    })

    it('returns true for a past date + in-progress status', () => {
      expect(manager.isOverdue(makeTask({ dueDate: '2020-01-01', status: 'in-progress' }))).toBe(true)
    })

    it('returns false for a past date + done status (done tasks are never overdue)', () => {
      expect(manager.isOverdue(makeTask({ dueDate: '2020-01-01', status: 'done' }))).toBe(false)
    })

    it('returns false for a future date + todo status', () => {
      expect(manager.isOverdue(makeTask({ dueDate: '2099-12-31', status: 'todo' }))).toBe(false)
    })

    it('returns false for today (timezone-safe: local midnight, not UTC midnight)', () => {
      // Build today's date as YYYY-MM-DD in LOCAL time
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      const todayStr = `${yyyy}-${mm}-${dd}`

      expect(manager.isOverdue(makeTask({ dueDate: todayStr, status: 'todo' }))).toBe(false)
    })
  })

  // --- Test 4: getTasks() copy isolation ---
  describe('getTasks()', () => {
    it('returns a new array on every call (copy, not the internal reference)', () => {
      const first = manager.getTasks()
      const second = manager.getTasks()

      // Different array references
      expect(first).not.toBe(second)

      // Mutating the returned copy does NOT affect internal state
      first.push({} as Task)
      expect(manager.getTasks().length).toBe(second.length)
    })
  })

  // --- Test 5: getFilteredAndSortedTasks ---
  describe('getFilteredAndSortedTasks()', () => {
    beforeEach(() => {
      // Add controlled tasks for predictable filter/sort testing
      manager.addTask(makeFields({ title: 'High-A', priority: 'high', dueDate: '2099-01-01', assignee: 'Ana' }))
      manager.addTask(makeFields({ title: 'Medium-B', priority: 'medium', dueDate: '2099-06-01', assignee: 'Bob' }))
      manager.addTask(makeFields({ title: 'Low-C', priority: 'low', dueDate: '2099-03-01', assignee: 'Ana' }))
      manager.addTask(makeFields({ title: 'High-D', priority: 'high', dueDate: '2099-02-01', assignee: 'Bob' }))
      onUpdateSpy.mockClear()
    })

    it('returns all tasks when filters is empty {}', () => {
      const all = manager.getFilteredAndSortedTasks({})
      expect(all.length).toBe(manager.getTasks().length)
    })

    it('filters by priority correctly', () => {
      const highOnly = manager.getFilteredAndSortedTasks({ priority: 'high' })
      expect(highOnly.every((t) => t.priority === 'high')).toBe(true)
      expect(highOnly.some((t) => t.priority !== 'high')).toBe(false)
    })

    it('sorts by priority desc: high → medium → low', () => {
      const sorted = manager
        .getFilteredAndSortedTasks({}, { by: 'priority', direction: 'desc' })
        .filter((t) => ['High-A', 'Medium-B', 'Low-C', 'High-D'].includes(t.title))

      const priorities = sorted.map((t) => t.priority)
      // High tasks must appear before medium, which appears before low
      const firstLow = priorities.lastIndexOf('low')
      const firstMedium = priorities.lastIndexOf('medium')
      const firstHigh = priorities.indexOf('high')

      // All highs come before all mediums; all mediums before all lows
      expect(firstHigh).toBeLessThan(firstMedium)
      expect(firstMedium).toBeLessThan(firstLow)
    })

    it('applies both filter and sort in a single call (no component-level logic)', () => {
      // Filter to high only, sort by dueDate asc → High-D (2099-02-01) before High-A (2099-01-01)
      // Wait, High-A is 2099-01-01 so it should come first in asc
      const filtered = manager.getFilteredAndSortedTasks(
        { priority: 'high' },
        { by: 'dueDate', direction: 'asc' }
      )
      // Should only contain high-priority tasks
      expect(filtered.every((t) => t.priority === 'high')).toBe(true)
      // Should be in ascending date order
      const highTasks = filtered.filter((t) => ['High-A', 'High-D'].includes(t.title))
      expect(highTasks.length).toBeGreaterThanOrEqual(2)
      const highA = highTasks.find((t) => t.title === 'High-A')!
      const highD = highTasks.find((t) => t.title === 'High-D')!
      const idxA = highTasks.indexOf(highA)
      const idxD = highTasks.indexOf(highD)
      // High-A (Jan 01) must appear before High-D (Feb 01) when sorted asc
      expect(idxA).toBeLessThan(idxD)
    })
  })
})
