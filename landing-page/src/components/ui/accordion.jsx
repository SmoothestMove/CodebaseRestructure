'use client';

import { cn } from '@/lib/utils';
import React, { createContext, useContext, useState } from 'react';

const AccordionContext = createContext(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an AccordionProvider');
  }
  return context;
}

function AccordionProvider({ children }) {
  const [expandedValue, setExpandedValue] = useState(null);

  const toggleItem = (value) => {
    setExpandedValue((current) => (current === value ? null : value));
  };

  return (
    <AccordionContext.Provider value={{ expandedValue, toggleItem }}>
      {children}
    </AccordionContext.Provider>
  );
}

function Accordion({ children, className }) {
  return (
    <div className={cn('relative', className)} aria-orientation='vertical'>
      <AccordionProvider>{children}</AccordionProvider>
    </div>
  );
}

function AccordionItem({ value, children, className }) {
  const { expandedValue, toggleItem } = useAccordion();
  const isExpanded = value === expandedValue;

  return (
    <div className={cn('overflow-hidden', className)} data-expanded={isExpanded || undefined}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          expanded: isExpanded,
          onToggle: () => toggleItem(value),
        })
      )}
    </div>
  );
}

function AccordionTrigger({ children, className, onToggle, expanded }) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={expanded}
      type='button'
      className={cn('group w-full text-left', className)}
      data-expanded={expanded || undefined}
    >
      {children}
    </button>
  );
}

function AccordionContent({ children, expanded, className }) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-200 ease-out',
        className
      )}
      style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      aria-hidden={!expanded}
    >
      <div className='overflow-hidden'>{children}</div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
