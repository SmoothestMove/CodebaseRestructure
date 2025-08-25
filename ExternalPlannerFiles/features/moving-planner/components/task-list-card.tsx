import type { Task } from "../lib/types"

interface TaskListCardProps {
  task: Task
  onClick: () => void
}

export function TaskListCard({ task, onClick }: TaskListCardProps) {}
