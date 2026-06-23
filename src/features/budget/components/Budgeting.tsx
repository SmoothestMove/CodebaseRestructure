// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Expense, Category, MoveType } from '../types/types';
import { INITIAL_CATEGORIES } from '../constants/constants';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '@/components/common/Button';
import usePersistentReducer from '../hooks/usePersistentReducer';

// Import extracted components
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
    <div className="min-h-screen bg-background text-text-main">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-main">
              Moving Budget
            </h1>
            <p className="text-text-secondary text-sm">
              Track your moving expenses and stay on budget
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsSetupBudgetModalOpen(true)}
              leftIcon={<span className="material-symbols-outlined text-lg">edit</span>}
              ariaLabel="Edit budget settings"
              size="sm"
            >
              Edit Budget
            </Button>
            
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-text-muted hover:text-text-main transition-colors min-h-[44px] min-w-[44px] rounded-full hover:bg-surface-elevated"
              title="Help"
              aria-label="Toggle help information"
            >
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>

        {/* Help Information */}
        {showHelp && (
          <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <h3 className="font-semibold text-text-main mb-2">
              How to use the Budget Tracker
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
              <li>Set your total moving budget and move type to get started</li>
              <li>Add expense categories that match your moving needs</li>
              <li>Record all moving-related expenses as they occur</li>
              <li>Use the charts to track spending against your budget</li>
              <li>Filter expenses by category or search for specific items</li>
            </ul>
          </div>
        )}

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Budget Card */}
          <div className="col-span-2 flex flex-col gap-1 rounded-xl p-5 bg-surface-elevated relative">
            <div className="flex justify-between items-start">
              <p className="text-text-muted text-sm font-medium">Total Budget</p>
              <span className="material-symbols-outlined text-accent" style={{fontSize: '24px'}}>account_balance_wallet</span>
            </div>
            <div className="flex justify-between items-end mt-2">
              <p className="text-text-main text-3xl font-bold tracking-tight">{formatCurrency(totalBudget)}</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddExpenseModalOpen(true)}
                leftIcon={<span className="material-symbols-outlined text-base">add</span>}
              >
                Add Expense
              </Button>
            </div>
          </div>
          
          {/* Actual Spending Card */}
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-semantic-error/10">
            <p className="text-semantic-error text-xs font-semibold uppercase tracking-wider">Total Spent</p>
            <div className="flex justify-between items-center">
              <p className="text-text-main text-xl font-bold">{formatCurrency(totalSpent)}</p>
              <span className="material-symbols-outlined text-semantic-error">payments</span>
            </div>
          </div>
          
          {/* Remaining Budget Card */}
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-semantic-success/10">
            <p className="text-semantic-success text-xs font-semibold uppercase tracking-wider">Remaining</p>
            <div className="flex justify-between items-center">
              <p className="text-text-main text-xl font-bold">{formatCurrency(remainingBudget)}</p>
              <span className="material-symbols-outlined text-semantic-success">savings</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalBudget > 0 && (
          <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-text-secondary">Budget Usage</span>
              <span className="font-semibold text-text-main">
                {Math.round(budgetPercentage)}%
              </span>
            </div>
            <div className="w-full bg-surface-elevated rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetPercentage > 100 ? 'bg-semantic-error' : 'bg-accent'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            {budgetPercentage > 100 && (
              <p className="text-sm text-semantic-error mt-2">
                ⚠️ You've exceeded your budget by {formatCurrency(Math.abs(remainingBudget))}
              </p>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-surface-elevated p-1">
          <button
            onClick={() => setCurrentTab('expenses')}
            className={`flex-1 h-full flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'expenses'
                ? 'bg-surface shadow-sm text-text-main'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setCurrentTab('categories')}
            className={`flex-1 h-full flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'categories'
                ? 'bg-surface shadow-sm text-text-main'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setCurrentTab('charts')}
            className={`flex-1 h-full flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'charts'
                ? 'bg-surface shadow-sm text-text-main'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Charts
          </button>
        </div>

        {/* Tab Content */}
        {currentTab === 'expenses' && (
          <div className="space-y-4">
            {/* Add Expense Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={() => setIsAddExpenseModalOpen(true)}
                leftIcon={<span className="material-symbols-outlined text-lg">add</span>}
                className="flex-1 sm:flex-initial"
              >
                Add Expense
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsReceiptScanModalOpen(true)}
                leftIcon={<span className="material-symbols-outlined text-lg">photo_camera</span>}
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
