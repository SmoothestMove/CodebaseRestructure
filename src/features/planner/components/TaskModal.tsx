import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Tag, List, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Settings, Hash, Type, ToggleLeft, FileText, Palette, Paperclip } from 'lucide-react';
import { PlannerTask, TaskTag, SubTask, PriorityLevel, TaskStatus, CustomFieldDefinition, CustomFieldType, TaskCover, TaskAttachment } from '../types';
import Button from '@/components/common/Button';
import CustomFieldsConfigModal from './CustomFieldsConfigModal';
import TaskCoverSelector from './TaskCoverSelector';
import TaskAttachmentsManager from './TaskAttachmentsManager';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: PlannerTask | null;
  onUpdateTask: (taskId: string, updates: Partial<PlannerTask>) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
  availableTags: TaskTag[];
  onCreateTag: (tag: Omit<TaskTag, 'id'>) => void;
  availableMembers: any[]; // Owner array
  getAssignedMemberInfo: (memberUid: string | undefined) => any;
  customFields?: Record<string, CustomFieldDefinition>;
  onUpdateCustomFields?: (fields: Record<string, CustomFieldDefinition>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onUpdateTask,
  onDeleteTask,
  availableTags,
  onCreateTag,
  availableMembers,
  getAssignedMemberInfo,
  customFields = {},
  onUpdateCustomFields
}) => {
  const [editedTask, setEditedTask] = useState<PlannerTask | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCustomFieldsEdit, setShowCustomFieldsEdit] = useState(false);
  const [isCustomFieldsConfigOpen, setIsCustomFieldsConfigOpen] = useState(false);
  const [isCoverSelectorOpen, setIsCoverSelectorOpen] = useState(false);
  const [isAttachmentsManagerOpen, setIsAttachmentsManagerOpen] = useState(false);

  // Default custom field options as per requirements
  const defaultCustomFields = {
    priority: {
      label: 'Priority',
      icon: AlertCircle,
      options: ['Critical', 'High', 'Medium', 'Low'],
      colors: {
        'Critical': '#ef4444',
        'High': '#f97316', 
        'Medium': '#eab308',
        'Low': '#22c55e'
      }
    },
    label: {
      label: 'Label',
      icon: Tag,
      options: [
        'Packing & Organizing',
        'Logistics & Transportation', 
        'Cleaning & Maintenance',
        'Utilities & Services',
        'Inventory & Documentation'
      ],
      colors: {
        'Packing & Organizing': '#3b82f6',
        'Logistics & Transportation': '#8b5cf6',
        'Cleaning & Maintenance': '#10b981', 
        'Utilities & Services': '#f59e0b',
        'Inventory & Documentation': '#ef4444'
      }
    },
    risk: {
      label: 'Risk',
      icon: AlertCircle,
      options: ['Low Risk', 'Moderate Risk', 'High Risk'],
      colors: {
        'Low Risk': '#22c55e',
        'Moderate Risk': '#eab308', 
        'High Risk': '#ef4444'
      }
    },
    status: {
      label: 'Status',
      icon: CheckCircle2,
      options: ['Not Started', 'In Progress', 'Completed', 'Blocked/Pending', 'Cancelled'],
      colors: {
        'Not Started': '#6b7280',
        'In Progress': '#3b82f6',
        'Completed': '#22c55e',
        'Blocked/Pending': '#f59e0b',
        'Cancelled': '#ef4444'
      }
    }
  };

  // Initialize edited task when modal opens
  useEffect(() => {
    if (task && isOpen) {
      setEditedTask({ ...task });
      setIsEditing(false);
    }
  }, [task, isOpen]);

  if (!isOpen || !task || !editedTask) return null;

  const handleSave = async () => {
    if (!editedTask) return;
    
    await onUpdateTask(editedTask.id, {
      title: editedTask.title,
      description: editedTask.description,
      tags: editedTask.tags,
      priority: editedTask.priority,
      status: editedTask.status,
      assignedMember: editedTask.assignedMember,
      subTasks: editedTask.subTasks,
      startDate: editedTask.startDate,
      dueDate: editedTask.dueDate,
      completed: editedTask.completed,
      risk: editedTask.risk,
      effort: editedTask.effort,
      customFields: editedTask.customFields,
      cover: editedTask.cover,
      attachments: editedTask.attachments
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (task) {
      setEditedTask({ ...task });
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    if (isEditing) {
      handleCancel();
    }
    onClose();
  };

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim() || !editedTask) return;

    const newSubTask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubTaskTitle.trim(),
      completed: false,
      createdAt: Date.now()
    };

    setEditedTask({
      ...editedTask,
      subTasks: [...editedTask.subTasks, newSubTask]
    });
    setNewSubTaskTitle('');
    setIsEditing(true);
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    if (!editedTask) return;
    
    setEditedTask({
      ...editedTask,
      subTasks: editedTask.subTasks.filter(st => st.id !== subTaskId)
    });
    setIsEditing(true);
  };

  const handleToggleSubTask = (subTaskId: string) => {
    if (!editedTask) return;
    
    setEditedTask({
      ...editedTask,
      subTasks: editedTask.subTasks.map(st =>
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      )
    });
    setIsEditing(true);
  };

  const handleAddTag = (tag: TaskTag) => {
    if (!editedTask) return;
    
    const alreadyHasTag = editedTask.tags.some(t => t.id === tag.id);
    if (alreadyHasTag) return;

    setEditedTask({
      ...editedTask,
      tags: [...editedTask.tags, tag]
    });
    setIsEditing(true);
  };

  const handleRemoveTag = (tagId: string) => {
    if (!editedTask) return;
    
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter(t => t.id !== tagId)
    });
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (onDeleteTask) {
      await onDeleteTask(task.id);
      onClose();
    }
  };

  // Cover and attachments handlers
  const handleSelectCover = (cover: TaskCover | null) => {
    if (!editedTask) return;
    setEditedTask({
      ...editedTask,
      cover: cover || undefined
    });
    setIsEditing(true);
    setIsCoverSelectorOpen(false);
  };

  const handleAddAttachment = (attachment: Omit<TaskAttachment, 'id' | 'uploadedAt'>) => {
    if (!editedTask) return;
    
    const newAttachment: TaskAttachment = {
      ...attachment,
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: Date.now()
    };

    setEditedTask({
      ...editedTask,
      attachments: [...(editedTask.attachments || []), newAttachment]
    });
    setIsEditing(true);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    if (!editedTask) return;
    
    setEditedTask({
      ...editedTask,
      attachments: (editedTask.attachments || []).filter(att => att.id !== attachmentId)
    });
    setIsEditing(true);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const assignedMemberInfo = getAssignedMemberInfo(editedTask.assignedMember);

  // Render custom field input based on field definition
  const renderCustomField = (fieldDef: CustomFieldDefinition) => {
    const value = editedTask.customFields?.[fieldDef.id];
    const updateCustomField = (newValue: any) => {
      setEditedTask(prev => ({
        ...prev!,
        customFields: {
          ...prev!.customFields,
          [fieldDef.id]: newValue
        }
      }));
      setIsEditing(true);
    };

    switch (fieldDef.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateCustomField(e.target.value)}
            placeholder={`Enter ${fieldDef.name.toLowerCase()}`}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => updateCustomField(e.target.value)}
            placeholder={`Enter ${fieldDef.name.toLowerCase()}`}
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => updateCustomField(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder={`Enter ${fieldDef.name.toLowerCase()}`}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => updateCustomField(e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateCustomField(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-slate-300">
              {fieldDef.name}
            </span>
          </label>
        );

      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => updateCustomField(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {fieldDef.name.toLowerCase()}</option>
            {fieldDef.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-slate-800 text-white shadow-2xl w-full h-full overflow-hidden border border-slate-700
                      md:rounded-lg md:max-w-3xl md:max-h-[90vh] md:h-auto
                      flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => {
                setEditedTask({ ...editedTask, title: e.target.value });
                setIsEditing(true);
              }}
              onBlur={() => setIsEditingTitle(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              className="text-lg font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none text-white flex-1 mr-4"
              autoFocus
            />
          ) : (
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => {
                  setEditedTask({ ...editedTask, completed: !editedTask.completed });
                  setIsEditing(true);
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  editedTask.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-400 hover:border-green-400'
                }`}
              >
                {editedTask.completed && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <h2
                className={`text-lg font-semibold cursor-pointer hover:text-blue-400 transition-colors ${
                  editedTask.completed ? 'line-through text-slate-400' : 'text-white'
                }`}
                onClick={() => setIsEditingTitle(true)}
              >
                {editedTask.title}
              </h2>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {isEditing && (
              <>
                <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Cancel
                </Button>
              </>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6
                        h-[calc(100vh-160px)] md:max-h-[calc(90vh-160px)] md:h-auto">
          {/* Main Task Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Main Task Actions</h3>
            
            {/* + Add Section */}
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
              
              {showAddMenu && (
                <div className="absolute top-full left-0 mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10 min-w-48">
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <Tag className="w-4 h-4" />
                      Labels
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <Calendar className="w-4 h-4" />
                      Dates
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <List className="w-4 h-4" />
                      Checklist
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <User className="w-4 h-4" />
                      Members
                    </button>
                    <div className="border-t border-slate-600 my-1"></div>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <ToggleLeft className="w-4 h-4" />
                      Checkbox
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <Calendar className="w-4 h-4" />
                      Date
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <List className="w-4 h-4" />
                      Dropdown
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <Hash className="w-4 h-4" />
                      Number
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-sm text-left">
                      <Type className="w-4 h-4" />
                      Text
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
                <Tag className="w-4 h-4" />
                Labels
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
                <Calendar className="w-4 h-4" />
                Dates
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
                <List className="w-4 h-4" />
                Checklist
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
                <User className="w-4 h-4" />
                Members
              </button>
              <button 
                onClick={() => setIsCoverSelectorOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
              >
                <Palette className="w-4 h-4" />
                Cover
              </button>
              <button 
                onClick={() => setIsAttachmentsManagerOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
              >
                <Paperclip className="w-4 h-4" />
                Attachments {editedTask.attachments && editedTask.attachments.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-slate-600 text-xs rounded-full">
                    {editedTask.attachments.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Task Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Task Details</h3>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => {
                  setEditedTask({ ...editedTask, description: e.target.value });
                  setIsEditing(true);
                }}
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add a more detailed description..."
              />
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Custom Fields</h3>
              <button
                onClick={() => setIsCustomFieldsConfigOpen(true)}
                className="flex items-center gap-2 px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors"
              >
                <Settings className="w-3 h-3" />
                Configure
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Priority
                </label>
                <select
                  value={editedTask.priority}
                  onChange={(e) => {
                    setEditedTask({ ...editedTask, priority: e.target.value as PriorityLevel });
                    setIsEditing(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {defaultCustomFields.priority.options.map(option => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Status
                </label>
                <select
                  value={editedTask.status}
                  onChange={(e) => {
                    setEditedTask({ ...editedTask, status: e.target.value as TaskStatus });
                    setIsEditing(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {defaultCustomFields.status.options.map(option => (
                    <option key={option} value={option.toLowerCase().replace(/[^a-z0-9]/g, '_')}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Risk */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Risk
                </label>
                <select
                  value={editedTask.risk || 'low_risk'}
                  onChange={(e) => {
                    setEditedTask({ ...editedTask, risk: e.target.value as any });
                    setIsEditing(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {defaultCustomFields.risk.options.map(option => (
                    <option key={option} value={option.toLowerCase().replace(/\s/g, '_')}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Effort */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Effort
                </label>
                <input
                  type="number"
                  value={editedTask.effort || ''}
                  onChange={(e) => {
                    setEditedTask({ ...editedTask, effort: e.target.value ? parseInt(e.target.value) : undefined });
                    setIsEditing(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Hours/Points"
                />
              </div>
            </div>

            {/* Dynamic Custom Fields */}
            {Object.values(customFields)
              .filter(field => !field.isDefault)
              .sort((a, b) => a.order - b.order)
              .map(fieldDef => {
                const getFieldIcon = () => {
                  switch (fieldDef.type) {
                    case 'text': return Type;
                    case 'textarea': return FileText;
                    case 'number': return Hash;
                    case 'date': return Calendar;
                    case 'dropdown': return List;
                    case 'checkbox': return ToggleLeft;
                    default: return Settings;
                  }
                };
                const Icon = getFieldIcon();

                return (
                  <div key={fieldDef.id} className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {fieldDef.name}
                      {fieldDef.required && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    {renderCustomField(fieldDef)}
                  </div>
                );
              })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Dates & Assignment */}
            <div className="space-y-4">

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editedTask.startDate ? editedTask.startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      setEditedTask({ 
                        ...editedTask, 
                        startDate: e.target.value ? new Date(e.target.value) : undefined 
                      });
                      setIsEditing(true);
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editedTask.dueDate ? editedTask.dueDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      setEditedTask({ 
                        ...editedTask, 
                        dueDate: e.target.value ? new Date(e.target.value) : undefined 
                      });
                      setIsEditing(true);
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Assigned Member */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Assigned To
                </label>
                <select
                  value={editedTask.assignedMember || ''}
                  onChange={(e) => {
                    setEditedTask({ 
                      ...editedTask, 
                      assignedMember: e.target.value || undefined 
                    });
                    setIsEditing(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {availableMembers.map(member => (
                    <option key={member.uid} value={member.uid}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
                {assignedMemberInfo && (
                  <div className="mt-2 flex items-center text-sm text-slate-300">
                    <div 
                      className="w-6 h-6 rounded-full mr-3 flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: assignedMemberInfo.color }}
                    >
                      {assignedMemberInfo.firstName[0]}{assignedMemberInfo.lastName[0]}
                    </div>
                    {assignedMemberInfo.firstName} {assignedMemberInfo.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Labels
                </label>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem] p-3 bg-slate-700 border border-slate-600 rounded-lg">
                  {editedTask.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: tag.color,
                        color: 'white'
                      }}
                      onClick={() => handleRemoveTag(tag.id)}
                    >
                      {tag.label}
                      <X className="w-3 h-3 ml-1" />
                    </span>
                  ))}
                  {editedTask.tags.length === 0 && (
                    <span className="text-slate-400 text-sm">No labels</span>
                  )}
                </div>
                <select
                  onChange={(e) => {
                    const tag = availableTags.find(t => t.id === e.target.value);
                    if (tag) handleAddTag(tag);
                    e.target.value = '';
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Add a label...</option>
                  {availableTags
                    .filter(tag => !editedTask.tags.some(t => t.id === tag.id))
                    .map(tag => (
                      <option key={tag.id} value={tag.id}>{tag.label}</option>
                    ))}
                </select>
              </div>

              {/* Sub-tasks */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Checklist ({editedTask.subTasks.filter(st => st.completed).length}/{editedTask.subTasks.length})
                </label>
                
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {editedTask.subTasks.map(subTask => (
                    <div key={subTask.id} className="flex items-center justify-between p-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={subTask.completed}
                          onChange={() => handleToggleSubTask(subTask.id)}
                          className="mr-3 w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className={`text-sm flex-1 ${subTask.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {subTask.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSubTask(subTask.id)}
                        className="p-1 hover:bg-red-600/20 rounded text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {editedTask.subTasks.length === 0 && (
                    <div className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-center text-slate-400 text-sm">
                      No checklist items
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubTaskTitle}
                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                    placeholder="Add a checklist item..."
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
                  />
                  <Button size="sm" onClick={handleAddSubTask} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-800 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400">
              Created: {new Date(editedTask.createdAt).toLocaleDateString()}
              {editedTask.updatedAt !== editedTask.createdAt && (
                <span className="ml-3">
                  • Updated: {new Date(editedTask.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            
            {onDeleteTask && (
              <div className="flex items-center space-x-3">
                {showDeleteConfirm ? (
                  <>
                    <span className="text-sm text-slate-300">Delete this task?</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    className="text-red-400 border-red-600 hover:bg-red-600/10"
                  >
                    Delete Task
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Fields Configuration Modal */}
      {onUpdateCustomFields && (
        <CustomFieldsConfigModal
          isOpen={isCustomFieldsConfigOpen}
          onClose={() => setIsCustomFieldsConfigOpen(false)}
          customFields={customFields}
          onUpdateCustomFields={onUpdateCustomFields}
        />
      )}

      {/* Cover Selector Modal */}
      <TaskCoverSelector
        isOpen={isCoverSelectorOpen}
        onClose={() => setIsCoverSelectorOpen(false)}
        currentCover={editedTask?.cover}
        onSelectCover={handleSelectCover}
      />

      {/* Attachments Manager Modal */}
      <TaskAttachmentsManager
        isOpen={isAttachmentsManagerOpen}
        onClose={() => setIsAttachmentsManagerOpen(false)}
        attachments={editedTask?.attachments || []}
        onAddAttachment={handleAddAttachment}
        onRemoveAttachment={handleRemoveAttachment}
        currentUserId={availableMembers?.[0]?.uid} // Assuming first member is current user
      />
    </div>
  );
};

export default TaskModal;