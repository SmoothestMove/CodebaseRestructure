import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Task, Frame, Assignment, User, Space, ValidationError } from "./types"

/**
 * Task Management Utilities
 * These functions provide core task operations for the moving planner
 * AI Integration Note: These utilities handle all task CRUD operations
 */

export function createTask(data: Partial<Task>): Task {
  return {
    id: generateId(),
    title: data.title || "New Task",
    description: data.description || "",
    status: data.status || "not-started",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  }
}

export function updateTask(task: Task, updates: Partial<Task>): Task {
  return {
    ...task,
    ...updates,
    updatedAt: new Date(),
  }
}

export function assignTaskToFrame(task: Task, frameId: string): Task {
  return updateTask(task, { frameId })
}

/**
 * Assignment System Utilities
 * AI Integration Note: These handle user/space assignments with proper validation
 */

export function createAssignment(type: "member" | "owner" | "space", targetId: string, assignedBy: string): Assignment {
  return {
    id: generateId(),
    type,
    ...(type === "space" ? { spaceId: targetId } : { userId: targetId }),
    assignedAt: new Date(),
    assignedBy,
  }
}

export function getAssignedUsers(task: Task, users: User[]): User[] {
  if (!task.assignments) return []

  const userIds = task.assignments
    .filter((a) => a.type === "member" || a.type === "owner")
    .map((a) => a.userId)
    .filter(Boolean) as string[]

  return users.filter((user) => userIds.includes(user.id))
}

export function getAssignedSpaces(task: Task, spaces: Space[]): Space[] {
  if (!task.assignments) return []

  const spaceIds = task.assignments
    .filter((a) => a.type === "space")
    .map((a) => a.spaceId)
    .filter(Boolean) as string[]

  return spaces.filter((space) => spaceIds.includes(space.id))
}

/**
 * Frame Management Utilities
 * AI Integration Note: These handle timeline frame operations and validation
 */

export function createFrame(data: Partial<Frame>): Frame {
  return {
    id: generateId(),
    title: data.title || "New Frame",
    color: data.color || {
      bg: "bg-blue-600",
      text: "text-white",
      border: "border-blue-600",
    },
    offsetStart: data.offsetStart || 0,
    offsetEnd: data.offsetEnd || 7,
    order: data.order || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  }
}

export function calculateFrameProgress(
  frame: Frame,
  tasks: Task[],
): {
  completed: number
  total: number
  percentage: number
} {
  const frameTasks = tasks.filter((task) => task.frameId === frame.id)
  const completed = frameTasks.filter((task) => task.status === "completed").length
  const total = frameTasks.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return { completed, total, percentage }
}

/**
 * Validation Utilities
 * AI Integration Note: These provide comprehensive validation for all data types
 */

export function validateTask(task: Partial<Task>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!task.title || task.title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "Task title is required",
      code: "REQUIRED_FIELD",
    })
  }

  if (task.title && task.title.length > 200) {
    errors.push({
      field: "title",
      message: "Task title must be less than 200 characters",
      code: "MAX_LENGTH",
    })
  }

  return errors
}

export function validateFrame(frame: Partial<Frame>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!frame.title || frame.title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "Frame title is required",
      code: "REQUIRED_FIELD",
    })
  }

  if (frame.offsetStart !== undefined && frame.offsetEnd !== undefined) {
    if (frame.offsetStart >= frame.offsetEnd) {
      errors.push({
        field: "offsetEnd",
        message: "End offset must be greater than start offset",
        code: "INVALID_RANGE",
      })
    }
  }

  return errors
}

/**
 * Search and Filter Utilities
 * AI Integration Note: These provide flexible search capabilities
 */

export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks

  const searchTerm = query.toLowerCase()
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.labels?.some((label) => label.name.toLowerCase().includes(searchTerm)),
  )
}

export function filterTasksByFrame(tasks: Task[], frameId: string | null): Task[] {
  if (frameId === null) return tasks.filter((task) => !task.frameId)
  return tasks.filter((task) => task.frameId === frameId)
}

/**
 * Date and Time Utilities
 * AI Integration Note: These handle date formatting and calculations
 */

export function formatDate(date: Date, format = "MM/dd/yyyy"): string {
  // AI Integration Note: This should be replaced with proper date formatting library
  return date.toLocaleDateString("en-US")
}

export function calculateDaysUntilDue(dueDate: Date): number {
  const today = new Date()
  const diffTime = dueDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Color and Theme Utilities
 * AI Integration Note: These ensure consistent color usage across components
 */

export function getFrameColorClasses(color: Frame["color"]) {
  return {
    background: color.bg,
    text: color.text,
    border: color.border,
  }
}

export function getPriorityColor(priority: string): string {
  const colors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  }
  return colors[priority as keyof typeof colors] || "bg-gray-500"
}

/**
 * ID Generation Utility
 * AI Integration Note: This should be replaced with proper UUID generation
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
