import React, { useState } from 'react';
import { X, Calendar, Plus, Palette } from 'lucide-react';
import { TimeframeColumn } from '../types';
import Button from '@/components/common/Button';

interface TimeframeCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTimeframe: (timeframe: Omit<TimeframeColumn, 'id' | 'taskIds'>) => void;
}

const TimeframeCreator: React.FC<TimeframeCreatorProps> = ({
  isOpen,
  onClose,
  onCreateTimeframe
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#EC4899', // Pink
    '#84CC16', // Lime
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E', // Rose
  ];

  const handleSave = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreateTimeframe({
      title: title.trim(),
      description: description.trim() || undefined,
      color: selectedColor,
      order: Date.now(), // Use timestamp for ordering
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedColor('#3B82F6');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-brand-primary dark:text-brand-accent" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Create Timeframe
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="e.g., 3 Months Before Move"
              className={`
                w-full px-3 py-2 border rounded-lg 
                bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 
                focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary 
                dark:focus:border-brand-accent transition-colors
                ${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}
              `}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this phase..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 
                       focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary 
                       dark:focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Color Theme
            </label>
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${selectedColor === color 
                      ? 'border-slate-900 dark:border-slate-100 scale-110' 
                      : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Custom Color Input */}
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Custom:</span>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedColor}
              </span>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preview
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {title || 'Timeframe Title'}
                </h4>
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
              {(description || !title) && (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {description || 'Add a description to help organize this timeframe'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} leftIcon={<Plus className="w-4 h-4" />}>
              Create Timeframe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeframeCreator;