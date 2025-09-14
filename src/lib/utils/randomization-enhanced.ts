import { Box, ItemStatus, TRUCK_ZONES, VerticalPosition } from '@/types';
import { Expense, Category, Budget, MoveType } from '@/features/budget/types/types';
import { Task, Frame, Priority, TaskStatus, Label } from '@/features/planner-enhanced/lib/types';
import type { PersonalOwner, CommunalSpace, OwnerOrSpace } from '@/types/owners-spaces';

// Enhanced sample data with clear separation
const SAMPLE_PERSONAL_OWNERS: Omit<PersonalOwner, 'uid' | 'createdAt'>[] = [
  { type: 'person', firstName: 'John', lastName: 'Smith', color: '#3b82f6', initials: 'JS' },
  { type: 'person', firstName: 'Sarah', lastName: 'Johnson', color: '#ef4444', initials: 'SJ' },
  { type: 'person', firstName: 'Mike', lastName: 'Davis', color: '#10b981', initials: 'MD' },
  { type: 'person', firstName: 'Emily', lastName: 'Brown', color: '#f59e0b', initials: 'EB' },
  { type: 'person', firstName: 'David', lastName: 'Wilson', color: '#8b5cf6', initials: 'DW' },
  { type: 'person', firstName: 'Lisa', lastName: 'Taylor', color: '#ec4899', initials: 'LT' },
];

const SAMPLE_COMMUNAL_SPACES: Omit<CommunalSpace, 'uid' | 'createdAt'>[] = [
  { type: 'space', name: 'Kitchen', color: '#ff7e00', category: 'room' },
  { type: 'space', name: 'Living Room', color: '#22c55e', category: 'room' },
  { type: 'space', name: 'Master Bedroom', color: '#3b82f6', category: 'room' },
  { type: 'space', name: 'Guest Bedroom', color: '#8b5cf6', category: 'room' },
  { type: 'space', name: 'Bathroom', color: '#06b6d4', category: 'room' },
  { type: 'space', name: 'Garage', color: '#64748b', category: 'storage' },
  { type: 'space', name: 'Basement', color: '#7c3aed', category: 'storage' },
  { type: 'space', name: 'Office', color: '#0ea5e9', category: 'room' },
];

