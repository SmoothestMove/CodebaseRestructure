import React from 'react';
import { X, Calendar, Clock, Tag, User, CheckCircle2, List, FileText, AlertCircle, Star, Hash, Paperclip, Eye, Download } from 'lucide-react';
import { PlannerTask } from '../types';
import Button from '@/components/common/Button';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: PlannerTask | null;
  getAssignedMemberInfo?: (memberUid: string | undefined) => { uid: string; firstName: string; lastName: string; color: string } | null;
  onEdit?: () => void; // Optional edit button to switch to edit modal
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  getAssignedMemberInfo,
  onEdit
}) => {
  if (!isOpen || !task) return null;

  const assignedMember = getAssignedMemberInfo?.(task.assignedMember);

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate sub-task progress
  const subTaskProgress = task.subTasks.length > 0 
    ? (task.subTasks.filter(st => st.completed).length / task.subTasks.length) * 100 
    : 0;

  // Priority level styling
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-700 dark:border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
          {/* Left Sidebar */}
          <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            {/* Close button */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Sidebar Menu */}
            <div className="flex-1 p-4 space-y-2">
              <div className="flex items-center space-x-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                <Tag className="w-5 h-5" />
                <span className="font-medium">Labels</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Dates</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Checklist</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                <User className="w-5 h-5" />
                <span className="font-medium">Members</span>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${task.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-slate-300 dark:border-slate-500'
                  }
                `}>
                  {task.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <h2 className={`text-xl font-semibold flex-1 ${
                  task.completed 
                    ? 'line-through text-slate-500 dark:text-slate-400' 
                    : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {task.title}
                </h2>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="text-slate-600 dark:text-slate-300"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</h3>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-900 dark:text-slate-100 text-sm">
                    {task.description || 'Familiarize yourself with the moving app features and interface'}
                  </p>
                </div>
              </div>

              {/* Labels Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Labels</h3>
                <div className="inline-block">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Packing & Organizing
                  </span>
                </div>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status & Priority</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Priority</span>
                      <div className="mt-1">
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded text-xs font-medium
                          ${getPriorityColor(task.priority)}
                        `}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {task.status === 'todo' ? 'Not Started' : task.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority/Status Selectors */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Priority
                    </label>
                    <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                      <option value={task.priority}>{task.priority}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Status
                    </label>
                    <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                      <option value={task.status}>{task.status === 'todo' ? 'Not Started' : task.status.replace('-', ' ')}</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Add New Field */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Field
              </Button>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onClose}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;