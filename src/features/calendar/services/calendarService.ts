import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  FirestoreError,
  Unsubscribe 
} from 'firebase/firestore';
import { firestore as db } from '@/main';
import { CalendarEvent, CalendarEventInput } from '../types/calendarTypes';

// Helper to get the calendar events subcollection for a given move
const getCalendarCollection = (moveId: string) => collection(db, 'moves', moveId, 'calendar_events');

export class CalendarService {
  // Create a new calendar event
  static async createEvent(moveId: string, userId: string, eventData: CalendarEventInput): Promise<string> {
    try {
      const now = Timestamp.now();
      const calendarCollection = getCalendarCollection(moveId);
      const docRef = await addDoc(calendarCollection, {
        ...eventData,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  // Update an existing calendar event
  static async updateEvent(moveId: string, eventId: string, eventData: Partial<CalendarEventInput>): Promise<void> {
    try {
      const calendarCollection = getCalendarCollection(moveId);
      const eventRef = doc(calendarCollection, eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  // Delete a calendar event
  static async deleteEvent(moveId: string, eventId: string): Promise<void> {
    try {
      const calendarCollection = getCalendarCollection(moveId);
      const eventRef = doc(calendarCollection, eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  // Subscribe to calendar events for a specific move
  static subscribeToEvents(
    moveId: string,
    onEventsUpdate: (events: CalendarEvent[]) => void,
    onError: (error: FirestoreError) => void
  ): Unsubscribe {
    const calendarCollection = getCalendarCollection(moveId);
    const q = query(
      calendarCollection,
      orderBy('start', 'asc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const events: CalendarEvent[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          events.push({
            id: doc.id,
            moveId, // Add moveId from parameter since it's not stored in subcollection
            ...data,
            // Convert Firestore Timestamps to JavaScript Dates
            start: data.start.toDate(),
            end: data.end.toDate(),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          } as CalendarEvent);
        });
        onEventsUpdate(events);
      },
      onError
    );
  }

  // Helper method to convert date strings to Date objects for Firebase storage
  static createEventWithDates(eventData: {
    title: string;
    description?: string;
    startDate: string; // YYYY-MM-DD
    startTime?: string; // HH:MM
    endDate: string; // YYYY-MM-DD
    endTime?: string; // HH:MM
    allDay?: boolean;
    assignees?: string[];
  }): CalendarEventInput {
    const { startDate, startTime, endDate, endTime, allDay = false, ...rest } = eventData;
    
    // Create start date
    const start = new Date(startDate);
    if (!allDay && startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      start.setHours(hours, minutes, 0, 0);
    }
    
    // Create end date
    const end = new Date(endDate);
    if (!allDay && endTime) {
      const [hours, minutes] = endTime.split(':').map(Number);
      end.setHours(hours, minutes, 0, 0);
    } else if (allDay) {
      // For all-day events, set end to end of day
      end.setHours(23, 59, 59, 999);
    }
    
    return {
      ...rest,
      start,
      end,
      allDay,
    };
  }
}