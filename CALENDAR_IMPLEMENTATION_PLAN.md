# Calendar Integration with MARVIN - Implementation Plan

## ~~Phase 1: Dependencies & Setup~~ ✅
- [x] Install react-big-calendar and date-fns
- [x] Install required @types packages for TypeScript support

## ~~Phase 2: Feature Architecture~~ 🏗️  
- [x] Create `/src/features/calendar/` directory structure:
  - [x] `components/` - Calendar UI components
  - [x] `hooks/` - Calendar state management
  - [x] `pages/` - CalendarPage main component
  - [x] `services/` - Firebase calendar service
  - [x] `types/` - Calendar event TypeScript definitions
  - [x] `index.ts` - Feature exports

## ~~Phase 3: Data Models & Firebase Schema~~ 📋
- [x] Define CalendarEvent TypeScript interface
- [x] Create Firebase collection structure for calendar events
- [x] Implement real-time calendar event synchronization
- [x] Add calendar events to existing AppData context for MARVIN

## ~~Phase 4: Core Calendar Implementation~~ 🗓️
- [x] Create CalendarProvider with Firebase integration
- [x] Implement CalendarPage with react-big-calendar
- [x] Style calendar with TailwindCSS to match app design
- [x] Add event CRUD operations (Create, Read, Update, Delete)
- [x] Implement event assignment to team members

## ~~Phase 5: MARVIN Integration~~ 🤖
- [x] Update MARVIN types to include calendar management actions
- [x] Extend geminiService to handle calendar event requests
- [x] Create calendar management hooks for MARVIN
- [x] Add calendar events to AppData context
- [ ] Test MARVIN voice commands for calendar management

## ~~Phase 6: UI/UX Integration~~ 🎨
- [x] Add Calendar route to App.tsx routing (`/app/calendar`)
- [x] Add Calendar navigation link to Header component
- [x] Ensure responsive design for mobile/desktop
- [x] Add calendar icon to navigation (using existing icon system)

## ~~Phase 7: Testing & Polish~~ 🧪
- [x] Test calendar functionality across devices
- [x] Verify MARVIN can create/edit calendar events
- [x] Ensure Firebase real-time updates work properly
- [x] Test integration with existing move context and team members
- [x] Fix Firebase permissions error by creating proper Firestore security rules
- [x] Update calendar service to use subcollections pattern matching existing codebase

## ~~Phase 8: Multiple Calendar Views~~ 📅
- [x] Add Day view with time-based event display
- [x] Add Week view with 7-day layout
- [x] Add Agenda view with list-style event display
- [x] Create responsive view toggle buttons
- [x] Implement view-specific event components
- [x] Style all views for dark mode compatibility
- [x] Add mobile responsiveness for all views
- [x] Remove Work Week view per user request

## Key Technical Details:

**Dependencies to Install:**
- `react-big-calendar` - Calendar component library
- `date-fns` - Date manipulation utilities
- `@types/react-big-calendar` - TypeScript definitions

**MARVIN Integration Points:**
- Extend `AiAction` type to include calendar actions
- Update `AppData` interface to include calendar events
- Modify `geminiService.ts` to handle calendar requests
- Add calendar context to existing provider hierarchy

**Firebase Schema:**
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time?: string; // HH:MM format
  assignees?: string[]; // Team member IDs
  moveId: string; // Link to current move
  createdBy: string; // User ID
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

**Navigation Integration:**
- Desktop sidebar: Add between MARVIN and Owners
- Mobile bottom nav: Replace one of the less critical items or add to overflow menu
- Use existing routing pattern with `/app/calendar` path

## Progress Tracking:

### Current Status: Phase 1 - Dependencies & Setup
- ⏳ Installing react-big-calendar and date-fns
- ⏳ Setting up TypeScript definitions

### Next Steps:
1. Create calendar feature directory structure
2. Define TypeScript interfaces for calendar events
3. Implement Firebase integration for calendar data
4. Build core calendar UI components
5. Integrate with MARVIN AI assistant

---

*This document will be updated in real-time as implementation progresses.*