import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

interface CategorySubNavigationProps {
  category?: {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    primary: string;
    items: Array<{
      to: string;
      label: string;
      icon: React.ComponentType<any>;
      state?: any;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export const CategorySubNavigation: React.FC<CategorySubNavigationProps> = ({
  category,
  isOpen,
  onClose,
  currentPath
}) => {
  if (!category || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-50 md:hidden"
        onClick={onClose}
      />
      
      {/* Sub-Navigation Modal */}
      <div className="fixed bottom-20 left-0 right-0 z-50 md:hidden">
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_12px_rgba(255,255,255,0.05)] rounded-t-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <category.icon className="w-6 h-6 text-brand-tertiary dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {category.label}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {category.items.map((item) => {
                const ItemIcon = item.icon;
                const isActive = currentPath === item.to;
                
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    state={item.state}
                    onClick={onClose}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 min-h-[80px] ${
                      isActive 
                        ? 'bg-brand-tertiary/10 dark:bg-orange-400/10 text-brand-tertiary dark:text-orange-400 border-2 border-brand-tertiary/20 dark:border-orange-400/20' 
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95'
                    }`}
                  >
                    <ItemIcon className={`w-6 h-6 mb-2 ${
                      isActive 
                        ? 'text-brand-tertiary dark:text-orange-400' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`} />
                    <span className={`text-sm font-medium text-center ${
                      isActive 
                        ? 'text-brand-tertiary dark:text-orange-400' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySubNavigation;