import { Box, Owner, ItemStatus } from '@/types';
import { AppData, TeamMember, InventoryItem, Reservation, ChecklistItem, MarvinCalendarEvent, LocationData } from '../types/marvin';
import { CalendarEvent } from '@/features/calendar/types/calendarTypes';
import { Expense, Category, Budget } from '@/features/budget/types/types';

/**
 * Converts the existing app data structures to MARVIN's expected AppData format.
 * @param {Box[]} [boxes=[]] - A list of boxes.
 * @param {Owner[]} [owners=[]] - A list of owners.
 * @param {any[]} [budgetReservations=[]] - A list of budget reservations.
 * @param {CalendarEvent[]} [calendarEvents=[]] - A list of calendar events.
 * @param {object} [budgetData] - The budget data.
 * @param {Category[]} budgetData.categories - A list of budget categories.
 * @param {Expense[]} budgetData.expenses - A list of budget expenses.
 * @param {Budget} budgetData.budget - The budget.
 * @param {LocationData | null} [location] - The location data.
 * @returns {AppData} The app data in MARVIN's format.
 */
export const createMarvinAppData = (
  boxes: Box[] = [],
  owners: Owner[] = [],
  budgetReservations: any[] = [],
  calendarEvents: CalendarEvent[] = [],
  budgetData?: { categories: Category[], expenses: Expense[], budget: Budget },
  location?: LocationData | null
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

  // No checklist system currently implemented - use calendar for scheduling tasks
  const checklist: ChecklistItem[] = [];

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

  // Transform budget data for MARVIN
  const budget = budgetData ? {
    totalEstimatedAmount: budgetData.budget.totalEstimatedAmount,
    totalSpent: budgetData.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    categories: budgetData.categories.map(category => {
      const categoryExpenses = budgetData.expenses.filter(e => e.categoryId === category.id);
      const spentAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        id: category.id,
        name: category.name,
        estimatedAmount: category.estimatedAmount,
        spentAmount,
        color: category.color
      };
    }),
    recentExpenses: budgetData.expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(expense => {
        const category = budgetData.categories.find(c => c.id === expense.categoryId);
        return {
          id: expense.id,
          categoryName: category?.name || 'Unknown',
          amount: expense.amount,
          merchantName: expense.merchantName,
          description: expense.description,
          date: expense.date
        };
      }),
    overspentCategories: budgetData.categories
      .filter(category => {
        const spent = budgetData.expenses
          .filter(e => e.categoryId === category.id)
          .reduce((sum, expense) => sum + expense.amount, 0);
        return spent > category.estimatedAmount;
      })
      .map(category => category.id)
  } : {
    totalEstimatedAmount: 0,
    totalSpent: 0,
    categories: [],
    recentExpenses: [],
    overspentCategories: []
  };

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
    },
    budget,
    location: location || undefined
  };
};

/**
 * A helper function to get summary stats for MARVIN.
 * @param {Box[]} boxes - A list of boxes.
 * @param {Owner[]} owners - A list of owners.
 * @returns {object} The move summary.
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