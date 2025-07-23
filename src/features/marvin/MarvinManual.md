# MARVIN Integration Manual

Welcome to the developer's guide for MARVIN, your AI-powered moving assistant. This document provides a comprehensive overview of how to integrate and extend MARVIN's capabilities within your application.

## 1. Core Concepts

Understanding MARVIN's architecture is key to effective integration.

### a. The `<Marvin />` Component

MARVIN is a self-contained React component. You integrate it by rendering it in your app and passing two types of props:

1.  `appData`: A single object containing all the relevant application state MARVIN needs to be aware of (e.g., checklists, inventory, team members). This object is defined in `types.ts`.
2.  `on...` callbacks: Functions that MARVIN calls to signal that a specific action should be performed by your application (e.g., `onCalendarAction`, `onNavigate`).

### b. The Data & Action Flow

The typical interaction follows this sequence:

1.  **User Input**: The user types or speaks a command.
2.  **`Marvin.tsx`**: Captures the input and sends it to the `geminiService`.
3.  **`geminiService.ts`**: Constructs a detailed prompt (including the user's query, the `appData`, and a "system instruction") and sends it to the Gemini API.
4.  **Gemini API**: Processes the request and returns either a natural language response or a structured JSON object representing an action.
5.  **`geminiService.ts`**: Parses the response.
6.  **`Marvin.tsx`**:
    *   If the response is text, it's displayed in the chat.
    *   If the response is an **action** (JSON), the `handleAction` function is called.
7.  **`handleAction` (`Marvin.tsx`)**: This function determines which action to perform and calls the appropriate callback prop (e.g., `onUpdateChecklist`).
8.  **`App.tsx`**: Your main application file receives the callback, executes the action, and updates its own state (e.g., adding a new item to the checklist).

### c. The System Instruction: MARVIN's "Brain"

The most critical part of MARVIN's logic is the **system instruction** created in `services/geminiService.ts`. This large string tells the AI:
*   Who it is (`You are MARVIN...`).
*   What data it has access to (`Here is the current state of the user's move...`).
*   What actions it can perform and **the exact JSON format** it must use for each action.

**To add or change functionality, you will primarily be modifying the system instruction and the code that handles the corresponding actions.**

---

## 2. How-To: Extending MARVIN's Features

Here’s how to add new capabilities to MARVIN. We'll use adding an "expense tracker" as a complete example.

### Example: Adding an Expense Tracker

Let's empower MARVIN to add expense entries to a moving budget.

#### Step 1: Define the Data Structures (`types.ts`)

First, define the shapes for our new data and the AI action.

```typescript
// In types.ts

// Represents a single expense entry.
export interface Expense {
  id: string;
  item: string;
  amount: number;
  category: 'Supplies' | 'Movers' | 'Travel' | 'Other';
}

// Type for the AI's structured response when adding an expense.
export interface AddExpenseAction {
  action: 'add_expense';
  expense: Omit<Expense, 'id'>;
}

// Add this to the union type for all AI actions.
export type AiAction = 
  | CreateChecklistAction 
  | CreateCalendarEventAction 
  | NavigateAction
  | AddExpenseAction; // <-- Add this line

// Also, add the budget to the main AppData interface.
export interface AppData {
  teamMembers: TeamMember[];
  inventory: { /* ... */ };
  reservations: Reservation[];
  checklist: ChecklistItem[];
  budget: {
    totalSpent: number;
    expenses: Expense[];
  };
}
```

#### Step 2: Update the System Instruction (`geminiService.ts`)

Now, we must teach MARVIN about this new capability.

```typescript
// In services/geminiService.ts, inside createSystemInstruction()

// ... inside the template string ...

// 1. Add the new budget data to the context
- Budget: ${JSON.stringify(appData.budget, null, 2)}
- Current Checklist: ${JSON.stringify(appData.checklist, null, 2)}

// ...

// 2. Add a new rule for the action
4.  **Manage Calendar Events/Reminders:** // ...
5.  **Add Expense Entries:** If asked to log, add, or record an expense, respond ONLY with a valid JSON object matching this schema: `{"action": "add_expense", "expense": {"item": "string", "amount": number, "category": "Supplies" | "Movers" | "Travel" | "Other"}}`. Do not add any other text.
6.  **Provide Navigation:** // ... (renumber the following rules)

```

#### Step 3: Handle the Action (`Marvin.tsx`)

MARVIN needs a new prop for the callback and a new case in `handleAction` to use it.

```tsx
// In components/Marvin.tsx

// 1. Add the new type to the imports
import { /* ..., */ ChecklistItem, GroundingChunk, AiAction, Expense } from '../types';

// 2. Define the new prop
interface MarvinProps {
  // ...
  onUpdateChecklist: (items: Omit<ChecklistItem, 'id' | 'completed'>[]) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void; // <-- Add this
  onWakeWordDetected: () => void;
}

// 3. Destructure the prop
export const Marvin: React.FC<MarvinProps> = ({ /* ..., */ onUpdateChecklist, onAddExpense, onWakeWordDetected }) => {
  // ...
}

// 4. Add the new case to the handleAction function
const handleAction = useCallback((action: AiAction): string => {
    let confirmationText = '';
    // ... other cases
    } else if (action.action === 'add_expense') {
      onAddExpense(action.expense);
      confirmationText = `I've logged an expense for "${action.expense.item}" for $${action.expense.amount}.`;
    } else if (action.action === 'navigate') {
    // ...
    }
    return confirmationText;
  }, [onCalendarAction, onNavigate, onUpdateChecklist, onAddExpense]); // <-- Add to dependency array
