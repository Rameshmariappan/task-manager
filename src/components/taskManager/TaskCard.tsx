import { useEffect, useRef } from 'react'
import { Task } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { formatDate } from '@/lib/dateUtils'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import { AssigneeAvatar } from './AssigneeAvatar'
import { TagChip } from './TagChip'
import { TaskCardMenu } from './TaskCardMenu'

interface TaskCardProps {
  task: Task
  manager: TaskManager
  draggedTaskIdRef: React.RefObject<string | null>
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TaskCard({ task, manager, draggedTaskIdRef, onView, onEdit, onDelete }: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const overdue = manager.isOverdue(task)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    el.classList.add('task-card-enter')
    const frame = requestAnimationFrame(() => {
      el.classList.add('task-card-enter-active')
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    draggedTaskIdRef.current = task.id
    e.currentTarget.classList.add('drag-source')
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('drag-source')
    draggedTaskIdRef.current = null
  }

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onView}
      className="bg-white rounded-lg border border-[var(--color-tm-border)] p-4 flex flex-col gap-3 cursor-pointer select-none shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Row 1: StatusBadge + TaskCardMenu */}
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={task.status} />
        {/* Stop propagation so the three-dot menu doesn't open the detail panel */}
        <div onClick={(e) => e.stopPropagation()}>
          <TaskCardMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {/* Row 2: Title (1-line truncate) */}
      <h3
        className="text-[0.875rem] font-semibold leading-snug overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ color: 'var(--color-text-primary)' }}
        title={task.title}
      >
        {task.title}
      </h3>

      {/* Row 3: Description (2-line clamp) */}
      {task.description && (
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {task.description}
        </p>
      )}

      {/* Row 4: Assignee */}
      <div className="flex items-center gap-2">
        {task.assignee ? (
          <>
            <span className="text-[0.68rem]" style={{ color: 'var(--color-text-muted)' }}>
              Assignee:
            </span>
            <AssigneeAvatar name={task.assignee} size="sm" />
            <span className="text-[0.68rem]" style={{ color: 'var(--color-text-secondary)' }}>
              {task.assignee}
            </span>
          </>
        ) : (
          <span className="text-[0.68rem] italic" style={{ color: 'var(--color-text-muted)' }}>
            Unassigned
          </span>
        )}
      </div>

      {/* Row 5: Date + PriorityBadge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
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
              style={{ color: 'var(--color-overdue)' }}
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
              style={{ color: 'var(--color-text-muted)' }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          )}
          <span
            className="text-[0.68rem] font-medium"
            style={{ color: overdue ? 'var(--color-overdue)' : 'var(--color-text-muted)' }}
          >
            {formatDate(task.dueDate)}
          </span>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Row 6: Tags — max 3 visible, remainder collapsed into "+N more" */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          {task.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
          {task.tags.length > 3 && (
            <span
              className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full"
              style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-tm-border)' }}
              title={task.tags.slice(3).join(', ')}
            >
              +{task.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}
