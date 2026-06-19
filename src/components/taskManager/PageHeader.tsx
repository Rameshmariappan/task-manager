interface PageHeaderProps {
  onAddTask: () => void
}

export function PageHeader({ onAddTask }: PageHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <h1
          className="text-2xl font-bold leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Tasks
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {today}
        </p>
      </div>

      <button
        id="add-task-btn"
        onClick={onAddTask}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: 'var(--color-tm-primary)' }}
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
        Add Task
      </button>
    </div>
  )
}
