import { format } from 'date-fns';
import { User, Clock, ChevronRight } from 'lucide-react';
import type { CalendarEventWithAssignees } from '../types/calendarTypes';
import { cn } from '@/lib/utils';

interface AgendaEventProps {
  event: CalendarEventWithAssignees;
}

export default function AgendaEventComponent({ event }: AgendaEventProps) {
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
        'group flex items-start p-3 -mx-2 rounded-lg transition-colors',
        'hover:bg-slate-50 dark:hover:bg-slate-800/50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        'border-l-4',
        'cursor-pointer',
        'active:bg-slate-100 dark:active:bg-slate-800/70'
      )}
      style={{
        borderLeftColor: primaryColor,
      }}
      tabIndex={0}
      role="button"
      aria-label={`Event: ${event.title} on ${format(event.start, 'MMMM d')}`}
    >
      {/* Color indicator dot */}
      <div
        className={cn(
          'w-2.5 h-2.5 rounded-full mt-1.5 shrink-0',
          'ring-1 ring-offset-1 ring-transparent group-hover:ring-white/50',
          'transition-transform duration-150 group-hover:scale-110'
        )}
        style={{
          backgroundColor: primaryColor,
          borderColor: primaryColor,
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center space-x-2">
            {isGeneral && (
              <User
                className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0"
                aria-hidden="true"
              />
            )}
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {event.title}
            </h3>
          </div>

          <div className="text-right shrink-0 ml-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {format(event.start, 'MMM d')}
            </div>
            {!event.allDay && (
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                <Clock className="w-3 h-3 mr-1 shrink-0" />
                {format(event.start, 'h:mm a')}
                <ChevronRight className="w-3 h-3 mx-0.5" />
                {format(event.end, 'h:mm a')}
              </div>
            )}
            {event.allDay && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                All day
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {event.description}
          </p>
        )}

        {hasAssignees && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {assigneeDetails.slice(0, 3).map((assignee) => (
              <div
                key={assignee.id}
                className={cn(
                  'inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs',
                  'bg-slate-100 dark:bg-slate-700/70',
                  'transition-colors duration-150',
                  'group-hover:bg-slate-200 dark:group-hover:bg-slate-700/90'
                )}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: assignee.color }}
                  aria-hidden="true"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                  {assignee.name}
                </span>
              </div>
            ))}
            {assigneeDetails.length > 3 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                +{assigneeDetails.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}