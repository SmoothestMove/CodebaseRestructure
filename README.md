
# Smooth Moves

A web application designed to help users efficiently manage and track their belongings during a move using QR codes, owner assignments, and status updates.

## Table of Contents
1.  [Overview](#overview)
2.  [Tech Stack](#tech-stack)
3.  [Installation & Setup](#installation--setup)
4.  [Running the App](#running-the-app)
5.  [Special Instructions & Custom Features](#special-instructions--custom-features)
6.  [Naming Conventions](#naming-conventions)
7.  [Folder Structure](#folder-structure)
8.  [Core Features & Use Cases](#core-features--use-cases)
9.  [UI/UX Design Reference](#uiux-design-reference)
10. [Known Issues / Limitations](#known-issues--limitations)
11. [Future Development Ideas](#future-development-ideas)
12. [Credits & Licensing](#credits--licensing)

## Overview
**Purpose:** Smooth Moves aims to simplify the relocation process by allowing users to catalog boxes, assign them to owners or spaces, generate unique QR codes for each box, and track their status and location throughout the move.
**Audience:** Individuals, families, or anyone planning and executing a residential or office move.
**Development Status:** In Progress. The application now uses a Firebase Firestore backend for real-time data persistence and synchronization.

## Tech Stack
**Languages Used:**
*   HTML5
*   CSS3 (via Tailwind CSS)
*   TypeScript

**Frameworks & Libraries:**
*   React 19
*   React Router 7
*   Tailwind CSS
*   React Icons
*   QRious (for QR code generation, via CDN)
*   HTML5-Qrcode (for QR code scanning, via CDN)
*   jsPDF (for PDF label generation, via CDN)

**Other Tools:**
*   esm.sh (CDN for React and other libraries)
*   Postimages (for hosting the logo image)
*   Firebase (Firestore) (for real-time database and authentication)
*   Browser `localStorage` (for user settings and session data)

## Installation & Setup
**Requirements:**
*   A modern web browser (e.g., Chrome, Firefox, Safari, Edge) with JavaScript enabled.
*   Internet connection (for initial loading of CDN-hosted libraries).

**Steps:**
1.  Ensure all project files (`index.html`, `index.tsx`, `App.tsx`, `types.ts`, `constants.tsx`, `metadata.json`, and folders: `components`, `pages`, `services`, `hooks`, `utils`) are in the same directory structure.
2.  Open the `index.html` file directly in your web browser.
    *   Alternatively, serve the project root directory using a simple local HTTP server (e.g., `python -m http.server` or VS Code Live Server).

## Running the App
**Local Development:**
*   Open `index.html` in a web browser.
*   The application uses `localStorage` to save data, so your information will persist in the browser you are using.

**Production Build:**
*   Not applicable in the current setup. The app runs directly from source files.

**Test Mode:**
*   Authentication can be bypassed for development by clicking the Smooth Moves logo on the Auth page.

## Special Instructions & Custom Features
*   **QR Code Functionality:**
    *   Generates unique QR codes for each box.
    *   Scans QR codes using the device camera to update box status or view details.
*   **PDF Label Printing:** Generates printable PDF sheets of QR labels for boxes, color-coded by owner.
*   **Dark/Light Mode:** User-selectable theme preference, saved in `localStorage`.
*   **Simulated Authentication:** Includes sign-in and registration pages with form validation. A development bypass allows skipping authentication by clicking the logo on the Auth page.
*   **Real-Time Data Sync:** Core application data (boxes, owners, move details) is stored in Firestore and synchronized in real-time across all users participating in the same move.
*   **Local Storage Persistence:** User-specific settings (like theme) and session information are still stored in the browser's `localStorage`.
*   **Camera Permission:** The app requests camera permission for QR scanning and optionally for taking photos of boxes (feature available on ScanPage when detailing a PREP box).
*   **Responsive Design:** UI adapts to different screen sizes.
*   **Truck Loading Visualization:** Interactive diagram to assign boxes to zones in a moving truck.

## Naming Conventions
*   **Variables & Functions (TypeScript):** `camelCase`
*   **React Components & Interfaces/Types (TypeScript):** `PascalCase`
*   **CSS Classes:** Primarily uses Tailwind CSS utility classes. Custom global CSS classes in `index.html` (e.g., `glassmorphism`) use `kebab-case`.
*   **File Naming:**
    *   React components/pages (`.tsx`): `PascalCase` (e.g., `DashboardPage.tsx`, `BoxCard.tsx`)
    *   Service files (`.ts`): `camelCase` (e.g., `boxService.ts`)
    *   Hook files (`.ts`): `camelCase` (e.g., `useBoxes.ts`)
    *   Utility files (`.ts`): `camelCase` (e.g., `statusUtils.ts`)

## Folder Structure
```
/
│
├── index.html             # Main HTML entry point, CDN imports, Tailwind config
├── index.tsx              # Main React render entry point
├── App.tsx                # Root application component with routing
├── types.ts               # TypeScript type definitions
├── constants.tsx          # Application constants, SVG icons
├── metadata.json          # Application metadata, permissions
├── README.md              # This file
│
├── /components/           # Reusable UI components
│   ├── AddOwnerModal.tsx
│   ├── AddSpaceModal.tsx
│   ├── Alert.tsx
│   ├── BatchPrintConfirmationModal.tsx
│   ├── BoxCard.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── OwnerCard.tsx
│   ├── PrintLabelsModal.tsx
│   ├── QRCodeDisplay.tsx
│   ├── QRCodeScanner.tsx
│   ├── QuickUnloadOptionsModal.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── TruckDiagram.tsx
│   └── TruckZoneSelectorModal.tsx
│
├── /hooks/                # Custom React hooks
│   ├── useBoxes.ts
│   ├── useOwners.ts
│   ├── useSettings.ts
│   └── useTheme.ts
│
├── /pages/                # Page-level components
│   ├── AuthPage.tsx
│   ├── BoxDetailsPage.tsx
│   ├── BoxesListPage.tsx
│   ├── DashboardPage.tsx
│   ├── ManageOwnersPage.tsx
│   ├── ManageSpacesPage.tsx
│   ├── PackBoxPage.tsx
│   ├── ScanPage.tsx
│   ├── SettingsPage.tsx
│   └── TruckLoadPage.tsx
│
├── /services/             # Data interaction logic (currently localStorage)
│   ├── boxService.ts
│   ├── ownerService.ts
│   └── settingsService.ts
│
└── /utils/                # Helper functions and utilities
    ├── pdfGenerator.ts
    └── statusUtils.ts
```

## Core Features & Use Cases

*   **Authentication (Simulated):**
    *   **Use Case:** Users can "register" or "sign in" to access the app. Includes options to "Start a New Move" or "Join an Existing Move" (latter logs Move ID).
    *   **Steps:** Navigate to the Auth page, choose sign-in or register, fill form, submit. DEV BYPASS: Click logo to go directly to dashboard.
*   **Owner Management:**
    *   **Use Case:** Users (people involved in the move) can be added to the system so boxes can be assigned to them. Helps in organizing and identifying ownership.
    *   **Steps:** Go to "Owners" page, click "Add New Personal Owner", fill in details, save. A color tag is assigned for visual identification.
*   **Space Management:**
    *   **Use Case:** Define predefined communal spaces (Kitchen, Living Room) and add custom spaces (Master Closet) to assign boxes that don't belong to a specific person.
    *   **Steps:** Go to "Spaces" page. Predefined spaces are listed. Click "Add New Custom Space" to create more.
*   **Box Packing & Tracking:**
    *   **Use Case:** Catalog new boxes with details like name, contents, initial location, destination room, owner, and an optional image. A unique QR code is generated for each box. (`PackBoxPage.tsx` handles manual packing, though not currently routed).
    *   **Status:** Boxes go through stages: `Prepared` -> `Packed` -> `Loaded` -> `Unloaded` -> `Delivered` -> `Unpacked`.
    *   **Steps:** Can be initiated via "Print Box Labels" from Owners/Spaces page (creates `PREPARED` boxes) or by scanning a `PREPARED` label on the ScanPage which then prompts for details to make it `PACKED`.
*   **QR Code Scanning:**
    *   **Use Case:** Quickly update a box's status or location by scanning its QR code. If a `PREPARED` label is scanned, prompts for box details. If `PACKED`, can initiate loading. If `LOADED`, can initiate unloading.
    *   **Steps:** Go to "Scan" page, point camera at QR code. Follow on-screen prompts based on box status.
*   **Label Printing (PDF):**
    *   **Use Case:** Generate a PDF of QR code labels for a batch of boxes, typically for a specific owner or space.
    *   **Steps:** On "Owners" or "Spaces" page, click the print icon on an owner/space card. Confirm number of labels. PDF is generated for download.
*   **Truck Loading Management:**
    *   **Use Case:** Visualize where boxes are loaded on a moving truck using an interactive diagram. Assign boxes to specific truck zones and vertical positions.
    *   **Steps:** Go to "Truck Load" page. View diagram. Click zones to filter loaded boxes. When loading a box (via ScanPage or Box Details), select truck zone and position.
*   **Dark/Light Theme:**
    *   **Use Case:** Allow users to switch between dark and light visual themes for comfort.
    *   **Steps:** Go to "Settings" page, use the toggle under "Appearance".
*   **Application Settings:**
    *   **Use Case:** Configure application preferences, such as default number of labels to print in a batch. Export/Import data, clear local data.
    *   **Steps:** Go to "Settings" page.
*   **Data Export/Import:**
    *   **Use Case:** Backup and restore application data (boxes, owners, settings).
    *   **Steps:** Go to "Settings" page, use "Export All Data" or (future) "Import Data".

## UI/UX Design Reference
**Color Palette (from Tailwind Config):**
*   **Primary Branding:**
    *   `brand-primary`: `#1e3a5f` (Dark Blue) - Headers, Footers, backgrounds
    *   `brand-secondary`: `#708090` (Slate Gray) - Text, secondary elements
    *   `brand-tertiary`: `#ff7e00` (Bright Orange) - CTAs, highlights, active states
    *   `brand-accent`: `#e1a95f` (Muted Peach/Orange) - Warnings, accents
*   **Backgrounds:**
    *   Light Mode: `bg-slate-100` (body), `bg-white` (cards/modals)
    *   Dark Mode: `dark:bg-slate-900` (body), `dark:bg-slate-800` (cards/modals), `dark:bg-slate-700`
*   **Text:**
    *   Light Mode: `text-brand-primary`, `text-brand-secondary`, `text-slate-900`
    *   Dark Mode: `dark:text-slate-100`, `dark:text-slate-300`, `dark:text-slate-400`
*   **Status Specific (Dark Mode Values from Tailwind config):**
    *   Error: `dark-red-error: #f87171`
    *   Success: `dark-green-success: #4ade80`
    *   Delivered: `dark-purple-delivered: #c084fc`

**Fonts:**
*   Primary Font: `Inter` (sans-serif)
*   Fallback: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `Roboto`, `Oxygen`, `Ubuntu`, `Cantarell`, `'Open Sans'`, `'Helvetica Neue'`, `sans-serif`.

**Button States:**
*   **Default:** Styled with background color, shadow.
*   **Hover:** Darker shade of background, increased shadow, potential scale transform.
*   **Active/Clicked:** `active:scale-95` transform.
*   **Focus:** Ring outline matching the button's theme color.
*   **Disabled:** Reduced opacity, cursor-not-allowed, no shadow.
*   **Loading/Success:** Shows spinner or checkmark icon, text changes (e.g., "Processing...", "Success!").

**Animations / Transitions (from Tailwind Config & Observed):**
*   `pulse-bg-once`: Gentle background pulse, e.g., for quick scan mode active banner.
*   `fade-in`, `fade-out`: Used for modals, alerts, and content visibility changes.
*   `slide-up`: Used for modal appearance.
*   `scan-line-vertical`: Animated line in the QR scanner overlay.
*   Standard Tailwind transitions for colors, transforms (`duration-150`, `duration-200`, `duration-300`).

## Known Issues / Limitations
*   **Simulated Authentication:** User login and registration are currently simulated and do not offer real security, though the infrastructure is in place for a full Firebase Auth implementation.
*   **Simulated Authentication:** User login and registration are simulated and do not offer real security.
*   **CDN Dependency:** Relies on CDNs (esm.sh, etc.) for core libraries, requiring an internet connection for the application to load and function initially.
*   **PDF Generation:** `jspdf` is used; complex layouts or very large numbers of labels might have performance considerations.
*   **Camera Access:** Relies on browser implementations for camera access (`getUserMedia`, `html5-qrcode`), which can vary slightly or require explicit user permissions.
*   **Error Handling:** While some error handling is present, it could be made more robust, especially for simulated API calls.

## Future Development Ideas
*   **Backend Integration:** Implement a proper backend (e.g., Node.js/Express, Firebase, Supabase) with a database (e.g., PostgreSQL, MongoDB) for persistent and shared data storage.
*   **Real Authentication:** Integrate a secure authentication system (e.g., JWT, OAuth with providers like Google).
*   **Gemini API Integration:** Leverage Google's Gemini API for potential features like:
    *   Smart suggestions for box contents based on name/room.
    *   Voice commands for adding/updating boxes.
    *   Summaries of move progress or inventory.
*   **Real-Time Collaboration:** Multiple users can join a 'move' using a unique Move ID and see updates to inventory (boxes, owners) in real-time.
*   **Advanced Inventory & Reporting:** Features like generating inventory lists per room, value estimates, or post-move checklists.
*   **Offline Capabilities:** Enhance offline support using Service Workers for caching assets and data, and syncing when back online (requires backend).
*   **Enhanced PDF Customization:** More options for label design and layout.
*   **Bulk Actions:** More options for bulk editing or updating boxes.
*   **Image Uploads:** Direct image uploads from device instead of/in addition to URL input for box photos.
*   **In-App Messaging:** Messaging between users (Owners) within the app, keeping the entire group up to date on information in a designated space separated from daily conversations, prevents important information from getting lost in the mix.
*   **Google Maps Integration:** Integrating Google Maps for route planning during the move.
*   **Google Calendar Integration:** Providing a dedicated calendar where all members of a move can share information; same logic as the Messaging.
*   **Budget planner and Expense Tracker:** Means of tracking spending pertaining to the move
    *   Receipt Scanning and uploading to easily track spending
    *   Document Vault to house important documents pertaining to the move
    *   Automatic Updating of budget data taken from the receipts, invoices, and documents regarding finanial criteria
*   **Personalized Move Checklist:** a timeline based todo list intended to break down tasks into monthly, weekly and daily tasks
    *   Deligation System (potentially AI powered) to evenly and fairly spread the workload amongst the members of a move
*   **Reminders:** Customized and personalized reminders implemented via notifications, email, and in-app dashboard pins

## Credits & Licensing
**Developed by:** AI Assistant (as part of a development exercise)
**Special Thanks To:** N/A
**License:** To be determined (Currently proprietary/for demonstration purposes).
