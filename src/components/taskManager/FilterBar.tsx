import { FilterState, TaskPriority } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { sortStrings, uniqueStrings } from '@/lib/formUtils'

interface FilterBarProps {
  manager: TaskManager
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function FilterBar({ manager, filters, onFilterChange }: FilterBarProps) {
  // Named assignees only — filter(Boolean) drops empty strings so unassigned tasks
  // don't produce a blank <option>; they are handled by the dedicated "Unassigned" option.
  const allAssignees = sortStrings(uniqueStrings(manager.getTasks().map((t) => t.assignee).filter(Boolean)))

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    onFilterChange({
      ...filters,
      priority: val === '' ? undefined : (val as TaskPriority),
    })
  }

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === '') {
      // "All Assignees" — clear the filter
      onFilterChange({ ...filters, assignee: undefined })
    } else if (val === '__unassigned__') {
      // "Unassigned" — filter for tasks where assignee === ''
      onFilterChange({ ...filters, assignee: '' })
    } else {
      onFilterChange({ ...filters, assignee: val })
    }
  }

  // Map filter state back to the <select> value.
  // undefined → '' (All Assignees), '' → '__unassigned__', name → name
  const assigneeSelectValue =
    filters.assignee === undefined ? '' :
    filters.assignee === '' ? '__unassigned__' :
    filters.assignee

  const hasActiveFilter = filters.priority !== undefined || filters.assignee !== undefined

  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
        Filter:
      </span>

      {/* Priority filter */}
      <select
        id="filter-priority"
        value={filters.priority ?? ''}
        onChange={handlePriorityChange}
        className="text-sm border border-[var(--color-tm-border)] rounded-lg px-3 py-1.5 bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tm-primary)]/30 focus:border-[var(--color-tm-primary)] transition-colors"
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Assignee filter */}
      <select
        id="filter-assignee"
        value={assigneeSelectValue}
        onChange={handleAssigneeChange}
        className="text-sm border border-[var(--color-tm-border)] rounded-lg px-3 py-1.5 bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tm-primary)]/30 focus:border-[var(--color-tm-primary)] transition-colors"
      >
        <option value="">All Assignees</option>
        <option value="__unassigned__">Unassigned</option>
        {allAssignees.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasActiveFilter && (
        <button
          id="filter-clear-btn"
          onClick={() => onFilterChange({})}
          className="text-xs text-[var(--color-tm-primary)] hover:underline font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
