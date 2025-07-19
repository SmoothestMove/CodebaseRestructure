import React from 'react';
import { useNavigate } from 'react-router-dom';
import BudgetSetup from '../components/BudgetSetup';
import { INITIAL_CATEGORIES, BUDGET_TEMPLATES } from '../constants/constants';
import { MoveType, Category } from '../types/types';
import usePersistentReducer from '../hooks/usePersistentReducer';

// Import the reducer and initial state from BudgetPage for consistency
// These must be exported from BudgetPage.tsx
import { budgetReducer, initialState } from './BudgetPage';

const BudgetSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = usePersistentReducer(budgetReducer, initialState, 'budget-tracker-state');

  // Save handler for budget and move type
  const handleSave = (amount: number, moveType: MoveType) => {
    // Use correct key for BUDGET_TEMPLATES
    const template = BUDGET_TEMPLATES[moveType === MoveType.LOCAL ? 'LOCAL' : 'LONG_DISTANCE'] || {};
    const newCategories = state.categories.map((cat: Category) => ({
      ...cat,
      estimatedAmount: template[cat.id] || 0
    }));
    dispatch({ type: 'SET_BUDGET', payload: { totalEstimatedAmount: amount, moveType } });
    dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
    navigate('/app/budget');
  };

  // Save handler for manual category budgets
  const handleSaveCategoryBudgets = (budgets: { [key: string]: number }) => {
    const newCategories = state.categories.map((cat: Category) => ({
      ...cat,
      estimatedAmount: budgets[cat.id] || 0
    }));
    dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-2xl mx-auto p-4">
        <BudgetSetup
          isOpen={true}
          onClose={() => {}}
          onSave={handleSave}
          onSaveCategoryBudgets={handleSaveCategoryBudgets}
          categories={state.categories}
          initialBudget={state.budget.totalEstimatedAmount}
          initialMoveType={state.budget.moveType}
        />
      </div>
    </div>
  );
};

export default BudgetSetupPage;
