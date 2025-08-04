import React from 'react';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';
import { CalendarEventWithAssignees } from '../types/calendarTypes';

interface TimeEventProps {
  event: CalendarEventWithAssignees;
}

export default function TimeEventComponent({ event }: TimeEventProps) {
  const hasAssignees = event.assigneeDetails && event.assigneeDetails.length > 0;
  const primaryColor = hasAssignees ? event.assigneeDetails[0].color : '#64748b';
  const isGeneral = !hasAssignees;
  
  return (
    <div 
      className="h-full w-full p-1.5 text-white rounded-md relative group cursor-pointer overflow-hidden"
      style={{
        backgroundColor: primaryColor,
        border: `1px solid ${primaryColor}`,
        minHeight: '20px',
      }}
      title={`${event.title}${hasAssignees ? ` - ${event.assigneeDetails.map(a => a.name).join(', ')}` : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <div className="font-medium text-xs leading-tight mb-0.5 line-clamp-2">
            {isGeneral && <User className="w-3 h-3 inline mr-1 opacity-80" />}
            {event.title}
          </div>
          
          {!event.allDay && (
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <Clock className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{format(event.start, 'h:mm a')}</span>
            </div>
          )}
        </div>
        
        {hasAssignees && (
          <div className="flex items-center justify-end space-x-0.5 mt-0.5">
            {event.assigneeDetails.slice(0, 3).map((assignee) => (
              <div
                key={assignee.id}
                className="w-2 h-2 rounded-full border border-white/50 flex-shrink-0"
                style={{ backgroundColor: assignee.color }}
                title={assignee.name}
              />
            ))}
            {event.assigneeDetails.length > 3 && (
              <span className="text-xs opacity-75 ml-1">+{event.assigneeDetails.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Tooltip on hover for longer events */}
      <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}