import { Timestamp } from 'firebase/firestore';

// Base calendar event interface for Firebase storage
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

// Input interface for creating new calendar events
export interface CalendarEventInput {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  assignees?: string[];
}

// Extended event interface with team member details for display
export interface CalendarEventWithAssignees extends CalendarEvent {
  assigneeDetails?: {
    id: string;
    name: string;
    color: string;
  }[];
}

// Calendar view types supported by react-big-calendar
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// View configuration for the calendar toolbar
export interface CalendarViewOption {
  key: CalendarView;
  label: string;
  icon?: React.ComponentType;
}

// Calendar state interface
export interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedEvent: CalendarEvent | null;
  currentView: CalendarView;
  currentDate: Date;
}

// Calendar action types for reducer
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

// Event form data interface
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