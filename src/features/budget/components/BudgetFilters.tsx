import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { Category } from '../types/types';

interface BudgetFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategoryFilter: string;
  onCategoryFilterChange: (categoryId: string) => void;
  categories: Category[];
  className?: string;
}

const BudgetFilters: React.FC<BudgetFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
  categories,
  className = ''
}) => {
  const clearFilters = () => {
    onSearchChange('');
    onCategoryFilterChange('all');
  };

  const hasActiveFilters = searchTerm.length > 0 || selectedCategoryFilter !== 'all';

  return (
    <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search expenses by description or merchant..."
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-tertiary focus:border-brand-tertiary dark:focus:ring-orange-400 dark:focus:border-orange-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-300 min-h-[44px] touch-manipulation"
            aria-label="Search expenses"
          />
        </div>

        {/* Category Filter */}
        <div className="flex-shrink-0">
          <div className="relative">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="appearance-none block w-full pl-10 pr-8 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-tertiary focus:border-brand-tertiary dark:focus:ring-orange-400 dark:focus:border-orange-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 min-h-[44px] min-w-[150px] touch-manipulation"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="h-4 w-4 text-slate-400" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 rounded-lg transition-colors min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50"
            aria-label="Clear all filters"
          >
            <FaTimes className="h-4 w-4" />
            <span className="hidden md:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                aria-label="Clear search"
              >
                <FaTimes className="h-2 w-2" />
              </button>
            </span>
          )}
          {selectedCategoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
              Category: {categories.find(c => c.id === selectedCategoryFilter)?.name}
              <button
                onClick={() => onCategoryFilterChange('all')}
                className="hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5"
                aria-label="Clear category filter"
              >
                <FaTimes className="h-2 w-2" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetFilters;