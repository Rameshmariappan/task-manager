import { Task } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { formatDate } from '@/lib/dateUtils'
import { PriorityBadge } from './PriorityBadge'
import { AssigneeAvatar } from './AssigneeAvatar'
import { TaskCardMenu } from './TaskCardMenu'

interface ListRowProps {
  task: Task
  manager: TaskManager
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ListRow({ task, manager, onView, onEdit, onDelete }: ListRowProps) {
  const overdue = manager.isOverdue(task)

  return (
    <div
      onClick={onView}
      className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_80px] gap-4 items-center px-4 py-3 border-b border-[var(--color-tm-border)] hover:bg-[var(--color-surface-app)] transition-colors cursor-pointer"
    >
      {/* Col 1: Status indicator + title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Decorative status checkbox */}
        <div
          className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
          style={{
            borderColor: task.status === 'done' ? 'var(--color-status-done)' : 'var(--color-tm-border)',
            backgroundColor: task.status === 'done' ? 'var(--color-status-done)' : 'transparent',
          }}
        >
          {task.status === 'done' && (
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div className="min-w-0">
          <p
            className="text-[0.875rem] font-semibold truncate"
            style={{
              color: 'var(--color-text-primary)',
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
              opacity: task.status === 'done' ? 0.6 : 1,
            }}
            title={task.title}
          >
            {task.title}
          </p>
          {task.description && (
            <p
              className="text-[0.68rem] truncate"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Col 2: Assignee */}
      <div className="flex items-center gap-2">
        {task.assignee ? (
          <>
            <AssigneeAvatar name={task.assignee} size="sm" />
            <span className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
              {task.assignee}
            </span>
          </>
        ) : (
          <span className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
            Unassigned
          </span>
        )}
      </div>

      {/* Col 3: Due Date (red + icon if overdue) */}
      <div className="flex items-center gap-1.5">
        {overdue ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Overdue"
            style={{ color: 'var(--color-overdue)', flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )}
        <span
          className="text-xs"
          style={{ color: overdue ? 'var(--color-overdue)' : 'var(--color-text-muted)' }}
        >
          {formatDate(task.dueDate)}
        </span>
      </div>

      {/* Col 4: Priority badge */}
      <div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Col 5: Actions menu — stop propagation so row click doesn't open detail panel */}
      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
        <TaskCardMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )
}
