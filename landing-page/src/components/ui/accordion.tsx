"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type AccordionContextValue = {
  expandedValue: string | null;
  toggleItem: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

function useAccordion(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an AccordionProvider");
  }
  return context;
}

type AccordionProviderProps = {
  children: ReactNode;
};

function AccordionProvider({ children }: AccordionProviderProps) {
  const [expandedValue, setExpandedValue] = useState<string | null>(null);

  const value = useMemo<AccordionContextValue>(() => ({
    expandedValue,
    toggleItem: (nextValue: string) => {
      setExpandedValue((current) => (current === nextValue ? null : nextValue));
    },
  }), [expandedValue]);

  return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>;
}

type AccordionProps = {
  children: ReactNode;
  className?: string;
};

function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn("relative", className)} aria-orientation="vertical">
      <AccordionProvider>{children}</AccordionProvider>
    </div>
  );
}

type AccordionItemProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

type ToggleableChildProps = {
  expanded?: boolean;
  onToggle?: () => void;
};

function AccordionItem({ value, children, className }: AccordionItemProps) {
  const { expandedValue, toggleItem } = useAccordion();
  const isExpanded = value === expandedValue;

  return (
    <div className={cn("overflow-hidden", className)} data-expanded={isExpanded || undefined}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child;
        }

        return cloneElement(child as ReactElement<ToggleableChildProps>, {
          expanded: isExpanded,
          onToggle: () => toggleItem(value),
        });
      })}
    </div>
  );
}

type AccordionTriggerProps = {
  children: ReactNode;
  className?: string;
} & ToggleableChildProps;

function AccordionTrigger({ children, className, onToggle, expanded = false }: AccordionTriggerProps) {
  return (
    <button
      onClick={onToggle ?? (() => undefined)}
      aria-expanded={expanded}
      type="button"
      className={cn("group w-full text-left", className)}
      data-expanded={expanded || undefined}
    >
      {children}
    </button>
  );
}

type AccordionContentProps = {
  children: ReactNode;
  className?: string;
} & Pick<ToggleableChildProps, "expanded">;

function AccordionContent({ children, expanded = false, className }: AccordionContentProps) {
  return (
    <div
      className={cn("grid transition-[grid-template-rows] duration-200 ease-out", className)}
      style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      aria-hidden={!expanded}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };


