import React, { useState, useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { List, Search, Filter, X, ChevronDown } from 'lucide-react';
import { PlannerTask, PriorityLevel, TaskStatus, TimeframeColumn } from '../types';
import TaskCard from './TaskCard';
import Button from '@/components/common/Button';

interface TaskSidebarProps {
  tasks: PlannerTask[];
  isCollapsed: boolean;
  assignedTaskIds?: Set<string>; // Set of task IDs that are assigned to timeframes
  onToggleSubTasks?: (taskId: string) => void;
  onToggleCompletion?: (taskId: string) => void;
  onToggleSubTaskCompletion?: (taskId: string, subTaskId: string) => void;
  onManageTags?: (taskId: string) => void;
  onAssignMember?: (taskId: string) => void;
  onTaskClick?: (taskId: string) => void; // For Task Details Modal (read-only)
  onTaskEdit?: (taskId: string) => void; // For Task Edit Modal
  getAssignedMemberInfo?: (memberUid: string | undefined) => { uid: string; firstName: string; lastName: string; color: string } | null;
  
  // Context menu props
  availableTimeframes?: TimeframeColumn[];
  onMoveToTimeframe?: (taskId: string, timeframeId: string) => void;
  onDuplicateTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

interface FilterState {
  priority: PriorityLevel | 'all';
  status: TaskStatus | 'all';
  category: string | 'all';
  completed: 'all' | 'completed' | 'incomplete';
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  tasks,
  isCollapsed,
  assignedTaskIds = new Set(),
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priority: 'all',
    status: 'all',
    category: 'all',
    completed: 'all'
  });

  // Get unique categories for filtering
  const uniqueCategories = useMemo(() => {
    const categories = new Set(tasks.map(task => task.originalCategory));
    return Array.from(categories).sort();
  }, [tasks]);

  // Filter and search tasks (only show unassigned tasks but include assigned ones with strikethrough)
  const filteredTasks = useMemo(() => {
    // Show all tasks in sidebar, but make assigned ones appear as strikethrough
    let filtered = tasks;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.originalCategory.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.label.toLowerCase().includes(searchLower)) ||
        task.subTasks.some(subTask => subTask.title.toLowerCase().includes(searchLower))
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.originalCategory === filters.category);
    }

    // Completion filter
    if (filters.completed !== 'all') {
      filtered = filtered.filter(task => 
        filters.completed === 'completed' ? task.completed : !task.completed
      );
    }

    return filtered;
  }, [tasks, searchTerm, filters]);

  const hasActiveFilters = useMemo(() => {
    return searchTerm.trim() !== '' || 
           filters.priority !== 'all' || 
           filters.status !== 'all' || 
           filters.category !== 'all' || 
           filters.completed !== 'all';
  }, [searchTerm, filters]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      priority: 'all',
      status: 'all',
      category: 'all',
      completed: 'all'
    });
  };

  return (
    <div className={`
      ${isCollapsed ? 'w-0 md:w-0' : 'w-full md:w-80'}
      ${isCollapsed ? 'md:block' : 'md:block'}
      transition-all duration-300 ease-in-out
      bg-white dark:bg-slate-800/95 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700/50
      overflow-hidden shadow-lg dark:shadow-slate-900/25
      ${!isCollapsed ? 'block md:block' : 'hidden md:block'}
    `}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <List className="w-5 h-5 text-brand-primary dark:text-brand-accent" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Task List
              </h2>
            </div>
            <div className="text-lg font-bold text-slate-500 dark:text-slate-400">
              {filteredTasks.length}
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Drag tasks to timeline frames to organize your move
          </p>
          
          {/* Search Input */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600/50 rounded-lg 
                         bg-white dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 
                         placeholder:text-slate-400 dark:placeholder:text-slate-500
                         focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary 
                         dark:focus:border-brand-accent dark:focus:ring-brand-accent/20
                         transition-colors duration-200"
              />
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex-1 text-xs ${hasActiveFilters ? 'border-brand-primary text-brand-primary dark:border-brand-accent dark:text-brand-accent' : ''}`}
                leftIcon={<Filter className="w-3 h-3" />}
                rightIcon={<ChevronDown className={`w-3 h-3 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />}
              >
                Filters {hasActiveFilters && `(${Object.values(filters).filter(f => f !== 'all').length + (searchTerm ? 1 : 0)})`}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="ml-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-3 animate-in slide-in-from-top-1 duration-200">
                {/* Priority Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as PriorityLevel | 'all' }))}
                    className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Completion Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.completed}
                    onChange={(e) => setFilters(prev => ({ ...prev, completed: e.target.value as 'all' | 'completed' | 'incomplete' }))}
                    className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="all">All Tasks</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Task List */}
        <div className="flex-1 overflow-y-auto">
          <Droppable droppableId="sidebar" type="TASK" isDropDisabled={true}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4"
              >
                {filteredTasks.length > 0 ? (
                  <div className="space-y-2">
                    {/* Results summary */}
                    {hasActiveFilters && (
                      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Showing {filteredTasks.length} of {tasks.length} tasks
                        </p>
                      </div>
                    )}
                    
                    {filteredTasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        isInSidebar={true}
                        isAssigned={assignedTaskIds.has(task.id)}
                        onToggleSubTasks={onToggleSubTasks}
                        onToggleCompletion={onToggleCompletion}
                        onToggleSubTaskCompletion={onToggleSubTaskCompletion}
                        onManageTags={onManageTags}
                        onAssignMember={onAssignMember}
                        onTaskClick={onTaskClick}
                        onTaskEdit={onTaskEdit}
                        assignedMemberInfo={getAssignedMemberInfo?.(task.assignedMember)}
                        availableTimeframes={availableTimeframes}
                        currentTimeframeId={undefined} // Sidebar tasks are not in a specific timeframe
                        onMoveToTimeframe={onMoveToTimeframe}
                        onDuplicateTask={onDuplicateTask}
                        onDeleteTask={onDeleteTask}
                      />
                    ))}
                  </div>
                ) : hasActiveFilters ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks match your filters</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="mt-2 text-xs"
                    >
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">All tasks assigned</p>
                    <p className="text-xs mt-1">Great progress!</p>
                  </div>
                )}
                
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        
        {/* Footer Stats */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between mb-1">
              <span>{hasActiveFilters ? 'Filtered tasks:' : 'Available tasks:'}</span>
              <span className="font-medium">{filteredTasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total tasks:</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            {hasActiveFilters && (
              <div className="flex justify-between mt-1 pt-1 border-t border-slate-300 dark:border-slate-600">
                <span>Active filters:</span>
                <span className="font-medium">
                  {Object.values(filters).filter(f => f !== 'all').length + (searchTerm ? 1 : 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSidebar;