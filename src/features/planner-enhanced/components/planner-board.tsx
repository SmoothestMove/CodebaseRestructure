import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search, Settings, Plus } from "lucide-react"
import { TaskList } from "./task-list"
import { Frame } from "./frame"
import { TaskModal } from "./task-modal"
import { FrameHeaderModal } from "./frame-header-modal"
import { GlobalSettings } from "./global-settings"
import type { Task, Frame as FrameType } from "../lib/types"
import { defaultFrames, defaultTasks } from "../lib/default-data"

// Firebase Integration Props Interface for Smooth Moves
interface PlannerBoardProps {
  // Move context
  moveDate?: Date
  moveId?: string
  
  // Firebase integration hooks (optional - falls back to local state)
  tasks?: Task[]
  frames?: FrameType[]
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
  onTaskCreate?: (task: Omit<Task, 'id'>) => void
  onTaskDelete?: (taskId: string) => void
  onFrameUpdate?: (frameId: string, updates: Partial<FrameType>) => void
  onFrameCreate?: (frame: Omit<FrameType, 'id'>) => void
  onFrameDelete?: (frameId: string) => void
  
  // Owner integration from Smooth Moves owners system
  owners?: Array<{
    uid: string
    firstName: string
    lastName: string
    color: string
  }>
  
  // Spaces integration from Smooth Moves
  spaces?: Array<{
    id: string
    name: string
    description?: string
    color: string
    icon?: string
  }>
  
  // Move participants for assignments
  moveParticipants?: Record<string, boolean>
  
  // Presence data for displayName
  presence?: Record<string, any> | null
  
  // UI configuration
  showGlobalSettings?: boolean
  showSearch?: boolean
  className?: string
}

export function PlannerBoard({ 
  moveDate = new Date(),
  moveId,
  tasks: externalTasks,
  frames: externalFrames,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onFrameUpdate,
  onFrameCreate,
  onFrameDelete,
  owners = [],
  spaces = [],
  moveParticipants = {},
  presence = null,
  showGlobalSettings: externalShowGlobalSettings = true,
  showSearch = true,
  className = ""
}: PlannerBoardProps) {
  // Local state fallbacks for when Firebase props aren't provided
  const [localTasks, setLocalTasks] = useState<Task[]>(
    defaultTasks.map((task) => ({
      ...task,
      frameId: task.defaultFrame, // Assign tasks to their default frames
    })),
  )
  const [localFrames, setLocalFrames] = useState<FrameType[]>(defaultFrames)
  
  // Use external data if provided, otherwise use local state
  const tasks = externalTasks || localTasks
  const frames = externalFrames || localFrames
  const setTasks = externalTasks ? undefined : setLocalTasks
  const setFrames = externalFrames ? undefined : setLocalFrames
  
  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [newTaskFrameId, setNewTaskFrameId] = useState<string | undefined>(undefined)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [showGlobalSettingsModal, setShowGlobalSettingsModal] = useState(false)
  const [showCreateFrameModal, setShowCreateFrameModal] = useState(false)

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
    if (onTaskCreate) {
      onTaskCreate({ ...task, frameId })
    } else if (setTasks) {
      setTasks((prevTasks) => [...prevTasks, { ...task, id: task.id || Date.now().toString(), frameId }])
    }
  }, [onTaskCreate, setTasks])

  const handleShowCreateTaskModal = useCallback((frameId?: string) => {
    setNewTaskFrameId(frameId)
    setIsCreatingTask(true)
  }, [])

  const handleCreateTaskFromModal = useCallback((task: Task) => {
    const taskWithFrame = { ...task, frameId: newTaskFrameId }
    handleCreateTask(taskWithFrame, newTaskFrameId)
    setIsCreatingTask(false)
    setNewTaskFrameId(undefined)
  }, [handleCreateTask, newTaskFrameId])

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask.id, updatedTask)
    } else if (setTasks) {
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    }
  }, [onTaskUpdate, setTasks])

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
    if (onFrameUpdate) {
      onFrameUpdate(frameId, updates)
    } else if (setFrames) {
      setFrames((prevFrames) => prevFrames.map((frame) => (frame.id === frameId ? { ...frame, ...updates } : frame)))
    }
  }, [onFrameUpdate, setFrames])

  const handleCreateFrame = useCallback((frameData: Partial<FrameType>) => {
    const newFrame: FrameType = {
      id: frameData.id || `frame-${Date.now()}`,
      title: frameData.title || 'New Frame',
      description: frameData.description || '',
      color: frameData.color || '#64748b',
      offsetStart: frameData.offsetStart || 0,
      offsetEnd: frameData.offsetEnd || 7,
      startDate: frameData.startDate,
      endDate: frameData.endDate
    }
    
    if (onFrameCreate) {
      onFrameCreate(newFrame)
    } else if (setFrames) {
      setFrames((prevFrames) => [...prevFrames, newFrame])
    }
  }, [onFrameCreate, setFrames])

  const frameColors = useMemo(() => frames.map((frame) => ({ id: frame.id, color: frame.color })), [frames])

  return (
    <div className="h-full planner-gradient-bg p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 planner-input"
          />
        </div>

        <button
          onClick={() => setShowGlobalSettingsModal(true)}
          className="p-2 rounded-lg planner-button"
          title="Global Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        <TaskList
          tasks={taskListTasks}
          onTaskClick={setSelectedTask}
          onCreateTask={handleCreateTask}
          onShowCreateTaskModal={() => handleShowCreateTaskModal()}
          searchQuery={searchQuery}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, undefined)}
          frames={frameColors}
          owners={owners}
          moveParticipants={moveParticipants}
          presence={presence}
        />

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
                onShowCreateTaskModal={() => handleShowCreateTaskModal(frame.id)}
                owners={owners}
                moveParticipants={moveParticipants}
                presence={presence}
              />
            ))}
            
            {/* Add Frame Button */}
            <div className="w-80 flex-shrink-0 flex items-center justify-center">
              <button
                onClick={() => setShowCreateFrameModal(true)}
                className="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 hover:bg-slate-700/50 transition-all duration-200 flex flex-col items-center justify-center text-slate-400 hover:text-slate-300"
              >
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Add Frame</span>
              </button>
            </div>
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

      {isCreatingTask && (
        <TaskModal
          task={null}
          isOpen={isCreatingTask}
          onClose={() => { setIsCreatingTask(false); setNewTaskFrameId(undefined); }}
          onUpdate={handleCreateTaskFromModal}
          isCreating={true}
        />
      )}

      {showGlobalSettingsModal && (
        <GlobalSettings isOpen={showGlobalSettingsModal} onClose={() => setShowGlobalSettingsModal(false)} />
      )}
      
      {showCreateFrameModal && (
        <FrameHeaderModal
          isOpen={showCreateFrameModal}
          onClose={() => setShowCreateFrameModal(false)}
          onSave={handleCreateFrame}
          isCreating={true}
        />
      )}
    </div>
  )
}
