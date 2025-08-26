import React, { useEffect, useRef } from 'react';
import { Edit3, Eye, Tag, User, Calendar, Copy, Trash2, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { PlannerTask, TimeframeColumn } from '../types';

interface TaskContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  task: PlannerTask | null;
  position: { x: number; y: number };
  availableTimeframes: TimeframeColumn[];
  currentTimeframeId?: string;
  onEditTask: (taskId: string) => void;
  onViewTask: (taskId: string) => void;
  onMoveToTimeframe: (taskId: string, timeframeId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  onManageTags: (taskId: string) => void;
  onAssignMember: (taskId: string) => void;
  onDuplicateTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
  isOpen,
  onClose,
  task,
  position,
  availableTimeframes,
  currentTimeframeId,
  onEditTask,
  onViewTask,
  onMoveToTimeframe,
  onToggleCompletion,
  onManageTags,
  onAssignMember,
  onDuplicateTask,
  onDeleteTask
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  // Calculate menu position to keep it within viewport
  const getMenuStyle = () => {
    const menuWidth = 280;
    const menuMaxHeight = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let { x, y } = position;
    
    // Adjust horizontal position
    if (x + menuWidth > viewportWidth - 20) {
      x = viewportWidth - menuWidth - 20;
    }
    if (x < 20) {
      x = 20;
    }
    
    // Adjust vertical position
    if (y + menuMaxHeight > viewportHeight - 20) {
      y = viewportHeight - menuMaxHeight - 20;
    }
    if (y < 20) {
      y = 20;
    }

    return {
      position: 'fixed' as const,
      top: y,
      left: x,
      zIndex: 1000
    };
  };

  const handleMenuAction = (action: () => void) => {
    action();
    onClose();
  };

  const otherTimeframes = availableTimeframes.filter(tf => tf.id !== currentTimeframeId);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden">
      <div
        ref={menuRef}
        style={getMenuStyle()}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 w-70 max-w-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-3">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
                {task.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Task Actions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="py-2">
          <button
            onClick={() => handleMenuAction(() => onViewTask(task.id))}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                View Details
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Open read-only view
              </div>
            </div>
          </button>

          <button
            onClick={() => handleMenuAction(() => onEditTask(task.id))}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Edit3 className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Edit Task
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Modify task details
              </div>
            </div>
          </button>

          <button
            onClick={() => handleMenuAction(() => onToggleCompletion(task.id))}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
            <div className={`p-2 rounded-lg ${
              task.completed 
                ? 'bg-orange-100 dark:bg-orange-900/20' 
                : 'bg-green-100 dark:bg-green-900/20'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${
                task.completed 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-green-600 dark:text-green-400'
              }`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Toggle completion status
              </div>
            </div>
          </button>
        </div>

        {/* Move To Timeframe */}
        {otherTimeframes.length > 0 && (
          <>
            <div className="border-t border-slate-200 dark:border-slate-600">
              <div className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Move To
              </div>
              <div className="max-h-32 overflow-y-auto">
                {otherTimeframes.slice(0, 4).map(timeframe => (
                  <button
                    key={timeframe.id}
                    onClick={() => handleMenuAction(() => onMoveToTimeframe(task.id, timeframe.id))}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                  >
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded">
                      <ArrowRight className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {timeframe.title}
                      </div>
                      {timeframe.dateRange && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {timeframe.dateRange}
                        </div>
                      )}
                    </div>
                    {timeframe.color && (
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: timeframe.color }}
                      />
                    )}
                  </button>
                ))}
                {otherTimeframes.length > 4 && (
                  <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                    +{otherTimeframes.length - 4} more timeframes
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Secondary Actions */}
        <div className="border-t border-slate-200 dark:border-slate-600 py-2">
          <button
            onClick={() => handleMenuAction(() => onManageTags(task.id))}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
            <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Manage Labels</span>
          </button>

          <button
            onClick={() => handleMenuAction(() => onAssignMember(task.id))}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Assign Member</span>
          </button>

          {onDuplicateTask && (
            <button
              onClick={() => handleMenuAction(() => onDuplicateTask(task.id))}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Duplicate Task</span>
            </button>
          )}
        </div>

        {/* Destructive Actions */}
        {onDeleteTask && (
          <div className="border-t border-slate-200 dark:border-slate-600 py-2">
            <button
              onClick={() => handleMenuAction(() => onDeleteTask(task.id))}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
            >
              <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-400">Delete Task</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-600">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Tap outside to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskContextMenu;