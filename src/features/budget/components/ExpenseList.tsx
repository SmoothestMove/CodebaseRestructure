import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaReceipt } from 'react-icons/fa';
import { Expense, Category } from '../types/types';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { StatusBadge } from '@/components/design-system';
import { useSwipeToDelete } from '@/lib/gestures';
import { VARIANTS, shouldReduceMotion } from '@/lib/animations';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onViewDetails: (expense: Expense) => void;
  className?: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  categories,
  onEditExpense,
  onDeleteExpense,
  onViewDetails,
  className = ''
}) => {
  const getCategoryName = (categoryId: string): string => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown Category';
  };

  const getCategoryColor = (categoryId: string): string => {
    return categories.find(cat => cat.id === categoryId)?.color || '#64748b';
  };

  // Swipeable Expense Item Component for Mobile
  const SwipeableExpenseItem: React.FC<{
    expense: Expense;
    onDelete: () => void;
    onEdit: () => void;
    onViewDetails: () => void;
  }> = ({ expense, onDelete, onEdit, onViewDetails }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const { ref: swipeRef } = useSwipeToDelete(
      () => {
        setIsDeleting(true);
        // Small delay for better UX
        setTimeout(() => {
          onDelete();
        }, 200);
      },
      {
        deleteThreshold: 120,
        confirmationRequired: false, // We'll show visual feedback instead
        onSwipeStart: () => {
          // Could add visual feedback here
        },
        onSwipeCancel: () => {
          setIsDeleting(false);
        },
        enabled: !isDeleting,
      }
    );

    return (
      <motion.div
        ref={swipeRef}
        layout
        initial="initial"
        animate={isDeleting ? "exit" : "animate"}
        exit="exit"
        variants={shouldReduceMotion() ? undefined : VARIANTS.card}
        className={`relative p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
          isDeleting ? 'bg-red-50 dark:bg-red-900/20' : ''
        }`}
      >
        {/* Delete indicator overlay */}
        {isDeleting && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center z-10"
          >
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <FaTrash className="w-5 h-5" />
              <span className="font-medium">Deleting...</span>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 dark:text-slate-100">
              {expense.merchantName}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {expense.description}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {formatCurrency(expense.amount)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <StatusBadge
            status="info"
            size="sm"
            variant="soft"
            style={{ 
              backgroundColor: `${getCategoryColor(expense.categoryId)}20`, 
              color: getCategoryColor(expense.categoryId) 
            }}
          >
            {getCategoryName(expense.categoryId)}
          </StatusBadge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(expense.date)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            💡 Swipe left to delete
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={shouldReduceMotion() ? undefined : { scale: 0.95 }}
              onClick={onViewDetails}
              className="p-2 text-slate-400 hover:text-brand-tertiary dark:hover:text-orange-400 transition-colors min-h-[44px] min-w-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50 rounded"
              aria-label={`View details for ${expense.merchantName}`}
            >
              <FaReceipt className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={shouldReduceMotion() ? undefined : { scale: 0.95 }}
              onClick={onEdit}
              className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[44px] min-w-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
              aria-label={`Edit ${expense.merchantName}`}
            >
              <FaEdit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={shouldReduceMotion() ? undefined : { scale: 0.95 }}
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
              aria-label={`Delete ${expense.merchantName}`}
            >
              <FaTrash className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {expense.receiptImageBase64 && (
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
            <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <FaReceipt className="w-3 h-3" />
              Receipt attached
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  if (expenses.length === 0) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center ${className}`}>
        <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <FaReceipt className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          No expenses found
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Start tracking your moving expenses by adding your first expense above.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Mobile View with Swipe Gestures */}
      <div className="md:hidden">
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          <AnimatePresence mode="popLayout">
            {expenses.map((expense) => (
              <SwipeableExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={() => onDeleteExpense(expense.id)}
                onEdit={() => onEditExpense(expense)}
                onViewDetails={() => onViewDetails(expense)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                Date
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                Merchant
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                Description
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                Category
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                Amount
              </th>
              <th className="text-center px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {expense.merchantName}
                      </p>
                      {expense.receiptImageBase64 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                          <FaReceipt className="w-3 h-3" />
                          Has receipt
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                  <p className="truncate" title={expense.description}>
                    {expense.description}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    status="neutral"
                    size="sm"
                    variant="soft"
                    style={{ backgroundColor: `${getCategoryColor(expense.categoryId)}20`, color: getCategoryColor(expense.categoryId) }}
                  >
                    {getCategoryName(expense.categoryId)}
                  </StatusBadge>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onViewDetails(expense)}
                      className="p-2 text-slate-400 hover:text-brand-tertiary dark:hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50 rounded"
                      aria-label={`View details for ${expense.merchantName}`}
                    >
                      <FaReceipt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                      aria-label={`Edit ${expense.merchantName}`}
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
                      aria-label={`Delete ${expense.merchantName}`}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;