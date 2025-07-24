// Manual definition for Omit to support older TypeScript versions.
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Enum for identifying the sender of a chat message.
export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

// Interface for web search grounding chunks provided by Gemini.
export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

// Interface for a single chat message in the conversation history.
export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  sources?: GroundingChunk[];
}

// Represents a team member involved in the move.
export interface TeamMember {
  name: string;
  tasksAssigned: number;
}

// Represents a single item in the moving inventory.
export interface InventoryItem {
  name:string;
  boxNumber: number;
}

// Represents a reservation (e.g., for a truck or storage unit).
export interface Reservation {
  type: 'Truck' | 'Storage';
  company: string;
  confirmationId: string;
  date: string;
}

// Represents a single item in the moving checklist.
export interface ChecklistItem {
  id: string;
  task: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
}

// A container for all application-specific data passed to MARVIN.
export interface AppData {
  teamMembers: TeamMember[];
  inventory: {
    packedBoxes: number;
    totalBoxes: number;
    items: InventoryItem[];
  };
  reservations: Reservation[];
  checklist: ChecklistItem[];
  calendar: {
    upcomingEvents: MarvinCalendarEvent[];
    totalEvents: number;
  };
  budget: {
    totalEstimatedAmount: number;
    totalSpent: number;
    categories: Array<{
      id: string;
      name: string;
      estimatedAmount: number;
      spentAmount: number;
      color: string;
    }>;
    recentExpenses: Array<{
      id: string;
      categoryName: string;
      amount: number;
      merchantName: string;
      description: string;
      date: string;
    }>;
    overspentCategories: string[]; // Category IDs that are over budget
  };
}

// Represents a calendar event to be created or modified by MARVIN.
export interface MarvinCalendarEvent {
  title: string;
  date: string; // ISO format e.g., "YYYY-MM-DD"
  time?: string; // e.g., "HH:MM"
  endTime?: string; // e.g., "HH:MM"
  description?: string;
  assignees?: string[];
  allDay?: boolean;
}

// Type for the AI's structured response when creating a checklist.
export interface CreateChecklistAction {
  action: 'create_checklist';
  items: Omit<ChecklistItem, 'id' | 'completed'>[];
}

// Type for the AI's structured response when creating a calendar event.
export interface CreateCalendarEventAction {
  action: 'create_calendar_event';
  event: MarvinCalendarEvent;
}

// Type for the AI's structured response when updating a calendar event.
export interface UpdateCalendarEventAction {
  action: 'update_calendar_event';
  eventId: string;
  event: Partial<MarvinCalendarEvent>;
}

// Type for the AI's structured response when deleting a calendar event.
export interface DeleteCalendarEventAction {
  action: 'delete_calendar_event';
  eventId: string;
}

// Type for the AI's structured response when querying calendar events.
export interface QueryCalendarAction {
  action: 'query_calendar';
  query: {
    dateRange?: {
      start: string; // YYYY-MM-DD
      end: string; // YYYY-MM-DD
    };
    assignee?: string;
    searchTerm?: string;
  };
}

// Type for the AI's structured response for navigation.
export interface NavigateAction {
  action: 'navigate';
  destination: string;
}

// Type for the AI's structured response when adding an expense.
export interface AddExpenseAction {
  action: 'add_expense';
  expense: {
    categoryId: string;
    amount: number;
    merchantName: string;
    description: string;
    date?: string; // Optional, defaults to today
  };
}

// Type for the AI's structured response when creating a budget category.
export interface CreateBudgetCategoryAction {
  action: 'create_budget_category';
  category: {
    name: string;
    estimatedAmount: number;
    color?: string;
    icon?: string;
  };
}

// Type for the AI's structured response when querying budget information.
export interface QueryBudgetAction {
  action: 'query_budget';
  query: {
    type: 'summary' | 'by_category' | 'recent_expenses' | 'overspent_categories';
    categoryId?: string;
    dateRange?: {
      start: string; // YYYY-MM-DD
      end: string; // YYYY-MM-DD
    };
  };
}

// A union type for all possible structured actions the AI can return.
export type AiAction = 
  | CreateChecklistAction 
  | CreateCalendarEventAction 
  | UpdateCalendarEventAction
  | DeleteCalendarEventAction
  | QueryCalendarAction
  | NavigateAction
  | AddExpenseAction
  | CreateBudgetCategoryAction
  | QueryBudgetAction;