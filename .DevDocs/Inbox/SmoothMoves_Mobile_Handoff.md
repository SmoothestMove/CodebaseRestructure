# Smooth Moves — Mobile Development Handoff

> **Audience**: A developer building the mobile (React Native / Expo) version of Smooth Moves who has **zero prior exposure** to the codebase.
> **Date**: 2026-02-21
> **Source web app**: React 19 + TypeScript 5.7 + Vite 6 + TailwindCSS 4 + Firebase

---

## Table of Contents

1. [What Is Smooth Moves?](#1-what-is-smooth-moves)
2. [Feature Inventory](#2-feature-inventory)
3. [Screens & Pages (Complete)](#3-screens--pages-complete)
4. [Modals & Bottom Sheets](#4-modals--bottom-sheets)
5. [Navigation & Routing](#5-navigation--routing)
6. [State Management & Provider Hierarchy](#6-state-management--provider-hierarchy)
7. [Data Models & Types](#7-data-models--types)
8. [Firebase / Firestore Schema](#8-firebase--firestore-schema)
9. [External Services & Integrations](#9-external-services--integrations)
10. [Design System & Branding](#10-design-system--branding)
11. [Accessibility & UX Requirements](#11-accessibility--ux-requirements)
12. [Mobile-Specific Considerations](#12-mobile-specific-considerations)
13. [Environment Variables](#13-environment-variables)
14. [File Map (Key Source Locations)](#14-file-map-key-source-locations)

---

## 1. What Is Smooth Moves?

Smooth Moves is an **all-in-one residential moving management app**. It provides:

- **QR-code-based inventory tracking** — scan, label, and search every box
- **Collaborative move management** — multiple participants per move via shared Move ID
- **Budget & expense tracking** — with receipt OCR via Mindee API
- **Task planner** — kanban-style board with timeframes and subtasks
- **Calendar** — move timeline with event management
- **Truck loading visualization** — zone-based SVG truck map

**Brand positioning**: "Professional-grade logistics for DIY movers, without the professional-grade cost." The app's personality is **friendly, playful, minimal, bold, and plainspoken** (never corporate or jargon-heavy).

---

## 2. Feature Inventory

| #   | Feature            | Complexity | Description                                                                                                          |
| --- | ------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | **Authentication** | Medium     | Email/password + Google sign-in. Post-login: create new move or join existing via Move ID.                           |
| 2   | **Dashboard**      | High       | Bento grid command center with progress charts, budget widget, truck preview, participant avatars, quick actions.    |
| 3   | **QR Scan**        | Critical   | Camera-based QR scanning for box identification, new-box registration, truck placement, and quick status updates.    |
| 4   | **Boxes List**     | Medium     | Searchable, filterable, sortable directory of all packed boxes.                                                      |
| 5   | **Box Details**    | Medium     | Full box profile: edit metadata, photos, contents list, location/zone, status, delete.                               |
| 6   | **Pack Box**       | Medium     | Step-by-step wizard for packing a new box (scan/create label → assign owner → document contents → photo → location). |
| 7   | **Manage Owners**  | Low        | CRUD for personal owners (people). Shows box stats. Triggers label generation.                                       |
| 8   | **Manage Spaces**  | Low        | Predefined + custom rooms/areas. Generates room-specific QR labels.                                                  |
| 9   | **Truck Load**     | High       | Interactive SVG truck divided into 11 zones. Tap zones to see assigned boxes. Progress visualization.                |
| 10  | **Budget**         | High       | Expense entry, receipt OCR (Mindee), category manager, setup wizard (local vs. long-distance templates), charts.     |
| 11  | **Calendar**       | Medium     | Month/Week/Day/Agenda views. Event CRUD. Move-day countdown.                                                         |
| 12  | **Planner**        | Critical   | Kanban-style board organized by timeframes. Task cards with subtasks, attachments, notes, assignment, drag-and-drop. |
| 13  | **Settings**       | Low        | Move ID display/copy, data export (JSON/Spreadsheet), move date picker, reset/clear data.                            |

---

## 3. Screens & Pages (Complete)

### 3.1 Auth Screen

**Source**: `src/features/auth/pages/AuthPage.tsx`

| Element                       | Behavior                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| Sign In / Create Account tabs | Toggle between login and registration forms                                               |
| Email + Password fields       | Standard text inputs with validation                                                      |
| Google Auth button            | OAuth single sign-on                                                                      |
| Create New Move               | After login, if no move active – opens form for move name + initialization                |
| Join Existing Move            | Input field for a unique Move ID                                                          |
| New User → Owner Modal        | After first registration, auto-opens `AddOwnerModal` pre-filled with the user's full name |
| Loading spinner               | Shown during Firebase session synchronization                                             |

**Key behavior**: After successful auth, user is redirected to `/app` (Dashboard). If `isNewUser` flag is set in sessionStorage, the owner-creation modal opens automatically.

---

### 3.2 Dashboard

**Source**: `src/features/settings/pages/DashboardPage.tsx`

The Dashboard is the **command center**. It renders the following widgets in vertical sections:

| Widget                         | Description                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Greeting Header**            | "Hi there! 📦" + move code display + owner/space counts                                                     |
| **Box Packing Progress Chart** | Visual donut/bar chart showing status distribution across all boxes                                         |
| **Progress Bar**               | Per-owner and overall packing progress (Prepared → Packed → Loaded → Delivered → Unpacked)                  |
| **Dynamic Bento Grid**         | Responsive grid showing spaces with their box counts and color-coded cards                                  |
| **Truck Layout Visualization** | Mini SVG truck view (conditional — only appears if any boxes have `LOADED` status)                          |
| **Budget Overview Widget**     | Summary of total budget, spent, remaining, category breakdown                                               |
| **Movers Crew**                | Horizontal scrolling avatar list of move participants with online/offline status indicators + invite button |
| **Dev: Separation Test**       | (Dev mode only) Validates owner/space data isolation                                                        |
| **Dev: Randomize**             | (Dev mode only) Generates fake data for testing visualizations                                              |

---

### 3.3 Scan Screen

**Source**: `src/features/boxes/pages/ScanPage.tsx`

| Element                     | Behavior                                                                    |
| --------------------------- | --------------------------------------------------------------------------- |
| QR Scanner Overlay          | Active camera view with a scanning frame                                    |
| Photo capture               | Freeze frame / high-res photo for box identification                        |
| **New Box Modal**           | Triggered when an unrecognized QR is scanned → assign Name, Owner, Contents |
| **Truck Placement Modal**   | Triggered after scanning an existing box → assign to a TruckZone            |
| Quick Deliver/Stage buttons | One-tap status updates for moving-day efficiency                            |

---

### 3.4 Boxes List

**Source**: `src/features/boxes/pages/BoxesListPage.tsx`

| Element               | Behavior                                                               |
| --------------------- | ---------------------------------------------------------------------- |
| Global search bar     | Real-time filter across name, contents, location                       |
| Status filter         | Multi-select for Prepared/Packed/Loaded/Unloaded/Delivered/Unpacked    |
| Sort controls         | Date, Name, Weight toggles                                             |
| Box cards             | Tappable cards showing box name, owner color, status badge, quick info |
| Print labels redirect | Links to owner management for generating labels                        |

---

### 3.5 Box Details

**Source**: `src/features/boxes/pages/BoxDetailsPage.tsx`

| Element                    | Behavior                                                   |
| -------------------------- | ---------------------------------------------------------- |
| Edit mode toggle           | Swaps text displays ↔ input fields for metadata editing   |
| Camera/Scanner integration | Re-scan box or update identification photo                 |
| Location & Zone selector   | Opens `TruckZoneSelectorModal` to update physical position |
| Itemized contents list     | Add/edit/remove specific items inside the box              |
| Status changer             | Update current status through the lifecycle                |
| Delete action              | Confirmation dialog for permanent removal                  |
| History timeline           | Chronological scan entries with status changes             |

---

### 3.6 Pack Box

**Source**: `src/features/boxes/pages/PackBoxPage.tsx`

A step-by-step wizard:

1. **Box Identification** — Scan or create a new QR label
2. **Owner Assignment** — Select which person's belongings are being packed
3. **Contents Documentation** — List items as you pack
4. **Photo Documentation** — Take pictures of box and contents
5. **Location Tagging** — Origin room and destination room

---

### 3.7 Manage Owners

**Source**: `src/features/owners/pages/ManageOwnersPage.tsx`

| Element                   | Behavior                                                                |
| ------------------------- | ----------------------------------------------------------------------- |
| Add Personal Owner button | Opens `AddOwnerModal` (first name, last name, color picker)             |
| Batch Print confirmation  | Auto-appears after adding owner to prep initial QR labels               |
| Owner Cards               | Display owner stats (box count), actions menu (edit, print more labels) |
| Color assignment          | Each owner gets a unique hex color for visual identification            |

---

### 3.8 Manage Spaces

**Source**: `src/features/owners/pages/ManageSpacesPage.tsx`

| Element                 | Behavior                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Predefined Space Grid   | Clickable cards for standard rooms: Kitchen (KT), Living Room (LR), Bathroom (BR), Dining Room (DR), Basement (BM), Garage (GA), Office (OF) |
| Add Custom Space button | Opens `AddSpaceModal` for custom rooms/areas                                                                                                 |
| Space-specific print    | Generate QR labels for a room's inventory                                                                                                    |
| Box counts per space    | Shows how many boxes are assigned to each space                                                                                              |

---

### 3.9 Truck Load

**Source**: `src/features/boxes/pages/TruckLoadPage.tsx`

| Element               | Behavior                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Interactive Truck Map | SVG visualization with 11 clickable zones: Cab, Overhead, Front Left/Center/Right, Middle Left/Center/Right, Back Left/Center/Right |
| Zone Detail Overlay   | List of boxes assigned to a tapped zone                                                                                             |
| Truck Progress        | Visualization of volume/weight capacity utilization                                                                                 |
| Vertical positions    | Each box can be Bottom, Middle, or Top within a zone                                                                                |

---

### 3.10 Budget Page

**Source**: `src/features/budget/pages/BudgetPage.tsx`

| Element             | Behavior                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Setup Wizard**    | First-time: total budget amount, move type (Local vs. Long Distance), auto-distributes across 6 default categories using templates |
| Add Expense button  | Opens `AddExpenseModal` with receipt photo capability                                                                              |
| Category Manager    | Define/edit/delete/color-code budget categories with icons                                                                         |
| Receipt OCR Scanner | Camera → Mindee API → auto-extract merchant, amount, date                                                                          |
| Expense list        | Filtered by category, sorted by date                                                                                               |
| Charts              | Spending vs. budget per category, overall progress                                                                                 |
| Category icons      | 33 predefined icons from react-icons (FaBoxOpen, FaTruck, FaHome, etc.)                                                            |

**Budget Templates** (auto-distribution percentages):
| Category | Local Move | Long Distance |
|----------|-----------|---------------|
| Packing Supplies | 15% | 3% |
| Transportation | 60% | 81% |
| Professional Services | 5% | 5% |
| New Home Essentials | 5% | 3% |
| Food & Refreshments | 5% | 3% |
| Miscellaneous | 10% | 5% |

---

### 3.11 Calendar Page

**Source**: `src/features/calendar/pages/CalendarPage.tsx`

| Element            | Behavior                                                  |
| ------------------ | --------------------------------------------------------- |
| View toggle        | Month / Week / Day / Agenda modes                         |
| Add Event button   | Opens `AddEventModal` (title, date/time, description)     |
| Event Detail Modal | Tap event → edit, delete, or navigate to related features |
| Move Day countdown | Persistent indicator of days until the move               |

---

### 3.12 Planner Page

**Source**: `src/features/planner/pages/PlannerPage.tsx` + `src/features/planner-enhanced/`

| Element                  | Behavior                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| Timeframe columns        | Vertical swimlanes: "Before Move", "Move Week", "Move Day", "Week 1 After", etc.                     |
| Task cards               | Draggable cards with title, description, owner, due date, subtask count                              |
| Add Task button          | Per-column and global; opens `TaskModal`                                                             |
| Task Modal (Full Screen) | Edit title, description, subtasks (with checkboxes), attachments, notes, owner assignment, timeframe |
| Frame Header Modal       | Edit timeframe name and duration                                                                     |
| Global Settings Modal    | Board-level settings (colors, visibility)                                                            |
| Drag-and-drop            | Reorder tasks within/between timeframes                                                              |

**Note**: The planner has both a basic (`features/planner/`) and enhanced (`features/planner-enhanced/`) implementation with 18 components and 5 service files.

---

### 3.13 Settings Page

**Source**: `src/features/settings/pages/SettingsPage.tsx`

| Element              | Behavior                                                |
| -------------------- | ------------------------------------------------------- |
| Move ID display      | Current move's unique code + "Copy to Clipboard" button |
| Move Date picker     | Set/update target moving day (affects countdowns)       |
| Data Export (JSON)   | Downloads complete inventory as JSON                    |
| Generate Spreadsheet | Creates formatted spreadsheet of all data               |
| Reset Move           | Confirmation modal → clears all move data               |
| Clear All Data       | Nuclear option with double verification                 |

---

## 4. Modals & Bottom Sheets

On mobile, prefer **Bottom Sheets** over centered modals for ergonomics.

| Modal                      | Display Type        | Trigger                                                               | Key Fields                                                                                                             |
| -------------------------- | ------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **AddOwnerModal**          | Bottom Sheet        | "Add Owner" button on Manage Owners, or auto on new-user registration | First name, last name, color picker. Props: `isOpen`, `onClose`, `onOwnerAdded`, `initialFirstName`, `initialLastName` |
| **AddSpaceModal**          | Bottom Sheet        | "Add Space" button on Manage Spaces                                   | Space name, category (room/storage/utility/custom)                                                                     |
| **AddExpenseModal**        | Full Screen         | "Add Expense" on Budget page                                          | Category selector, amount, date, merchant name, description, receipt photo upload                                      |
| **ReceiptScanModal**       | Camera Overlay      | Camera icon in AddExpenseModal                                        | Camera interface → captures receipt → sends to Mindee OCR → returns parsed data                                        |
| **SetupBudgetModal**       | Wizard (Multi-step) | First-time budget access                                              | Total budget amount, move type (Local/Long Distance), category review                                                  |
| **CategoryManagerModal**   | Bottom Sheet        | "Manage Categories" on Budget                                         | Add/edit/delete categories with name, color, icon picker, estimated amount                                             |
| **TaskModal**              | Full Screen         | Tap task card or "Add Task" in Planner                                | Title, description, subtasks (add/check/delete), attachments, notes, owner assignment, timeframe, due date             |
| **TruckZoneSelectorModal** | Bottom Sheet        | Zone selector in Box Details or post-scan                             | 11-zone grid + vertical position (Bottom/Middle/Top)                                                                   |
| **PrintLabelsModal**       | Modal               | "Print Labels" on Owners/Spaces                                       | Print integration (Bluetooth/AirPrint), batch count, label preview                                                     |
| **AddEventModal**          | Bottom Sheet        | "Add Event" on Calendar                                               | Title, date, time, description                                                                                         |
| **EventDetailModal**       | Bottom Sheet        | Tap calendar event                                                    | View/edit/delete event details                                                                                         |
| **FrameHeaderModal**       | Bottom Sheet        | Tap timeframe header in Planner                                       | Edit name and duration                                                                                                 |
| **PlannerSettingsModal**   | Bottom Sheet        | Settings icon in Planner                                              | Board-level configuration                                                                                              |
| **New Box Modal**          | Bottom Sheet        | Scan unrecognized QR                                                  | Box name, owner assignment, contents, destination room                                                                 |
| **Truck Placement Modal**  | Bottom Sheet        | Scan existing box                                                     | Zone assignment, vertical position                                                                                     |
| **Confirmation Dialogs**   | Alert/Modal         | Delete box, Reset move, Clear data                                    | Destructive action confirmations with explicit verification                                                            |

---

## 5. Navigation & Routing

### 5.1 Route Structure (Web — for reference)

```
/                       → AuthPage (landing)
/auth                   → AuthPage
/app                    → ProtectedRoute wrapper
  /app/                 → DashboardPage (index)
  /app/scan             → ScanPage
  /app/boxes            → BoxesListPage
  /app/box/:boxId       → BoxDetailsPage
  /app/owners           → ManageOwnersPage
  /app/spaces           → ManageSpacesPage
  /app/truck-load       → TruckLoadPage
  /app/settings         → SettingsPage
  /app/budget           → BudgetPage
  /app/calendar         → CalendarPage
  /app/planner          → PlannerPage
  /app/*                → Redirect to /app
/*                      → Redirect to /
```

### 5.2 Recommended Mobile Navigation

**Auth Stack** (unauthenticated):

- `LoginScreen` / `RegisterScreen`

**Main Stack** (authenticated, inside providers):

- **Bottom Tab Navigator** (5 tabs):
  1. **Dashboard** — Home icon
  2. **Inventory** — Boxes icon (BoxesList → BoxDetails drill-down)
  3. **Scan** — Camera/QR icon (center, prominent)
  4. **Planner** — Clipboard icon
  5. **Budget** — Dollar icon

- **Top Header Bar Pattern**:
  - Dashboard: Logo | "Dashboard" title | 3-dot menu (Settings, Profile, Logout)
  - All others: Back arrow | Screen title | 3-dot menu

- **Drawer / Settings Stack** (secondary screens):
  - Manage Owners
  - Manage Spaces
  - Truck Load
  - Calendar
  - Settings
  - Profile

### 5.3 Protected Route Logic

The `ProtectedRoute` component checks:

1. User is authenticated (Firebase Auth state)
2. A valid `moveId` exists
3. If either fails → redirect to Auth screen

---

## 6. State Management & Provider Hierarchy

### 6.1 Provider Nesting Order (from `main.tsx` + `App.tsx`)

```
<React.StrictMode>
  <BrowserRouter>              ← React Router (→ react-navigation on mobile)
    <AuthProvider>             ← Firebase auth state, moveId, user
      <ThemeProvider>          ← Dark/light mode toggle
        <SettingsProvider>     ← App settings (localStorage)
          /* Routes render here */
          <MoveProvider>       ← Move document, participants, presence
            <BoxesProvider>    ← Real-time box collection
              <OwnersProvider> ← Owners + Spaces collection
                <CalendarProvider> ← Calendar events
                  {children}
                </CalendarProvider>
              </OwnersProvider>
            </BoxesProvider>
          </MoveProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
```

### 6.2 Context Details

| Context              | Source                                    | Key State                                  | Key Functions                                                          |
| -------------------- | ----------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| **AuthContext**      | `features/auth/hooks/AuthContext.tsx`     | `user`, `currentUser`, `loading`, `moveId` | `setMoveId()`, `setRedirectPath()`                                     |
| **MoveProvider**     | `features/settings/hooks/MoveContext.tsx` | `move`, `presence`, `loading`, `error`     | Move document CRUD, participant management                             |
| **BoxesProvider**    | `features/boxes/hooks/useBoxes.tsx`       | `boxes[]`, `isLoading`                     | `addBox()`, `updateBox()`, `deleteBox()`, real-time Firestore listener |
| **OwnersProvider**   | `features/owners/hooks/useOwners.tsx`     | `owners[]`                                 | `addOwner()`, `updateOwner()`, `deleteOwner()`                         |
| **CalendarProvider** | `features/calendar/hooks/useCalendar.tsx` | `events[]`                                 | `addEvent()`, `updateEvent()`, `deleteEvent()`                         |
| **SettingsProvider** | `features/settings/hooks/useSettings.tsx` | `settings`                                 | `updateSettings()` — persisted to localStorage                         |
| **ThemeProvider**    | `hooks/useTheme.ts`                       | `theme`, `isDark`                          | `toggleTheme()` — class-based dark mode                                |

### 6.3 Key Custom Hooks

| Hook                          | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| `useAuth()`                   | Access auth state and moveId                    |
| `useBoxes()`                  | Real-time inventory with Firestore subscription |
| `useOwners()`                 | Owner/space metadata lookups                    |
| `useOwnersSpacesSeparation()` | Separated owners vs. spaces with stats          |
| `useCalendar()`               | Calendar event management                       |
| `useMove()`                   | Current move document, participants, presence   |
| `useSettings()`               | App configuration                               |
| `useTheme()`                  | Theme toggling                                  |
| `useDebounce()`               | Debounced input values                          |
| `useLocalStorage()`           | Typed localStorage persistence                  |
| `useLongPress()`              | Long-press gesture detection                    |

---

## 7. Data Models & Types

### 7.1 Box (Core entity)

```typescript
interface Box {
  id: string; // QR code value, e.g., "JD01"
  name: string; // "Kitchen Box #1"
  contents?: string; // Textual list of what's inside
  qrCodeValue: string; // Same as id
  currentStatus: ItemStatus;
  currentLocation?: string;
  destinationRoom?: string;
  imageUrl?: string; // Firebase Storage URL
  ownerUid?: string; // UID of Owner or CommunalSpace
  history: ScanEntry[]; // Chronological scan log
  createdAt: number;
  updatedAt: number;
  truckZone?: TruckZone;
  truckVerticalPosition?: VerticalPosition; // 'Bottom' | 'Middle' | 'Top'
}
```

### 7.2 Item Status Lifecycle

```
Prepared → Packed → Loaded → Unloaded → Delivered → Unpacked
                                                      ↑ Goal
```

```typescript
enum ItemStatus {
  PREPARED = 'Prepared', // Label printed, ready for packing
  PACKED = 'Packed', // Sealed with QR applied
  LOADED = 'Loaded', // On the truck
  UNLOADED = 'Unloaded', // At destination (garage/entryway)
  DELIVERED = 'Delivered', // In its intended room
  UNPACKED = 'Unpacked', // Contents put away
  UNKNOWN = 'Unknown',
}
```

### 7.3 Scan Entry

```typescript
interface ScanEntry {
  timestamp: number;
  location: string;
  notes?: string;
  statusChange?: ItemStatus;
}
```

### 7.4 Owner / Space (Separated Type System)

The app uses a **separated type system** for people vs. rooms:

```typescript
// Person
interface PersonalOwner {
  type: 'person';
  uid: string;
  firstName: string;
  lastName: string;
  initials?: string;
  color: string; // Hex color
  createdAt: number;
}

// Room / Location
interface CommunalSpace {
  type: 'space';
  uid: string; // e.g., "KT", "LR", "GA"
  name: string; // "Kitchen", "Living Room"
  category?: 'room' | 'storage' | 'utility' | 'custom';
  color: string;
  createdAt: number;
}

type OwnerOrSpace = PersonalOwner | CommunalSpace;
```

**Legacy compatibility**: A `LegacyOwner` interface exists where spaces were stored with `lastName: "(Communal)"` or `"(Custom Space)"`. Conversion utilities (`legacyOwnerToModern`, `modernToLegacyOwner`) are provided.

### 7.5 Truck Zones

```typescript
const TRUCK_ZONES = [
  'Cab',
  'Overhead',
  'Front Left',
  'Front Center',
  'Front Right',
  'Middle Left',
  'Middle Center',
  'Middle Right',
  'Back Left',
  'Back Center',
  'Back Right',
] as const;

type TruckZone = (typeof TRUCK_ZONES)[number];
type VerticalPosition = 'Bottom' | 'Middle' | 'Top';
```

### 7.6 Budget Types

```typescript
interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  merchantName: string;
  description: string;
  receiptImageBase64?: string;
}

interface Category {
  id: string;
  name: string;
  estimatedAmount: number;
  color: string; // Hex
  icon: string; // Key from ICONS map (e.g., "PackingSupplies")
  deletable?: boolean;
}

interface Budget {
  totalEstimatedAmount: number;
  moveType: MoveType; // 'local' | 'cross_state'
}

enum MoveType {
  LOCAL = 'local',
  CROSS_STATE = 'cross_state',
}
```

### 7.7 Predefined Communal Rooms

| UID | Name        | Color   |
| --- | ----------- | ------- |
| KT  | Kitchen     | #FFA500 |
| LR  | Living Room | #008000 |
| BR  | Bathroom    | #00FFFF |
| DR  | Dining Room | #800000 |
| BM  | Basement    | #FFC0CB |
| GA  | Garage      | #7B3F1B |
| OF  | Office      | #000080 |

---

## 8. Firebase / Firestore Schema

### 8.1 Collection Hierarchy

```
moves/{moveId}                      ← Move document (metadata, participants, createdBy/ownerId)
  ├── boxes/{boxId}                 ← Box records
  ├── owners/{ownerId}              ← Owners + Spaces (legacy combined collection)
  ├── calendar_events/{eventId}     ← Calendar items
  ├── expenses/{expenseId}          ← Budget expenses
  ├── categories/{categoryId}       ← Budget categories
  ├── budget/{budgetDoc}            ← Aggregate budget document(s)
  ├── plannerTasks/{taskId}         ← Planner tasks
  ├── plannerTimeframes/{timeframeId} ← Planner timeframes
  └── plannerConfig/{configId}      ← Planner settings

users/{userId}                      ← User profile (self-read/write + read by others)
presence/{presenceId}               ← Online/offline status (format: {moveId}_{userId})
```

### 8.2 Security Rules Summary

All subcollections under `moves/{moveId}` require:

- User is authenticated **AND**
- User is the `createdBy` or `ownerId` of the move **OR**
- User's UID exists in the move's `participants` map

The `users` collection: self-read/write + read by any authenticated user.
The `presence` collection: read/write by any authenticated user.

### 8.3 Move Document Shape

```typescript
{
  id: string;
  moveCode: string;           // Human-shareable code
  createdBy: string;          // Firebase UID of creator
  ownerId: string;            // Alias for createdBy (legacy support)
  participants: {             // Map of user UIDs → boolean
    [userId: string]: true
  };
  moveDate?: string;          // Target moving date
  // ... other metadata
}
```

---

## 9. External Services & Integrations

| Service                | Purpose                              | API/SDK              | Auth                          |
| ---------------------- | ------------------------------------ | -------------------- | ----------------------------- |
| **Firebase Auth**      | User authentication                  | `firebase/auth`      | Email/password + Google OAuth |
| **Cloud Firestore**    | Primary database                     | `firebase/firestore` | Firestore security rules      |
| **Firebase Storage**   | Image uploads (box photos, receipts) | `firebase/storage`   | Storage security rules        |
| **Mindee Receipt OCR** | Extract data from receipt photos     | REST API             | `VITE_MINDEE_API_KEY`         |

### Mindee OCR Endpoint

```
POST https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict
Content-Type: multipart/form-data
Authorization: Token {MINDEE_API_KEY}
Body: FormData with receipt image
```

---

## 10. Design System & Branding

### 11.1 Brand Colors

| Role                          | Hex       | Usage                                                                                                             |
| ----------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| **Primary**                   | `#1E3A5F` | App structure/navigation — sidebar, headers, active nav. **Never for buttons.**                                   |
| **Secondary**                 | `#708090` | Supporting text, icons, labels, inactive items                                                                    |
| **Tertiary / Primary Action** | `#FF7E00` | **Only** the single most important action per screen. If more than one element is orange, the hierarchy is wrong. |
| **Accent**                    | `#E1A95F` | Light emphasis only — badges, counts, highlights. Never buttons.                                                  |
| **Background**                | `#D3D3D3` | Page backgrounds                                                                                                  |
| **Surface**                   | `#FFFFFF` | Cards, inputs, panels                                                                                             |
| **Text**                      | `#1F1F1F` | Primary text                                                                                                      |
| **Borders**                   | `#C4C4C4` | Dividers, card borders                                                                                            |

**Dark Mode**:
| Token | Hex |
|-------|-----|
| Body BG | `#0F172A` |
| Card BG | `#1E293B` |
| Text Primary | `#F8FAFC` |
| Text Secondary | `#CBD5E1` |

**Semantic Colors**: Success `#22C55E`, Warning `#F59E0B`, Error `#EF4444`, Info `#3B82F6`

### 11.2 Typography

- **Primary font**: **Nunito** (weights: 400, 600, 700)
- **Fallbacks**: system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif
- **Design system tokens** reference Inter as well — Nunito takes precedence per branding bible
- **Mobile scale**: h1 32px, h2 26px, h3 22px, body 16px (lh 1.6)
- **No decorative fonts**

### 11.3 Spacing & Touch Targets

- **Minimum touch target**: 44px
- **Comfortable touch target**: 48px
- **Container padding**: mobile 1rem, tablet 1.5rem, desktop 2rem
- **Mobile nav height**: 80px (bottom nav)
- **Desktop sidebar width**: 256px

### 11.4 Box Status Colors

Each `ItemStatus` has predefined background, border, and text color presets. Use the `StatusBadge` component for consistency.

### 11.5 Motion & Animation

- **Fast**: 150ms | **Normal**: 250ms | **Slow**: 400ms
- **Reduced motion**: Respects `prefers-reduced-motion`
- **Easings**: bounce, smooth, sharp, linear
- **Variants**: page, card, button, modal, bottomSheet, listItem, spinner, feedback

### 11.6 Voice & Tone Rules

- Clarity beats personality
- Always show the next step
- Confident, not commanding
- Plain language, no jargon
- No emojis in core UI (allowed in marketing)
- Error messages reduce stress, not explain engineering

---

## 11. Accessibility & UX Requirements

- **Color contrast**: 4.5:1 minimum for text (WCAG AA)
- **Focus rings**: Visible on all interactive elements
- **Motion**: Zero-duration when `prefers-reduced-motion` is active
- **Touch targets**: 44px minimum
- **Screen reader**: Semantic HTML structure; headings hierarchy
- **One-handed operation**: Critical features within thumb reach zones

---

## 12. Mobile-Specific Considerations

### 12.1 Critical Requirements

| Requirement                  | Details                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| **Offline Mode**             | Moving day means unreliable internet. Firestore offline persistence is **non-negotiable**. |
| **Camera Permissions**       | QR scanning, box photos, receipt OCR all need camera access                                |
| **File Storage Permissions** | Data exports (JSON/Spreadsheet), QR label generation                                       |
| **Calendar Integration**     | Consider device calendar sync for move events                                              |
| **Biometric Auth**           | Enhance login with fingerprint/Face ID                                                     |
| **Secure Token Storage**     | Use Keychain (iOS) / Keystore (Android) for auth tokens                                    |

### 12.2 Performance Targets

- Use `FlashList` (not FlatList) for box lists — must handle 100s of boxes smoothly
- Lightweight `BoxCard` component — it's the highest-frequency rendered component
- Lazy-load heavy components (truck visualization, charts, camera)
- Image caching with `expo-file-system` or `react-native-fs`

### 12.3 Suggested Native Libraries

| Web Library             | Native Replacement                                                   |
| ----------------------- | -------------------------------------------------------------------- |
| `react-router-dom`      | `@react-navigation/native`                                           |
| `shadcn/ui` (Radix)     | Native `Pressable`, `TextInput`, custom cards with shadows/elevation |
| `html5-qrcode`          | `react-native-vision-camera` + `react-native-qr-code-scanner`        |
| `recharts` / web charts | `victory-native` or `react-native-wagmi-charts`                      |
| CSS Tailwind            | `nativewind` or `StyleSheet`                                         |
| `react-toastify`        | `react-native-toast-message`                                         |
| Firebase Web SDK        | `@react-native-firebase/*`                                           |

### 12.4 Deep Linking

- **Scheme**: `smoothmoves://`
- **Universal Links**: `https://smoothmoves.app/join/:moveId` → auto-opens app → triggers "Join Move" flow

### 12.5 Environment Variables

Replace Vite's `import.meta.env` with `react-native-config` or `expo-constants`:

```
FIREBASE_API_KEY=AIzaSyBibAvMQXtrjYdH__zgSiuMpwa_AJvhAdY
FIREBASE_AUTH_DOMAIN=smoothmoves-60679.firebaseapp.com
FIREBASE_PROJECT_ID=smoothmoves-60679
FIREBASE_STORAGE_BUCKET=smoothmoves-60679.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=995435440911
FIREBASE_APP_ID=1:995435440911:web:5f7506cef2e91c98ea6c7a
MINDEE_API_KEY=<your_key>
```

---

## 13. Environment Variables

| Variable (Web)                      | Purpose                   | Required |
| ----------------------------------- | ------------------------- | -------- |
| `VITE_FIREBASE_API_KEY`             | Firebase project API key  | ✅       |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Auth domain      | ✅       |
| `VITE_FIREBASE_PROJECT_ID`          | Firestore project ID      | ✅       |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage bucket   | ✅       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender | ✅       |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID           | ✅       |
| `VITE_MINDEE_API_KEY`               | Mindee Receipt OCR        | ✅       |

---

## 14. File Map (Key Source Locations)

```
CodebaseRestructure/
├── src/
│   ├── main.tsx                           ← App bootstrap, Firebase init, provider tree root
│   ├── App.tsx                            ← Routing + MainAppLayout with provider nesting
│   ├── types/
│   │   ├── index.ts                       ← Box, Owner, ItemStatus, TruckZone, ScanEntry
│   │   └── owners-spaces.ts              ← PersonalOwner, CommunalSpace, type guards, migration utils
│   ├── features/
│   │   ├── auth/
│   │   │   ├── pages/AuthPage.tsx        ← Login/Register + Move creation/joining
│   │   │   ├── hooks/AuthContext.tsx      ← Auth provider + useAuth()
│   │   │   ├── components/ProtectedRoute.tsx ← Route guard
│   │   │   └── services/authService.ts   ← Firebase auth operations
│   │   ├── boxes/
│   │   │   ├── pages/ScanPage.tsx        ← QR scanner
│   │   │   ├── pages/BoxesListPage.tsx   ← Inventory directory
│   │   │   ├── pages/BoxDetailsPage.tsx  ← Single box view/edit
│   │   │   ├── pages/PackBoxPage.tsx     ← Packing wizard
│   │   │   ├── pages/TruckLoadPage.tsx   ← Truck visualization
│   │   │   ├── hooks/useBoxes.tsx        ← BoxesProvider + useBoxes()
│   │   │   ├── components/BoxCard.tsx    ← Reusable box card
│   │   │   └── services/                 ← Firestore box operations
│   │   ├── owners/
│   │   │   ├── pages/ManageOwnersPage.tsx    ← Owner CRUD
│   │   │   ├── pages/ManageSpacesPage.tsx    ← Space CRUD
│   │   │   ├── hooks/useOwners.tsx           ← OwnersProvider
│   │   │   ├── hooks/useOwnersSpacesSeparation.ts ← Separated data hook
│   │   │   └── components/AddOwnerModal.tsx  ← Owner creation modal
│   │   ├── budget/
│   │   │   ├── pages/BudgetPage.tsx      ← Budget management
│   │   │   ├── constants/constants.tsx   ← Budget templates, categories, icons, Firebase config
│   │   │   ├── types/types.ts            ← Expense, Category, Budget, MoveType
│   │   │   ├── hooks/useBudget.tsx       ← Budget state management
│   │   │   └── components/              ← 23 budget-related components
│   │   ├── calendar/
│   │   │   ├── pages/CalendarPage.tsx    ← Calendar views
│   │   │   ├── hooks/useCalendar.tsx     ← CalendarProvider
│   │   │   └── components/              ← 6 calendar components
│   │   ├── planner/                      ← Basic planner
│   │   ├── planner-enhanced/             ← Enhanced planner (18 components, 5 services)
│   │   └── settings/
│   │       ├── pages/DashboardPage.tsx   ← Main dashboard
│   │       ├── pages/SettingsPage.tsx    ← App settings
│   │       ├── hooks/MoveContext.tsx     ← MoveProvider
│   │       ├── hooks/useSettings.tsx     ← SettingsProvider
│   │       └── components/              ← Dashboard widgets (BentoGrid, ProgressChart, TruckLayout, BudgetOverview)
│   ├── components/
│   │   ├── design-system/               ← Foundations (colors, typography, spacing, shadows) + components
│   │   ├── layout/MobileAppShell.tsx    ← App shell wrapper
│   │   ├── navigation/
│   │   │   ├── BottomNavigation/        ← Mobile bottom tabs
│   │   │   ├── SidebarNavigation/       ← Desktop sidebar
│   │   │   └── ContextualNavigation/    ← Contextual nav
│   │   ├── common/                      ← 16 shared components
│   │   └── ui/                          ← 50 Shadcn/Radix-style UI primitives
│   ├── hooks/                           ← useTheme, useDebounce, useLocalStorage, useLongPress
│   └── lib/
│       ├── config/constants.tsx         ← Firebase config, icons
│       └── animations/config.ts         ← Motion presets
├── firebase/
│   ├── firestore.rules                  ← Security rules
│   └── firebase.json                    ← Hosting config
├── docs/
│   ├── design/Developer-Design-Guide.md ← Visual system reference
│   └── smooth_moves_branding_bible.md   ← Brand voice, colors, typography, personality
├── conversion.md                        ← React Native architecture reference
└── conversion_features_overview.md      ← Feature descriptions for non-technical audience
```

---

> **Questions?** This document covers the complete app surface. For implementation-specific details, refer to the source files listed in Section 14 and the `AGENTS.md` for build/run commands.