// Utility functions
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomId(prefix?: string): string {
  const id = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}${id}` : id;
}

// Enhanced entity generation
export function generateRandomPersonalOwner(): PersonalOwner {
  const template = randomChoice(SAMPLE_PERSONAL_OWNERS);
  return {
    ...template,
    uid: generateRandomId('PO_'),
    createdAt: Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000,
  };
}

export function generateRandomCommunalSpace(): CommunalSpace {
  const template = randomChoice(SAMPLE_COMMUNAL_SPACES);
  return {
    ...template,
    uid: generateRandomId('CS_'),
    createdAt: Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000,
  };
}

export function generateRandomOwnersAndSpaces(): {
  personalOwners: PersonalOwner[];
  communalSpaces: CommunalSpace[];
  combined: OwnerOrSpace[];
} {
  const ownerCount = randomInt(3, 6);
  const spaceCount = randomInt(4, 7);
  
  const personalOwners: PersonalOwner[] = [];
  const communalSpaces: CommunalSpace[] = [];
  
  // Generate unique personal owners
  const usedOwnerCombos = new Set<string>();
  while (personalOwners.length < ownerCount && usedOwnerCombos.size < SAMPLE_PERSONAL_OWNERS.length) {
    const owner = generateRandomPersonalOwner();
    const combo = `${owner.firstName}_${owner.lastName}`;
    if (!usedOwnerCombos.has(combo)) {
      usedOwnerCombos.add(combo);
      personalOwners.push(owner);
    }
  }
  
  // Generate unique communal spaces
  const usedSpaceNames = new Set<string>();
  while (communalSpaces.length < spaceCount && usedSpaceNames.size < SAMPLE_COMMUNAL_SPACES.length) {
    const space = generateRandomCommunalSpace();
    if (!usedSpaceNames.has(space.name)) {
      usedSpaceNames.add(space.name);
      communalSpaces.push(space);
    }
  }
  
  return {
    personalOwners,
    communalSpaces,
    combined: [...personalOwners, ...communalSpaces]
  };
}

// Enhanced box generation with proper owner/space assignment
export function generateRandomBoxWithOwnerOrSpace(entitiesData: {
  personalOwners: PersonalOwner[];
  communalSpaces: CommunalSpace[];
  combined: OwnerOrSpace[];
}): Box {
  const { combined } = entitiesData;
  const id = generateRandomId('BOX_');
  const assignedEntity = randomChoice(combined);
  const status = randomChoice(Object.values(ItemStatus).filter(s => s !== ItemStatus.UNKNOWN));
  
  // Generate context-appropriate box names based on assignment
  const getContextualBoxName = (entity: OwnerOrSpace): string => {
    if (entity.type === 'person') {
      const personalItems = [
        `${entity.firstName}'s Clothes`, `${entity.firstName}'s Books`, 
        `${entity.firstName}'s Personal Items`, `${entity.firstName}'s Office Supplies`
      ];
      return randomChoice(personalItems);
    } else {
      const spaceItems = [
        `${entity.name} Essentials`, `${entity.name} Items`, 
        `${entity.name} Storage`, `${entity.name} Supplies`
      ];
      return randomChoice(spaceItems);
    }
  };
  
  const getContextualContents = (entity: OwnerOrSpace): string => {
    if (entity.type === 'person') {
      const personalContents = [
        'Clothes, shoes, personal accessories',
        'Books, documents, personal files',
        'Electronics, chargers, personal devices',
        'Personal care items, medications'
      ];
      return randomChoice(personalContents);
    } else {
      const spaceContents: Record<string, string[]> = {
        'Kitchen': ['Dishes, cookware, utensils', 'Pantry items, spices', 'Small appliances'],
        'Living Room': ['Decorations, books', 'Electronics, remotes', 'Throw pillows, blankets'],
        'Bathroom': ['Towels, toiletries', 'Cleaning supplies', 'Personal care items'],
        'Garage': ['Tools, hardware', 'Sports equipment', 'Storage containers'],
        'Office': ['Office supplies, papers', 'Computer equipment', 'Filing materials']
      };
      
      const contents = spaceContents[entity.name] || ['Various household items', 'Storage containers', 'Miscellaneous items'];
      return randomChoice(contents);
    }
  };
  
  return {
    id,
    name: getContextualBoxName(assignedEntity),
    contents: getContextualContents(assignedEntity),
    qrCodeValue: id,
    currentStatus: status,
    currentLocation: assignedEntity.type === 'space' ? assignedEntity.name : `${assignedEntity.firstName}'s Room`,
    destinationRoom: assignedEntity.type === 'space' ? assignedEntity.name : 'Personal Room',
    ownerUid: assignedEntity.uid,
    history: [
      {
        timestamp: Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000,
        location: assignedEntity.type === 'space' ? assignedEntity.name : 'Personal Area',
        notes: 'Box created and assigned',
        statusChange: ItemStatus.PREPARED
      }
    ],
    createdAt: Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000,
    truckZone: status === ItemStatus.LOADED ? randomChoice([...TRUCK_ZONES]) : undefined,
    truckVerticalPosition: status === ItemStatus.LOADED ? randomChoice(['Bottom', 'Middle', 'Top'] as VerticalPosition[]) : undefined
  };
}

// Enhanced randomization functions with guaranteed distribution
export function randomizeBoxesWithSeparation(entitiesData: {
  personalOwners: PersonalOwner[];
  communalSpaces: CommunalSpace[];
  combined: OwnerOrSpace[];
}): Box[] {
  const { combined } = entitiesData;
  const totalCount = randomInt(12, 35); // Ensure enough boxes for distribution
  const boxes: Box[] = [];
  
  // First, ensure each owner/space gets at least 1-3 boxes
  const guaranteedBoxes: Box[] = [];
  (combined || []).forEach(entity => {
    const minBoxesPerEntity = randomInt(1, 3);
    for (let i = 0; i < minBoxesPerEntity; i++) {
      guaranteedBoxes.push(generateRandomBoxWithSpecificOwner(entity));
    }
  });
  
  // Then, randomly distribute remaining boxes
  const remainingCount = Math.max(0, totalCount - guaranteedBoxes.length);
  const additionalBoxes: Box[] = [];
  for (let i = 0; i < remainingCount; i++) {
    additionalBoxes.push(generateRandomBoxWithOwnerOrSpace(entitiesData));
  }
  
  // Combine and shuffle
  boxes.push(...guaranteedBoxes, ...additionalBoxes);
  
  // Shuffle the array to randomize order
  for (let i = boxes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
  }
  
  return boxes;
}

// Helper function to generate box for specific owner/space
function generateRandomBoxWithSpecificOwner(assignedEntity: OwnerOrSpace): Box {
  const id = generateRandomId('BOX_');
  const status = randomChoice(Object.values(ItemStatus).filter(s => s !== ItemStatus.UNKNOWN));
  
  // Generate context-appropriate box names based on assignment
  const getContextualBoxName = (entity: OwnerOrSpace): string => {
    if (entity.type === 'person') {
      const personalItems = [
        `${entity.firstName}'s Clothes`, `${entity.firstName}'s Books`, 
        `${entity.firstName}'s Personal Items`, `${entity.firstName}'s Office Supplies`
      ];
      return randomChoice(personalItems);
    } else {
      const spaceItems = [
        `${entity.name} Essentials`, `${entity.name} Items`, 
        `${entity.name} Storage`, `${entity.name} Supplies`
      ];
      return randomChoice(spaceItems);
    }
  };
  
  const getContextualContents = (entity: OwnerOrSpace): string => {
    if (entity.type === 'person') {
      const personalContents = [
        'Clothes, shoes, personal accessories',
        'Books, documents, personal files',
        'Electronics, chargers, personal devices',
        'Personal care items, medications'
      ];
      return randomChoice(personalContents);
    } else {
      const spaceContents: Record<string, string[]> = {
        'Kitchen': ['Dishes, cookware, utensils', 'Pantry items, spices', 'Small appliances'],
        'Living Room': ['Decorations, books', 'Electronics, remotes', 'Throw pillows, blankets'],
        'Bathroom': ['Towels, toiletries', 'Cleaning supplies', 'Personal care items'],
        'Garage': ['Tools, hardware', 'Sports equipment', 'Storage containers'],
        'Office': ['Office supplies, papers', 'Computer equipment', 'Filing materials']
      };
      
      const contents = spaceContents[entity.name] || ['Various household items', 'Storage containers', 'Miscellaneous items'];
      return randomChoice(contents);
    }
  };
  
  return {
    id,
    name: getContextualBoxName(assignedEntity),
    contents: getContextualContents(assignedEntity),
    qrCodeValue: id,
    currentStatus: status,
    currentLocation: assignedEntity.type === 'space' ? assignedEntity.name : `${assignedEntity.firstName}'s Room`,
    destinationRoom: assignedEntity.type === 'space' ? assignedEntity.name : 'Personal Room',
    ownerUid: assignedEntity.uid,
    history: [
      {
        timestamp: Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000,
        location: assignedEntity.type === 'space' ? assignedEntity.name : 'Personal Area',
        notes: 'Box created and assigned',
        statusChange: ItemStatus.PREPARED
      }
    ],
    createdAt: Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000,
    truckZone: status === ItemStatus.LOADED ? randomChoice([...TRUCK_ZONES]) : undefined,
    truckVerticalPosition: status === ItemStatus.LOADED ? randomChoice(['Bottom', 'Middle', 'Top'] as VerticalPosition[]) : undefined
  };
}

