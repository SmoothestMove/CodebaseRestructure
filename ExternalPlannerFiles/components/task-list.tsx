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
  frames?: Array<{ id: string; color: string }> // Added frames prop for arrow colors
}

export function TaskList({
  tasks,
  onTaskClick,
  onCreateTask,
  searchQuery = "",
  onDragStart,
  onDragOver,
  onDrop,
  frames = [], // Added frames prop
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
    <div className="w-80 bg-slate-800 rounded-lg p-4 h-full flex flex-col" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Task List</h2>
        <span className="text-sm text-slate-400">{filteredTasks.length}</span>
      </div>

      {/* Vertical scroll only - matches Timeline frame scrollbar styling */}
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredTasks.map((task) => (
          <TaskListCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={(e) => onDragStart(e, task)}
            frames={frames} // Pass frames to TaskListCard
          />
        ))}
      </div>

      <Button onClick={handleCreateTask} className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-slate-100">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  )
}
