// Manual definition for Omit to support older TypeScript versions.
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
 * An enum for identifying the sender of a chat message.
 * @enum {string}
 */
export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

/**
 * An interface for web search grounding chunks provided by Gemini.
 * @interface GroundingChunk
 * @property {object} web - The web search result.
 * @property {string} web.uri - The URI of the search result.
 * @property {string} web.title - The title of the search result.
 */
export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

/**
 * An interface for a single chat message in the conversation history.
 * @interface Message
 * @property {string} id - The ID of the message.
 * @property {string} text - The text of the message.
 * @property {MessageSender} sender - The sender of the message.
 * @property {GroundingChunk[]} [sources] - A list of sources for the message.
 */
export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  sources?: GroundingChunk[];
}

/**
 * Represents a team member involved in the move.
 * @interface TeamMember
 * @property {string} name - The name of the team member.
 * @property {number} tasksAssigned - The number of tasks assigned to the team member.
 */
export interface TeamMember {
  name: string;
  tasksAssigned: number;
}

/**
 * Represents a single item in the moving inventory.
 * @interface InventoryItem
 * @property {string} name - The name of the item.
 * @property {number} boxNumber - The number of the box the item is in.
 */
export interface InventoryItem {
  name:string;
  boxNumber: number;
}

/**
 * Represents a reservation (e.g., for a truck or storage unit).
 * @interface Reservation
 * @property {('Truck' | 'Storage')} type - The type of the reservation.
 * @property {string} company - The company the reservation is with.
 * @property {string} confirmationId - The confirmation ID for the reservation.
 * @property {string} date - The date of the reservation.
 */
export interface Reservation {
  type: 'Truck' | 'Storage';
  company: string;
  confirmationId: string;
  date: string;
}

/**
 * Represents a single item in the moving checklist.
 * @interface ChecklistItem
 * @property {string} id - The ID of the item.
 * @property {string} task - The task description.
 * @property {string} [assignee] - The ID of the assignee.
 * @property {string} [dueDate] - The due date of the task.
 * @property {boolean} completed - Whether the task is completed.
 */
export interface ChecklistItem {
  id: string;
  task: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
}

/**
 * Represents user's location information for location-based searches.
 * @interface LocationData
 * @property {number} latitude - The latitude.
 * @property {number} longitude - The longitude.
 * @property {string} [city] - The city.
 * @property {string} [state] - The state.
 * @property {string} [country] - The country.
 * @property {number} [accuracy] - The accuracy in meters.
 * @property {number} [timestamp] - The timestamp of when the location was obtained.
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  accuracy?: number; // Accuracy in meters
  timestamp?: number; // When location was obtained
}

/**
 * A container for all application-specific data passed to MARVIN.
 * @interface AppData
 * @property {TeamMember[]} teamMembers - A list of team members.
 * @property {object} inventory - The inventory data.
 * @property {number} inventory.packedBoxes - The number of packed boxes.
 * @property {number} inventory.totalBoxes - The total number of boxes.
 * @property {InventoryItem[]} inventory.items - A list of inventory items.
 * @property {Reservation[]} reservations - A list of reservations.
 * @property {ChecklistItem[]} checklist - A list of checklist items.
 * @property {object} calendar - The calendar data.
 * @property {MarvinCalendarEvent[]} calendar.upcomingEvents - A list of upcoming calendar events.
 * @property {number} calendar.totalEvents - The total number of calendar events.
 * @property {object} budget - The budget data.
 * @property {number} budget.totalEstimatedAmount - The total estimated amount for the budget.
 * @property {number} budget.totalSpent - The total amount spent.
 * @property {object[]} budget.categories - A list of budget categories.
 * @property {string} budget.categories.id - The ID of the category.
 * @property {string} budget.categories.name - The name of the category.
 * @property {number} budget.categories.estimatedAmount - The estimated amount for the category.
 * @property {number} budget.categories.spentAmount - The amount spent in the category.
 * @property {string} budget.categories.color - The color of the category.
 * @property {object[]} budget.recentExpenses - A list of recent expenses.
 * @property {string} budget.recentExpenses.id - The ID of the expense.
 * @property {string} budget.recentExpenses.categoryName - The name of the category.
 * @property {number} budget.recentExpenses.amount - The amount of the expense.
 * @property {string} budget.recentExpenses.merchantName - The name of the merchant.
 * @property {string} budget.recentExpenses.description - The description of the expense.
 * @property {string} budget.recentExpenses.date - The date of the expense.
 * @property {string[]} budget.overspentCategories - A list of category IDs that are over budget.
 * @property {LocationData} [location] - The user's current location.
 */
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
  location?: LocationData; // User's current location for "near me" searches
}

/**
 * Represents a calendar event to be created or modified by MARVIN.
 * @interface MarvinCalendarEvent
 * @property {string} title - The title of the event.
 * @property {string} date - The date of the event in YYYY-MM-DD format.
 * @property {string} [time] - The time of the event in HH:MM format.
 * @property {string} [endTime] - The end time of the event in HH:MM format.
 * @property {string} [description] - The description of the event.
 * @property {string[]} [assignees] - A list of assignee IDs.
 * @property {boolean} [allDay] - Whether the event is an all-day event.
 */
