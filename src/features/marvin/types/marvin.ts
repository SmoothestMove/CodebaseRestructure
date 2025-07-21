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
}

// Represents a calendar event to be created or modified.
export interface CalendarEvent {
  title: string;
  date: string; // ISO format e.g., "YYYY-MM-DD"
  time?: string; // e.g., "HH:MM"
  assignees?: string[];
}

// Type for the AI's structured response when creating a checklist.
export interface CreateChecklistAction {
  action: 'create_checklist';
  items: Omit<ChecklistItem, 'id' | 'completed'>[];
}

// Type for the AI's structured response when creating a calendar event.
export interface CreateCalendarEventAction {
  action: 'create_calendar_event';
  event: CalendarEvent;
}

// Type for the AI's structured response for navigation.
export interface NavigateAction {
  action: 'navigate';
  destination: string;
}

// A union type for all possible structured actions the AI can return.
export type AiAction = CreateChecklistAction | CreateCalendarEventAction | NavigateAction;