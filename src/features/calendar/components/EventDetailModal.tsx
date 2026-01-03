import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Trash2,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import Button from '@/components/common/Button';
import { useCalendar } from '../hooks/useCalendar';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { CalendarEvent } from '../types/calendarTypes';
import { cn } from '@/lib/utils';

// Custom hook for mobile detection without external dependencies
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
}

interface Assignee {
  id: string;
  name: string;
  color: string;
}

export default function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  const { deleteEvent, loading } = useCalendar();
  const { owners } = useOwners();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isMobile = useIsMobile();
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus first element when modal opens
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Get assignee details
  const assigneeDetails: Assignee[] = (event.assignees || []).map(assigneeId => {
    const owner = owners.find(o => o.uid === assigneeId);
    return owner ? {
      id: owner.uid,
      name: `${owner.firstName} ${owner.lastName}`.trim(),
      color: owner.color || '#6b7280',
    } : {
      id: assigneeId,
      name: 'Unknown User',
      color: '#6b7280',
    };
  });

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const formatEventTime = () => {
    if (event.allDay) {
      return 'All day';
    }
    
    const startTime = format(event.start, 'h:mm a');
    const endTime = format(event.end, 'h:mm a');
    return `${startTime} - ${endTime}`;
  };

  const formatEventDate = () => {
    const startDate = format(event.start, 'MMMM d, yyyy');
    const endDate = format(event.end, 'MMMM d, yyyy');
    
    if (startDate === endDate) {
      return startDate;
    }
    return `${startDate} - ${endDate}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        'transition-opacity duration-300',
        {
          'items-end': isMobile,
          'items-center': !isMobile,
          'opacity-0 pointer-events-none': !isOpen,
          'opacity-100': isOpen,
        }
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          'bg-white dark:bg-slate-800',
          'rounded-lg shadow-xl',
          'w-full max-w-2xl',
          'flex flex-col',
          'transition-all duration-300',
          'max-h-[90vh] overflow-hidden',
          {
            'w-full max-w-full rounded-b-none': isMobile,
            'translate-y-4 opacity-0': !isOpen,
            'translate-y-0 opacity-100': isOpen,
          }
        )}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
      >
        {/* Header */}
        <div className={cn(
          'px-4 pt-4 pb-2',
          'border-b border-slate-200 dark:border-slate-700',
          'flex items-center justify-between',
          'sticky top-0 z-10',
          'bg-white dark:bg-slate-800',
          'rounded-t-2xl',
          {
            'px-6 pt-5': !isMobile,
          }
        )}>
          <h2 id="event-detail-title" className="text-xl font-semibold text-slate-900 dark:text-white">
            {event.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-full',
              'text-slate-400 hover:text-slate-500',
              'dark:text-slate-500 dark:hover:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'transition-colors duration-150'
            )}
            aria-label="Close modal"
            ref={firstFocusableRef}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="space-y-6">
            {/* Event Description */}
            {event.description && (
              <div className="space-y-2">
                <div className="flex items-center text-slate-500 dark:text-slate-400">
                  <div className="shrink-0 w-5 h-5 text-slate-400 group-hover:text-slate-500">
                    <FileText className="h-4 w-4 mr-2" />
                  </div>
                  <span className="text-sm font-medium">Description</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 pl-6">
                  {event.description}
                </p>
              </div>
            )}

            {/* Event Date & Time */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                Date & Time
              </h3>
              
              <div className="space-y-3 pl-6">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                      When
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      {formatEventDate()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                      Time
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      {formatEventTime()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignees */}
            {assigneeDetails.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center mb-2">
                  <Users className="h-4 w-4 mr-1.5 text-slate-400 shrink-0" />
                  Assigned to
                </h3>
                <div className="space-y-2 pl-6">
                  {assigneeDetails.map((assignee) => (
                    <div key={assignee.id} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: assignee.color }}
                        aria-hidden="true"
                      />
                      <span className="text-slate-700 dark:text-slate-300 text-sm">
                        {assignee.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Metadata */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-sm">
              <div className="text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Created:</span>
                  <span>{format(event.createdAt.toDate(), 'MMM d, yyyy h:mm a')}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-medium">Updated:</span>
                  <span>{format(event.updatedAt.toDate(), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200">
                      Delete Event
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Are you sure you want to delete "{event.title}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleDelete}
                    isLoading={loading}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                  >
                    Delete Event
                  </Button>
                </div>
              </div>
            ) : (
              /* Action Buttons */
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}