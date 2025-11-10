import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/CalendarStyles.css';
import Button from '@/components/common/Button';
import { useCalendar } from '../hooks/useCalendar';
import { useOwners } from '@/features/owners/hooks/useOwners';
import AddEventModal from '../components/AddEventModal';
import EventDetailModal from '../components/EventDetailModal';
import AgendaEventComponent from '../components/AgendaEventComponent';
import TimeEventComponent from '../components/TimeEventComponent';
import { CalendarEvent, CalendarEventWithAssignees } from '../types/calendarTypes';

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

/**
 * The main page for the calendar feature.
 * @returns {JSX.Element} The rendered CalendarPage component.
 */
export default function CalendarPage() {
  const { 
    events, 
    loading, 
    error, 
    selectedEvent,
    currentView,
    currentDate,
    selectEvent,
    setView,
    setDate 
  } = useCalendar();
  
  const { owners } = useOwners();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newEventDate, setNewEventDate] = useState<Date>();

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

  // Custom event components based on view
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
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    selectEvent(event);
    setShowDetailModal(true);
  }, [selectEvent]);

  // Handle slot selection (clicking on empty calendar slots)
  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setNewEventDate(start);
    setShowAddModal(true);
  }, []);

  // Handle view change
  const handleViewChange = useCallback((view: View) => {
    setView(view as any);
  }, [setView]);

  // Handle date navigation
  const handleNavigate = useCallback((date: Date) => {
    setDate(date);
  }, [setDate]);


  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading calendar
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Calendar
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your moving schedule and events
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </Button>
          </div>
        </div>

        {/* Custom Toolbar */}
        <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:justify-between lg:items-center">
            {/* Navigation and Current period label */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
              {/* Navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    if (currentView === 'month') {
                      newDate.setMonth(newDate.getMonth() - 1);
                    } else if (currentView === 'week') {
                      newDate.setDate(newDate.getDate() - 7);
                    } else if (currentView === 'day') {
                      newDate.setDate(newDate.getDate() - 1);
                    }
                    setDate(newDate);
                  }}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDate(new Date())}
                  className="px-3"
                >
                  Today
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    if (currentView === 'month') {
                      newDate.setMonth(newDate.getMonth() + 1);
                    } else if (currentView === 'week') {
                      newDate.setDate(newDate.getDate() + 7);
                    } else if (currentView === 'day') {
                      newDate.setDate(newDate.getDate() + 1);
                    }
                    setDate(newDate);
                  }}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Current period label */}
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 text-center sm:text-left">
                {currentView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                {currentView === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                {currentView === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {currentView === 'agenda' && 'Agenda'}
              </h2>
            </div>

            {/* View switcher */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-600 p-1 bg-slate-50 dark:bg-slate-700">
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
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
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
              components={{
                event: getEventComponent(currentView),
                month: {
                  event: (props: any) => {
                    const event = props.event as CalendarEventWithAssignees;
                    const hasAssignees = event.assigneeDetails && event.assigneeDetails.length > 0;
                    const primaryColor = hasAssignees ? event.assigneeDetails[0].color : '#64748b';
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
                        title={`${event.title}${hasAssignees ? ` - Assigned to: ${event.assigneeDetails.map(a => a.name).join(', ')}` : ' - General event'}`}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          {isGeneral && (
                            <svg className="w-3 h-3 mr-1 flex-shrink-0 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="truncate">{event.title}</span>
                        </div>
                        
                        {hasAssignees && (
                          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                            {event.assigneeDetails.slice(0, 2).map((assignee) => (
                              <div
                                key={assignee.id}
                                className="w-2 h-2 rounded-full border border-white/50"
                                style={{ backgroundColor: assignee.color }}
                                title={assignee.name}
                              />
                            ))}
                            {event.assigneeDetails.length > 2 && (
                              <span className="text-xs opacity-75">+{event.assigneeDetails.length - 2}</span>
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
                const hasAssignees = event.assigneeDetails && event.assigneeDetails.length > 0;
                const primaryColor = hasAssignees ? event.assigneeDetails[0].color : '#64748b';
                
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
          }}
          initialDate={newEventDate}
        />

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              selectEvent(null);
            }}
            event={selectedEvent}
          />
        )}
      </div>
    </div>
  );
}