# Calendar Integration Plan

## Objectives
- **Make the move timeline visible** with day/week/month views that show events, deadlines, deliveries, and appointment windows alongside planning tasks.
- **Enable context links** so users can jump between an event and its related task(s), boxes, spaces, or budget items.
- **Support collaboration** across move participants with real-time sync and role-based permissions.
- **Reduce missed commitments** via reminders, time zone correctness, and clear visibility of upcoming items.

## Scope (Phase 1 focus)
- **Views**: Day, Week, Month. Agenda list as a simplified fallback on mobile.
- **Event CRUD**: Create, edit, delete, view events scoped to a single `moveId`.
- **Context linking**: Optional links to `plannerTaskId`, `boxId[]`, `spaceId`, `budgetExpenseId`.
- **Reminders**: Client-side scheduled toasts and optional email/push (deferred if not yet available).
- **Time zones**: Store as UTC timestamps with per-user display based on profile/device.
- **Permissions**: Read for participants; write per role (owner/admin full, member limited).

Out-of-scope for Phase 1 (planned later): external calendar sync (Google/Microsoft), recurring events, resource calendars, SMS, advanced constraints.

## Success Criteria
- Users can add events with start/end times and see them in day/week/month views.
- Events show contextual links (e.g., open related task modal from the event).
- Planner tasks with dates appear on the calendar without duplication or drift.
- Time zone display is correct for all participants; reminders fire at expected local times.
- Firestore rules prevent access outside the move; indexes support fast range queries.

## User Stories
- As a mover, I can create a delivery window on the calendar so everyone sees when to be home.
- As a helper, I can view upcoming tasks and appointments on a single calendar.
- As an organizer, I can jump from a calendar event to the detailed task to update status.
- As a participant in another time zone, I see event times correctly in my locale.

## Data Model (Firestore)
- Collection path: `moves/{moveId}/calendar_events/{eventId}`

