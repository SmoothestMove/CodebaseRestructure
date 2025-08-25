import { Timestamp } from 'firebase/firestore'
import { Priority, TaskStatus, CustomFieldType } from './types'

// ===============================================
// Firebase Collection Document Interfaces
// ===============================================

/**
 * Firebase document structure for planner tasks
 * Collection: /moves/{moveId}/plannerTasks/{taskId}
 */
export interface FirebasePlannerTask {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  completed: boolean
  
  // Timeline Management
  frameId?: string            // Reference to plannerFrames/{frameId}
  defaultFrame?: string       // Original frame assignment for reset functionality
  order: number               // Position within frame
  
  // Scheduling
  startDate?: Timestamp       // Firebase Timestamp
  dueDate?: Timestamp        // Firebase Timestamp
  effort?: number            // Estimated hours
  
  // Assignment System
  assignees: string[]        // Array of user UIDs
  
  // Rich Content
  labels: string[]           // References to plannerLabels/{labelId}
  checklist: FirebaseChecklistItem[]
  customFields: FirebaseCustomField[]
  
  // Attachments (references)
  attachmentIds: string[]    // References to plannerAttachments/{attachmentId}
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string          // User UID
  lastModifiedBy: string     // User UID
  
  // Smooth Moves Integration
  smoothMovesTaskId?: string // Optional link to existing task
  syncStatus?: "synced" | "pending" | "conflict"
}

/**
 * Firebase document structure for timeline frames
 * Collection: /moves/{moveId}/plannerFrames/{frameId}
 */
export interface FirebasePlannerFrame {
  id: string
  title: string
  description?: string
  color: string             // Hex color code
  
  // Timeline Positioning
  offsetStart: number       // Days from move day
  offsetEnd: number         // Days from move day  
  startDate?: Timestamp     // Calculated absolute dates
  endDate?: Timestamp
  
  // Organization
  order: number             // Display order
  isDefault: boolean        // System vs user-created
  isVisible: boolean        // Show/hide toggle
  
  // Task Management
  taskIds: string[]         // Ordered array of task IDs in this frame
  taskCount: number         // Cached count for performance
  completedCount: number    // Cached completed task count
  
  // Customization
  isEditable: boolean       // Can users modify this frame
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  lastModifiedBy: string
}

/**
 * Firebase document structure for labels
 * Collection: /moves/{moveId}/plannerLabels/{labelId}
 */
export interface FirebasePlannerLabel {
  id: string
  name: string
  color: string            // Hex color code
  description?: string
  category?: string        // Grouping labels by category
  
  // Usage Stats
  usageCount: number       // How many tasks use this label
  
  // Organization
  order: number            // Display order in UI
  isDefault: boolean       // System vs user-created
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

/**
 * Firebase document structure for planner settings
 * Document: /moves/{moveId}/plannerSettings/config
 */
export interface FirebasePlannerSettings {
  // UI State
  sidebarCollapsed: boolean
  selectedTaskId?: string
  isTaskModalOpen: boolean
  
  // View Preferences  
  viewMode: "timeline" | "list" | "board"
  dateFormat: string           // "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd"
  timeFormat: "12h" | "24h"
  theme: "light" | "dark" | "system"
  
  // Timeline Configuration
  timelineZoomLevel: number    // 1-5 scale
  showWeekends: boolean
  showCompletedTasks: boolean
  
  // Task Defaults
  defaultPriority: Priority
  defaultStatus: TaskStatus
  autoAssignToCurrentUser: boolean
  
  // Integration Settings
  enableSmoothMovesSync: boolean
  syncDirection: "bidirectional" | "planner-only" | "smoothmoves-only"
  
  // Notifications
  enableDueDateReminders: boolean
  reminderDaysBefore: number
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
  lastModifiedBy: string
}

/**
 * Firebase document structure for comments
 * Collection: /moves/{moveId}/plannerComments/{commentId}
 */
export interface FirebasePlannerComment {
  id: string
  taskId: string           // Reference to plannerTasks/{taskId}
  text: string
  author: string           // User UID
  authorName: string       // Cached user display name
  authorAvatar?: string    // Cached user avatar URL
  
  // Threading (for future expansion)
  parentCommentId?: string
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Firebase document structure for attachments
 * Collection: /moves/{moveId}/plannerAttachments/{attachmentId}
 */
export interface FirebasePlannerAttachment {
  id: string
  taskId: string           // Reference to plannerTasks/{taskId}
  name: string
  fileName: string
  fileSize: number         // Bytes
  mimeType: string
  
  // Firebase Storage reference
  storageUrl: string       // Firebase Storage download URL
  storagePath: string      // Firebase Storage file path
  
  // Upload metadata
  uploadedBy: string       // User UID
  uploadedAt: Timestamp
}

/**
 * Firebase document structure for activity logging
 * Collection: /moves/{moveId}/plannerActivity/{activityId}
 */
export interface FirebasePlannerActivity {
  id: string
  type: ActivityType       // Type of activity/change
  
  // References
  taskId?: string          // Optional task reference
  frameId?: string         // Optional frame reference
  
  // Change Details
  before?: Record<string, any>  // Previous values (for updates)
  after?: Record<string, any>   // New values (for updates)
  
  // User Context
  userId: string           // Who made the change
  userName: string         // Cached user name
  
