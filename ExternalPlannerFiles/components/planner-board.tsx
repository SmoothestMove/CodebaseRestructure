import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search, Settings } from "lucide-react"
import { TaskList } from "./task-list"
import { Frame } from "./frame"
import { TaskModal } from "./task-modal"
import { GlobalSettings } from "./global-settings"
import type { Task, Frame as FrameType } from "../lib/types"
import { defaultFrames, defaultTasks } from "../lib/default-data"

interface PlannerBoardProps {
  moveDate?: Date
}

export function PlannerBoard({ moveDate = new Date() }: PlannerBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(
    defaultTasks.map((task) => ({
      ...task,
      frameId: task.defaultFrame, // Assign tasks to their default frames
    })),
  )
  const [frames, setFrames] = useState<FrameType[]>(defaultFrames)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [showGlobalSettings, setShowGlobalSettings] = useState(false)

  const taskListTasks = useMemo(() => {
    return tasks // Show all tasks in Task List
  }, [tasks])

  const getFrameTasks = useCallback(
    (frameId: string) => {
      return tasks.filter((task) => task.frameId === frameId)
    },
    [tasks],
  )

  const handleCreateTask = useCallback((task: Task, frameId?: string) => {
    setTasks((prevTasks) => [...prevTasks, { ...task, id: Date.now().toString(), frameId }])
  }, [])

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }, [])

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetFrameId?: string) => {
      e.preventDefault()
      const taskId = e.dataTransfer.getData("text/plain")

      if (draggedTask && taskId === draggedTask.id) {
        if (targetFrameId) {
          // Copy task to timeline frame (assign frameId but keep in Task List)
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? { ...task, frameId: targetFrameId } : task)),
          )
        } else {
          // Dropped back to Task List - unassign from frame
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? { ...task, frameId: undefined } : task)),
          )
        }
      }
      setDraggedTask(null)
    },
    [draggedTask],
  )

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
  }, [])

  const handleUpdateFrame = useCallback((frameId: string, updates: Partial<FrameType>) => {
    setFrames((prevFrames) => prevFrames.map((frame) => (frame.id === frameId ? { ...frame, ...updates } : frame)))
  }, [])

  const frameColors = useMemo(() => frames.map((frame) => ({ id: frame.id, color: frame.color })), [frames])

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <button
          onClick={() => setShowGlobalSettings(true)}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          title="Global Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        <div className="flex-shrink-0">
          <TaskList
            tasks={taskListTasks}
            onTaskClick={setSelectedTask}
            onCreateTask={handleCreateTask}
            searchQuery={searchQuery}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, undefined)}
            frames={frameColors}
          />
        </div>

        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <div className="flex gap-4 min-w-max h-full">
            {frames.map((frame) => (
              <Frame
                key={frame.id}
                frame={frame}
                tasks={getFrameTasks(frame.id)}
                onTaskClick={setSelectedTask}
                onCreateTask={(task) => handleCreateTask(task, frame.id)}
                moveDate={moveDate}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, frame.id)}
                onToggleComplete={handleToggleComplete}
                onUpdateFrame={handleUpdateFrame}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
        />
      )}

      {showGlobalSettings && (
        <GlobalSettings isOpen={showGlobalSettings} onClose={() => setShowGlobalSettings(false)} />
      )}
    </div>
  )
}
