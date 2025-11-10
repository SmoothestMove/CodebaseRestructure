
# Smooth Moves

A comprehensive web application designed to help users efficiently manage and track their belongings during a move using QR codes, owner assignments, status updates, and comprehensive budget tracking.

## Table of Contents
1.  [Overview](#overview)
2.  [Features](#features)
3.  [Tech Stack](#tech-stack)
4.  [Installation & Setup](#installation--setup)
5.  [Development Commands](#development-commands)
6.  [Folder Structure](#folder-structure)
7.  [Architecture](#architecture)
8.  [Contributing](#contributing)
9.  [Configuration](#configuration)
10. [Credits & Licensing](#credits--licensing)

## Overview
**Purpose:** Smooth Moves is a comprehensive digital moving management platform that revolutionizes the relocation experience. It combines QR code-based box tracking, AI-powered assistance, comprehensive budget management, and real-time collaboration to make moving organized, efficient, and stress-free.

**Audience:** Individuals, families, or anyone planning and executing a residential or office move who want to stay organized, on budget, and leverage modern technology for a smoother moving experience.

**Development Status:** Active development with production-ready features. The application leverages Firebase for real-time collaboration, Google Gemini AI for intelligent assistance, and modern React architecture for optimal performance across all devices.

## Features
- 📦 **Box Management** - QR code generation, scanning, and status tracking
- 👥 **Owner & Space Management** - Assign items to people or rooms
- 💰 **Financial Navigator** - Comprehensive budget tracking with AI receipt scanning
- 🧾 **AI Receipt Scanning** - Mindee OCR integration for automated expense extraction
- 📋 **Planner System** - Comprehensive task management with drag-drop, timelines, and custom fields
- 📅 **Calendar System** - Full calendar management with event scheduling and team collaboration
- 🤖 **MARVIN AI Assistant** - Voice-enabled AI with budget, calendar, and navigation integration
- 🛍️ **Product Management** - Comprehensive product catalog and tracking system
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
- **Backend:** Firebase (Firestore + Auth + Storage)
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
- **AI Integration:** Google Gemini API 1.10, Mindee OCR API
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
   
   # Mindee OCR API Configuration
   VITE_MINDEE_API_KEY=your_mindee_api_key
   
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
│   ├── design-system/       # High-level design system components
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
│   ├── budget/             # Financial Navigator with AI receipt scanning
│   │   ├── components/     # Budget UI components and receipt scanning
│   │   ├── constants/      # Budget constants
│   │   ├── hooks/          # Budget state management (including MARVIN integration)
│   │   ├── pages/          # Budget tracking pages
│   │   ├── services/       # Receipt scanning service (Mindee OCR)
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
│   ├── planner/            # Comprehensive task management system
│   │   ├── components/     # Task cards, drag-drop, modals, timelines
│   │   ├── hooks/          # Planner state management and Firebase integration
│   │   ├── pages/          # Planner dashboard and task views
│   │   ├── services/       # Firebase planner service and checklist parsing
│   │   └── types/          # Planner and task type definitions
│   ├── products/           # Product management
│   │   ├── components/     # Product components
│   │   ├── hooks/          # Product hooks
│   │   ├── pages/          # Product pages
│   │   ├── services/       # Product services
│   │   └── types/          # Product types
│   ├── settings/           # App settings
│   │   ├── hooks/          # Settings management
│   │   ├── pages/          # Settings pages
│   │   └── services/       # Settings services
│   ├── storage/            # Storage management
│   │   ├── components/     # Storage components
│   │   ├── hooks/          # Storage hooks
│   │   ├── pages/          # Storage pages
│   │   ├── services/       # Storage services
│   │   └── types/          # Storage types
│   └── timeline/           # Timeline and progress tracking
│       ├── components/     # Timeline components and UI elements
│       ├── hooks/          # Timeline state management
│       ├── pages/          # Timeline views
│       ├── services/       # Timeline services
│       └── types/          # Timeline type definitions
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

## Architecture
The application is built using a feature-based architecture. Each feature is a self-contained module that includes its own components, hooks, pages, services, and types. This makes it easy to add new features and maintain existing ones.

The application uses Firebase for its backend services, including authentication, a Firestore database, and storage. The frontend is built with React and TypeScript, and uses Vite as its build tool.

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes.**
4.  **Write tests** for your changes.
5.  **Run the tests** to make sure they pass.
6.  **Submit a pull request.**

Please make sure to follow the existing code style and to document your changes.

## Configuration

### Required API Keys
1. **Firebase Project** - Create at https://console.firebase.google.com
   - Enable Authentication, Firestore Database, and Storage
   - Copy configuration values to `.env.local`

2. **Google Gemini API** - Get API key at https://aistudio.google.com/app/apikey
   - Required for MARVIN AI Assistant functionality

3. **Mindee OCR API** - Get API key at https://platform.mindee.com/
   - Required for AI receipt scanning functionality
   - Free tier: 250 API calls/month, 20 calls/minute

4. **Picovoice Access Key** (Optional) - Get at https://console.picovoice.ai/
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

# Mindee OCR API (Required for receipt scanning)
VITE_MINDEE_API_KEY=your_mindee_api_key

# Picovoice Wake Word (Optional)
VITE_PICOVOICE_ACCESS_KEY=your_picovoice_key
```

## Credits & Licensing
**Developed by:** AI Assistant (as part of a development exercise)
**Special Thanks To:** N/A
**License:** To be determined (Currently proprietary/for demonstration purposes).