  // Audit Trail
  createdAt: Timestamp
}

// ===============================================
// Supporting Types and Enums
// ===============================================

export type ActivityType = 
  | "task_created" | "task_updated" | "task_deleted" | "task_completed" | "task_moved"
  | "frame_created" | "frame_updated" | "frame_deleted" 
  | "comment_added" | "attachment_uploaded" | "attachment_deleted"
  | "bulk_update" | "planner_initialized" | "settings_updated"

export interface FirebaseChecklistItem {
  id: string
  text: string
  completed: boolean
  createdAt: Timestamp
  completedAt?: Timestamp
  completedBy?: string      // User UID who completed this item
}

export interface FirebaseCustomField {
  id: string
  name: string
  type: CustomFieldType     // "checkbox" | "date" | "dropdown" | "number" | "text"
  value: any
  options?: string[]        // For dropdown type
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ===============================================
// Collection Reference Helpers
// ===============================================

/**
 * Collection paths for Firebase operations
 */
export const PLANNER_COLLECTIONS = {
  TASKS: (moveId: string) => `moves/${moveId}/plannerTasks`,
  FRAMES: (moveId: string) => `moves/${moveId}/plannerFrames`, 
  LABELS: (moveId: string) => `moves/${moveId}/plannerLabels`,
  SETTINGS: (moveId: string) => `moves/${moveId}/plannerSettings`,
  COMMENTS: (moveId: string) => `moves/${moveId}/plannerComments`,
  ATTACHMENTS: (moveId: string) => `moves/${moveId}/plannerAttachments`,
  ACTIVITY: (moveId: string) => `moves/${moveId}/plannerActivity`
} as const

/**
 * Document paths for Firebase operations
 */
export const PLANNER_DOCUMENTS = {
  TASK: (moveId: string, taskId: string) => `moves/${moveId}/plannerTasks/${taskId}`,
  FRAME: (moveId: string, frameId: string) => `moves/${moveId}/plannerFrames/${frameId}`,
  LABEL: (moveId: string, labelId: string) => `moves/${moveId}/plannerLabels/${labelId}`,
  SETTINGS: (moveId: string) => `moves/${moveId}/plannerSettings/config`,
  COMMENT: (moveId: string, commentId: string) => `moves/${moveId}/plannerComments/${commentId}`,
  ATTACHMENT: (moveId: string, attachmentId: string) => `moves/${moveId}/plannerAttachments/${attachmentId}`,
  ACTIVITY: (moveId: string, activityId: string) => `moves/${moveId}/plannerActivity/${activityId}`
} as const

// ===============================================
// Type Conversion Utilities
// ===============================================

/**
 * Convert Firebase Timestamp to JavaScript Date
 */
export function timestampToDate(timestamp?: Timestamp): Date | undefined {
  return timestamp?.toDate()
}

/**
 * Convert JavaScript Date to Firebase Timestamp
 */
export function dateToTimestamp(date?: Date): Timestamp | undefined {
  return date ? Timestamp.fromDate(date) : undefined
}

/**
 * Convert local Task interface to Firebase document format
 */
export function taskToFirebaseTask(task: import('./types').Task, userId: string): Omit<FirebasePlannerTask, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: task.title,
    description: task.description,
    status: task.status || 'not-started',
    priority: task.priority || 'medium',
    completed: task.completed || false,
    
    frameId: task.frameId,
    defaultFrame: task.defaultFrame,
    order: 0, // Will be set during creation
    
    startDate: task.startDate ? Timestamp.fromDate(task.startDate) : undefined,
    dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : undefined,
    effort: task.effort,
    
    assignees: task.assignees || [],
    labels: task.labels?.map(l => l.id) || [],
    checklist: task.checklist?.map(item => ({
      id: item.id,
      text: item.text,
      completed: item.completed,
      createdAt: Timestamp.now()
    })) || [],
    customFields: task.customFields?.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      value: field.value,
      options: field.options,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })) || [],
    
    attachmentIds: task.attachments?.map(a => a.id) || [],
    
    createdBy: userId,
    lastModifiedBy: userId
  }
}

/**
 * Convert Firebase document to local Task interface
 */
export function firebaseTaskToTask(firebaseTask: FirebasePlannerTask, labels: import('./types').Label[] = []): import('./types').Task {
  return {
    id: firebaseTask.id,
    title: firebaseTask.title,
    description: firebaseTask.description,
    completed: firebaseTask.completed,
    frameId: firebaseTask.frameId,
    priority: firebaseTask.priority,
    status: firebaseTask.status,
    effort: firebaseTask.effort,
    labels: labels.filter(l => firebaseTask.labels.includes(l.id)),
    dueDate: firebaseTask.dueDate?.toDate(),
    startDate: firebaseTask.startDate?.toDate(),
    checklist: firebaseTask.checklist?.map(item => ({
      id: item.id,
      text: item.text,
      completed: item.completed
    })),
    assignees: firebaseTask.assignees,
    customFields: firebaseTask.customFields?.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      value: field.value,
      options: field.options
    })),
    attachments: [], // Will be populated separately
    createdAt: firebaseTask.createdAt?.toDate(),
    updatedAt: firebaseTask.updatedAt?.toDate(),
    defaultFrame: firebaseTask.defaultFrame
  }
}