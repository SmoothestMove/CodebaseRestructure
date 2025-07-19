import React from 'react';
import { Category, Expense } from '../types/types';
import { ICONS } from '../constants/constants';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  expense: Expense | null;
  categories: Category[];
  formatDate: (dateString: string) => string;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  expense,
  categories,
  formatDate,
}) => {
  if (!expense) return null;

  const category = categories.find(c => c.id === expense.categoryId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense Details">
      <div className="space-y-4">
          {expense.receiptImageBase64 && (
            <div className="mb-4 text-center">
              <img
                src={`data:image/jpeg;base64,${expense.receiptImageBase64}`}
                alt="Receipt"
                className="rounded-lg max-h-60 w-auto mx-auto border-2 border-slate-700"
              />
            </div>
          )}

          <div className="flex justify-between items-baseline bg-slate-900/50 p-3 rounded-lg">
            <span className="text-sm text-slate-400">Merchant:</span>
            <span className="text-lg font-semibold text-white">{expense.merchantName}</span>
          </div>

          <div className="flex justify-between items-baseline bg-slate-900/50 p-3 rounded-lg">
            <span className="text-sm text-slate-400">Amount:</span>
            <span className="text-lg font-bold text-green-400">${expense.amount.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Date:</div>
                <div className="text-base text-slate-200">{formatDate(expense.date)}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Category:</div>
                <div className="flex items-center gap-2 text-base text-slate-200">
                    {category && <span style={{ color: category.color }}>{ICONS[category.icon]}</span>}
                    <span>{category?.name || 'N/A'}</span>
                </div>
            </div>
          </div>
          
          {expense.description && (
            <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Description:</div>
                <p className="text-base text-slate-300 whitespace-pre-wrap">{expense.description}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-700">
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this expense?')) {
                onDelete(expense.id);
                onClose();
              }
            }}
            leftIcon={ICONS.Trash}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onEdit(expense);
              onClose();
            }}
            leftIcon={ICONS.Edit}
          >
            Edit
          </Button>
        </div>
    </Modal>
  );
};

export default ExpenseDetailModal;
