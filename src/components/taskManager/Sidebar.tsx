import { ViewType } from '@/BLL/taskManager/types'

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  taskCount: number
}

export function Sidebar({ activeView, onViewChange, taskCount }: SidebarProps) {
  void activeView
  void onViewChange

  return (
    <aside className="flex flex-col h-full w-[220px] shrink-0 bg-white border-r border-[var(--color-tm-border)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--color-tm-border)]">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--color-tm-primary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-bold text-base tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          TaskFlow
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <button
          id="sidebar-tasks-nav"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-white"
          style={{ backgroundColor: 'var(--color-tm-primary)' }}
          aria-current="page"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Tasks</span>
          <span
            className="ml-auto text-xs rounded-full px-1.5 py-0.5 font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white' }}
          >
            {taskCount}
          </span>
        </button>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-[var(--color-tm-border)] space-y-1">
        <button
          id="sidebar-settings-btn"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--color-surface-app)]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span>Settings</span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: 'var(--color-tm-primary)' }}
          >
            YO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>You</p>
            <p className="text-[0.65rem] truncate" style={{ color: 'var(--color-text-muted)' }}>you@example.com</p>
          </div>
          <button
            id="sidebar-logout-btn"
            aria-label="Log out"
            className="transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
