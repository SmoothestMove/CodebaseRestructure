import type React from "react"
import { useState } from "react"
import { CheckSquare, Users, User, Building, Calendar } from "lucide-react"
import { FaArrowCircleRight, FaCheckCircle } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { Task } from "../lib/types"

interface TaskListCardProps {
  task: Task
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
  frames?: Array<{ id: string; color: string }>
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void // Added task update handler for inline editing
}

export function TaskListCard({ task, onClick, onDragStart, frames = [], onUpdateTask }: TaskListCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editDescription, setEditDescription] = useState(task.description || "")

  const completedChecklist = task.checklist?.filter((item) => item.completed).length || 0
  const totalChecklist = task.checklist?.length || 0
  const hasDescription = task.description && task.description.trim().length > 0
  const hasDate = task.dueDate || task.startDate

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * This function retrieves frame color for visual consistency across the planner.
   * When integrating with external systems, ensure frame colors are synchronized
   * with the main application's theme system and user preferences.
   */
  const getFrameColor = () => {
    if (!task.frameId) return null
    const frame = frames.find((f) => f.id === task.frameId)
    return frame?.color || "#64748b"
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Arrow state management follows the visual progression:
   * 1. Unassigned: Light gray outline arrow (indicates draggable state)
   * 2. Assigned: Filled arrow with frame color (shows timeline assignment)
   * 3. Completed: Filled checkmark with frame color (indicates completion)
   *
   * When integrating, ensure this visual state is synchronized with the
   * main application's task management system and database updates.
   */
  const getArrowIcon = () => {
    const frameColor = getFrameColor()

    if (task.completed && task.frameId) {
      // Completed in timeline: filled checkmark with frame color
      return <FaCheckCircle className="h-4 w-4" style={{ color: frameColor }} />
    } else if (task.frameId && !task.completed) {
      // Assigned to timeline: filled arrow with frame color
      return <FaArrowCircleRight className="h-4 w-4" style={{ color: frameColor }} />
    } else {
      return <FaArrowCircleRight className="h-4 w-4 text-slate-400 opacity-50" />
    }
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Tooltips provide contextual guidance rather than repeating visible information.
   * This follows UX best practices for progressive disclosure and user education.
   */
  const getArrowTooltipContent = () => {
    if (task.completed && task.frameId) {
      return "Task completed - click to reopen or drag to reassign"
    } else if (task.frameId && !task.completed) {
      return "Task assigned to timeline - drag to move between frames"
    } else {
      return "Drag to assign to timeline frame"
    }
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Priority explanations should be customizable through global settings.
   * These descriptions help users understand the impact and urgency levels.
   */
  const getPriorityTooltip = (priority: string) => {
    const explanations = {
      critical: "Critical: Immediate attention required - blocks other tasks",
      high: "High: Important and time-sensitive - complete within 24-48 hours",
      medium: "Medium: Standard priority - complete within planned timeframe",
      low: "Low: Nice to have - complete when time permits",
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
      "not-started": "Not Started: Task is planned but work hasn't begun",
      "in-progress": "In Progress: Task is actively being worked on",
      completed: "Completed: Task has been finished and verified",
      cancelled: "Cancelled: Task is no longer needed or relevant",
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

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Assignment system supports three types: Members (team collaboration),
   * Owners (primary responsibility), and Spaces (location-based tasks).
   * When integrating, ensure these assignments sync with your user management
   * and organizational structure systems.
   */
  const renderAssignmentIndicators = () => {
    const assignments = task.assignments || []
    if (assignments.length === 0) return null

    const memberAssignments = assignments.filter((a) => a.type === "member")
    const ownerAssignments = assignments.filter((a) => a.type === "owner")
    const spaceAssignments = assignments.filter((a) => a.type === "space")

    return (
      <div className="flex items-center gap-1">
        {/* Multiple members indicator */}
        {memberAssignments.length > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full cursor-help">
                <Users className="h-3 w-3 text-white" />
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
              <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full cursor-help">
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
              <div className="flex items-center justify-center w-6 h-6 bg-amber-600 rounded-full cursor-help">
                <User className="h-3 w-3 text-white" />
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
              <div className="flex items-center justify-center w-6 h-6 bg-purple-600 rounded-full cursor-help">
                <Building className="h-3 w-3 text-white" />
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
   * Empty space click-to-edit functionality allows users to quickly modify
   * task details without opening the full modal. This improves workflow efficiency
   * by reducing the number of clicks required for common editing tasks.
   */
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent edit mode when clicking on interactive elements
    if ((e.target as HTMLElement).closest("[data-interactive]")) {
      return
    }
    onClick()
  }

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Inline title editing provides immediate feedback and reduces modal dependency.
   * Ensure title updates are debounced and validated before persistence.
   */
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

  /**
   * INTEGRATION NOTE FOR AI AGENTS:
   * Description editing allows users to add context directly from the task list.
   * This reduces the need to open the full task modal for simple text updates.
   */
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

  return (
    <TooltipProvider>
      <div
        draggable
        onDragStart={onDragStart}
        onClick={handleCardClick}
        className="bg-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-600 transition-colors border border-slate-600 active:scale-95"
      >
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
                className="bg-slate-600 border border-slate-500 rounded px-2 py-1 text-sm font-medium text-slate-100 outline-none flex-1"
                autoFocus
                data-interactive="true"
              />
            ) : (
              <h4
                onClick={handleTitleClick}
                className={`text-sm font-medium text-slate-100 flex-1 cursor-pointer hover:bg-slate-600 rounded px-1 py-0.5 transition-colors ${
                  task.completed && task.frameId ? "line-through opacity-75" : ""
                }`}
                title="Click to edit task title"
                data-interactive="true"
              >
                {task.title}
              </h4>
            )}
          </div>
          <div data-interactive="true">{renderAssignmentIndicators()}</div>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          {hasDate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-help"
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
                  <p className="font-medium mb-1">Click card to set dates with calendar picker</p>
                  {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                  {task.startDate && <p>Start: {new Date(task.startDate).toLocaleDateString()}</p>}
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {totalChecklist > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-help">
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
            className="mt-2 w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-slate-100 outline-none resize-none"
            rows={2}
            placeholder="Add task description... (Ctrl+Enter to save, Esc to cancel)"
            autoFocus
            data-interactive="true"
          />
        ) : (
          <div
            onClick={handleDescriptionClick}
            className={`mt-2 text-xs text-slate-400 cursor-pointer hover:bg-slate-600 rounded px-1 py-0.5 transition-colors ${
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
