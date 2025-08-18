import React, { useState } from 'react';
import { X, Plus, Tag, Palette } from 'lucide-react';
import { TaskTag, TagType } from '../types';
import Button from '@/components/common/Button';
import { v4 as uuidv4 } from 'uuid';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  existingTags: TaskTag[];
  onAddTag: (tag: TaskTag) => void;
  onDeleteTag: (tagId: string) => void;
  onUpdateTag: (tag: TaskTag) => void;
}

const TagManager: React.FC<TagManagerProps> = ({
  isOpen,
  onClose,
  existingTags,
  onAddTag,
  onDeleteTag,
  onUpdateTag
}) => {
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [newTagType, setNewTagType] = useState<TagType>('custom');

  const predefinedColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#F97316', // orange
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#EC4899', // pink
    '#6B7280'  // gray
  ];

  const handleAddTag = () => {
    if (!newTagLabel.trim()) return;

    const newTag: TaskTag = {
      id: uuidv4(),
      label: newTagLabel.trim(),
      color: newTagColor,
      type: newTagType
    };

    onAddTag(newTag);
    setNewTagLabel('');
    setNewTagColor('#3B82F6');
    setNewTagType('custom');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  // Filter tags by type for organization
  const customTags = existingTags.filter(tag => tag.type === 'custom');
  const priorityTags = existingTags.filter(tag => tag.type === 'priority');
  const statusTags = existingTags.filter(tag => tag.type === 'status');
  const categoryTags = existingTags.filter(tag => tag.type === 'category');

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-brand-primary dark:text-brand-accent" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Manage Tags
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Add New Tag */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
              Create New Tag
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tag Label
                </label>
                <input
                  type="text"
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tag name..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                           bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 
                           focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary 
                           dark:focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          newTagColor === color 
                            ? 'border-slate-400 dark:border-slate-300 scale-110' 
                            : 'border-slate-200 dark:border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={newTagType}
                  onChange={(e) => setNewTagType(e.target.value as TagType)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                           bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 
                           focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary 
                           dark:focus:border-brand-accent"
                >
                  <option value="custom">Custom</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="category">Category</option>
                </select>
              </div>

              <Button
                onClick={handleAddTag}
                disabled={!newTagLabel.trim()}
                className="w-full"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Tag
              </Button>
            </div>
          </div>

          {/* Existing Tags */}
          <div className="space-y-4">
            {/* Custom Tags */}
            {customTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Custom Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {customTags.map(tag => (
                    <div
                      key={tag.id}
                      className="group flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.label}
                      <button
                        onClick={() => onDeleteTag(tag.id)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Tags */}
            {priorityTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Priority Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priorityTags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Tags */}
            {statusTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Status Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusTags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Tags */}
            {categoryTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Category Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingTags.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tags created yet</p>
                <p className="text-xs mt-1">Create your first tag above</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManager;