import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar as CalendarIcon, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/Textarea';
import { cn } from '@/lib/utils';
import { useCalendar } from '../hooks/useCalendar';
import { useOwnersSpacesSeparation } from '@/features/owners/hooks/useOwnersSpacesSeparation';
import { CalendarService } from '../services/calendarService';
import type { EventFormData } from '../types/calendarTypes';
// Define the owner type based on PersonalOwner from useOwnersSpacesSeparation
interface PersonalOwner {
  id: string;
  name: string;
  color: string;
  // Add other properties that might be needed
  [key: string]: any;
}

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

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  onEventCreated?: () => void;
}

export default function AddEventModal({ isOpen, onClose, initialDate, onEventCreated }: AddEventModalProps) {
  const { createEvent, loading } = useCalendar();
  const { personalOwners } = useOwnersSpacesSeparation() as { personalOwners: PersonalOwner[] };
  const isMobile = useIsMobile();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
    startTime: format(new Date().setMinutes(0), 'HH:mm'), // Default to next hour
    endDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
    endTime: format(new Date().setHours(new Date().getHours() + 1, 0), 'HH:mm'), // +1 hour
    allDay: false,
    assignees: [],
  });

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

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
      await createEvent(formData);
      if (onEventCreated) {
        onEventCreated();
      }
      onClose();
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
      >
        <div
          ref={modalRef}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex flex-col h-full',
            'overflow-hidden',
            'bg-white dark:bg-slate-800',
            'rounded-t-2xl md:rounded-2xl',
            'shadow-2xl',
            'transform transition-all duration-300',
            'w-full',
            {
              'max-h-[90vh]': !isMobile,
              'max-h-[95vh]': isMobile,
            }
          )}
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
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {formData.title || 'New Event'}
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
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className={cn(
                    'block text-sm font-medium',
                    'text-slate-700 dark:text-slate-300',
                    'mb-1.5',
                    'flex items-center'
                  )}
                >
                  <FileText className="h-4 w-4 mr-1.5 text-slate-400" />
                  Title <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="title"
                  ref={firstInputRef}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="What's happening?"
                  className={cn(
                    'w-full px-3 py-2 rounded-md',
                    'text-base',
                    'focus:ring-2 focus:ring-blue-500 focus:outline-none',
                    'transition-colors duration-150',
                    'border border-slate-300 dark:border-slate-600',
                    'bg-white dark:bg-slate-800',
                    'text-slate-900 dark:text-white',
                    'placeholder-slate-400 dark:placeholder-slate-500',
                    {
                      'border-red-500': errors.title,
                      'ring-red-500': errors.title,
                    }
                  )}
                  aria-required="true"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-sm text-red-600">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Textarea
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add a description"
                  rows={3}
                  className={cn(
                    'w-full',
                    'text-base',
                    'py-2.5',
                    'focus:ring-2 focus:ring-blue-500',
                    'transition-colors duration-150',
                    'border-slate-300 dark:border-slate-600',
                    'bg-white dark:bg-slate-800',
                    'text-slate-900 dark:text-white',
                    'placeholder-slate-400 dark:placeholder-slate-500'
                  )}
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

              {/* Date & Time Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                    Date & Time
                  </h3>

                  <div className="flex items-center">
                    <input
                      id="allDay"
                      type="checkbox"
                      checked={formData.allDay}
                      onChange={(e) => handleInputChange('allDay', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="allDay" className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                      All day
                    </label>
                  </div>
                </div>

                <div className="space-y-3 pl-6">
                  {/* Start Date/Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className={cn(
                          'block text-xs font-medium',
                          'text-slate-500 dark:text-slate-400',
                          'mb-1'
                        )}
                      >
                        Starts
                      </label>
                      <div className="relative">
                        <input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className={cn(
                            'block w-full rounded-md',
                            'border-slate-300 dark:border-slate-600',
                            'bg-white dark:bg-slate-800',
                            'text-slate-900 dark:text-white',
                            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            'py-2 pl-3 pr-3',
                            'text-sm',
                            'transition-colors duration-150',
                            {
                              'opacity-70': loading
                            }
                          )}
                          aria-required="true"
                          aria-invalid={!!errors.startDate}
                          aria-describedby={errors.startDate ? 'startDate-error' : undefined}
                        />
                      </div>
                      {errors.startDate && (
                        <p id="startDate-error" className="mt-1 text-xs text-red-600">
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    {!formData.allDay && (
                      <div>
                        <label
                          htmlFor="startTime"
                          className={cn(
                            'block text-xs font-medium',
                            'text-slate-500 dark:text-slate-400',
                            'mb-1'
                          )}
                        >
                          &nbsp;
                        </label>
                        <div className="relative">
                          <input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => handleInputChange('startTime', e.target.value)}
                            className={cn(
                              'block w-full rounded-md',
                              'border-slate-300 dark:border-slate-600',
                              'bg-white dark:bg-slate-800',
                              'text-slate-900 dark:text-white',
                              'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                              'py-2 pl-3 pr-3',
                              'text-sm',
                              'transition-colors duration-150',
                              {
                                'opacity-70': loading
                              }
                            )}
                            aria-invalid={!!errors.startTime}
                            aria-describedby={errors.startTime ? 'startTime-error' : undefined}
                          />
                        </div>
                        {errors.startTime && (
                          <p id="startTime-error" className="mt-1 text-xs text-red-600">
                            {errors.startTime}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* End Date/Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="endDate"
                        className={cn(
                          'block text-xs font-medium',
                          'text-slate-500 dark:text-slate-400',
                          'mb-1'
                        )}
                      >
                        Ends
                      </label>
                      <div className="relative">
                        <input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          min={formData.startDate}
                          className={cn(
                            'block w-full rounded-md',
                            'border-slate-300 dark:border-slate-600',
                            'bg-white dark:bg-slate-800',
                            'text-slate-900 dark:text-white',
                            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            'py-2 pl-3 pr-3',
                            'text-sm',
                            'transition-colors duration-150',
                            {
                              'opacity-70': loading
                            }
                          )}
                          aria-required="true"
                          aria-invalid={!!errors.endDate}
                          aria-describedby={errors.endDate ? 'endDate-error' : undefined}
                        />
                      </div>
                      {errors.endDate && (
                        <p id="endDate-error" className="mt-1 text-xs text-red-600">
                          {errors.endDate}
                        </p>
                      )}
                    </div>

                    {!formData.allDay && (
                      <div>
                        <label
                          htmlFor="endTime"
                          className={cn(
                            'block text-xs font-medium',
                            'text-slate-500 dark:text-slate-400',
                            'mb-1'
                          )}
                        >
                          &nbsp;
                        </label>
                        <div className="relative">
                          <input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => handleInputChange('endTime', e.target.value)}
                            min={formData.startDate === formData.endDate ? formData.startTime : undefined}
                            className={cn(
                              'block w-full rounded-md',
                              'border-slate-300 dark:border-slate-600',
                              'bg-white dark:bg-slate-800',
                              'text-slate-900 dark:text-white',
                              'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                              'py-2 pl-3 pr-3',
                              'text-sm',
                              'transition-colors duration-150',
                              {
                                'opacity-70': loading
                              }
                            )}
                            aria-invalid={!!errors.endTime}
                            aria-describedby={errors.endTime ? 'endTime-error' : undefined}
                          />
                        </div>
                        {errors.endTime && (
                          <p id="endTime-error" className="mt-1 text-xs text-red-600">
                            {errors.endTime}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignees */}
              {personalOwners.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center mb-2">
                    <Users className="h-4 w-4 mr-1.5 text-slate-400" />
                    Assign to
                  </h3>
                  <div className="space-y-2 pl-6">
                    {personalOwners.map((owner: PersonalOwner) => (
                      <div key={owner.id} className="flex items-center">
                        <input
                          id={`assignee-${owner.id}`}
                          type="checkbox"
                          checked={formData.assignees.includes(owner.id)}
                          onChange={() => handleAssigneeToggle(owner.id)}
                          className={cn(
                            'h-4 w-4 rounded',
                            'border-slate-300 dark:border-slate-600',
                            'text-blue-600 dark:text-blue-500',
                            'focus:ring-2 focus:ring-blue-500',
                            'bg-white dark:bg-slate-800',
                            'transition-colors duration-150',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'cursor-pointer'
                          )}
                          disabled={loading}
                        />
                        <label
                          htmlFor={`assignee-${owner.id}`}
                          className={cn(
                            'ml-2 text-sm',
                            'text-slate-700 dark:text-slate-300',
                            'flex items-center',
                            'cursor-pointer',
                            'py-1',
                            'transition-colors duration-150',
                            'hover:text-slate-900 dark:hover:text-white',
                            'select-none'
                          )}
                        >
                          <div
                            className="h-3 w-3 rounded-full mr-2 border border-slate-200 dark:border-slate-600"
                            style={{ backgroundColor: owner.color }}
                            aria-hidden="true"
                          />
                          {owner.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                    className={cn(
                      'w-full',
                      'px-4 py-2.5',
                      'text-sm font-medium',
                      'transition-colors duration-150',
                      'border-slate-300 dark:border-slate-600',
                      'text-slate-700 dark:text-slate-300',
                      'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="w-full sm:w-auto">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                    disabled={loading}
                    className={cn(
                      'w-full',
                      'px-4 py-2.5',
                      'text-sm font-medium',
                      'transition-colors duration-150',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'shadow-sm',
                      'mb-2 sm:mb-0'
                    )}
                  >
                    Save Event
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}