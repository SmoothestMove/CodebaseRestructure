import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FaDollarSign, FaChartPie, FaExclamationTriangle } from 'react-icons/fa';
import type { Expense, Category, Budget } from '@/features/budget/types/types';
import { formatCurrency } from '@/features/budget/utils/formatCurrency';

interface BudgetOverviewWidgetProps {
  randomizedBudgetData?: {
    expenses: Expense[];
    categories: Category[];
    budget: Budget;
  };
}

export const BudgetOverviewWidget: React.FC<BudgetOverviewWidgetProps> = ({ randomizedBudgetData }) => {
  // Get budget data from localStorage or use randomized data
  const { expenses, categories, budget } = useMemo(() => {
    if (randomizedBudgetData) {
      return randomizedBudgetData;
    }

    try {
      const savedExpenses: Expense[] = JSON.parse(localStorage.getItem('budgetExpenses') || '[]');
      const savedCategories: Category[] = JSON.parse(localStorage.getItem('budgetCategories') || '[]');
      const savedBudget = JSON.parse(localStorage.getItem('budgetData') || '{"totalEstimatedAmount": 0, "moveType": "local"}');
      
      return {
        expenses: savedExpenses,
        categories: savedCategories,
        budget: savedBudget
      };
    } catch (error) {
      console.error('Error loading budget data:', error);
      return {
        expenses: [] as Expense[],
        categories: [] as Category[],
        budget: { totalEstimatedAmount: 0, moveType: 'local' }
      };
    }
  }, [randomizedBudgetData]);

  // Calculate expense analytics
  const analytics = useMemo(() => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = budget.totalEstimatedAmount;
    const remaining = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Calculate spending by category
    const categorySpending = categories.map(category => {
      const categoryExpenses = expenses.filter(exp => exp.categoryId === category.id);
      const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const budget = category.estimatedAmount || 0;
      
      return {
        id: category.id,
        name: category.name,
        spent,
        budget,
        remaining: budget - spent,
        color: category.color,
        icon: category.icon,
        percentUsed: budget > 0 ? (spent / budget) * 100 : 0,
        isOverBudget: spent > budget && budget > 0
      };
    }).filter(cat => cat.spent > 0 || cat.budget > 0);

    // Get recent expenses (last 5)
    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalSpent,
      totalBudget,
      remaining,
      percentUsed,
      categorySpending,
      recentExpenses,
      isOverBudget: totalSpent > totalBudget && totalBudget > 0,
      categoriesOverBudget: categorySpending.filter(cat => cat.isOverBudget).length
    };
  }, [expenses, categories, budget]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{data.name}</p>
        <p className="text-sm text-green-600">Spent: {formatCurrency(data.spent)}</p>
        <p className="text-sm text-blue-600">Budget: {formatCurrency(data.budget)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {data.percentUsed.toFixed(1)}% used
        </p>
      </div>
    );
  };

  if (analytics.totalBudget === 0 && analytics.totalSpent === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <FaDollarSign className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No Budget Data
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Set up your moving budget to track expenses and see insights here.
        </p>
        <button className="text-brand-tertiary hover:text-brand-tertiary-dark font-medium text-sm">
          Go to Budget →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaChartPie className="w-6 h-6 text-brand-tertiary" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Budget Overview
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {analytics.totalSpent > 0 ? `${analytics.recentExpenses.length} recent expenses` : 'No expenses yet'}
            </p>
          </div>
        </div>

        {analytics.isOverBudget && (
          <div className="flex items-center space-x-2 text-red-500">
            <FaExclamationTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Over Budget</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className="text-2xl font-bold text-brand-tertiary">
            {formatCurrency(analytics.totalSpent)}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className="text-2xl font-bold text-blue-500">
            {formatCurrency(analytics.totalBudget)}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Budget</p>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className={`text-2xl font-bold ${analytics.remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(Math.abs(analytics.remaining))}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {analytics.remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </p>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className={`text-2xl font-bold ${analytics.percentUsed <= 80 ? 'text-green-500' : analytics.percentUsed <= 100 ? 'text-yellow-500' : 'text-red-500'}`}>
            {analytics.percentUsed.toFixed(0)}%
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Budget Used</p>
        </div>
      </div>

      {/* Charts Section */}
      {analytics.categorySpending.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart - Category Breakdown */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Spending by Category
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="spent"
                  >
                    {analytics.categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Budget vs Spent */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Budget vs Actual
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categorySpending.slice(0, 5)}>
                  <XAxis 
                    dataKey="name" 
                    className="text-xs fill-slate-600 dark:fill-slate-400"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis className="text-xs fill-slate-600 dark:fill-slate-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                  <Bar dataKey="spent" fill="#10b981" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Category Legend and Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Legend */}
        {analytics.categorySpending.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Categories
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analytics.categorySpending.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {category.name}
                    </span>
                    {category.isOverBudget && (
                      <FaExclamationTriangle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(category.spent)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      of {formatCurrency(category.budget)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Expenses */}
        {analytics.recentExpenses.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Recent Expenses
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analytics.recentExpenses.map((expense) => {
                const category = categories.find(cat => cat.id === expense.categoryId);
                return (
                  <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category?.color || '#64748b' }}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {expense.merchantName}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};