// @ts-nocheck
import { useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category, MoveType } from '../types/types';
import { INITIAL_CATEGORIES } from '../constants/constants';
import { AddExpenseAction, CreateBudgetCategoryAction, QueryBudgetAction } from '@/features/marvin/types';
import usePersistentReducer from './usePersistentReducer';

// Types for the budget state
type Action =
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_BUDGET'; payload: { totalEstimatedAmount: number; moveType: MoveType } }
  | { type: 'SET_CATEGORY_BUDGETS'; payload: { [key: string]: number } }
  | { type: 'SET_CATEGORIES'; payload: Category[] };

interface AppState {
  expenses: Expense[];
  categories: Category[];
  budget: {
    totalEstimatedAmount: number;
    moveType: MoveType;
  };
}

// Reducer function
const budgetReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: uuidv4() }]
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(exp => 
          exp.id === action.payload.id ? action.payload : exp
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(exp => exp.id !== action.payload)
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [
          ...state.categories,
          { ...action.payload, id: `cat-${Date.now()}` }
        ]
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        )
      };
    case 'DELETE_CATEGORY':
      // Note: We skip the expense check for MARVIN integration
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload)
      };
    case 'SET_BUDGET':
      return {
        ...state,
        budget: action.payload
      };
    case 'SET_CATEGORY_BUDGETS':
      return {
        ...state,
        categories: state.categories.map(cat => ({
          ...cat,
          estimatedAmount: action.payload[cat.id] || 0
        }))
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AppState = {
  expenses: [],
  categories: INITIAL_CATEGORIES,
  budget: {
    totalEstimatedAmount: 0,
    moveType: MoveType.LOCAL
  }
};

export const useMarvinBudget = () => {
  const [state, dispatch] = usePersistentReducer(budgetReducer, initialState, 'budget-tracker-state');

  const handleAddExpense = useCallback(async (action: AddExpenseAction) => {
    try {
      // Find the category to validate it exists
      const category = state.categories.find(cat => cat.id === action.expense.categoryId);
      if (!category) {
        // Provide helpful category suggestions
        const availableCategories = state.categories.map(cat => `${cat.name} (${cat.id})`).join(', ');
        return {
          success: false,
          message: `Category "${action.expense.categoryId}" not found. Available categories: ${availableCategories}`
        };
      }

      const newExpense = {
        ...action.expense,
        id: uuidv4(),
        date: action.expense.date || new Date().toISOString().split('T')[0],
        receiptImageBase64: undefined // MARVIN doesn't handle receipts yet
      };
      
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      
      return {
        success: true,
        message: `Added expense: $${action.expense.amount} for ${action.expense.description} to ${category.name} category`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add expense: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }, [state.categories, dispatch]);

  // Smart color and icon selection based on category name
  const getSmartCategoryDefaults = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    // Color and icon mappings based on category semantic meaning
    // Icons must match CATEGORY_ICONS_OPTIONS from constants
    const categoryMappings = {
      // Transportation related
      gas: { color: '#ef4444', icon: 'Fuel' },
      fuel: { color: '#ef4444', icon: 'Fuel' },
      transport: { color: '#8b5cf6', icon: 'Truck' },
      truck: { color: '#8b5cf6', icon: 'Truck' },
      vehicle: { color: '#8b5cf6', icon: 'Truck' },
      
      // Home related
      utilities: { color: '#f59e0b', icon: 'Plug' },
      electricity: { color: '#f59e0b', icon: 'Plug' },
      internet: { color: '#06b6d4', icon: 'Wifi' },
      wifi: { color: '#06b6d4', icon: 'Wifi' },
      home: { color: '#f97316', icon: 'Home' },
      
      // Food related
      food: { color: '#10b981', icon: 'Utensils' },
      meals: { color: '#10b981', icon: 'Utensils' },
      restaurant: { color: '#10b981', icon: 'Utensils' },
      groceries: { color: '#10b981', icon: 'Groceries' },
      
      // Supplies related
      supplies: { color: '#3b82f6', icon: 'PackingSupplies' },
      boxes: { color: '#3b82f6', icon: 'PackingSupplies' },
      packing: { color: '#3b82f6', icon: 'PackingSupplies' },
      tape: { color: '#3b82f6', icon: 'Tape' },
      
      // Services related
      movers: { color: '#ec4899', icon: 'MovingCompany' },
      moving: { color: '#ec4899', icon: 'MovingCompany' },
      cleaning: { color: '#84cc16', icon: 'Broom' },
      insurance: { color: '#64748b', icon: 'ShieldCheck' },
      professional: { color: '#ec4899', icon: 'ProfessionalServicesIcon' },
      
      // Storage related
      storage: { color: '#a855f7', icon: 'Warehouse' },
      
      // Financial
      tips: { color: '#22c55e', icon: 'MoversTip' },
      deposit: { color: '#f59e0b', icon: 'Deposits' },
      credit: { color: '#6366f1', icon: 'CreditCard' },
      shopping: { color: '#06b6d4', icon: 'ShoppingCart' },
      
      // Home essentials
      furniture: { color: '#8b5cf6', icon: 'Couch' },
      bed: { color: '#ec4899', icon: 'Bed' },
      paint: { color: '#f97316', icon: 'Paintbrush' },
      keys: { color: '#facc15', icon: 'Key' },
      
      // Special categories
      pet: { color: '#84cc16', icon: 'PetCare' },
      child: { color: '#f472b6', icon: 'ChildCare' },
      tools: { color: '#64748b', icon: 'ToolsEquipment' },
    };
    
    // Find best match
    for (const [key, value] of Object.entries(categoryMappings)) {
      if (name.includes(key)) {
        return value;
      }
    }
    
    // Default fallback
    return { color: '#3B82F6', icon: 'HelpCircle' };
  };

  const handleCreateBudgetCategory = useCallback(async (action: CreateBudgetCategoryAction) => {
    try {
      // Check if category with same name already exists
      const existingCategory = state.categories.find(cat => 
        cat.name.toLowerCase() === action.category.name.toLowerCase()
      );
      
      if (existingCategory) {
        return {
          success: false,
          message: `Category "${action.category.name}" already exists`
        };
      }

      // Get smart defaults if not provided
      const smartDefaults = getSmartCategoryDefaults(action.category.name);
      
      const newCategory = {
        ...action.category,
        color: action.category.color || smartDefaults.color,
        icon: action.category.icon || smartDefaults.icon,
        deletable: true
      };
      
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      
      return {
        success: true,
        message: `Created new category: ${action.category.name} with budget of $${action.category.estimatedAmount}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }, [state.categories, dispatch]);

  const handleQueryBudget = useCallback(async (action: QueryBudgetAction) => {
    try {
      const { query } = action;
      
      switch (query.type) {
        case 'summary': {
          const totalSpent = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
          const totalBudget = state.budget.totalEstimatedAmount;
          const remainingBudget = totalBudget - totalSpent;
          const categoryCount = state.categories.length;
          const expenseCount = state.expenses.length;

          return {
            success: true,
            message: `Budget Summary: Total budget: $${totalBudget}, Spent: $${totalSpent}, Remaining: $${remainingBudget}. You have ${expenseCount} expenses across ${categoryCount} categories.`
          };
        }
        
        case 'by_category': {
          if (query.categoryId) {
            const category = state.categories.find(cat => cat.id === query.categoryId);
            if (!category) {
              return {
                success: false,
                message: `Category not found: ${query.categoryId}`
              };
            }
            
            const categoryExpenses = state.expenses.filter(exp => exp.categoryId === query.categoryId);
            const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const remaining = category.estimatedAmount - totalSpent;
            
            return {
              success: true,
              message: `${category.name} category: Budget: $${category.estimatedAmount}, Spent: $${totalSpent}, Remaining: $${remaining}. ${categoryExpenses.length} expenses in this category.`
            };
          } else {
            // Show all categories
            const categorySummary = state.categories.map(category => {
              const categoryExpenses = state.expenses.filter(exp => exp.categoryId === category.id);
              const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
              return `${category.name}: $${totalSpent}/$${category.estimatedAmount}`;
            }).join(', ');
            
            return {
              success: true,
              message: `Category breakdown: ${categorySummary}`
            };
          }
        }
        
        case 'recent_expenses': {
          const recentExpenses = state.expenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map(expense => {
              const category = state.categories.find(cat => cat.id === expense.categoryId);
              return `$${expense.amount} for ${expense.description} (${category?.name || 'Unknown'}) on ${expense.date}`;
            });
          
          if (recentExpenses.length === 0) {
            return {
              success: true,
              message: "No expenses recorded yet."
            };
          }
          
          return {
            success: true,
            message: `Recent expenses: ${recentExpenses.join('; ')}`
          };
        }
        
        case 'overspent_categories': {
          const overspentCategories = state.categories.filter(category => {
            const totalSpent = state.expenses
              .filter(exp => exp.categoryId === category.id)
              .reduce((sum, expense) => sum + expense.amount, 0);
            return totalSpent > category.estimatedAmount;
          });
          
          if (overspentCategories.length === 0) {
            return {
              success: true,
              message: "Great news! No categories are over budget."
            };
          }
          
          const overspentSummary = overspentCategories.map(category => {
            const totalSpent = state.expenses
              .filter(exp => exp.categoryId === category.id)
              .reduce((sum, expense) => sum + expense.amount, 0);
            const overage = totalSpent - category.estimatedAmount;
            return `${category.name} is over by $${overage}`;
          }).join(', ');
          
          return {
            success: true,
            message: `Overspent categories: ${overspentSummary}`
          };
        }
        
        default:
          return {
            success: false,
            message: `Unknown query type: ${query.type}`
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to query budget: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }, [state]);

  return {
    handleAddExpense,
    handleCreateBudgetCategory,
    handleQueryBudget,
    budgetData: { 
      categories: state.categories, 
      expenses: state.expenses, 
      budget: state.budget 
    },
    state,
    dispatch
  };
};
