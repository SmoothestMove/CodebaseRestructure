// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaInfoCircle, FaCamera } from 'react-icons/fa';
import { Expense, Category, MoveType } from '../types/types';
import { INITIAL_CATEGORIES } from '../constants/constants';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '@/components/common/Button';
import usePersistentReducer from '../hooks/usePersistentReducer';

// Import extracted components
import BudgetOverview from './BudgetOverview';
import BudgetFilters from './BudgetFilters';
import ExpenseList from './ExpenseList';
import CategoryManager from './CategoryManager';
import ChartContainer from './ChartContainer';

// Import modals
import AddExpenseModal from './AddExpenseModal';
import CategoryModal from './CategoryModal';
import SetupBudgetModal from './SetupBudgetModal';
import SetupExpensesModal from './SetupExpensesModal';
import ExpenseDetailModal from './ExpenseDetailModal';
import ReceiptScanModal from './ReceiptScanModal';

// Import reducer and types
import { budgetReducer, initialState, AppState, Action } from './budgetReducer';

const Budgeting: React.FC = () => {
  const [state, dispatch] = usePersistentReducer<AppState, Action>(
    budgetReducer,
    initialState,
    'budgetState'
  );

  // Modal states
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSetupBudgetModalOpen, setIsSetupBudgetModalOpen] = useState(false);
  const [isSetupExpensesModalOpen, setIsSetupExpensesModalOpen] = useState(false);
  const [isReceiptScanModalOpen, setIsReceiptScanModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // View states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar');
  const [showHelp, setShowHelp] = useState(false);
  const [currentTab, setCurrentTab] = useState<'expenses' | 'categories' | 'charts'>('expenses');


  // Auto-open setup modal for first-time users
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBudgetPage');
    
    if (!hasVisitedBefore) {
      // First-time visit, show the setup modal
      setIsSetupBudgetModalOpen(true);
      localStorage.setItem('hasVisitedBudgetPage', 'true');
    } else if (!state.budget?.totalEstimatedAmount || state.budget.totalEstimatedAmount === 0) {
      // Returning user but no budget set up yet
      setIsSetupBudgetModalOpen(true);
    }
  }, [state.budget]);

  // Initialize with default categories if none exist
  useEffect(() => {
    if (state.categories.length === 0) {
      dispatch({ type: 'SET_CATEGORIES', payload: [...INITIAL_CATEGORIES] });
    }
  }, []);

  // Calculated values
  const totalSpent = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = state.budget.totalEstimatedAmount;
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Filter expenses
  const filteredExpenses = state.expenses.filter(expense => {
    const matchesSearch = 
      expense.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategoryFilter === 'all' || expense.categoryId === selectedCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Chart data
  const categorySpending = state.categories.map(category => {
    const categoryExpenses = state.expenses.filter(exp => exp.categoryId === category.id);
    const spending = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    return {
      name: category.name,
      value: spending,
      color: category.color,
      estimated: category.estimatedAmount
    };
  }).filter(item => item.value > 0);

  // Action handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
    toast.success('Expense added successfully');
  };

  const handleUpdateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    toast.success('Expense updated successfully');
    setSelectedExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
      toast.success('Expense deleted successfully');
    }
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: categoryData });
    toast.success('Category added successfully');
  };

  const handleUpdateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    toast.success('Category updated successfully');
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const hasExpenses = state.expenses.some(exp => exp.categoryId === categoryId);
    if (hasExpenses) {
      toast.error('Cannot delete a category with expenses');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
      toast.success('Category deleted successfully');
    }
  };

  const handleSetupBudget = (totalBudget: number, moveType: MoveType, shouldAutoSetupCategories?: boolean) => {
    dispatch({ type: 'SET_BUDGET', payload: { totalEstimatedAmount: totalBudget, moveType } });
    
    if (shouldAutoSetupCategories) {
      // Auto-setup categories using budget templates for "Those That Don't"
      setIsSetupExpensesModalOpen(true);
      toast.success('Budget created! Setting up categories with recommended amounts...');
    } else {
      toast.success('Budget settings updated');
    }
  };

  const handleSetupCategories = (categories: Category[], totalBudget: number) => {
    // Replace all categories with the new ones from the setup modal
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
    toast.success('Budget and category setup completed successfully!');
  };

  const handleReceiptScan = (expenseData: Omit<Expense, 'id'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
    toast.success('Expense added from receipt scan');
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsAddExpenseModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Modal handlers
  const openEditExpenseModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsAddExpenseModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Financial Navigator
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your moving expenses and stay on budget
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsSetupBudgetModalOpen(true)}
              leftIcon={<FaEdit />}
              ariaLabel="Edit budget settings"
            >
              Edit Budget
            </Button>
            
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors min-h-[44px] min-w-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50 rounded"
              title="Help"
              aria-label="Toggle help information"
            >
              <FaInfoCircle size={20} />
            </button>
          </div>
        </div>

        {/* Help Information */}
        {showHelp && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              How to use the Financial Navigator
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>Set your total moving budget and move type to get started</li>
              <li>Add expense categories that match your moving needs</li>
              <li>Record all moving-related expenses as they occur</li>
              <li>Use the charts to track spending against your budget</li>
              <li>Filter expenses by category or search for specific items</li>
            </ul>
          </div>
        )}

        {/* Budget Overview */}
        <BudgetOverview
          totalSpent={totalSpent}
          totalBudget={totalBudget}
          remainingBudget={remainingBudget}
          budgetPercentage={budgetPercentage}
        />

        {/* Progress Bar */}
        {totalBudget > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Budget Usage</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {Math.round(budgetPercentage)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetPercentage > 100 ? 'bg-red-500' : 'bg-brand-primary dark:bg-brand-tertiary'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            {budgetPercentage > 100 && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                ⚠️ You've exceeded your budget by {formatCurrency(Math.abs(remainingBudget))}
              </p>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1">
          <button
            onClick={() => setCurrentTab('expenses')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
              currentTab === 'expenses'
                ? 'bg-brand-tertiary dark:bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setCurrentTab('categories')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
              currentTab === 'categories'
                ? 'bg-brand-tertiary dark:bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setCurrentTab('charts')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
              currentTab === 'charts'
                ? 'bg-brand-tertiary dark:bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Charts
          </button>
        </div>

        {/* Tab Content */}
        {currentTab === 'expenses' && (
          <div className="space-y-6">
            {/* Add Expense Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={() => setIsAddExpenseModalOpen(true)}
                leftIcon={<FaPlus />}
                className="flex-1 sm:flex-initial"
              >
                Add Expense
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsReceiptScanModalOpen(true)}
                leftIcon={<FaCamera />}
                className="flex-1 sm:flex-initial"
              >
                Scan Receipt
              </Button>
            </div>

            {/* Filters */}
            <BudgetFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategoryFilter={selectedCategoryFilter}
              onCategoryFilterChange={setSelectedCategoryFilter}
              categories={state.categories}
            />

            {/* Expense List */}
            <ExpenseList
              expenses={filteredExpenses}
              categories={state.categories}
              onEditExpense={openEditExpenseModal}
              onDeleteExpense={handleDeleteExpense}
              onViewDetails={setSelectedExpense}
            />
          </div>
        )}

        {currentTab === 'categories' && (
          <CategoryManager
            categories={state.categories}
            expenses={state.expenses}
            onAddCategory={() => setIsCategoryModalOpen(true)}
            onEditCategory={openEditCategoryModal}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {currentTab === 'charts' && (
          <ChartContainer
            data={categorySpending}
            chartType={chartView}
            onChartTypeChange={setChartView}
            title="Spending by Category"
          />
        )}

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

        <SetupBudgetModal
          isOpen={isSetupBudgetModalOpen}
          onClose={() => setIsSetupBudgetModalOpen(false)}
          onSubmit={handleSetupBudget}
        />

        <SetupExpensesModal
          isOpen={isSetupExpensesModalOpen}
          onClose={() => setIsSetupExpensesModalOpen(false)}
          onComplete={handleSetupCategories}
          totalBudget={state.budget?.totalEstimatedAmount || 0}
          moveType={state.budget?.moveType || 'local'}
        />

        <ExpenseDetailModal
          isOpen={!!selectedExpense && !isAddExpenseModalOpen}
          onClose={() => setSelectedExpense(null)}
          expense={selectedExpense}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          categories={state.categories}
          formatDate={formatDate}
        />

        <ReceiptScanModal
          isOpen={isReceiptScanModalOpen}
          onClose={() => setIsReceiptScanModalOpen(false)}
          onConfirm={handleReceiptScan}
          categories={state.categories}
          apiKey={import.meta.env.VITE_MINDEE_API_KEY || ''}
        />
      </div>
    </div>
  );
};

export default Budgeting;
