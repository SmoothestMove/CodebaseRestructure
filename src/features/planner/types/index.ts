// Planner Feature Type Definitions
export interface PlannerTask {
  id: string;
  title: string;
  description?: string;
  category: string; // Timeline category (e.g., '8-weeks-out', 'move-day', etc.)
  subTasks: SubTask[];
  tags: TaskTag[];
  priority: PriorityLevel;
  status: TaskStatus;
  assignedMember?: string; // Owner UID from existing owners system
  completed: boolean;
  originalCategory: string; // Original category from checklist
  startDate?: Date; // Optional start date (automatically set when assigned to timeframe)
  dueDate?: Date; // Optional due date (automatically set when assigned to timeframe)
  createdAt: number;
  updatedAt: number;
  order?: number; // For ordering within a timeframe
  
  // Additional custom fields
  risk?: 'low_risk' | 'moderate_risk' | 'high_risk';
  effort?: number; // Hours or story points
  customFields?: Record<string, any>; // User-defined custom fields
  
  // Card covers and attachments
  cover?: TaskCover; // Card cover image/color
  attachments?: TaskAttachment[]; // File attachments
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface TaskTag {
  id: string;
  label: string;
  color: string;
  type: TagType;
}

export interface TimeframeColumn {
  id: string;
  title: string;
  description?: string;
  taskIds: string[]; // Task IDs in order for this timeframe
  color?: string;
  isDefault?: boolean; // Whether this is a default timeframe from checklist
  order: number; // For column ordering
  dateOffset?: number; // Days offset from move date (negative = before, positive = after)
  dateRange?: string; // Human-readable date range description
  createdAt?: number;
  updatedAt?: number;
}

export interface PlannerState {
  tasks: Record<string, PlannerTask>;
  timeframes: Record<string, TimeframeColumn>;
  timeframeOrder: string[]; // Array of timeframe IDs in display order
  sidebarCollapsed: boolean;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

// Enums and constants
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'blocked';
export type TagType = 'custom' | 'priority' | 'status' | 'category';

// Custom Fields System
export type CustomFieldType = 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'textarea';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[]; // For dropdown fields
  defaultValue?: any;
  order: number;
  icon?: string;
  color?: string;
  isDefault?: boolean; // For system default fields
}

export interface CustomFieldsConfig {
  fields: Record<string, CustomFieldDefinition>;
  moveId: string;
  createdAt: number;
  updatedAt: number;
}

// Card covers and attachments
export interface TaskCover {
  type: 'color' | 'gradient' | 'image';
  value: string; // Color hex, gradient CSS, or image URL/base64
  alt?: string; // Alt text for images
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'link' | 'other';
  url?: string; // For uploaded files or external links
  base64?: string; // For embedded files
  size?: number; // File size in bytes
  mimeType?: string;
  uploadedAt: number;
  uploadedBy?: string; // User UID who uploaded
}

// Default timeframes from design document
export const DEFAULT_TIMEFRAMES = {
  'app-setup': {
    title: 'App Setup & Initial Planning',
    description: 'Get started with the app and basic planning',
    color: '#8B5CF6', // Purple
    dateOffset: 0, // Immediately
    dateRange: 'Immediately',
    order: 1
  },
  'week-8': {
    title: '8 Weeks: Planning, Purging & Well-being',
    description: 'Start planning and decluttering',
    color: '#3B82F6', // Blue
    dateOffset: -56, // -8 weeks
    dateRange: '8 weeks before',
    order: 2
  },
  'week-7': {
    title: '7 Weeks: Supplies & Equipment',
    description: 'Gather moving supplies and equipment',
    color: '#10B981', // Green
    dateOffset: -49, // -7 weeks
    dateRange: '7 weeks before',
    order: 3
  },
  'week-6': {
    title: '6 Weeks: Logistics & Records',
    description: 'Handle paperwork and logistics',
    color: '#06B6D4', // Cyan
    dateOffset: -42, // -6 weeks
    dateRange: '6 weeks before',
    order: 4
  },
  'week-5': {
    title: '5 Weeks: Packing',
    description: 'Begin the packing process',
    color: '#84CC16', // Lime
    dateOffset: -35, // -5 weeks
    dateRange: '5 weeks before',
    order: 5
  },
  'week-4': {
    title: '4 Weeks: Admin & Appointments',
    description: 'Administrative tasks and scheduling',
    color: '#F97316', // Orange
    dateOffset: -28, // -4 weeks
    dateRange: '4 weeks before',
    order: 6
  },
  'week-2-3': {
    title: '2–3 Weeks: Confirmations & Final Prep',
    description: 'Confirm arrangements and final preparations',
    color: '#F59E0B', // Amber
    dateOffset: -21, // -3 weeks
    dateRange: '2-3 weeks before',
    order: 7
  },
  'week-1': {
    title: '1 Week: Home Stretch',
    description: 'Final week preparations',
    color: '#EF4444', // Red
    dateOffset: -7, // -1 week
    dateRange: '1 week before',
    order: 8
  },
  'day-before': {
    title: 'Day Before Move',
    description: 'Last minute preparations',
    color: '#EC4899', // Pink
    dateOffset: -1, // -1 day
    dateRange: 'Day before',
    order: 9
  },
  'move-day': {
    title: 'Move Day',
    description: 'The big day',
    color: '#DC2626', // Dark Red
    dateOffset: 0, // Move day
    dateRange: 'Move Day',
    order: 10
  },
  'post-move': {
    title: 'Post-Move',
    description: 'Settling into your new home',
    color: '#059669', // Emerald
    dateOffset: 1, // +1 day to +1 month
    dateRange: '1 day to 1 month after',
    order: 11
  }
} as const;

// Legacy support for existing code
export const CHECKLIST_CATEGORIES = {
  'app-setup': 'App Setup & Initial Planning',
  'week-8': '8 Weeks: Planning, Purging & Well-being',
  'week-7': '7 Weeks: Supplies & Equipment',
  'week-6': '6 Weeks: Logistics & Records',
  'week-5': '5 Weeks: Packing',
  'week-4': '4 Weeks: Admin & Appointments',
  'week-2-3': '2–3 Weeks: Confirmations & Final Prep',
  'week-1': '1 Week: Home Stretch',
  'day-before': 'Day Before Move',
  'move-day': 'Move Day',
  'post-move': 'Post-Move'
} as const;

export type ChecklistCategory = keyof typeof CHECKLIST_CATEGORIES;

// Utility functions for date calculations
export const calculateFrameDate = (moveDate: Date | null, dateOffset: number): Date | null => {
  if (!moveDate) return null;
  const frameDate = new Date(moveDate);
  frameDate.setDate(frameDate.getDate() + dateOffset);
  return frameDate;
};

export const formatFrameDate = (date: Date | null, dateRange: string): string => {
  if (!date) return dateRange;
  
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  };
  const formattedDate = date.toLocaleDateString('en-US', options);
  
