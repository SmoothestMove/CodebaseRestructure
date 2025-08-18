// Service for managing planner data and integrating with checklist
import { ChecklistParser, ParsedChecklistData } from './ChecklistParser';
import { PlannerTask, TimeframeColumn, PlannerState, DEFAULT_TIMEFRAMES } from '../types';

export class PlannerService {
  
  /**
   * Load and parse the MovePlannerChecklist.md file
   */
  static async loadChecklistData(): Promise<ParsedChecklistData> {
    try {
      // In a real implementation, we would fetch this from a file or API
      // For now, we'll simulate loading from the actual checklist content
      const checklistContent = await this.fetchChecklistContent();
      return ChecklistParser.parseChecklistContent(checklistContent);
    } catch (error) {
      console.error('Error loading checklist data:', error);
      // Fallback to default timeframes
      const { timeframes, timeframeOrder } = ChecklistParser.getDefaultTimeframes();
      return {
        tasks: {},
        timeframes,
        timeframeOrder
      };
    }
  }

  /**
   * Initialize planner state with default timeframes and sample tasks
   */
  static async initializePlanner(): Promise<PlannerState> {
    const { timeframes, timeframeOrder } = this.getDefaultTimeframes();
    const sampleTasks = this.getSampleTasks();
    
    // Create tasks map
    const tasks: Record<string, PlannerTask> = {};
    sampleTasks.forEach(task => {
      tasks[task.id] = task;
    });
    
    return {
      tasks,
      timeframes,
      timeframeOrder,
      sidebarCollapsed: false,
      loading: false,
      error: null,
      lastUpdated: Date.now()
    };
  }