export interface MarvinCalendarEvent {
  title: string;
  date: string; // ISO format e.g., "YYYY-MM-DD"
  time?: string; // e.g., "HH:MM"
  endTime?: string; // e.g., "HH:MM"
  description?: string;
  assignees?: string[];
  allDay?: boolean;
}

/**
 * A type for the AI's structured response when creating a checklist.
 * @interface CreateChecklistAction
 * @property {'create_checklist'} action - The action type.
 * @property {Omit<ChecklistItem, 'id' | 'completed'>[]} items - A list of checklist items to create.
 */
export interface CreateChecklistAction {
  action: 'create_checklist';
  items: Omit<ChecklistItem, 'id' | 'completed'>[];
}

/**
 * A type for the AI's structured response when creating a calendar event.
 * @interface CreateCalendarEventAction
 * @property {'create_calendar_event'} action - The action type.
 * @property {MarvinCalendarEvent} event - The event to create.
 */
export interface CreateCalendarEventAction {
  action: 'create_calendar_event';
  event: MarvinCalendarEvent;
}

/**
 * A type for the AI's structured response when updating a calendar event.
 * @interface UpdateCalendarEventAction
 * @property {'update_calendar_event'} action - The action type.
 * @property {string} eventId - The ID of the event to update.
 * @property {Partial<MarvinCalendarEvent>} event - The event data to update.
 */
export interface UpdateCalendarEventAction {
  action: 'update_calendar_event';
  eventId: string;
  event: Partial<MarvinCalendarEvent>;
}

/**
 * A type for the AI's structured response when deleting a calendar event.
 * @interface DeleteCalendarEventAction
 * @property {'delete_calendar_event'} action - The action type.
 * @property {string} eventId - The ID of the event to delete.
 */
export interface DeleteCalendarEventAction {
  action: 'delete_calendar_event';
  eventId: string;
}

/**
 * A type for the AI's structured response when querying calendar events.
 * @interface QueryCalendarAction
 * @property {'query_calendar'} action - The action type.
 * @property {object} query - The query parameters.
 * @property {object} [query.dateRange] - The date range to query.
 * @property {string} query.dateRange.start - The start date in YYYY-MM-DD format.
 * @property {string} query.dateRange.end - The end date in YYYY-MM-DD format.
 * @property {string} [query.assignee] - The ID of the assignee to query.
 * @property {string} [query.searchTerm] - The search term to query.
 */
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

/**
 * A type for the AI's structured response for navigation.
 * @interface NavigateAction
 * @property {'navigate'} action - The action type.
 * @property {string} destination - The destination to navigate to.
 */
export interface NavigateAction {
  action: 'navigate';
  destination: string;
}

/**
 * A type for the AI's structured response when adding an expense.
 * @interface AddExpenseAction
 * @property {'add_expense'} action - The action type.
 * @property {object} expense - The expense to add.
 * @property {string} expense.categoryId - The ID of the category.
 * @property {number} expense.amount - The amount of the expense.
 * @property {string} expense.merchantName - The name of the merchant.
 * @property {string} expense.description - The description of the expense.
 * @property {string} [expense.date] - The date of the expense in YYYY-MM-DD format.
 */
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

/**
 * A type for the AI's structured response when creating a budget category.
 * @interface CreateBudgetCategoryAction
 * @property {'create_budget_category'} action - The action type.
 * @property {object} category - The category to create.
 * @property {string} category.name - The name of the category.
 * @property {number} category.estimatedAmount - The estimated amount for the category.
 * @property {string} [category.color] - The color of the category.
 * @property {string} [category.icon] - The icon of the category.
 */
export interface CreateBudgetCategoryAction {
  action: 'create_budget_category';
  category: {
    name: string;
    estimatedAmount: number;
    color?: string;
    icon?: string;
  };
}

/**
 * A type for the AI's structured response when querying budget information.
 * @interface QueryBudgetAction
 * @property {'query_budget'} action - The action type.
 * @property {object} query - The query parameters.
 * @property {('summary' | 'by_category' | 'recent_expenses' | 'overspent_categories')} query.type - The type of the query.
 * @property {string} [query.categoryId] - The ID of the category to query.
 * @property {object} [query.dateRange] - The date range to query.
 * @property {string} query.dateRange.start - The start date in YYYY-MM-DD format.
 * @property {string} query.dateRange.end - The end date in YYYY-MM-DD format.
 */
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

/**
 * A union type for all possible structured actions the AI can return.
 * @typedef {(CreateChecklistAction | CreateCalendarEventAction | UpdateCalendarEventAction | DeleteCalendarEventAction | QueryCalendarAction | NavigateAction | AddExpenseAction | CreateBudgetCategoryAction | QueryBudgetAction)} AiAction
 */
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