import { format } from 'date-fns';
import { Clock, User, ChevronRight } from 'lucide-react';
import type { CalendarEventWithAssignees } from '../types/calendarTypes';
import { cn } from '@/lib/utils';

interface TimeEventProps {
  event: CalendarEventWithAssignees;
}

export default function TimeEventComponent({ event }: TimeEventProps) {
  const assigneeDetails = event.assigneeDetails || [];
  const hasAssignees = assigneeDetails.length > 0;
  const primaryColor = hasAssignees ? assigneeDetails[0]?.color || '#64748b' : '#64748b';
  const isGeneral = !hasAssignees;

  // Calculate contrast color for text based on background brightness
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.6 ? '#1e293b' : '#f8fafc';
  };

  const textColor = getContrastColor(primaryColor);
  const borderColor = `${primaryColor}${primaryColor === '#64748b' ? '80' : 'cc'}`;

  return (
    <div
      className={cn(
        'h-full w-full p-1.5 rounded-md relative group cursor-pointer overflow-hidden',
        'transition-all duration-200 ease-in-out',
        'hover:shadow-md hover:scale-[1.02] hover:z-10',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'active:scale-100 active:shadow-sm',
        'dark:shadow-none',
        'text-xs',
        {
          'pl-2': isGeneral, // Add extra padding when general icon is shown
          'opacity-90 hover:opacity-100': !event.allDay,
        }
      )}
      style={{
        backgroundColor: `${primaryColor}${primaryColor === '#64748b' ? 'e6' : 'f2'}`,
        border: `1px solid ${borderColor}`,
        color: textColor,
        minHeight: '24px',
      }}
      title={`${event.title}${hasAssignees ? ` - ${assigneeDetails.map(a => a.name).join(', ')}` : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`Event: ${event.title} at ${event.allDay ? 'All day' : format(event.start, 'h:mm a')}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <div className="font-medium leading-tight mb-0.5 line-clamp-2 flex items-start">
            {isGeneral && (
              <User
                className="w-3 h-3 inline-block mr-1.5 mt-0.5 shrink-0"
                style={{ color: textColor }}
                aria-hidden="true"
              />
            )}
            <span className="truncate">{event.title}</span>
          </div>

          {!event.allDay && (
            <div className="flex items-center space-x-1.5 text-[11px] opacity-90 mt-1">
              <Clock className="w-2.5 h-2.5 shrink-0" style={{ color: textColor }} />
              <span className="truncate">
                {format(event.start, 'h:mm a')}
                {event.end && !event.allDay && (
                  <>
                    <ChevronRight className="w-3 h-3 inline-block mx-0.5 -mt-0.5" />
                    {format(event.end, 'h:mm a')}
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {hasAssignees && (
          <div className="flex items-center justify-end space-x-1 mt-1.5">
            {assigneeDetails.slice(0, 3).map((assignee) => (
              <div
                key={assignee.id}
                className={cn(
                  'w-2.5 h-2.5 rounded-full border-2',
                  'transition-transform duration-150 group-hover:scale-110',
                  'ring-1 ring-offset-1 ring-transparent group-hover:ring-white/50'
                )}
                style={{
                  backgroundColor: assignee.color,
                  borderColor: assignee.color,
                }}
                title={assignee.name}
                aria-label={`Assigned to ${assignee.name}`}
              />
            ))}
            {assigneeDetails.length > 3 && (
              <span className="text-[10px] font-medium opacity-90 ml-0.5">
                +{assigneeDetails.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-200 pointer-events-none',
          'bg-linear-to-b from-black/5 to-black/10',
          'opacity-0 group-hover:opacity-100 group-focus:opacity-100',
          'dark:from-white/5 dark:to-white/10'
        )}
      />
    </div>
  );
}