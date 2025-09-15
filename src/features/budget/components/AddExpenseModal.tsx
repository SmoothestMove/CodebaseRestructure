// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category } from '../types/types';
import { ICONS } from '../constants/constants';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Textarea from '@/components/common/Textarea';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void;
  categories: Category[];
  initialData?: Expense | null;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    categoryId: categories.length > 0 ? categories[0].id : '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    merchantName: '',
    description: '',
    receiptImageBase64: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize form with initialData if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        categoryId: initialData.categoryId,
        amount: initialData.amount,
        date: initialData.date,
        merchantName: initialData.merchantName,
        description: initialData.description || '',
        receiptImageBase64: initialData.receiptImageBase64 || '',
      });
      
      if (initialData.receiptImageBase64) {
        setReceiptPreview(`data:image/jpeg;base64,${initialData.receiptImageBase64}`);
      }
    } else {
      // Reset form for new expense
      setFormData({
        categoryId: categories.length > 0 ? categories[0].id : '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        merchantName: '',
        description: '',
        receiptImageBase64: '',
      });
      setReceiptPreview(null);
      setErrors({});
    }
  }, [initialData, isOpen, categories]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.merchantName.trim()) {
      newErrors.merchantName = 'Merchant name is required';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        // Update existing expense
        onSubmit({
          ...initialData,
          ...formData,
        });
      } else {
        // Add new expense
        onSubmit(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onloadend = () => {
      // Convert image to base64 string
      const base64String = (reader.result as string).split(',')[1];
      setFormData(prev => ({
        ...prev,
        receiptImageBase64: base64String,
      }));
      
      // Set preview
      setReceiptPreview(reader.result as string);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveReceipt = () => {
    setFormData(prev => ({
      ...prev,
      receiptImageBase64: '',
    }));
    setReceiptPreview(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData(prev => ({
      ...prev,
      categoryId,
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={initialData ? 'Edit Expense' : 'Add New Expense'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Merchant Name"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleInputChange}
              error={errors.merchantName}
              placeholder="e.g. Home Depot, U-Haul"
              required
            />
          </div>
          
          <div>
            <Input
              label="Amount ($)"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.amount || ''}
              onChange={handleInputChange}
              error={errors.amount}
              placeholder="0.00"
              required
  
            />
          </div>
          
          <div>
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              error={errors.date}
              required
            />
          </div>
          
          <div>
            <Select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleCategorySelect}
              options={categories.map(cat => ({
                value: cat.id,
                label: cat.name,
              }))}
              required
            />
          </div>
        </div>
        
        <div>
          <Textarea
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add any additional details about this expense"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Receipt (Optional)
          </label>
          
          {receiptPreview ? (
            <div className="mt-2">
              <div className="relative inline-block">
                <img 
                  src={receiptPreview} 
                  alt="Receipt preview" 
                  className="h-32 w-auto rounded-lg border border-slate-300 dark:border-slate-600"
                />
                <button
                  type="button"
                  onClick={handleRemoveReceipt}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove receipt"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v12a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-brand-primary hover:text-brand-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
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
            disabled={isSubmitting}
          >
            {initialData ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;

