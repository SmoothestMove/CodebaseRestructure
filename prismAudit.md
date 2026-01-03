# Palette's Design & UX Audit Report

This report details findings from a comprehensive audit of the "Smooth Moves" codebase, focusing on accessibility, design system consistency, and modern UX best practices.

## Global Issues

*Issues that affect the entire application, such as missing design tokens or inconsistent global styles.*

### [ID-001] Missing Tailwind CSS Configuration
**Location:** Project Root
**Severity:** 🔴 Critical
**The Issue:**
The project is missing a `tailwind.config.ts` (or `.js`) file in the root directory. Configuration files were found in an `Archives` directory, indicating they are not in use. This means the application is relying on the default, un-customized Tailwind CSS theme.
**Why it matters:**
Without a centralized theme configuration, the application cannot enforce design consistency. This leads to a fragmented user experience where colors, spacing, typography, and other design elements are inconsistent across different screens and components. It also makes the application significantly harder to maintain and scale, as any future design changes would require manual updates in countless files.
**Recommended Fix:**
Create a `tailwind.config.ts` file in the project root. Define a comprehensive design system with custom tokens for colors, spacing, typography, border-radius, and shadows that align with the application's intended brand and style. After defining the system, gradually refactor existing components to use these new tokens (e.g., `bg-primary` instead of `bg-blue-500`) to ensure a consistent and maintainable codebase.

```ts
// Example: tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2', // Example brand color
        secondary: '#50E3C2',
        accent: '#F5A623',
        'text-main': '#333333',
        'text-subtle': '#666666',
        'background-main': '#FFFFFF',
        'background-alt': '#F4F4F4',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      }
    },
  },
  plugins: [],
} satisfies Config
```

---

## Component-Specific Issues

*Detailed findings for individual components like buttons, forms, and modals.*

### [ID-002] Button Component Uses Hardcoded Colors
**Location:** `src/components/common/Button/index.tsx` (Lines 60-66)
**Severity:** 🟡 Moderate
**The Issue:**
The `Button` component's `variantStyles` rely on a mix of non-existent theme variables (e.g., `bg-brand-tertiary`) and hardcoded default Tailwind colors (e.g., `bg-red-600`, `dark:bg-orange-500`). This indicates an attempt to use a design system that is not properly configured, as established in **[ID-001]**.
**Why it matters:**
This leads to inconsistent button styling across the application. Buttons intended to be "primary" or "secondary" may render incorrectly or fall back to default styles, breaking the visual language. It also makes the component difficult to theme or update, as colors are scattered throughout the code instead of being managed in a central configuration file.
**Recommended Fix:**
First, implement the fix for **[ID-001]** by creating a `tailwind.config.ts`. Then, refactor the `variantStyles` to exclusively use the newly defined design tokens. This ensures all buttons are consistently styled and can be managed from a single source of truth.

```tsx
// Current (Bad)
const variantStyles = {
  primary: "bg-brand-tertiary hover:bg-brand-tertiary-dark text-white focus:ring-brand-tertiary/50 dark:bg-orange-500...",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400...",
  // ... and so on
};

// Recommended (Good - after tailwind.config.ts is set up)
const variantStyles = {
  primary: "bg-primary hover:bg-primary-dark text-text-on-primary focus:ring-primary/50",
  secondary: "bg-secondary hover:bg-secondary-dark text-text-on-secondary focus:ring-secondary/50",
  danger: "bg-danger hover:bg-danger-dark text-text-on-danger focus:ring-danger/50",
  // ... etc., using tokens defined in the theme
};
```

### [ID-005] Native Browser Alert for "Forgot Password"
**Location:** `src/features/auth/pages/AuthPage.tsx` (Lines 606-613)
**Severity:** 🟡 Moderate
**The Issue:**
The "Forgot password?" link triggers a native browser `alert()` dialog. Native alerts are visually jarring, cannot be styled to match the application's UI, and are often blocked by modern browsers.
**Why it matters:**
This creates a disruptive and unprofessional user experience. It breaks the flow of the application and looks like a placeholder or an error. A modern web application should use its own UI components (like a modal or a toast notification) for user feedback.
**Recommended Fix:**
Replace the `alert()` with a styled, non-blocking notification component, such as a toast or an inline alert message. This provides a more integrated and user-friendly experience.

