
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
**Purpose:** Smooth Moves is a comprehensive digital moving management platform that revolutionizes the relocation experience. It combines QR code-based box tracking, AI-powered assistance, comprehensive budget management, and real-time collaboration to make moving organized, efficient, and stress-free.

**Audience:** Individuals, families, or anyone planning and executing a residential or office move who want to stay organized, on budget, and leverage modern technology for a smoother moving experience.

**Development Status:** Active development with production-ready features. The application leverages Firebase for real-time collaboration, Google Gemini AI for intelligent assistance, and modern React architecture for optimal performance across all devices.

## Features
- 📦 **Box Management** - QR code generation, scanning, and status tracking
- 👥 **Owner & Space Management** - Assign items to people or rooms
- 💰 **Financial Navigator** - Comprehensive budget tracking with expense management
- 📅 **Calendar System** - Full calendar management with event scheduling and team collaboration
- 🤖 **MARVIN AI Assistant** - Voice-enabled AI with budget, calendar, and navigation integration
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
- **Calendar:** React Big Calendar 1.19, Date-fns 4.1
- **Animations:** Framer Motion 12.18
- **Charts:** Recharts 3.1
- **PDF Generation:** jsPDF 3.0
- **Notifications:** React Toastify 11.0
- **Utilities:** UUID 11.1
- **Server:** Express.js 4.19
- **AI Integration:** Google Gemini API 1.10
- **Voice Processing:** Picovoice Porcupine 3.0, Web Voice Processor 4.0

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

3. **Configure Environment Variables**
   Create a `.env.local` file in the project root:
   ```bash
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # MARVIN AI Assistant Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key
   
   # Picovoice Wake Word Configuration (Optional)
   VITE_PICOVOICE_ACCESS_KEY=your_picovoice_key
   ```

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
│   │   ├── hooks/          # Budget state management (including MARVIN integration)
│   │   ├── pages/          # Budget tracking pages
│   │   └── types/          # Budget type definitions
│   ├── calendar/           # Calendar System
│   │   ├── components/     # Calendar UI components and event modals
│   │   ├── hooks/          # Calendar state management (including MARVIN integration)
│   │   ├── pages/          # Calendar view pages
│   │   ├── services/       # Calendar API services
│   │   └── types/          # Calendar type definitions
│   ├── marvin/             # MARVIN AI Assistant
│   │   ├── adapters/       # Data transformation for AI context
│   │   ├── components/     # AI chat interface and voice components
│   │   ├── pages/          # MARVIN assistant page
│   │   ├── services/       # Gemini API, TTS, wake word services
│   │   └── types/          # AI assistant type definitions
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

### Required API Keys
1. **Firebase Project** - Create at https://console.firebase.google.com
   - Enable Authentication and Firestore Database
   - Copy configuration values to `.env.local`

2. **Google Gemini API** - Get API key at https://aistudio.google.com/app/apikey
   - Required for MARVIN AI Assistant functionality

3. **Picovoice Access Key** (Optional) - Get at https://console.picovoice.ai/
   - Required for wake word detection ("Let's Move Marvin")
   - MARVIN works without this, but lacks wake word activation

### Environment Variables
All configuration is handled through environment variables in `.env.local`:

```bash
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# MARVIN AI Assistant (Required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Picovoice Wake Word (Optional)
VITE_PICOVOICE_ACCESS_KEY=your_picovoice_key
```

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

### 📅 **Calendar System**
- **Interactive Calendar Views:** Month, week, day, and agenda views using React Big Calendar
- **Event Management:** Create, edit, and delete moving-related events with full CRUD operations
- **Team Collaboration:** Assign events to specific team members with real-time updates
- **Firebase Integration:** Real-time synchronization across all connected devices
- **MARVIN Integration:** AI-powered event creation and scheduling through natural language
- **Event Details:** Rich event descriptions, time management, and assignee tracking
- **Responsive Design:** Optimized calendar interface for all screen sizes

### 🤖 **MARVIN AI Assistant**
- **Natural Language Processing:** Google Gemini API integration for contextual responses
- **Voice Interaction:** Speech recognition and text-to-speech capabilities
- **Wake Word Detection:** "Let's Move Marvin" activation using Picovoice technology
- **Moving Context Awareness:** Real-time access to your boxes, owners, budget, and calendar data
- **Smart Actions:** Create calendar events, manage budget expenses, and navigate app features
- **Budget Integration:** Add expenses, create categories, and query spending through voice commands
- **Calendar Integration:** Schedule events, check availability, and manage move timeline
- **Web Search Integration:** Real-time search for moving-related queries
- **Mobile Optimized:** Cross-platform voice support for mobile browsers

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
*   **Missing Error Boundaries:** No global error handling for component failures
*   **Large Components:** Budget component (673 lines) could benefit from splitting into smaller components
*   **Budget Firebase Integration:** Budget feature uses localStorage only, not synced with Firebase
*   **Testing Framework:** No test suite currently configured
*   **Performance:** Large datasets in budget tracking may impact performance
*   **Camera Permissions:** QR scanning requires explicit camera permissions from users
*   **PDF Generation:** Complex layouts with many labels may have performance considerations
*   **MARVIN Voice Limitations:** Voice quality depends on browser and platform (mobile browsers have limited voice options)
*   **API Dependencies:** MARVIN requires external API keys (Gemini, Picovoice) for full functionality
*   **MARVIN Wake Word:** Picovoice access key required for "Let's Move Marvin" activation (optional feature)
*   **No Standalone Checklist System:** Task management currently handled through calendar events only

## Future Development Ideas

### 🚀 **Enhanced Features**
*   **Receipt Scanning:** OCR integration for automatic expense entry from receipt photos
*   **Document Vault:** Secure storage for moving-related documents and contracts
*   **Advanced Analytics:** Predictive spending analysis and cost optimization suggestions
*   **Bulk Operations:** Enhanced bulk editing and batch operations for boxes
*   **Image Management:** Direct device uploads and image optimization

### 🤖 **Enhanced AI Features**
*   **Advanced MARVIN Capabilities:**
    *   Smart suggestions for box contents based on room/context
    *   Voice commands for hands-free box updates
    *   AI-powered move progress summaries and insights
    *   Enhanced inventory management integration
*   **Smart Categorization:** Automatic expense categorization using AI
*   **Workload Distribution:** AI-powered task delegation among move participants
*   **Computer Vision:** Box content identification through camera
*   **Predictive Analytics:** Moving timeline optimization and delay prediction

### 📱 **Enhanced Mobile & Collaboration**
*   **Progressive Web App:** Enhanced offline capabilities with Service Workers
*   **Push Notifications:** Real-time alerts for move updates and budget warnings
*   **In-App Messaging:** Team communication system for move coordination
*   **Video Calls:** Integrated video chat for remote collaboration

### 🗺️ **Location & Planning**
*   **Google Maps Integration:** Route planning and moving day logistics
*   **Google Calendar Integration:** External calendar sync with existing calendar system
*   **Standalone Checklist System:** Dedicated task management separate from calendar events
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
