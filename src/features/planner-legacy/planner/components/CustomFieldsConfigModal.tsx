import React, { useState, useEffect } from 'react';
import { X, Plus, Settings, Type, Hash, ToggleLeft, Calendar, List, FileText, AlertCircle, CheckCircle2, User, Tag, Trash2, GripVertical } from 'lucide-react';
import { CustomFieldDefinition, CustomFieldType } from '../types';
import Button from '@/components/common/Button';

interface CustomFieldsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  customFields: Record<string, CustomFieldDefinition>;
  onUpdateCustomFields: (fields: Record<string, CustomFieldDefinition>) => void;
}

const FIELD_TYPE_OPTIONS: Array<{
  type: CustomFieldType;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}> = [
  { type: 'text', label: 'Text', icon: Type, description: 'Single line text input' },
  { type: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
  { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker' },
  { type: 'dropdown', label: 'Dropdown', icon: List, description: 'Select from predefined options' },
  { type: 'checkbox', label: 'Checkbox', icon: ToggleLeft, description: 'True/false toggle' },
];

const DEFAULT_SYSTEM_FIELDS: Record<string, CustomFieldDefinition> = {
  priority: {
    id: 'priority',
    name: 'Priority',
    type: 'dropdown',
    required: false,
    options: ['Critical', 'High', 'Medium', 'Low'],
    defaultValue: 'medium',
    order: 1,
    icon: 'AlertCircle',
    color: '#f59e0b',
    isDefault: true
  },
  status: {
    id: 'status',
    name: 'Status',
    type: 'dropdown',
    required: false,
    options: ['Not Started', 'In Progress', 'Completed', 'Blocked/Pending', 'Cancelled'],
    defaultValue: 'not_started',
    order: 2,
    icon: 'CheckCircle2',
    color: '#3b82f6',
    isDefault: true
  },
  risk: {
    id: 'risk',
    name: 'Risk',
    type: 'dropdown',
    required: false,
    options: ['Low Risk', 'Moderate Risk', 'High Risk'],
    defaultValue: 'low_risk',
    order: 3,
    icon: 'AlertCircle',
    color: '#ef4444',
    isDefault: true
  },
  effort: {
    id: 'effort',
    name: 'Effort',
    type: 'number',
    required: false,
    defaultValue: 0,
    order: 4,
    icon: 'Hash',
    color: '#8b5cf6',
    isDefault: true
  }
};

const CustomFieldsConfigModal: React.FC<CustomFieldsConfigModalProps> = ({
  isOpen,
  onClose,
  customFields,
  onUpdateCustomFields
}) => {
  const [fields, setFields] = useState<Record<string, CustomFieldDefinition>>({});
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text');
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>(['']);

  useEffect(() => {
    if (isOpen) {
      // Merge system defaults with custom fields
      const mergedFields = { ...DEFAULT_SYSTEM_FIELDS, ...customFields };
      setFields(mergedFields);
    }
  }, [isOpen, customFields]);

  const handleSave = () => {
    onUpdateCustomFields(fields);
    onClose();
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;

    const fieldId = newFieldName.toLowerCase().replace(/\s+/g, '_');
    const newField: CustomFieldDefinition = {
      id: fieldId,
      name: newFieldName.trim(),
      type: newFieldType,
      required: false,
      options: newFieldType === 'dropdown' ? newFieldOptions.filter(opt => opt.trim()) : undefined,
      defaultValue: getDefaultValueForType(newFieldType),
      order: Object.keys(fields).length + 1,
      isDefault: false
    };

    setFields(prev => ({ ...prev, [fieldId]: newField }));
    setIsAddingField(false);
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldOptions(['']);
  };

  const handleDeleteField = (fieldId: string) => {
    if (fields[fieldId]?.isDefault) return; // Can't delete system fields
    
    const newFields = { ...fields };
    delete newFields[fieldId];
    setFields(newFields);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<CustomFieldDefinition>) => {
    setFields(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], ...updates }
    }));
  };

  const getDefaultValueForType = (type: CustomFieldType): any => {
    switch (type) {
      case 'text':
      case 'textarea':
        return '';
      case 'number':
        return 0;
      case 'checkbox':
        return false;
      case 'date':
        return null;
      case 'dropdown':
        return newFieldOptions[0] || '';
      default:
        return '';
    }
  };

  const getFieldIcon = (iconName?: string) => {
    switch (iconName) {
      case 'AlertCircle': return AlertCircle;
      case 'CheckCircle2': return CheckCircle2;
      case 'Hash': return Hash;
      case 'Type': return Type;
      case 'Calendar': return Calendar;
      case 'List': return List;
      case 'ToggleLeft': return ToggleLeft;
      case 'FileText': return FileText;
      default: return Settings;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-brand-primary dark:text-brand-accent" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Custom Fields Configuration
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage custom fields for your move tasks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fields List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Current Fields</h3>
                <Button
                  size="sm"
                  onClick={() => setIsAddingField(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {Object.values(fields)
                  .sort((a, b) => a.order - b.order)
                  .map((field) => {
                    const Icon = getFieldIcon(field.icon);
                    const typeOption = FIELD_TYPE_OPTIONS.find(opt => opt.type === field.type);
                    const TypeIcon = typeOption?.icon || Type;

                    return (
                      <div
                        key={field.id}
                        className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-600">
                              <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                  {field.name}
                                </h4>
                                {field.isDefault && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                                    System
                                  </span>
                                )}
                                {field.required && (
                                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                                    Required
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <TypeIcon className="w-3 h-3" />
                                <span>{typeOption?.label || field.type}</span>
                                {field.options && (
                                  <span>• {field.options.length} options</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded">
                              <GripVertical className="w-4 h-4" />
                            </button>
                            {!field.isDefault && (
                              <button
                                onClick={() => handleDeleteField(field.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Field Options */}
                        {field.options && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                            <div className="flex flex-wrap gap-1">
                              {field.options.map((option, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded"
                                >
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Add New Field */}
            <div>
              {isAddingField ? (
                <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Add New Field</h3>
                  
                  <div className="space-y-4">
                    {/* Field Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="Enter field name"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Field Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Field Type
                      </label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {FIELD_TYPE_OPTIONS.map(option => (
                          <option key={option.type} value={option.type}>
                            {option.label} - {option.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dropdown Options */}
                    {newFieldType === 'dropdown' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {newFieldOptions.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newFieldOptions];
                                  newOptions[index] = e.target.value;
                                  setNewFieldOptions(newOptions);
                                }}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                onClick={() => {
                                  const newOptions = newFieldOptions.filter((_, i) => i !== index);
                                  setNewFieldOptions(newOptions);
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setNewFieldOptions([...newFieldOptions, ''])}
                            leftIcon={<Plus className="w-4 h-4" />}
                          >
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-600">
                      <Button onClick={handleAddField}>
                        Add Field
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingField(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-slate-200 dark:border-slate-600 rounded-lg border-dashed">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Customize Your Fields
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Add custom fields to capture specific information for your move tasks.
                  </p>
                  <Button
                    onClick={() => setIsAddingField(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Custom Field
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {Object.keys(fields).length} fields configured
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldsConfigModal;