import { Box, Owner, ItemStatus } from '@/types';
import { AppData, TeamMember, InventoryItem, Reservation, ChecklistItem, MarvinCalendarEvent } from '../types/marvin';
import { CalendarEvent } from '@/features/calendar/types/calendarTypes';

/**
 * Converts the existing app data structures to MARVIN's expected AppData format
 */
export const createMarvinAppData = (
  boxes: Box[] = [],
  owners: Owner[] = [],
  budgetReservations: any[] = [],
  calendarEvents: CalendarEvent[] = []
): AppData => {
  // Convert owners to team members with task counts
  const teamMembers: TeamMember[] = owners.map(owner => ({
    name: `${owner.firstName} ${owner.lastName}`,
    tasksAssigned: boxes.filter(box => box.ownerUid === owner.uid).length
  }));

  // Convert boxes to inventory data
  const packedBoxes = boxes.filter(box => 
    box.currentStatus !== ItemStatus.PREPARED && 
    box.currentStatus !== ItemStatus.UNKNOWN
  ).length;
  
  const inventoryItems: InventoryItem[] = boxes.map(box => ({
    name: box.name,
    boxNumber: parseInt(box.id.slice(-2)) || 1 // Extract number from box ID
  }));

  // Placeholder for reservations - could be integrated with budget data later
  const reservations: Reservation[] = budgetReservations.map((reservation, index) => ({
    type: 'Truck' as const,
    company: reservation.company || 'Unknown',
    confirmationId: reservation.id || `RES-${index}`,
    date: reservation.date || new Date().toISOString().split('T')[0]
  }));

  // Placeholder for checklist - could be integrated with move management later
  const checklist: ChecklistItem[] = [
    {
      id: 'default-1',
      task: 'Pack remaining items',
      completed: false
    },
    {
      id: 'default-2', 
      task: 'Confirm moving truck rental',
      completed: packedBoxes > 0
    }
  ];

  // Convert calendar events to MARVIN format
  const now = new Date();
  const upcomingEvents: MarvinCalendarEvent[] = calendarEvents
    .filter(event => event.start >= now) // Only upcoming events
    .sort((a, b) => a.start.getTime() - b.start.getTime()) // Sort by start time
    .slice(0, 10) // Limit to next 10 events
    .map(event => ({
      title: event.title,
      date: event.start.toISOString().split('T')[0], // YYYY-MM-DD
      time: event.allDay ? undefined : event.start.toTimeString().slice(0, 5), // HH:MM
      endTime: event.allDay ? undefined : event.end.toTimeString().slice(0, 5), // HH:MM
      description: event.description,
      assignees: event.assignees || [],
      allDay: event.allDay
    }));

  return {
    teamMembers,
    inventory: {
      packedBoxes,
      totalBoxes: boxes.length,
      items: inventoryItems
    },
    reservations,
    checklist,
    calendar: {
      upcomingEvents,
      totalEvents: calendarEvents.length
    }
  };
};

/**
 * Helper function to get summary stats for MARVIN
 */
export const getMoveSummary = (boxes: Box[], owners: Owner[]) => {
  const totalBoxes = boxes.length;
  const packedBoxes = boxes.filter(box => 
    box.currentStatus !== ItemStatus.PREPARED && 
    box.currentStatus !== ItemStatus.UNKNOWN
  ).length;
  const activeOwners = owners.length;
  
  return {
    totalBoxes,
    packedBoxes,
    packingProgress: totalBoxes > 0 ? Math.round((packedBoxes / totalBoxes) * 100) : 0,
    activeOwners
  };
};