Event document
```ts
type CalendarEvent = {
  title: string
  description?: string
  startAt: Timestamp // UTC
  endAt: Timestamp   // UTC
  allDay?: boolean
  startDate?: string // YYYY-MM-DD for all-day events (to prevent TZ drift)
  endDate?: string   // YYYY-MM-DD for all-day events
  location?: string
  reminderMinutes?: number[] // e.g., [1440, 60, 10]
  // Context links - validate all linked IDs belong to the same moveId
  plannerTaskId?: string // Consider {id: string, moveId: string} for cross-move validation
  boxIds?: string[]
  spaceId?: string
  budgetExpenseId?: string
  // Metadata
  createdBy: string // uid
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

Derived/denormalized fields (optional):
- `searchTitle`: lowercased for simple client filtering.
- `dayKeys`: array of `YYYY-MM-DD` strings spanned by the event for agenda queries (optional if using range queries only).

## Firestore Indexes
- Composite index for range queries over time:
  - Collection: `moves/{moveId}/calendar_events` orderBy `startAt` where `startAt >=` and `startAt <=`.
  - Optional index for `endAt` based range queries.
- For agenda views: Consider adding `dayKeys: string[]` (e.g., `['2025-11-05', '2025-11-06']`) for efficient
  querying of events spanning multiple days without complex range filters.

## Security Rules (outline)
- Read access: authenticated users who are participants of the `moveId`.
- Write access:
  - Owners/Admins: full CRUD.
  - Members: create/update events they created; cannot delete others’ events (configurable).
- Validate:
  - `startAt` and `endAt` are timestamps and `endAt >= startAt`.
  - For all-day events, ensure `startDate`/`endDate` match the UTC dates of `startAt`/`endAt`.
  - Cross-entity links (plannerTaskId, boxIds, etc.) reference valid documents under the same `moveId`.
  - Optional size limits (title length, description length, link arrays).

## UI/UX
- **Entry point**: Calendar tab under a move, alongside Planner, Boxes, Budget.
- **Views**:
  - Day view: hourly grid, scroll to current time.
  - Week view: 7-day grid, drag-select to create.
  - Month view: compact month with event pills and overflow +N indicator.
  - Agenda (mobile): list of upcoming events by day.
- **Interactions**:
  - Click empty slot or FAB to create event; tap to view details.
  - (Phase 2) Drag to move or resize (updates `startAt`/`endAt`).
  - Hover/click shows quick details with context links (open task, open box list, open space).
  - Color accents by context: task-linked, delivery, appointment, budget-related.
- **Modal**:
  - Title, description, start/end, all-day, location, reminder(s).
  - Add context links via pickers: select task, select boxes, select space, select expense.
  - Save/cancel with optimistic UI and rollback on error.

## Planner ↔ Calendar Synchronization
- Source of truth remains separate but connected:
  - Planner `Task` may have `dueDate` and/or `startDate`.
  - Calendar visualizes task dates as read-only “task markers” unless the user explicitly converts to an editable event.
- Mapping rules:
  - If a Task has `dueDate`, show a task marker on that day.
  - If a Task has `startDate` and `dueDate`, render a spanning marker.
  - User can “Create calendar event from task” to generate a true `CalendarEvent` linked via `plannerTaskId`.
  - Editing a linked event does not mutate task dates by default; prompt user to sync back when changed.
- Avoid duplication:
  - Calendar filters separate “Events” and “Task markers” to prevent confusion.

## Event Creation Flows
> **Note on All-Day Events**: When creating all-day events, set `startDate`/`endDate` (YYYY-MM-DD) and ensure `startAt`/`endAt` are set to the start/end of day in the user's local time zone to prevent cross-TZ drift.

- **Manual**: From calendar grid or "New Event" button opens modal.
- **From Task**: In task modal, action "Add to calendar" pre-fills title/dates and links `plannerTaskId`.
- **From Boxes**: On a box or selection, "Schedule delivery/transport" creates an event with `boxIds` and `spaceId` prefilled.
- **From Budget**: On an expense (e.g., truck rental), "Schedule pickup/return" creates an event with `budgetExpenseId`.

## Notifications & Time Zones
- Time storage: all UTC.
- Display: convert to user's device TZ; store all-day events with `startDate`/`endDate` to prevent TZ drift.
- Reminders: client-side timers for toasts; server-driven email/push later via Cloud Functions.
- Daylight saving shifts handled by TZ conversion at render time.

## Offline-First & Performance
- Local cache with Firestore persistence enabled.
- Range queries per view:
  - Day/Week: Query `where('startAt', '>=', viewStart).where('startAt', '<=', viewEnd)` and filter client-side for `endAt >= viewStart`.
  - Month: Fetch padded month range once and cache.
  - Agenda: Use `dayKeys` array for efficient lookups of multi-day events.
- Virtualize event lists in month/agenda to avoid DOM bloat.
- Optimistic updates with rollback on write failure.

## Access Control Model
- Use existing `moves/{moveId}` participant model.
- Enforce role checks on create/update/delete in UI.
- In rules, restrict `createdBy` to `request.auth.uid` on create; allow admins to edit any.

## Migration / Backfill
### Cross-Entity Validation
- When linking to other entities (tasks, boxes, etc.), validate they belong to the same `moveId`.
- In Firestore rules, verify `plannerTaskId`, `boxIds`, etc., reference documents under the same `moveId`.
  - Example rule: `request.resource.data.plannerTaskId == null || exists(/databases/$(database)/documents/moves/$(moveId)/plannerTasks/$(request.resource.data.plannerTaskId))`

- No existing calendar docs: no migration required.
- Planner task dates: surface as "task markers" via client-side derivation; no write needed.
- Future: one-time utility to convert selected dated tasks into events.

## Phased Rollout
- **Phase 1 (MVP)**:
  - Schema, rules, indexes, month/week/day + agenda, manual CRUD, task markers, basic links, in-app reminders only.
- **Phase 2**:
  - Drag-resize/move, multi-select, bulk operations, server-driven email/push reminders, recurring events.
- **Phase 3**:
  - External calendar sync (Google/Microsoft), resource calendars, template events, constraints, advanced TZ handling.

## Validation & Metrics
- KPIs:
  - Calendar DAU by move.
  - Events created per active move per week.
  - Reminder engagement (toast interactions), missed-event rate (self-reported).
  - Task-to-event conversion rate; time-on-calendar view.
- Validation:
  - Beta test with active moves; collect qualitative feedback on missed deliveries/appointments.
  - A/B: show task markers by default vs. opt-in.

## Risks & Mitigations
- Time zone confusion → Clear TZ indicator, consistent UTC storage, profile override.
- Event/task drift → Explicit link with optional one-click sync back to task dates.
- UI clutter in month view → +N overflow with popover; filters for event types/markers.
- Permission friction → Default members can edit their events; owners/admins can edit all.
- Cross-move ID leaks → Validate all linked entity IDs belong to the same move in Firestore rules and client-side.


## Phase 0: Calendar UI Redesign (Mobile-First)

Goals
- **Seamless aesthetic fit** with the app’s design system (dark-first, slate surfaces, brand accents).
- **Mobile-first UX** that mirrors the familiarity of Google Calendar while staying lightweight.
- **Responsive, accessible, performant** interactions across Month, Week, Day, and Agenda.

Design Principles
- **Mobile-first** layout; enhance progressively for tablet/desktop.
- **Sticky headers** and contextual toolbars; **FAB** for new event on mobile.
- **Minimal chrome** in grid; emphasize content (event pills) with clear affordances.
- **Consistent tokens**: typography, spacing, radii, shadows sourced from design system.

Breakpoints & Layout
- xs/sm (mobile):
  - Header: month label, chevrons, Today, view switcher as segmented control in a sheet/popover.
  - Default view: Agenda or Month with compact pills; long-press to create; bottom FAB.
  - Bottom action bar (optional): Today, Add, View toggle.
- md (tablet):
  - Two-row header: nav + current period; view switcher visible inline.
  - Week view becomes primary for planning; drag-select to create.
- lg+ (desktop):
  - Full toolbar (like current custom toolbar) with improved density and spacing.
  - Side gutters for future filters without crowding the grid.

Core Components (to adjust or restyle)
- `CalendarPage.tsx`
  - Replace default RBC CSS with a Tailwind-first theme via `CalendarStyles.css` overhaul.
  - Introduce mobile FAB, sticky top toolbar, and condensed paddings at xs/sm.
  - Ensure `views={['month','week','day','agenda']}` remains, but default to Agenda on xs if no events.
- `CalendarStyles.css`
  - Override `.rbc-*` classes for dark mode, spacing, borders, hover/focus.
  - Reduce line heights, add rounded cells, improve today/selected states.
  - Month pills: truncate, +N overflow; Week/Day time grid: subtle dividers, sticky all-day row.
- `TimeEventComponent.tsx` and `AgendaEventComponent.tsx`
  - Use consistent card tokens: radius, shadow on hover, color badges.
  - Improve truncation, icons sizing, and subtle focus states for accessibility.
- `AddEventModal.tsx` & `EventDetailModal.tsx`
  - Mobile sheet-like presentation (full-screen on xs), desktop centered modal.
  - Large tappable inputs, date/time pickers optimized for touch, safe areas.

Interactions
- Mobile: long-press empty slot to create; tap event to view; swipe within month to change weeks (optional v2).
- Desktop: drag-select to create; drag to move; resize to adjust end time.
- Keyboard: arrow key navigation across grid; Enter to open modal; Esc to close.

Accessibility
- Ensure focus ring visibility on all interactive elements.
- ARIA roles for grid, rows, and events; announce range changes and selections.
- High-contrast event colors and badges; avoid color-only status cues.

Performance
- Keep using `react-big-calendar`; minimize DOM by virtualizing agenda lists when large.
- Only fetch the visible range; memoize event components; avoid expensive shadows.

Acceptance Criteria
- Mobile Month/Agenda are readable without zooming; FAB present; long-press creates event.
- Week/Day grids are scrollable and finger-friendly; time range indicators visible.
- Dark mode styles match app surfaces; today/selected states are clear and consistent.
- No layout shift between breakpoints; toolbar adapts cleanly.

Implementation Checklist
- [X] Redesign `CalendarStyles.css` to align with design tokens.
- [X] Update `CalendarPage.tsx` header/toolbar for sticky, responsive layout; add FAB on mobile.
- [X] Tweak `TimeEventComponent`/`AgendaEventComponent` for pill/card consistency and truncation.
- [X] Update modals for mobile sheet behavior and accessible focus management.
- [ ] **Next: Audit keyboard navigation and add missing handlers.**
- [ ] Validate on xs/sm/md/lg across Month/Week/Day/Agenda.

