import React, { useState, useRef, useCallback } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Tag, User, CheckCircle2, List, ChevronDown, ChevronRight, GripVertical, Calendar, Clock, Edit3, FileText, AlertCircle, Hash, Paperclip } from 'lucide-react';
import { PlannerTask, TimeframeColumn } from '../types';
import TaskContextMenu from './TaskContextMenu';

interface TaskCardProps {
  task: PlannerTask;
  index: number;
  isInSidebar?: boolean;
  isAssigned?: boolean; // Whether this task is assigned to a timeframe
  onToggleSubTasks?: (taskId: string) => void;
  onToggleCompletion?: (taskId: string) => void;
  onToggleSubTaskCompletion?: (taskId: string, subTaskId: string) => void;
  onManageTags?: (taskId: string) => void;
  onAssignMember?: (taskId: string) => void;
  onTaskClick?: (taskId: string) => void; // For Task Details Modal (read-only)
  onTaskEdit?: (taskId: string) => void; // For Task Edit Modal
  assignedMemberInfo?: { uid: string; firstName: string; lastName: string; color: string } | null;
  showSubTasks?: boolean;
  
  // Context menu props
  availableTimeframes?: TimeframeColumn[];
  currentTimeframeId?: string;
  onMoveToTimeframe?: (taskId: string, timeframeId: string) => void;
  onDuplicateTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  isInSidebar = false,
  isAssigned = false,
  onToggleSubTasks,
  onToggleCompletion,
  onToggleSubTaskCompletion,
  onManageTags,
  onAssignMember,
  onTaskClick,
  onTaskEdit,
  assignedMemberInfo,
  showSubTasks = false,
  availableTimeframes = [],
  currentTimeframeId,
  onMoveToTimeframe,
  onDuplicateTask,
  onDeleteTask
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressStartTime = useRef<number>(0);

  const handleSubTaskToggle = () => {
    setIsExpanded(!isExpanded);
    onToggleSubTasks?.(task.id);
  };

  const handleCompletionToggle = () => {
    onToggleCompletion?.(task.id);
  };

  // Long press handlers for mobile context menu functionality
  const handleLongPressStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    longPressStartTime.current = Date.now();
    setLongPressTriggered(false);
    