  if (diffDays === 0) {
    return `Today (${formattedDate})`;
  } else if (diffDays === 1) {
    return `Tomorrow (${formattedDate})`;
  } else if (diffDays === -1) {
    return `Yesterday (${formattedDate})`;
  } else if (diffDays > 0) {
    return `${diffDays} days (${formattedDate})`;
  } else {
    return `${Math.abs(diffDays)} days ago (${formattedDate})`;
  }
};

// Calculate task dates based on timeframe
export const calculateTaskDates = (
  moveDate: Date | null, 
  timeframe: TimeframeColumn
): { startDate: Date | null; dueDate: Date | null } => {
  if (!moveDate || timeframe.dateOffset === undefined) {
    return { startDate: null, dueDate: null };
  }

  const frameDate = calculateFrameDate(moveDate, timeframe.dateOffset);
  if (!frameDate) {
    return { startDate: null, dueDate: null };
  }

  // For most frames, set start date as 7 days before frame date and due date as frame date
  // For immediate frames (like app-setup), set both dates to frame date
  if (timeframe.dateOffset === 0 && timeframe.id === 'app-setup') {
    // App setup is immediate
    return { 
      startDate: new Date(frameDate), 
      dueDate: new Date(frameDate) 
    };
  } else if (timeframe.dateOffset === 0 && timeframe.id === 'move-day') {
    // Move day tasks should be completed on move day
    return { 
      startDate: new Date(frameDate), 
      dueDate: new Date(frameDate) 
    };
  } else {
    // For other frames, give a week to complete tasks ending on the frame date
    const startDate = new Date(frameDate);
    startDate.setDate(startDate.getDate() - 7);
    
    return { 
      startDate, 
      dueDate: new Date(frameDate) 
    };
  }
};

// Default priority colors
export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  low: '#10B981', // green
  medium: '#F59E0B', // yellow
  high: '#EF4444', // red
  critical: '#DC2626' // dark red
};

// Default status colors
export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: '#6B7280', // gray
  'in-progress': '#3B82F6', // blue
  completed: '#10B981', // green
  blocked: '#EF4444' // red
};

// Drag and drop types
export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
}

export interface DroppableProvided {
  innerRef: (element: HTMLElement | null) => void;
  droppableProps: Record<string, any>;
  placeholder?: React.ReactElement<any> | null;
}

export interface DraggableProvided {
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: Record<string, any>;
  dragHandleProps?: Record<string, any> | null;
}