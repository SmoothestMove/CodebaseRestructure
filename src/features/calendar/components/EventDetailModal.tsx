import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trash2,
  AlertTriangle 
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useCalendar } from '../hooks/useCalendar';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { CalendarEvent } from '../types/calendarTypes';

/**
 * @interface EventDetailModalProps
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {function(): void} onClose - A callback function for when the modal is closed.
 * @property {CalendarEvent} event - The event to display.
 */
interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
}

/**
 * A modal for displaying the details of an event.
 * @param {EventDetailModalProps} props - The props for the component.
 * @returns {JSX.Element} The rendered EventDetailModal component.
 */
export default function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  const { deleteEvent, loading } = useCalendar();
  const { owners } = useOwners();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get assignee details
  const assigneeDetails = event.assignees?.map(assigneeId => {
    const owner = owners.find(o => o.uid === assigneeId);
    return owner ? {
      id: owner.uid,
      name: `${owner.firstName} ${owner.lastName}`.trim(),
      color: owner.color,
    } : {
      id: assigneeId,
      name: 'Unknown User',
      color: '#6b7280',
    };
  }) || [];

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details">
      <div className="space-y-6">
        {/* Event Title */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {event.title}
          </h2>
          {event.description && (
            <p className="text-slate-600 dark:text-slate-400">
              {event.description}
            </p>
          )}
        </div>

        {/* Event Date & Time */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {formatEventDate()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-slate-700 dark:text-slate-300">
                {formatEventTime()}
              </span>
            </div>
          </div>
        </div>

        {/* Assignees */}
        {assigneeDetails.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Assigned to:
              </span>
            </div>
            <div className="space-y-2 ml-8">
              {assigneeDetails.map((assignee) => (
                <div key={assignee.id} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: assignee.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    {assignee.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Metadata */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
            <div>Created: {format(event.createdAt.toDate(), 'MMM d, yyyy h:mm a')}</div>
            <div>Updated: {format(event.updatedAt.toDate(), 'MMM d, yyyy h:mm a')}</div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Delete Event
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Are you sure you want to delete "{event.title}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                isLoading={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Event
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading || showDeleteConfirm}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Event
          </Button>
        </div>
      </div>
    </Modal>
  );
}