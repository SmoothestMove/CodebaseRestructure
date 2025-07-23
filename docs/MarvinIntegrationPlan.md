# MARVIN Integration Plan - Smooth Moves

## Executive Summary

This document outlines the comprehensive integration plan for MARVIN AI assistant across all existing features in the Smooth Moves application. MARVIN is already partially integrated with calendar functionality and can be extended to provide intelligent assistance for budget management, inventory tracking, box management, and owner/space administration.

## Current State Analysis

### ✅ Already Integrated
- **Calendar Management**: Full CRUD operations for calendar events
- **Basic Navigation**: Route navigation between app sections
- **Checklist Management**: Create and manage moving checklists
- **Voice Interaction**: Wake word detection and text-to-speech

### 🔄 Partially Integrated
- **Inventory Tracking**: Basic box counting available but limited box management
- **Team Management**: Basic team member data available but no management actions

### ❌ Not Integrated
- **Budget Management**: Complete Financial Navigator integration missing
- **Advanced Box Operations**: QR scanning, status updates, truck loading
- **Owner/Space Management**: No integration with owners/spaces system

## Priority Integration Roadmap

### Phase 1: Budget Integration (High Priority)
**Estimated Effort**: 4-6 hours

The budget feature (Financial Navigator) is completely separate from MARVIN but offers the highest value integration opportunity.

#### Current Budget Architecture
- **Location**: `src/features/budget/`
- **State Management**: Custom `usePersistentReducer` with localStorage
- **Data Types**: `Expense`, `Category`, `Budget` interfaces
- **Storage**: Client-side only (localStorage)

#### Integration Strategy

1. **Add Budget Actions to MARVIN Types** (`src/features/marvin/types/marvin.ts`):
```typescript
// New budget-related actions
export interface AddExpenseAction {
  action: 'add_expense';
  expense: {
    categoryId: string;
    amount: number;
    merchantName: string;
    description: string;
    date?: string; // Optional, defaults to today
  };
}

export interface CreateBudgetCategoryAction {
  action: 'create_budget_category';
  category: {
    name: string;
    estimatedAmount: number;
    color?: string;
    icon?: string;
  };
}

export interface QueryBudgetAction {
  action: 'query_budget';
  query: {
    type: 'summary' | 'by_category' | 'recent_expenses' | 'overspent_categories';
    categoryId?: string;
    dateRange?: {
      start: string; // YYYY-MM-DD
      end: string; // YYYY-MM-DD
    };
  };
}

// Add to AiAction union type
export type AiAction = 
  | CreateChecklistAction 
  | CreateCalendarEventAction 
  | UpdateCalendarEventAction
  | DeleteCalendarEventAction
  | QueryCalendarAction
  | NavigateAction
  | AddExpenseAction           // New
  | CreateBudgetCategoryAction // New
  | QueryBudgetAction;         // New
```

2. **Extend AppData Interface** to include budget data:
```typescript
export interface AppData {
  // ... existing properties
  budget: {
    totalEstimatedAmount: number;
    totalSpent: number;
    categories: Array<{
      id: string;
      name: string;
      estimatedAmount: number;
      spentAmount: number;
      color: string;
    }>;
    recentExpenses: Array<{
      id: string;
      categoryName: string;
      amount: number;
      merchantName: string;
      description: string;
      date: string;
    }>;
    overspentCategories: string[]; // Category IDs that are over budget
  };
}
```

3. **Update Data Adapter** (`src/features/marvin/adapters/dataAdapter.ts`):
```typescript
// Add budget parameter and budget data transformation
export const createMarvinAppData = (
  boxes: Box[], 
  owners: Owner[], 
  checklist: ChecklistItem[], 
  events: CalendarEvent[],
  budgetData: { categories: Category[], expenses: Expense[], budget: Budget } // New parameter
): AppData => {
  // ... existing code

  // Transform budget data for MARVIN
  const budget = {
    totalEstimatedAmount: budgetData.budget.totalEstimatedAmount,
    totalSpent: budgetData.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    categories: budgetData.categories.map(category => {
      const categoryExpenses = budgetData.expenses.filter(e => e.categoryId === category.id);
      const spentAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        id: category.id,
        name: category.name,
        estimatedAmount: category.estimatedAmount,
        spentAmount,
        color: category.color
      };
    }),
    recentExpenses: budgetData.expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(expense => {
        const category = budgetData.categories.find(c => c.id === expense.categoryId);
        return {
          id: expense.id,
          categoryName: category?.name || 'Unknown',
          amount: expense.amount,
          merchantName: expense.merchantName,
          description: expense.description,
          date: expense.date
        };
      }),
    overspentCategories: budgetData.categories
      .filter(category => {
        const spent = budgetData.expenses
          .filter(e => e.categoryId === category.id)
          .reduce((sum, expense) => sum + expense.amount, 0);
        return spent > category.estimatedAmount;
      })
      .map(category => category.id)
  };

  return {
    // ... existing properties
    budget
  };
};
```

