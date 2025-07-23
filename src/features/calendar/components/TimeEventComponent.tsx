import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { CalendarEventWithAssignees } from '../types/calendarTypes';

interface TimeEventProps {
  event: CalendarEventWithAssignees;
}

export default function TimeEventComponent({ event }: TimeEventProps) {
  const hasAssignees = event.assigneeDetails && event.assigneeDetails.length > 0;
  const primaryColor = hasAssignees ? event.assigneeDetails[0].color : '#3b82f6';
  
  return (
    <div 
      className="h-full w-full p-2 text-white rounded-sm"
      style={{
        backgroundColor: primaryColor,
        border: `1px solid ${primaryColor}`,
      }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex-1">
          <div className="font-medium text-xs truncate mb-1">
            {event.title}
          </div>
          
          {!event.allDay && (
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <Clock className="w-3 h-3" />
              <span>{format(event.start, 'h:mm a')}</span>
            </div>
          )}
        </div>
        
        {hasAssignees && (
          <div className="flex items-center space-x-1 mt-1">
            {event.assigneeDetails.slice(0, 2).map((assignee) => (
              <div
                key={assignee.id}
                className="w-2 h-2 rounded-full border border-white/30"
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
    </div>
  );
}