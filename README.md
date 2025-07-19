
# Smooth Moves

A comprehensive web application designed to help users efficiently manage and track their belongings during a move using QR codes, owner assignments, status updates, and comprehensive budget tracking.

## Table of Contents
1.  [Overview](#overview)
2.  [Features](#features)
3.  [Tech Stack](#tech-stack)
4.  [Installation & Setup](#installation--setup)
5.  [Development Commands](#development-commands)
6.  [Folder Structure](#folder-structure)
7.  [Core Features & Use Cases](#core-features--use-cases)
8.  [Configuration](#configuration)
9.  [UI/UX Design Reference](#uiux-design-reference)
10. [Known Issues / Limitations](#known-issues--limitations)
11. [Future Development Ideas](#future-development-ideas)
12. [Credits & Licensing](#credits--licensing)

## Overview
**Purpose:** Smooth Moves simplifies the relocation process by providing a complete moving management solution. Users can catalog boxes, assign them to owners or spaces, generate unique QR codes for tracking, manage comprehensive budgets with expense tracking, and monitor their move progress in real-time.

**Audience:** Individuals, families, or anyone planning and executing a residential or office move who want to stay organized and on budget.

**Development Status:** Active development. The application uses Firebase for authentication and real-time data synchronization, with a modern React-based frontend built on Vite.

## Features
- 📦 **Box Management** - QR code generation, scanning, and status tracking
- 👥 **Owner & Space Management** - Assign items to people or rooms
- 💰 **Financial Navigator** - Comprehensive budget tracking with expense management
- 📊 **Visual Analytics** - Charts and graphs for spending and inventory insights
- 📱 **Mobile-First Design** - Responsive interface for all devices
- 🔄 **Real-Time Sync** - Firebase-powered live data updates
- 🎨 **Dark/Light Mode** - Customizable themes
- 📄 **PDF Generation** - Printable QR code labels and reports
- 🚛 **Truck Loading** - Visual truck loading management
- 🔐 **Secure Authentication** - Firebase Auth integration

## Tech Stack
**Core Technologies:**
- **Frontend:** React 19.1 + TypeScript
- **Build Tool:** Vite 6.2
- **Styling:** TailwindCSS 4.1
- **Backend:** Firebase (Firestore + Auth)
- **Routing:** React Router DOM 7.6

**Key Libraries:**
- **UI Components:** Lucide React, React Icons
- **Animations:** Framer Motion 12.18
- **Charts:** Recharts 3.1
- **PDF Generation:** jsPDF 3.0
- **Notifications:** React Toastify 11.0
- **Utilities:** UUID 11.1
- **Server:** Express.js 4.19

## Installation & Setup
**Prerequisites:**
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled
- Firebase project (for backend services)

**Steps:**
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodebaseRestructure
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database and Authentication
   - Copy your Firebase config and update `src/main.tsx`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm start

# Deploy to Firebase (requires configuration)
npm run deploy
```

## Folder Structure
```
src/
├── components/               # Reusable UI components
│   ├── common/              # Basic UI elements
│   │   ├── Alert/           # Alert component
│   │   ├── Button/          # Button component
│   │   ├── Card/            # Card component
│   │   ├── Input/           # Input component
│   │   ├── Modal/           # Modal component
│   │   ├── QRCodeDisplay/   # QR code display
│   │   ├── Select/          # Select component
│   │   ├── Textarea/        # Textarea component
│   │   └── TruckDiagram/    # Truck visualization
│   └── layout/              # Layout components
│       ├── Header/          # Navigation header
│       └── Footer/          # Application footer
├── features/                # Feature-based modules
│   ├── auth/               # Authentication
│   │   ├── components/     # Auth-specific components
│   │   ├── hooks/          # Auth context and hooks
│   │   ├── pages/          # Login/register pages
│   │   ├── services/       # Auth API services
│   │   └── types/          # Auth type definitions
│   ├── boxes/              # Box management
│   │   ├── components/     # Box-related components
│   │   ├── hooks/          # Box state management
│   │   ├── pages/          # Box management pages
│   │   └── services/       # Box API services
│   ├── budget/             # Financial Navigator
│   │   ├── components/     # Budget UI components
│   │   ├── constants/      # Budget constants
│   │   ├── hooks/          # Budget state management
│   │   ├── pages/          # Budget tracking pages
│   │   └── types/          # Budget type definitions
│   ├── owners/             # Owner management
│   │   ├── components/     # Owner-related components
│   │   ├── hooks/          # Owner state management
│   │   ├── pages/          # Owner management pages
│   │   └── services/       # Owner API services
│   ├── products/           # Product management
│   │   ├── components/     # Product components
│   │   ├── hooks/          # Product hooks
│   │   ├── pages/          # Product pages
│   │   ├── services/       # Product services
│   │   └── types/          # Product types
│   └── settings/           # App settings
│       ├── hooks/          # Settings management
│       ├── pages/          # Settings pages
│       └── services/       # Settings services
├── hooks/                  # Shared custom hooks
├── lib/                    # Utilities and configuration
│   ├── api/               # API utilities
│   ├── config/            # App configuration
│   ├── helpers/           # Helper functions
│   └── utils/             # Utility functions
├── types/                  # Global type definitions
├── utils/                  # Additional utilities
├── main.tsx               # Application entry point
└── App.tsx                # Root component with routing
```

## Configuration
### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore Database
3. Add your Firebase configuration to `src/main.tsx`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### Environment Variables
Configure your environment variables for different deployment targets.

## Core Features & Use Cases

### 🔐 **Authentication & User Management**
- **Firebase Authentication:** Secure sign-up and sign-in with email/password
- **Move Management:** Create new moves or join existing ones with Move ID
- **Protected Routes:** Secure access to application features
- **User Onboarding:** Guided setup for new users

### 📦 **Box Management System**
- **QR Code Generation:** Unique QR codes for each box with automatic generation
- **Status Tracking:** Complete lifecycle tracking from Prepared → Packed → Loaded → Unloaded → Delivered → Unpacked
- **Box Details:** Comprehensive information including contents, photos, destination rooms
- **Real-time Updates:** Live synchronization across all connected devices

### 👥 **Owner & Space Management**
- **Personal Owners:** Assign boxes to specific individuals with color-coded identification
- **Shared Spaces:** Manage communal areas (kitchen, living room) and custom spaces
- **Visual Organization:** Color-coded system for easy identification
- **Bulk Operations:** Batch printing and management of multiple boxes

### 💰 **Financial Navigator (Budget Tracker)**
- **Comprehensive Budget Management:** Set total moving budget with move type templates
- **Expense Tracking:** Record all moving-related expenses with categories
- **Visual Analytics:** Interactive charts showing spending patterns and budget usage
- **Category Management:** Customize expense categories with icons and colors
- **Smart Insights:** Track budget vs actual spending with alerts and warnings
- **Receipt Management:** Store merchant details and descriptions for all expenses
- **Export Capabilities:** Generate reports and track spending over time

### 📱 **QR Code Scanning & Mobile Features**
- **Camera Integration:** Use device camera to scan QR codes for quick updates
- **Progressive Status Updates:** Smart scanning that suggests next logical status
- **Mobile-First Design:** Optimized interface for mobile devices
- **Offline Capability:** Core scanning features work without internet

### 🚛 **Truck Loading Visualization**
- **Interactive Truck Diagram:** Visual representation of truck loading zones
- **Zone Assignment:** Assign boxes to specific truck zones and positions
- **Load Optimization:** Visual feedback for efficient truck loading
- **Loading Progress:** Track loading status in real-time

### 📄 **PDF Label Generation**
- **Batch Printing:** Generate multiple QR code labels at once
- **Color-Coded Labels:** Labels match owner/space color schemes
- **Professional Layout:** Clean, printable PDF format
- **Customizable Batches:** Choose number of labels per batch

### 🎨 **User Experience Features**
- **Dark/Light Mode:** System-wide theme switching with persistence
- **Responsive Design:** Seamless experience across all device sizes
- **Animated Transitions:** Smooth Framer Motion animations
- **Toast Notifications:** Real-time feedback for all user actions
- **Loading States:** Comprehensive loading indicators throughout the app

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
*   **Duplicate Imports:** App.tsx contains duplicate BudgetSetupPage imports (lines 14-17)
*   **Missing Error Boundaries:** No global error handling for component failures
*   **Large Components:** Budget component (673 lines) could benefit from splitting into smaller components
*   **Loading States:** Some components lack comprehensive loading indicators
*   **Firebase Configuration:** appConfig.ts is minimal and may need additional configuration
*   **Performance:** Large datasets in budget tracking may impact performance
*   **Camera Permissions:** QR scanning requires explicit camera permissions from users
*   **PDF Generation:** Complex layouts with many labels may have performance considerations

## Future Development Ideas

### 🚀 **Enhanced Features**
*   **Receipt Scanning:** OCR integration for automatic expense entry from receipt photos
*   **Document Vault:** Secure storage for moving-related documents and contracts
*   **Advanced Analytics:** Predictive spending analysis and cost optimization suggestions
*   **Bulk Operations:** Enhanced bulk editing and batch operations for boxes
*   **Image Management:** Direct device uploads and image optimization

### 🤖 **AI Integration**
*   **Gemini API Integration:** 
    *   Smart suggestions for box contents based on room/context
    *   Voice commands for hands-free box updates
    *   AI-powered move progress summaries and insights
*   **Smart Categorization:** Automatic expense categorization using AI
*   **Workload Distribution:** AI-powered task delegation among move participants

### 📱 **Enhanced Mobile & Collaboration**
*   **Progressive Web App:** Enhanced offline capabilities with Service Workers
*   **Push Notifications:** Real-time alerts for move updates and budget warnings
*   **In-App Messaging:** Team communication system for move coordination
*   **Video Calls:** Integrated video chat for remote collaboration

### 🗺️ **Location & Planning**
*   **Google Maps Integration:** Route planning and moving day logistics
*   **Google Calendar Integration:** Shared calendar for move milestones and deadlines
*   **Personalized Move Checklist:** Timeline-based task management with delegation
*   **Inventory Valuation:** Insurance and valuation tracking for belongings

### 🔧 **Technical Improvements**
*   **Enhanced PDF Customization:** Advanced label design and layout options
*   **Advanced Reporting:** Comprehensive move analytics and export capabilities
*   **API Integration:** Third-party integrations with moving services and vendors
*   **Multi-language Support:** Internationalization for global users

## Credits & Licensing
**Developed by:** AI Assistant (as part of a development exercise)
**Special Thanks To:** N/A
**License:** To be determined (Currently proprietary/for demonstration purposes).
