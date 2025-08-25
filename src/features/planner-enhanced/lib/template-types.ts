import { Timestamp } from 'firebase/firestore'
import type { Priority, TaskStatus, CustomField, ChecklistItem, Label } from './types'

// ===============================================
// Template System Types
// ===============================================

export interface TaskTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  
  // Template Task Data
  taskData: {
    title: string
    description?: string
    priority: Priority
    status: TaskStatus
    effort?: number
    labels: string[]           // Label IDs to apply
    checklist: TemplateChecklistItem[]
    customFields: TemplateCustomField[]
    defaultFrame?: string
  }
  
  // Template Metadata
  isPublic: boolean           // Available to all users vs private
  isSystem: boolean           // Built-in templates vs user-created
  usageCount: number          // How many times this template has been used
  tags: string[]              // Searchable tags
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string           // User UID
  lastUsedAt?: Timestamp
}

export interface FrameTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  
  // Template Frame Data
  frameData: {
    title: string
    color: string
    offsetStart: number
    offsetEnd: number
    description?: string
    taskTemplateIds: string[]  // Tasks to create when frame is applied
  }
  
  // Template Metadata
  isPublic: boolean
  isSystem: boolean
  usageCount: number
  tags: string[]
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  lastUsedAt?: Timestamp
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  
  // Complete project structure
  projectData: {
    name: string
    description: string
    frameTemplateIds: string[]  // Frames to create
    taskTemplateIds: string[]   // Standalone tasks to create
    labelTemplates: TemplateLabelData[]
    settings: TemplateSettings
  }
  
  // Template Metadata
  isPublic: boolean
  isSystem: boolean
  usageCount: number
  tags: string[]
  estimatedDuration: number   // Days
  complexity: 'simple' | 'moderate' | 'complex'
  
  // Audit Trail
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  lastUsedAt?: Timestamp
}

export type TemplateCategory = 
  | 'residential-move'
  | 'office-move' 
  | 'long-distance'
  | 'international'
  | 'student-move'
  | 'senior-move'
  | 'military-move'
  | 'corporate-relocation'
  | 'custom'
  | 'maintenance'
  | 'cleaning'
  | 'logistics'

// ===============================================
// Supporting Template Types
// ===============================================

export interface TemplateChecklistItem {
  text: string
  isOptional?: boolean
  estimatedTime?: number      // Minutes
  dependency?: string         // ID of item that must be completed first
}

export interface TemplateCustomField {
  name: string
  type: 'checkbox' | 'date' | 'dropdown' | 'number' | 'text'
  defaultValue?: any
  options?: string[]          // For dropdown type
  isRequired?: boolean
  placeholder?: string
}

export interface TemplateLabelData {
  name: string
  color: string
  category?: string
  description?: string
}

export interface TemplateSettings {
  autoAssignToCurrentUser: boolean
  defaultPriority: Priority
  enableNotifications: boolean
  timelineStartsFrom: 'move-date' | 'today'
}

// ===============================================
// Template Application Results
// ===============================================

export interface TemplateApplicationResult {
  success: boolean
  itemsCreated: {
    tasks: string[]           // Task IDs created
    frames: string[]          // Frame IDs created
    labels: string[]          // Label IDs created
  }
  errors: Array<{
    type: 'task' | 'frame' | 'label'
    templateId: string
    error: string
  }>
  warnings: Array<{
    type: 'duplicate' | 'missing-dependency' | 'validation'
    message: string
  }>
}

// ===============================================
// Template Search and Filtering
// ===============================================

export interface TemplateSearchFilters {
  category?: TemplateCategory[]
  tags?: string[]
  isPublic?: boolean
  complexity?: ('simple' | 'moderate' | 'complex')[]
  createdBy?: string
  maxDuration?: number        // Days
  searchText?: string
}

export interface TemplateSearchResult<T = TaskTemplate | FrameTemplate | ProjectTemplate> {
  results: T[]
  totalCount: number
  categories: Array<{
    category: TemplateCategory
    count: number
  }>
  tags: Array<{
    tag: string
    count: number
  }>
}

// ===============================================
// Template Sharing and Collaboration
// ===============================================

export interface TemplateShare {
  id: string
  templateId: string
  templateType: 'task' | 'frame' | 'project'
  shareType: 'public' | 'link' | 'specific-users'
  
  // Access Control
  allowedUsers?: string[]     // User UIDs for specific sharing
  accessLevel: 'view' | 'use' | 'edit'
  requiresApproval?: boolean
  
  // Sharing Metadata
  shareUrl?: string           // For link sharing
  downloadCount: number
  rating?: number             // Average user rating
  reviews: TemplateReview[]
  
  // Audit Trail
  createdAt: Timestamp
  createdBy: string
  expiresAt?: Timestamp
}

export interface TemplateReview {
  id: string
  userId: string
  userName: string
  rating: number              // 1-5 stars
  comment?: string
  isVerified: boolean         // User has actually used the template
  createdAt: Timestamp
}

// ===============================================
// Template Collection Paths
// ===============================================

export const TEMPLATE_COLLECTIONS = {
  TASK_TEMPLATES: 'templateTasks',
  FRAME_TEMPLATES: 'templateFrames',
  PROJECT_TEMPLATES: 'templateProjects',
  TEMPLATE_SHARES: 'templateShares',
  TEMPLATE_REVIEWS: 'templateReviews'
} as const

// User-specific template collections
export const USER_TEMPLATE_COLLECTIONS = {
  TASK_TEMPLATES: (userId: string) => `users/${userId}/taskTemplates`,
  FRAME_TEMPLATES: (userId: string) => `users/${userId}/frameTemplates`, 
  PROJECT_TEMPLATES: (userId: string) => `users/${userId}/projectTemplates`,
  FAVORITES: (userId: string) => `users/${userId}/templateFavorites`
} as const

// Move-specific template usage tracking
export const MOVE_TEMPLATE_COLLECTIONS = {
  APPLIED_TEMPLATES: (moveId: string) => `moves/${moveId}/appliedTemplates`,
  TEMPLATE_CUSTOMIZATIONS: (moveId: string) => `moves/${moveId}/templateCustomizations`
} as const