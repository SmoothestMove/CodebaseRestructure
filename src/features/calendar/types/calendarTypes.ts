import { Timestamp } from 'firebase/firestore';

/**
 * @interface CalendarEvent
 * @property {string} id - The ID of the event.
 * @property {string} title - The title of the event.
 * @property {string} [description] - The description of the event.
 * @property {Date} start - The start date and time of the event.
 * @property {Date} end - The end date and time of the event.
 * @property {boolean} [allDay] - Whether the event is an all-day event.
 * @property {string[]} [assignees] - A list of assignee IDs.
 * @property {string} moveId - The ID of the move.
 * @property {string} createdBy - The ID of the user who created the event.
 * @property {Timestamp} createdAt - The timestamp of when the event was created.
 * @property {Timestamp} updatedAt - The timestamp of when the event was last updated.
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  assignees?: string[]; // Team member IDs
  moveId: string; // Link to current move
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * @interface CalendarEventInput
 * @property {string} title - The title of the event.
 * @property {string} [description] - The description of the event.
 * @property {Date} start - The start date and time of the event.
 * @property {Date} end - The end date and time of the event.
 * @property {boolean} [allDay] - Whether the event is an all-day event.
 * @property {string[]} [assignees] - A list of assignee IDs.
 */
export interface CalendarEventInput {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  assignees?: string[];
}

/**
 * @interface CalendarEventWithAssignees
 * @extends {CalendarEvent}
 * @property {object[]} [assigneeDetails] - A list of assignee details.
 * @property {string} assigneeDetails.id - The ID of the assignee.
 * @property {string} assigneeDetails.name - The name of the assignee.
 * @property {string} assigneeDetails.color - The color of the assignee.
 */
export interface CalendarEventWithAssignees extends CalendarEvent {
  assigneeDetails?: {
    id: string;
    name: string;
    color: string;
  }[];
}

/**
 * @typedef {('month' | 'week' | 'day' | 'agenda')} CalendarView - The view type for the calendar.
 */
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

/**
 * @interface CalendarViewOption
 * @property {CalendarView} key - The key of the view option.
 * @property {string} label - The label of the view option.
 * @property {React.ComponentType} [icon] - The icon of the view option.
 */
export interface CalendarViewOption {
  key: CalendarView;
  label: string;
  icon?: React.ComponentType;
}

/**
 * @interface CalendarState
 * @property {CalendarEvent[]} events - A list of calendar events.
 * @property {boolean} loading - Whether the calendar is loading.
 * @property {string | null} error - An error message, if any.
 * @property {CalendarEvent | null} selectedEvent - The currently selected event.
 * @property {CalendarView} currentView - The current view of the calendar.
 * @property {Date} currentDate - The current date of the calendar.
 */
export interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedEvent: CalendarEvent | null;
  currentView: CalendarView;
  currentDate: Date;
}

/**
 * @typedef {object} CalendarAction
 * @property {('SET_LOADING' | 'SET_ERROR' | 'SET_EVENTS' | 'ADD_EVENT' | 'UPDATE_EVENT' | 'DELETE_EVENT' | 'SET_SELECTED_EVENT' | 'SET_VIEW' | 'SET_DATE')} type - The action type.
 * @property {any} payload - The action payload.
 */
export type CalendarAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EVENTS'; payload: CalendarEvent[] }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_SELECTED_EVENT'; payload: CalendarEvent | null }
  | { type: 'SET_VIEW'; payload: CalendarView }
  | { type: 'SET_DATE'; payload: Date };

/**
 * @interface EventFormData
 * @property {string} title - The title of the event.
 * @property {string} description - The description of the event.
 * @property {string} startDate - The start date of the event in YYYY-MM-DD format.
 * @property {string} startTime - The start time of the event in HH:MM format.
 * @property {string} endDate - The end date of the event in YYYY-MM-DD format.
 * @property {string} endTime - The end time of the event in HH:MM format.
 * @property {boolean} allDay - Whether the event is an all-day event.
 * @property {string[]} assignees - A list of assignee IDs.
 */
export interface EventFormData {
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endDate: string; // YYYY-MM-DD format
  endTime: string; // HH:MM format
  allDay: boolean;
  assignees: string[];
}