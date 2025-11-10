import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaEdit, FaFilter, FaDownload, FaShare, FaCog, FaSearch } from 'react-icons/fa';
import Button from '@/components/common/Button';
import { shouldReduceMotion } from '@/lib/animations';

/**
 * @interface ContextualAction
 * @description Defines the properties for a contextual action.
 */
interface ContextualAction {
  /** The unique identifier for the action. */
  id: string;
  /** The label for the action. */
  label: string;
  /** The icon for the action. */
  icon: React.ReactNode;
  /** The callback function to be called when the action is clicked. */
  onClick: () => void;
  /** The visual variant of the action button. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Whether to show the action. */
  show?: boolean;
  /** Whether the action is disabled. */
  disabled?: boolean;
}

/**
 * @interface ContextualNavigationProps
 * @description Defines the properties for the ContextualNavigation component.
 */
interface ContextualNavigationProps {
  /** An optional override for the automatically detected page context. */
  pageContext?: string;
  /** An array of additional custom actions. */
  customActions?: ContextualAction[];
  /** Whether to show the back button. */
  showBackButton?: boolean;
  /** An optional custom callback function for the back button. */
  onBack?: () => void;
  /** The title of the current page for the breadcrumb. */
  pageTitle?: string;
  /** Whether to show the breadcrumb navigation. */
  showBreadcrumb?: boolean;
}

/**
 * A component that provides dynamic navigation based on the current page context.
 * It displays relevant actions and navigation options for the current route.
 * @param {ContextualNavigationProps} props - The properties for the ContextualNavigation component.
 * @returns {JSX.Element} The rendered ContextualNavigation component.
 */
const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  pageContext,
  customActions = [],
  showBackButton = false,
  onBack,
  pageTitle,
  showBreadcrumb = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect current page context from route
  const getCurrentContext = (): string => {
    if (pageContext) return pageContext;
    
    const path = location.pathname;
    if (path.includes('/budget')) return 'budget';
    if (path.includes('/boxes')) return 'boxes';
    if (path.includes('/owners')) return 'owners';
    if (path.includes('/scan')) return 'scan';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const context = getCurrentContext();

  // Generate breadcrumb from current path
  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard
    if (pathSegments.length > 1) {
      breadcrumbs.push({ label: 'Dashboard', path: '/app' });
    }

    // Map path segments to readable names
    const segmentMap: Record<string, string> = {
      app: 'Dashboard',
      budget: 'Financial Navigator',
      boxes: 'Box Management',
      owners: 'Owner Management',
      scan: 'QR Scanner',
      settings: 'Settings',
    };

    pathSegments.slice(1).forEach((segment, index) => {
      const isLast = index === pathSegments.length - 2;
      const label = segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const path = '/' + pathSegments.slice(0, index + 2).join('/');
      
      if (!isLast) {
        breadcrumbs.push({ label, path });
      }
    });

    return breadcrumbs;
  };

  // Define contextual actions for each page
  const getContextualActions = (): ContextualAction[] => {
    const baseActions: Record<string, ContextualAction[]> = {
      dashboard: [
        {
          id: 'search',
          label: 'Search',
          icon: <FaSearch />,
          onClick: () => {/* Implement global search */},
          variant: 'ghost',
        },
      ],
      budget: [
        {
          id: 'add-expense',
          label: 'Add Expense',
          icon: <FaPlus />,
          onClick: () => {/* Handled by parent component */},
          variant: 'primary',
        },
        {
          id: 'filter',
          label: 'Filter',
          icon: <FaFilter />,
          onClick: () => {/* Toggle filter panel */},
          variant: 'secondary',
        },
        {
          id: 'export',
          label: 'Export',
          icon: <FaDownload />,
          onClick: () => {/* Export budget data */},
          variant: 'ghost',
        },
      ],
      boxes: [
        {
          id: 'add-box',
          label: 'Add Box',
          icon: <FaPlus />,
          onClick: () => navigate('/app/boxes/new'),
          variant: 'primary',
        },
        {
          id: 'scan-qr',
          label: 'Scan QR',
          icon: <FaSearch />,
          onClick: () => navigate('/app/scan'),
          variant: 'secondary',
        },
        {
          id: 'bulk-actions',
          label: 'Bulk Actions',
          icon: <FaEdit />,
          onClick: () => {/* Show bulk action menu */},
          variant: 'ghost',
        },
      ],
      owners: [
        {
          id: 'add-owner',
          label: 'Add Owner',
          icon: <FaPlus />,
          onClick: () => {/* Show add owner modal */},
          variant: 'primary',
        },
        {
          id: 'print-labels',
          label: 'Print Labels',
          icon: <FaDownload />,
          onClick: () => {/* Generate printable labels */},
          variant: 'secondary',
        },
      ],
      scan: [
        {
          id: 'manual-entry',
          label: 'Manual Entry',
          icon: <FaEdit />,
          onClick: () => {/* Show manual box entry form */},
          variant: 'secondary',
        },
      ],
      settings: [
        {
          id: 'export-data',
          label: 'Export Data',
          icon: <FaDownload />,
          onClick: () => {/* Export all data */},
          variant: 'secondary',
        },
        {
          id: 'share-move',
          label: 'Share Move',
          icon: <FaShare />,
          onClick: () => {/* Share move code */},
          variant: 'ghost',
        },
      ],
    };

    return [...(baseActions[context] || []), ...customActions];
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const actions = getContextualActions().filter(action => action.show !== false);
  const breadcrumbs = getBreadcrumb();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.15,
      }
    },
  };

  return (
    <motion.div
      variants={shouldReduceMotion() ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left side - Back button + Breadcrumb */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <motion.div variants={shouldReduceMotion() ? undefined : itemVariants}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  ariaLabel="Go back"
                  className="min-w-[44px] min-h-[44px]"
                >
                  <FaArrowLeft className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Breadcrumb Navigation */}
            {showBreadcrumb && breadcrumbs.length > 0 && (
              <motion.nav 
                variants={shouldReduceMotion() ? undefined : itemVariants}
                className="flex items-center text-sm"
                aria-label="Breadcrumb"
              >
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.path} className="flex items-center">
                      {index > 0 && (
                        <span className="mx-2 text-slate-400 dark:text-slate-500">/</span>
                      )}
                      <button
                        onClick={() => navigate(crumb.path)}
                        className="text-slate-600 dark:text-slate-400 hover:text-brand-tertiary dark:hover:text-orange-400 transition-colors font-medium"
                      >
                        {crumb.label}
                      </button>
                    </li>
                  ))}
                  {pageTitle && (
                    <>
                      <span className="mx-2 text-slate-400 dark:text-slate-500">/</span>
                      <span className="text-slate-900 dark:text-slate-100 font-semibold">
                        {pageTitle}
                      </span>
                    </>
                  )}
                </ol>
              </motion.nav>
            )}
          </div>

          {/* Right side - Contextual actions */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="popLayout">
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  variants={shouldReduceMotion() ? undefined : itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  custom={index}
                >
                  <Button
                    variant={action.variant || 'secondary'}
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    leftIcon={action.icon}
                    className="min-h-[40px]"
                    ariaLabel={action.label}
                  >
                    <span className="hidden sm:inline">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContextualNavigation;