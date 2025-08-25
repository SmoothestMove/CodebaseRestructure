import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Calendar, Plus } from 'lucide-react';
import { TimeframeColumn as TimeframeColumnType, PlannerTask, calculateFrameDate, formatFrameDate } from '../types';
import TaskCard from './TaskCard';

interface TimeframeColumnProps {
  timeframe: TimeframeColumnType;
  tasks: PlannerTask[];
  moveDate?: Date | null; // Move date for calculating relative dates
  onToggleSubTasks?: (taskId: string) => void;
  onToggleCompletion?: (taskId: string) => void;
  onToggleSubTaskCompletion?: (taskId: string, subTaskId: string) => void;
  onManageTags?: (taskId: string) => void;
  onAssignMember?: (taskId: string) => void;
  onTaskClick?: (taskId: string) => void; // For Task Details Modal (read-only)
  onTaskEdit?: (taskId: string) => void; // For Task Edit Modal
  getAssignedMemberInfo?: (memberUid: string | undefined) => { uid: string; firstName: string; lastName: string; color: string } | null;
  
  // Context menu props
  availableTimeframes?: TimeframeColumnType[];
  onMoveToTimeframe?: (taskId: string, timeframeId: string) => void;
  onDuplicateTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TimeframeColumn: React.FC<TimeframeColumnProps> = ({
  timeframe,
  tasks,
  moveDate,
  onToggleSubTasks,
  onToggleCompletion,
  onToggleSubTaskCompletion,
  onManageTags,
  onAssignMember,
  onTaskClick,
  onTaskEdit,
  getAssignedMemberInfo,
  availableTimeframes = [],
  onMoveToTimeframe,
  onDuplicateTask,
  onDeleteTask
}) => {
  // Calculate comprehensive progress including sub-tasks
  const calculateProgress = () => {
    if (tasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    let totalItems = 0;
    let completedItems = 0;
    
    tasks.forEach(task => {
      // Count the main task
      totalItems += 1;
      if (task.completed) {
        completedItems += 1;
      }
      
      // Count sub-tasks
      task.subTasks.forEach(subTask => {
        totalItems += 1;
        if (subTask.completed) {
          completedItems += 1;
        }
      });
    });
    
    const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    return { completed: completedItems, total: totalItems, percentage };
  };
  
  const progress = calculateProgress();
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  // Calculate the actual date for this frame
  const frameDate = timeframe.dateOffset !== undefined 
    ? calculateFrameDate(moveDate, timeframe.dateOffset)
    : null;
    
  const displayDate = frameDate && timeframe.dateRange
    ? formatFrameDate(frameDate, timeframe.dateRange)
    : timeframe.dateRange;

  return (
    <div className="w-72 md:w-80 flex-shrink-0 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/50">
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 flex-1">
            {timeframe.title}
          </h3>
          {timeframe.color && (
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
              style={{ backgroundColor: timeframe.color }}
            />
          )}
        </div>
        
        {timeframe.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            {timeframe.description}
          </p>
        )}

        {/* Date Information */}
        {displayDate && (
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{displayDate}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {totalTasks} task{totalTasks !== 1 ? 's' : ''}
          </span>
          
          {progress.total > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {progress.completed}/{progress.total} items
            </span>
          )}
        </div>
        
        {/* Progress Bar */}
        {progress.total > 0 && (
          <div className="mt-2">
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  progress.percentage === 100 
                    ? 'bg-green-500 dark:bg-green-400' 
                    : 'bg-brand-primary dark:bg-brand-accent'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {Math.round(progress.percentage)}% complete
              </span>
              {progress.percentage === 100 && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ Done
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <Droppable droppableId={timeframe.id} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              p-4 min-h-[300px] max-h-[600px] overflow-y-auto
              transition-all duration-200
              ${snapshot.isDraggingOver 
                ? 'bg-brand-primary/5 dark:bg-brand-accent/5 border-brand-primary/20 dark:border-brand-accent/20' 
                : ''
              }
            `}
          >
            {/* Tasks */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                isInSidebar={false}
                onToggleSubTasks={onToggleSubTasks}
                onToggleCompletion={onToggleCompletion}
                onToggleSubTaskCompletion={onToggleSubTaskCompletion}
                onManageTags={onManageTags}
                onAssignMember={onAssignMember}
                onTaskClick={onTaskClick}
                onTaskEdit={onTaskEdit}
                assignedMemberInfo={getAssignedMemberInfo?.(task.assignedMember)}
                availableTimeframes={availableTimeframes}
                currentTimeframeId={timeframe.id}
                onMoveToTimeframe={onMoveToTimeframe}
                onDuplicateTask={onDuplicateTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
            
            {provided.placeholder}
            
            {/* Empty State */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Drop tasks here</p>
                <p className="text-xs mt-1">or drag from the sidebar</p>
              </div>
            )}
            
            {/* Drag Over State */}
            {snapshot.isDraggingOver && tasks.length === 0 && (
              <div className="text-center py-12 text-brand-primary dark:text-brand-accent">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Drop to add task</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TimeframeColumn;