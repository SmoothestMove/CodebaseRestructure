import React from 'react';
import { format } from 'date-fns';
import { User } from 'lucide-react';
import { CalendarEventWithAssignees } from '../types/calendarTypes';

/**
 * @interface AgendaEventProps
 * @property {CalendarEventWithAssignees} event - The event to display.
 */
interface AgendaEventProps {
  event: CalendarEventWithAssignees;
}

/**
 * A component for displaying an event in the agenda view.
 * @param {AgendaEventProps} props - The props for the component.
 * @returns {JSX.Element} The rendered AgendaEventComponent.
 */
export default function AgendaEventComponent({ event }: AgendaEventProps) {
  const hasAssignees = event.assigneeDetails && event.assigneeDetails.length > 0;
  const primaryColor = hasAssignees ? event.assigneeDetails[0].color : '#64748b';
  const isGeneral = !hasAssignees;
  
  return (
    <div className="flex items-start space-x-3 py-2">
      {/* Color indicator */}
      <div 
        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
        style={{ backgroundColor: primaryColor }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          {isGeneral && <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
          <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {event.title}
          </div>
          {isGeneral && (
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
              General
            </span>
          )}
        </div>
        
        {event.description && (
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            {event.description}
          </div>
        )}
        
        {hasAssignees && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Assigned to:</span>
            <div className="flex items-center space-x-2 flex-wrap">
              {event.assigneeDetails.slice(0, 3).map((assignee) => (
                <div
                  key={assignee.id}
                  className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: assignee.color }}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {assignee.name}
                  </span>
                </div>
              ))}
              {event.assigneeDetails.length > 3 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  +{event.assigneeDetails.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {format(event.start, 'MMM d')}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {event.allDay 
            ? 'All day' 
            : `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
          }
        </div>
      </div>
    </div>
  );
}