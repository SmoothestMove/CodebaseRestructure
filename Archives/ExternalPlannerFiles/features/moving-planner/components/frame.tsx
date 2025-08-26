import type { Task, Frame as FrameType } from "../lib/types"

interface FrameProps {
  frame: FrameType
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onCreateTask: (task: Partial<Task>) => void
  moveDate: Date
}

export function Frame({ frame, tasks, onTaskClick, onCreateTask, moveDate }: FrameProps) {}
