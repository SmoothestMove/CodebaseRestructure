import { Box, ItemStatus, Owner, TRUCK_ZONES, VerticalPosition } from '@/types';
import { Expense, Category, Budget, MoveType } from '@/features/budget/types/types';
import { Task, Frame, Priority, TaskStatus, Label } from '@/features/planner-enhanced/lib/types';

// Sample data for randomization
const SAMPLE_BOX_NAMES = [
  'Kitchen Essentials', 'Living Room Books', 'Bedroom Linens', 'Office Supplies',
  'Bathroom Toiletries', 'Dining Room China', 'Garage Tools', 'Kids Toys',
  'Master Closet', 'Guest Room Items', 'Pantry Food', 'Electronics',
  'Art & Decorations', 'Winter Clothes', 'Summer Clothes', 'Sports Equipment',
  'Board Games', 'Cleaning Supplies', 'Holiday Decorations', 'Photo Albums'
];

const SAMPLE_CONTENTS = [
  'Dishes, pots, pans, utensils', 'Books, magazines, reading materials',
  'Sheets, pillows, blankets', 'Papers, pens, computer accessories',
  'Towels, toiletries, medications', 'Fine china, glassware, serving dishes',
  'Tools, hardware, paint supplies', 'Toys, games, stuffed animals',
  'Clothes, shoes, accessories', 'Spare bedding, furniture', 
  'Canned goods, spices, snacks', 'Cables, chargers, devices',
  'Paintings, frames, vases', 'Coats, sweaters, boots',
  'T-shirts, shorts, sandals', 'Balls, equipment, gear'
];

const SAMPLE_LOCATIONS = [
  'Kitchen', 'Living Room', 'Master Bedroom', 'Guest Bedroom', 'Bathroom',
  'Office', 'Garage', 'Basement', 'Attic', 'Dining Room', 'Pantry', 'Closet'
];

const SAMPLE_TASK_TITLES = [
  'Pack kitchen essentials', 'Organize moving truck', 'Label all boxes',
  'Coordinate with movers', 'Transfer utilities', 'Change address notifications',
  'Pack fragile items carefully', 'Prepare first-day box', 'Clean old home',
  'Set up new home basics', 'Inventory valuable items', 'Arrange pet care',
  'Pack personal documents', 'Backup computer files', 'Arrange childcare'
];

const SAMPLE_DESCRIPTIONS = [
  'Carefully pack dishes and cookware', 'Schedule and coordinate moving logistics',
  'Create clear labeling system', 'Confirm arrival times and contact info',
  'Set up electricity, water, internet', 'Update banks, employers, subscriptions',
  'Use bubble wrap and padding', 'Pack essentials for first night',
  'Deep clean before leaving', 'Unpack critical items first'
];

