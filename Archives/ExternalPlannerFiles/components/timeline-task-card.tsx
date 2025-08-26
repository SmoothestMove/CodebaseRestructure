import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { FaAlignLeft, FaCheckSquare } from "react-icons/fa"
import { Users, User, Building, Calendar } from "lucide-react"
import { useLongPress } from "../hooks/use-long-press"
import type { Task } from "../lib/types"

interface TimelineTaskCardProps {
  task: Task
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
  onToggleComplete?: (taskId: string) => void
  frameColor?: string
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void // Added task update handler
}

export function TimelineTaskCard({
  task,
  onClick,
  onDragStart,
  onToggleComplete,
  frameColor,
  onUpdateTask, // Added task update handler
}: TimelineTaskCardProps) {
  const completedChecklist = task.checklist?.filter((item) => item.completed).length || 0
  const totalChecklist = task.checklist?.length || 0

  const longPressHandlers = useLongPress(onClick, 300)

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Priority colors follow accessibility guidelines with sufficient contrast.
   * These colors should be synchronized with the global settings system
   * and user customization preferences when integrating.
   */
  const getPriorityColor = (priority?: string) => {
    const colors = {
      critical: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-green-500 text-white",
    }
    return priority ? colors[priority as keyof typeof colors] || "bg-slate-500 text-white" : "bg-slate-500 text-white"
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Status colors use darker shades as specified in design guidelines.
   * Ensure these align with the organization's workflow color conventions.
   */
  const getStatusColor = (status: string) => {
    const colors = {
      "not-started": "bg-slate-600 text-white",
      "in-progress": "bg-blue-600 text-white",
      completed: "bg-green-600 text-white",
      cancelled: "bg-red-600 text-white",
    }
    return colors[status as keyof typeof colors] || "bg-slate-600 text-white"
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Priority explanations should be customizable through global settings.
   * These descriptions help users understand impact and urgency levels.
   */
  const getPriorityTooltip = (priority: string) => {
    const explanations = {
      critical: "Immediate attention required - blocks other tasks",
      high: "Important and time-sensitive - complete within 24-48 hours",
      medium: "Standard priority - complete within planned timeframe",
      low: "Nice to have - complete when time permits",
    }
    return explanations[priority as keyof typeof explanations] || "Priority level not defined"
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Status explanations provide clarity on task lifecycle stages.
   * These should align with the organization's workflow definitions.
   */
  const getStatusTooltip = (status: string) => {
    const explanations = {
      "not-started": "Task is planned but work hasn't begun",
      "in-progress": "Task is actively being worked on",
      completed: "Task has been finished and verified",
      cancelled: "Task is no longer needed or relevant",
    }
    return explanations[status as keyof typeof explanations] || "Status not defined"
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Label category explanations help users understand task organization.
   * These descriptions should be customizable through global settings.
   */
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

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Frame color application creates visual consistency between timeline frames
   * and their contained tasks. Ensure color values are properly synchronized
   * with the frame color system when integrating.
   */
  const getCardStyle = () => {
    if (task.completed) {
      return {}
    }
    return frameColor ? { backgroundColor: frameColor } : {}
  }

  const getCardClassName = () => {
    if (task.completed) {
      return "bg-slate-600 hover:bg-slate-500"
    }
    return frameColor ? "hover:brightness-110" : "bg-slate-700 hover:bg-slate-600"
  }

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Inline title editing allows users to quickly modify task titles without
   * opening the full task modal. Ensure title updates are persisted and
   * synchronized across all connected clients.
   */
  const handleTitleClick = (e: React.MouseEvent) => {
    console.log("[v0] Title clicked, entering edit mode")
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    console.log("[v0] Saving title:", editTitle)
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

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Assignment rendering follows the same pattern as TaskListCard for consistency.
   * Ensure assignment data structure matches your user management system.
   */
  const renderAssignmentIndicators = () => {
    const assignments = task.assignments || []
    if (assignments.length === 0) return null

    const memberAssignments = assignments.filter((a) => a.type === "member")
    const ownerAssignments = assignments.filter((a) => a.type === "owner")
    const spaceAssignments = assignments.filter((a) => a.type === "space")

    return (
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {/* Multiple members indicator */}
        {memberAssignments.length > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full cursor-help">
                <Users className="h-2.5 w-2.5 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium mb-2">Assigned Members ({memberAssignments.length}):</p>
                <div className="space-y-1">
                  {memberAssignments.map((assignment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{assignment.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm">{assignment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Single member indicator */}
        {memberAssignments.length === 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full cursor-help">
                <span className="text-xs text-white font-medium">{memberAssignments[0].name.charAt(0)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Assigned to: {memberAssignments[0].name}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Owner indicator */}
        {ownerAssignments.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-5 h-5 bg-amber-600 rounded-full cursor-help">
                <User className="h-2.5 w-2.5 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Owner: {ownerAssignments[0].name}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Space indicator */}
        {spaceAssignments.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-5 h-5 bg-purple-600 rounded-full cursor-help">
                <Building className="h-2.5 w-2.5 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Space: {spaceAssignments[0].name}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    )
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Empty space click-to-edit functionality for Timeline cards maintains
   * consistency with Task List cards while preserving existing interactions
   * like checkbox completion and drag-and-drop functionality.
   */
  const handleCardClick = (e: React.MouseEvent) => {
    console.log("[v0] Timeline card clicked", { taskId: task.id, target: e.target })

    // Prevent modal when clicking on interactive elements
    if ((e.target as HTMLElement).closest('[data-interactive="true"]')) {
      console.log("[v0] Interactive element clicked, preventing modal")
      return
    }

    console.log("[v0] Calling onClick to open Task Modal")
    onClick()
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Enhanced date tooltip provides guidance for calendar picker usage.
   * This creates a consistent user experience across both card types.
   */
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
                <div
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-help"
                  data-interactive="true"
                >
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
                <div
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-help"
                  data-interactive="true"
                >
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
                <Badge className={`text-xs cursor-help ${getPriorityColor(task.priority)}`} data-interactive="true">
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
              <Badge className={`text-xs cursor-help ${getStatusColor(task.status)}`} data-interactive="true">
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
                  <Badge
                    style={{ backgroundColor: label.color }}
                    className="text-xs text-white cursor-help"
                    data-interactive="true"
                  >
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
