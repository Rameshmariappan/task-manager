import { ViewType } from '@/BLL/taskManager/types'

interface ViewToggleProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center border-b border-[var(--color-tm-border)]">
      {(['kanban', 'list'] as ViewType[]).map((view) => {
        const isActive = activeView === view
        const label = view === 'kanban' ? 'Kanban' : 'List'
        return (
          <button
            key={view}
            id={`view-toggle-${view}`}
            onClick={() => onViewChange(view)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              isActive
                ? 'border-[var(--color-tm-primary)] text-[var(--color-tm-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
            aria-selected={isActive}
            role="tab"
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
