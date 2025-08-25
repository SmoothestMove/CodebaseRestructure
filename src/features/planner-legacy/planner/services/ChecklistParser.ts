// Service for parsing MovePlannerChecklist.md into structured data
import { PlannerTask, TimeframeColumn, ChecklistCategory, CHECKLIST_CATEGORIES } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface ParsedChecklistData {
  tasks: Record<string, PlannerTask>;
  timeframes: Record<string, TimeframeColumn>;
  timeframeOrder: string[];
}

export class ChecklistParser {
  
  /**
   * Parse the MovePlannerChecklist.md content into structured planner data
   */
  static parseChecklistContent(checklistContent: string): ParsedChecklistData {
    const tasks: Record<string, PlannerTask> = {};
    const timeframes: Record<string, TimeframeColumn> = {};
    const timeframeOrder: string[] = [];

    // Split content into sections based on ## headers
    const sections = this.splitIntoSections(checklistContent);
    
    let orderIndex = 0;
    for (const section of sections) {
      if (section.header && section.content) {
        const categoryId = this.getCategoryId(section.header);
        const categoryTitle = this.getCategoryTitle(section.header);
        
        if (categoryId && categoryTitle) {
          // Create timeframe column
          const timeframeId = uuidv4();
          const timeframe: TimeframeColumn = {
            id: timeframeId,
            title: categoryTitle,
            description: this.extractDescription(section.content),
            taskIds: [],
            isDefault: true,
            order: orderIndex++,
            createdAt: Date.now()
          };
          
          // Parse tasks from this section
          const sectionTasks = this.parseTasksFromSection(section.content, categoryId, categoryTitle);
          
          // Add tasks to the tasks collection and update timeframe taskIds
          for (const task of sectionTasks) {
            tasks[task.id] = task;
            timeframe.taskIds.push(task.id);
          }
          
          timeframes[timeframeId] = timeframe;
          timeframeOrder.push(timeframeId);
        }
      }
    }

    return {
      tasks,
      timeframes,
      timeframeOrder
    };
  }

  /**
   * Split content into sections based on ## headers
   */
  private static splitIntoSections(content: string) {
    const lines = content.split('\n');
    const sections: Array<{ header: string; content: string }> = [];
    let currentSection: { header: string; content: string[] } | null = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          sections.push({
            header: currentSection.header,
            content: currentSection.content.join('\n')
          });
        }
        
        // Start new section
        currentSection = {
          header: line.replace('## ', '').trim(),
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }

    // Don't forget the last section
    if (currentSection) {
      sections.push({
        header: currentSection.header,
        content: currentSection.content.join('\n')
      });
    }

