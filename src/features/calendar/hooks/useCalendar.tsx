import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { FirestoreError } from 'firebase/firestore';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { CalendarService } from '../services/calendarService';
import { 
  CalendarState, 
  CalendarAction, 
  CalendarEvent, 
  CalendarEventInput,
  CalendarView 
} from '../types/calendarTypes';

// Initial state
const initialState: CalendarState = {
  events: [],
  loading: false,
  error: null,
  selectedEvent: null,
  currentView: 'month',
  currentDate: new Date(),
};

// Reducer
function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false, error: null };
    case 'ADD_EVENT':
      return { 
        ...state, 
        events: [...state.events, action.payload],
        error: null 
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event => 
          event.id === action.payload.id ? action.payload : event
        ),
        error: null
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        error: null
      };
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_DATE':
      return { ...state, currentDate: action.payload };
    default:
      return state;
  }
}

// Context types
interface CalendarContextType extends CalendarState {
  createEvent: (eventData: CalendarEventInput) => Promise<void>;
  updateEvent: (eventId: string, eventData: Partial<CalendarEventInput>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  selectEvent: (event: CalendarEvent | null) => void;
  setView: (view: CalendarView) => void;
  setDate: (date: Date) => void;
  refreshEvents: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Provider component
interface CalendarProviderProps {
  children: React.ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const { currentUser, moveId } = useAuth();

  // Subscribe to events when move changes
  useEffect(() => {
    if (!moveId) {
      dispatch({ type: 'SET_EVENTS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    const unsubscribe = CalendarService.subscribeToEvents(
      moveId,
      (events) => {
        dispatch({ type: 'SET_EVENTS', payload: events });
      },
      (error: FirestoreError) => {
        console.error('Error fetching calendar events:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    );

    return () => unsubscribe();
  }, [moveId]);

  // Event management functions
  const createEvent = useCallback(async (eventData: CalendarEventInput) => {
    if (!currentUser || !moveId) {
      throw new Error('User must be authenticated and have a move selected');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await CalendarService.createEvent(moveId, currentUser.uid, eventData);
      // Event will be added automatically via the subscription
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [currentUser, moveId]);

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<CalendarEventInput>) => {
    if (!moveId) {
      throw new Error('Move ID is required to update event');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await CalendarService.updateEvent(moveId, eventId, eventData);
      // Event will be updated automatically via the subscription
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [moveId]);

  const deleteEvent = useCallback(async (eventId: string) => {
    if (!moveId) {
      throw new Error('Move ID is required to delete event');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await CalendarService.deleteEvent(moveId, eventId);
      // Event will be removed automatically via the subscription
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [moveId]);

  const selectEvent = useCallback((event: CalendarEvent | null) => {
    dispatch({ type: 'SET_SELECTED_EVENT', payload: event });
  }, []);

  const setView = useCallback((view: CalendarView) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const setDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_DATE', payload: date });
  }, []);

  const refreshEvents = useCallback(() => {
    if (moveId) {
      dispatch({ type: 'SET_LOADING', payload: true });
      // The subscription will automatically refresh the data
    }
  }, [moveId]);

  const value: CalendarContextType = {
    ...state,
    createEvent,
    updateEvent,
    deleteEvent,
    selectEvent,
    setView,
    setDate,
    refreshEvents,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

// Hook to use calendar context
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}