// Budget and planner functions remain the same as original
export function generateRandomExpense(categories: Category[]): Expense {
  const category = randomChoice(categories);
  const merchants = ['U-Haul', 'Home Depot', 'Moving Company Inc', 'Walmart', 'Amazon', 'Lowe\'s'];
  
  return {
    id: generateRandomId('EXP_'),
    categoryId: category.id,
    amount: randomFloat(10, 500),
    date: new Date(Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: randomChoice(merchants),
    description: `Moving expense from ${randomChoice(merchants)}`,
  };
}

export function generateRandomCategory(): Category {
  const categories = [
    { name: 'Moving Services', icon: 'truck' },
    { name: 'Packing Supplies', icon: 'box' },
    { name: 'Storage', icon: 'warehouse' },
    { name: 'Travel & Transport', icon: 'car' },
    { name: 'Utilities Setup', icon: 'zap' },
    { name: 'Cleaning', icon: 'spray-can' }
  ];
  
  const category = randomChoice(categories);
  
  return {
    id: generateRandomId('CAT_'),
    name: category.name,
    estimatedAmount: randomFloat(100, 2000),
    color: randomChoice(['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']),
    icon: category.icon,
    deletable: true
  };
}

export function randomizeBudgetData(): { expenses: Expense[], categories: Category[], budget: Budget } {
  const categories = Array.from({ length: randomInt(4, 8) }, () => generateRandomCategory());
  const expenses = Array.from({ length: randomInt(10, 30) }, () => generateRandomExpense(categories));
  
  const budget: Budget = {
    totalEstimatedAmount: randomFloat(2000, 8000),
    moveType: randomChoice([MoveType.LOCAL, MoveType.CROSS_STATE])
  };
  
  return { expenses, categories, budget };
}

// Planner functions (same as original)
export function generateRandomLabel(): Label {
  const labelNames = ['Urgent', 'Important', 'Optional', 'Fragile', 'Heavy', 'Personal', 'Work'];
  return {
    id: generateRandomId('LBL_'),
    name: randomChoice(labelNames),
    color: randomChoice(['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'])
  };
}

export function generateRandomTask(frames: Frame[], labels: Label[]): Task {
  const taskTitles = [
    'Pack kitchen essentials', 'Organize moving truck', 'Label all boxes',
    'Coordinate with movers', 'Transfer utilities', 'Change address notifications'
  ];
  const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
  const statuses: TaskStatus[] = ['not-started', 'in-progress', 'completed', 'todo'];
  
  return {
    id: generateRandomId('TSK_'),
    title: randomChoice(taskTitles),
    description: 'Auto-generated task for testing purposes',
    completed: Math.random() < 0.3,
    frameId: frames.length > 0 ? randomChoice(frames).id : undefined,
    priority: randomChoice(priorities),
    status: randomChoice(statuses),
    effort: randomInt(1, 8),
    labels: Math.random() < 0.4 ? [randomChoice(labels)] : undefined,
    dueDate: Math.random() < 0.6 ? new Date(Date.now() + randomInt(1, 30) * 24 * 60 * 60 * 1000) : undefined,
    createdAt: new Date(Date.now() - randomInt(1, 14) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - randomInt(0, 3) * 24 * 60 * 60 * 1000)
  };
}

export function generateRandomFrame(): Frame {
  const frameNames = ['Pre-Move', 'Moving Day', 'Post-Move', 'Settling In', 'Administrative'];
  
  return {
    id: generateRandomId('FRM_'),
    title: randomChoice(frameNames),
    color: randomChoice(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']),
    offsetStart: randomInt(0, 30),
    offsetEnd: randomInt(31, 90),
    description: `Tasks related to moving activities`
  };
}

export function randomizePlannerData(): { tasks: Task[], frames: Frame[], labels: Label[] } {
  const labels = Array.from({ length: randomInt(3, 7) }, () => generateRandomLabel());
  const frames = Array.from({ length: randomInt(3, 6) }, () => generateRandomFrame());
  const tasks = Array.from({ length: randomInt(8, 20) }, () => generateRandomTask(frames, labels));
  
  return { tasks, frames, labels };
}

// Enhanced main randomization function with proper separation
export interface EnhancedRandomizedData {
  personalOwners: PersonalOwner[];
  communalSpaces: CommunalSpace[];
  boxes: Box[];
  budget: { expenses: Expense[], categories: Category[], budget: Budget };
  planner: { tasks: Task[], frames: Frame[], labels: Label[] };
}

export function generateEnhancedRandomizedMoveData(): EnhancedRandomizedData {
  const entitiesData = generateRandomOwnersAndSpaces();
  
  return {
    personalOwners: entitiesData.personalOwners,
    communalSpaces: entitiesData.communalSpaces,
    boxes: randomizeBoxesWithSeparation(entitiesData),
    budget: randomizeBudgetData(),
    planner: randomizePlannerData()
  };
}