    return sections;
  }

  /**
   * Map section header to category ID
   */
  private static getCategoryId(header: string): ChecklistCategory | null {
    const normalizedHeader = header.toLowerCase();
    
    if (normalizedHeader.includes('app setup') || normalizedHeader.includes('initial planning')) {
      return 'app-setup';
    } else if (normalizedHeader.includes('8 weeks')) {
      return '8-weeks-out';
    } else if (normalizedHeader.includes('7 weeks')) {
      return '7-weeks-out';
    } else if (normalizedHeader.includes('6 weeks')) {
      return '6-weeks-out';
    } else if (normalizedHeader.includes('5 weeks')) {
      return '5-weeks-out';
    } else if (normalizedHeader.includes('4 weeks')) {
      return '4-weeks-out';
    } else if (normalizedHeader.includes('2-3 weeks') || normalizedHeader.includes('2 weeks') || normalizedHeader.includes('3 weeks')) {
      return '2-3-weeks-out';
    } else if (normalizedHeader.includes('1 week')) {
      return '1-week-out';
    } else if (normalizedHeader.includes('move day')) {
      return 'move-day';
    } else if (normalizedHeader.includes('post-move') || normalizedHeader.includes('settling')) {
      return 'post-move';
    }
    
    return null;
  }

  /**
   * Get category title from header
   */
  private static getCategoryTitle(header: string): string | null {
    const categoryId = this.getCategoryId(header);
    return categoryId ? CHECKLIST_CATEGORIES[categoryId] : null;
  }

  /**
   * Extract description from section content (first paragraph)
   */
  private static extractDescription(content: string): string {
    const lines = content.split('\n').filter(line => line.trim());
    const firstParagraph = lines.find(line => 
      !line.startsWith('#') && 
      !line.startsWith('*') && 
      !line.startsWith('-') && 
      line.trim().length > 10
    );
    return firstParagraph?.trim() || '';
  }

  /**
   * Parse individual tasks from a section
   */
  private static parseTasksFromSection(content: string, categoryId: string, categoryTitle: string): PlannerTask[] {
    const tasks: PlannerTask[] = [];
    const lines = content.split('\n');
    
    let currentTask: Partial<PlannerTask> | null = null;
    let taskOrder = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this is a main task (### header)
      if (trimmedLine.startsWith('### ')) {
        // Save previous task if exists
        if (currentTask && currentTask.title) {
          tasks.push(this.createTaskFromPartial(currentTask, categoryId, categoryTitle, taskOrder++));
        }
        
        // Start new task
        const title = trimmedLine.replace('### ', '').replace(/\*\*/g, '').trim();
        currentTask = {
          title,
          subTasks: [],
          tags: [],
          description: ''
        };
      }
      // Check if this is a sub-task or description
      else if (currentTask && trimmedLine) {
        if (trimmedLine.startsWith('Set up') || 
            trimmedLine.startsWith('Configure') || 
            trimmedLine.startsWith('Add') ||
            trimmedLine.startsWith('Create') ||
            trimmedLine.startsWith('Implement') ||
            trimmedLine.startsWith('Schedule') ||
            trimmedLine.startsWith('Review') ||
            trimmedLine.startsWith('Update')) {
          // This looks like a sub-task
          currentTask.subTasks = currentTask.subTasks || [];
          currentTask.subTasks.push({
            id: uuidv4(),
            title: trimmedLine,
            completed: false,
            createdAt: Date.now()
          });
        } else if (!currentTask.description && trimmedLine.length > 10) {
          // This looks like a description
          currentTask.description = trimmedLine;
        }
      }
    }

    // Don't forget the last task
    if (currentTask && currentTask.title) {
      tasks.push(this.createTaskFromPartial(currentTask, categoryId, categoryTitle, taskOrder));
    }

    return tasks;
  }

  /**
   * Create a complete PlannerTask from partial data
   */
  private static createTaskFromPartial(
    partial: Partial<PlannerTask>, 
    categoryId: string, 
    categoryTitle: string, 
    order: number
  ): PlannerTask {
    const now = Date.now();
    
    return {
      id: uuidv4(),
      title: partial.title || 'Untitled Task',
      description: partial.description || '',
      category: categoryId,
      originalCategory: categoryTitle,
      subTasks: partial.subTasks || [],
      tags: [
        // Add default category tag
        {
          id: uuidv4(),
          label: categoryTitle,
          color: '#6B7280',
          type: 'category'
        },
        // Add default priority tag
        {
          id: uuidv4(),
          label: 'Medium',
          color: '#F59E0B',
          type: 'priority'
        },
        // Add default status tag
        {
          id: uuidv4(),
          label: 'To-Do',
          color: '#6B7280',
          type: 'status'
        }
      ],
      priority: 'medium',
      status: 'todo',
      completed: false,
      createdAt: now,
      updatedAt: now,
      order
    };
  }

  /**
   * Get default timeframe data without parsing file
   */
  static getDefaultTimeframes(): { timeframes: Record<string, TimeframeColumn>; timeframeOrder: string[] } {
    const timeframes: Record<string, TimeframeColumn> = {};
    const timeframeOrder: string[] = [];
    
    let order = 0;
    for (const [categoryId, categoryTitle] of Object.entries(CHECKLIST_CATEGORIES)) {
      const timeframeId = uuidv4();
      timeframes[timeframeId] = {
        id: timeframeId,
        title: categoryTitle,
        taskIds: [],
        isDefault: true,
        order: order++,
        createdAt: Date.now()
      };
      timeframeOrder.push(timeframeId);
    }

    return { timeframes, timeframeOrder };
  }
}