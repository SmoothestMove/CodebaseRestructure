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
        <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${task.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-slate-300 dark:border-slate-500'
                  }
                `}>
                  {task.completed && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <h2 className={`text-xl font-semibold ${
                  task.completed 
                    ? 'line-through text-slate-500 dark:text-slate-400' 
                    : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {task.title}
                </h2>
              </div>
              
              {/* Priority Badge */}
              {task.priority && (
                <div className="flex items-center gap-2 mb-2">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${getPriorityColor(task.priority)}
                  `}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {task.priority} Priority
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="text-slate-600 dark:text-slate-300"
                >
                  Edit Task
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cover Display */}
          {task.cover && (
            <div className="h-32 w-full overflow-hidden">
              {task.cover.type === 'color' && (
                <div 
                  className="w-full h-full" 
                  style={{ backgroundColor: task.cover.value }}
                />
              )}
              {task.cover.type === 'gradient' && (
                <div 
                  className="w-full h-full" 
                  style={{ background: task.cover.value }}
                />
              )}
              {task.cover.type === 'image' && (
                <img 
                  src={task.cover.value}
                  alt={task.cover.alt || 'Task cover'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {/* Description */}
            {task.description && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Description</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              </div>
            )}

            {/* Dates */}
            {(task.startDate || task.dueDate) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Timeline</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {task.startDate && (
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Start Date</span>
                      </div>
                      <p className="text-slate-900 dark:text-slate-100">{formatDate(task.startDate)}</p>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className={`w-4 h-4 ${
                          task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Due Date</span>
                      </div>
                      <p className={`font-medium ${
                        task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {formatDate(task.dueDate)}
                      </p>
                      {task.dueDate && new Date(task.dueDate) < new Date() && !task.completed && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">Overdue</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Labels</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned Member */}
            {assignedMember && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Assigned To</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: assignedMember.color }}
                    >
                      {assignedMember.firstName[0]}{assignedMember.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {assignedMember.firstName} {assignedMember.lastName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Assigned Member</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tasks */}
            {task.subTasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      Checklist ({task.subTasks.filter(st => st.completed).length}/{task.subTasks.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          subTaskProgress === 100 
                            ? 'bg-green-500 dark:bg-green-400' 
                            : 'bg-blue-500 dark:bg-blue-400'
                        }`}
                        style={{ width: `${subTaskProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {Math.round(subTaskProgress)}%
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3">
                  {task.subTasks.map(subTask => (
                    <div
                      key={subTask.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${subTask.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-slate-300 dark:border-slate-500'
                        }
                      `}>
                        {subTask.completed && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={`
                        flex-1 transition-all duration-200
                        ${subTask.completed 
                          ? 'line-through text-slate-500 dark:text-slate-400' 
                          : 'text-slate-700 dark:text-slate-300'
                        }
                      `}>
                        {subTask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Category</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {task.originalCategory}
                </p>
              </div>
            </div>

            {/* Status */}
            {task.status && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Status</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border
                    ${task.status === 'completed' 
                      ? 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800'
                      : task.status === 'in-progress'
                      ? 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800'
                      : task.status === 'blocked'
                      ? 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
                      : 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-700 dark:border-slate-600'
                    }
                  `}>
                    {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            )}

            {/* Risk */}
            {task.risk && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Risk Level</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
                    ${task.risk === 'high_risk'
                      ? 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
                      : task.risk === 'moderate_risk'
                      ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800'
                      : 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800'
                    }
                  `}>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {task.risk.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            )}

            {/* Effort */}
            {task.effort && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Effort Estimate</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {task.effort}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {task.effort === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    Attachments ({task.attachments.length})
                  </h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {attachment.type === 'image' && (
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">
                              <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                          )}
                          {attachment.type === 'document' && (
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          {attachment.type === 'link' && (
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded flex items-center justify-center">
                              <Paperclip className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                          )}
                          {attachment.type === 'other' && (
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                              <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {attachment.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="capitalize">{attachment.type}</span>
                            {attachment.size && (
                              <>
                                <span>•</span>
                                <span>
                                  {attachment.size < 1024 ? `${attachment.size} B` :
                                   attachment.size < 1024 * 1024 ? `${(attachment.size / 1024).toFixed(1)} KB` :
                                   `${(attachment.size / (1024 * 1024)).toFixed(1)} MB`}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (attachment.url) {
                              window.open(attachment.url, '_blank');
                            } else if (attachment.base64) {
                              const newWindow = window.open();
                              if (newWindow) {
                                if (attachment.type === 'image') {
                                  newWindow.document.write(`<img src="${attachment.base64}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="${attachment.name}" />`);
                                } else {
                                  const link = document.createElement('a');
                                  link.href = attachment.base64;
                                  link.download = attachment.name;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }
                              }
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                          title={attachment.type === 'link' ? 'Open link' : 'Download'}
                        >
                          {attachment.type === 'link' ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;