4. **Update System Instruction** (`src/features/marvin/services/geminiService.ts`):
```typescript
// Add budget context and rules
const systemInstruction = `
You are MARVIN, an expert AI moving assistant...

**Current App State:**
- Budget: ${JSON.stringify(appData.budget, null, 2)}
- Calendar: ${JSON.stringify(appData.calendar, null, 2)}
// ... other data

**Available Actions:**

5. **Manage Budget & Expenses:** For budget-related requests:
   - To add an expense: {"action": "add_expense", "expense": {"categoryId": "string", "amount": number, "merchantName": "string", "description": "string", "date": "YYYY-MM-DD"}}
   - To create a budget category: {"action": "create_budget_category", "category": {"name": "string", "estimatedAmount": number, "color": "#hexcolor", "icon": "icon-name"}}
   - To query budget information: {"action": "query_budget", "query": {"type": "summary|by_category|recent_expenses|overspent_categories", "categoryId": "optional", "dateRange": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}}}

6. **Budget Analysis Guidance:**
   - Proactively alert users about overspent categories
   - Suggest budget optimizations based on spending patterns
   - Remind users to track receipts and categorize expenses
   - Provide cost-saving tips for moving expenses
`;
```

5. **Create Budget Hook for MARVIN** (`src/features/budget/hooks/useMarvinBudget.ts`):
```typescript
import { useBudget } from './useBudget';
import { AddExpenseAction, CreateBudgetCategoryAction, QueryBudgetAction } from '@/features/marvin/types';

export const useMarvinBudget = () => {
  const { state, dispatch, categories, expenses } = useBudget();

  const handleAddExpense = async (action: AddExpenseAction) => {
    try {
      const newExpense = {
        ...action.expense,
        id: `exp-${Date.now()}`,
        date: action.expense.date || new Date().toISOString().split('T')[0]
      };
      
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      
      return {
        success: true,
        message: `Added expense: $${action.expense.amount} for ${action.expense.description}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add expense: ${error.message}`
      };
    }
  };

  const handleCreateBudgetCategory = async (action: CreateBudgetCategoryAction) => {
    // Implementation for creating budget categories
  };

  const handleQueryBudget = async (action: QueryBudgetAction) => {
    // Implementation for querying budget data
  };

  return {
    handleAddExpense,
    handleCreateBudgetCategory,
    handleQueryBudget,
    budgetData: { categories, expenses, budget: state.budget }
  };
};
```

6. **Update MarvinPage** to include budget integration:
```typescript
// Add budget hooks and data
const { budgetData, handleAddExpense, handleCreateBudgetCategory, handleQueryBudget } = useMarvinBudget();

// Update appData creation
const appData = createMarvinAppData(boxes, owners, [], events, budgetData);

// Add budget action handler
const handleBudgetAction = async (action: AddExpenseAction | CreateBudgetCategoryAction | QueryBudgetAction) => {
  // Route to appropriate handler based on action type
};
```

#### Expected User Interactions
- "Add a $50 expense for moving boxes to supplies"
- "How much have I spent on movers so far?"
- "Show me my budget summary"
- "Create a new category for storage costs with $200 budget"
- "What categories am I overspending on?"

### Phase 2: Advanced Box Management (Medium Priority)
**Estimated Effort**: 6-8 hours

#### Current Box Architecture
- **Location**: `src/features/boxes/`
- **State Management**: Firebase integration with real-time updates
- **Key Features**: QR scanning, status tracking, truck loading
- **Data Types**: `Box`, `ItemStatus`, `TruckZone` interfaces

