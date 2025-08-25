import type React from "react"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskListCard } from "./task-list-card"
import type { Task } from "../lib/types"

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onCreateTask: (task: Task) => void
  searchQuery?: string
  onDragStart: (e: React.DragEvent, task: Task) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  frames?: Array<{ id: string; color: string }>
}

export function TaskList({
  tasks,
  onTaskClick,
  onCreateTask,
  searchQuery = "",
  onDragStart,
  onDragOver,
  onDrop,
  frames = [],
}: TaskListProps) {
  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCreateTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      description: "",
      status: "not-started",
      priority: "medium",
      labels: [],
      checklist: [],
      comments: [],
      customFields: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    onCreateTask(newTask)
  }

  return (
    <div className="w-80 planner-card rounded-lg p-4 h-full flex flex-col" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold planner-text-primary">Task List</h2>
        <span className="text-sm planner-text-muted">{filteredTasks.length}</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredTasks.map((task) => (
          <TaskListCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={(e) => onDragStart(e, task)}
            frames={frames}
          />
        ))}
      </div>

      <Button onClick={handleCreateTask} className="mt-4 w-full planner-button">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  )
}
