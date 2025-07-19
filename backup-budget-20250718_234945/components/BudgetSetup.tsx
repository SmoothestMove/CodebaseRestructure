import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Category, MoveType } from '../types/types';
import { BUDGET_TEMPLATES, ICONS } from '../constants/constants';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

interface BudgetSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, moveType: MoveType) => void;
  onSaveCategoryBudgets: (budgets: { [key: string]: number }) => void;
  categories: Category[];
  initialBudget?: number;
  initialMoveType?: MoveType;
}

const BudgetSetup: React.FC<BudgetSetupProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveCategoryBudgets,
  categories,
  initialBudget = 0,
  initialMoveType = MoveType.LOCAL,
}) => {
  const [totalBudget, setTotalBudget] = useState(initialBudget);
  const [moveType, setMoveType] = useState<MoveType>(initialMoveType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({});
  
  // Initialize category budgets
  useEffect(() => {
    if (categories.length > 0) {
      const initialBudgets = categories.reduce((acc, cat) => {
        acc[cat.id] = cat.estimatedAmount;
        return acc;
      }, {} as { [key: string]: number });
      setCategoryBudgets(initialBudgets);
    }
  }, [categories]);

  // Apply template when move type changes
  useEffect(() => {
    if (categories.length > 0) {
      const template = BUDGET_TEMPLATES[moveType === MoveType.LOCAL ? 'LOCAL' : 'LONG_DISTANCE'];
      const newBudgets = { ...categoryBudgets };
      
      // Only update categories that exist in the template
      Object.entries(template).forEach(([catId, percentage]) => {
        if (categoryBudgets.hasOwnProperty(catId)) {
          newBudgets[catId] = (totalBudget * percentage) / 100;
        }
      });
      
      setCategoryBudgets(newBudgets);
    }
  }, [moveType, totalBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totalBudget <= 0) {
      toast.error('Budget must be greater than 0');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save total budget and move type
      onSave(totalBudget, moveType);
      
      // Save category budgets if in advanced mode
      if (showAdvanced) {
        onSaveCategoryBudgets(categoryBudgets);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryBudgetChange = (categoryId: string, value: string) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: parseFloat(value) || 0,
    }));
  };

  const calculateCategoryPercentage = (categoryId: string) => {
    if (totalBudget <= 0) return 0;
    const amount = categoryBudgets[categoryId] || 0;
    return Math.round((amount / totalBudget) * 100);
  };

  const remainingBudget = Object.values(categoryBudgets).reduce(
    (sum, amount) => sum + amount,
    0
  );
  
  const budgetDifference = totalBudget - remainingBudget;
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Set Your Moving Budget"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            <span className="inline-flex items-center">
              <span className="mr-2">{ICONS.Info}</span>
              Budget Setup Tips
            </span>
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Set your total moving budget and we'll help you allocate it across different categories. 
            You can use our suggested allocations or customize them in the advanced settings.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Total Moving Budget ($)"
              type="number"
              min="0"
              step="0.01"
              value={totalBudget || ''}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
              
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Move Type
            </label>
            <div className="mt-1 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={moveType === MoveType.LOCAL ? 'primary' : 'secondary'}
                onClick={() => setMoveType(MoveType.LOCAL)}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">🚚</span>
                  <span className="mt-1 text-sm font-medium">Local Move</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Within 50 miles
                  </span>
                </div>
              </Button>
              
              <Button
                type="button"
                variant={moveType === MoveType.CROSS_STATE ? 'primary' : 'secondary'}
                onClick={() => setMoveType(MoveType.CROSS_STATE)}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">✈️</span>
                  <span className="mt-1 text-sm font-medium">Long Distance</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    50+ miles
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            leftIcon={showAdvanced ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </Button>
          
          {showAdvanced && (
            <div className="mt-4 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Allocate Budget by Category
                </h4>
                
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg" 
                           style={{ backgroundColor: `${category.color}20` }}>
                        <span style={{ color: category.color }}>
                          {ICONS[category.icon]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {category.name}
                        </p>
                      </div>
                      <div className="w-24">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="block w-full pl-7 pr-12 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                            value={categoryBudgets[category.id] || 0}
                            onChange={(e) => handleCategoryBudgetChange(category.id, e.target.value)}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 text-xs">
                              {calculateCategoryPercentage(category.id)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Allocated</span>
                    <span className="text-sm font-medium">
                      ${remainingBudget.toFixed(2)}
                    </span>
                  </div>
                  
                  {budgetDifference !== 0 && (
                    <div className={`mt-1 text-sm ${budgetDifference > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {budgetDifference > 0 
                        ? `$${Math.abs(budgetDifference).toFixed(2)} remaining to allocate`
                        : `$${Math.abs(budgetDifference).toFixed(2)} over budget`}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex items-center">
                  <span className="mr-2">{ICONS.AlertTriangle}</span>
                  Budget Allocation Tips
                </h4>
                <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Local moves typically spend more on labor and truck rentals</li>
                  <li>• Long-distance moves have higher transportation and fuel costs</li>
                  <li>• Don't forget to budget for packing supplies and insurance</li>
                  <li>• Keep some funds aside for unexpected expenses</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting || (showAdvanced && Math.abs(budgetDifference) > 0.01)}
            title={showAdvanced && Math.abs(budgetDifference) > 0.01 ? 'Please allocate the entire budget' : ''}
          >
            Save Budget
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetSetup;
