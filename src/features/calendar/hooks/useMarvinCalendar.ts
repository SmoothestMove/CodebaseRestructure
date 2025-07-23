import { useCallback } from 'react';
import { useCalendar } from './useCalendar';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { CalendarService } from '../services/calendarService';
import { 
  MarvinCalendarEvent, 
  CreateCalendarEventAction,
  UpdateCalendarEventAction,
  DeleteCalendarEventAction,
  QueryCalendarAction
} from '@/features/marvin/types/marvin';
import { CalendarEventInput } from '../types/calendarTypes';

// Hook to provide calendar management functions for MARVIN
export function useMarvinCalendar() {
  const { createEvent, updateEvent, deleteEvent, events } = useCalendar();
  const { moveId } = useAuth();

  // Convert MARVIN calendar event to calendar service input format
  const convertMarvinEventToInput = useCallback((marvinEvent: MarvinCalendarEvent): CalendarEventInput => {
    const { date, time, endTime, allDay = false, ...rest } = marvinEvent;
    
    // Create event data suitable for CalendarService
    const eventData = {
      ...rest,
      startDate: date,
      startTime: time || (allDay ? '' : '09:00'),
      endDate: date,
      endTime: endTime || (allDay ? '' : time ? 
        // If start time provided but no end time, add 1 hour
        String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':' + time.split(':')[1] 
        : '10:00'
      ),
      allDay,
    };
    
    return CalendarService.createEventWithDates(eventData);
  }, []);

  // Handle MARVIN's create calendar event action
  const handleCreateCalendarEvent = useCallback(async (action: CreateCalendarEventAction) => {
    try {
      const eventInput = convertMarvinEventToInput(action.event);
      await createEvent(eventInput);
      return { success: true, message: `Calendar event "${action.event.title}" created successfully.` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create calendar event';
      return { success: false, message: errorMessage };
    }
  }, [createEvent, convertMarvinEventToInput]);

  // Handle MARVIN's update calendar event action
  const handleUpdateCalendarEvent = useCallback(async (action: UpdateCalendarEventAction) => {
    try {
      // Convert partial MARVIN event to partial calendar input
      const updateData: Partial<CalendarEventInput> = {};
      
      if (action.event.title) updateData.title = action.event.title;
      if (action.event.description !== undefined) updateData.description = action.event.description;
      if (action.event.assignees) updateData.assignees = action.event.assignees;
      if (action.event.allDay !== undefined) updateData.allDay = action.event.allDay;
      
      // Handle date/time updates
      if (action.event.date || action.event.time || action.event.endTime) {
        const existingEvent = events.find(e => e.id === action.eventId);
        if (!existingEvent) {
          return { success: false, message: 'Event not found' };
        }
        
        const eventData = {
          startDate: action.event.date || existingEvent.start.toISOString().split('T')[0],
          startTime: action.event.time || (existingEvent.allDay ? '' : existingEvent.start.toTimeString().slice(0, 5)),
          endDate: action.event.date || existingEvent.end.toISOString().split('T')[0],
          endTime: action.event.endTime || (existingEvent.allDay ? '' : existingEvent.end.toTimeString().slice(0, 5)),
          allDay: action.event.allDay !== undefined ? action.event.allDay : existingEvent.allDay,
        };
        
        const convertedEvent = CalendarService.createEventWithDates({
          title: '', // Not used in conversion
          ...eventData,
        });
        
        updateData.start = convertedEvent.start;
        updateData.end = convertedEvent.end;
        if (action.event.allDay !== undefined) updateData.allDay = action.event.allDay;
      }
      
      await updateEvent(action.eventId, updateData);
      return { success: true, message: 'Calendar event updated successfully.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update calendar event';
      return { success: false, message: errorMessage };
    }
  }, [updateEvent, events]);

  // Handle MARVIN's delete calendar event action
  const handleDeleteCalendarEvent = useCallback(async (action: DeleteCalendarEventAction) => {
    try {
      const eventToDelete = events.find(e => e.id === action.eventId);
      const eventTitle = eventToDelete?.title || 'Unknown event';
      
      await deleteEvent(action.eventId);
      return { success: true, message: `Calendar event "${eventTitle}" deleted successfully.` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete calendar event';
      return { success: false, message: errorMessage };
    }
  }, [deleteEvent, events]);

  // Handle MARVIN's query calendar action
  const handleQueryCalendarEvents = useCallback(async (action: QueryCalendarAction) => {
    try {
      let filteredEvents = [...events];
      
      // Apply date range filter
      if (action.query.dateRange) {
        const startDate = new Date(action.query.dateRange.start);
        const endDate = new Date(action.query.dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        
        filteredEvents = filteredEvents.filter(event => 
          event.start >= startDate && event.start <= endDate
        );
      }
      
      // Apply assignee filter
      if (action.query.assignee) {
        filteredEvents = filteredEvents.filter(event => 
          event.assignees?.includes(action.query.assignee!)
        );
      }
      
      // Apply search term filter
      if (action.query.searchTerm) {
        const searchTerm = action.query.searchTerm.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Convert to MARVIN format
      const results = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: event.start.toISOString().split('T')[0],
        time: event.allDay ? undefined : event.start.toTimeString().slice(0, 5),
        endTime: event.allDay ? undefined : event.end.toTimeString().slice(0, 5),
        description: event.description,
        assignees: event.assignees,
        allDay: event.allDay,
      }));
      
      return { 
        success: true, 
        message: `Found ${results.length} matching events.`,
        data: results 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to query calendar events';
      return { success: false, message: errorMessage, data: [] };
    }
  }, [events]);

  // Get calendar data for MARVIN's AppData context
  const getCalendarDataForMarvin = useCallback(() => {
    const now = new Date();
    const upcomingEvents = events
      .filter(event => event.start >= now)
      .slice(0, 10) // Limit to next 10 events
      .map(event => ({
        title: event.title,
        date: event.start.toISOString().split('T')[0],
        time: event.allDay ? undefined : event.start.toTimeString().slice(0, 5),
        endTime: event.allDay ? undefined : event.end.toTimeString().slice(0, 5),
        description: event.description,
        assignees: event.assignees,
        allDay: event.allDay,
      }));
    
    return {
      upcomingEvents,
      totalEvents: events.length,
    };
  }, [events]);

  return {
    handleCreateCalendarEvent,
    handleUpdateCalendarEvent,
    handleDeleteCalendarEvent,
    handleQueryCalendarEvents,
    getCalendarDataForMarvin,
  };
}