    longPressTimer.current = setTimeout(() => {
      setLongPressTriggered(true);
      
      // Get touch/mouse position for context menu
      let clientX: number, clientY: number;
      
      if ('touches' in e && e.touches.length > 0) {
        // Touch event
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        // Mouse event
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        // Fallback to center of screen
        clientX = window.innerWidth / 2;
        clientY = window.innerHeight / 2;
      }
      
      setContextMenuPosition({ x: clientX, y: clientY });
      setIsContextMenuOpen(true);
      
      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms for long press detection
  }, [task.id]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const timeSincePress = Date.now() - longPressStartTime.current;
    
    // Only trigger click if it wasn't a long press and the click is on the card body
    if (!longPressTriggered && timeSincePress < 500) {
      onTaskClick?.(task.id);
    }
    setLongPressTriggered(false);
  }, [longPressTriggered, onTaskClick, task.id]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskEdit?.(task.id);
  }, [onTaskEdit, task.id]);

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    if (diffDays === 0) {
      return `Today`;
    } else if (diffDays === 1) {
      return `Tomorrow`;
    } else if (diffDays === -1) {
      return `Yesterday`;
    } else if (diffDays > 0 && diffDays <= 7) {
      return `${diffDays}d`;
    } else if (diffDays < 0 && diffDays >= -7) {
      return `${Math.abs(diffDays)}d ago`;
    } else {
      return formattedDate;
    }
  };

  // Context menu handlers
  const handleContextMenuClose = useCallback(() => {
    setIsContextMenuOpen(false);
  }, []);

  const handleContextMenuEdit = useCallback((taskId: string) => {
    onTaskEdit?.(taskId);
  }, [onTaskEdit]);

  const handleContextMenuView = useCallback((taskId: string) => {
    onTaskClick?.(taskId);
  }, [onTaskClick]);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            group relative
            ${isInSidebar ? 'mb-2' : 'mb-3'}
            ${snapshot.isDragging ? 'opacity-90 rotate-2 scale-105' : ''}
            transition-all duration-200 ease-in-out
          `}
        >
          <div
            className={`
              bg-white dark:bg-slate-800 
              border border-slate-200 dark:border-slate-600 
              rounded-lg shadow-sm
              ${snapshot.isDragging ? 'shadow-lg ring-2 ring-brand-primary/20' : 'hover:shadow-md'}
              ${task.completed ? 'opacity-75' : ''}
              transition-all duration-200
              overflow-hidden
            `}
          >
            {/* Drag Handle */}
            <div 
              {...provided.dragHandleProps}
              className={`
                absolute left-2 top-2 opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                ${snapshot.isDragging ? 'opacity-100' : ''}
                cursor-grab active:cursor-grabbing
                touch-manipulation
              `}
            >
              <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>

            {/* Hover Edit Button - Desktop Only */}
            {onTaskEdit && (
              <button
                onClick={handleEditClick}
                className={`
                  absolute right-2 top-1/2 -translate-y-1/2 z-10
                  w-8 h-8 rounded-full bg-white dark:bg-slate-700 
                  border border-slate-300 dark:border-slate-500
                  shadow-sm hover:shadow-md transition-all duration-200
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  hover:bg-slate-50 dark:hover:bg-slate-600
                  hover:border-brand-primary dark:hover:border-brand-accent
                  focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20
                  touch-manipulation
                  ${snapshot.isDragging ? 'opacity-0' : ''}
                  hidden md:flex
                `}
                title="Edit task"
              >
                <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-accent" />
              </button>
            )}

            {/* Card Cover */}
            {task.cover && (
              <div className="h-24 w-full overflow-hidden">
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

            {/* Card Content */}
            <div 
              className="p-3 pl-8 cursor-pointer"
              onClick={handleCardClick}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
              onTouchCancel={handleLongPressEnd}
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-2">
                  <h3 className={`
                    text-sm font-medium
                    ${task.completed 
                      ? 'line-through text-slate-500 dark:text-slate-400' 
                      : isInSidebar && isAssigned
                        ? 'line-through text-slate-500 dark:text-slate-400 opacity-75'
                        : 'text-slate-900 dark:text-slate-100'
                    }
                  `}>
                    {task.title}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Completion Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompletionToggle();
                    }}
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      transition-all duration-200 touch-manipulation
                      ${task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-slate-300 dark:border-slate-500 hover:border-green-400'
                      }
                    `}
                  >
                    {task.completed && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Content Indicators */}
              {(task.description || task.risk || task.effort || task.subTasks.length > 0 || (task.startDate || task.dueDate) || (task.attachments && task.attachments.length > 0)) && (
                <div className="flex items-center gap-1 mb-2">
                  {task.description && (
                    <div className="p-1 rounded bg-slate-100 dark:bg-slate-700" title="Has description">
                      <FileText className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                  {task.risk && (
                    <div className={`p-1 rounded ${
                      task.risk === 'high_risk' ? 'bg-red-100 dark:bg-red-900/20' :
                      task.risk === 'moderate_risk' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-green-100 dark:bg-green-900/20'
                    }`} title={`Risk: ${task.risk.replace('_', ' ')}`}>
                      <AlertCircle className={`w-3 h-3 ${
                        task.risk === 'high_risk' ? 'text-red-600 dark:text-red-400' :
                        task.risk === 'moderate_risk' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`} />
                    </div>
                  )}
                  {task.effort && (
                    <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/20" title={`Effort: ${task.effort} ${task.effort === 1 ? 'hour' : 'hours'}`}>
                      <Hash className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  {task.subTasks.length > 0 && (
                    <div className="p-1 rounded bg-purple-100 dark:bg-purple-900/20" title={`${task.subTasks.length} checklist items`}>
                      <List className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  {(task.startDate || task.dueDate) && (
                    <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/20" title="Has dates">
                      <Calendar className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="p-1 rounded bg-orange-100 dark:bg-orange-900/20" title={`${task.attachments.length} attachment${task.attachments.length === 1 ? '' : 's'}`}>
                      <Paperclip className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {task.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Dates */}
              {(task.startDate || task.dueDate) && (
                <div className="flex items-center gap-3 mb-2 text-xs text-slate-500 dark:text-slate-400">
                  {task.startDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Start: {formatDate(task.startDate)}</span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className={`flex items-center gap-1 ${
                      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
                        ? 'text-red-500 dark:text-red-400'
                        : ''
                    }`}>
                      <Calendar className="w-3 h-3" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="mb-2">
                <div className="flex flex-wrap gap-1 mb-1">
                  {task.tags.slice(0, isInSidebar ? 2 : 3).map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
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
                  {task.tags.length > (isInSidebar ? 2 : 3) && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      +{task.tags.length - (isInSidebar ? 2 : 3)} more
                    </span>
                  )}
                </div>
                
                {/* Manage Tags Button */}
                {onManageTags && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onManageTags(task.id);
                    }}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-accent transition-colors flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {task.tags.length > 0 ? 'Edit tags' : 'Add tags'}
                  </button>
                )}
              </div>

              {/* Sub-tasks */}
              {task.subTasks.length > 0 && (
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubTaskToggle();
                    }}
                    className="flex items-center justify-between w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors touch-manipulation"
                  >
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 mr-1" />
                      ) : (
                        <ChevronRight className="w-3 h-3 mr-1" />
                      )}
                      <List className="w-3 h-3 mr-1" />
                      {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} subtasks
                    </div>
                    
                    {/* Sub-task Progress Bar */}
                    {(() => {
                      const completedSubTasks = task.subTasks.filter(st => st.completed).length;
                      const totalSubTasks = task.subTasks.length;
                      const subTaskProgress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;
                      
                      return (
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-slate-200 dark:bg-slate-600 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${
                                subTaskProgress === 100 
                                  ? 'bg-green-500 dark:bg-green-400' 
                                  : 'bg-blue-500 dark:bg-blue-400'
                              }`}
                              style={{ width: `${subTaskProgress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {Math.round(subTaskProgress)}%
                          </span>
                        </div>
                      );
                    })()}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-600 animate-in slide-in-from-top-1 duration-200">
                      {task.subTasks.map(subTask => (
                        <div
                          key={subTask.id}
                          className="flex items-center text-xs group/subtask cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSubTaskCompletion?.(task.id, subTask.id);
                          }}
                        >
                          <button className={`
                            w-4 h-4 rounded-full border-2 mr-2 flex-shrink-0 flex items-center justify-center
                            touch-manipulation transition-all duration-200
                            ${subTask.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-slate-300 dark:border-slate-500 hover:border-green-400 group-hover/subtask:border-green-400'
                            }
                          `}>
                            {subTask.completed && (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            )}
                          </button>
                          <span className={`
                            flex-1 transition-all duration-200
                            ${subTask.completed 
                              ? 'line-through text-slate-500 dark:text-slate-400' 
                              : 'text-slate-700 dark:text-slate-300 group-hover/subtask:text-slate-900 dark:group-hover/subtask:text-slate-100'
                            }
                          `}>
                            {subTask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Member Assignment */}
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                {assignedMemberInfo ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: assignedMemberInfo.color }}
                      >
                        {assignedMemberInfo.uid}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {assignedMemberInfo.firstName} {assignedMemberInfo.lastName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Assigned
                        </span>
                      </div>
                    </div>
                    {onAssignMember && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssignMember(task.id);
                        }}
                        className="text-xs text-brand-primary dark:text-brand-accent hover:underline"
                      >
                        Change
                      </button>
                    )}
                  </div>
                ) : (
                  onAssignMember && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignMember(task.id);
                      }}
                      className="flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-accent transition-colors"
                    >
                      <User className="w-3 h-3 mr-1" />
                      Assign member
                    </button>
                  )
                )}
              </div>

              {/* Category badge (only in sidebar) */}
              {isInSidebar && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {task.originalCategory}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
    
    {/* Task Context Menu - Mobile Only */}
    <TaskContextMenu
      isOpen={isContextMenuOpen}
      onClose={handleContextMenuClose}
      task={task}
      position={contextMenuPosition}
      availableTimeframes={availableTimeframes}
      currentTimeframeId={currentTimeframeId}
      onEditTask={handleContextMenuEdit}
      onViewTask={handleContextMenuView}
      onMoveToTimeframe={onMoveToTimeframe || (() => {})}
      onToggleCompletion={onToggleCompletion || (() => {})}
      onManageTags={onManageTags || (() => {})}
      onAssignMember={onAssignMember || (() => {})}
      onDuplicateTask={onDuplicateTask}
      onDeleteTask={onDeleteTask}
    />
    </>
  );
};

export default TaskCard;