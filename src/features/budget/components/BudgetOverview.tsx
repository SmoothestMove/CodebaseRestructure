import React from 'react';
import { StatsCard } from '@/components/design-system';
import { FaChartBar, FaDollarSign, FaWallet } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * @interface BudgetOverviewProps
 * @description Defines the properties for the BudgetOverview component.
 */
interface BudgetOverviewProps {
  /** The total amount spent. */
  totalSpent: number;
  /** The total budget amount. */
  totalBudget: number;
  /** The remaining budget amount. */
  remainingBudget: number;
  /** The percentage of the budget that has been spent. */
  budgetPercentage: number;
  /** Optional additional CSS classes to apply to the component. */
  className?: string;
}

/**
 * A component that displays an overview of the budget, including total spent,
 * remaining budget, and a visual representation of the budget percentage used.
 * @param {BudgetOverviewProps} props - The properties for the BudgetOverview component.
 * @returns {JSX.Element} The rendered BudgetOverview component.
 */
const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  totalSpent,
  totalBudget,
  remainingBudget,
  budgetPercentage,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* Budget Status Card */}
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
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {Math.round(budgetPercentage)}%
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Overall Budget Status
            </h3>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Spent {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Actual Spending Card */}
      <StatsCard
        title="Actual Spending"
        value={formatCurrency(totalSpent)}
        icon={<FaDollarSign className="w-6 h-6" />}
      />

      {/* Remaining Budget Card */}
      <StatsCard
        title="Remaining Budget"
        value={formatCurrency(remainingBudget)}
        icon={<FaWallet className="w-6 h-6" />}
        trend={remainingBudget < 0 ? 'down' : remainingBudget > totalBudget * 0.2 ? 'up' : 'neutral'}
      />
    </div>
  );
};

export default BudgetOverview;