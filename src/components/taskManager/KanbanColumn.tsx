import { Task, TaskStatus } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  manager: TaskManager
  draggedTaskIdRef: React.MutableRefObject<string | null>
  filtersActive: boolean
  onAddTask: (initialStatus: TaskStatus) => void
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

// Column display names (different from StatusBadge display names per spec)
const COLUMN_CONFIG: Record<
  TaskStatus,
  { label: string; dotColor: string; emptyMessage: string; emptyIcon: string }
> = {
  todo: {
    label: 'Todo',
    dotColor: 'var(--color-dot-todo)',
    emptyMessage: 'No tasks yet — add one to get started',
    emptyIcon: '📋',
  },
  'in-progress': {
    label: 'In Progress',
    dotColor: 'var(--color-dot-inprogress)',
    emptyMessage: 'Nothing in flight — pick something from Todo',
    emptyIcon: '🚀',
  },
  done: {
    label: 'Done',
    dotColor: 'var(--color-dot-done)',
    emptyMessage: 'No completed tasks yet — keep going!',
    emptyIcon: '🎯',
  },
}

export function KanbanColumn({
  status,
  tasks,
  manager,
  draggedTaskIdRef,
  filtersActive,
  onAddTask,
  onView,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { label, dotColor, emptyMessage, emptyIcon } = COLUMN_CONFIG[status]

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // CRITICAL: without this, drop never fires
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add('drop-target-highlight')
  }

  // Guard against child boundary events: without this, highlight flickers on every child element edge
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    e.currentTarget.classList.remove('drop-target-highlight')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drop-target-highlight')
    const taskId = draggedTaskIdRef.current
    if (!taskId) return
    manager.moveTo(taskId, status)
    draggedTaskIdRef.current = null
  }

  return (
    <div
      className="flex flex-col min-w-0 flex-1 rounded-xl border border-[var(--color-tm-border)] transition-colors"
      style={{ backgroundColor: 'var(--color-surface-app)' }}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-tm-border)]">
        {/* Status dot */}
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />

        {/* Column label */}
        <span
          className="text-[0.8rem] font-semibold flex-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}
        </span>

        {/* Task count badge */}
        <span
          className="text-xs font-semibold rounded-full px-2 py-0.5 min-w-[1.5rem] text-center"
          style={{
            backgroundColor: 'var(--color-tm-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {tasks.length}
        </span>

        {/* Add task button */}
        <button
          id={`kanban-add-${status}`}
          onClick={() => onAddTask(status)}
          aria-label={`Add task to ${label}`}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-tm-primary)] hover:bg-white transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Column content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-3xl mb-3">{filtersActive ? '🔍' : emptyIcon}</span>
            <p
              className="text-xs leading-relaxed max-w-[160px]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {filtersActive ? 'No tasks match your filters' : emptyMessage}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              manager={manager}
              draggedTaskIdRef={draggedTaskIdRef}
              onView={() => onView(task)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
