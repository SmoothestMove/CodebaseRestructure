import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isToday } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Grid, List, CalendarDays } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCalendarKeyboardNavigation } from '../hooks/useCalendarKeyboardNavigation';
import '@/features/calendar/components/CalendarStyles2.css';
import Button from '@/components/common/Button';
import { useCalendar } from '../hooks/useCalendar';
import { useOwners } from '@/features/owners/hooks/useOwners';
import AddEventModal from '../components/AddEventModal';
import EventDetailModal from '../components/EventDetailModal';
import AgendaEventComponent from '../components/AgendaEventComponent';
import TimeEventComponent from '../components/TimeEventComponent';
import { CalendarEventWithAssignees } from '../types/calendarTypes';
import { cn } from '@/lib/utils';

// Setup the localizer for react-big-calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// View options for the view selector
const VIEW_OPTIONS = [
  { id: 'month', label: 'Month', icon: Grid },
  { id: 'week', label: 'Week', icon: CalendarDays },
  { id: 'day', label: 'Day', icon: CalendarDays },
  { id: 'agenda', label: 'Agenda', icon: List },
] as const;

export default function CalendarPage() {
  const { 
    events, 
    loading, 
    error: _, // Mark as intentionally unused
    selectedEvent,
    currentView,
    currentDate,
    selectEvent,
    setView,
    setDate,
    navigateBack,
    navigateForward,
    goToToday
  } = useCalendar();
  
  const { owners } = useOwners();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newEventDate, setNewEventDate] = useState<Date>();
  const headerRef = useRef<HTMLDivElement>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [headerSticky, setHeaderSticky] = useState(false);
  

  // Set up keyboard navigation
  const { calendarRef } = useCalendarKeyboardNavigation({
    onAddEvent: () => setShowAddModal(true),
    onToday: () => {
      const today = new Date();
      setDate(today);
      if (currentView === 'agenda') {
        setView('agenda' as any);
      }
    },
    onNavigateBack: navigateBack,
    onNavigateForward: navigateForward,
    onViewChange: (view) => setView(view as any),
    onCloseModal: () => {
      if (showAddModal) setShowAddModal(false);
      if (showDetailModal) {
        setShowDetailModal(false);
        selectEvent(null);
      }
    },
    isModalOpen: showAddModal || showDetailModal,
  });

  // Handle header stickiness on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const { top } = headerRef.current.getBoundingClientRect();
        setHeaderSticky(top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced events with owner details for better display
  const enhancedEvents = useMemo((): CalendarEventWithAssignees[] => {
    return events.map(event => ({
      ...event,
      assigneeDetails: event.assignees?.map(assigneeId => {
        const owner = owners.find(o => o.uid === assigneeId);
        return owner ? {
          id: owner.uid,
          name: `${owner.firstName} ${owner.lastName}`,
          color: owner.color,
        } : {
          id: assigneeId,
          name: 'Unknown',
          color: '#6b7280',
        };
      }),
    }));
  }, [events, owners]);

  // Format date for display based on view
  const formatDateRange = () => {
    if (!currentDate) return '';
    
    const date = new Date(currentDate);
    
    if (currentView === 'month') {
      return format(date, 'MMMM yyyy');
    } else if (currentView === 'week') {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
      } else if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      } else {
        return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
      }
    } else if (currentView === 'day') {
      return format(date, 'EEEE, MMMM d, yyyy');
    } else {
      // Agenda view
      const start = new Date(date);
      start.setDate(date.getDate() - 7);
      return `${format(start, 'MMM d')} - ${format(date, 'MMM d, yyyy')}`;
    }
  };

  // Handle view change
  const handleViewChange = useCallback((newView: View) => {
    setView(newView as any);
  }, [setView]);


  // Handle slot selection (clicking on empty calendar slots)
  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setNewEventDate(start);
    setShowAddModal(true);
  }, []);

  // Get event component based on view type
  const getEventComponent = (view: string) => {
    switch (view) {
      case 'agenda':
        return ({ event }: { event: CalendarEventWithAssignees }) => (
          <AgendaEventComponent event={event} />
        );
      case 'month':
      case 'week':
      case 'day':
        return ({ event }: { event: CalendarEventWithAssignees }) => (
          <TimeEventComponent event={event} />
        );
      default:
        return ({ event }: { event: CalendarEventWithAssignees }) => (
          <TimeEventComponent event={event} />
        );
    }
  };

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEventWithAssignees) => {
    selectEvent(event);
    setShowDetailModal(true);
  }, [selectEvent]);

  // Handle navigation
  const handleNavigate = useCallback((date: Date) => {
    setDate(date);
  }, [setDate]);


  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col"
      ref={calendarRef}
      tabIndex={-1}
      aria-label="Calendar view"
    >
      {/* Sticky Header */}
      <div 
        ref={headerRef}
        className={cn(
          'sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-shadow',
          headerSticky && 'shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Left side: Title and date range */}
            <div className="shrink-0">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
                Calendar
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                {formatDateRange()}
              </p>
            </div>

            {/* Center: View selector (desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {VIEW_OPTIONS.map(({ id, label }) => (
                <Button
                  key={id}
                  variant={currentView === id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewChange(id as View)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md',
                    currentView === id 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {label}
                  </span>
                </Button>
              ))}
              <Button
                key="today"
                variant={currentView === 'day' ? 'primary' : 'ghost'}
                size="sm"
                onClick={goToToday}
                className={cn(
                  'h-8 px-3 text-sm font-medium',
                  isToday(currentDate) ? 'text-blue-600 dark:text-blue-400' : ''
                )}
              >
                Today
              </Button>
              
              {/* Next period button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateForward}
                className="h-8 w-8 p-0 rounded-md"
                aria-label="Next period"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* View switcher */}
        <div className="flex items-center justify-center lg:justify-end">
          <div 
            className="inline-flex rounded-lg border border-slate-200 dark:border-slate-600 p-1 bg-slate-50 dark:bg-slate-700"
            role="toolbar"
            aria-label="Calendar view options"
          >
            {[
              { key: 'month', label: 'Month' },
              { key: 'week', label: 'Week' },
              { key: 'day', label: 'Day' },
              { key: 'agenda', label: 'Agenda' },
            ].map((viewOption) => (
              <button
                key={viewOption.key}
                onClick={() => setView(viewOption.key as any)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                  ${currentView === viewOption.key
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50'
                  }
                `}
              >
                {viewOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div 
        ref={calendarContainerRef}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        role="application"
        aria-label="Calendar"
      >
        <div className="p-6">
          <Calendar
            localizer={localizer}
            events={enhancedEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: currentView === 'agenda' ? 400 : 600 }}
            view={currentView}
            date={currentDate}
            onView={handleViewChange}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            popup
            showMultiDayTimes
            step={60}
            timeslots={1}
            min={new Date(1970, 1, 1, 8, 0, 0)} // 8 AM
            max={new Date(1970, 1, 1, 20, 0, 0)} // 8 PM
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            toolbar={false}
            // Accessibility improvements and keyboard navigation
            titleAccessor={(event: CalendarEventWithAssignees) => event.title}
            allDayAccessor={(event: CalendarEventWithAssignees) => event.allDay || false}
            // @ts-ignore - react-big-calendar types are incomplete
            onKeyPressEvent={(event: CalendarEventWithAssignees, e: React.SyntheticEvent) => {
              if ('key' in e) {
                const keyboardEvent = e as unknown as React.KeyboardEvent;
                if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                  keyboardEvent.preventDefault();
                  handleSelectEvent(event);
                }
              }
            }}
            components={{
              event: (props: any) => {
                const EventComponent = getEventComponent(currentView);
                return (
                  <div
                    {...props}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        props.onClick();
                      }
                    }}
                  >
                    <EventComponent {...props} />
                  </div>
                );
              },
              month: {
                event: (props: any) => {
                  const event = props.event as CalendarEventWithAssignees;
                  const assigneeDetails = event.assigneeDetails || [];
                  const hasAssignees = assigneeDetails.length > 0;
                  const primaryColor = hasAssignees ? assigneeDetails[0]?.color || '#64748b' : '#64748b';
                  const isGeneral = !hasAssignees;
                  
                  return (
                    <div 
                      className="rbc-event-content group cursor-pointer relative"
                      style={{
                        backgroundColor: primaryColor,
                        border: `1px solid ${primaryColor}`,
                        borderRadius: '4px',
                        padding: '3px 6px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '500',
                        margin: '1px 0',
                        minHeight: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      title={`${event.title}${hasAssignees ? ` - Assigned to: ${event.assigneeDetails?.map(a => a.name).join(', ') || 'No assignees'}` : ' - General event'}`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        {isGeneral && (
                          <svg className="w-3 h-3 mr-1 shrink-0 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="truncate">{event.title}</span>
                      </div>
                      
                      {hasAssignees && (
                        <div className="flex items-center space-x-1 ml-2 shrink-0">
                          {(event.assigneeDetails || []).map((assignee) => (
                            <div
                              key={assignee.id}
                              className="w-2 h-2 rounded-full border border-white/50"
                              style={{ backgroundColor: assignee.color }}
                              title={assignee.name}
                              aria-label={`Assigned to ${assignee.name}`}
                            />
                          ))}
                          {(event.assigneeDetails?.length || 0) > 2 && (
                            <span className="text-xs opacity-75">+{(event.assigneeDetails?.length || 0) - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              },
            }}
            className="dark:text-slate-200"
            eventPropGetter={(event: any) => {
              const assigneeDetails = event.assigneeDetails || [];
              const hasAssignees = assigneeDetails.length > 0;
              const primaryColor = hasAssignees ? assigneeDetails[0]?.color || '#64748b' : '#64748b';
              
              return {
                style: {
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              };
            }}
          />
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
              <span className="text-slate-700 dark:text-slate-300">Loading calendar...</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewEventDate(undefined);
          // Return focus to the calendar after closing the modal
          setTimeout(() => {
            calendarRef.current?.focus();
          }, 0);
        }}
        initialDate={newEventDate}
        onEventCreated={() => {
          // Focus the first event in the calendar after creating a new one
          setTimeout(() => {
            const firstEvent = calendarContainerRef.current?.querySelector('.rbc-event');
            if (firstEvent instanceof HTMLElement) {
              firstEvent.focus();
            } else {
              calendarRef.current?.focus();
            }
          }, 100);
        }}
      />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            selectEvent(null);
            // Return focus to the event that was clicked
            setTimeout(() => {
              const selectedEventElement = document.querySelector(`[data-event-id="${selectedEvent.id}"]`);
              if (selectedEventElement instanceof HTMLElement) {
                selectedEventElement.focus();
              } else {
                calendarRef.current?.focus();
              }
            }, 0);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
}