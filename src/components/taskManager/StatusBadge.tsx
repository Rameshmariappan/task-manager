import { TaskStatus } from '@/BLL/taskManager/types'

interface StatusBadgeProps {
  status: TaskStatus
}

// Display names per spec: todo → "Not Started" | in-progress → "In Progress" | done → "Done"
const config: Record<TaskStatus, { label: string; style: string }> = {
  todo: {
    label: 'Not Started',
    style: 'bg-[var(--color-status-todo-bg)] text-[var(--color-status-todo)]',
  },
  'in-progress': {
    label: 'In Progress',
    style: 'bg-[var(--color-status-inprogress-bg)] text-[var(--color-status-inprogress)]',
  },
  done: {
    label: 'Done',
    style: 'bg-[var(--color-status-done-bg)] text-[var(--color-status-done)]',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, style } = config[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.68rem] font-semibold leading-none ${style}`}
    >
      {label}
    </span>
  )
}
