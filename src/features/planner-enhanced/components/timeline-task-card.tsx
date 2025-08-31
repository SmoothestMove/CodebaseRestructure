

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { FaAlignLeft, FaCheckSquare } from "react-icons/fa"
import { Users, User, Building, Calendar, Home } from "lucide-react"
import { useLongPress } from "../hooks/use-long-press"
import type { Task } from "../lib/types"
import type { Owner } from '@/types'
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants'

interface TimelineTaskCardProps {
  task: Task
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
  onToggleComplete?: (taskId: string) => void
  frameColor?: string
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void
  owners?: Owner[]
  moveParticipants?: Record<string, boolean>
  presence?: Record<string, any> | null
}

export function TimelineTaskCard({
  task,
  onClick,
  onDragStart,
  onToggleComplete,
  frameColor,
  onUpdateTask,
  owners = [],
  moveParticipants = {},
  presence,
}: TimelineTaskCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const completedChecklist = task.checklist?.filter((item) => item.completed).length || 0
  const totalChecklist = task.checklist?.length || 0

  const longPressHandlers = useLongPress(onClick, 300)

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Empty space click-to-edit functionality for Timeline cards maintains
   * consistency with Task List cards while preserving existing interactions
   * like checkbox completion and drag-and-drop functionality.
   */
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent edit mode when clicking on interactive elements
    if ((e.target as HTMLElement).closest("[data-interactive]")) {
      return
    }
    onClick()
  }

  const getPriorityColor = (priority?: string) => {
    const colors = {
      critical: "priority-critical",
      high: "priority-high", 
      medium: "priority-medium",
      low: "priority-low",
    }
    return priority ? colors[priority as keyof typeof colors] || "bg-neutral-600 text-white" : "bg-neutral-600 text-white"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      "not-started": "status-not-started",
      "in-progress": "status-in-progress",
      completed: "status-completed",
      cancelled: "status-cancelled",
    }
    return colors[status as keyof typeof colors] || "status-not-started"
  }

  const getPriorityTooltip = (priority: string) => {
    const explanations = {
      critical: "Immediate attention required - blocks other tasks",
      high: "Important and time-sensitive - complete within 24-48 hours",
      medium: "Standard priority - complete within planned timeframe",
      low: "Nice to have - complete when time permits",
    }
    return explanations[priority as keyof typeof explanations] || "Priority level not defined"
  }

  const getStatusTooltip = (status: string) => {
    const explanations = {
      "not-started": "Task is planned but work hasn't begun",
      "in-progress": "Task is actively being worked on",
      completed: "Task has been finished and verified",
      cancelled: "Task is no longer needed or relevant",
    }
    return explanations[status as keyof typeof explanations] || "Status not defined"
  }

  const getLabelTooltip = (labelName: string) => {
    const categoryExplanations = {
      "Packing & Organizing": "Tasks involving sorting, packing belongings, and organizing items for the move",
      "Logistics & Transportation": "Tasks related to moving trucks, routes, permits, and transportation coordination",
      "Cleaning & Maintenance": "Tasks involving cleaning current/new home and handling repairs or maintenance",
      "Utilities & Services": "Tasks for setting up or transferring utilities, internet, and essential services",
      "Inventory & Documentation": "Tasks involving record-keeping, documentation, and tracking belongings",
    }
    return categoryExplanations[labelName as keyof typeof categoryExplanations] || "Task category for organization"
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleComplete?.(task.id)
  }

  const getCardStyle = () => {
    if (task.completed) {
      return {}
    }
    return frameColor ? { backgroundColor: frameColor } : {}
  }

  const getCardClassName = () => {
    if (task.completed) {
      return "bg-neutral-600 hover:bg-neutral-500"
    }
    return frameColor ? "hover:brightness-110 task-card" : "task-card frame-default frame-hover"
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    if (onUpdateTask && editTitle.trim() !== task.title) {
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
  
  const renderAssignmentIndicators = () => {
    if (!assignedMembers.length && !assignedOwners.length && !assignedSpaces.length) return null

    return (
      <div className="absolute top-1 right-1 flex items-center gap-1">
        {/* Member indicators */}
        {assignedMembers.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-help">
                {assignedMembers.length === 1 ? getParticipantDisplayName(assignedMembers[0]).substring(0, 2).toUpperCase() : assignedMembers.length}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <p className="font-medium">Assigned Members:</p>
                {assignedMembers.map(m => <p key={m} className="text-sm">{getParticipantDisplayName(m)}</p>)}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* Owner indicators */}
        {assignedOwners.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="w-4 h-4 rounded-sm flex items-center justify-center cursor-help"
                style={{ backgroundColor: getOwnerByUid(assignedOwners[0])?.color || '#6B7280' }}
              >
                <Home className="h-2.5 w-2.5 text-white" />
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
        )}
        
        {/* Space indicators */}
        {assignedSpaces.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="w-4 h-4 rounded-sm flex items-center justify-center cursor-help"
                style={{ backgroundColor: getSpaceByUid(assignedSpaces[0])?.color || '#6B7280' }}
              >
                <Building className="h-2.5 w-2.5 text-white" />
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
        )}
      </div>
    )
  }

  const getDateTooltipContent = () => {
    return (
      <div className="max-w-xs">
        <p className="font-medium mb-1">Click card to modify dates with calendar picker</p>
        {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
        {task.startDate && <p>Start: {new Date(task.startDate).toLocaleDateString()}</p>}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div
        draggable
        onDragStart={onDragStart}
        onClick={handleCardClick}
        {...longPressHandlers}
        style={getCardStyle()}
        className={`rounded-lg p-3 cursor-pointer transition-all duration-200 border border-slate-600 group relative active:scale-95 ${getCardClassName()}`}
      >
        {renderAssignmentIndicators()}

        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              onClick={handleCheckboxClick}
              className="w-4 h-4 rounded-full border-2 border-slate-400 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors"
              data-interactive="true"
            >
              {task.completed && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            </div>
            {isEditingTitle ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="bg-transparent border-b border-slate-400 text-sm font-medium text-slate-100 outline-none flex-1 pr-8"
                autoFocus
                data-interactive="true"
              />
            ) : (
              <h4
                className={`text-sm font-medium text-slate-100 flex-1 pr-8 cursor-pointer hover:opacity-80 transition-opacity ${
                  task.completed ? "line-through opacity-75" : ""
                }`}
                onClick={handleTitleClick}
                title="Click to edit task title"
                data-interactive="true"
              >
                {task.title}
              </h4>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          {task.dueDate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-help"
                  data-interactive="true"
                >
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>{getDateTooltipContent()}</TooltipContent>
            </Tooltip>
          )}

          {task.description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-help">
                  <FaAlignLeft className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="text-sm">{task.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {totalChecklist > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-help">
                  <FaCheckSquare className="h-3 w-3" />
                  <span>
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

        <div className="flex flex-wrap gap-1 mb-2">
          {task.priority && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`text-xs cursor-help ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getPriorityTooltip(task.priority)}</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={`text-xs cursor-help ${getStatusColor(task.status)}`}>
                {task.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusTooltip(task.status)}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <Tooltip key={label.id}>
                <TooltipTrigger asChild>
                  <Badge style={{ backgroundColor: label.color }} className="text-xs text-white cursor-help">
                    {label.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getLabelTooltip(label.name)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
