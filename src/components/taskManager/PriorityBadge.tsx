import { TaskPriority } from '@/BLL/taskManager/types'

interface PriorityBadgeProps {
  priority: TaskPriority
}

const config: Record<TaskPriority, { label: string; style: string }> = {
  high: {
    label: 'High',
    style: 'bg-[var(--color-priority-high-bg)] text-[var(--color-priority-high)]',
  },
  medium: {
    label: 'Medium',
    style: 'bg-[var(--color-priority-medium-bg)] text-[var(--color-priority-medium)]',
  },
  low: {
    label: 'Low',
    style: 'bg-[var(--color-priority-low-bg)] text-[var(--color-priority-low)]',
  },
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, style } = config[priority]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.68rem] font-semibold leading-none ${style}`}
    >
      {label}
    </span>
  )
}
