# Development Plan (REVISED): Smart Moving Planner

This revised plan is based on a deeper analysis of the existing codebase, specifically the `calendar` feature. The previous plan is now obsolete. This new strategy focuses on **enhancing existing features with intelligence and integration** rather than building redundant functionality.

## Guiding Principles

1.  **Enhance, Don't Rebuild:** Leverage the powerful `calendar` feature as the foundation for the moving timeline.
2.  **Focus on Automation & Intelligence:** The primary goal is to solve the "what do I do next?" problem by automatically populating the user's calendar with a smart, adaptable checklist.
3.  **Create Seamless Integrations:** Bridge the gap between the `calendar`, `budget`, and `boxes` features to create a unified experience.

---

## Phase 1: Timeline Intelligence & Budget Integration

**Objective:** Transform the blank calendar into a smart, pre-populated timeline and connect it to the budget.

### Feature 1: Smart Timeline Generator

*   **What it is:** A one-click action that asks the user for their move-out date and then automatically populates their existing calendar with a series of templated moving events (tasks).
*   **How it Solves Pain Points:** This directly addresses the core user need for a guided, week-by-week timeline without the stress of manual entry. It solves the "overwhelming information" problem by turning a blank canvas into a clear plan.
*   **Integration Strategy:**
    1.  **UI:** Add a "Generate Moving Plan" button on the `CalendarPage.tsx`.
    2.  **Logic:** When clicked, a modal will ask for the `moveDate`.
    3.  **Service:** Create a new function, `generateTimelineEvents(moveDate)`, which returns an array of `CalendarEventInput` objects with calculated start/end dates based on the `moveDate`.
    4.  **Action:** Loop through the generated events and use the existing `calendar.createEvent()` function to add them to Firestore in a batch. The existing calendar UI will automatically display them.
*   **Additional Libraries:** None. The existing `date-fns` library is sufficient.
*   **Potential Risks:** The template tasks might be generic. We will mitigate this by making the generated events fully editable and deletable by the user from day one.

### Feature 2: Budget & Calendar Linking

*   **What it is:** The ability to link an expense directly to a calendar event.
*   **How it Solves Pain Points:** Directly addresses "cost uncertainty" by tying expenses to specific deadlines, giving users a forward-looking view of their financial obligations.
*   **Integration Strategy:**
    1.  **Data Model:** Add an optional `calendarEventId` field to the `Expense` type in `src/features/budget/types/types.ts`.
    2.  **UI (Budget):** In the `AddExpenseModal.tsx`, add a dropdown that lists all existing calendar events. When an event is selected, its ID is saved with the expense.
    3.  **UI (Calendar):** In the `EventDetailModal.tsx`, if an event has linked expenses, display them.
*   **Additional Libraries:** None.

---

## Phase 2: Visual Inventory & Document Hub

**Objective:** Address the user needs for visual tracking and secure document storage, which are confirmed gaps.

### Feature 3: Visual Inventory (Photo Uploads)

*   **What it is:** The ability for users to upload and associate photos with each box.
*   **How it Solves Pain Points:** Addresses the high user satisfaction (87%) with visual systems for tracking contents and for insurance purposes.
*   **Integration Strategy:**
    1.  **Current Status:** The `Box` data model already includes an `imageUrl` field, and `BoxDetailsPage.tsx` can display images from a URL. The `boxService.ts` can update this `imageUrl`.
    2.  **Missing Piece:** The user interface for *uploading* image files directly to Firebase Storage is missing. The current `imageUrl` input expects a pre-existing URL.
    3.  **Revised Task:** Implement a file input element on `BoxDetailsPage.tsx` (or within a dedicated modal) that allows users to select an image file. This file will then be uploaded to Firebase Storage, and the resulting download URL will be saved to the `box.imageUrl` field.
*   **Additional Libraries:** None required (we will use the existing `firebase/storage` SDK).
*   **Potential Risks:** Storage costs. We must implement a reasonable limit (e.g., 5 photos per box) to start.

### Feature 4: Secure Document Hub

*   **What it is:** A dedicated section for uploading and managing critical moving documents.
*   **How it Solves Pain Points:** Provides a single, secure source of truth for contracts, receipts, and other important papers, reducing stress.
*   **Integration Strategy:**
    1.  **UI:** Create a new `DocumentsPage.tsx` or add a section to the `SettingsPage.tsx`.
    2.  **Storage:** Use Firebase Storage with strict security rules that ensure only the move participants can read/write files in their move's document path (e.g., `moves/{moveId}/documents/{fileName}`).
*   **Additional Libraries:** None.
*   **Potential Risks:** Security is critical. Storage rules must be rigorously tested to prevent unauthorized access.

---

## Phase 3: Post-Move Support

**Objective:** Extend the app's usefulness beyond the move itself.

### Feature 5: Settling-In Checklists

*   **What it is:** An automated checklist of post-move tasks that are added to the calendar *after* the move date.
*   **How it Solves Pain Points:** Fills the "settling-in challenges" gap identified in the research.
*   **Integration Strategy:**
    1.  The `generateTimelineEvents` function created in Phase 1 will be enhanced to also generate a set of tasks with dates *after* the `moveDate` (e.g., "Update Driver's License," "Register to Vote").
    2.  These events will be created at the same time as the pre-move events, providing a complete plan from start to finish.
*   **Additional Libraries:** None.