  /**
   * Get default timeframes based on design specification
   */
  static getDefaultTimeframes(): { timeframes: Record<string, TimeframeColumn>; timeframeOrder: string[] } {
    const timeframes: Record<string, TimeframeColumn> = {};
    const timeframeOrder: string[] = [];
    
    Object.entries(DEFAULT_TIMEFRAMES).forEach(([id, config]) => {
      const timeframe: TimeframeColumn = {
        id,
        title: config.title,
        description: config.description,
        color: config.color,
        taskIds: [],
        isDefault: true,
        order: config.order,
        dateOffset: config.dateOffset,
        dateRange: config.dateRange,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      timeframes[id] = timeframe;
      timeframeOrder.push(id);
    });

    // Sort by order
    timeframeOrder.sort((a, b) => {
      const aOrder = timeframes[a]?.order || 0;
      const bOrder = timeframes[b]?.order || 0;
      return aOrder - bOrder;
    });

    return { timeframes, timeframeOrder };
  }

  /**
   * Fetch checklist content - in a real app this would be from a file or API
   * For now, we'll return the structured content directly
   */
  private static async fetchChecklistContent(): Promise<string> {
    // This is the actual content from MovePlannerChecklist.md
    return `
## App Setup & Initial Planning

### Get Comfortable with the App
Take time to explore the app's layout, features, and navigation.

### Configure App Settings
Set up owners/spaces, utilizing color coding for better organization. Configure your personal preferences for notifications and scanning.

### Assess Your DIY Move Capacity
Before committing, assess your move based on distance, amount of belongings, available help, and your physical capabilities to ensure a self-move is right for you.

### Define Spaces & Create Owners
Organize your move by adding rooms to the Spaces page as needed and create Owners to start creating labels and tracking your belongings.

### Generate & Test Your Move ID
Locate your MoveID and share it with anyone collaborating on the move. Ensure each member is correctly placed in the intended move.

### Invite & Onboard Helpers
Reach out to friends and family early to avoid schedule conflicts. Send invitations and your MoveID to get your team ready to go.

### Verify Scanning Functionality
Print out initial batches of QR labels for each Owner and Space and test everyone's devices to ensure their cameras and the scanning feature are working properly.

### Establish Your Moving Budget
Use the app's Financial Navigator/Budget feature. Whether you digitize an existing budget or create a new one, choose from pre-built moving templates or create custom categories to track expenses.

## 8 Weeks Out: Planning, Purging & Well-being

### Address the Emotional Side of Moving
Have a talk with your child or children about the move to discuss the changes and calm any fears. Take time to acknowledge and face the common fears of moving and learn ways to handle the stress.

### Declutter Every Room
Go room by room and sort all items into four categories: keep, donate, sell, or trash. A good rule is to get rid of anything unused for 12+ months.

### Pay Up Bills & Debts
Review your finances and settle any remaining home bills or financial obligations for a clean financial start.

### Determine Required Truck Size
Use your home inventory to select the appropriate truck size, considering logistics like mileage limits and ramp height.

### Research Rental Truck Companies
Compare rates, availability, and policies for companies like U-Haul, Penske, Budget, Ryder, and Enterprise.

### Gather Quotes for Truck Rentals
Request detailed quotes for your exact move dates, ensuring they include the base rate, mileage fees, and any add-on costs.

## 7 Weeks Out: Supplies and Equipment

### Purchase Packing Materials
Buy boxes, tape, bubble wrap, packing paper, and mattress bags. Be generous with padding materials, especially when packing fragile items.

### Source Free Boxes (Optional)
Check with local stores, community groups, or friends for sturdy, clean boxes to reduce supply costs.

### Rent or Buy Moving Equipment
Secure dollies, a hand truck, moving blankets, furniture sliders, and straps.

## Move Day: Hour-by-Hour Guide

### Get a Good Night's Sleep & Start Early
Go to bed early the night before and wake up early on moving day to have extra time.

### Pick Up the Truck
Perform a detailed inspection of the truck. Take photos of any pre-existing damage and verify the fuel level before leaving the lot.

### Load the Truck Correctly
Begin by loading labeled moving boxes first, followed by large furniture pieces, and then the heaviest household appliances last. Distribute weight evenly.

## Post-Move: Settling In

### First 72 Hours
Check utilities, perform safety checks, and unpack high-priority rooms.

### First 2 Weeks
Update registrations and address, establish healthcare and schooling, secure your new home.

### First Month & Beyond
Explore and connect with your new community, consider organizing a housewarming party.
`;
  }

  /**
   * Get sample tasks for demonstration (until we have full parsing)
   */
  static getSampleTasks(): PlannerTask[] {
    const now = Date.now();
    
    return [
      {
        id: 'task-1',
        title: 'Configure App Settings',
        description: 'Set up owners/spaces with color coding and configure preferences for notifications',
        category: 'app-setup',
        originalCategory: 'App Setup & Initial Planning',
        subTasks: [
          {
            id: 'subtask-1',
            title: 'Set up owners/spaces with color coding',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-2', 
            title: 'Configure preferences for notifications',
            completed: false,
            createdAt: now
          }
        ],
        tags: [
          {
            id: 'tag-1',
            label: 'Application',
            color: '#3B82F6',
            type: 'custom'
          },
          {
            id: 'tag-2',
            label: 'High Priority',
            color: '#EF4444', 
            type: 'priority'
          },
          {
            id: 'tag-3',
            label: 'To-Do',
            color: '#6B7280',
            type: 'status'
          }
        ],
        priority: 'high',
        status: 'todo',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 0
      },
      {
        id: 'task-2',
        title: 'Establish Your Moving Budget',
        description: 'Use the Financial Navigator to create or digitize your moving budget',
        category: 'app-setup', 
        originalCategory: 'App Setup & Initial Planning',
        subTasks: [
          {
            id: 'subtask-3',
            title: 'Choose from pre-built moving templates',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-4',
            title: 'Create custom categories to track expenses',
            completed: false,
            createdAt: now
          }
        ],
        tags: [
          {
            id: 'tag-4',
            label: 'Budget',
            color: '#10B981',
            type: 'custom'
          },
          {
            id: 'tag-5',
            label: 'Medium Priority',
            color: '#F59E0B',
            type: 'priority'
          },
          {
            id: 'tag-6',
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
        order: 1
      },
      {
        id: 'task-3',
        title: 'Declutter Every Room',
        description: 'Sort all items into categories: keep, donate, sell, or trash',
        category: 'week-8',
        originalCategory: '8 Weeks: Planning, Purging & Well-being',
        subTasks: [],
        tags: [
          {
            id: 'tag-7',
            label: 'Organization',
            color: '#8B5CF6',
            type: 'custom'
          },
          {
            id: 'tag-8',
            label: 'High Priority',
            color: '#EF4444',
            type: 'priority'
          },
          {
            id: 'tag-9',
            label: 'To-Do',
            color: '#6B7280',
            type: 'status'
          }
        ],
        priority: 'high',
        status: 'todo',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 0
      },
      {
        id: 'task-4',
        title: 'Purchase Packing Materials',
        description: 'Buy boxes, tape, bubble wrap, packing paper, and mattress bags',
        category: 'week-7',
        originalCategory: '7 Weeks: Supplies & Equipment', 
        subTasks: [],
        tags: [
          {
            id: 'tag-10',
            label: 'Supplies',
            color: '#F59E0B',
            type: 'custom'
          },
          {
            id: 'tag-11',
            label: 'Medium Priority',
            color: '#F59E0B',
            type: 'priority'
          },
          {
            id: 'tag-12',
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
        order: 0
      },
      {
        id: 'task-5',
        title: 'Pick Up the Truck',
        description: 'Perform detailed inspection and verify fuel level',
        category: 'move-day',
        originalCategory: 'Move Day',
        subTasks: [
          {
            id: 'subtask-5',
            title: 'Take photos of any pre-existing damage',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-6',
            title: 'Verify the fuel level before leaving',
            completed: false,
            createdAt: now
          }
        ],
        tags: [
          {
            id: 'tag-13',
            label: 'Move Day',
            color: '#DC2626',
            type: 'custom'
          },
          {
            id: 'tag-14',
            label: 'Critical',
            color: '#DC2626',
            type: 'priority'
          },
          {
            id: 'tag-15',
            label: 'To-Do',
            color: '#6B7280',
            type: 'status'
          }
        ],
        priority: 'critical',
        status: 'todo',
        completed: false,
        createdAt: now,
        updatedAt: now,
        order: 0
      }
    ];
  }
}