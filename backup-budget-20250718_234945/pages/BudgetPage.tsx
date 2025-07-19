import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaChartBar, FaChartPie, FaFilter, FaSearch, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { Expense, Category, ItemStatus, MoveType } from '../types/types';
import { INITIAL_CATEGORIES, BUDGET_TEMPLATES, ICONS } from '../constants/constants';
import AddExpenseModal from '../components/AddExpenseModal';
import CategoryModal from '../components/CategoryModal';
import BudgetSetup from '../components/BudgetSetup';
import ExpenseDetailModal from '../components/ExpenseDetailModal';
import HorizontalBarChart from '../components/HorizontalBarChart';
import BulletChart from '../components/BulletChart';
import Button from '../../../components/common/Button';

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
      // Don't allow deleting categories with expenses
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

import usePersistentReducer from '../hooks/usePersistentReducer';

import { useNavigate } from 'react-router-dom';

const FinancialNavigator: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = usePersistentReducer<AppState, Action>(
    budgetReducer,
    initialState,
    'budget-tracker-state'
  );
  
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBudgetSetupOpen, setIsBudgetSetupOpen] = useState(false);

  // Open BudgetSetup modal on first visit if no budget is set
  useEffect(() => {
    if (!state.budget || !state.budget.totalEstimatedAmount || state.budget.totalEstimatedAmount === 0) {
      setIsBudgetSetupOpen(true);
    }
  }, [state.budget]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar');
  const [showHelp, setShowHelp] = useState(false);

  // Route guard: redirect to setup if no budget is set
  useEffect(() => {
    if (!state.budget || !state.budget.totalEstimatedAmount || state.budget.totalEstimatedAmount === 0) {
      navigate('/app/budget/setup', { replace: true });
    }
  }, [state.budget, navigate]);

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

  const handleSetBudget = (amount: number, moveType: MoveType) => {
    dispatch({ 
      type: 'SET_BUDGET', 
      payload: { totalEstimatedAmount: amount, moveType } 
    });
    
    // Apply template if this is the first time setting the budget
    if (state.categories.every(cat => cat.estimatedAmount === 0)) {
      const template = BUDGET_TEMPLATES[moveType === MoveType.LOCAL ? 'LOCAL' : 'LONG_DISTANCE'];
      dispatch({ type: 'SET_CATEGORY_BUDGETS', payload: template });
    }
    
    toast.success('Budget set successfully!');
  };

  const handleSetCategoryBudgets = (budgets: { [key: string]: number }) => {
    dispatch({ type: 'SET_CATEGORY_BUDGETS', payload: budgets });
    toast.success('Category budgets updated!');
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
            <Button
              onClick={() => {
                setSelectedExpense(null);
                setIsAddExpenseModalOpen(true);
              }}
              leftIcon={<FaPlus />}
            >
              Add Expense
            </Button>
            
            <Button
              onClick={() => {
                setSelectedCategory(null);
                setIsCategoryModalOpen(true);
              }}
              variant="secondary"
              leftIcon={<FaPlus />}
            >
              Add Category
            </Button>
            
            <Button
              onClick={() => setIsBudgetSetupOpen(true)}
              variant="secondary"
              leftIcon={<FaEdit />}
            >
              Edit Budget
            </Button>
            
            <Button
              onClick={() => setShowHelp(!showHelp)}
              variant="ghost"
              leftIcon={<FaInfoCircle size={20} />}
              title="Help"
            />
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
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Budget</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
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
          {/* Spending by Category */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Spending by Category</h2>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setChartView('bar')} 
                  variant={chartView === 'bar' ? 'secondary' : 'ghost'}
                  leftIcon={<FaChartBar />}
                  title="Bar Chart"
                />
                <Button 
                  onClick={() => setChartView('pie')} 
                  variant={chartView === 'pie' ? 'secondary' : 'ghost'}
                  leftIcon={<FaChartPie />}
                  title="Pie Chart"
                />
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

          {/* Budget vs Actual */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Budget vs Actual</h2>
            <div className="h-64">
              {categorySpending.some(cat => cat.budget > 0) ? (
                <BulletChart data={categorySpending} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                  Set category budgets to see budget vs actual comparison.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold">Expense Log</h2>
            
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                className="border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
              
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategoryFilter('all');
                }}
                leftIcon={<FaTimes />}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
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
                {filteredExpenses.length > 0 ? (
                  filteredExpenses
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
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setSelectedExpense(expense);
                                  setIsAddExpenseModalOpen(true);
                                }}
                                leftIcon={<FaEdit />}
                                title="Edit"
                              />
                              <Button
                                variant="ghost"
                                onClick={() => setSelectedExpense(expense)}
                                leftIcon={<FaInfoCircle />}
                                title="View Details"
                              />
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this expense?')) {
                                    handleDeleteExpense(expense.id);
                                  }
                                }}
                                leftIcon={<FaTrash />}
                                title="Delete"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        {state.expenses.length === 0 ? (
                          <>
                            <p className="text-lg font-medium mb-2">No expenses yet</p>
                            <p className="mb-4">Add your first expense to get started!</p>
                            <Button
                              onClick={() => setIsAddExpenseModalOpen(true)}
                              leftIcon={<FaPlus />}
                            >
                              Add Expense
                            </Button>
                          </>
                        ) : (
                          'No expenses match your current filters.'
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-slate-900 dark:text-slate-100">
                    {filteredExpenses.length > 0 ? `Showing ${filteredExpenses.length} expenses` : ''}
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-slate-900 dark:text-white">
                    {filteredExpenses.length > 0 ? formatCurrency(
                      filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                    ) : ''}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
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

      <BudgetSetup
        isOpen={isBudgetSetupOpen}
        onClose={() => setIsBudgetSetupOpen(false)}
        onSave={handleSetBudget}
        onSaveCategoryBudgets={handleSetCategoryBudgets}
        categories={state.categories}
        initialBudget={state.budget.totalEstimatedAmount}
        initialMoveType={state.budget.moveType}
      />

      <ExpenseDetailModal
        isOpen={!!selectedExpense}
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

export default FinancialNavigator;
