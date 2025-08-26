export type TaskStatus = "not-started" | "in-progress" | "completed" | "cancelled"
export type Priority = "critical" | "high" | "medium" | "low"
export type CustomFieldType = "checkbox" | "date" | "dropdown" | "number" | "text"

export interface Label {
  id: string
  name: string
  color: string
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

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
}

export interface CustomField {
  id: string
  name: string
  type: CustomFieldType
  value: any
  options?: string[] // for dropdown type
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "member" | "owner" | "admin"
}

export interface Space {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
}

export interface Assignment {
  id: string
  userId?: string
  spaceId?: string
  type: "member" | "owner" | "space"
  assignedAt: Date
  assignedBy: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority?: Priority
  frameId?: string
  defaultFrame?: string
  labels?: Label[]
  checklist?: ChecklistItem[]
  comments?: Comment[]
  attachments?: Attachment[]
  assignments?: Assignment[] // Replaced assignees with comprehensive assignment system
  dueDate?: Date
  startDate?: Date
  customFields?: CustomField[]
  cover?: string
  effort?: number
  createdAt?: Date
  updatedAt?: Date
  completedAt?: Date // Added completion timestamp
  archivedAt?: Date // Added archive functionality
  integration?: IntegrationContext // Enhanced Task interface with integration context
}

export interface Frame {
  id: string
  title: string
  subtitle?: string // Added subtitle for better organization
  color: {
    bg: string
    text: string
    border: string
  } // Enhanced color system for consistency
  offsetStart: number
  offsetEnd: number
  startDate?: Date
  endDate?: Date
  order: number
  dateRange?: string
  isEditable?: boolean // Added editing state control
  createdAt?: Date
  updatedAt?: Date
}

export interface GlobalSettings {
  priorities: PriorityOption[]
  statuses: StatusOption[]
  labels: LabelOption[]
  dateFormat: string
  timeFormat: string
  theme: "light" | "dark" | "system"
}

export interface PriorityOption {
  id: string
  name: string
  value: Priority
  color: string
  description: string
  order: number
}

export interface StatusOption {
  id: string
  name: string
  value: TaskStatus
  color: string
  description: string
  order: number
}

export interface LabelOption {
  id: string
  name: string
  color: string
  description: string
  category?: string
  order: number
}

export interface AppState {
  tasks: Task[]
  frames: Frame[]
  users: User[]
  spaces: Space[]
  settings: GlobalSettings
  ui: UIState
}

export interface UIState {
  selectedTask: string | null
  isTaskModalOpen: boolean
  isSettingsOpen: boolean
  searchQuery: string
  draggedTask: string | null
  editingFrame: string | null
  loading: boolean
  error: string | null
}

export type AppAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FRAMES"; payload: Frame[] }
  | { type: "ADD_FRAME"; payload: Frame }
  | { type: "UPDATE_FRAME"; payload: { id: string; updates: Partial<Frame> } }
  | { type: "DELETE_FRAME"; payload: string }
  | { type: "SET_UI_STATE"; payload: Partial<UIState> }
  | { type: "SET_SETTINGS"; payload: Partial<GlobalSettings> }

export type TaskUpdate = Partial<Omit<Task, "id" | "createdAt">>
export type FrameUpdate = Partial<Omit<Frame, "id" | "createdAt">>

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  validationErrors?: ValidationError[]
  success: boolean
}

export interface IntegrationContext {
  // Placeholder for external system integration
  externalTaskId?: string
  syncStatus?: "pending" | "synced" | "error"
  lastSyncAt?: Date
  metadata?: Record<string, any>
}

export interface EnhancedTask extends Task {
  integration?: IntegrationContext
}