```

#### Step 4: Implement the Callback (`App.tsx`)

Finally, implement the logic in your main app component to handle the data.

```tsx
// In App.tsx

function App() {
  const [appData, setAppData] = useState<AppData>(initialAppData); // Make sure initialAppData includes a budget property

  // ...

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setAppData(prevData => {
      const updatedExpenses = [...prevData.budget.expenses, newExpense];
      const newTotal = updatedExpenses.reduce((sum, ex) => sum + ex.amount, 0);
      return {
        ...prevData,
        budget: {
          expenses: updatedExpenses,
          totalSpent: newTotal,
        },
      };
    });
    alert(`Expense added: ${expense.item}`);
  };

  return (
    //...
      <Marvin
        appData={appData}
        onCalendarAction={handleCalendarAction}
        onNavigate={handleNavigate}
        onUpdateChecklist={handleUpdateChecklist}
        onAddExpense={handleAddExpense} // <-- Pass the handler
        onWakeWordDetected={handleWakeWordDetected}
      />
    //...
  );
}
```

With these changes, a user can now say "Log that I spent $50 on moving boxes" and your app state will update accordingly!

---

## 3. Enhancing Existing Features

You can apply the same pattern to enhance existing features.

### Example: Editing a Calendar Event

To allow MARVIN to edit an event, you would:

1.  **`types.ts`**: Define an `EditCalendarEventAction` with a shape like `{ action: 'edit_calendar_event', eventIdentifier: string, updates: Partial<CalendarEvent> }`.
2.  **`geminiService.ts`**: Update the system instruction to teach MARVIN how to handle "edit" or "change" requests. You'd need to provide existing calendar events in the `appData` context so it knows what can be edited.
    *   *Pro Tip*: For robust editing, ensure each event in `appData.calendar` has a unique ID that the AI can reference.
3.  **`Marvin.tsx`**: Add an `onEditCalendarEvent` prop and handle the `edit_calendar_event` action.
4.  **`App.tsx`**: Implement the `handleEditCalendarEvent` logic.

### Getting More Insightful Agendas and Tips

MARVIN's "insightfulness" is directly proportional to the quality of its context and instructions. This is covered in detail in section 5.

---

## 4. Tuning MARVIN for Expert Moving Advice

To elevate MARVIN from a simple assistant to an expert advisor, you need to refine its "brain"—the system instruction—and the data it works with. Here’s how to get the most accurate, insightful, and helpful responses.

### Technique 1: Supercharge the System Instruction

Go beyond just defining rules. Shape MARVIN's personality and goals. Modify the `createSystemInstruction` function in `geminiService.ts`:

*   **Define an Expert Persona**: Start the prompt with a stronger identity.
    *   **Instead of**: `You are MARVIN, a moving assistant AI...`
    *   **Try**: `You are MARVIN, an expert relocation coordinator. Your primary goal is to reduce the user's stress by providing clear, actionable, and empathetic advice. You are proactive, insightful, and you always tailor your responses to the user's specific moving plan.`

*   **Set Guiding Principles for Responses**: Tell the AI *how* to answer.
    *   Add a section like: `**Response Principles:**
        1.  **Be Proactive:** Don't just answer the question asked. Anticipate the user's next need. If they ask about packing, suggest a strategy or remind them to label boxes.
        2.  **Be Specific:** Always reference the provided App Data. Instead of "you should pack," say "I see from your checklist that 'Pack non-essentials' is next."
        3.  **Be Empathetic:** Acknowledge that moving is stressful. Use encouraging and supportive language.`

### Technique 2: Enrich the `appData` Context

The more MARVIN knows, the better its advice. The default `appData` is a good start, but you can make it much richer.

*   **Add More Detail to `types.ts`**:
    ```typescript
    export interface AppData {
      moveDate: string; // "YYYY-MM-DD"
      movingFromAddress: string;
      movingToAddress: string;
      // ... existing AppData
    }
    ```
*   **Provide This Data in `App.tsx`**: Pass the new data into the `<Marvin>` component.
*   **Reference it in the System Instruction**: Now you can write rules like: `When suggesting a moving agenda, consider the main moveDate: ${appData.moveDate} and work backwards.` With addresses, MARVIN can provide more accurate travel time estimates or search for businesses in the correct area.

### Technique 3: Guide with Examples (Few-Shot Prompting)

Show, don't just tell. Add examples of ideal interactions directly into the system instruction. This is one of the most effective ways to tune the AI's tone and helpfulness.

*   Add a section to the system prompt in `geminiService.ts`:
    ```
    **Example Interactions:**

    *   User Query: "I feel so overwhelmed, where do I even start?"
    *   Your Ideal Response: "I understand, moving can feel like a huge task. Let's break it down. Looking at your plan, the highest priority is 'Get quotes from moving companies' since your move is on ${appData.moveDate}. Would you like me to search for top-rated movers in the ${appData.movingFromAddress} area?"

    *   User Query: "what should i do this weekend"
    *   Your Ideal Response: "This weekend could be a great time to tackle packing. I see Brenda has 'Start packing non-essentials' on her list. A good place to start would be a room you don't use often, like a guest room or office. Finishing just one room can be a big morale boost!"
    ```

### Technique 4: Leverage Real-World Knowledge with Web Search

For any query that requires information outside of the `appData` (e.g., business hours, service costs, "how-to" guides), ensure MARVIN uses its search tool for accuracy.

*   **Strengthen the Instruction**: Make the rule for web search more explicit.
    *   **Instead of**: Listing keywords.
    *   **Try**: `3. **Web Search for Real-World Info:** For any questions about current information, locations, contact info, business reviews, service costs, or general 'how-to' advice that is not in the App Data, you MUST use the Google Search tool to provide an accurate, up-to-date answer. Always cite your sources from the search results.`

By combining these four techniques, you will transform MARVIN's responses from generic answers into personalized, expert advice that genuinely helps the user.

---

## 5. Customization

*   **Wake Word**: The "Let's Move Marvin" wake word can be changed. You must train your own `.ppn` model file on the [Picovoice Console](https://console.picovoice.ai/) and update the `picovoiceModelPath` in the Marvin settings UI.
*   **TTS Voice**: The voice for text-to-speech can be selected from the dropdown in the header. The list of voices is populated by the user's browser/OS and curated by the `getAvailableVoices` function in `services/ttsService.ts`. You can modify the `preferredVoices` array in that file to change the default sorting.
*   **UI/UX Hooks**: Use the `onWakeWordDetected` callback to trigger UI events in your app, like highlighting the chat window or automatically scrolling it into view.

Good luck with your integration!