```tsx
// Current (Bad)
<Link
  to="#"
  onClick={(e) => {
    e.preventDefault();
    alert("Forgot password functionality not implemented yet.");
  }}
  // ...
>
  Forgot password?
</Link>

// Recommended (Good - using a toast notification library)
import { toast } from 'react-toastify'; // Assuming react-toastify is available

<Link
  to="#"
  onClick={(e) => {
    e.preventDefault();
    toast.info("Forgot password functionality is not yet implemented.");
  }}
  // ...
>
  Forgot password?
</Link>
```

### [ID-006] Inconsistent Focus Styles on Radio Buttons
**Location:** `src/features/auth/pages/AuthPage.tsx` (Lines 491-500)
**Severity:** 🔵 Polish
**The Issue:**
The radio buttons for "Start a New Move" and "Join an Existing Move" have a visible focus ring that is inconsistent with the custom focus rings defined on other interactive elements like buttons (`focus:ring-brand-tertiary`). The radio buttons are using the browser's default outline.
**Why it matters:**
While the element is focusable, the inconsistency in focus styles creates a less polished and visually fragmented experience. A cohesive design system should have a single, recognizable focus style for all interactive elements to clearly indicate to keyboard users where they are on the page.
**Recommended Fix:**
Apply the same Tailwind focus ring utilities to the radio inputs that are used on the application's buttons. This will create a consistent and predictable visual language for interactivity.

```tsx
// Current (Bad)
<input
  type="radio"
  // ...
  className="h-4 w-4 text-brand-tertiary dark:text-orange-400 border-slate-300 dark:border-slate-600 focus:ring-brand-tertiary dark:focus:ring-orange-400 dark:bg-slate-700"
/>

// Recommended (Good)
<input
  type="radio"
  // ...
  className="h-4 w-4 text-brand-tertiary dark:text-orange-400 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-tertiary dark:focus:ring-orange-400 dark:bg-slate-700"
/>
```

### [ID-007] Hardcoded "Magic Numbers" in Layout
**Location:** `src/components/layout/Header/index.tsx` (Lines 169-172)
**Severity:** 🔵 Polish
**The Issue:**
The main navigation component (`Navbar`) uses several hardcoded values for sizing and positioning that are not part of a standard spacing scale. For example, the special "Scan" button in the mobile navigation is styled with `border-3` and `transform: 'translateY(-16px)'`. The `3px` border is a non-standard value, and the negative translate is a "magic number" that could be fragile to future layout changes.
**Why it matters:**
Using values outside of a defined design system (even a default one) leads to visual inconsistencies and makes the UI harder to maintain. If a global change is needed for spacing or borders, these one-off values will be missed, leading to a fragmented design.
**Recommended Fix:**
Refactor these hardcoded values to use standard Tailwind CSS classes or, preferably, design tokens defined in a `tailwind.config.ts` file. For the border, choose the closest standard width like `border-2` or `border-4`. For the vertical translation, use a Tailwind class like `-translate-y-4` (which corresponds to `16px`).

```tsx
// Current (Bad)
<div
  className={`... border-3 border-white ...`}
  style={{ transform: 'translateY(-16px)' }}
>
  {/* ... */}
</div>

// Recommended (Good)
<div
  className={`... border-4 border-white -translate-y-4 ...`}
>
  {/* ... */}
</div>
```

---

## Accessibility Violations

*Issues related to WCAG standards, keyboard navigation, and screen reader support.*

### [ID-004] Incorrect Use of Semantic HTML for Tabs
**Location:** `src/features/auth/pages/AuthPage.tsx` (Lines 438-456)
**Severity:** 🔴 Critical
**The Issue:**
The tabs for "Sign In" and "Register" are implemented using `<button>` elements. While this is better than using a `div`, the component is missing the appropriate ARIA roles (`tablist`, `tab`, `tabpanel`) to be properly understood by assistive technologies. Screen readers will announce them as simple buttons, not as a connected set of tabs, which makes the interface confusing to navigate.
**Why it matters:**
Using correct semantic HTML and ARIA roles is fundamental to accessibility. When a user with a screen reader encounters a set of controls that look like tabs, they expect them to behave like tabs. The current implementation breaks this expectation, violating WCAG 4.1.2 (Name, Role, Value).
**Recommended Fix:**
Refactor the tab component to use the proper ARIA roles. The parent container should have `role="tablist"`, each button should have `role="tab"` and `aria-selected`, and the content container that it controls should have `role="tabpanel"`.

```tsx
// Current (Bad)
<div className="mb-6 flex border-b border-slate-200 dark:border-slate-700">
  <button onClick={() => handleTabChange("signin")} ...>Sign In</button>
  <button onClick={() => handleTabChange("register")} ...>Register</button>
</div>

// Recommended (Good)
<div role="tablist" className="mb-6 flex border-b border-slate-200 dark:border-slate-700">
  <button
    role="tab"
    aria-selected={activeTab === 'signin'}
    onClick={() => handleTabChange("signin")}
    // ... other props
  >
    Sign In
  </button>
  <button
    role="tab"
    aria-selected={activeTab === 'register'}
    onClick={() => handleTabChange("register")}
    // ... other props
  >
    Register
  </button>
</div>
// NOTE: The form content should be wrapped in an element with role="tabpanel"
```

### [ID-008] Missing ARIA Landmark Roles for Navigation
**Location:** `src/components/layout/Header/index.tsx`
**Severity:** 🟡 Moderate
**The Issue:**
The component uses `<aside>` and `<nav>` HTML5 elements, which carry some semantic meaning. However, it lacks explicit ARIA landmark roles and accessible names. For a user on a screen reader, the primary navigation regions are not clearly identified as "main navigation" or "mobile navigation."
**Why it matters:**
Landmark roles allow assistive technology users to quickly understand the structure of a page and jump to key sections. Without a clearly labeled navigation landmark, users have to manually tab through all the links to understand the layout, which is a frustrating and inefficient experience (WCAG 1.3.1 Info and Relationships).
**Recommended Fix:**
Add `role="navigation"` and a descriptive `aria-label` to the primary navigation containers to clearly define them as landmarks for assistive technologies.

```tsx
// Current (Bad)
<aside className="hidden md:flex ...">
  {/* ... */}
</aside>
<nav className="md:hidden fixed bottom-0 ...">
  {/* ... */}
</nav>

// Recommended (Good)
<aside
  role="navigation"
  aria-label="Main Navigation"
  className="hidden md:flex ..."
>
  {/* ... */}
</aside>
<nav
  role="navigation"
  aria-label="Mobile Navigation"
  className="md:hidden fixed bottom-0 ..."
>
  {/* ... */}
</nav>
```

### [ID-003] Icon Buttons Can Be Created Without Accessible Names
**Location:** `src/components/common/Button/index.tsx`
**Severity:** 🟡 Moderate
**The Issue:**
The `Button` component has an `icon` size variant. However, it's possible for a developer to use this variant without providing a visible text label (children) or an `aria-label`. This results in a button that is completely inaccessible to screen reader users, who will not know its function.
**Why it matters:**
Interactive elements like buttons must have an accessible name. Without one, users who rely on assistive technology cannot operate the interface, which is a significant accessibility failure (WCAG 4.1.2 Name, Role, Value).
**Recommended Fix:**
While programmatically enforcing the presence of an `aria-label` can be complex, the component can be improved by adding a developer-facing warning in the JSDoc and prioritizing the `aria-label` prop when no children are provided.

```tsx
// Recommended (Good) - Add a clear warning in the component's JSDoc
/**
 * @warning When using the 'icon' size, you MUST provide an `aria-label`
 * if there are no visible children to ensure accessibility.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  ariaLabel,
  // ... other props
}) => {
  // ...
  return (
    <motion.button
      // Use ariaLabel as the primary label if children are absent
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {/* ... */}
    </motion.button>
  );
};
```
