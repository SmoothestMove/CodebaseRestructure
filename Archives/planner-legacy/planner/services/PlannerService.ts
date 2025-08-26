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
   * Get comprehensive 83-task framework for moving planner
   */
  static getSampleTasks(): PlannerTask[] {
    const now = Date.now();
    
    // Default tag definitions
    const tags = {
      packingOrganizing: { id: 'tag-packing', label: 'Packing & Organizing', color: '#8B5CF6', type: 'custom' as const },
      logisticsTransportation: { id: 'tag-logistics', label: 'Logistics & Transportation', color: '#3B82F6', type: 'custom' as const },
      utilitiesServices: { id: 'tag-utilities', label: 'Utilities & Services', color: '#EF4444', type: 'custom' as const },
      cleaningMaintenance: { id: 'tag-cleaning', label: 'Cleaning & Maintenance', color: '#10B981', type: 'custom' as const },
      inventoryDocumentation: { id: 'tag-inventory', label: 'Inventory & Documentation', color: '#059669', type: 'custom' as const }
    };
    
    return [
      // App Setup & Initial Planning (10 tasks)
      {
        id: 'task-app-1', title: 'Get Comfortable with the App',
        description: 'Familiarize yourself with the moving app features and interface',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-app-2', title: 'Configure App Settings',
        description: 'Set up your preferences, notifications, and account settings',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-app-3', title: 'Assess Your DIY Move Capacity',
        description: 'Evaluate what you can handle yourself vs. what needs professional help',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-app-4', title: 'Define Spaces & Create Owners',
        description: 'Map out rooms and assign responsibility for packing each area',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-app-5', title: 'Generate & Test Your Move ID',
        description: 'Create a unique Move ID for collaboration and test sharing functionality',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-app-6', title: 'Invite & Onboard Helpers',
        description: 'Reach out to friends and family early to avoid schedule conflicts',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-app-7', title: 'Verify Scanning Functionality',
        description: 'Print QR labels and test scanning on all devices',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-app-8', title: 'Establish Comprehensive Moving Budget Framework',
        description: 'Use Financial Navigator to create detailed budget with categories',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [
          { id: 'subtask-budget-1', title: 'Choose from pre-built moving templates', completed: false, createdAt: now },
          { id: 'subtask-budget-2', title: 'Create custom expense categories', completed: false, createdAt: now },
          { id: 'subtask-budget-3', title: 'Set up automatic expense tracking', completed: false, createdAt: now }
        ], tags: [tags.inventoryDocumentation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      },
      {
        id: 'task-app-9', title: 'Set Up Backup & Recovery Plan',
        description: 'Plan for contingencies and backup helpers',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'low', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 9
      },
      {
        id: 'task-app-10', title: 'Create Moving Timeline Overview',
        description: 'Review all phases and adjust timeline to your specific needs',
        category: 'app-setup', originalCategory: 'App Setup & Initial Planning',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 10
      },
      
      // 8 Weeks: Plan, Purge & Well-Being (10 tasks)
      {
        id: 'task-8w-1', title: 'Address the Emotional Side of Moving',
        description: 'Have conversations about the move and manage moving stress',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [
          { id: 'subtask-8w1-1', title: 'Talk with family/children about changes', completed: false, createdAt: now },
          { id: 'subtask-8w1-2', title: 'Research stress management techniques', completed: false, createdAt: now }
        ], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-8w-2', title: 'Declutter Every Room',
        description: 'Go room by room: keep, donate, sell, or trash everything',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [
          { id: 'subtask-8w2-1', title: 'Master bedroom declutter', completed: false, createdAt: now },
          { id: 'subtask-8w2-2', title: 'Living areas declutter', completed: false, createdAt: now },
          { id: 'subtask-8w2-3', title: 'Kitchen and dining declutter', completed: false, createdAt: now },
          { id: 'subtask-8w2-4', title: 'Basement/attic/storage declutter', completed: false, createdAt: now },
          { id: 'subtask-8w2-5', title: 'Kids\' rooms declutter', completed: false, createdAt: now }
        ], tags: [tags.packingOrganizing], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-8w-3', title: 'Pay Up Bills & Debts',
        description: 'Review finances and settle remaining obligations for clean start',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-8w-4', title: 'Determine Required Truck Size',
        description: 'Use inventory to select appropriate truck size and logistics',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-8w-5', title: 'Research Rental Truck Companies',
        description: 'Compare U-Haul, Penske, Budget, Ryder, and Enterprise options',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-8w-6', title: 'Gather Quotes for Truck Rentals',
        description: 'Request detailed quotes including all fees for exact dates',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-8w-7', title: 'Begin Selling Items',
        description: 'Start selling valuable items you won\'t be taking',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-8w-8', title: 'Schedule Donation Pickups',
        description: 'Arrange charity pickups for items you\'re donating',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      },
      {
        id: 'task-8w-9', title: 'Research New Area',
        description: 'Learn about your new neighborhood, schools, and amenities',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'low', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 9
      },
      {
        id: 'task-8w-10', title: 'Schedule Moving Day Help',
        description: 'Confirm availability and duties with friends/family helpers',
        category: 'week-8', originalCategory: '8 Weeks: Plan, Purge & Well-Being',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 10
      },
      
      // 7 Weeks: Supplies & Equipment (6 tasks)
      {
        id: 'task-7w-1', title: 'Purchase Packing Materials',
        description: 'Buy boxes, tape, bubble wrap, packing paper, mattress bags',
        category: 'week-7', originalCategory: '7 Weeks: Supplies & Equipment',
        subTasks: [
          { id: 'subtask-7w1-1', title: 'Various sized moving boxes', completed: false, createdAt: now },
          { id: 'subtask-7w1-2', title: 'Packing tape and dispensers', completed: false, createdAt: now },
          { id: 'subtask-7w1-3', title: 'Bubble wrap and packing paper', completed: false, createdAt: now },
          { id: 'subtask-7w1-4', title: 'Mattress and furniture covers', completed: false, createdAt: now },
          { id: 'subtask-7w1-5', title: 'Labels and permanent markers', completed: false, createdAt: now }
        ], tags: [tags.packingOrganizing], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-7w-2', title: 'Source Free Boxes (Optional)',
        description: 'Check local stores and community groups for sturdy boxes',
        category: 'week-7', originalCategory: '7 Weeks: Supplies & Equipment',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'low', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-7w-3', title: 'Rent or Buy Moving Equipment',
        description: 'Secure dollies, hand truck, moving blankets, furniture sliders, straps',
        category: 'week-7', originalCategory: '7 Weeks: Supplies & Equipment',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-7w-4', title: 'Prep Your Packing Stations',
        description: 'Set up dedicated packing areas throughout your home',
        category: 'week-7', originalCategory: '7 Weeks: Supplies & Equipment',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-7w-5', title: 'Purchase Specialty Packing Supplies',
        description: 'Get wardrobe boxes, dish packs, and other specialty containers',
        category: 'week-7', originalCategory: '7 Weeks: Supplies & Equipment',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-7w-6', title: 'Test All Equipment',
        description: 'Ensure all moving equipment works properly before move day',
        category: 'week-7', originalCategory: '7 Weeks: Supplies & Equipment',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'low', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },

      // 6 Weeks: Logistics & Records (8 tasks)
      {
        id: 'task-6w-1', title: 'Reserve Moving Truck',
        description: 'Confirm truck rental reservation for your exact move date',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-6w-2', title: 'Obtain Medical Records',
        description: 'Get copies of medical records and prescription information',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-6w-3', title: 'Apply for Parking Permits',
        description: 'Secure parking permits and reserve elevator access',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-6w-4', title: 'Transfer School Records',
        description: 'Arrange school record transfers to new district',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-6w-5', title: 'Backup Digital Files',
        description: 'Create backup of important digital documents and photos',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-6w-6', title: 'Plan Route and Stops',
        description: 'Map out your moving day route including rest stops',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-6w-7', title: 'Arrange Pet Transportation',
        description: 'Plan safe transportation for pets during the move',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-6w-8', title: 'Organize Important Documents',
        description: 'Gather and organize all important papers in one secure location',
        category: 'week-6', originalCategory: '6 Weeks: Logistics & Records',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      },

      // 5 Weeks: Packing (8 tasks)
      {
        id: 'task-5w-1', title: 'Pack Non-Essential Belongings',
        description: 'Begin packing items you won\'t need in the next month',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [
          { id: 'subtask-5w1-1', title: 'Seasonal clothing and decorations', completed: false, createdAt: now },
          { id: 'subtask-5w1-2', title: 'Books, artwork, and collectibles', completed: false, createdAt: now },
          { id: 'subtask-5w1-3', title: 'Extra linens and towels', completed: false, createdAt: now }
        ], tags: [tags.packingOrganizing], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-5w-2', title: 'Create Detailed Inventory System',
        description: 'Document every packed box with comprehensive labeling',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-5w-3', title: 'Disassemble Large Furniture',
        description: 'Break down furniture that requires disassembly for transport',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-5w-4', title: 'Protect Valuable and Fragile Items',
        description: 'Develop strategy for safeguarding expensive and delicate belongings',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-5w-5', title: 'Plan Perishable Item Consumption',
        description: 'Use up food and other perishables before the move',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-5w-6', title: 'Pack Room by Room',
        description: 'Systematically pack each room with clear labeling',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-5w-7', title: 'Prepare "First Day" Boxes',
        description: 'Pack essential items you\'ll need immediately in your new home',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-5w-8', title: 'Label QR Codes for Tracking',
        description: 'Apply QR codes to boxes for digital tracking system',
        category: 'week-5', originalCategory: '5 Weeks: Packing',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      },

      // 4 Weeks: Admin & Appointments (10 tasks)
      {
        id: 'task-4w-1', title: 'File Change of Address with USPS',
        description: 'Submit official change of address form with postal service',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-4w-2', title: 'Update Address with Financial Institutions',
        description: 'Notify banks, credit cards, insurance companies of address change',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-4w-3', title: 'Schedule Utility Connections',
        description: 'Arrange electricity, gas, water, internet setup at new home',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-4w-4', title: 'Transfer or Cancel Memberships',
        description: 'Handle gym memberships, subscriptions, and local services',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-4w-5', title: 'Update Government Agencies',
        description: 'Notify IRS, DMV, voter registration, and other agencies',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-4w-6', title: 'Schedule Final Appointments',
        description: 'Book last appointments with local services (dentist, vet, etc.)',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-4w-7', title: 'Research New Service Providers',
        description: 'Find healthcare providers, schools, and services in new area',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-4w-8', title: 'Update Employer Information',
        description: 'Notify HR department and update payroll/tax information',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      },
      {
        id: 'task-4w-9', title: 'Set Up Mail Forwarding',
        description: 'Ensure important mail will be forwarded to new address',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 9
      },
      {
        id: 'task-4w-10', title: 'Update Online Accounts',
        description: 'Change address on shopping accounts, streaming services, etc.',
        category: 'week-4', originalCategory: '4 Weeks: Admin & Appointments',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 10
      },

      // 2-3 Weeks: Confirmations & Final Prep (8 tasks)
      {
        id: 'task-2w-1', title: 'Confirm All Reservations',
        description: 'Double-check truck rental, helpers, and moving day logistics',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-2w-2', title: 'Plan Travel Route',
        description: 'Finalize route and have vehicle serviced for the journey',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-2w-3', title: 'Finalize Furniture Placement Plan',
        description: 'Decide where furniture will go in your new home',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-2w-4', title: 'Pack "Essentials" Box',
        description: 'Prepare box with items needed immediately after move',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-2w-5', title: 'Dispose of Hazardous Materials',
        description: 'Properly dispose of paint, chemicals, and hazardous items',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.cleaningMaintenance], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-2w-6', title: 'Arrange Childcare for Moving Day',
        description: 'Plan care for children and pets during the move',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-2w-7', title: 'Prepare Moving Day Supplies',
        description: 'Gather cleaning supplies, snacks, first aid kit, and tools',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-2w-8', title: 'Coordinate Helper Assignments',
        description: 'Assign specific roles and responsibilities to each helper',
        category: 'week-2-3', originalCategory: '2-3 Weeks: Confirmations & Final Prep',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      },

      // 1 Week: Home Stretch (8 tasks)
      {
        id: 'task-1w-1', title: 'Pack All Remaining Items',
        description: 'Pack everything except absolute essentials for final days',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-1w-2', title: 'Deep Clean Current Residence',
        description: 'Thoroughly clean entire current home',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.cleaningMaintenance], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-1w-3', title: 'Finalize Plans with Helpers',
        description: 'Confirm time, roles, and logistics with all helpers',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-1w-4', title: 'Remove Wall Hangings',
        description: 'Take down pictures, mirrors, and wall decorations',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-1w-5', title: 'Complete Minor Repairs',
        description: 'Fix small holes, scratches, and maintenance issues',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.cleaningMaintenance], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-1w-6', title: 'Pack Cleaning Supplies',
        description: 'Prepare cleaning kit for both homes',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.cleaningMaintenance], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-1w-7', title: 'Confirm Utility Disconnections',
        description: 'Schedule final utility readings and disconnections',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-1w-8', title: 'Pack Survival Kit',
        description: 'Prepare essentials bag with toiletries, medications, clothes',
        category: 'week-1', originalCategory: '1 Week: Home Stretch',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      },

      // Day Before Move (5 tasks)
      {
        id: 'task-db-1', title: 'Defrost and Clean Refrigerator',
        description: 'Empty, defrost, and clean refrigerator and freezer',
        category: 'day-before', originalCategory: 'Day Before Move',
        subTasks: [], tags: [tags.cleaningMaintenance], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-db-2', title: 'Pack Last-Minute Items',
        description: 'Finish packing any remaining items',
        category: 'day-before', originalCategory: 'Day Before Move',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-db-3', title: 'Load Personal Vehicles',
        description: 'Pack your cars with valuable items and essentials',
        category: 'day-before', originalCategory: 'Day Before Move',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-db-4', title: 'Prepare for Early Start',
        description: 'Set alarms, lay out clothes, prepare snacks and drinks',
        category: 'day-before', originalCategory: 'Day Before Move',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-db-5', title: 'Final Walkthrough Preparation',
        description: 'Prepare camera and checklist for final walkthrough',
        category: 'day-before', originalCategory: 'Day Before Move',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },

      // Move Day (7 tasks)
      {
        id: 'task-md-1', title: 'Start Early with Proper Preparation',
        description: 'Get adequate rest and start early with appropriate clothing',
        category: 'move-day', originalCategory: 'Move Day',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-md-2', title: 'Pick Up Rental Truck',
        description: 'Complete thorough inspection and document any damage',
        category: 'move-day', originalCategory: 'Move Day',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-md-3', title: 'Load Truck with Strategic Placement',
        description: 'Load systematically for safe transport and easy unloading',
        category: 'move-day', originalCategory: 'Move Day',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-md-4', title: 'Complete Final Walkthrough',
        description: 'Document condition and check all areas before leaving',
        category: 'move-day', originalCategory: 'Move Day',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-md-5', title: 'Drive Safely to New Location',
        description: 'Take your time and drive carefully with the loaded truck',
        category: 'move-day', originalCategory: 'Move Day',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-md-6', title: 'Unload and Place Items',
        description: 'Systematically unload and place items in designated rooms',
        category: 'move-day', originalCategory: 'Move Day',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-md-7', title: 'Return Truck and Complete Move',
        description: 'Return rental truck and celebrate your successful move',
        category: 'move-day', originalCategory: 'Move Day',
        subTasks: [], tags: [tags.logisticsTransportation], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },

      // Post-Move (8 tasks)
      {
        id: 'task-pm-1', title: 'Verify All Utilities Function',
        description: 'Check that electricity, water, gas, internet all work properly',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'critical', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 1
      },
      {
        id: 'task-pm-2', title: 'Update Driver\'s License',
        description: 'Update license and vehicle registration in new state',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 2
      },
      {
        id: 'task-pm-3', title: 'Establish Healthcare Providers',
        description: 'Find and register with new doctors, dentists, veterinarians',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 3
      },
      {
        id: 'task-pm-4', title: 'Enroll Children in School',
        description: 'Complete school enrollment and registration process',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.utilitiesServices], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 4
      },
      {
        id: 'task-pm-5', title: 'Explore Neighborhood',
        description: 'Locate grocery stores, pharmacies, and essential services',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'medium', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 5
      },
      {
        id: 'task-pm-6', title: 'Connect with Community',
        description: 'Meet neighbors and explore local community groups',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'low', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 6
      },
      {
        id: 'task-pm-7', title: 'Unpack High-Priority Rooms',
        description: 'Focus on bedrooms, kitchen, and bathroom first',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.packingOrganizing], priority: 'high', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 7
      },
      {
        id: 'task-pm-8', title: 'Plan Housewarming Celebration',
        description: 'Organize gathering to celebrate your new home',
        category: 'post-move', originalCategory: 'Post-Move',
        subTasks: [], tags: [tags.inventoryDocumentation], priority: 'low', status: 'todo', completed: false, createdAt: now, updatedAt: now, order: 8
      }
    ];
  }
}