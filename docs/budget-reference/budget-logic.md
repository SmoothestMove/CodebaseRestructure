# Budget Logic & UI Overview

## User Flow: Budget Setup
- When the user first clicks the budget button (or accesses the budget feature), the app checks if a budget is set.
- If not, a setup modal appears, prompting the user to:
  - Enter a total budget amount
  - Select a move type (e.g., Local Move)
  - (Optionally) Enter category-specific budgets in advanced mode
- On save, the budget and move type (and category budgets if set) are persisted.

## How Budget Data is Used
- The budget data is stored using a persistent reducer (state is saved to local storage).
- This data is used for:
  - Calculating remaining budget
  - Displaying charts and summaries
  - Managing categories and expenses

## Key Files
- **Budget Setup Logic:**
  - `components/budget/BudgetSetup.tsx`: The setup modal and form logic for initial budget configuration
  - `components/budget/FinancialNavigator.tsx`: Controls when setup appears and manages budget state
  - `components/budget/hooks/usePersistentReducer.ts`: Persists state to local storage
- **Main Budget Page UI:**
  - `app/(tabs)/budget/page.tsx`: Main budget page component
  - `components/budget/BudgetPage.tsx`: Entry point for the budget UI components
  - `components/budget/FinancialNavigator.tsx`: Main budget management and display logic
  - `components/budget/ExpenseList.tsx`: Displays the list of expenses
  - `components/budget/ExpenseForm.tsx`: Form for adding/editing expenses
  - `components/budget/BudgetSummary.tsx`: Shows budget overview and progress
  - `components/budget/CategoryBudget.tsx`: Manages individual category budgets
- **Supporting UI Components:**
  - `components/budget/ui/` (directory containing reusable UI components)
    - `Button.tsx`
    - `Card.tsx`
    - `Input.tsx`
    - `Modal.tsx`
- **Supporting Files:**
  - `types/budget.ts`: TypeScript types for budget, category, move type
  - `constants/budget.ts`: Budget templates, icons, and constants

## Calculation Logic
- Total budget and move type are set by the user in setup
- Category budgets (if used) are set per category in advanced mode
- All calculations (remaining, spent, etc.) use this persisted state

---

This file provides a quick reference for how the budget setup is intended to work and which files are involved. For details, see the specific files listed above.
