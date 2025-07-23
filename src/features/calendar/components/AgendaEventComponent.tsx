import React from 'react';
import { format } from 'date-fns';
import { CalendarEventWithAssignees } from '../types/calendarTypes';

interface AgendaEventProps {
  event: CalendarEventWithAssignees;
}

export default function AgendaEventComponent({ event }: AgendaEventProps) {
  const hasAssignees = event.assigneeDetails && event.assigneeDetails.length > 0;
  
  return (
    <div className="flex items-center space-x-3 py-1">
      <div className="flex-1">
        <div className="font-medium text-slate-900 dark:text-slate-100">
          {event.title}
        </div>
        {event.description && (
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {event.description}
          </div>
        )}
        {hasAssignees && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Assigned to:</span>
            <div className="flex items-center space-x-1">
              {event.assigneeDetails.slice(0, 3).map((assignee) => (
                <div
                  key={assignee.id}
                  className="flex items-center space-x-1"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: assignee.color }}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {assignee.name}
                  </span>
                </div>
              ))}
              {event.assigneeDetails.length > 3 && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  +{event.assigneeDetails.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-right">
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