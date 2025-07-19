# Budget Feature: Flow, Logic, and UI Overview

## 1. User Flow

### Accessing the Budget
- When the user clicks the budget button (sidebar, marked by the `FaLandmark` icon), the app checks if a budget is already set.
- **Logic Location:** This check and navigation flow are managed in `FinancialNavigator.tsx`.

### First-Time Setup Prompt
- If no budget exists, a setup modal appears, guiding the user through:
  - Entering a total budget amount
  - Selecting a move type (e.g., Local or Cross-State)
  - (Optional) Entering category-specific budgets in advanced mode
- **Logic Location:** The modal UI and form logic are in `BudgetSetup.tsx`.

### Saving and Applying the Budget & Expenses
- On submission, the app saves the total budget and the calculated category budgets securely to the Firestore database.
- The move type is NOT saved; it is only used during setup to apply a percentage-based budget template for category allocations.
- Budget data is stored as a subcollection under each unique move document, ensuring that each move's budget is only accessible within its own collection and not visible to other moves.
- Any expenses added dynamically by users are also saved within the Firestore database, as part of the move's collection or relevant subcollections.
- All data intended to be shared among members of a move (budgets, expenses, and other collaborative data) is maintained in Firestore, ensuring real-time access and updates for all members of that move.
- If this is the first setup, category budgets are auto-filled using templates that match the chosen move type, but only the resulting values are saved.
- **Logic Location:**
  - Firestore saving and template logic: `FinancialNavigator.tsx` (see `handleSetBudget`, expense management, and related Firestore integration)
  - Firestore security and structure: Firestore rules and move/budget/expense collection design

### Using the Budget
- The saved budget and move type affect:
  - Category budgets
  - Expense tracking and calculations
  - UI displays and recommendations
- All calculations and displays reference the persisted state.
- **Logic Location:**
  - Calculations and ongoing state: `FinancialNavigator.tsx` and related components
  - Templates and move type definitions: `constants.tsx` and `types.ts`

## 2. UI Expectations
- **Sidebar Button:** The budget feature is accessed via the sidebar button using the `FaLandmark` icon.
- **Setup Modal:** Clean, guided, and mobile-friendly modal for initial setup.
- **Main Budget Page:** Displays budget summary, category breakdowns, and expense management tools, all responsive and user-friendly.

## 3. Design Principles
- User is only prompted for setup when necessary (first use or reset).
- Move type selection customizes budget templates for a tailored experience.
- Logic is modular: UI in `BudgetSetup.tsx`, state/flow and Firestore integration in `FinancialNavigator.tsx`, and secure data structure as per Firestore best practices.

---

*For further technical details, see the code files referenced above or the `budget-logic.md` file in the budget component folder.*