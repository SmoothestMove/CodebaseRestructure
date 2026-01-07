# App Pages Overview & Design Specifications

This document provides a comprehensive list of all pages in the **Smooth Moves** application, detailing their purpose and the granular UI elements present on each. This guide is intended for design handoff (e.g., to Stitch) to create static mockups that accurately represent the application's genuine state.

---

## 1. Authentication Page (`/auth`)
**Purpose:** The entry point for the application. Allows users to sign in to an existing account or register for a new one. It also handles "Move" association (joining an existing move or creating a new one).

### View: Sign In (Default Tab)
**Elements:**
-   **Header Area:**
    -   Logo (Smooth Moves Icon).
    -   Title: "Welcome Back!".
    -   Subtitle: "Sign in to access your move dashboard."
-   **Move Option Selector:**
    -   Radio Buttons: "Start a New Move" vs "Join an Existing Move".
    -   *Conditional Input:* If "Join" is selected, a "Move ID" text input field appears.
-   **Tab Navigation:**
    -   "Sign In" Tab (Active/Highlighted).
    -   "Register" Tab (Inactive).
-   **Form Area:**
    -   Input Field: "Email Address" (Placeholder: you@example.com).
    -   Input Field: "Password" with "Show/Hide" eye icon toggle.
    -   Link: "Forgot password?" (Right-aligned under password).
    -   Primary Button: "Sign In" (Full width, with icon).
-   **Divider:**
    -   Horizontal line with "OR" text in the center.
-   **Social Auth:**
    -   Secondary Button: "Sign in with Google" (Full width, Google logo icon).
-   **Footer/Switch:**
    -   Text: "Don't have an account?" followed by a "Sign Up" link button.

### View: Register (Tab)
**Elements:**
-   **Header Area:** Title changes to "Create Your Account".
-   **Form Area (Updates):**
    -   Input Field: "Full Name" (Added at top).
    -   Input Field: "Email Address".
    -   Input Field: "Password" (with helper text: "Must be at least 8 characters long").
    -   Input Field: "Confirm Password" with "Show/Hide" eye icon toggle.
    -   Primary Button: "Create Account" (Full width, with User Plus icon).
-   **Social Auth:** Button text changes to "Sign up with Google".

---

## 2. Dashboard (`/app` - Home)
**Purpose:** The command center. Provides a high-level overview of the move's progress, quick access to key actions, and a snapshot of inventory status.

### View: Main Dashboard
**Elements:**
-   **Global Header (Navbar):**
    -   *Note: Present on all authenticated pages.*
    -   Hamburger Menu (Mobile) or Sidebar Navigation (Desktop).
    -   App Title/Logo.
    -   User Avatar/Profile Menu (Top Right).
-   **Page Header (Card):**
    -   Title: "Dashboard Overview".
    -   Subtitle: "Track your moving progress...".
    -   Move Code Display: "Move Code: [CODE]" (Small text).
    -   Stats Row: Icon + Count for "Personal Owners", Icon + Count for "Communal Spaces".
    -   *Dev Mode Only:* "Randomize" and "Reset" buttons.
-   **Progress Section:**
    -   **Chart Card:** "Box Packing Progress" Bar Chart (Stacked bars for Prepared, Packed, Loaded, etc.).
    -   **Progress Bar Widget:**
        -   Large Percentage Text (e.g., "45%").
        -   Horizontal Progress Bar (Visual fill).
        -   Grid of Stat Counts: Total, Prepared, Packed, Loaded, Delivered, Unpacked.
-   **Bento Grid (Spaces Overview):**
    -   Grid of cards representing rooms/owners.
    -   Each Card: Room Name, Icon/Color, Box Count (e.g., "5 boxes"), Status Pill (e.g., "In Progress").
-   **Truck Load Status (Conditional):**
    -   *Only appears if boxes are loaded.*
    -   Visual representation or list of loaded items.
-   **Budget Overview Widget:**
    -   Mini-summary of the budget (Total vs Spent).
-   **Participants Section:**
    -   Title: "Move Participants".
    -   Grid of User Cards: Avatar (Initial), Name, Online/Offline Status Indicator (Green/Gray dot).

---

## 3. Scan Box (`/app/scan`)
**Purpose:** The primary tool for interacting with physical boxes. Users scan QR codes to identify boxes, view details, or perform quick actions like packing or loading.

### View: Scanner Active (Default)
**Elements:**
-   **Header:**
    -   Title: "Scan Box Label" (with Camera icon).
    -   Toggle Button: "Standard Scan" vs "Quick Scan" (Top Right).
-   **Instruction Text:** "Position a box's QR label within the square..."
-   **Camera Viewport:**
    -   Large square viewfinder in the center.
    -   Scanner Overlay: Corner markers (bracket style).
    -   Animated "Laser" scan line moving up and down.
    -   Background: Semi-transparent overlay outside the scan area.
-   **Manual Actions (Below Camera):**
    -   Button: "Print Labels via Owners" (If error/not found).
    -   Button: "Scan Another" (If result displayed).

### State: Quick Scan Mode
**Elements:**
-   **Visual Cue:** Pulsing Orange/Amber Banner "Quick Scan Mode Active".
-   **Instruction Change:** "Scan a PACKED box to load it..."
-   **Overlay Color:** Scanner markers change color (e.g., to Orange) to differentiate mode.

### Modal: Pack Box Details (On Scan of "New/Prepared" Label)
**Elements:**
-   **Title:** "Pack Box: [ID]..."
-   **Owner Display:** Read-only field showing Assigned Owner (Color swatch + Name).
-   **Form Fields:**
    -   Input: "Box Name" (e.g., "Kitchen Pots").
    -   Textarea: "Contents" (List of items).
    -   Input: "Initial Packing Location" (e.g., "Old House Kitchen").
    -   Input: "Destination Room" (e.g., "New House Kitchen").
-   **Image Section:**
    -   Buttons: "Take Photo", "Choose File".
    -   *If active:* Camera preview window or Image Preview thumbnail with "X" remove button.
-   **Footer:**
    -   Button: "Cancel & Rescan".
    -   Primary Button: "Save & Pack Box".

### Modal: Truck Zone Selector (On Scan of "Packed" Box in Quick Mode)
**Elements:**
-   **Title:** "Load Box to Truck".
-   **Visual Diagram:** Simplified top-down view of truck zones (Mom's Attic, Front, Middle, Back).
-   **Selection Grid:** Buttons for each zone (e.g., "Front - Left", "Front - Right").
-   **Vertical Position:** Radio/Button group: "Floor", "Middle Stack", "Top Stack".
-   **Footer:** "Confirm Load".

---

## 4. All Boxes List (`/app/boxes`)
**Purpose:** A searchable, filterable master list of all tracked inventory.

### View: List
**Elements:**
-   **Header:**
    -   Title: "All Tracked Boxes" (with count).
    -   Primary Button: "Print More Labels" (Links to Owners).
-   **Filter/Search Bar (Row):**
    -   Input: "Search Your Boxes" (Placeholder: name, contents, ID).
    -   Dropdown: "Filter by Moving Stage" (All, Prepared, Packed, Loaded, etc.).
    -   Dropdown: "Sort By" (Newest, Oldest, Name A-Z).
-   **Content Area:**
    -   **Grid of Box Cards.**
-   **Element: Box Card:**
    -   Header: Box Name (Bold), Status Pill (Colored background).
    -   Sub-text: Box ID (Mono font).
    -   Body: Truncated list of contents.
    -   Details Row:
        -   Location Icon + "Current Location".
        -   Destination Icon + "Destination Room".
    -   Footer: "Assigned to: [Owner Name]" (with color dot).
    -   Action Button: "View Details" (Chevron icon).

---

## 5. Box Details (`/app/box/:id`)
**Purpose:** Deep dive into a specific box's data, history, and editing capabilities.

### View: Details
**Elements:**
-   **Navigation:** "Back" button (Top Left).
-   **Hero Header:**
    -   Large Title: Box Name.
    -   Owner Badge: Color swatch + Name.
    -   Box ID Display.
    -   Status Badge (Large, colored pill).
-   **Layout (Two Columns):**
    -   **Left Column (Visuals):**
        -   Box Photo (Large, rounded corners) OR Large QR Code placeholder.
        -   "Box QR Label" section with a smaller, scannable QR code.
    -   **Right Column (Info):**
        -   Section Title: "Box Details".
        -   Text Block: Full contents description.
        -   Data Grid: "Last Seen", "Destination Room", "Truck Placement" (if applicable), "Packed On" date.
        -   **Action Bar:**
            -   Button: "Edit Details" (Pencil icon).
            -   Button: "Update Location/Status" (Camera icon).
            -   Button: "Delete Box" (Trash icon, Red).
-   **History Section (Bottom):**
    -   Title: "Moving History".
    -   List/Timeline: Vertical list of status changes.
    -   List Item: Status Badge, Date/Time, Location Text, Notes (if any).

### Modal: Edit Details
**Elements:**
-   Form fields mirroring the "Pack Box" modal (Name, Contents, Destination).
-   Dropdown: "Assign to Person" (List of Owners).
-   Dropdown: "Assign to Space" (List of Spaces).
-   *Note:* Logic warning if both are selected.

---

## 6. Manage Owners (`/app/owners`)
**Purpose:** Manage "People" entities. Boxes can be assigned to these people. Also the entry point for printing labels.

### View: Owners List
**Elements:**
-   **Header:**
    -   Title: "Manage Personal Owners".
    -   Primary Button: "Add New Personal Owner" (Plus icon).
-   **Content:**
    -   Section Title: "Personal Owners" (Count).
    -   **Grid of Owner Cards.**
-   **Element: Owner Card:**
    -   Left Border: Color strip matching owner's assigned color.
    -   Avatar: Initials on colored background.
    -   Name: First & Last Name.
    -   Stats: "X Boxes Assigned".
    -   Action Row:
        -   Button: "Generate Labels" (PDF icon).
        -   Button: "Edit" (Pencil).
        -   Button: "Delete" (Trash).

### Modal: Add Owner
**Elements:**
-   Title: "Add New Owner".
-   Input: "First Name".
-   Input: "Last Name".
-   Color Picker: Row of clickable color circles.
-   Footer: "Cancel", "Add Owner".

---

## 7. Manage Spaces (`/app/spaces`)
**Purpose:** Manage "Room" or "Area" entities. Boxes can be assigned to spaces (e.g., "Kitchen") instead of specific people.

### View: Spaces List
**Elements:**
-   **Header:**
    -   Title: "Manage Your Spaces".
    -   Primary Button: "Add New Custom Space".
-   **Section 1: Predefined Spaces:**
    -   Title: "Predefined Communal Spaces".
    -   Grid of Space Cards (Standard rooms like Kitchen, Living Room).
-   **Section 2: Custom Spaces:**
    -   Title: "Your Custom Spaces".
    -   Grid of Space Cards (User-created).
-   **Element: Space Card:**
    -   Identical structure to Owner Card but with "Building/House" icons instead of User avatars.

---

## 8. Truck Load (`/app/truck-load`)
**Purpose:** Visual management of the moving truck's inventory.

### View: Load Bay
**Elements:**
-   **Header:** Title "Truck Loading Bay".
-   **Layout (Split):**
    -   **Left Panel (Diagram):**
        -   "Truck Diagram" container.
        -   Interactive SVG/Graphic of truck divided into zones (Attic, Front, Middle, Back).
        -   Visual indicators of "Fullness" or box counts per zone.
        -   Button: "Clear Zone Selection".
        -   Search Input: "Search Loaded Boxes".
    -   **Right Panel (List):**
        -   Header: "All Loaded Boxes" (or "Boxes in [Zone]").
        -   List of Box Cards (Simplified version of All Boxes list).
        -   Empty State: Icon + "No boxes currently loaded".

---

## 9. Budget (`/app/budget`)
**Purpose:** Financial tracking for the move.

### View: Budget Dashboard
**Elements:**
-   **Header:**
    -   Title: "Financial Navigator".
    -   Buttons: "Edit Budget", "Help" (Info icon).
-   **Summary Cards (Row):**
    -   Card 1: "Total Budget" (Currency).
    -   Card 2: "Total Spent" (Currency).
    -   Card 3: "Remaining" (Currency, colored Red/Green based on status).
-   **Progress Bar:**
    -   Label: "Budget Usage".
    -   Visual Bar: Percentage fill.
-   **Tab Navigation:** "Expenses", "Categories", "Charts".

### Tab: Expenses (Active)
**Elements:**
-   **Action Row:**
    -   Button: "Add Expense".
    -   Button: "Scan Receipt" (Camera icon).
-   **Filters:** Search input, Category dropdown.
-   **Expense List:**
    -   Table or List Rows: Date, Merchant, Category (Badge), Description, Amount.
    -   Action icons: Edit, Delete.

### Tab: Categories
**Elements:**
-   List of budget categories (e.g., "Movers", "Supplies").
-   Editable fields for "Estimated Amount" per category.
-   Progress bars per category (Spent vs Estimated).

### Tab: Charts
**Elements:**
-   Toggle: "Bar Chart" / "Pie Chart".
-   Graphic: Visual representation of spending distribution.

---

## 10. Calendar (`/app/calendar`)
**Purpose:** Scheduling move-related events, deadlines, and reminders.

### View: Month
**Elements:**
-   **Header:**
    -   Title: "Calendar".
    -   Date Range Text (e.g., "October 2023").
    -   View Switcher: "Month", "Week", "Day", "Agenda".
    -   Navigation: "<" ">" "Today" buttons.
-   **Grid:** Standard calendar grid.
    -   Event Blocks: Colored bars spanning days or times.
    -   Event Text: Title + Time.
    -   *Detail:* Events colored by assigned user/category.
-   **Floating Action Button (or Header Button):** "Add Event".

### Modal: Add/Edit Event
**Elements:**
-   Input: Title.
-   Date/Time Pickers (Start/End).
-   Checkbox: "All Day".
-   Dropdown: "Assignees" (Owners).
-   Textarea: "Description".
-   Footer: "Delete" (if editing), "Save".

---

## 11. Marvin AI (`/app/marvin`)
**Purpose:** AI Assistant interface for querying data or performing actions via text.

### View: Chat
**Elements:**
-   **Header:** Title "Marvin AI".
-   **Chat Window:**
    -   Scrollable area for message history.
    -   User Messages: Right-aligned bubbles.
    -   Marvin Responses: Left-aligned bubbles, potentially with rich data (lists, stats).
-   **Input Area (Bottom):**
    -   Text Input: "Ask Marvin..."
    -   Button: Send (Paper plane icon).
    -   *Optional:* Microphone icon for voice mode.

---

## 12. Planner (`/app/planner`)
**Purpose:** Task management and "To-Do" list for the move process.

### View: Board
**Elements:**
-   **Header:** "Planner".
-   **Kanban Board:**
    -   Columns: "To Do", "In Progress", "Done".
    -   Column Headers: Title + Task Count.
-   **Task Cards:**
    -   Card Content: Task Title, Priority Flag (High/Med/Low), Due Date.
    -   Assignee Avatar (small).
-   **Actions:**
    -   "+ Add Task" button at the bottom of columns.

---

## 13. Settings (`/app/settings`)
**Purpose:** Global application configuration and data management.

### View: Settings List
**Elements:**
-   **Header:** "Application Settings".
-   **Section: Current Move:**
    -   Card showing "Move ID" (Copyable text).
    -   Description of current move scope.
-   **Section: Move Date:**
    -   Date Picker input.
    -   Button: "Update Date".
-   **Section: Appearance:**
    -   Toggle Switch: "Dark Mode".
-   **Section: Data Management:**
    -   Button: "Export to Spreadsheet" (CSV).
    -   Button: "Export All Data" (JSON).
-   **Section: Danger Zone (Red Border):**
    -   Button: "Reset Move Data" (Yellow/Orange).
    -   Button: "Nuclear Option: Clear Everything" (Red).
