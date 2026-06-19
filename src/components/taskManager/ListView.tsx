import { Task, TaskStatus } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { ListRow } from './ListRow'
import { useState } from 'react'
import { StatusBadge } from './StatusBadge'

interface ListViewProps {
  todoTasks: Task[]
  inProgressTasks: Task[]
  doneTasks: Task[]
  manager: TaskManager
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const GROUPS: TaskStatus[] = ['todo', 'in-progress', 'done']
const GROUP_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
}

export function ListView({ todoTasks, inProgressTasks, doneTasks, manager, onView, onEdit, onDelete }: ListViewProps) {
  // Collapsible state per group — local component state, NOT in TaskManager
  const [collapsed, setCollapsed] = useState<Record<TaskStatus, boolean>>({
    todo: false,
    'in-progress': false,
    done: false,
  })

  const toggle = (status: TaskStatus) => {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }))
  }

  const tasksByGroup: Record<TaskStatus, Task[]> = {
    todo: todoTasks,
    'in-progress': inProgressTasks,
    done: doneTasks,
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="overflow-hidden rounded-xl border border-[var(--color-tm-border)] bg-white">
        {/* Table header */}
        <div
          className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_80px] gap-4 px-4 py-2.5 border-b border-[var(--color-tm-border)]"
          style={{
            backgroundColor: 'var(--color-surface-app)',
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <span>Task</span>
          <span>Assignee</span>
          <span>Due Date</span>
          <span>Priority</span>
          <span className="text-right">Actions</span>
        </div>

        {GROUPS.map((status) => {
          const groupTasks = tasksByGroup[status]
          const isCollapsed = collapsed[status]

          return (
            <div key={status}>
              {/* Group header */}
              <button
                id={`list-group-${status}`}
                onClick={() => toggle(status)}
                className="w-full flex items-center gap-3 px-4 py-2.5 border-b border-[var(--color-tm-border)] hover:bg-[var(--color-surface-app)] transition-colors text-left"
              >
                {/* Chevron */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: 'var(--color-text-muted)',
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: 'transform 150ms ease',
                    flexShrink: 0,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>

                {/* Status badge */}
                <StatusBadge status={status} />

                {/* Count */}
                <span
                  className="text-xs font-semibold rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: 'var(--color-tm-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {groupTasks.length}
                </span>
              </button>

              {/* Group rows */}
              {!isCollapsed &&
                groupTasks.map((task) => (
                  <ListRow
                    key={task.id}
                    task={task}
                    manager={manager}
                    onView={() => onView(task)}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task.id)}
                  />
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
