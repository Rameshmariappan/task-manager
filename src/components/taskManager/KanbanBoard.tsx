import { useRef } from 'react'
import { Task, TaskStatus } from '@/BLL/taskManager/types'
import { TaskManager } from '@/BLL/taskManager/TaskManager'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  manager: TaskManager
  todoTasks: Task[]
  inProgressTasks: Task[]
  doneTasks: Task[]
  filtersActive: boolean
  onAddTask: (initialStatus: TaskStatus) => void
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'done']

export function KanbanBoard({
  manager,
  todoTasks,
  inProgressTasks,
  doneTasks,
  filtersActive,
  onAddTask,
  onView,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  // Shared across all columns and cards; ref keeps drag state without triggering re-renders
  const draggedTaskIdRef = useRef<string | null>(null)

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: todoTasks,
    'in-progress': inProgressTasks,
    done: doneTasks,
  }

  return (
    <div className="flex gap-5 flex-1 min-h-0 overflow-x-auto">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          manager={manager}
          draggedTaskIdRef={draggedTaskIdRef}
          filtersActive={filtersActive}
          onAddTask={onAddTask}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
