import { SortState } from '@/BLL/taskManager/types'

interface SortControlsProps {
  sort: SortState | undefined
  onSortChange: (sort: SortState | undefined) => void
}

export function SortControls({ sort, onSortChange }: SortControlsProps) {
  const handleByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === '') {
      onSortChange(undefined)
    } else {
      onSortChange({
        by: val as 'dueDate' | 'priority',
        direction: sort?.direction ?? 'asc',
      })
    }
  }

  const toggleDirection = () => {
    if (!sort) return
    onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
  }

  return (
    <div className="flex items-center gap-3 px-6 py-2.5 border-b border-[var(--color-tm-border)]">
      <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
        Sort:
      </span>

      <select
        id="sort-by-select"
        value={sort?.by ?? ''}
        onChange={handleByChange}
        className="text-sm border border-[var(--color-tm-border)] rounded-lg px-3 py-1.5 bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tm-primary)]/30 focus:border-[var(--color-tm-primary)] transition-colors"
      >
        <option value="">No Sort</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      {sort && (
        <button
          id="sort-direction-btn"
          onClick={toggleDirection}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-[var(--color-tm-border)] rounded-lg bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-app)] transition-colors"
          aria-label={`Sort ${sort.direction === 'asc' ? 'ascending' : 'descending'}`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: sort.direction === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 150ms ease' }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          {sort.direction === 'asc' ? 'Asc' : 'Desc'}
        </button>
      )}
    </div>
  )
}