const SAMPLE_EXPENSE_MERCHANTS = [
  'U-Haul', 'Home Depot', 'Moving Company Inc', 'Walmart', 'Amazon',
  'Lowe\'s', 'Target', 'Office Depot', 'Best Buy', 'IKEA', 'UPS Store'
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

function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function generateRandomColor(): string {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
  return randomChoice(colors);
}

// Box randomization
export function generateRandomBox(owners: Owner[]): Box {
  const id = generateRandomId();
  const owner = owners.length > 0 ? randomChoice(owners) : null;
  const status = randomChoice(Object.values(ItemStatus).filter(s => s !== ItemStatus.UNKNOWN));
  
  return {
    id,
    name: randomChoice(SAMPLE_BOX_NAMES),
    contents: randomChoice(SAMPLE_CONTENTS),
    qrCodeValue: id,
    currentStatus: status,
    currentLocation: randomChoice(SAMPLE_LOCATIONS),
    destinationRoom: randomChoice(SAMPLE_LOCATIONS),
    ownerUid: owner?.uid,
    history: [
      {
        timestamp: Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000, // Random date within last 30 days
        location: randomChoice(SAMPLE_LOCATIONS),
        notes: 'Box created',
        statusChange: ItemStatus.PREPARED
      }
    ],
    createdAt: Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000,
    truckZone: status === ItemStatus.LOADED ? randomChoice([...TRUCK_ZONES]) : undefined,
    truckVerticalPosition: status === ItemStatus.LOADED ? randomChoice(['Bottom', 'Middle', 'Top'] as VerticalPosition[]) : undefined
  };
}

export function randomizeBoxes(_currentBoxes: Box[], owners: Owner[]): Box[] {
  const count = randomInt(5, 25);
  const randomizedBoxes: Box[] = [];
  
  for (let i = 0; i < count; i++) {
    randomizedBoxes.push(generateRandomBox(owners));
  }
  
  return randomizedBoxes;
}

// Budget randomization
export function generateRandomExpense(categories: Category[]): Expense {
  const category = randomChoice(categories);
  
  return {
    id: generateRandomId(),
    categoryId: category.id,
    amount: randomFloat(10, 500),
    date: new Date(Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: randomChoice(SAMPLE_EXPENSE_MERCHANTS),
    description: `Moving expense from ${randomChoice(SAMPLE_EXPENSE_MERCHANTS)}`,
  };
}

export function generateRandomCategory(): Category {
  const categories = [
    { name: 'Moving Services', icon: 'truck' },
    { name: 'Packing Supplies', icon: 'box' },
    { name: 'Storage', icon: 'warehouse' },
    { name: 'Travel & Transport', icon: 'car' },
    { name: 'Utilities Setup', icon: 'zap' },
    { name: 'Cleaning', icon: 'spray-can' },
    { name: 'Food & Dining', icon: 'utensils' },
    { name: 'Home Improvements', icon: 'hammer' }
  ];
  
  const category = randomChoice(categories);
  
  return {
    id: generateRandomId(),
    name: category.name,
    estimatedAmount: randomFloat(100, 2000),
    color: generateRandomColor(),
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

// Planner randomization
export function generateRandomLabel(): Label {
  const labelNames = ['Urgent', 'Important', 'Optional', 'Fragile', 'Heavy', 'Personal', 'Work'];
  return {
    id: generateRandomId(),
    name: randomChoice(labelNames),
    color: generateRandomColor()
  };
}

export function generateRandomTask(frames: Frame[], labels: Label[]): Task {
  const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
  const statuses: TaskStatus[] = ['not-started', 'in-progress', 'completed', 'todo'];
  
  return {
    id: generateRandomId(),
    title: randomChoice(SAMPLE_TASK_TITLES),
    description: randomChoice(SAMPLE_DESCRIPTIONS),
    completed: Math.random() < 0.3, // 30% chance completed
    frameId: frames.length > 0 ? randomChoice(frames).id : undefined,
    priority: randomChoice(priorities),
    status: randomChoice(statuses),
    effort: randomInt(1, 8),
    labels: Math.random() < 0.4 ? [randomChoice(labels)] : undefined,
    dueDate: Math.random() < 0.6 ? new Date(Date.now() + randomInt(1, 30) * 24 * 60 * 60 * 1000) : undefined,
    startDate: Math.random() < 0.4 ? new Date(Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000) : undefined,
    checklist: Math.random() < 0.3 ? Array.from({ length: randomInt(2, 5) }, () => ({
      id: generateRandomId(),
      text: randomChoice(['Gather supplies', 'Make phone calls', 'Schedule appointment', 'Pack items']),
      completed: Math.random() < 0.4
    })) : undefined,
    createdAt: new Date(Date.now() - randomInt(1, 14) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - randomInt(0, 3) * 24 * 60 * 60 * 1000)
  };
}

export function generateRandomFrame(): Frame {
  const frameNames = ['Pre-Move', 'Moving Day', 'Post-Move', 'Settling In', 'Administrative'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  return {
    id: generateRandomId(),
    title: randomChoice(frameNames),
    color: randomChoice(colors),
    offsetStart: randomInt(0, 30),
    offsetEnd: randomInt(31, 90),
    description: `Tasks related to ${randomChoice(frameNames).toLowerCase()} activities`
  };
}

export function randomizePlannerData(): { tasks: Task[], frames: Frame[], labels: Label[] } {
  const labels = Array.from({ length: randomInt(3, 7) }, () => generateRandomLabel());
  const frames = Array.from({ length: randomInt(3, 6) }, () => generateRandomFrame());
  const tasks = Array.from({ length: randomInt(8, 20) }, () => generateRandomTask(frames, labels));
  
  return { tasks, frames, labels };
}

// Main randomization function
export interface RandomizedData {
  boxes: Box[];
  budget: { expenses: Expense[], categories: Category[], budget: Budget };
  planner: { tasks: Task[], frames: Frame[], labels: Label[] };
}

export function generateRandomizedMoveData(owners: Owner[]): RandomizedData {
  return {
    boxes: randomizeBoxes([], owners),
    budget: randomizeBudgetData(),
    planner: randomizePlannerData()
  };
}