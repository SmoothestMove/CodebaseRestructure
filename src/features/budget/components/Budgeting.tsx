import React, { useState, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaPlus, FaTrash, FaEdit, FaChartBar, FaChartPie, FaFilter, FaSearch, FaTimes, FaInfoCircle, FaCamera } from 'react-icons/fa';
import { Expense, Category, MoveType } from '../types/types';
import { INITIAL_CATEGORIES, BUDGET_TEMPLATES, ICONS } from '../constants/constants';
import AddExpenseModal from './AddExpenseModal';
import CategoryModal from './CategoryModal';
import SetupBudgetModal from './SetupBudgetModal';
import SetupExpensesModal from './SetupExpensesModal';
import ExpenseDetailModal from './ExpenseDetailModal';
import HorizontalBarChart from './HorizontalBarChart';
import BulletChart from './BulletChart';
import ReceiptScanModal from './ReceiptScanModal';
import usePersistentReducer from '../hooks/usePersistentReducer';

// Types
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

// Reducer
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

// Initial state
export const initialState: AppState = {
  expenses: [],
  categories: [...INITIAL_CATEGORIES],
  budget: {
    totalEstimatedAmount: 0,
    moveType: MoveType.LOCAL
  }
};

const Budgeting: React.FC = () => {
  const [state, dispatch] = usePersistentReducer<AppState, Action>(
    budgetReducer,
    initialState,
    'budget-tracker-state'
  );
  
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSetupBudgetModalOpen, setIsSetupBudgetModalOpen] = useState(false);
  const [isSetupExpensesModalOpen, setIsSetupExpensesModalOpen] = useState(false);
  const [isReceiptScanModalOpen, setIsReceiptScanModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar');
  const [showHelp, setShowHelp] = useState(false);
  
  // New state for the two-step budget setup workflow
  const [setupBudgetAmount, setSetupBudgetAmount] = useState(0);
  const [setupMoveType, setSetupMoveType] = useState<MoveType>(MoveType.LOCAL);

  // Open SetupBudgetModal on first visit if no budget is set
  useEffect(() => {
    if (!state.budget || !state.budget.totalEstimatedAmount || state.budget.totalEstimatedAmount === 0) {
      setIsSetupBudgetModalOpen(true);
    }
  }, [state.budget]);

  // Initialize with default categories if none exist
  useEffect(() => {
    if (state.categories.length === 0) {
      dispatch({ type: 'SET_CATEGORIES', payload: [...INITIAL_CATEGORIES] });
    }
  }, []);

  // Calculate totals
  const totalSpent = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = state.budget.totalEstimatedAmount;
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Filter expenses based on search and category filter
  const filteredExpenses = state.expenses.filter(expense => {
    const matchesSearch = 
      expense.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategoryFilter === 'all' || 
      expense.categoryId === selectedCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Prepare data for charts
  const categorySpending = state.categories.map(category => {
    const categoryExpenses = state.expenses.filter(
      exp => exp.categoryId === category.id
    );
    const totalSpent = categoryExpenses.reduce(
      (sum, exp) => sum + exp.amount, 0
    );
    
    return {
      name: category.name,
      categoryId: category.id,
      spent: totalSpent,
      budget: category.estimatedAmount || 0,
      remaining: (category.estimatedAmount || 0) - totalSpent,
      color: category.color,
      icon: category.icon
    };
  }).filter(item => item.spent > 0 || item.budget > 0);

  // Handlers
  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    toast.success('Expense added successfully!');
  };

  const handleUpdateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    toast.success('Expense updated successfully!');
  };

  const handleDeleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    toast.success('Expense deleted successfully!');
  };

  const handleReceiptScanned = (expense: Omit<Expense, 'id'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    toast.success('Expense added from receipt scan!');
  };

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
    toast.success('Category added successfully!');
  };

  const handleUpdateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    toast.success('Category updated successfully!');
  };

  const handleDeleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  // New handlers for the two-step budget setup workflow
  const handleSetupBudgetSubmit = (totalBudget: number, moveType: MoveType) => {
    setSetupBudgetAmount(totalBudget);
    setSetupMoveType(moveType);
    setIsSetupBudgetModalOpen(false);
    setIsSetupExpensesModalOpen(true);
  };

  const handleSetupExpensesComplete = (categories: Category[], totalBudget: number) => {
    dispatch({ 
      type: 'SET_BUDGET', 
      payload: { totalEstimatedAmount: totalBudget, moveType: setupMoveType } 
    });
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
    setIsSetupExpensesModalOpen(false);
    toast.success('Budget setup completed successfully!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Financial Navigator</h1>
            <p className="text-slate-600 dark:text-slate-400">Track your moving expenses and stay on budget</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsCategoryModalOpen(true);
                    }}>
              <FaPlus /> Add Category
            </button>
            
            <button className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsSetupBudgetModalOpen(true)}>
              <FaEdit /> Edit Budget
            </button>
            
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="Help"
            >
              <FaInfoCircle size={20} />
            </button>
          </div>
        </div>

        {showHelp && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How to use the Financial Navigator</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>Set your total moving budget and move type to get started</li>
              <li>Add expense categories that match your moving needs</li>
              <li>Record all moving-related expenses as they occur</li>
              <li>Use the charts to track spending against your budget</li>
              <li>Filter expenses by category or search for specific items</li>
            </ul>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${budgetPercentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{Math.round(budgetPercentage)}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Overall Budget Status</h3>
                <p className="text-lg font-semibold">
                  Spent {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Actual Spending</h3>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining</h3>
            <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {totalBudget > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Budget Usage</span>
              <span>{Math.round(budgetPercentage)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
              <div 
                className={`h-full rounded-full ${budgetPercentage > 100 ? 'bg-red-500' : 'bg-brand-primary'}`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense Distribution */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Expense Distribution</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setChartView('bar')} 
                  className={`p-1 rounded ${chartView === 'bar' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
                  title="Bar Chart"
                >
                  <FaChartBar />
                </button>
                <button 
                  onClick={() => setChartView('pie')} 
                  className={`p-1 rounded ${chartView === 'pie' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
                  title="Pie Chart"
                >
                  <FaChartPie />
                </button>
              </div>
            </div>
            
            <div className="h-64">
              {categorySpending.length > 0 ? (
                chartView === 'bar' ? (
                  <HorizontalBarChart data={categorySpending} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySpending}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="spent"
                          nameKey="name"
                          label={({ name, percent }) => 
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categorySpending.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                  No spending data available. Add some expenses to see charts.
                </div>
              )}
            </div>
          </div>

          {/* Category Spending (Actual vs. Estimate) */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Category Spending (Actual vs. Estimate)</h2>
            <div className="h-64">
              <BulletChart data={categorySpending} />
            </div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Budget Categories</h2>
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded">Table</button>
                <button className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">Bullet Chart</button>
              </div>
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                <FaPlus /> Add New
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {state.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" 
                       style={{ backgroundColor: `${category.color}20` }}>
                    <span style={{ color: category.color }}>
                      {ICONS[category.icon]}
                    </span>
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(
                        state.expenses
                          .filter(exp => exp.categoryId === category.id)
                          .reduce((sum, exp) => sum + exp.amount, 0)
                      )} / {formatCurrency(category.estimatedAmount)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="p-1 text-slate-400 hover:text-red-500"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this category?')) {
                          handleDeleteCategory(category.id);
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Log */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Expense Log</h2>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsReceiptScanModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <FaCamera /> Scan Receipt
              </button>
              <button 
                onClick={() => {
                  setSelectedExpense(null);
                  setIsAddExpenseModalOpen(true);
                }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                <FaPlus /> Add Expense
              </button>
            </div>
          </div>
          
          {state.expenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-slate-500 dark:text-slate-400">
                <p className="text-lg font-medium mb-2">No expenses logged yet.</p>
                <p className="mb-4">Use the 'Add Expense' button above to get started!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Search and Filters */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    className="pl-10 pr-4 py-2 w-full border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-slate-900 dark:text-slate-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FaTimes className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                    </button>
                  )}
                </div>
                
                <select
                  className="border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-slate-900 dark:text-slate-100"
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {state.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategoryFilter('all');
                  }}
                  className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <FaTimes /> Clear Filters
                </button>
              </div>

              {/* Expenses Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Merchant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredExpenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => {
                        const category = state.categories.find(c => c.id === expense.categoryId);
                        return (
                          <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                              {formatDate(expense.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                              {expense.merchantName}
                              {expense.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                  {expense.description}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {category && (
                                  <span 
                                    className="mr-2" 
                                    style={{ color: category.color }}
                                  >
                                    {ICONS[category.icon]}
                                  </span>
                                )}
                                <span className="text-sm text-slate-900 dark:text-slate-100">
                                  {category?.name || 'Uncategorized'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900 dark:text-slate-100">
                              {formatCurrency(expense.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setSelectedExpense(expense)}
                                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                  title="View Details"
                                >
                                  <FaInfoCircle />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedExpense(expense);
                                    setIsAddExpenseModalOpen(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this expense?')) {
                                      handleDeleteExpense(expense.id);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-500"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => {
          setIsAddExpenseModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={selectedExpense ? handleUpdateExpense : handleAddExpense}
        categories={state.categories}
        initialData={selectedExpense}
      />

      <ReceiptScanModal
        isOpen={isReceiptScanModalOpen}
        onClose={() => setIsReceiptScanModalOpen(false)}
        onConfirm={handleReceiptScanned}
        categories={state.categories}
        apiKey={import.meta.env.VITE_MINDEE_API_KEY || '0934184ca7773f4e3f22935db2852918'}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={selectedCategory ? handleUpdateCategory : handleAddCategory}
        categories={state.categories}
        categoryToEdit={selectedCategory}
      />

      <SetupBudgetModal
        isOpen={isSetupBudgetModalOpen}
        onClose={() => setIsSetupBudgetModalOpen(false)}
        onSubmit={handleSetupBudgetSubmit}
      />

      <SetupExpensesModal
        isOpen={isSetupExpensesModalOpen}
        onClose={() => {
          setIsSetupExpensesModalOpen(false);
          setIsSetupBudgetModalOpen(true); // Go back to first modal if closed
        }}
        onComplete={handleSetupExpensesComplete}
        totalBudget={setupBudgetAmount}
        moveType={setupMoveType}
      />

      <ExpenseDetailModal
        isOpen={!!selectedExpense && !isAddExpenseModalOpen}
        onClose={() => setSelectedExpense(null)}
        onEdit={(expense) => {
          setSelectedExpense(expense);
          setIsAddExpenseModalOpen(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this expense?')) {
            handleDeleteExpense(id);
            setSelectedExpense(null);
          }
        }}
        expense={selectedExpense}
        categories={state.categories}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Budgeting;