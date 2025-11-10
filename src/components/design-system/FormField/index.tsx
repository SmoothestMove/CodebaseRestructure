import React from 'react';

/**
 * @interface FormFieldProps
 * @description Defines the properties for the FormField component.
 */
export interface FormFieldProps {
  /** The label to be displayed for the form field. */
  label?: string;
  /** The ID of the form field. */
  id?: string;
  /** An error message to be displayed for the form field. */
  error?: string;
  /** Help text to be displayed for the form field. */
  helpText?: string;
  /** Whether the form field is required. */
  required?: boolean;
  /** The layout orientation of the form field. */
  orientation?: 'vertical' | 'horizontal';
  /** The width of the label in a horizontal layout. */
  labelWidth?: string;
  /** Optional additional CSS classes to apply to the form field container. */
  className?: string;
  /** The form control elements to be rendered inside the form field. */
  children: React.ReactNode;
}

/**
 * A component that wraps a form control with a label, error message, and help text.
 * @param {FormFieldProps} props - The properties for the FormField component.
 * @returns {JSX.Element} The rendered FormField component.
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  helpText,
  required = false,
  orientation = 'vertical',
  labelWidth = '120px',
  className = '',
  children,
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`${isHorizontal ? 'flex items-start gap-4' : 'space-y-2'} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={fieldId}
          className={`
            text-sm font-medium text-slate-700 dark:text-slate-300 
            ${isHorizontal ? 'flex-shrink-0 pt-2' : 'block'}
            ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
          `}
          style={isHorizontal ? { width: labelWidth } : undefined}
        >
          {label}
        </label>
      )}

      {/* Field Container */}
      <div className={isHorizontal ? 'flex-1' : 'w-full'}>
        {/* Clone children and add accessibility attributes */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              id: fieldId,
              'aria-describedby': [helpTextId, errorId].filter(Boolean).join(' ') || undefined,
              'aria-invalid': error ? 'true' : 'false',
              'aria-required': required,
              ...child.props,
            });
          }
          return child;
        })}

        {/* Help Text */}
        {helpText && !error && (
          <p
            id={helpTextId}
            className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
          >
            {helpText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

// Specialized FormField components
/**
 * A specialized FormField component with a vertical layout.
 * @param {Omit<FormFieldProps, 'orientation'>} props - The properties for the VerticalFormField component.
 * @returns {JSX.Element} The rendered VerticalFormField component.
 */
export const VerticalFormField: React.FC<Omit<FormFieldProps, 'orientation'>> = (props) => (
  <FormField {...props} orientation="vertical" />
);

/**
 * A specialized FormField component with a horizontal layout.
 * @param {Omit<FormFieldProps, 'orientation'>} props - The properties for the HorizontalFormField component.
 * @returns {JSX.Element} The rendered HorizontalFormField component.
 */
export const HorizontalFormField: React.FC<Omit<FormFieldProps, 'orientation'>> = (props) => (
  <FormField {...props} orientation="horizontal" />
);

// FormGroup for grouping related fields
/**
 * @interface FormGroupProps
 * @description Defines the properties for the FormGroup component.
 */
export interface FormGroupProps {
  /** The title of the form group. */
  title?: string;
  /** A description of the form group. */
  description?: string;
  /** Optional additional CSS classes to apply to the form group container. */
  className?: string;
  /** The FormField components to be rendered inside the form group. */
  children: React.ReactNode;
}

/**
 * A component that groups related form fields.
 * @param {FormGroupProps} props - The properties for the FormGroup component.
 * @returns {JSX.Element} The rendered FormGroup component.
 */
export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  description,
  className = '',
  children,
}) => (
  <fieldset className={`space-y-4 ${className}`}>
    {(title || description) && (
      <legend className="contents">
        {title && (
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {description}
          </p>
        )}
      </legend>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </fieldset>
);

// FormSection for larger form organization
/**
 * @interface FormSectionProps
 * @description Defines the properties for the FormSection component.
 */
export interface FormSectionProps {
  /** The title of the form section. */
  title: string;
  /** A subtitle or description for the form section. */
  subtitle?: string;
  /** Whether the form section is collapsible. */
  collapsible?: boolean;
  /** The initial collapsed state of the form section. */
  defaultCollapsed?: boolean;
  /** Optional additional CSS classes to apply to the form section container. */
  className?: string;
  /** The FormGroup or FormField components to be rendered inside the form section. */
  children: React.ReactNode;
}

/**
 * A component that organizes a form into collapsible sections.
 * @param {FormSectionProps} props - The properties for the FormSection component.
 * @returns {JSX.Element} The rendered FormSection component.
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapsed = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div 
        className={`border-b border-slate-200 dark:border-slate-700 pb-4 ${
          collapsible ? 'cursor-pointer' : ''
        }`}
        onClick={toggleCollapsed}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {collapsible && (
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[44px] min-w-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:ring-opacity-50 rounded"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              <svg
                className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Section Content */}
      {(!collapsible || !isCollapsed) && (
        <div className="space-y-6">
          {children}
        </div>
      )}
    </section>
  );
};

export default FormField;