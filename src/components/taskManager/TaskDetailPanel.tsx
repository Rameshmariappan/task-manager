import { useEffect } from 'react'
import { Task } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { formatDate } from '@/lib/dateUtils'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import { AssigneeAvatar } from './AssigneeAvatar'
import { TagChip } from './TagChip'

interface TaskDetailPanelProps {
  task: Task | null
  manager: TaskManager
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[var(--color-tm-border)] last:border-0">
      <span
        className="text-xs font-semibold uppercase tracking-wide w-20 shrink-0 pt-0.5"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export function TaskDetailPanel({ task, manager, onClose, onEdit, onDelete }: TaskDetailPanelProps) {
  useEffect(() => {
    if (!task) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [task, onClose])

  if (!task) return null

  const overdue = manager.isOverdue(task)

  const formattedCreatedAt = new Date(task.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Task detail: ${task.title}`}
        className="fixed right-0 top-0 bottom-0 w-[460px] z-50 flex flex-col bg-white shadow-2xl overflow-hidden"
        style={{ animation: 'panelSlideIn 220ms ease forwards' }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-tm-border)]">
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Created {formattedCreatedAt}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-tm-border)] transition-colors hover:bg-[var(--color-surface-app)]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => { onDelete(task.id); onClose() }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
              Delete
            </button>
            <button
              onClick={onClose}
              aria-label="Close detail panel"
              className="ml-1 p-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-app)]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-xl font-bold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
            {task.title}
          </h2>
        </div>

        {/* Properties list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <PropertyRow label="Status">
            <StatusBadge status={task.status} />
          </PropertyRow>

          <PropertyRow label="Priority">
            <PriorityBadge priority={task.priority} />
          </PropertyRow>

          <PropertyRow label="Due Date">
            <div className="flex items-center gap-1.5">
              {overdue && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-overdue)', flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              <span
                className="text-sm font-medium"
                style={{ color: overdue ? 'var(--color-overdue)' : 'var(--color-text-primary)' }}
              >
                {formatDate(task.dueDate)}
                {overdue && <span className="ml-1.5 text-xs font-normal opacity-80">(Overdue)</span>}
              </span>
            </div>
          </PropertyRow>

          <PropertyRow label="Assignee">
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <AssigneeAvatar name={task.assignee} size="sm" />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {task.assignee}
                </span>
              </div>
            ) : (
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Unassigned</span>
            )}
          </PropertyRow>

          {task.tags.length > 0 && (
            <PropertyRow label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            </PropertyRow>
          )}

          {task.description && (
            <div className="pt-4">
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Description
              </p>
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--color-surface-app)' }}
              >
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {task.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
