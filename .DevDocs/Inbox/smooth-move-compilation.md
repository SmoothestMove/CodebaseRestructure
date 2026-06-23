# Smooth Move Application: Concepts & Features

**Document Version:** 2.1  
**Date:** February 19, 2026  
**Status:** Post-Iteration 2 (v1.20) Development

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Core Concepts & System Architecture](#2-core-concepts--system-architecture)
3. [Key Features & Functionality](#3-key-features--functionality)
4. [Application Workflow & User Journey](#4-application-workflow--user-journey)
5. [User Interface (UI) & User Experience (UX) Design](#5-user-interface-ui--user-experience-ux-design)
6. [Technical Specifications & Implementation Guidelines](#6-technical-specifications--implementation-guidelines)
7. [Development Methodology & Deployment](#7-development-methodology--deployment)
8. [Conclusion & Next Steps](#8-conclusion--next-steps)
9. [Feature: Financial Navigator](#9-feature-financial-navigator)
10. [Feature: In-App Chat](#10-feature-in-app-chat)
11. [Feature: Move Planner (Enhanced)](#11-feature-move-planner)
12. [Feature: Notification System (Planned)](#12-feature-notification-system)
13. [Relocation Planning Framework (Enhanced)](#13-relocation-planning-framework)

---

## 1. Introduction

### 1.1. Purpose of the Document

This document outlines the concepts, features, and technical considerations for the **Smooth Move** web application. It serves as a comprehensive guide for development, ensuring a shared understanding of the application's goals, functionalities, and architecture. This version reflects the state after the first iteration of development (v1.01) and incorporates ideas for future enhancements.

### 1.2. Application Overview

| Field                | Details                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Application Name** | Smooth Move                                                                                                |
| **Goal**             | Empower individuals and groups managing a home move with a user-friendly web application                   |
| **Design Approach**  | Mobile-first                                                                                               |
| **Core Value**       | Professional-grade logistics principles for efficient organization, tracking, and multi-user collaboration |

---

## 2. Core Concepts & System Architecture

### 2.1. Fundamental Principles

Smooth Move revolutionizes the moving process by:

- **Digitizing Inventory:** Moving from manual lists to a digital tracking system.
- **Unique Identifiers:** Assigning a unique QR code and human-readable ID to every box.
- **Visual Cues:** Utilizing color-coding for quick identification of ownership and room association.
- **Actionable Workflow:** Guiding users through distinct stages of the moving process for each item.
- **Shared Access:** Enabling real-time collaboration among multiple users involved in the same move.

### 2.2. Key Entities

#### 2.2.1. Owners

- **Definition:** Users can define distinct "Owners" for belongings, typically individual family members.
- **Purpose:** Allows personalized management of items, clear differentiation, and conflict-free packing/scanning within a shared move.
- **Attributes:** Each Owner is assigned:
  - A unique color for visual identification on labels and in-app.
  - Initials for their Unique Identifier (UID) prefix (e.g., "JK" for John Kepler).
- **UID Uniqueness:** The system ensures that Owner initials combined with sequential box numbers result in unique UIDs within a single move (e.g., JK01, JK02).

#### 2.2.2. Communal Rooms

- **Definition:** Predefined identifiers for items belonging to shared household spaces.
- **Purpose:** Ensures consistency for common areas and simplifies sorting for non-personal items.
- **Attributes:** Each communal room has:
  - A predefined UID prefix (e.g., "KT" for Kitchen).
  - A distinct, system-assigned color.

**Predefined Rooms & Identifiers:**

| Room        | UID | Color      | Hex       |
| ----------- | --- | ---------- | --------- |
| Kitchen     | KT  | Orange     | `#FFA500` |
| Living Room | LR  | Dark Green | `#008000` |
| Bathroom    | BR  | Cyan       | `#00FFFF` |
| Dining Room | DR  | Maroon     | `#800000` |
| Basement    | BM  | Pink       | `#FFC0CB` |
| Garage      | GA  | Brown      | `#7B3F1B` |
| Office      | OF  | Navy       | `#000080` |

#### 2.2.3. Owner vs. Space Separation Logic

The system implements a rigorous separation between **Personal Owners** (individuals) and **Communal Spaces** (rooms).

- **Personal Owners:** Tracked by individual profiles, colors, and initials.
- **Communal Spaces:** Managed as virtual entities with their own color-coding and inventory streams.
- **Logistical Benefit:** This separation allows the `useOwnersSpacesSeparation` hook to provide granular statistics (e.g., "75% of Kitchen items packed" vs "10% of Dad's boxes loaded"), enabling targeted assistance during the move.

#### 2.2.4. Boxes & QR Code Labels

- **Function:** The backbone of the tracking system. Each physical box receives a unique QR code label.
- **Content:** Labels are generated specific to an Owner or selected for a Communal Room and feature:
  - A unique QR code encoding the BoxID (e.g., `KT01`, `JK01`).
  - A colored border/QR code module color matching the assigned Owner's or Communal Room's color.
  - A human-readable Unique Identifier (UID).
- **Database Integration:** Generated UIDs are immediately logged with an initial status of `PREP`.

### 2.3. Move Workflow & Status System

The application guides users through six distinct stages for each box:

| #   | Status        | Description                                                                                    |
| --- | ------------- | ---------------------------------------------------------------------------------------------- |
| 1   | **PREP**      | UID and association exist in the system. Contents and locations are undefined.                 |
| 2   | **Packed**    | Box contents, initial staging location, and destination room are defined.                      |
| 3   | **Loaded**    | Box has been loaded onto the moving truck; truck location is recorded.                         |
| 4   | **Unloaded**  | Box is in a temporary staging area at the new location.                                        |
| 5   | **Delivered** | Box has reached its final, designated room in the new home.                                    |
| 6   | **Unpacked**  | Contents removed; box data is archived (hidden from active inventory, retained for reference). |

### 2.4. Shared Access & Collaboration

- **Move Code:** Each Move created by an email-linked account user is assigned a unique, shareable Move Code.
- **Joining a Move:** Email-linked account users can use this code to join the move.
- **Real-time Sync:** Multiple participants can view, contribute to, and track the same inventory data in real-time.
- **Permissions:** All joined members have equal permissions to manipulate data within a shared move.

---

## 3. Key Features & Functionality

### 3.1. User Account Management & Move Setup

#### 3.1.1. Registration & Login

| Account Type             | Capabilities                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| **Email/Google Account** | Create shareable moves, join moves, cloud data synchronization                            |
| **Local Account**        | Single, non-shareable move stored on device only; cannot generate Move Code or join moves |

#### 3.1.2. Move Creation & Joining

**Choose Move Screen options:**

- **Start Moving:** Email/Google initiates a cloud-synced move with a shareable Move Code. Local account initiates a local-only move.
- **Keep Moving:** Takes the user to the dashboard of their most recently active move.
- **Join Move:** (Requires Email/Google Account) Prompts for a Move Code to sync with a shared move.

### 3.2. Owner & Communal Room Management

- **Owner Creation:** Accessible by any user via "Owner Management." Modal requires Name, Initials (for UID), and Color selection.
- **Communal Room Access:** Predefined list available for label printing and association.

### 3.3. QR Code Generation & Label Management

#### 3.3.1. Owner-Specific & Communal Room Labels

- **Owner Labels:** Upon creating a new Owner, the app prompts for printing an initial batch (e.g., 12) of unique QR code labels. Additional batches can be printed on demand.
- **Communal Room Labels:** Users select a Communal Room and print the desired number of labels from a dedicated section.
- **Database Entry:** Generated UIDs are added to the move database with an initial status of `PREP`.

#### 3.3.2. Label Design Specifications

- **Paper Size:** Standard US Letter (8.50" × 11.00")
- **Individual Label Area:** 2.50" wide × 3.00" tall

**QR Code:**

- Dimensions: 2.10" wide × 2.10" tall
- Position: 0.40" from label top, 0.20" from label left
- Encoding: BoxID only (e.g., `KT01`, `JK01`)
- Color: QR code modules in the Owner's/Communal Room's specific color

**Text (Box ID):**

- Content: Human-readable BoxID
- Position: Directly below the QR code
- Dimensions: 2.10" wide × 0.29" tall
- Spacing: 0.20" below QR code, 0.05" from label bottom

#### 3.3.3. Print-Ready Format

- **Layout:** 3×3 grid (9 labels per page)
- **Page Margins:** Top: 0.46", Left: 0.50", Right: 0.50", Bottom: 1.00"
- **Label Spacing:** No horizontal gap between labels; 0.35" vertical gap between rows
- **Output:** PDF file generation recommended for precise print alignment

### 3.4. Inventory Management & Tracking

#### 3.4.1. Initial Box Setup (First Scan)

- **Trigger:** When a pre-printed label (status: `PREP`) is affixed to a box and scanned for the first time in Standard Scanning Mode.
- **Action:** A "New Box Details" modal appears, prompting for:
  - Box Contents (description)
  - Initial Staging Location
  - Destination Room
- **Result:** Upon saving, box status automatically updates to `Packed`.

#### 3.4.2. Box Details & Status Progression

- **Access:** Via QR code scan in Standard Mode (non-`PREP` status) or from Inventory list.
- **Content:** Displays Owner/Communal Room, UID, Contents, Destination Room, Current Status, Current Location.
- **Actions:** Prominent buttons to move to the next logical status stage.

#### 3.4.3. Filtering & Sorting

Available on the Inventory screen. Filter and sort by Owner, Communal Room, Status, Destination Room, and more.

### 3.5. Scanning Modes

#### 3.5.1. Standard Scanning Mode

**Purpose:** Initial box setup, detailed inventory checks, viewing full box information, manually progressing box status.

- **Initial Scan (`PREP` label):** Prompts for "New Box Details," auto-updates status to `Packed`.
- **Subsequent Scans (any other status):** Opens the "Box Details" screen for viewing and manual status updates.

#### 3.5.2. Quick Scanning Mode

**Purpose:** Rapid updates during high-activity phases (loading/unloading), bypassing the "Box Details" screen for speed.

**Loading (for `Packed` boxes):**

1. Scan QR code.
2. App presents "Truck Layout" screen.
3. User taps truck area and vertical position (Bottom, Middle, Top).
4. Status auto-updates to `Loaded`; Truck Location recorded. Scanner ready for next item.

**Unloading (for `Loaded` boxes):**

1. Scan QR code.
2. App prompts with two options:
   - **"Destination":** Status auto-updates to `Delivered`; location set to pre-defined Destination Room.
   - **"Staging":** Prompts for temporary staging location input. Status auto-updates to `Unloaded`.
3. Brief feedback given; scanner ready for next item.

### 3.6. Strategic Truck Loading & Layout

#### 3.6.1. Visual Truck Representation

A clear visual diagram of a moving truck, divided into **11 distinct loading zones** (e.g., Front Left, Middle Center, Back Right, Overhead).

#### 3.6.2. Guided Loading

- **Standard Mode:** After clicking "Mark as Loaded" on Box Details, user is guided to Truck Layout to select zone and vertical position.
- **Quick Scan Mode:** Integrated directly into the loading workflow.

#### 3.6.3. Locating Boxes in Truck

- **Box Details Screen:** A "View Box Location" option displays a scaled-down truck diagram, highlighting the box's loaded position with a semi-transparent overlay of its Owner/Communal Room color.
- **Read-Only Truck Layout:** Users can view filled locations. Clicking a zone lists boxes within it.

### 3.7. Multi-User Collaboration

- **Mechanism:** Shared Move Code and Firebase real-time synchronization.
- **Data Consistency:** Changes made by one user are reflected for all connected users in near real-time (requires internet).
- **Permissions:** All joined members have equal permissions within the shared move.

### 3.8. Data Export

- **Format:** Spreadsheet (CSV, compatible with Google Sheets/Excel)
- **Exported Columns:** UID, Identifier Name (Owner/Communal Room, colored), Destination Room, Contents, Status, Current Location

---

## 4. Application Workflow & User Journey

### 4.1. Initial Setup & Onboarding

1. **Registration/Login:** User chooses Email/Google or Local account.
2. **Choose Move Screen:** Start a new move, continue an existing move, or join a move using a Move Code (Email/Google only).
3. **Owner Creation (if applicable):** User defines Owners (Name, Initials, Color).
4. **QR Label Printing:**
   - Owners: Prompted after Owner creation for an initial batch.
   - Communal Rooms: User navigates to a dedicated section to print labels.
   - All generated UIDs added to the database with `PREP` status.

### 4.2. Packing & Inventory Logging

1. User packs a physical box.
2. User affixes a pre-printed `PREP` QR label to the box.
3. **First Scan (Standard Mode):**
   - User scans the label.
   - "New Box Details" modal appears.
   - User inputs Contents, Initial Staging Location, Destination Room.
   - On save, status automatically becomes `Packed`.

### 4.3. Box Status Progression Details

**A. Standard Scanning Mode:**

| Current Status | Action                        | Button                          | Result                              |
| -------------- | ----------------------------- | ------------------------------- | ----------------------------------- |
| `PREP`         | Define box contents & details | —                               | → `Packed`                          |
| `Packed`       | Initiate loading              | "Mark as Loaded"                | → `Loaded` (guided to Truck Layout) |
| `Loaded`       | Mark delivered                | "Mark as Delivered"             | → `Delivered`                       |
| `Loaded`       | Mark to staging               | "Mark as Unloaded (to Staging)" | → `Unloaded`                        |
| `Unloaded`     | Mark delivered                | "Mark as Delivered"             | → `Delivered`                       |
| `Delivered`    | Mark unpacked                 | "Mark as Unpacked"              | → `Unpacked` (archived)             |

**B. Quick Scanning Mode:**

| Action                     | Box Status | Flow                                         | Result        |
| -------------------------- | ---------- | -------------------------------------------- | ------------- |
| Loading                    | `Packed`   | Scan → Truck Layout → Select area & position | → `Loaded`    |
| Unloading (to destination) | `Loaded`   | Scan → "Destination"                         | → `Delivered` |
| Unloading (to staging)     | `Loaded`   | Scan → "Staging" → Input location            | → `Unloaded`  |

### 4.4. Dynamic Data Management

All updates are saved to the application's database (local or cloud). For shared moves with an internet connection, changes sync in near real-time across all participating devices.

---

## 5. User Interface (UI) & User Experience (UX) Design

### 5.1. Proposed Screen Overview

| Screen                       | Description                                                             |
| ---------------------------- | ----------------------------------------------------------------------- |
| Register/Login               | Standard authentication                                                 |
| Choose Move Screen           | Options: Start Moving, Keep Moving, Join Move                           |
| Dashboard                    | Central hub with move progress overview; Move Code access               |
| Inventory                    | Comprehensive list of active (non-archived) boxes; search, sort, filter |
| Box Details (Modal/Screen)   | All data for a single box; "Mark as [Next Stage]" buttons               |
| Scanner Interface            | Primary QR scanning screen; Standard vs. Quick Mode toggle              |
| Truck Layout                 | Assign/view box locations in the truck                                  |
| Owner Management             | Create, view, manage Owners                                             |
| Communal Room Label Printing | Select and print Communal Room labels                                   |
| Settings / Move Settings     | App-level preferences; Move Code for shareable moves                    |

### 5.2. UI Design Enhancements (Future Considerations)

#### 5.2.1. Glassmorphism

- **Concept:** "Frosted glass" transparent effect for UI elements.
- **Potential Uses:** Modal dialogs, overlay panels/sidebars, fixed headers/footers.
- **Considerations:** Use subtly. Ensure high contrast for text and interactive elements.

#### 5.2.2. Neumorphism

- **Concept:** Soft, extruded UI elements appearing connected to the background.
- **Potential Uses (with caution):** Static information cards, background segmentation.
- **Considerations:** Prioritize clarity. Supplement interactive elements with strong traditional cues. Rigorously test for accessibility.

#### 5.2.3. Bento Grids

- **Concept:** Modular grid layout organizing content into distinct cells.
- **Potential Uses:** Dashboard, Owner Management/Communal Room selection, Settings screen.
- **Considerations:** Use varied cell sizes for visual hierarchy. Ensure responsiveness, especially for mobile.

#### 5.2.4. Animations & Microinteractions

- **Feedback on Actions:** Scanning success/failure animations; status change color transitions; button click effects.
- **Guiding User Attention:** New item entry animations; truck zone selection highlighting.
- **Smooth Transitions:** Modal fade/slide-in; screen navigation transitions.
- **System Status:** Data syncing indicators; inventory shimmer loading effects.
- **Considerations:** Animations must be purposeful, subtle, and quick. Use CSS-based animations for performance. Implement `prefers-reduced-motion` for accessibility.

---

## 6. Technical Specifications & Implementation Guidelines

### 6.1. Architecture Overview

- **Type:** Web Application
- **Design Philosophy:** Mobile-first responsive design
- **Primary Stack:** React (frontend), Node.js (backend), Firebase (database & real-time)

### 6.2. Frontend (React)

| Concern                | Options                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **Framework**          | Vite, Create React App, or Next.js (if SSR/SSG needed)                                  |
| **State Management**   | React Context API, Redux Toolkit, or Zustand                                            |
| **Navigation**         | React Router DOM                                                                        |
| **UI Components**      | Material-UI (MUI), Ant Design, Chakra UI, or custom                                     |
| **Styling**            | Tailwind CSS, CSS Modules, or Styled Components                                         |
| **QR Code Scanning**   | `navigator.mediaDevices.getUserMedia()` + `html5-qrcode`, `jsqr`, or `zxing-js/browser` |
| **QR Code Generation** | `qrcode.react` or `react-qr-code`; print via `window.print()`                           |
| **Local Storage**      | `localStorage` or `sessionStorage`                                                      |
| **API Communication**  | Fetch API or Axios                                                                      |

### 6.3. Backend (Node.js)

- **Framework:** Express.js (flexible) or NestJS (opinionated, TypeScript-first)
- **API Design:** RESTful APIs (e.g., `/moves`, `/boxes`); standard HTTP methods; versioning
- **Real-time Collaboration:** Firebase Realtime Database/Firestore (recommended) or WebSockets (e.g., socket.io)
- **Move Code Generation:** Unique, hard-to-guess alphanumeric codes
- **Authentication:** JSON Web Tokens (JWT); middleware for route protection

### 6.4. Database

- **Recommended:** Firebase Firestore or Realtime Database (real-time sync, offline support, Firebase Auth integration)
- **Alternatives:** PostgreSQL, MongoDB (requires more backend setup for real-time)

**Data Modeling:**

| Entity             | Key Fields                                                                                                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Moves`            | `moveId` (PK), `moveCode`, `creatorUserId`, `isLocalOnly`, `createdAt`, `status`                                                                                                                                                                                                   |
| `Users`            | `userId` (PK), `email`, `authProvider`, `displayName`                                                                                                                                                                                                                              |
| `MoveParticipants` | `moveId` (FK), `userId` (FK)                                                                                                                                                                                                                                                       |
| `Owners`           | `ownerId` (PK), `moveId` (FK), `name`, `initials`, `colorHex`                                                                                                                                                                                                                      |
| `Boxes`            | `boxId` (PK), `moveId` (FK), `ownerId` (FK, nullable), `communalRoomId` (nullable), `uidString`, `contents`, `initialStagingLocation`, `destinationRoom`, `currentStatus`, `currentLocationString`, `truckArea`, `truckPosition`, `isArchived` (boolean), `createdAt`, `updatedAt` |

### 6.5. Error Handling & System Resilience

- **QR Code/Scan Issues:** Handle unreadable codes and invalid scans.
- **UID Conflicts:** Clear feedback during Owner/Communal Room setup or label generation.
- **Connectivity Issues:** Basic error messages for loss of connectivity during critical operations.
- **Offline Access:** Aim for view access offline (local moves, cached shared move data). Offline updates with subsequent sync is an advanced feature.
- **Planned Modals/Prompts:** Batch Print Confirmation & Preview, New Box Details, Select Truck Location, Temporary Staging Location Input, Enter Move Code Prompt, Error/Information Messages.

---

## 7. Development Methodology & Deployment

### 7.1. Phased Development Approach

**Phase 1: Core Setup & Single-User MVP**

- User Authentication (Local, Basic Email/Password via Firebase)
- Basic Move Creation & Management (Local/Single Cloud User)
- Owner & Communal Room Definition
- QR Code Generation & Basic Label Design (Frontend)
- `PREP` → `Packed` Workflow (Initial Scan, "New Box Details" - Standard Mode)
- Standard Scanning Mode: Box Details & Manual Status Progression
- Truck Layout UI (Basic Interaction for Loading in Standard Mode)
- Inventory Screen (Basic List View)

**Phase 2: Cloud Sync & Core Sharing MVP**

- Move Code Generation & "Start Moving" (Shareable via Firebase/Node.js backend)
- "Join Move" Functionality
- Real-time Data Synchronization (Firebase Firestore listeners)
- Permissions for Shared Moves (Firestore security rules)

**Phase 3: Enhancing Scanning & Workflow Efficiency**

- Quick Scanning Mode (Loading & Unloading)
- "Archived" Box Logic (hiding `Unpacked` boxes)

**Phase 4: Polish & Additional Features**

- Advanced Filtering & Sorting in Inventory
- Data Export to Sheets
- Dashboard Enhancements (Progress Metrics)
- Settings & User Profile Management
- Offline Data Viewing (Firestore offline persistence)
- Google Authentication

**Phase 5: UI Design Feature Implementation**

- Implement selected UI enhancements: Glassmorphism, Bento Grids, and Animations (per Section 5.2)

### 7.2. Development Best Practices

- **Version Control:** Git (GitHub, GitLab)
- **Environment Variables:** Manage sensitive info via `.env` files
- **Testing:** Unit tests (Jest, React Testing Library), Integration tests, End-to-end tests (Cypress, Playwright)
- **Linting & Formatting:** ESLint, Prettier

### 7.3. Deployment Strategy

| Layer                        | Options                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------- |
| **Frontend (React Web App)** | Netlify, Vercel, GitHub Pages, AWS S3/CloudFront                              |
| **Backend (Node.js)**        | Heroku, Vercel, Google Cloud Run, AWS Elastic Beanstalk; or Docker/Kubernetes |
| **Database**                 | Firebase, AWS RDS, MongoDB Atlas                                              |

---

## 8. Conclusion & Next Steps

This document provides a comprehensive overview of the Smooth Move application's concepts and features, reflecting its status post-v1.20 development.

Smooth Move v1.20 is functionally robust, with key features like the **Move Planner (Enhanced)**, **Financial Navigator (with receipt scanning)**, and **Quick Scanning Modes** fully operational. Future work focuses on the In-App Chat, persistent Notification Hub, and advanced Data Export capabilities.

For subsequent iterations, refer to:

- **Smooth Moves Backend Supplemental Documents:** Details on specific backend choices and APIs.
- **Smooth Moves Advanced Features Documentation:** Features beyond the current scope.

> This document should serve as a living guide, updated as the application evolves.

---

## 9. Feature: Financial Navigator

**Purpose:** Empower Smooth Move users with comprehensive financial planning, tracking, and analysis capabilities for self-managed moves, replicating the transparency and control a professional moving company might offer.

### Core Concepts & User Goals

- **User Empowerment:** Enable users to take full control of their moving finances.
- **Transparency:** Provide clear visibility into estimated vs. actual spending.
- **Proactive Management:** Allow users to identify potential overspending early and adjust.
- **Simplicity:** Ensure ease of use for expense entry and budget management.
- **Collaboration:** (Future) Allow multiple users on a move to contribute to and view the budget.

### 9.1. Budget Setup & Management

**Create and customize a budget for a specific move:**

- User navigates to "Financial Navigator" → "Create New Budget" → Enters a total estimated budget.
- Allow a "default" set of categories with the option to add, edit, or remove custom categories.
- Each category has an estimated budget field.

**Initial Pre-populated Categories:**

| Category                  | Examples                                                          |
| ------------------------- | ----------------------------------------------------------------- |
| Packing Supplies          | Boxes, tape, bubble wrap, markers                                 |
| Transportation            | Truck rental, gas, mileage, tolls, parking                        |
| Professional Services     | Cleaning, handyman, appliance servicing, temporary labor          |
| New Home Essentials       | Initial groceries, cleaning supplies, utility setup fees/deposits |
| Food & Refreshments       | For moving day helpers/self                                       |
| Miscellaneous/Contingency | —                                                                 |

**Customization:** Enable users to define category names and optionally assign an icon or color.

**Estimated budget per category:** Ensure real-time calculation of total estimated budget as categories are filled.

**Future/Optional — Owner/Communal Room allocation:** During expense entry, users can optionally tag an expense to an Owner or Communal Room (requires linking to existing data models).

### 9.2. Expense Tracking & Receipt Management

**Smart Expense Entry with OCR Scanning (HIGH PRIORITY)**

- User Flow: "Add Expense" → "Scan Receipt" → Camera photo → OCR extracts amount, vendor, date → User reviews/confirms → Selects category → Saves.
- Implement OCR API/SDK (e.g., Google Cloud Vision API, AWS Textract, or specialized receipt OCR service).
- Focus extraction on: amount, date, merchant/vendor name.
- Present extracted data for user verification; allow easy edits.
- Fallback to manual input if OCR fails or is not preferred.
- Fields: `category_id`, `amount` (decimal), `date` (timestamp), `description` (text), `merchant_name` (string), `owner_id` (optional FK), `box_qr_code` (optional FK).

**Attach Photo Receipts:** Store the original receipt image alongside extracted data. Associate `receipt_image_url` with the expense record. Consider image compression.

**Quick Manual Expense Entry (Fallback/Alternative):** Select category, enter amount, date, and brief description. Ensure this flow is readily available and distinct from the OCR flow.

**View/Edit/Delete Expenses:** Browse list of logged expenses → Tap to view details (OCR data + receipt image) → Edit → Option to delete. Implement robust CRUD operations.

### 9.3. Reporting & Visualization

**Budget Overview Dashboard Widget:** Display "Total Estimated," "Total Actual," and "Remaining/Over Budget." Use a progress bar or ring graph (green = under budget, yellow = approaching, red = over).

**Detailed Budget Report:** Category-level breakdown showing estimated budget, actual spending, remaining/over budget amount, and percentage of budget used per category.

**Expense Breakdown Charts:** Interactive charts (pie chart for spending distribution by category, bar graph for actual vs. estimated per category). Ensure labels are clear and readable.

### 9.4. Alerts & Notifications

**Budget Threshold Alerts:**

- Trigger when overall spending reaches a configurable percentage of the total estimated budget (e.g., 80%, 100%, 110%).
- Trigger when individual category spending reaches a configurable percentage (e.g., 90%, 100%) of its estimated budget.
- Allow users to customize alert thresholds and notification preferences.

### 9.5. Data Model

```
budgets
├── id (PK)
├── move_id (FK → moves)
├── total_estimated_amount (decimal)
├── total_actual_amount (decimal, calculated)
├── created_at (timestamp)
└── updated_at (timestamp)

budget_categories
├── id (PK)
├── budget_id (FK → budgets)
├── name (string)
├── estimated_amount (decimal)
├── icon_name (optional, string)
└── color_hex (optional, string)

expenses
├── id (PK)
├── budget_category_id (FK → budget_categories)
├── amount (decimal)
├── date (date/timestamp)
├── description (text)
├── merchant_name (string)
├── receipt_image_url (optional, string)
├── owner_id (optional FK → owners)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### 9.6. Developer Checklist

- [ ] Easy category creation and customization for clear cost breakdown?
- [ ] UI clearly shows estimated vs. actual spending per category and overall?
- [ ] Visual reports (charts) intuitive and easy to interpret?
- [ ] Users can set their own initial estimates and track against them effectively?
- [ ] Expense logging is straightforward and quick, ideally via OCR?
- [ ] Users can create specific categories for all potential variable costs?
- [ ] Photo receipt feature is robust for diverse expense types?
- [ ] Users can easily edit or add notes to expenses?

### 9.7. Technical Considerations

- **Data Aggregation:** Efficiently calculate `total_actual_amount` for budgets and categories.
- **Offline Capability:** Consider how expense logging might work offline and sync when connectivity returns.
- **Security:** Ensure secure storage of receipt images and financial data.
- **Notifications:** Integrate with existing notification system for budget alerts.
- **Scalability:** Design database schema and API endpoints for performance as user base grows.

---

## 10. Feature: In-App Chat (Roadmap)

**Purpose:** Streamline communication, facilitate decision-making, and centralize information exchange among collaborators.

**Status: Planned for Phase 3.**

### 10.1. Channel-Based UI

Organizes conversations into dedicated channels to separate information and prevent critical messages from getting lost.

**Proposed Channels:**

| Channel                       | Purpose                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| General Announcements/Updates | Critical, broad messages from the move organizer (potentially read-only)                 |
| Packing & Inventory           | Discussions on packing items, box contents, and supply needs                             |
| Truck Loading & Logistics     | Real-time coordination on moving day, loading order, and issues                          |
| Budget & Expenses             | Cost allocations, expense confirmations, budget concerns (linked to Financial Navigator) |
| New Home Setup                | Coordinating utility transfers, furniture assembly, etc.                                 |
| Damage & Claims               | Restricted-access channel for documenting damaged/lost items with easy photo sharing     |

### 10.2. Smart Calendar Integration

- **Automated Event Creation:** App detects dates/times mentioned in chat (e.g., "meet at 10 AM on July 15th") and prompts with a one-tap option to add to the in-app calendar.
- **Benefits:** Reduces manual data entry errors, centralizes scheduling, converts discussion points into actionable calendar events, enables proactive reminders.

### 10.3. Collaborative Polling and Surveying

- **Polls:** Quickly create polls within a channel to gather preferences and achieve consensus (e.g., "Which moving date works best?").
- **Surveys:** Collect structured input from collaborators on various aspects of the move (e.g., post-move feedback).
- **Benefits:** Reduces lengthy discussions, centralizes feedback, increases engagement, provides specific data for better planning.

### 10.4. Integration with Core App Features

- **Direct Linking:** Initiate chat discussions directly from specific boxes, inventory items, or checklist tasks, automatically including a link to the relevant item.
- **Activity Feed Integration:** Key chat messages (announcements, critical updates) pushed to a centralized activity feed.
- **Notification System Linkage:** Chat mentions or critical channel messages trigger customizable notifications.

### 10.5. Enhanced Collaboration Features

- **@Mentions:** Directly tag and notify specific collaborators within any channel.
- **File/Photo Sharing:** Share photos (e.g., packing progress, damage) and documents directly within channels.
- **Reactions & Threads:** Emoji reactions to acknowledge messages; nested threads to keep specific discussions organized.

---

## 11. Feature: Move Planner (Enhanced)

**Purpose:** Transform static relocation information into an interactive, dynamic, and personalized planning tool.

**Status: Implemented (v1.20).** Serves as the central hub for managing the entire moving process, replacing static checklists with a dynamic timeline.

### 11.1. Core Concept: Interactive Timeline & Task Manager

A new top-level feature accessible from the main dashboard that replaces static checklists with a dynamic timeline tailored to the user's specific move date.

**Key Functionality:**

- **Timeline Generation:** Upon first use, the app asks for the planned moving date and automatically generates a dynamic, week-by-week timeline of tasks.
- **Interactive Checklists:** Each timeline item is an interactive task the user can check off.
- **Customization:** Users can add custom tasks, edit existing ones, and reassign tasks to different weeks.
- **Smart Reminders:** Proactive notifications for upcoming deadlines (e.g., "Don't forget to book your movers this week!").

### 11.2. Deep Integration with Existing Features

**Financial Navigator Integration:**

- Tasks like "Create a moving budget" or "Get estimates from moving companies" link directly to the Financial Navigator.
- Move Planner uses average cost data to help users create a more realistic initial budget.

**Inventory & Packing Integration:**

- Tasks related to decluttering and packing link to the app's core inventory management system.
- The "Packing Guide" section is transformed into an in-app resource, accessible directly from packing-related tasks.

**Resource Hub:**

- Curated links, tutorials, and templates (USPS change of address form, moving company verification tools, etc.) accessible directly from the Move Planner.

### 11.3. Design and UI/UX

- **Main View:** Vertical timeline showing tasks grouped by week (e.g., "8-12 Weeks Out," "6-8 Weeks Out").
- **Task Details:** Tapping a task expands it to show more details, links to other app features, or relevant resources.
- **Progress Visualization:** A progress bar at the top of the screen shows how much of the move has been completed.

### 11.4. Technical Implementation Plan

1. **Data Modeling:** Create a new `tasks` table linked to the `moves` table with fields for `name`, `description`, `due_date`, `is_completed`, and optional links to other app features.
2. **Timeline Generation Logic:** Develop a backend service to generate the initial set of tasks based on the user's move date.
3. **Frontend Development (React):**
   - Build new React components for the Move Planner: timeline view, task items, and resource hub.
   - Update state management to handle tasks and their completion status.
4. **Notification System:** Leverage the existing notification system to send reminders based on task due dates.

---

## 12. Feature: Notification System (Planned)

**Status: Planned for Phase 2.** (Current implementation supports ephemeral Toast Notifications).

**Overall Goal:** Provide timely, relevant, and actionable alerts and reminders.

**Core Principles:** Contextual, Actionable, Customizable, Concise, Non-intrusive.

### 12.1. Notification Categories & Triggers

**Planning & Setup:**

| Trigger                          | Notification                                                                                                | Action                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Move creation/upcoming dates     | "Your move to [New Address] is scheduled for [Move Date]! Time to start planning!"                          | Move Checklist / Planning Dashboard          |
| Nearing "Start Packing" date     | "Packing time is almost here! Your estimated packing start date is [Date]. Have you ordered your supplies?" | Packing Supplies Checklist or Budget feature |
| Unassigned inventory after setup | "Looks like you have [X] boxes/items unassigned! Head to Inventory Management to get organized."            | Inventory Management                         |

**Inventory & Packing:**

| Trigger                                     | Notification                                                            | Action                       |
| ------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------- |
| QR Code Generation Reminder                 | "Don't forget to print your QR code labels!"                            | QR Code Management           |
| Box Status Change                           | "Box [ID] has been sealed! Great job!"                                  | View Box Details             |
| Incomplete Box Details                      | "Box [ID] is sealed but missing key details!"                           | Edit Box Details             |
| Packing Progress Milestones (25%, 50%, 75%) | "You've packed 50% of your boxes! Keep up the great work, [User Name]!" | View Packing Progress Report |

**Collaboration:**

| Trigger                           | Notification                                                             | Action                           |
| --------------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| New Collaborator Added            | "[User Name] invited you to collaborate on their move to [New Address]!" | Accept/Decline Invitation        |
| Collaborator Action               | "[Collaborator Name] updated the status of Box [ID] to 'Loaded'."        | View Activity Log or Box Details |
| Shared Task Assignment/Completion | "[Collaborator Name] assigned 'Pick up truck rental' to you."            | View Task List                   |
| Chat Message                      | "[Collaborator Name] sent you a message: '...'"                          | Open Chat                        |

**Moving Day & Truck Loading:**

| Trigger                          | Notification                                                                     | Action                       |
| -------------------------------- | -------------------------------------------------------------------------------- | ---------------------------- |
| Truck Loading Guidance           | "Consider Box [ID] ([Room]) as a priority for the truck's [Front/Back] section." | View Guided Loading          |
| Box Scanned into Truck           | "Box [ID] has been loaded into the truck."                                       | View Truck Layout            |
| Critical Box Loaded/Unloaded     | "Important: 'Essentials Box - Kitchen' has been loaded onto the truck."          | View Box Details             |
| Truck Loading/Unloading Complete | "All boxes accounted for! Your truck is now fully loaded/unloaded!"              | View Final Inventory Summary |

**Budgeting (Financial Navigator Integration):**

| Trigger                              | Notification                                                                        | Action                               |
| ------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------ |
| Approaching Overall Budget Threshold | "Heads up! You've spent 80% of your overall moving budget."                         | Financial Navigator Dashboard        |
| Category Budget Exceeded             | "Alert! You've exceeded your budget for 'Packing Supplies' by $[Amount]."           | View Category in Financial Navigator |
| Expense Logged (optional)            | "Expense of $[Amount] for [Description] logged under [Category]."                   | View Expense Details                 |
| Receipt Scan Error                   | "Couldn't extract all details from your receipt. Please review and manually enter." | Open expense for manual correction   |

**System & Reminders:**

| Trigger                       | Notification                                                                   | Action                 |
| ----------------------------- | ------------------------------------------------------------------------------ | ---------------------- |
| App Update Available          | "A new Smooth Move update is available!"                                       | App Store / Play Store |
| Feedback/Survey Request       | "Your move is complete! Help us improve Smooth Move by sharing your feedback." | Open Feedback Form     |
| Scheduled Reminder (User-set) | "[User-defined message]"                                                       | User-defined note/task |

### 12.2. Notification Channels

| Channel                  | Best For                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **In-App Notifications** | Immediate feedback, less critical alerts (badges, toast messages, Notifications tab)       |
| **Push Notifications**   | Time-sensitive, collaborative, or critical budget alerts (delivered when app is closed)    |
| **Email Notifications**  | Important summaries, progress reports, or less urgent reminders requiring more detail      |
| **SMS Notifications**    | Extremely critical, time-sensitive alerts only (e.g., "Truck has arrived!"); use sparingly |

### 12.3. User Control & Preferences

- **Granular Settings:** Enable/disable notifications per category (e.g., "Packing Progress," "Collaboration Alerts," "Budget Warnings").
- **Channel Preference:** For each enabled category, users select preferred channels (Push, Email, In-App Only).
- **Quiet Hours/Do Not Disturb:** Set a period during which non-critical notifications are suppressed or delivered silently.
- **Sound/Vibration Settings:** Standard OS-level controls.

### 12.4. Technical Considerations

- **Backend System:** A robust notification service to manage triggers, user preferences, and dispatch notifications across channels.
- **API Integration:** Firebase Cloud Messaging (FCM), Apple Push Notification service (APNs); email providers (SendGrid, Mailgun); SMS gateways.
- **Database Schema:** `notifications` table (sent notification log); `user_notification_preferences` table (user choices).
- **Real-time vs. Batched:** Collaborator actions and critical budget alerts require real-time delivery; daily/weekly summaries can be batched.
- **Localization:** Support for different languages in notification messages.

---

## 13. Relocation Planning Framework (Enhanced)

### I. Timeline Development

**Phase 1: Pre-Move Planning (8-12 Weeks Prior)**

_Week 8-12 Before Move:_

- Create a moving budget and set aside funds for unexpected expenses.
- Research and get estimates from at least three moving companies.
- Begin decluttering: sort into keep, donate, sell, or discard categories.
- Start researching the new neighborhood (schools, healthcare, local services).
- Create a dedicated moving binder or digital folder for all move-related paperwork.

_Week 6-8 Before Move:_

- Book moving company or reserve rental trucks for DIY moves.
- Begin collecting moving supplies (boxes, tape, bubble wrap, packing materials).
- Start packing non-essential items (seasonal decorations, books, rarely used belongings).
- Research utility providers in the new area and understand transfer procedures.
- Begin gathering important documents and medical records for transfer.

**Phase 2: Packing and Logistics (4-8 Weeks Prior)**

_Week 4-6 Before Move:_

- File change of address with USPS (online for $1.10).
- Contact utility companies to schedule disconnection/connection.
- Notify banks, insurance companies, employers, and subscription services of address change.
- Continue systematic packing, focusing on less frequently used rooms.
- Arrange time off work for moving day.

_Week 2-4 Before Move:_

- Finalize moving day logistics and confirm details with the moving company.
- Pack most belongings, leaving only essentials.
- Arrange care for children and pets on moving day.
- Start using up perishable food items and cleaning supplies.
- Schedule cleaning services for the old home if needed.

**Phase 3: Moving Day (1-2 Weeks Prior & Day Of)**

_1-2 Weeks Before:_

- Pack an essentials box for the first few days in the new home.
- Confirm all utility transfers.
- Disassemble furniture and prepare large items for moving.
- Conduct final walkthrough of new home and note any pre-existing issues.
- Get cash ready for tipping movers (typically $20-40 per mover for local moves; $40-80 for long-distance).

_Moving Day:_

- Start early and be present to supervise the entire process.
- Conduct final walkthrough of old home before movers finish loading.
- Keep important documents, valuables, and essentials with you.
- Perform walk-through of new home upon arrival and direct placement of boxes and furniture.

**Phase 4: Post-Move Settlement (1-4 Weeks After)**

_Week 1 After Move:_

- Unpack essentials first: bedrooms, bathrooms, and kitchen basics.
- Register to vote in the new location.
- Find new healthcare providers (doctors, dentists, veterinarians).
- Enroll children in new schools and arrange transportation.
- Update driver's license and vehicle registration (typically required within 30 days).

_Weeks 2-4 After Move:_

- Complete unpacking and organizing the new home.
- Explore the new neighborhood and locate essential services.
- Register with new utility providers if not transferred.
- Update voter registration and find local polling locations.
- Leave reviews for the moving company and service providers.

### II. Comprehensive Checklist

**Legal & Administrative:**

- [ ] File USPS change of address (online for $1.10 or free at the post office)
- [ ] Update voter registration in new location
- [ ] Change driver's license and vehicle registration
- [ ] Update address with IRS and state tax agencies
- [ ] Notify Social Security Administration of address change
- [ ] Update address with passport office if applicable
- [ ] Register children for new schools
- [ ] Transfer vehicle titles and registrations

**Financial:**

- [ ] Create a comprehensive moving budget
- [ ] Update address with banks, credit card companies, and investment accounts
- [ ] Transfer or close local bank accounts if moving far away
- [ ] Update insurance policies (auto, home/renters, health, life)
- [ ] Research and budget for new utility deposits and connection fees
- [ ] Review and update beneficiaries on financial accounts
- [ ] Set aside emergency fund for unexpected moving expenses

**Household:**

- [ ] Declutter and organize belongings before packing
- [ ] Pack systematically, starting with non-essential items
- [ ] Clean old home thoroughly (schedule professional cleaning if needed)
- [ ] Arrange for disposal of hazardous materials
- [ ] Schedule utility disconnections and connections
- [ ] Pack "Open Me First" box with immediate necessities
- [ ] Defrost and clean refrigerator 24 hours before move

**Personal:**

- [ ] Transfer medical records to new healthcare providers
- [ ] Obtain copies of prescription medications
- [ ] Research and select new healthcare providers in the destination area
- [ ] Transfer veterinary records for pets
- [ ] Update emergency contacts with schools and employers
- [ ] Research childcare options in new area
- [ ] Plan goodbye gatherings with friends and neighbors

### III. Task Breakdown & Guides

**Packing Guide — Essential Supplies:**

- Boxes in various sizes (small for heavy items like books; large for lightweight bulky items)
- High-quality packing tape and tape dispenser
- Bubble wrap, packing paper, or newspaper for fragile items
- Permanent markers for labeling
- Packing peanuts or padding materials

**Packing Strategies:**

- Use the "Russian Doll" technique: nest smaller packed boxes inside larger ones.
- Wrap fragile items in clothing, linens, and towels instead of bubble wrap.
- Pack heavy items in smaller boxes; lighter items in larger boxes.
- Fill empty spaces with padding to prevent shifting.
- Label boxes clearly with contents and destination room.
- Color-code boxes by room for easy identification.

### IV. Resources

**Links:**

- **USPS Change of Address:** [usps.com](https://www.usps.com)
- **USDOT Moving Company Verification:** Federal Motor Carrier Safety Administration database
- **Better Business Bureau:** For checking moving company ratings and reviews
- **IRS Moving Information:** Tax implications and deduction eligibility
- **State Utility Commission Websites:** For researching utility providers in new areas

**Video Tutorials:**

- Professional packing techniques for fragile items
- Furniture disassembly and reassembly guides

**Downloadable Templates:**

- Moving Budget Calculator
- Room-by-Room Inventory Checklist
- Moving Timeline Template (week-by-week task breakdown)
- Utility Transfer Checklist
- Moving Day Emergency Kit Checklist

### V. Research Data & Insights

**Average Moving Costs:**

| Move Type                                   | Average | Range             |
| ------------------------------------------- | ------- | ----------------- |
| Local (under 100 miles)                     | $1,489  | $882 – $2,567     |
| Long-Distance                               | $3,129  | $2,700 – $10,000+ |
| Professional Movers (hourly, 2-person team) | —       | $80 – $100/hr     |

**Common Moving Challenges:**

- Underestimating time required for packing and preparation
- Lack of organization leading to lost or misplaced items
- Inadequate research on new neighborhood and services
- Insufficient budget planning for unexpected expenses

**Stress Management Techniques:**

- Break tasks into manageable daily goals
- Delegate responsibilities to family members and friends
- Maintain regular exercise and sleep schedules during the moving process
- Practice deep breathing and mindfulness techniques

### VI. Additional Information

**Insurance Options:**

| Coverage Type                     | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| Basic Carrier Liability           | Minimum coverage required by law                   |
| Declared Value Protection         | Middle-tier coverage based on declared value       |
| Full Replacement Value Protection | Comprehensive coverage for actual replacement cost |

**Tax Deductions:** Moving expenses are generally not tax-deductible for most taxpayers (2018–2025).

**Pet Relocation:**

- Ensure pets have current ID tags and microchipping.
- Obtain copies of veterinary records and vaccination certificates.

**International Relocation:**

- Begin visa and immigration paperwork 8-12 weeks in advance.
- Research country-specific requirements for pets, vehicles, and household goods.

**Downsizing Strategies:**

- Use the "keep, donate, sell, discard" sorting system.
- Plan timing: complete major decluttering 4-6 weeks before move.
