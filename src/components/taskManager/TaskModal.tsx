import { useState, useEffect, useRef } from 'react'
import { Task, TaskStatus, TaskPriority, FormState, UpdateTaskFields } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { parseTagsString } from '@/lib/formUtils'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskToEdit: Task | null
  initialStatus?: TaskStatus
  manager: TaskManager
}

// originalDate: the task's existing due date in edit mode (YYYY-MM-DD).
// If the user hasn't changed it from the original, skip the past-date check —
// consistent with Jira/Asana behaviour: editing other fields should not force
// fixing an already-overdue date.
function validateDueDate(dateString: string, originalDate?: string): string | undefined {
  if (!dateString) return 'Due date is required'
  if (originalDate && dateString === originalDate) return undefined
  const [year, month, day] = dateString.split('-').map(Number)
  const selected = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (selected < today) return 'Due date cannot be in the past'
  return undefined
}

function validateTitle(title: string): string | undefined {
  if (!title.trim()) return 'Title is required'
  return undefined
}

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

function makeDefaultForm(initialStatus?: TaskStatus): FormState {
  return {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: '',
    status: initialStatus ?? 'todo',
  }
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  initialStatus,
  manager,
}: TaskModalProps) {
  const [formState, setFormState] = useState<FormState>(makeDefaultForm(initialStatus))
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({})
  const closingRef = useRef(false)

  useEffect(() => {
    if (taskToEdit) {
      setFormState({
        title: taskToEdit.title,
        description: taskToEdit.description,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate.substring(0, 10),
        assignee: taskToEdit.assignee,
        tags: taskToEdit.tags.join(', '),
        status: taskToEdit.status,
      })
    } else {
      setFormState(makeDefaultForm(initialStatus))
    }
    setErrors({})
    closingRef.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskToEdit?.id, isOpen])

  // Escape key closes the panel
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleClose = () => {
    closingRef.current = true
    onClose()
  }

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const originalDueDate = taskToEdit?.dueDate.substring(0, 10)

  // Derive unique, sorted assignees from all existing tasks
  const assignees = [
    ...new Set(manager.getTasks().map((t) => t.assignee).filter(Boolean)),
  ].sort()

  const handleBlur = (field: 'title' | 'dueDate') => {
    if (closingRef.current) return
    if (field === 'title') {
      const err = validateTitle(formState.title)
      setErrors((prev) => ({ ...prev, title: err }))
    } else {
      const err = validateDueDate(formState.dueDate, originalDueDate)
      setErrors((prev) => ({ ...prev, dueDate: err }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const titleError = validateTitle(formState.title)
    const dueDateError = validateDueDate(formState.dueDate, originalDueDate)
    setErrors({ title: titleError, dueDate: dueDateError })

    if (titleError || dueDateError) return

    const fields: UpdateTaskFields = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      priority: formState.priority,
      dueDate: formState.dueDate,
      assignee: formState.assignee.trim(),
      tags: parseTagsString(formState.tags),
      status: formState.status,
    }

    if (taskToEdit) {
      manager.updateTask(taskToEdit.id, fields)
    } else {
      manager.addTask(fields)
    }

    onClose()
  }

  const inputBase =
    'w-full text-sm border rounded-lg px-3 py-2 bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tm-primary)]/30 focus:border-[var(--color-tm-primary)] transition-colors'
  const inputError = 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
  const inputNormal = 'border-[var(--color-tm-border)]'

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={taskToEdit ? 'Edit Task' : 'New Task'}
        className="fixed right-0 top-0 bottom-0 w-[520px] z-50 flex flex-col bg-white shadow-2xl"
        style={{ animation: 'panelSlideIn 220ms ease forwards' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-tm-border)] shrink-0">
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {taskToEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close panel"
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-app)]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto">
          <form id="task-modal-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="modal-title" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                Title *
              </label>
              <input
                id="modal-title"
                type="text"
                value={formState.title}
                onChange={(e) => updateField('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                placeholder="Task title"
                className={`${inputBase} ${errors.title ? inputError : inputNormal}`}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'modal-title-error' : undefined}
              />
              {errors.title && (
                <p id="modal-title-error" className="text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="modal-description" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                Description
              </label>
              <textarea
                id="modal-description"
                rows={3}
                value={formState.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="What needs to be done?"
                className={`${inputBase} ${inputNormal} resize-none`}
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="modal-status" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                  Status
                </label>
                <select
                  id="modal-status"
                  value={formState.status}
                  onChange={(e) => updateField('status', e.target.value as TaskStatus)}
                  className={`${inputBase} ${inputNormal}`}
                >
                  {STATUSES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-priority" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                  Priority
                </label>
                <select
                  id="modal-priority"
                  value={formState.priority}
                  onChange={(e) => updateField('priority', e.target.value as TaskPriority)}
                  className={`${inputBase} ${inputNormal}`}
                >
                  {PRIORITIES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label htmlFor="modal-due-date" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                Due Date *
              </label>
              <input
                id="modal-due-date"
                type="date"
                value={formState.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
                onBlur={() => handleBlur('dueDate')}
                min={(() => {
                  const todayStr = new Date().toISOString().split('T')[0]
                  // Edit: allow keeping an existing past date; block going further back
                  if (taskToEdit && originalDueDate && originalDueDate < todayStr) return originalDueDate
                  return todayStr
                })()}
                className={`${inputBase} ${errors.dueDate ? inputError : inputNormal}`}
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? 'modal-due-date-error' : undefined}
              />
              {errors.dueDate && (
                <p id="modal-due-date-error" className="text-xs text-red-600">{errors.dueDate}</p>
              )}
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <label htmlFor="modal-assignee" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                Assignee
              </label>
              <select
                id="modal-assignee"
                value={formState.assignee}
                onChange={(e) => updateField('assignee', e.target.value)}
                className={`${inputBase} ${inputNormal}`}
              >
                <option value="">— Unassigned —</option>
                {assignees.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label htmlFor="modal-tags" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                Tags
                <span className="normal-case font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>
                  (comma-separated)
                </span>
              </label>
              <input
                id="modal-tags"
                type="text"
                value={formState.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="backend, auth, ux"
                className={`${inputBase} ${inputNormal}`}
              />
            </div>
          </form>
        </div>

        {/* Sticky footer with action buttons */}
        <div className="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-[var(--color-tm-border)]">
          <button
            type="button"
            id="modal-cancel-btn"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium border border-[var(--color-tm-border)] rounded-lg transition-colors hover:bg-[var(--color-surface-app)]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-modal-form"
            id="modal-save-btn"
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: 'var(--color-tm-primary)' }}
          >
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </>
  )
}
