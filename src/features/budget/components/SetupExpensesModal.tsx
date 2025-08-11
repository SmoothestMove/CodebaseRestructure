import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Category, MoveType } from '../types/types';
import { INITIAL_CATEGORIES, BUDGET_TEMPLATES, ICONS } from '../constants/constants';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface SetupExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (categories: Category[], totalBudget: number) => void;
  totalBudget: number;
  moveType: MoveType;
}

const SetupExpensesModal: React.FC<SetupExpensesModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  totalBudget,
  moveType,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize categories with template when modal opens
  useEffect(() => {
    if (isOpen && totalBudget > 0) {
      const template = BUDGET_TEMPLATES[moveType === MoveType.LOCAL ? 'LOCAL' : 'LONG_DISTANCE'];
      
      const categoriesWithBudgets = INITIAL_CATEGORIES.map(category => ({
        ...category,
        estimatedAmount: template[category.id] 
          ? (totalBudget * template[category.id]) / 100 
          : 0
      }));
      
      setCategories(categoriesWithBudgets);
    }
  }, [isOpen, totalBudget, moveType]);

  const handleCategoryAmountChange = (categoryId: string, amount: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, estimatedAmount: Math.max(0, amount) }
        : cat
    ));
  };

  const addNewCategory = () => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      estimatedAmount: 0,
      color: '#3b82f6',
      icon: 'HelpCircle',
      deletable: true
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleSetBudget = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate that we have at least one category with a budget
      const hasValidCategories = categories.some(cat => cat.estimatedAmount > 0);
      
      if (!hasValidCategories) {
        toast.error('Please set at least one category budget greater than $0');
        return;
      }

      onComplete(categories, totalBudget);
      onClose(); // Close the modal after successful completion
      toast.success('Budget setup completed successfully!');
    } catch (error) {
      console.error('Error completing budget setup:', error);
      toast.error('Failed to complete budget setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEstimatedExpenses = categories.reduce((acc, cat) => acc + cat.estimatedAmount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      subtitle=""
      size="lg"
    >
      <div className="max-w-2xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl text-center border border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Came with a roadmap or let us take the wheel?
        </h2>
        <p className="text-slate-400 mb-2">
          Either way, you're the Captain now.
        </p>
        <p className="text-slate-400 text-sm mb-6">
          These estimates set the course for your Financial Navigator—steer, tweak, or reroute however you like. It's your money, use it how you need it!
        </p>

        <div className="space-y-3 text-left">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span style={{ color: cat.color }} className="text-xl">
                  {ICONS[cat.icon as keyof typeof ICONS] || ICONS.HelpCircle}
                </span>
                <p className="font-medium text-slate-200">{cat.name}</p>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-0">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={cat.estimatedAmount.toFixed(2)}
                  onChange={(e) => handleCategoryAmountChange(cat.id, parseFloat(e.target.value) || 0)}
                  className="block w-24 bg-transparent text-right text-white text-sm placeholder:text-slate-500 focus:ring-0 focus:outline-none p-0 pl-3"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addNewCategory}
          className="mt-6 w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
        >
          <FaPlus /> Add New Category
        </button>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <p className="font-bold text-white">Total Estimated Expenses</p>
          </div>
          <p className="text-2xl font-bold text-white">$ {totalEstimatedExpenses.toFixed(2)}</p>
        </div>

        <button
          onClick={handleSetBudget}
          disabled={isSubmitting}
          className="mt-6 w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Setting Budget...' : 'Set Budget'}
        </button>
      </div>
    </Modal>
  );
};

export default SetupExpensesModal;