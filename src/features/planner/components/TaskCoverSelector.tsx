import React, { useState, useRef } from 'react';
import { X, Image, Palette, Upload, Trash2 } from 'lucide-react';
import { TaskCover } from '../types';
import Button from '@/components/common/Button';

interface TaskCoverSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentCover?: TaskCover;
  onSelectCover: (cover: TaskCover | null) => void;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#f43f5e', // rose
  '#6b7280', // gray
  '#374151', // dark gray
];

const PRESET_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)',
  'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
];

const TaskCoverSelector: React.FC<TaskCoverSelectorProps> = ({
  isOpen,
  onClose,
  currentCover,
  onSelectCover
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'gradients' | 'photos'>('colors');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleColorSelect = (color: string) => {
    onSelectCover({
      type: 'color',
      value: color
    });
  };

  const handleGradientSelect = (gradient: string) => {
    onSelectCover({
      type: 'gradient',
      value: gradient
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onSelectCover({
        type: 'image',
        value: base64,
        alt: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    onSelectCover(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-brand-primary dark:text-brand-accent" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Card Cover
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Cover Preview */}
        {currentCover && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Current Cover
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemoveCover}
                leftIcon={<Trash2 className="w-3 h-3" />}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </Button>
            </div>
            <div className="h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
              {currentCover.type === 'color' && (
                <div 
                  className="w-full h-full" 
                  style={{ backgroundColor: currentCover.value }}
                />
              )}
              {currentCover.type === 'gradient' && (
                <div 
                  className="w-full h-full" 
                  style={{ background: currentCover.value }}
                />
              )}
              {currentCover.type === 'image' && (
                <img 
                  src={currentCover.value}
                  alt={currentCover.alt || 'Task cover'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'colors'
                  ? 'border-brand-primary text-brand-primary dark:border-brand-accent dark:text-brand-accent'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-2" />
              Colors
            </button>
            <button
              onClick={() => setActiveTab('gradients')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'gradients'
                  ? 'border-brand-primary text-brand-primary dark:border-brand-accent dark:text-brand-accent'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <div className="w-4 h-4 inline mr-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-sm" />
              Gradients
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'photos'
                  ? 'border-brand-primary text-brand-primary dark:border-brand-accent dark:text-brand-accent'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <Image className="w-4 h-4 inline mr-2" />
              Photos
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-80 overflow-y-auto">
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="grid grid-cols-6 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-12 h-12 rounded-lg transition-all hover:scale-110 hover:shadow-lg ${
                    currentCover?.type === 'color' && currentCover.value === color
                      ? 'ring-2 ring-brand-primary dark:ring-brand-accent ring-offset-2 dark:ring-offset-slate-800'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}

          {/* Gradients Tab */}
          {activeTab === 'gradients' && (
            <div className="grid grid-cols-3 gap-3">
              {PRESET_GRADIENTS.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => handleGradientSelect(gradient)}
                  className={`w-full h-16 rounded-lg transition-all hover:scale-105 hover:shadow-lg ${
                    currentCover?.type === 'gradient' && currentCover.value === gradient
                      ? 'ring-2 ring-brand-primary dark:ring-brand-accent ring-offset-2 dark:ring-offset-slate-800'
                      : ''
                  }`}
                  style={{ background: gradient }}
                />
              ))}
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="text-center">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 hover:border-brand-primary dark:hover:border-brand-accent transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Upload a cover image
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  JPG, PNG, GIF up to 5MB
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCoverSelector;