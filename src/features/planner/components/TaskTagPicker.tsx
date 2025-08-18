import React, { useState } from 'react';
import { X, Plus, Tag, Check } from 'lucide-react';
import { TaskTag, PlannerTask } from '../types';
import Button from '@/components/common/Button';

interface TaskTagPickerProps {
  isOpen: boolean;
  onClose: () => void;
  task: PlannerTask | null;
  availableTags: TaskTag[];
  onUpdateTaskTags: (taskId: string, tags: TaskTag[]) => void;
  onOpenTagManager: () => void;
}

const TaskTagPicker: React.FC<TaskTagPickerProps> = ({
  isOpen,
  onClose,
  task,
  availableTags,
  onUpdateTaskTags,
  onOpenTagManager
}) => {
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>(task?.tags || []);

  const handleTagToggle = (tag: TaskTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    if (!task) return;
    onUpdateTaskTags(task.id, selectedTags);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTags(task?.tags || []);
    onClose();
  };

  if (!isOpen || !task) return null;

  // Group tags by type
  const customTags = availableTags.filter(tag => tag.type === 'custom');
  const priorityTags = availableTags.filter(tag => tag.type === 'priority');
  const statusTags = availableTags.filter(tag => tag.type === 'status');
  const categoryTags = availableTags.filter(tag => tag.type === 'category');

  const isTagSelected = (tag: TaskTag) => selectedTags.some(t => t.id === tag.id);

  const TagSection: React.FC<{ title: string; tags: TaskTag[] }> = ({ title, tags }) => {
    if (tags.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const selected = isTagSelected(tag);
            return (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag)}
                className={`
                  group flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${selected 
                    ? 'ring-2 ring-brand-primary/20 dark:ring-brand-accent/20 scale-105' 
                    : 'hover:scale-105'
                  }
                `}
                style={{
                  backgroundColor: selected ? tag.color : `${tag.color}20`,
                  color: selected ? 'white' : tag.color,
                  borderColor: selected ? tag.color : `${tag.color}40`
                }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.label}
                {selected && (
                  <Check className="w-3 h-3 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-brand-primary dark:text-brand-accent" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Assign Tags
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Task Info */}
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {task.description}
              </p>
            )}
          </div>

          {/* Tag Sections */}
          <TagSection title="Priority" tags={priorityTags} />
          <TagSection title="Status" tags={statusTags} />
          <TagSection title="Category" tags={categoryTags} />
          <TagSection title="Custom" tags={customTags} />

          {/* Create New Tag Button */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={onOpenTagManager}
              className="w-full"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create New Tag
            </Button>
          </div>

          {/* Selected Tags Preview */}
          {selectedTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Selected Tags ({selectedTags.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                    style={{
                      backgroundColor: tag.color,
                      color: 'white',
                      borderColor: tag.color
                    }}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.label}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Tags
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTagPicker;