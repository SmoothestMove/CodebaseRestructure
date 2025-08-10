import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTag } from 'react-icons/fa';
import { Category } from '../types/types';
import { formatCurrency } from '../utils/formatCurrency';
import { StatusBadge, Card } from '@/components/design-system';
import Button from '@/components/common/Button';

interface CategoryManagerProps {
  categories: Category[];
  expenses: { categoryId: string; amount: number }[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  className?: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  expenses,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  className = ''
}) => {
  const [view, setView] = useState<'grid' | 'table'>('grid');

  // Calculate spending for each category
  const getCategorySpending = (categoryId: string): number => {
    return expenses
      .filter(expense => expense.categoryId === categoryId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Calculate percentage of estimated amount used
  const getCategoryPercentage = (categoryId: string): number => {
    const category = categories.find(c => c.id === categoryId);
    if (!category || category.estimatedAmount <= 0) return 0;
    
    const spent = getCategorySpending(categoryId);
    return (spent / category.estimatedAmount) * 100;
  };

  const getPercentageColor = (percentage: number): string => {
    if (percentage <= 75) return 'text-green-600 dark:text-green-400';
    if (percentage <= 90) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(category => {
        const spent = getCategorySpending(category.id);
        const percentage = getCategoryPercentage(category.id);
        const remaining = category.estimatedAmount - spent;

        return (
          <Card key={category.id} variant="default" padding="md" className="h-full">
            <div className="flex flex-col h-full">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {category.name}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEditCategory(category)}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[44px] min-w-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                    aria-label={`Edit ${category.name}`}
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
                    aria-label={`Delete ${category.name}`}
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Spending Information */}
              <div className="flex-1">
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Spent</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(spent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Budget</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {formatCurrency(category.estimatedAmount)}
                    </span>
                  </div>
                  {category.estimatedAmount > 0 && (
                    <>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-1">
                        <div 
                          className={`h-full rounded-full ${
                            percentage <= 75 ? 'bg-green-500' : 
                            percentage <= 90 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium ${getPercentageColor(percentage)}`}>
                          {percentage.toFixed(0)}% used
                        </span>
                        <span className={`text-xs ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {formatCurrency(remaining)} remaining
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                {percentage > 100 ? (
                  <StatusBadge status="error" size="sm" variant="soft">
                    Over Budget
                  </StatusBadge>
                ) : percentage > 90 ? (
                  <StatusBadge status="warning" size="sm" variant="soft">
                    Nearly Full
                  </StatusBadge>
                ) : (
                  <StatusBadge status="success" size="sm" variant="soft">
                    On Track
                  </StatusBadge>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      {/* Add Category Card */}
      <Card 
        variant="outlined" 
        padding="md" 
        clickable
        onClick={onAddCategory}
        className="h-full min-h-[200px] flex items-center justify-center cursor-pointer hover:border-brand-tertiary dark:hover:border-orange-400 transition-colors"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 mx-auto">
            <FaPlus className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
            Add Category
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create a new expense category
          </p>
        </div>
      </Card>
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <th className="text-left px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
              Category
            </th>
            <th className="text-right px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
              Budget
            </th>
            <th className="text-right px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
              Spent
            </th>
            <th className="text-right px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
              Remaining
            </th>
            <th className="text-center px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
              Status
            </th>
            <th className="text-center px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {categories.map(category => {
            const spent = getCategorySpending(category.id);
            const percentage = getCategoryPercentage(category.id);
            const remaining = category.estimatedAmount - spent;

            return (
              <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                  {formatCurrency(category.estimatedAmount)}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(spent)}
                </td>
                <td className={`px-6 py-4 text-right font-medium ${
                  remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>
                  {formatCurrency(remaining)}
                </td>
                <td className="px-6 py-4 text-center">
                  {percentage > 100 ? (
                    <StatusBadge status="error" size="sm" variant="soft">
                      Over Budget
                    </StatusBadge>
                  ) : percentage > 90 ? (
                    <StatusBadge status="warning" size="sm" variant="soft">
                      Nearly Full
                    </StatusBadge>
                  ) : (
                    <StatusBadge status="success" size="sm" variant="soft">
                      On Track
                    </StatusBadge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEditCategory(category)}
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                      aria-label={`Edit ${category.name}`}
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(category.id)}
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
                      aria-label={`Delete ${category.name}`}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FaTag className="w-5 h-5 text-brand-tertiary dark:text-orange-400" />
            Categories
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your expense categories and budgets
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                view === 'grid'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                view === 'table'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Table
            </button>
          </div>

          {/* Add Category Button */}
          <Button
            variant="primary"
            onClick={onAddCategory}
            leftIcon={<FaPlus className="w-4 h-4" />}
            ariaLabel="Add new category"
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Display */}
      {categories.length === 0 ? (
        <Card variant="outlined" padding="xl" className="text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaTag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            No categories yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Create your first expense category to start organizing your moving expenses.
          </p>
          <Button
            variant="primary"
            onClick={onAddCategory}
            leftIcon={<FaPlus className="w-4 h-4" />}
          >
            Create First Category
          </Button>
        </Card>
      ) : (
        <>
          {view === 'grid' ? renderGridView() : renderTableView()}
        </>
      )}
    </div>
  );
};

export default CategoryManager;