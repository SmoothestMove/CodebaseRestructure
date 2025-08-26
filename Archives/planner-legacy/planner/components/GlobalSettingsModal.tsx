import React, { useState } from 'react';
import { X, Settings, Edit3, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveChanges?: () => void;
}

interface PriorityLevel {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface LabelCategory {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface StatusType {
  id: string;
  name: string;
  color: string;
  order: number;
}

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveChanges
}) => {
  const [activeTab, setActiveTab] = useState<'priorities' | 'labels' | 'statuses' | 'datetime'>('priorities');
  const [priorities, setPriorities] = useState<PriorityLevel[]>([
    { id: 'critical', name: 'Critical', color: '#DC2626', order: 1 },
    { id: 'high', name: 'High', color: '#F97316', order: 2 },
    { id: 'medium', name: 'Medium', color: '#F59E0B', order: 3 },
    { id: 'low', name: 'Low', color: '#10B981', order: 4 }
  ]);
  const [newPriorityName, setNewPriorityName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const tabs = [
    { id: 'priorities', label: 'Priorities' },
    { id: 'labels', label: 'Labels' },
    { id: 'statuses', label: 'Statuses' },
    { id: 'datetime', label: 'Date & Time' }
  ] as const;

  const colors = [
    '#DC2626', '#EF4444', '#F97316', '#F59E0B',
    '#EAB308', '#84CC16', '#22C55E', '#10B981',
    '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#64748B', '#374151'
  ];

  const handleSaveChanges = () => {
    onSaveChanges?.();
    onClose();
  };

  const handleAddPriority = () => {
    if (newPriorityName.trim()) {
      const newPriority: PriorityLevel = {
        id: `priority-${Date.now()}`,
        name: newPriorityName.trim(),
        color: selectedColor,
        order: priorities.length + 1
      };
      setPriorities([...priorities, newPriority]);
      setNewPriorityName('');
    }
  };

  const handleDeletePriority = (id: string) => {
    setPriorities(priorities.filter(p => p.id !== id));
  };

  const handleEditPriority = (id: string, name: string, color: string) => {
    setPriorities(priorities.map(p => 
      p.id === id ? { ...p, name, color } : p
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-brand-primary dark:text-brand-accent" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Global Task Settings
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'text-brand-primary dark:text-brand-accent border-b-2 border-brand-primary dark:border-brand-accent bg-white dark:bg-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'priorities' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Priority Levels
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Click any priority card to edit. Manage available priority options for tasks
                  </p>
                </div>

                {/* Priority List */}
                <div className="space-y-3 mb-6">
                  {priorities.map((priority) => (
                    <PriorityCard
                      key={priority.id}
                      priority={priority}
                      onEdit={handleEditPriority}
                      onDelete={handleDeletePriority}
                    />
                  ))}
                </div>

                {/* Add New Priority */}
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newPriorityName}
                    onChange={(e) => setNewPriorityName(e.target.value)}
                    placeholder="New priority name"
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 
                             focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPriority()}
                  />
                  <ColorPicker
                    selectedColor={selectedColor}
                    onColorChange={setSelectedColor}
                    colors={colors}
                  />
                  <Button
                    onClick={handleAddPriority}
                    disabled={!newPriorityName.trim()}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'labels' && (
              <div>
                <p className="text-slate-600 dark:text-slate-400">
                  Label management functionality coming soon...
                </p>
              </div>
            )}

            {activeTab === 'statuses' && (
              <div>
                <p className="text-slate-600 dark:text-slate-400">
                  Status management functionality coming soon...
                </p>
              </div>
            )}

            {activeTab === 'datetime' && (
              <div>
                <p className="text-slate-600 dark:text-slate-400">
                  Date & time settings functionality coming soon...
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Priority Card Component
interface PriorityCardProps {
  priority: PriorityLevel;
  onEdit: (id: string, name: string, color: string) => void;
  onDelete: (id: string) => void;
}

const PriorityCard: React.FC<PriorityCardProps> = ({ priority, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(priority.name);
  const [editColor, setEditColor] = useState(priority.color);

  const handleSave = () => {
    onEdit(priority.id, editName, editColor);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(priority.name);
    setEditColor(priority.color);
    setIsEditing(false);
  };

  const colors = [
    '#DC2626', '#EF4444', '#F97316', '#F59E0B',
    '#EAB308', '#84CC16', '#22C55E', '#10B981',
    '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#64748B', '#374151'
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600/50">
      <div className="flex items-center space-x-3 flex-1">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: isEditing ? editColor : priority.color }}
        />
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded 
                     bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            autoFocus
          />
        ) : (
          <span className="text-slate-900 dark:text-slate-100 font-medium">
            {priority.name}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {isEditing && (
          <ColorPicker
            selectedColor={editColor}
            onColorChange={setEditColor}
            colors={colors}
          />
        )}
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(priority.id)}
              className="p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Color Picker Component
interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  colors: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, colors }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center"
        style={{ backgroundColor: selectedColor }}
      />
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onColorChange(color);
                  setIsOpen(false);
                }}
                className={`w-6 h-6 rounded border-2 ${
                  selectedColor === color 
                    ? 'border-slate-900 dark:border-slate-100' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSettingsModal;