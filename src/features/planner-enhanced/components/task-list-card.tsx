import type React from "react"
import { useState } from "react"
import { CheckSquare, Users, User, Building, Calendar, Home } from "lucide-react"
import { FaArrowCircleRight, FaCheckCircle } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { Task } from "../lib/types"
import type { Owner } from '@/types'
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants'

interface TaskListCardProps {
  task: Task
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
  frames?: Array<{ id: string; color: string }>
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void
  owners?: Owner[]
  moveParticipants?: Record<string, boolean>
  presence?: Record<string, any> | null
}

export function TaskListCard({ task, onClick, onDragStart, frames = [], onUpdateTask, owners = [], moveParticipants = {}, presence }: TaskListCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editDescription, setEditDescription] = useState(task.description || "")

  const completedChecklist = task.checklist?.filter((item) => item.completed).length || 0
  const totalChecklist = task.checklist?.length || 0
  const hasDescription = task.description && task.description.trim().length > 0
  const hasDate = task.dueDate || task.startDate

  const getFrameColor = () => {
    if (!task.frameId) return null
    const frame = frames.find((f) => f.id === task.frameId)
    return frame?.color || "#64748b"
  }

  const getArrowIcon = () => {
    const frameColor = getFrameColor()

    if (task.completed && task.frameId) {
      return <FaCheckCircle className="h-4 w-4" style={{ color: frameColor }} />
    } else if (task.frameId && !task.completed) {
      return <FaArrowCircleRight className="h-4 w-4" style={{ color: frameColor }} />
    } else {
      return <FaArrowCircleRight className="h-4 w-4 text-slate-400 opacity-50" />
    }
  }

  const getArrowTooltipContent = () => {
    if (task.completed && task.frameId) {
      return "Task completed - click to reopen or drag to reassign"
    } else if (task.frameId && !task.completed) {
      return "Task assigned to timeline - drag to move between frames"
    } else {
      return "Drag to assign to timeline frame"
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-interactive]")) {
      return
    }
    onClick()
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    if (onUpdateTask && editTitle.trim() !== task.title && editTitle.trim().length > 0) {
      onUpdateTask(task.id, { title: editTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave()
    } else if (e.key === "Escape") {
      setEditTitle(task.title)
      setIsEditingTitle(false)
    }
  }

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingDescription(true)
  }

  const handleDescriptionSave = () => {
    if (onUpdateTask && editDescription.trim() !== (task.description || "")) {
      onUpdateTask(task.id, { description: editDescription.trim() })
    }
    setIsEditingDescription(false)
  }

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleDescriptionSave()
    } else if (e.key === "Escape") {
      setEditDescription(task.description || "")
      setIsEditingDescription(false)
    }
  }

  // Get assignment information
  const assignedMembers = task.assignments?.members || []
  const assignedOwners = task.assignments?.owners || []
  const assignedSpaces = task.assignments?.spaces || []
  
  const getOwnerByUid = (uid: string) => {
    return owners.find(o => o.uid === uid)
  }
  
  const getSpaceByUid = (uid: string) => {
    return PREDEFINED_COMMUNAL_ROOMS.find(r => r.uid === uid)
  }
  
  // Helper function to get participant display name
  const getParticipantDisplayName = (userId: string) => {
    const displayName = presence?.[userId]?.displayName
    return displayName && displayName.trim() !== '' ? displayName : userId
  }

  const getAssignmentIndicators = () => {
    const indicators = []
    
    // Member avatar (upper-right)
    if (assignedMembers.length > 0) {
      const member = assignedMembers[0] // Show first member
      const displayName = getParticipantDisplayName(member)
      indicators.push(
        <Tooltip key="member-indicator">
          <TooltipTrigger asChild>
            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p className="font-medium">Assigned Members:</p>
              {assignedMembers.map(m => {
                const memberDisplayName = getParticipantDisplayName(m)
                return <p key={m} className="text-sm">{memberDisplayName}</p>
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }
    
    // Owner icon (middle-right)
    if (assignedOwners.length > 0) {
      const owner = getOwnerByUid(assignedOwners[0])
      indicators.push(
        <Tooltip key="owner-indicator">
          <TooltipTrigger asChild>
            <div 
              className="absolute top-8 right-2 w-5 h-5 rounded-sm flex items-center justify-center"
              style={{ backgroundColor: owner?.color || '#6B7280' }}
            >
              <Home className="h-3 w-3 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p className="font-medium">Assigned Owners:</p>
              {assignedOwners.map(uid => {
                const o = getOwnerByUid(uid)
                return <p key={uid} className="text-sm">{o?.firstName} {o?.lastName}</p>
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }
    
    // Space icon (bottom-right)
    if (assignedSpaces.length > 0) {
      const space = getSpaceByUid(assignedSpaces[0])
      indicators.push(
        <Tooltip key="space-indicator">
          <TooltipTrigger asChild>
            <div 
              className="absolute bottom-2 right-2 w-5 h-5 rounded-sm flex items-center justify-center"
              style={{ backgroundColor: space?.color || '#6B7280' }}
            >
              <Building className="h-3 w-3 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p className="font-medium">Assigned Spaces:</p>
              {assignedSpaces.map(uid => {
                const s = getSpaceByUid(uid)
                return <p key={uid} className="text-sm">{s?.firstName}</p>
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }
    
    return indicators
  }

  return (
    <TooltipProvider>
      <div
        draggable
        onDragStart={onDragStart}
        onClick={handleCardClick}
        className="task-card rounded-lg p-3 cursor-pointer hover:task-card transition-colors border border-slate-600 active:scale-95 relative"
      >
        {/* Assignment Indicators */}
        {getAssignmentIndicators()}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center" data-interactive="true">
                  {getArrowIcon()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getArrowTooltipContent()}</p>
              </TooltipContent>
            </Tooltip>

            {isEditingTitle ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="planner-input rounded px-2 py-1 text-sm font-medium outline-none flex-1"
                autoFocus
                data-interactive="true"
              />
            ) : (
              <h4
                onClick={handleTitleClick}
                className={`text-sm font-medium planner-text-primary flex-1 cursor-pointer hover:bg-slate-600 rounded px-1 py-0.5 transition-colors ${
                  task.completed && task.frameId ? "line-through opacity-75" : ""
                }`}
                title="Click to edit task title"
                data-interactive="true"
              >
                {task.title}
              </h4>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 planner-text-muted">
          {hasDate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-1 hover:planner-text-secondary transition-colors cursor-help"
                  data-interactive="true"
                >
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : task.startDate
                        ? new Date(task.startDate).toLocaleDateString()
                        : ""}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium mb-1">Click card to set dates</p>
                  {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                  {task.startDate && <p>Start: {new Date(task.startDate).toLocaleDateString()}</p>}
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {totalChecklist > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 hover:planner-text-secondary transition-colors cursor-help">
                  <CheckSquare className="h-3 w-3" />
                  <span className="text-xs">
                    {completedChecklist}/{totalChecklist}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium mb-2">
                    Checklist ({completedChecklist}/{totalChecklist}):
                  </p>
                  <div className="space-y-1">
                    {task.checklist?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className={item.completed ? "text-green-400" : "text-slate-400"}>
                          {item.completed ? "✓" : "○"}
                        </span>
                        <span className={item.completed ? "line-through opacity-75" : ""}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {isEditingDescription ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onBlur={handleDescriptionSave}
            onKeyDown={handleDescriptionKeyDown}
            className="mt-2 w-full planner-input rounded px-2 py-1 text-xs outline-none resize-none"
            rows={2}
            placeholder="Add task description..."
            autoFocus
            data-interactive="true"
          />
        ) : (
          <div
            onClick={handleDescriptionClick}
            className={`mt-2 text-xs planner-text-muted cursor-pointer hover:bg-slate-600 rounded px-1 py-0.5 transition-colors ${
              hasDescription ? "line-clamp-2" : "italic opacity-60"
            }`}
            title="Click to edit description"
            data-interactive="true"
          >
            {hasDescription ? task.description : "Click to add description..."}
          </div>
        )}

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.labels.map((label) => (
              <Tooltip key={label.id}>
                <TooltipTrigger asChild>
                  <span
                    style={{ backgroundColor: label.color }}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white cursor-help"
                  >
                    {label.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Task category: {label.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
