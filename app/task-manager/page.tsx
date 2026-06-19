'use client'

import { useState, useRef } from 'react'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { Task, TaskStatus, FilterState, SortState, ViewType } from '@/BLL/taskManager/types'
import { useLocalStorage } from '@/lib/useLocalStorage'

// Components
import { Sidebar } from '@/components/taskManager/Sidebar'
import { PageHeader } from '@/components/taskManager/PageHeader'
import { ViewToggle } from '@/components/taskManager/ViewToggle'
import { FilterBar } from '@/components/taskManager/FilterBar'
import { KanbanBoard } from '@/components/taskManager/KanbanBoard'
import { ListView } from '@/components/taskManager/ListView'
import { TaskModal } from '@/components/taskManager/TaskModal'
import { DeleteConfirmDialog } from '@/components/taskManager/DeleteConfirmDialog'
import { SortControls } from '@/components/taskManager/SortControls'
import { TaskDetailPanel } from '@/components/taskManager/TaskDetailPanel'

export default function TaskManagerPage() {
  const [version, setVersion] = useState(0)

  const managerRef = useRef<TaskManager | null>(null)
  if (!managerRef.current) {
    managerRef.current = new TaskManager(() => setVersion((v) => v + 1))
  }
  const manager = managerRef.current

  const [activeView, setActiveView] = useLocalStorage<ViewType>('tm-active-view', 'kanban')

  // --- Filter and sort state (page owns these — passed to getFilteredAndSortedTasks) ---
  const [filters, setFilters] = useState<FilterState>({})
  const [sortState, setSortState] = useState<SortState | undefined>(undefined)

  // --- Modal state ---
  const [modalOpen, setModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus | undefined>(undefined)

  // --- Delete confirmation state ---
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  // --- Detail panel state ---
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Suppress unused variable warning for version — it's read by React to trigger re-renders
  void version

  // --- Handlers ---
  const handleAddTask = (initialStatus?: TaskStatus) => {
    setTaskToEdit(null)
    setModalInitialStatus(initialStatus)
    setModalOpen(true)
  }

  const handleEdit = (task: Task) => {
    setTaskToEdit(task)
    setModalInitialStatus(undefined)
    setModalOpen(true)
  }

  const handleDeleteRequest = (taskId: string) => {
    const task = manager.getTasks().find((t) => t.id === taskId)
    if (task) {
      setDeleteTarget({ id: task.id, title: task.title })
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      manager.deleteTask(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setTaskToEdit(null)
    setModalInitialStatus(undefined)
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCloseDetailPanel = () => {
    setSelectedTask(null)
  }

  const handleEditFromPanel = (task: Task) => {
    setSelectedTask(null)
    handleEdit(task)
  }

  const handleDeleteFromPanel = (taskId: string) => {
    handleDeleteRequest(taskId)
  }

  // Pre-partition tasks by status so components only receive their slice
  const allFilteredSorted = manager.getFilteredAndSortedTasks(filters, sortState)
  const todoTasks = allFilteredSorted.filter((t) => t.status === 'todo')
  const inProgressTasks = allFilteredSorted.filter((t) => t.status === 'in-progress')
  const doneTasks = allFilteredSorted.filter((t) => t.status === 'done')
  const filtersActive = filters.priority !== undefined || filters.assignee !== undefined
  const taskCount = manager.getTasks().length

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-app)' }}
    >
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} taskCount={taskCount} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Page header */}
        <PageHeader onAddTask={() => handleAddTask()} />

        {/* View toggle + filter bar */}
        <div
          className="border-b border-[var(--color-tm-border)]"
          style={{ backgroundColor: 'var(--color-surface-card)' }}
        >
          <div className="flex items-center justify-between px-6">
            <ViewToggle activeView={activeView} onViewChange={setActiveView} />
          </div>
          <FilterBar
            manager={manager}
            filters={filters}
            onFilterChange={setFilters}
          />
          {/* Sort controls — list view only */}
          {activeView === 'list' && (
            <SortControls sort={sortState} onSortChange={setSortState} />
          )}
        </div>

        {/* Board / List area */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-5">
          {activeView === 'kanban' ? (
            <KanbanBoard
              manager={manager}
              todoTasks={todoTasks}
              inProgressTasks={inProgressTasks}
              doneTasks={doneTasks}
              filtersActive={filtersActive}
              onAddTask={handleAddTask}
              onView={handleViewTask}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ) : (
            <ListView
              todoTasks={todoTasks}
              inProgressTasks={inProgressTasks}
              doneTasks={doneTasks}
              manager={manager}
              onView={handleViewTask}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          )}
        </div>
      </main>

      {/* Task modal (create / edit) */}
      <TaskModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        taskToEdit={taskToEdit}
        initialStatus={modalInitialStatus}
        manager={manager}
      />

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        taskTitle={deleteTarget?.title}
      />

      {/* Task detail panel (right-side slide-in) */}
      <TaskDetailPanel
        task={selectedTask}
        manager={manager}
        onClose={handleCloseDetailPanel}
        onEdit={handleEditFromPanel}
        onDelete={handleDeleteFromPanel}
      />
    </div>
  )
}
