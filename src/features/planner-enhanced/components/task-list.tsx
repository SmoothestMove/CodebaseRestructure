import type React from "react"

import { useState, useEffect } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskListCard } from "./task-list-card"
import type { Task } from "../lib/types"

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onCreateTask: (task: Task) => void
  onShowCreateTaskModal?: () => void
  searchQuery?: string
  onDragStart: (e: React.DragEvent, task: Task) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  frames?: Array<{ id: string; color: string }>
  owners?: Array<{
    uid: string
    firstName: string
    lastName: string
    color: string
  }>
  moveParticipants?: Record<string, boolean>
  presence?: Record<string, any> | null
}

export function TaskList({
  tasks,
  onTaskClick,
  onCreateTask,
  onShowCreateTaskModal,
  searchQuery = "",
  onDragStart,
  onDragOver,
  onDrop,
  frames = [],
  owners = [],
  moveParticipants = {},
  presence = null,
}: TaskListProps) {
  // Collapse/expand state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('taskListCollapsed')
    return saved ? JSON.parse(saved) : false
  })

  // Save collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('taskListCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleCreateTask = () => {
    // If modal handler is available, use it; otherwise fall back to old behavior
    if (onShowCreateTaskModal) {
      onShowCreateTaskModal()
    } else {
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
  }

  return (
    <div 
      className={`planner-card rounded-lg p-4 h-full flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`} 
      onDragOver={onDragOver} 
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && (
          <>
            <h2 className="text-lg font-semibold planner-text-primary">Task List</h2>
            <span className="text-sm planner-text-muted">{filteredTasks.length}</span>
          </>
        )}
        
        {/* Collapse/Expand Toggle Button */}
        <button
          onClick={toggleCollapse}
          className={`p-2 rounded-lg hover:bg-slate-600 transition-colors planner-text-muted hover:planner-text-primary ${
            isCollapsed ? 'w-full flex justify-center' : ''
          }`}
          title={isCollapsed ? 'Expand Task List' : 'Collapse Task List'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {filteredTasks.map((task) => (
              <TaskListCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onDragStart={(e) => onDragStart(e, task)}
                frames={frames}
                owners={owners}
                moveParticipants={moveParticipants}
                presence={presence}
              />
            ))}
          </div>

          <Button onClick={handleCreateTask} className="mt-4 w-full planner-button">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </>
      )}
    </div>
  )
}
