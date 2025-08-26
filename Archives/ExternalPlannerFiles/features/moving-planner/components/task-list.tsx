import type { Task } from "../lib/types"

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onCreateTask: (task: Partial<Task>) => void
  searchQuery: string
}

export function TaskList({ tasks, onTaskClick, onCreateTask, searchQuery }: TaskListProps) {}