#### Integration Strategy

1. **Add Box Management Actions**:
```typescript
export interface UpdateBoxStatusAction {
  action: 'update_box_status';
  boxId: string;
  newStatus: ItemStatus;
  location?: string;
  notes?: string;
}

export interface QueryBoxesAction {
  action: 'query_boxes';
  query: {
    status?: ItemStatus;
    owner?: string;
    location?: string;
    room?: string;
  };
}

export interface UpdateBoxLocationAction {
  action: 'update_box_location';
  boxId: string;
  truckZone?: TruckZone;
  verticalPosition?: VerticalPosition;
  currentLocation?: string;
}
```

2. **Enhance AppData with detailed box information**
3. **Create useMarvinBoxes hook**
4. **Update system instruction with box management capabilities**

#### Expected User Interactions
- "Mark box JD01 as packed"
- "Show me all boxes that are still being packed"
- "Move box SM03 to the middle-left section of the truck"
- "What boxes belong to Sarah in the kitchen?"

### Phase 3: Owner/Space Management (Low Priority)
**Estimated Effort**: 3-4 hours

#### Integration Strategy
1. **Add Owner Management Actions** for creating/updating owners and spaces
2. **Extend AppData** with owner/space information
3. **Create useMarvinOwners hook**
4. **Update system instruction** with owner management capabilities

#### Expected User Interactions
- "Create a new owner named Mike with blue color"
- "Assign box JD05 to the living room"
- "Show me all of Sarah's boxes"

## Implementation Guidelines

### Development Approach
1. **Feature-by-Feature Integration**: Implement one feature at a time
2. **Backward Compatibility**: Ensure existing MARVIN functionality remains intact
3. **Type Safety**: Maintain strict TypeScript typing throughout
4. **Error Handling**: Implement comprehensive error handling for all actions
5. **Testing Strategy**: Test each integration with various voice/text commands

### Code Quality Standards
- Follow existing architectural patterns
- Maintain separation of concerns between features
- Use existing hooks and state management patterns
- Implement proper error boundaries and user feedback

### Performance Considerations
- **Data Optimization**: Only include necessary data in AppData to minimize context size
- **Lazy Loading**: Consider lazy loading of large datasets
- **Caching**: Implement appropriate caching for frequently accessed data
- **Real-time Updates**: Ensure MARVIN receives real-time updates from Firebase

## Advanced Integration Opportunities

### Cross-Feature Intelligence
Once basic integrations are complete, MARVIN can provide intelligent insights across features:

1. **Budget-Calendar Integration**:
   - "Remind me to pay the moving company on the day before the move"
   - "Schedule time to review the budget next week"

2. **Box-Calendar Integration**:
   - "Schedule packing time for the remaining unpacked boxes"
   - "Remind me to load the truck 2 hours before the movers arrive"

3. **Budget-Box Integration**:
   - "How much did I spend on boxes for the kitchen?"
   - "Track the cost of packing supplies per room"

### Enhanced System Instructions
As integrations mature, enhance MARVIN's system instruction with:
- **Moving Expertise**: Add comprehensive moving best practices
- **Proactive Suggestions**: Anticipate user needs based on move timeline
- **Contextual Awareness**: Reference specific move details in responses
- **Personalization**: Adapt responses based on user's moving situation

## Success Metrics

### Phase 1 Success Criteria
- [ ] MARVIN can add expenses via voice/text commands
- [ ] MARVIN provides accurate budget summaries
- [ ] MARVIN alerts users about overspent categories
- [ ] MARVIN suggests budget optimizations

### Overall Integration Success
- [ ] All major features have MARVIN integration
- [ ] Users can manage their entire move through MARVIN
- [ ] MARVIN provides proactive, contextual assistance
- [ ] Integration maintains app performance and reliability

## Conclusion

This integration plan transforms MARVIN from a basic calendar assistant into a comprehensive moving management AI. The phased approach ensures manageable development while delivering immediate value to users. The budget integration in Phase 1 offers the highest ROI, followed by advanced box management features that leverage the app's unique QR code system.

The final result will be an AI assistant that can handle complex, multi-step moving tasks through natural language interaction, making the entire moving process more intuitive and less stressful for users.