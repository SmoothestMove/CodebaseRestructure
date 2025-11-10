import React, { useState } from 'react';
import { X, Calendar, Clock, Users, FileText } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { useCalendar } from '../hooks/useCalendar';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { CalendarService } from '../services/calendarService';
import { EventFormData } from '../types/calendarTypes';

/**
 * @interface AddEventModalProps
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {function(): void} onClose - A callback function for when the modal is closed.
 * @property {Date} [initialDate] - The initial date for the event.
 */
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

/**
 * A modal for adding a new event to the calendar.
 * @param {AddEventModalProps} props - The props for the component.
 * @returns {JSX.Element} The rendered AddEventModal component.
 */
export default function AddEventModal({ isOpen, onClose, initialDate }: AddEventModalProps) {
  const { createEvent, loading } = useCalendar();
  const { owners } = useOwners();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: initialDate ? initialDate.toISOString().split('T')[0] : '',
    startTime: '',
    endDate: initialDate ? initialDate.toISOString().split('T')[0] : '',
    endTime: '',
    allDay: false,
    assignees: [],
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  const handleInputChange = (field: keyof EventFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAssigneeToggle = (ownerId: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(ownerId)
        ? prev.assignees.filter(id => id !== ownerId)
        : [...prev.assignees, ownerId]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.allDay && !formData.startTime) {
      newErrors.startTime = 'Start time is required for non-all-day events';
    }

    if (!formData.allDay && !formData.endTime) {
      newErrors.endTime = 'End time is required for non-all-day events';
    }

    // Validate that end is after start
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End must be after start';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const eventInput = CalendarService.createEventWithDates(formData);
      await createEvent(eventInput);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        allDay: false,
        assignees: [],
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      allDay: false,
      assignees: [],
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Event">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <Input
            label="Event Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter event title"
            error={errors.title}
            required
            icon={Calendar}
          />
        </div>

        {/* Description */}
        <div>
          <Textarea
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter event description"
            rows={3}
            icon={FileText}
          />
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="allDay"
            checked={formData.allDay}
            onChange={(e) => handleInputChange('allDay', e.target.checked)}
            className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-slate-300 rounded"
          />
          <label htmlFor="allDay" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            All day event
          </label>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              error={errors.startDate}
              required
            />
          </div>

          {/* End Date */}
          <div>
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              error={errors.endDate}
              required
            />
          </div>

          {/* Start Time */}
          {!formData.allDay && (
            <div>
              <Input
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                error={errors.startTime}
                icon={Clock}
              />
            </div>
          )}

          {/* End Time */}
          {!formData.allDay && (
            <div>
              <Input
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                error={errors.endTime}
                icon={Clock}
              />
            </div>
          )}
        </div>

        {/* Assign Task */}
        {owners.filter(owner => owner.lastName !== '(Communal)').length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              <Users className="inline w-4 h-4 mr-2" />
              Assign Task (Optional)
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {owners
                .filter(owner => owner.lastName !== '(Communal)')
                .map((owner) => (
                <label
                  key={owner.uid}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.assignees.includes(owner.uid)}
                    onChange={() => handleAssigneeToggle(owner.uid)}
                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-slate-300 rounded"
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: owner.color }}
                  >
                    {owner.firstName} {owner.lastName}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
          >
            Create Event
          </Button>
        </div>
      </form>
    </Modal>
  );
}