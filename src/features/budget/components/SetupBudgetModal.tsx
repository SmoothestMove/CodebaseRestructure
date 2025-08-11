import React, { useState, useEffect } from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { MoveType } from '../types/types';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface SetupBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (totalBudget: number, moveType: MoveType, shouldAutoSetupCategories?: boolean) => void;
}

const SetupBudgetModal: React.FC<SetupBudgetModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedCard, setSelectedCard] = useState<'do' | 'dont' | null>(null);
  const [selectedMoveType, setSelectedMoveType] = useState<MoveType | ''>('');
  const [totalBudget, setTotalBudget] = useState('');
  const [showTooltip, setShowTooltip] = useState<'do' | 'dont' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleCardSelect = (cardType: 'do' | 'dont') => {
    if (selectedCard === cardType) {
      // Clicking the same card deselects it
      setSelectedCard(null);
      // Clear the form data when deselecting "Those That Don't"
      if (cardType === 'dont') {
        setSelectedMoveType('');
        setTotalBudget('');
      }
    } else {
      // Clicking a different card selects it
      setSelectedCard(cardType);
      // Clear form data when switching away from "Those That Don't"
      if (selectedCard === 'dont' && cardType === 'do') {
        setSelectedMoveType('');
        setTotalBudget('');
      }
    }
  };

  const isCreateButtonEnabled = () => {
    if (selectedCard === 'do') return true;
    if (selectedCard === 'dont') return selectedMoveType && totalBudget;
    return false;
  };

  const handleSubmit = async () => {
    if (!isCreateButtonEnabled()) return;

    setIsSubmitting(true);
    
    try {
      if (selectedCard === 'do') {
        // For "Those That Do", use a default budget and let them set up categories manually
        onSubmit(1000, MoveType.LOCAL, false); // Default $1000 budget, they'll adjust in next step
      } else if (selectedCard === 'dont') {
        // For "Those That Don't", use their inputs and auto-setup categories
        const budgetAmount = parseFloat(totalBudget.replace(/[^0-9.]/g, ''));
        if (isNaN(budgetAmount) || budgetAmount <= 0) {
          toast.error('Please enter a valid budget amount');
          return;
        }
        
        const moveType = selectedMoveType as MoveType;
        onSubmit(budgetAmount, moveType, true); // true indicates auto-setup categories
      }
      
      onClose();
      toast.success('Budget setup initiated!');
    } catch (error) {
      console.error('Error setting up budget:', error);
      toast.error('Failed to set up budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCard(null);
      setSelectedMoveType('');
      setTotalBudget('');
      setShowTooltip(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Let's set up your budget!"
      subtitle="There are two types of people when it comes to budgeting: Those that do and those that don't. Which one are you?"
      size="lg"
    >
      <div className="space-y-6">
        {/* Cards */}
        <div className="space-y-4">
          {/* Those That Do Card */}
          <div className="relative animate-in fade-in-0 slide-in-from-left-6 duration-700 delay-500">
            <button
              onClick={() => handleCardSelect('do')}
              className={`w-full p-6 rounded-xl text-left transition-all duration-300 transform border ${
                selectedCard === 'do'
                  ? 'bg-white dark:bg-slate-700 ring-2 ring-brand-tertiary shadow-xl border-brand-tertiary scale-[1.02]'
                  : selectedCard === 'dont'
                  ? 'bg-slate-200 dark:bg-slate-800 opacity-60 scale-95 shadow-md border-slate-300 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 hover:scale-[1.01] hover:shadow-xl border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 active:scale-[0.99]'
              }`}
            >
              <h3 className="text-xl font-semibold mb-3 text-center transition-all duration-300 text-slate-900 dark:text-slate-100">
                Those That Do
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm text-center leading-relaxed transition-all duration-300">
                Did your homework? Smooth move, just tap the "Create Budget" button at the bottom and get started.
              </p>
            </button>
            
            {/* Tooltip for Those That Do */}
            <button 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-all duration-200 hover:scale-125 bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-white/10 hover:border-white/30 shadow-md"
              onMouseEnter={() => setShowTooltip('do')}
              onMouseLeave={() => setShowTooltip(null)}
              onClick={() => setShowTooltip(showTooltip === 'do' ? null : 'do')}
            >
              <FaInfoCircle className="w-4 h-4" />
            </button>
            {showTooltip === 'do' && (
              <div className="absolute top-12 right-4 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-lg z-10 w-56 border border-slate-600 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <div className="font-medium mb-1">Ready to roll?</div>
                <div className="text-gray-300">Perfect for when you've already gotten quotes or done your research. You'll add each cost yourself on the next screen.</div>
              </div>
            )}
          </div>

          {/* Those That Don't Card */}
          <div className="relative animate-in fade-in-0 slide-in-from-right-6 duration-700 delay-600">
            <div
              className={`w-full p-6 rounded-xl transition-all duration-300 transform border ${
                selectedCard === 'dont'
                  ? 'bg-white dark:bg-slate-700 ring-2 ring-brand-tertiary shadow-xl border-brand-tertiary scale-[1.02]'
                  : selectedCard === 'do'
                  ? 'bg-slate-200 dark:bg-slate-800 opacity-60 scale-95 shadow-md border-slate-300 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-700 hover:scale-[1.01] hover:shadow-xl border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <button
                onClick={() => handleCardSelect('dont')}
                className="w-full text-left transition-all duration-200 active:scale-[0.99]"
              >
                <h3 className="text-xl font-semibold mb-3 text-center transition-all duration-300 text-slate-900 dark:text-slate-100">
                  Those That Don't
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm text-center leading-relaxed mb-4 transition-all duration-300">
                  No idea? No worries! We're here to help, not judge. Choose your distance, enter your estimated total and tap "Create Budget". We'll get you started.
                </p>
              </button>

              {/* Interactive elements for "Those That Don't" */}
              <div className={`overflow-hidden transition-all duration-500 ease-out ${
                selectedCard === 'dont' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-4 mt-4">
                  {/* Move Type Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedMoveType(MoveType.LOCAL)}
                      className={`p-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md backdrop-blur-sm border border-white/10 active:scale-95 ${
                        selectedMoveType === MoveType.LOCAL
                          ? 'bg-brand-tertiary text-white shadow-lg shadow-brand-tertiary/40 border-brand-tertiary/50'
                          : 'bg-slate-500/70 text-slate-300 dark:text-slate-300 hover:bg-slate-400/80 hover:shadow-lg hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium text-sm">Local Move</div>
                      <div className="text-xs opacity-75">Under 100 miles</div>
                    </button>
                    <button
                      onClick={() => setSelectedMoveType(MoveType.CROSS_STATE)}
                      className={`p-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md backdrop-blur-sm border border-white/10 active:scale-95 ${
                        selectedMoveType === MoveType.CROSS_STATE
                          ? 'bg-brand-tertiary text-white shadow-lg shadow-brand-tertiary/40 border-brand-tertiary/50'
                          : 'bg-slate-500/70 text-slate-300 dark:text-slate-300 hover:bg-slate-400/80 hover:shadow-lg hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium text-sm">Long Distance</div>
                      <div className="text-xs opacity-75">100+ miles</div>
                    </button>
                  </div>

                  {/* Total Budget Input */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-400 text-sm transition-all duration-200">$</span>
                    <input
                      type="text"
                      placeholder="Enter total amount"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 pl-8 pr-3 py-3 rounded-lg text-sm border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary placeholder-slate-400 dark:placeholder-slate-400 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tooltip for Those That Don't */}
            <button 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-all duration-200 hover:scale-125 bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-white/10 hover:border-white/30 shadow-md"
              onMouseEnter={() => setShowTooltip('dont')}
              onMouseLeave={() => setShowTooltip(null)}
              onClick={() => setShowTooltip(showTooltip === 'dont' ? null : 'dont')}
            >
              <FaInfoCircle className="w-4 h-4" />
            </button>
            {showTooltip === 'dont' && (
              <div className="absolute top-12 right-4 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-lg z-10 w-56 border border-slate-600 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <div className="font-medium mb-1">Need a starting point?</div>
                <div className="text-gray-300">We've helped thousands of people move! Based on your move type and budget, we'll suggest realistic amounts for each category.</div>
              </div>
            )}
          </div>
        </div>

        {/* Create Budget Button */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isCreateButtonEnabled() || isSubmitting}
            isLoading={isSubmitting}
          >
            Create Budget
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SetupBudgetModal;