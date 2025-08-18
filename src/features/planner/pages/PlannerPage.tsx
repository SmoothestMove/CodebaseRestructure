import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, AlertCircle, Settings } from 'lucide-react';
import { DropResult } from '@hello-pangea/dnd';
import { PlannerTask, TaskTag, TimeframeColumn } from '../types';
import { useMove } from '@/features/settings/hooks/MoveContext';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { useFirebasePlanner } from '../hooks/useFirebasePlanner';
import Button from '@/components/common/Button';
import DragDropProvider from '../components/DragDropProvider';
import TaskSidebar from '../components/TaskSidebar';
import TimeframeColumnComponent from '../components/TimeframeColumn';
import TagManager from '../components/TagManager';
import TaskTagPicker from '../components/TaskTagPicker';
import MemberAssignmentPicker from '../components/MemberAssignmentPicker';
import TimeframeCreator from '../components/TimeframeCreator';
import TaskModal from '../components/TaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';

const PlannerPage: React.FC = () => {
  const { move } = useMove();
  const { owners } = useOwners();
  
  const {
    plannerData,
    updateTask,
    updateTaskTags,
    assignMember,
    toggleTaskCompletion,
    toggleSubTaskCompletion,
    createTimeframe,
    deleteTimeframe,
    handleDragEnd: firebaseHandleDragEnd,
    toggleSidebar: firebaseToggleSidebar,
    initializePlanner: firebaseInitializePlanner
  } = useFirebasePlanner(move?.id || null, move?.moveDate);

  // Tag management state
  const [availableTags, setAvailableTags] = useState<TaskTag[]>([]);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isTaskTagPickerOpen, setIsTaskTagPickerOpen] = useState(false);
  const [selectedTaskForTags, setSelectedTaskForTags] = useState<PlannerTask | null>(null);

  // Member assignment state
  const [isMemberAssignmentOpen, setIsMemberAssignmentOpen] = useState(false);
  const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState<PlannerTask | null>(null);

  // Timeframe creation state
  const [isTimeframeCreatorOpen, setIsTimeframeCreatorOpen] = useState(false);

  // Task modal state (for editing)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<PlannerTask | null>(null);
  
  // Task details modal state (for read-only viewing)
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<PlannerTask | null>(null);

  // Initialize planner when component mounts
  useEffect(() => {
    if (move?.id) {
      firebaseInitializePlanner();
    }
  }, [move?.id, firebaseInitializePlanner]);

  // Extract available tags from all tasks
  useEffect(() => {
    const allTags: TaskTag[] = [];
    const tagIds = new Set<string>();
    
    Object.values(plannerData.tasks).forEach(task => {
      task.tags.forEach(tag => {
        if (!tagIds.has(tag.id)) {
          tagIds.add(tag.id);
          allTags.push(tag);
        }
      });
    });
    
    setAvailableTags(allTags);
  }, [plannerData.tasks]);

  // Use Firebase handlers
  const toggleSidebar = firebaseToggleSidebar;
  const handleDragEnd = firebaseHandleDragEnd;

  const handleToggleSubTasks = (taskId: string) => {
    // Implementation for toggling sub-tasks visibility - this is UI only
    console.log('Toggle sub-tasks for task:', taskId);
  };

  // Use Firebase handlers for data operations
  const handleToggleCompletion = toggleTaskCompletion;
  const handleToggleSubTaskCompletion = toggleSubTaskCompletion;

  // Get tasks for each timeframe
  const getTasksForTimeframe = (timeframeId: string): PlannerTask[] => {
    const timeframe = plannerData.timeframes[timeframeId];
    if (!timeframe) return [];
    
    return timeframe.taskIds
      .map(taskId => plannerData.tasks[taskId])
      .filter(Boolean);
  };

  // Get assigned task IDs (tasks that are in any timeframe)
  const getAssignedTaskIds = (): Set<string> => {
    const assignedTaskIds = new Set<string>();
    
    // Collect all assigned task IDs
    Object.values(plannerData.timeframes).forEach(timeframe => {
      timeframe.taskIds.forEach(taskId => assignedTaskIds.add(taskId));
    });
    
    return assignedTaskIds;
  };

  // Calculate overall progress including sub-tasks
  const calculateOverallProgress = () => {
    const allTasks = Object.values(plannerData.tasks);
    if (allTasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    let totalItems = 0;
    let completedItems = 0;
    
    allTasks.forEach(task => {
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

  // Get available tasks (not assigned to any timeframe)
  const getAvailableTasks = (): PlannerTask[] => {
    const assignedTaskIds = getAssignedTaskIds();
    
    // Return tasks that are not assigned
    return Object.values(plannerData.tasks).filter(task => !assignedTaskIds.has(task.id));
  };

  // Tag management handlers
  const handleManageTags = (taskId: string) => {
    const task = plannerData.tasks[taskId];
    if (task) {
      setSelectedTaskForTags(task);
      setIsTaskTagPickerOpen(true);
    }
  };

  const handleAddTag = (tag: TaskTag) => {
    setAvailableTags(prev => [...prev, tag]);
  };

  const handleDeleteTag = (tagId: string) => {
    setAvailableTags(prev => prev.filter(tag => tag.id !== tagId));
    
    // Remove tag from all tasks
    setPlannerData(prev => {
      const updatedTasks = { ...prev.tasks };
      Object.keys(updatedTasks).forEach(taskId => {
        updatedTasks[taskId] = {
          ...updatedTasks[taskId],
          tags: updatedTasks[taskId].tags.filter(tag => tag.id !== tagId),
          updatedAt: Date.now()
        };
      });
      
      return {
        ...prev,
        tasks: updatedTasks,
        lastUpdated: Date.now()
      };
    });
  };

  const handleUpdateTag = (updatedTag: TaskTag) => {
    setAvailableTags(prev => 
      prev.map(tag => tag.id === updatedTag.id ? updatedTag : tag)
    );
    
    // Update tag in all tasks
    setPlannerData(prev => {
      const updatedTasks = { ...prev.tasks };
      Object.keys(updatedTasks).forEach(taskId => {
        updatedTasks[taskId] = {
          ...updatedTasks[taskId],
          tags: updatedTasks[taskId].tags.map(tag => 
            tag.id === updatedTag.id ? updatedTag : tag
          ),
          updatedAt: Date.now()
        };
      });
      
      return {
        ...prev,
        tasks: updatedTasks,
        lastUpdated: Date.now()
      };
    });
  };

  const handleUpdateTaskTags = (taskId: string, tags: TaskTag[]) => {
    updateTaskTags(taskId, tags);
  };

  const handleOpenTagManager = () => {
    setIsTaskTagPickerOpen(false);
    setIsTagManagerOpen(true);
  };

  const handleCloseTagManager = () => {
    setIsTagManagerOpen(false);
    if (selectedTaskForTags) {
      setIsTaskTagPickerOpen(true);
    }
  };

  // Member assignment handlers
  const handleAssignMember = (taskId: string) => {
    const task = plannerData.tasks[taskId];
    if (task) {
      setSelectedTaskForAssignment(task);
      setIsMemberAssignmentOpen(true);
    }
  };

  const handleMemberAssignment = (taskId: string, memberUid: string | null) => {
    assignMember(taskId, memberUid);
  };

  const getAssignedMemberInfo = (memberUid: string | undefined): { uid: string; firstName: string; lastName: string; color: string } | null => {
    if (!memberUid) return null;
    const member = owners.find(owner => owner.uid === memberUid);
    return member ? {
      uid: member.uid,
      firstName: member.firstName,
      lastName: member.lastName,
      color: member.color
    } : null;
  };

  // Timeframe creation handler
  const handleCreateTimeframe = (timeframeData: Omit<TimeframeColumn, 'id' | 'taskIds'>) => {
    createTimeframe(timeframeData);
  };

  // Task modal handlers
  const handleOpenTaskModal = (taskId: string) => {
    const task = plannerData.tasks[taskId];
    if (task) {
      setSelectedTaskForDetails(task);
      setIsTaskDetailsModalOpen(true);
    }
  };

  const handleOpenTaskEditModal = (taskId: string) => {
    const task = plannerData.tasks[taskId];
    if (task) {
      setSelectedTaskForModal(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleSwitchToEditModal = () => {
    if (selectedTaskForDetails) {
      setSelectedTaskForModal(selectedTaskForDetails);
      setIsTaskDetailsModalOpen(false);
      setIsTaskModalOpen(true);
    }
  };

  const handleUpdateTaskFromModal = async (taskId: string, updates: Partial<PlannerTask>) => {
    await updateTask(taskId, updates);
  };

  const handleDeleteTask = async (taskId: string) => {
    // Remove task from any timeframes first
    const updatedTimeframes = { ...plannerData.timeframes };
    Object.keys(updatedTimeframes).forEach(timeframeId => {
      const timeframe = updatedTimeframes[timeframeId];
      if (timeframe.taskIds.includes(taskId)) {
        timeframe.taskIds = timeframe.taskIds.filter(id => id !== taskId);
      }
    });

    // Update timeframes in Firebase
    await Promise.all(
      Object.values(updatedTimeframes).map(timeframe =>
        // We would need to add a deleteTask method to FirebasePlannerService
        // For now, we'll just update the task to mark it as deleted
        updateTask(taskId, { completed: true, status: 'completed' as any })
      )
    );
  };

  // Context menu handlers
  const handleMoveToTimeframe = async (taskId: string, timeframeId: string) => {
    // Use existing drag-and-drop logic to move task to new timeframe
    const task = plannerData.tasks[taskId];
    if (!task) return;

    // Find current timeframe that contains this task
    const currentTimeframeId = Object.keys(plannerData.timeframes).find(id => 
      plannerData.timeframes[id].taskIds.includes(taskId)
    );

    // Create a mock DropResult to reuse existing drag-and-drop logic
    const dragResult = {
      draggableId: taskId,
      type: 'TASK',
      source: {
        droppableId: currentTimeframeId || 'unassigned',
        index: currentTimeframeId ? plannerData.timeframes[currentTimeframeId].taskIds.indexOf(taskId) : 0
      },
      destination: {
        droppableId: timeframeId,
        index: plannerData.timeframes[timeframeId].taskIds.length
      }
    };

    await handleDragEnd(dragResult);
  };

  const handleDuplicateTask = async (taskId: string) => {
    const originalTask = plannerData.tasks[taskId];
    if (!originalTask) return;

    const duplicatedTask: PlannerTask = {
      ...originalTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${originalTask.title} (Copy)`,
      completed: false,
      subTasks: originalTask.subTasks.map(subTask => ({
        ...subTask,
        id: `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        completed: false
      })),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await updateTask(duplicatedTask.id, duplicatedTask);
  };

  if (plannerData.loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary dark:border-brand-accent mx-auto mb-4"></div>
          <p className="text-slate-700 dark:text-slate-300">Loading your move planner...</p>
        </div>
      </div>
    );
  }

  if (plannerData.error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Error Loading Planner
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {plannerData.error}
          </p>
          <Button onClick={firebaseInitializePlanner}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DragDropProvider
      plannerData={plannerData}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-brand-primary dark:text-brand-accent" />
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Move Planner
                      </h1>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Organize your moving timeline with drag-and-drop planning
                      </p>
                    </div>
                    
                    {/* Overall Progress Indicator */}
                    {(() => {
                      const progress = calculateOverallProgress();
                      return progress.total > 0 ? (
                        <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {Math.round(progress.percentage)}% Complete
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {progress.completed}/{progress.total} items done
                            </div>
                          </div>
                          <div className="w-16">
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  progress.percentage === 100 
                                    ? 'bg-green-500 dark:bg-green-400' 
                                    : 'bg-brand-primary dark:bg-brand-accent'
                                }`}
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSidebar}
                  leftIcon={plannerData.sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  className="min-h-[44px] touch-manipulation"
                >
                  <span className="hidden sm:inline">
                    {plannerData.sidebarCollapsed ? 'Show' : 'Hide'} Tasks
                  </span>
                  <span className="sm:hidden">
                    {plannerData.sidebarCollapsed ? 'Tasks' : 'Board'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Move Date Banner */}
        {!move?.moveDate && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <div className="px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      No move date set
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Set your move date in settings to enable timeline planning and automatic task scheduling.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/app/settings'}
                  leftIcon={<Settings className="w-4 h-4" />}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-300 dark:hover:bg-yellow-800/30"
                >
                  Set Date
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
          {/* Task Sidebar */}
          <TaskSidebar
            tasks={Object.values(plannerData.tasks)}
            isCollapsed={plannerData.sidebarCollapsed}
            assignedTaskIds={getAssignedTaskIds()}
            onToggleSubTasks={handleToggleSubTasks}
            onToggleCompletion={handleToggleCompletion}
            onToggleSubTaskCompletion={handleToggleSubTaskCompletion}
            onManageTags={handleManageTags}
            onAssignMember={handleAssignMember}
            onTaskClick={handleOpenTaskModal}
            onTaskEdit={handleOpenTaskEditModal}
            getAssignedMemberInfo={getAssignedMemberInfo}
            availableTimeframes={Object.values(plannerData.timeframes)}
            onMoveToTimeframe={handleMoveToTimeframe}
            onDuplicateTask={handleDuplicateTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* Planning Board */}
          <div className={`
            ${plannerData.sidebarCollapsed ? 'flex-1' : 'hidden md:flex-1'}
            overflow-x-auto bg-slate-50 dark:bg-slate-900
          `}>
            <div className="h-full p-2 md:p-4">
              <div className="flex space-x-2 md:space-x-4 h-full min-w-max">
                {/* Timeline Columns */}
                {plannerData.timeframeOrder.map(timeframeId => {
                  const timeframe = plannerData.timeframes[timeframeId];
                  if (!timeframe) return null;

                  return (
                    <TimeframeColumnComponent
                      key={timeframeId}
                      timeframe={timeframe}
                      tasks={getTasksForTimeframe(timeframeId)}
                      moveDate={move?.moveDate}
                      onToggleSubTasks={handleToggleSubTasks}
                      onToggleCompletion={handleToggleCompletion}
                      onToggleSubTaskCompletion={handleToggleSubTaskCompletion}
                      onManageTags={handleManageTags}
                      onAssignMember={handleAssignMember}
                      onTaskClick={handleOpenTaskModal}
                      onTaskEdit={handleOpenTaskEditModal}
                      getAssignedMemberInfo={getAssignedMemberInfo}
                      availableTimeframes={Object.values(plannerData.timeframes)}
                      onMoveToTimeframe={handleMoveToTimeframe}
                      onDuplicateTask={handleDuplicateTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  );
                })}

                {/* Add Another Timeframe Button */}
                <div className="w-72 md:w-80 flex-shrink-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsTimeframeCreatorOpen(true)}
                    className="h-32 w-full border-dashed border-2 border-slate-300 dark:border-slate-600 hover:border-brand-primary dark:hover:border-brand-accent"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-xs md:text-sm">Add timeframe</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tag Management Modals */}
        <TagManager
          isOpen={isTagManagerOpen}
          onClose={handleCloseTagManager}
          existingTags={availableTags}
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
          onUpdateTag={handleUpdateTag}
        />

        <TaskTagPicker
          isOpen={isTaskTagPickerOpen}
          onClose={() => {
            setIsTaskTagPickerOpen(false);
            setSelectedTaskForTags(null);
          }}
          task={selectedTaskForTags}
          availableTags={availableTags}
          onUpdateTaskTags={handleUpdateTaskTags}
          onOpenTagManager={handleOpenTagManager}
        />

        <MemberAssignmentPicker
          isOpen={isMemberAssignmentOpen}
          onClose={() => {
            setIsMemberAssignmentOpen(false);
            setSelectedTaskForAssignment(null);
          }}
          task={selectedTaskForAssignment}
          availableMembers={owners}
          onAssignMember={handleMemberAssignment}
        />

        <TimeframeCreator
          isOpen={isTimeframeCreatorOpen}
          onClose={() => setIsTimeframeCreatorOpen(false)}
          onCreateTimeframe={handleCreateTimeframe}
        />

        <TaskDetailsModal
          isOpen={isTaskDetailsModalOpen}
          onClose={() => {
            setIsTaskDetailsModalOpen(false);
            setSelectedTaskForDetails(null);
          }}
          task={selectedTaskForDetails}
          getAssignedMemberInfo={getAssignedMemberInfo}
          onEdit={handleSwitchToEditModal}
        />

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTaskForModal(null);
          }}
          task={selectedTaskForModal}
          onUpdateTask={handleUpdateTaskFromModal}
          onDeleteTask={handleDeleteTask}
          availableTags={availableTags}
          onCreateTag={handleAddTag}
          availableMembers={owners}
          getAssignedMemberInfo={getAssignedMemberInfo}
        />
      </div>
    </DragDropProvider>
  );
};

export default PlannerPage;