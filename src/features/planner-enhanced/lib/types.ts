export type Priority = "critical" | "high" | "medium" | "low"
export type TaskStatus = "not-started" | "in-progress" | "completed" | "cancelled" | "unassigned" | "assigned" | "todo" | "blocked"
export type CustomFieldType = "checkbox" | "date" | "dropdown" | "number" | "text"

export interface CustomField {
  id: string
  name: string
  type: CustomFieldType
  value: any
  options?: string[]
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Comment {
  id: string
  text: string
  author: string
  createdAt: Date
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface TaskAssignments {
  members?: string[]     // Move participant user IDs
  owners?: string[]      // Owner UIDs (personal owners and communal rooms)
  spaces?: string[]      // Communal room UIDs (subset of owners)
}

export interface Task {
  id: string
  title: string
  description?: string
  completed?: boolean
  frameId?: string
  priority?: Priority
  status?: TaskStatus
  effort?: number
  labels?: Label[]
  dueDate?: Date
  startDate?: Date
  checklist?: ChecklistItem[]
  comments?: Comment[]
  attachments?: Array<{ id: string; name: string; url: string }>
  assignees?: string[]   // Legacy field - keeping for compatibility
  assignments?: TaskAssignments
  customFields?: CustomField[]
  createdAt?: Date
  updatedAt?: Date
  defaultFrame?: string
}

export interface Frame {
  id: string
  title: string
  color: string
  offsetStart: number
  offsetEnd: number
  description?: string
  startDate?: Date
  endDate?: Date
}

// Smooth Moves Compatibility Types & Converters
export interface SmoothMovesTask {
  id: string
  title: string
  description?: string
  category: string
  subTasks: Array<{ id: string; title: string; completed: boolean; createdAt: number }>
  tags: Array<{ id: string; label: string; color: string; type: string }>
  priority: "low" | "medium" | "high" | "critical"
  status: "todo" | "in-progress" | "completed" | "blocked"
  assignedMember?: string
  completed: boolean
  originalCategory: string
  startDate?: Date
  dueDate?: Date
  createdAt: number
  updatedAt: number
  order?: number
  effort?: number
  customFields?: Record<string, any>
}

export interface SmoothMovesTimeframe {
  id: string
  title: string
  description?: string
  taskIds: string[]
  color?: string
  isDefault?: boolean
  order: number
  dateOffset?: number
  dateRange?: string
  createdAt?: number
  updatedAt?: number
}

// Conversion utility functions for Smooth Moves integration
export function taskToSmoothMoves(task: Task): SmoothMovesTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.frameId || 'unassigned',
    subTasks: task.checklist?.map((item) => ({
      id: item.id,
      title: item.text,
      completed: item.completed,
      createdAt: task.createdAt ? new Date(task.createdAt).getTime() : Date.now()
    })) || [],
    tags: task.labels?.map(label => ({
      id: label.id,
      label: label.name,
      color: label.color,
      type: 'custom'
    })) || [],
    priority: task.priority || 'medium',
    status: task.status === 'not-started' ? 'todo' : (task.status as any) || 'todo',
    assignedMember: task.assignees?.[0],
    completed: task.completed || false,
    originalCategory: task.frameId || 'unassigned',
    startDate: task.startDate,
    dueDate: task.dueDate,
    createdAt: task.createdAt ? new Date(task.createdAt).getTime() : Date.now(),
    updatedAt: task.updatedAt ? new Date(task.updatedAt).getTime() : Date.now(),
    effort: task.effort,
    customFields: task.customFields ? task.customFields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}) : {}
  }
}

export function smoothMovesToTask(smoothTask: SmoothMovesTask): Task {
  return {
    id: smoothTask.id,
    title: smoothTask.title,
    description: smoothTask.description,
    completed: smoothTask.completed,
    frameId: smoothTask.category,
    priority: smoothTask.priority,
    status: smoothTask.status === 'todo' ? 'not-started' : smoothTask.status as TaskStatus,
    effort: smoothTask.effort,
    labels: smoothTask.tags?.map(tag => ({
      id: tag.id,
      name: tag.label,
      color: tag.color
    })),
    dueDate: smoothTask.dueDate,
    startDate: smoothTask.startDate,
    checklist: smoothTask.subTasks?.map(subTask => ({
      id: subTask.id,
      text: subTask.title,
      completed: subTask.completed
    })),
    assignees: smoothTask.assignedMember ? [smoothTask.assignedMember] : undefined,
    customFields: smoothTask.customFields ? Object.entries(smoothTask.customFields).map(([name, value]) => ({
      id: name,
      name,
      type: typeof value === 'boolean' ? 'checkbox' : typeof value === 'number' ? 'number' : 'text' as CustomFieldType,
      value
    })) : undefined,
    createdAt: new Date(smoothTask.createdAt),
    updatedAt: new Date(smoothTask.updatedAt)
  }
}
