import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Category, MoveType } from '../types/types';
import { BUDGET_TEMPLATES, ICONS } from '../constants/constants';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

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
      
      // Save category budgets
      onSaveCategoryBudgets(categoryBudgets);
      
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEstimatedExpenses = Object.values(categoryBudgets).reduce(
    (sum, amount) => sum + amount,
    0
  );
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Ready to set up your budget?"
      subtitle="Start from scratch or choose a move type to get started!"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="text-center">
          <p className="text-slate-400 mb-6">
            Select your move type to get started with budget estimates
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`px-4 py-3 rounded-lg border text-center ${
              moveType === MoveType.LOCAL
                ? 'bg-slate-600 border-slate-500 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setMoveType(MoveType.LOCAL)}
          >
            <div>
              <div className="font-medium">Local Move</div>
              <div className="text-sm text-slate-400">Under 100 miles</div>
            </div>
          </button>
          
          <button
            type="button"
            className={`px-4 py-3 rounded-lg border text-center ${
              moveType === MoveType.CROSS_STATE
                ? 'bg-slate-600 border-slate-500 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setMoveType(MoveType.CROSS_STATE)}
          >
            <div>
              <div className="font-medium">Long Distance</div>
              <div className="text-sm text-slate-400">100+ miles</div>
            </div>
          </button>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span style={{ color: category.color }}>
                    {ICONS[category.icon]}
                  </span>
                </div>
                <span className="text-white font-medium">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="text-white font-medium w-16 text-right bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-white placeholder:opacity-100"
                  value={categoryBudgets[category.id] || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setCategoryBudgets(prev => ({
                      ...prev,
                      [category.id]: value
                    }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
          onClick={() => {
            // Add new category functionality would go here
            toast.info('Add new category functionality coming soon!');
          }}
        >
          + Add New Category
        </button>

        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white font-medium">Total Estimated Expenses</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-white text-xl font-bold">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              className="text-white text-xl font-bold w-20 text-right bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-white placeholder:opacity-100"
              value={totalEstimatedExpenses || ''}
              readOnly
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Setting Budget...' : 'Set Budget'}
        </button>
      </form>
    </Modal>
  );
};

export default BudgetSetup;