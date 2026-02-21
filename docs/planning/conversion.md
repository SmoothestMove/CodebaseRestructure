# React Native Conversion: Requirements & Architecture

This document outlines the pages, components, states, and routes required to convert the Smooth Moves web application into a React Native mobile app.

## 1. Core Navigation Structure

The mobile app should follow a standard React Native Navigation pattern, likely using `@react-navigation/native`.

### 1.1 Navigation Hierarchy

- **Auth Stack**:
  - `LoginScreen` / `RegisterScreen` (Combined in the current `AuthPage`)
- **Main App (Authenticated)**:
  - **Top Tab Navigator**:
    - DashBoard (left to right): Logo | "Dashboard" | 3 Dots Menu (Settings, Profile, Logout, Notifications)
    - All other screens: Back arrow, Screen Title, 3 Dots Menu (Settings, Profile, Logout, Notifications)
  - **Bottom Tab Navigator**:
    - Dashboard
    - Inventory (List & Details)
    - Scan
    - Planner
    - Budget
  - **App Drawer (Settings & Secondary Tools)**:
    - Manage Owners
    - Manage Spaces
    - Budget
    - Planner
    - Truck Load
    - Profile/Settings

## 2. Screens (Pages)

| Screen Name      | Original File          | Purpose                                           | Vital Information                                                                    |
| :--------------- | :--------------------- | :------------------------------------------------ | :----------------------------------------------------------------------------------- |
| **AuthScreen**   | `AuthPage.tsx`         | User authentication (Login/Sign-up).              | Needs to handle biometrics and secure token storage.                                 |
| **Dashboard**    | `DashboardPage.tsx`    | Main overview with bento grid and status widgets. | Requires high-performance layout for visualization widgets.                          |
| **Scan**         | `ScanPage.tsx`         | QR code scanning for boxes and inventory.         | **CRITICAL**: Needs `react-native-vision-camera` or similar for high-speed scanning. |
| **BoxesList**    | `BoxesListPage.tsx`    | Directory of all packed boxes with filters.       | Should use `FlashList` for high-performance scrolling.                               |
| **BoxDetails**   | `BoxDetailsPage.tsx`   | Detailed view of a specific box's contents.       | Includes photo management and itemized list.                                         |
| **PackBox**      | `PackBoxPage.tsx`      | Dedicated flow for packing a new box.             | Step-by-step wizard interface.                                                       |
| **ManageOwners** | `ManageOwnersPage.tsx` | List and management of property owners.           | Simple CRUD interface.                                                               |
| **ManageSpaces** | `ManageSpacesPage.tsx` | Management of rooms/storage spaces.               | Includes location tagging logic.                                                     |
| **TruckLoad**    | `TruckLoadPage.tsx`    | Visual guide for loading the truck.               | Requires custom canvas or SVG visualization for the truck layout.                    |
| **Budget**       | `BudgetPage.tsx`       | Expense tracking and budget management.           | Needs financial visualization (Charts).                                              |
| **Calendar**     | `CalendarPage.tsx`     | Move timeline and important dates.                | Integration with device calendar is highly recommended.                              |
| **Planner**      | `PlannerPage.tsx`      | Task management and move planning board.          | **COMPLEX**: Kanban-style board with drag-and-drop.                                  |
| **Settings**     | `SettingsPage.tsx`     | App and user configuration.                       | Local state persistence and sync settings.                                           |

### 2.2 Detailed Page Breakdowns

#### Auth Screen

- **Auth Mode Toggle**: Tabs to switch between "Sign In" and "Create Account".
- **Email/Password Form**: Standard authentication inputs.
- **Google Auth Button**: Single sign-on integration.
- **Move Operation Switcher**: After login, if no move is active, shows buttons for:
  - **Create New Move**: Opens a form to name and initialize a move.
  - **Join Existing Move**: Opens an input for a unique Move ID.
- **Initialization Loading**: Spinner shown while local session and Firebase state are synchronized.

#### Dashboard

- **Bento Grid Layout**: Responsive grid of cards/widgets.
- **Quick Action Buttons**: Direct routing to "Scan", "Pack", and "Inventory".
- **Progress Widgets**: Visual charts for packing completion and budget status.
- **Separation Test Widget**: (Dev/Audit) Tool to verify owner/space data isolation.
- **Navigation Sidebar/Bottom Bar**: Main routing entry points.

#### Scan Screen

- **QR Scanner Overlay**: Active camera view with a scanning frame.
- **Capture Photo Logic**: Button to freeze frame or take a high-res photo for box identification.
- **New Box Modal (Submit)**: Triggered when an unrecognized QR is scanned. Allows assigning Name, Owner, and Contents.
- **Truck Placement Modal**: Triggered after scanning an existing box. Allows assigning it to a specific `TruckZone`.
- **Quick Deliver/Stage Buttons**: One-tap status updates for efficiency on moving day.

#### Boxes List

- **Global Search Bar**: Real-time filtering across name, contents, and location.
- **Status Filter Dropdown**: Multi-select or radio buttons for "Packed", "In Transit", "Delivered", etc.
- **Sort Controls**: Toggle between Date, Name, and Weight.
- **Print Labels Redirect**: Button linking to Owner management for generating new labels.

#### Box Details

- **Edit Mode Toggle**: Swaps text displays for inputs to allow metadata updates.
- **Camera/Scanner Integration**: Buttons to re-scan the box or update its identification photo.
- **Location & Zone Selector**: Opens the `TruckZoneSelectorModal` to update the box's physical position.
- **Itemized Contents List**: Management for specific items inside the box.
- **Delete Action**: Confirmation dialog for removing a box from the move.

#### Manage Owners

- **Add Personal Owner Button**: Triggers `AddOwnerModal` for new person entry.
- **Batch Print Confirmation**: Automatically appears after adding an owner to prep initial labels.
- **Owner Cards**: Displays owner stats with an "Actions" menu for editing or printing more labels.

#### Manage Spaces

- **Add Custom Space Button**: Triggers `AddSpaceModal` for defining new rooms/areas.
- **Predefined Space Grid**: Clickable cards for standard house rooms (Kitchen, Bed 1, etc.).
- **Space-Specific Print**: Action to generate labels specifically for a room's inventory.

#### Truck Load

- **Interactive Truck Map**: SVG or Canvas where users click "Zones" to see filtered contents.
- **Zone Detail Overlay**: List of boxes currently assigned to a specific truck section.
- **Truck Progress Bar**: Visualization of how much "volume" or "weight" is currently loaded.

#### Settings Page

- **Move ID Management**: Display of the current move's unique code with a "Copy to Clipboard" button.
- **Data Export Suite**: Buttons to trigger JSON export or Generate Spreadsheet.
- **Destructive Actions**: Modals for "Reset Move" or "Clear All Data" with verification prompts.
- **Move Date Picker**: Input to set/update the target move day, affecting countdowns.

#### Budget Page

- **Add Expense Button**: Triggers `AddExpenseModal` with receipt photo capability.
- **Category Manager Modal**: Interface to define and color-code budget buckets.
- **Setup Wizard**: Triggered for first-time users to define total budget and core categories.
- **Receipt OCR Scanner**: Specialized modal that uses camera to extract data from receipts.

#### Calendar Page

- **View Toggle**: Switcher for Month/Week/Day/Agenda modes.
- **Add Event Button**: Triggers `AddEventModal` for scheduling move-related tasks.
- **Event Detail Modal**: Appears when clicking an event; allows editing, deleting, or navigation to related features.

#### Planner Page

- **Global Settings Modal**: Settings for the entire planning board (colors, visibility).
- **Add Task Button**: Appears in each column or at the top; triggers `TaskModal`.
- **Task Card Interaction**: Clicking a card opens the `TaskModal` for subtasks, notes, and owners.
- **Frame Header Modal**: Clicking a timeframe (e.g., "Move Day", "Week 1") allows editing the frame's name and duration.

## 3. Reusable Components

### 3.1 UI Library Mapping

The current app uses `shadcn/ui` (Radix UI). These must be mapped to Native Primitives or a Native UI library:

- **Buttons/Inputs**: Native `TouchableOpacity`, `Pressable`, `TextInput`.
- **Cards**: `View` with elevation (Android) and shadows (iOS).
- **Badges/Labels**: Custom themed `Text` components.
- **Charts**: Use `react-native-wagmi-charts` or `victory-native`.

### 3.2 Feature-Specific Components

1. **BoxCard**: High-frequency component for listings. Needs to be lightweight.
2. **QRCodeScanner**: Custom camera overlay with focus area.
3. **BentoGrid**: Responsive grid component (Adaptive layout for mobile).
4. **TruckVisualization**: SVG or Canvas-based interactive truck layout.
5. **TimelineTaskCard**: Specialized card for the planner view.

## 4. Modals & Sheets

Mobile apps typically prefer **Bottom Sheets** over centered modals for better ergonomics.

| Modal Name            | Type         | Purpose                                                     |
| :-------------------- | :----------- | :---------------------------------------------------------- |
| **AddOwnerModal**     | Bottom Sheet | Quick owner entry.                                          |
| **AddSpaceModal**     | Bottom Sheet | Quick room/space entry.                                     |
| **AddExpenseModal**   | Full Screen  | Detailed expense entry with receipt photo.                  |
| **ReceiptScanModal**  | Overlay      | Camera interface for receipt OCR.                           |
| **SetupBudgetModal**  | Wizard       | Initial financial configuration.                            |
| **TaskModal**         | Full Screen  | **CRITICAL**: Complex task editing (subtasks, attachments). |
| **TruckZoneSelector** | Bottom Sheet | Assigning boxes to specific truck sections.                 |
| **PrintLabelsModal**  | Modal        | Integration with Bluetooth/AirPrint.                        |

## 5. State Management & Hooks

The React Native app will inherit the existing logic but needs adaptations:

### 5.1 Contexts/Providers

- **AuthContext**: Transitions from Firebase Web Auth to `react-native-firebase/auth`.
- **BoxesProvider**: Data sync using Firestore offline persistence.
- **OwnersProvider**: Simple state for owner/space lookup.
- **BudgetProvider**: Heavy calculation logic for financial formulas.
- **MoveContext**: Global state for the current active move.

### 5.2 Key Hooks

- `useAuth()`: Managing sessions.
- `useBoxes()`: Real-time inventory updates.
- `useOwners()`: Metadata lookups.
- `useCalendar()`: Scheduling logic.
- `useScanner()`: Camera and scanner logic.

## 6. Vital Implementation Notes

1. **Authentication**: Use `react-native-firebase` for native performance and background tasks.
2. **Storage**: Images should be uploaded to Firebase Storage with local caching using `expo-file-system` or `react-native-fs`.
3. **Offline Mode**: This is a move-day app. **Robust offline support** (Firestore persistence) is non-negotiable.
4. **Permissions**: Need explicit handlers for:
   - Camera (Scanning/Photos)
   - File Storage (Exports/Labels)
   - Calendar (Timeline)
5. **UI Scaling**: Ensure all components use relative sizing (Flexbox) and handle different device notches/safe areas.

## 7. External Services & Native Integrations

### 7.1 OCR (Mindee)

- **Implementation**: Native camera capture -> `FormData` upload to Mindee API.
- **Endpoint**: `https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict`.

## 8. Platform Specifics

### 8.1 Deep Linking

- **Scheme**: `smoothmoves://`
- **Universal Links**: Support `https://smoothmoves.app/join/:moveId` to auto-open the app and trigger the "Join Move" flow.

### 8.2 Environment Variables

- **Config**: `import.meta.env` is Vite-specific. Use `react-native-config` or `expo-constants` to inject API keys (`FIREBASE_API_KEY`, etc.).

## 9. Variables

### 9.1 .env

#### Firebase Configuration

`EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyBibAvMQXtrjYdH\_\_zgSiuMpwa_AJvhAdY"`
`EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="smoothmoves-60679.firebaseapp.com"`
`EXPO_PUBLIC_FIREBASE_PROJECT_ID="smoothmoves-60679"`
`EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="smoothmoves-60679.firebasestorage.app"`
`EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="995435440911"`
`EXPO_PUBLIC_FIREBASE_APP_ID="1:995435440911:web:5f7506cef2e91c98ea6c7a"`

Android
ANDROID_HOME="C:\Users\justi\AppData\Local\Android\Sdk"
