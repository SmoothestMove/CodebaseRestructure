import { useState, useEffect, useCallback } from 'react';
import { FirebasePlannerService } from '../services/FirebasePlannerService';
import { PlannerService } from '../services/PlannerService';
import { PlannerState, PlannerTask, TimeframeColumn, calculateTaskDates } from '../types';

interface UseFirebasePlannerReturn {
  plannerData: PlannerState;
  updateTask: (taskId: string, updates: Partial<PlannerTask>) => Promise<void>;
  updateTaskTags: (taskId: string, tags: import('../types').TaskTag[]) => Promise<void>;
  assignMember: (taskId: string, memberUid: string | null) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  toggleSubTaskCompletion: (taskId: string, subTaskId: string) => Promise<void>;
  createTimeframe: (timeframeData: Omit<TimeframeColumn, 'id' | 'taskIds'>) => Promise<void>;
  deleteTimeframe: (timeframeId: string) => Promise<void>;
  handleDragEnd: (result: import('@hello-pangea/dnd').DropResult) => Promise<void>;
  toggleSidebar: () => Promise<void>;
  initializePlanner: () => Promise<void>;
}

export const useFirebasePlanner = (moveId: string | null, moveDate?: Date | null): UseFirebasePlannerReturn => {
  const [plannerData, setPlannerData] = useState<PlannerState>({
    tasks: {},
    timeframes: {},
    timeframeOrder: [],
    sidebarCollapsed: false,
    loading: true,
    error: null,
    lastUpdated: Date.now()
  });

  // Initialize planner data
  const initializePlanner = useCallback(async () => {
    if (!moveId) return;

    try {
      setPlannerData(prev => ({ ...prev, loading: true, error: null }));

      // Check if planner is already initialized
      const isInitialized = await FirebasePlannerService.isPlannerInitialized(moveId);
      
      if (!isInitialized) {
        // Initialize with default data
        const initialState = await PlannerService.initializePlanner();
        const sampleTasks = PlannerService.getSampleTasks();
        const timeframes = Object.values(initialState.timeframes);

        await FirebasePlannerService.initializePlanner(moveId, sampleTasks, timeframes);
      }

      setPlannerData(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error initializing planner:', error);
      setPlannerData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize planner'
      }));
    }
  }, [moveId]);

  // Set up real-time listeners
  useEffect(() => {
    if (!moveId) {
      setPlannerData({
        tasks: {},
        timeframes: {},
        timeframeOrder: [],
        sidebarCollapsed: false,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      });
      return;
    }

    const unsubscribeTasks = FirebasePlannerService.subscribeToTasks(moveId, (tasks) => {
      setPlannerData(prev => ({
        ...prev,
        tasks,
        lastUpdated: Date.now()
      }));
    });

    const unsubscribeTimeframes = FirebasePlannerService.subscribeToTimeframes(moveId, (timeframes, order) => {
      setPlannerData(prev => ({
        ...prev,
        timeframes,
        timeframeOrder: order,
        lastUpdated: Date.now()
      }));
    });

    const unsubscribeConfig = FirebasePlannerService.subscribeToConfig(moveId, (config) => {
      setPlannerData(prev => ({
        ...prev,
        sidebarCollapsed: config.sidebarCollapsed,
        lastUpdated: Date.now()
      }));
    });

    return () => {
      unsubscribeTasks();
      unsubscribeTimeframes();
      unsubscribeConfig();
    };
  }, [moveId]);

  // Task operations
  const updateTask = useCallback(async (taskId: string, updates: Partial<PlannerTask>) => {
    if (!moveId) return;
    
    const currentTask = plannerData.tasks[taskId];
    if (!currentTask) return;

    const updatedTask = { ...currentTask, ...updates, updatedAt: Date.now() };
    await FirebasePlannerService.saveTask(moveId, updatedTask);
  }, [moveId, plannerData.tasks]);

  const updateTaskTags = useCallback(async (taskId: string, tags: import('../types').TaskTag[]) => {
    await updateTask(taskId, { tags });
  }, [updateTask]);

  const assignMember = useCallback(async (taskId: string, memberUid: string | null) => {
    await updateTask(taskId, { assignedMember: memberUid || undefined });
  }, [updateTask]);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    const task = plannerData.tasks[taskId];
    if (!task) return;

    await updateTask(taskId, { completed: !task.completed });
  }, [plannerData.tasks, updateTask]);

  const toggleSubTaskCompletion = useCallback(async (taskId: string, subTaskId: string) => {
    const task = plannerData.tasks[taskId];
    if (!task) return;

    const updatedSubTasks = task.subTasks.map(subTask =>
      subTask.id === subTaskId
        ? { ...subTask, completed: !subTask.completed }
        : subTask
    );

    // Auto-complete main task if all sub-tasks are completed
    const allSubTasksCompleted = updatedSubTasks.length > 0 && updatedSubTasks.every(st => st.completed);

    await updateTask(taskId, {
      subTasks: updatedSubTasks,
      completed: allSubTasksCompleted
    });
  }, [plannerData.tasks, updateTask]);

  // Timeframe operations
  const createTimeframe = useCallback(async (timeframeData: Omit<TimeframeColumn, 'id' | 'taskIds'>) => {
    if (!moveId) return;

    const newTimeframeId = `timeframe-${Date.now()}`;
    const newTimeframe: TimeframeColumn = {
      id: newTimeframeId,
      title: timeframeData.title,
      description: timeframeData.description,
      color: timeframeData.color,
      order: timeframeData.order,
      taskIds: []
    };

    await FirebasePlannerService.saveTimeframe(moveId, newTimeframe);
  }, [moveId]);

  const deleteTimeframe = useCallback(async (timeframeId: string) => {
    if (!moveId) return;

    // Move all tasks back to unassigned before deleting timeframe
    const timeframe = plannerData.timeframes[timeframeId];
    if (timeframe && timeframe.taskIds.length > 0) {
      const updates = timeframe.taskIds.map((taskId, index) => ({
        taskId,
        order: index
      }));
      await FirebasePlannerService.updateTaskAssignments(moveId, updates);
    }

    await FirebasePlannerService.deleteTimeframe(moveId, timeframeId);
  }, [moveId, plannerData.timeframes]);

  // Drag and drop handler
  const handleDragEnd = useCallback(async (result: import('@hello-pangea/dnd').DropResult) => {
    if (!moveId) return;

    const { destination, source, draggableId } = result;

    // Dropped outside of any droppable area
    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const task = plannerData.tasks[draggableId];
    if (!task) return;

    try {
      // Handle moving from sidebar to timeframe
      if (source.droppableId === 'sidebar' && destination.droppableId !== 'sidebar') {
        const destinationTimeframe = plannerData.timeframes[destination.droppableId];
        if (destinationTimeframe) {
          const newTaskIds = [...destinationTimeframe.taskIds];
          newTaskIds.splice(destination.index, 0, draggableId);
          
          // Calculate automatic dates for the task
          const { startDate, dueDate } = calculateTaskDates(moveDate, destinationTimeframe);
          
          // Update task with new dates (only if not manually overridden)
          const updatedTask = { 
            ...task,
            startDate: task.startDate || startDate,
            dueDate: task.dueDate || dueDate,
            updatedAt: Date.now()
          };
          
          // Update both timeframe and task
          await Promise.all([
            FirebasePlannerService.saveTimeframe(moveId, {
              ...destinationTimeframe,
              taskIds: newTaskIds
            }),
            FirebasePlannerService.saveTask(moveId, updatedTask)
          ]);
        }
      }
      // Handle moving between timeframes
      else if (source.droppableId !== 'sidebar' && destination.droppableId !== 'sidebar') {
        const sourceTimeframe = plannerData.timeframes[source.droppableId];
        const destinationTimeframe = plannerData.timeframes[destination.droppableId];
        
        if (sourceTimeframe && destinationTimeframe) {
          // Remove from source
          const newSourceTaskIds = [...sourceTimeframe.taskIds];
          newSourceTaskIds.splice(source.index, 1);
          
          // Add to destination
          const newDestinationTaskIds = [...destinationTimeframe.taskIds];
          newDestinationTaskIds.splice(destination.index, 0, draggableId);
          
          const operations = [
            FirebasePlannerService.saveTimeframe(moveId, {
              ...sourceTimeframe,
              taskIds: newSourceTaskIds
            })
          ];
          
          // If moving to different timeframe, update destination and task dates
          if (source.droppableId !== destination.droppableId) {
            // Calculate new dates for the destination timeframe
            const { startDate, dueDate } = calculateTaskDates(moveDate, destinationTimeframe);
            
            // Update task with new dates (only if not manually overridden)
            const updatedTask = { 
              ...task,
              startDate: task.startDate || startDate,
              dueDate: task.dueDate || dueDate,
              updatedAt: Date.now()
            };
            
            operations.push(
              FirebasePlannerService.saveTimeframe(moveId, {
                ...destinationTimeframe,
                taskIds: newDestinationTaskIds
              }),
              FirebasePlannerService.saveTask(moveId, updatedTask)
            );
          } else {
            // Just reordering within same timeframe
            operations.push(
              FirebasePlannerService.saveTimeframe(moveId, {
                ...destinationTimeframe,
                taskIds: newDestinationTaskIds
              })
            );
          }
          
          await Promise.all(operations);
        }
      }
      // Handle reordering within the same timeframe
      else if (source.droppableId === destination.droppableId && source.droppableId !== 'sidebar') {
        const timeframe = plannerData.timeframes[source.droppableId];
        if (timeframe) {
          const newTaskIds = [...timeframe.taskIds];
          newTaskIds.splice(source.index, 1);
          newTaskIds.splice(destination.index, 0, draggableId);
          
          await FirebasePlannerService.saveTimeframe(moveId, {
            ...timeframe,
            taskIds: newTaskIds
          });
        }
      }
    } catch (error) {
      console.error('Error handling drag end:', error);
      setPlannerData(prev => ({
        ...prev,
        error: 'Failed to update task position'
      }));
    }
  }, [moveId, plannerData.tasks, plannerData.timeframes]);

  // UI state operations
  const toggleSidebar = useCallback(async () => {
    if (!moveId) return;

    await FirebasePlannerService.updateConfig(moveId, {
      sidebarCollapsed: !plannerData.sidebarCollapsed
    });
  }, [moveId, plannerData.sidebarCollapsed]);

  return {
    plannerData,
    updateTask,
    updateTaskTags,
    assignMember,
    toggleTaskCompletion,
    toggleSubTaskCompletion,
    createTimeframe,
    deleteTimeframe,
    handleDragEnd,
    toggleSidebar,
    initializePlanner
  };
};