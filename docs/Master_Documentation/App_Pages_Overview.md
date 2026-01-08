# App Pages Overview & Design Specifications

This document provides a comprehensive design specification for the **Smooth Moves** application. It details the purpose, granular UI elements, routing/navigation behavior, and visual states for every page to facilitate accurate design mockups and handoffs.

---

## 1. Authentication Page
**Route:** `/auth` (or `/` if unauthenticated)
**Purpose:** Entry point. Handles Sign In, Registration, and Move Association (Create/Join).

### View: Sign In (Default Tab)
**UI Elements:**
-   **Header:** Logo, Title "Welcome Back!", Subtitle.
-   **Move Selector:** Radio buttons ("Start a New Move", "Join an Existing Move").
    -   *Logic:* Toggles `moveMode` state.
    -   *Conditional:* If "Join" is selected, show "Move ID" input field.
-   **Tabs:** "Sign In" (Active), "Register" (Inactive).
-   **Form:** Email Input, Password Input (with visibility toggle), "Forgot Password" link.
-   **Primary Action:** "Sign In" Button.
-   **Social Auth:** "Sign in with Google" Button.
-   **Footer:** "Don't have an account?" text with "Sign Up" link.

**Routing & Interactions:**
-   **"Sign In" Button:** Validates credentials -> Authenticates via Firebase -> Checks if user has a Move -> Navigates to `/app` (Dashboard).
-   **"Sign Up" Link / "Register" Tab:** Switches view to Registration mode.
-   **"Forgot Password":** *Current Logic:* Shows Toast notification "Not implemented".
-   **"Sign in with Google":** Triggers Google OAuth popup -> On success, navigates to `/app`.

**States:**
-   **Idle:** Form clean, buttons enabled.
-   **Loading:** Buttons disabled, spinner icon on "Sign In" button.
-   **Error:** Alert banner appears above form (e.g., "Invalid email or password").

### View: Register (Tab)
**UI Elements:**
-   **Header:** Title "Create Your Account".
-   **Form Updates:** Adds "Full Name" input, "Confirm Password" input.
-   **Action:** "Create Account" Button.

**Routing & Interactions:**
-   **"Create Account":** Creates Auth User -> Creates Firestore User Doc -> (If "New Move") Creates Move -> (If "Join Move") Adds user to Move -> Navigates to `/app`.

---

## 2. Dashboard
**Route:** `/app` (Index)
**Purpose:** Command center. Overview of progress and quick navigation.

### View: Main Dashboard
**UI Elements:**
-   **Navbar (Global):** Hamburger/Sidebar toggle, Logo, Profile Avatar.
-   **Header Card:** "Dashboard Overview", Move Code (e.g., "X7Y2Z9"), Stats (Owners/Spaces counts).
    -   *Dev Mode:* "Randomize" button (Populates fake data).
-   **Progress Charts:**
    -   "Box Packing Progress" Stacked Bar Chart.
    -   "Budget Overview" Widget (Mini-summary).
-   **Space Grid (Bento):** Grid of cards for each Room/Owner showing box counts.
-   **Participants:** Grid of avatars with Online/Offline status dots.

**Routing & Interactions:**
-   **Navbar Links:** Navigate to respective pages (`/app/scan`, `/app/boxes`, etc.).
-   **Space Cards:** *Interaction:* Clicking a card filters the "All Boxes" list for that specific owner/space (Navigates to `/app/boxes?filter=[ID]`).
-   **"Randomize" (Dev):** Triggers `generateEnhancedRandomizedMoveData()` -> Refreshes dashboard with mock data.

**States:**
-   **Loading:** Skeleton loaders for charts and participants.
-   **Empty:** "No boxes found", "No participants".
-   **Populated:** Charts show data, grid is full.
-   **Error:** Red error banner if Move ID is invalid or network fails.

---

## 3. Scan Box
**Route:** `/app/scan`
**Purpose:** Box interaction via QR code.

### View: Scanner Active (Default)
**UI Elements:**
-   **Header:** "Scan Box Label", "Quick Scan" Toggle.
-   **Viewport:** Camera feed, overlay brackets, animated scan line.
-   **Manual Actions:** "Print Labels" button, "Scan Another" button (hidden initially).

**Routing & Interactions:**
-   **"Quick Scan" Toggle:** Updates URL state (`?mode=quick`) -> Toggles `isQuickScanMode`.
-   **Successful Scan:**
    -   *If Box Exists:* Shows success feedback -> Redirects to Box Details (`/app/box/:id`) OR opens "Truck Load" modal (if Quick Scan).
    -   *If New QR:* Opens "Pack Box" Modal.
-   **"Print Labels":** Navigates to `/app/owners`.

### Modal: Pack Box (New QR)
**UI Elements:**
-   **Form:** Name, Contents, Initial Location, Destination Room.
-   **Image:** "Take Photo" / "Upload" buttons -> Preview thumbnail.
-   **Actions:** "Cancel", "Save & Pack".

**Routing & Interactions:**
-   **"Save & Pack":** Creates Box record -> Sets status `PACKED` -> Updates Scan History -> Closes modal -> Shows success toast.
-   **"Take Photo":** Activates camera stream in modal -> Captures still image -> Converts to Data URL.

### Modal: Truck Zone Selector (Quick Scan + Packed Box)
**UI Elements:**
-   **Diagram:** Truck zones (Attic, Front, Back).
-   **Buttons:** Zone selection (e.g., "Front-Left").
-   **Position:** "Floor", "Middle", "Top".
-   **Action:** "Confirm Load".

**Routing & Interactions:**
-   **"Confirm Load":** Updates Box status to `LOADED` -> Sets `truckZone` -> Closes modal -> Resets scanner.

**States:**
-   **Permission Denied:** "Camera access required" message + "Retry" button.
-   **Processing:** Overlay "Processing Scan..." over camera view.
-   **Success:** Green banner "Box Found".
-   **Error:** Red banner "Box not found" or "Network Error".

---

## 4. All Boxes List
**Route:** `/app/boxes`
**Purpose:** Master inventory list.

### View: List
**UI Elements:**
-   **Header:** "All Tracked Boxes", "Print More Labels" button.
-   **Filters:** Search Input, "Stage" Dropdown (Packed, Loaded, etc.), "Sort" Dropdown.
-   **Grid:** Grid of **Box Cards**.
    -   *Box Card:* Name, ID, Status Pill, Location Icon, Owner Badge, "View Details" button.

**Routing & Interactions:**
-   **"Print More Labels":** Navigates to `/app/owners`.
-   **Search/Filter:** *Logic:* Client-side filtering of the `boxes` array. Updates view instantly.
-   **"View Details" (Card):** Navigates to `/app/box/:id`.

**States:**
-   **Loading:** Spinner icon.
-   **Empty (No Data):** "No boxes yet" -> Call to action "Add Owner & Print Labels".
-   **Empty (No Match):** "No boxes match your search".

---

## 5. Box Details
**Route:** `/app/box/:boxId`
**Purpose:** Detailed view and edit.

### View: Details
**UI Elements:**
-   **Header:** Name, Owner Badge, Status Pill.
-   **Left Col:** Image/QR Code.
-   **Right Col:** Contents text, Location/Date metadata.
-   **Actions:** "Edit Details" (Pencil), "Update Status" (Camera), "Delete" (Trash).
-   **History:** Timeline of status changes.

**Routing & Interactions:**
-   **"Edit Details":** Opens **Edit Modal**.
-   **"Update Status":** Opens **Scan/Status Modal**.
-   **"Delete":** *Logic:* Shows `window.confirm` -> If yes, deletes box -> Redirects to `/app/boxes`.

### Modal: Edit Details
**UI Elements:**
-   Inputs: Name, Contents, Destination.
-   Selects: Owner (Person), Space (Room).
-   *Logic:* Warning if both Person and Space are selected.

**Routing & Interactions:**
-   **"Save":** Updates Firestore -> Closes Modal -> Refreshes Page.

---

## 6. Manage Owners
**Route:** `/app/owners`
**Purpose:** Manage people and generate labels.

### View: Owners List
**UI Elements:**
-   **Header:** "Manage Personal Owners", "Add Owner" Button.
-   **Grid:** Owner Cards (Avatar, Box Count).
    -   *Card Actions:* "Generate Labels", "Edit", "Delete".

**Routing & Interactions:**
-   **"Add Owner":** Opens **Add Owner Modal**.
-   **"Generate Labels":**
    -   *Logic:* Triggers PDF Generation function -> Downloads PDF file.
    -   *Flow:* Opens "Batch Print Confirmation" Modal -> User confirms count -> PDF downloads.

### Modal: Add Owner
**UI Elements:** First/Last Name inputs, Color Picker.
**Logic:** Creates new Owner document in Firestore.

---

## 7. Manage Spaces
**Route:** `/app/spaces`
**Purpose:** Manage rooms/communal areas.

### View: Spaces List
**UI Elements:**
-   **Sections:** "Predefined Spaces" (Kitchen, etc.), "Custom Spaces".
-   **Header:** "Add Custom Space" Button.
-   **Grid:** Space Cards (House Icon).

**Routing & Interactions:**
-   **"Add Custom Space":** Opens **Add Space Modal**.
-   **"Generate Labels" (Card):** Same logic as Owners (PDF generation).

---

## 8. Truck Load
**Route:** `/app/truck-load`
**Purpose:** Truck visualization.

### View: Load Bay
**UI Elements:**
-   **Diagram:** Interactive SVG of Truck Zones.
-   **Filter:** "Search Loaded Boxes" input.
-   **List:** Box Cards for items currently status=`LOADED`.

**Routing & Interactions:**
-   **Click Zone (Diagram):** Filters list to show only boxes in that zone (e.g., "Mom's Attic").
-   **Click "Clear Zone":** Resets filter to show all loaded boxes.

---

## 9. Budget
**Route:** `/app/budget`
**Purpose:** Financial tracking.

### View: Dashboard
**UI Elements:**
-   **Summary:** Total Budget vs Spent Cards.
-   **Tabs:** "Expenses", "Categories", "Charts".

**Routing & Interactions:**
-   **"Edit Budget" (Header):** Opens **Setup Budget Modal**.
-   **"Add Expense" (Expenses Tab):** Opens **Add Expense Modal**.
-   **"Scan Receipt":** Opens **Receipt Scan Modal** (Uses Camera/File API).

**States:**
-   **Over Budget:** Progress bar turns Red. Warning text appears.

---

## 10. Calendar
**Route:** `/app/calendar`
**Purpose:** Schedule management.

### View: Month/Agenda
**UI Elements:**
-   **View Switcher:** Month/Week/Day/Agenda buttons.
-   **Grid:** Calendar cells with colored Event Bars.
-   **Action:** "Add Event" Button.

**Routing & Interactions:**
-   **Click Slot:** Opens **Add Event Modal** pre-filled with date.
-   **Click Event:** Opens **Event Detail Modal**.
-   **Drag & Drop:** *Logic:* Updates event start/end times in Firestore.

---

## 11. Marvin AI
**Route:** `/app/marvin`
**Purpose:** AI Chat Assistant.

### View: Chat Interface
**UI Elements:**
-   **History:** Scrollable list of chat bubbles.
-   **Input:** Text field, Send button.

**Routing & Interactions:**
-   **Send Message:**
    -   *Logic:* Sends text to LLM Service -> Parses intent -> Performs Action (e.g., "Create Calendar Event", "Query Budget") -> Returns response.
    -   *Feedback:* "Typing..." indicator while processing.

---

## 12. Planner
**Route:** `/app/planner`
**Purpose:** Kanban task board.

### View: Board
**UI Elements:**
-   **Columns:** "To Do", "In Progress", "Done".
-   **Task Cards:** Title, Priority Flag, Assignee Avatar.
-   **Action:** "+ Add Task" button.

**Routing & Interactions:**
-   **Drag Card:** Updates task status (Column) in Firestore.
-   **Click Card:** Opens **Task Detail Modal**.

---

## 13. Settings
**Route:** `/app/settings`
**Purpose:** Global config and data reset.

### View: Settings List
**UI Elements:**
-   **Current Move:** Move Code (Copy button).
-   **Appearance:** Dark Mode Toggle.
    -   *Logic:* Toggles CSS class `dark` on `<html>` root.
-   **Data Export:** "Export CSV", "Export JSON" buttons.
    -   *Logic:* Generates Blob -> Triggers browser download.
-   **Danger Zone:** "Reset Move", "Clear All Data".

**Routing & Interactions:**
-   **"Reset Move":** Opens **Reset Confirmation Modal** -> Requires typing "RESET" -> Clears Boxes/Events/Budget but keeps Users.
-   **"Clear All Data":** Opens **Nuclear Modal** -> Requires typing "DELETE" -> Wipes LocalStorage & Firestore -> Reloads App.
