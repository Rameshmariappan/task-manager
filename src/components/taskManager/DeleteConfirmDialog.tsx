import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  taskTitle?: string
}

export function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  taskTitle,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            {taskTitle ? (
              <>
                Are you sure you want to delete <strong>&ldquo;{taskTitle}&rdquo;</strong>?
                This action cannot be undone.
              </>
            ) : (
              'Are you sure you want to delete this task? This action cannot be undone.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel id="delete-cancel-btn" onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            id="delete-confirm-btn"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
