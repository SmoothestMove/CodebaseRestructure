import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TimelineTaskCard } from "./timeline-task-card"
import type { Task, Frame as FrameType } from "../lib/types"

interface FrameProps {
  frame: FrameType
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onCreateTask: (task: Task) => void
  moveDate: Date
  onDragStart: (e: React.DragEvent, task: Task) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onToggleComplete?: (taskId: string) => void
  onUpdateFrame?: (frameId: string, updates: Partial<FrameType>) => void
}

export function Frame({
  frame,
  tasks,
  onTaskClick,
  onCreateTask,
  moveDate,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleComplete,
  onUpdateFrame,
}: FrameProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false)
  const [editTitle, setEditTitle] = useState(frame.title)
  const [editSubtitle, setEditSubtitle] = useState(frame.description || "")

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const getFrameColors = (frameId: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; cssColor: string; progressBg: string }> =
      {
        "app-setup": {
          bg: "bg-blue-600",
          text: "text-white",
          border: "border-blue-500",
          cssColor: "#2563eb",
          progressBg: "bg-blue-800/30",
        },
        "8-weeks": {
          bg: "bg-green-600",
          text: "text-white",
          border: "border-green-500",
          cssColor: "#16a34a",
          progressBg: "bg-green-800/30",
        },
        "7-weeks": {
          bg: "bg-green-600",
          text: "text-white",
          border: "border-green-500",
          cssColor: "#16a34a",
          progressBg: "bg-green-800/30",
        },
        "6-weeks": {
          bg: "bg-green-600",
          text: "text-white",
          border: "border-green-500",
          cssColor: "#16a34a",
          progressBg: "bg-green-800/30",
        },
        "5-weeks": {
          bg: "bg-lime-600",
          text: "text-white",
          border: "border-lime-500",
          cssColor: "#65a30d",
          progressBg: "bg-lime-800/30",
        },
        "4-weeks": {
          bg: "bg-lime-600",
          text: "text-white",
          border: "border-lime-500",
          cssColor: "#65a30d",
          progressBg: "bg-lime-800/30",
        },
        "2-3-weeks": {
          bg: "bg-yellow-600",
          text: "text-white",
          border: "border-yellow-500",
          cssColor: "#ca8a04",
          progressBg: "bg-yellow-800/30",
        },
        "1-week": {
          bg: "bg-orange-600",
          text: "text-white",
          border: "border-orange-500",
          cssColor: "#ea580c",
          progressBg: "bg-orange-800/30",
        },
        "day-before": {
          bg: "bg-orange-600",
          text: "text-white",
          border: "border-orange-500",
          cssColor: "#ea580c",
          progressBg: "bg-orange-800/30",
        },
        "move-day": {
          bg: "bg-red-600",
          text: "text-white",
          border: "border-red-500",
          cssColor: "#dc2626",
          progressBg: "bg-red-800/30",
        },
        "post-move": {
          bg: "bg-teal-600",
          text: "text-white",
          border: "border-teal-500",
          cssColor: "#0d9488",
          progressBg: "bg-teal-800/30",
        },
      }
    return (
      colorMap[frameId] || {
        bg: "bg-slate-600",
        text: "text-white",
        border: "border-slate-500",
        cssColor: "#475569",
        progressBg: "bg-slate-800/30",
      }
    )
  }

  const colors = getFrameColors(frame.id)

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

  const handleTaskClick = (task: Task) => {
    onTaskClick(task)
  }

  return (
    <div
      className="w-80 planner-card rounded-lg overflow-hidden h-full flex flex-col"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={`${colors.bg} ${colors.text} p-4`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">
            {frame.title}
          </h3>
          <span className="text-xs opacity-90 font-medium">
            {completedTasks}/{totalTasks}
          </span>
        </div>

        <div className="text-xs opacity-90 mb-3">
          {frame.description}
        </div>

        <div className="relative">
          <Progress value={progress} className={`h-2 ${colors.progressBg} rounded-full overflow-hidden`} />
          {totalTasks > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white/90 drop-shadow-sm">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {tasks.map((task) => (
          <TimelineTaskCard
            key={task.id}
            task={task}
            onClick={() => handleTaskClick(task)}
            onDragStart={(e) => onDragStart(e, task)}
            onToggleComplete={onToggleComplete}
            frameColor={colors.cssColor}
          />
        ))}
      </div>

      <div className="p-4 pt-0">
        <Button
          onClick={handleCreateTask}
          variant="ghost"
          className="w-full planner-text-muted hover:planner-text-primary hover:bg-slate-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  )
}
