import React, { useState, useEffect } from 'react';
import { Category } from '../types/types';
import { ICONS, CATEGORY_ICONS_OPTIONS } from '../constants/constants';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ColorPicker from './ColorPicker';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, 'id'> | Category) => void;
  categories: Category[];
  categoryToEdit?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  categoryToEdit,
}) => {
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    estimatedAmount: 0,
    color: '#3b82f6', // Default blue color
    icon: 'PackingSupplies',
    deletable: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with categoryToEdit if provided (edit mode)
  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        estimatedAmount: categoryToEdit.estimatedAmount,
        color: categoryToEdit.color,
        icon: categoryToEdit.icon,
        deletable: categoryToEdit.deletable ?? true,
      });
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        estimatedAmount: 0,
        color: '#3b82f6',
        icon: 'PackingSupplies',
        deletable: true,
      });
      setErrors({});
    }
  }, [categoryToEdit, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (
      categories.some(
        (cat) => 
          cat.name.toLowerCase() === formData.name.toLowerCase() && 
          (!categoryToEdit || cat.id !== categoryToEdit.id)
      )
    ) {
      newErrors.name = 'A category with this name already exists';
    }
    
    if (formData.estimatedAmount < 0) {
      newErrors.estimatedAmount = 'Amount cannot be negative';
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
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedAmount' ? parseFloat(value) || 0 : value,
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

  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color,
    }));
  };

  const handleIconSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      icon: e.target.value,
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={categoryToEdit ? 'Edit Category' : 'Add New Category'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="e.g. Moving Supplies, Truck Rental"
            required
          />
        </div>
        
        <div>
          <Input
            label="Estimated Budget ($)"
            name="estimatedAmount"
            type="number"
            min="0"
            step="0.01"
            value={formData.estimatedAmount || ''}
            onChange={handleInputChange}
            error={errors.estimatedAmount}
            placeholder="0.00"

          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Color
          </label>
          <ColorPicker 
            color={formData.color} 
            onChange={handleColorChange} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Icon
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${formData.color}20` }}>
              <span style={{ color: formData.color, fontSize: '1.25rem' }}>
                {ICONS[formData.icon]}
              </span>
            </div>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              value={formData.icon}
              onChange={handleIconSelect}
            >
              {CATEGORY_ICONS_OPTIONS.map(iconKey => (
                <option key={iconKey} value={iconKey}>
                  {iconKey}
                </option>
              ))}
            </select>
          </div>
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
            {categoryToEdit ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
