import type { Task } from "../lib/types"

interface TaskModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => void
}

export function TaskModal({ task, isOpen, onClose, onUpdate }: TaskModalProps) {}
