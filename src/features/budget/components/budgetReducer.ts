// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { Expense, Category, MoveType } from '../types/types';
import { INITIAL_CATEGORIES } from '../constants/constants';

// Action types
export type Action =
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_BUDGET'; payload: { totalEstimatedAmount: number; moveType: MoveType } }
  | { type: 'SET_CATEGORY_BUDGETS'; payload: { [key: string]: number } }
  | { type: 'SET_CATEGORIES'; payload: Category[] };

// State interface
export interface AppState {
  expenses: Expense[];
  categories: Category[];
  budget: {
    totalEstimatedAmount: number;
    moveType: MoveType;
  };
}

// Initial state
export const initialState: AppState = {
  expenses: [],
  categories: INITIAL_CATEGORIES,
  budget: {
    totalEstimatedAmount: 0,
    moveType: MoveType.LOCAL,
  },
};

// Reducer function
export const budgetReducer = (state: AppState, action: Action): AppState => {
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
      // Check if category has expenses (validation should be done in component)
      if (state.expenses.some(exp => exp.categoryId === action.payload)) {
        toast.error('Cannot delete a category with expenses');
        return state;
      }
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
