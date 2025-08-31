# GEMINI.md - Development Guide for Smooth Moves

## Project Overview

**Smooth Moves** is a comprehensive digital moving management platform built with React, TypeScript, and Firebase. The application combines QR code-based box tracking, AI-powered assistance (MARVIN), comprehensive budget management with AI receipt scanning, real-time calendar collaboration, and advanced task planning systems.

**Current Status:** Active development with production-ready features. The codebase has undergone recent cleanup and archival of legacy components.

---

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start development server (Vite) at localhost:5173
npm run build           # Build for production  
npm run preview         # Preview production build locally
npm start              # Start production server (Express.js)
npm run deploy         # Build and deploy to Firebase hosting

# No testing framework currently configured
```

---

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend:** React 19.1 + TypeScript with Vite 6.2 build system
- **Styling:** TailwindCSS 4.1 with custom CSS design system
- **Backend:** Firebase (Firestore + Auth + Storage)
- **Routing:** React Router DOM 7.6 with protected routes
- **State Management:** Context API + custom hooks, local reducers
- **Animations:** Framer Motion 12.18
- **AI Integration:** Google Gemini API, Mindee OCR for receipt scanning
- **Voice Processing:** Picovoice Porcupine for wake word detection

### Core Application Structure
```
src/
├── App.tsx                    # Root component with routing setup
├── main.tsx                   # Entry point with Firebase initialization
├── components/                # Reusable UI components
│   ├── common/               # Basic UI elements (Button, Modal, Input, etc.)
│   ├── design-system/        # Brand-specific components and design tokens
│   ├── layout/               # Header, Footer components
│   └── ui/                   # Radix UI components (shadcn/ui style)
├── features/                 # Feature-based architecture
├── hooks/                    # Shared custom hooks (useTheme, useDebounce, etc.)
├── lib/                      # Utilities and configuration
└── types/                    # Global type definitions
```

---

## 🎯 Feature Modules (Key Understanding)

The application uses a **feature-based architecture** where each major feature is self-contained:

### 1. Authentication (`features/auth/`)
- **Firebase Auth** integration with email/password
- **Move management** - users can create/join moves with Move IDs
- **Protected routes** with AuthProvider context
- New user onboarding flow with automatic owner creation

### 2. Box Management (`features/boxes/`)
- **QR code generation** and scanning for box tracking
- **Status lifecycle:** Prepared → Packed → Loaded → Unloaded → Delivered → Unpacked
- **Real-time Firebase sync** across all devices
- **Truck loading visualization** with zone assignments
- Mobile-first camera scanning interface

### 3. Budget Tracker (`features/budget/`)
- **AI receipt scanning** via Mindee OCR API
- **Comprehensive expense tracking** with categories and visual analytics
- **Charts and insights** using Recharts library
- **MARVIN integration** for voice-controlled expense management
- **Local storage** based (not Firebase synced yet)

### 4. MARVIN AI Assistant (`features/marvin/`)
- **Google Gemini API** for natural language processing
- **Voice interaction** with text-to-speech capabilities
- **Wake word detection** ("Let's Move Marvin") via Picovoice
- **Contextual awareness** of user data (boxes, budget, calendar)
- **Web search integration** for moving-related queries

### 5. Calendar System (`features/calendar/`)
- **React Big Calendar** for interactive calendar views
- **Real-time Firebase sync** for team collaboration
- **Event management** with CRUD operations
- **MARVIN integration** for AI-powered scheduling

### 6. Enhanced Planner (`features/planner-enhanced/`)
- **Advanced task management** with drag-drop interface
- **Custom fields** and flexible task attributes
- **Timeline visualization** and milestone tracking
- **Firebase integration** for real-time collaboration
- **Template system** and bulk operations

### 7. Owner/Space Management (`features/owners/`)
- **Personal owners** and **communal spaces** with color coding
- **PDF label generation** for batch printing
- **Integration** with box assignment system

---

## 🔧 Configuration Files

### Environment Variables (`.env.local`)
```bash
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI Features
VITE_GEMINI_API_KEY=your_gemini_api_key          # For MARVIN AI
VITE_MINDEE_API_KEY=your_mindee_api_key          # For receipt scanning

# Optional
VITE_PICOVOICE_ACCESS_KEY=your_picovoice_key     # For wake word detection
```

### Key Configuration Files
- `vite.config.ts` - Build configuration with path aliases (`@/` → `./src`)
- `tsconfig.json` - TypeScript with strict mode enabled
- `firebase/firebase.json` - Firebase hosting and Firestore configuration
- `index.css` - Design system with CSS custom properties and TailwindCSS

---

## 🎨 Design System

### Brand Colors (CSS Custom Properties)
```css
--brand-primary: #1e3a5f     /* Dark Blue - headers, backgrounds */
--brand-secondary: #708090   /* Slate Gray - text, secondary elements */
--brand-tertiary: #ff7e00    /* Orange - CTAs, highlights, active states */
--brand-accent: #e1a95f      /* Muted Orange - warnings, accents */
```

### Component Library
- **Base components:** `src/components/common/` (Button, Modal, Input, etc.)
- **Design system:** `src/components/design-system/` with foundations
- **UI components:** `src/components/ui/` (Radix UI based, shadcn/ui style)

### Styling Approach
- **TailwindCSS 4.1** for utility-first styling
- **CSS custom properties** for design tokens
- **Dark/light mode** support throughout
- **Responsive design** with mobile-first approach

---

## 🔄 State Management Patterns

### Context Providers (Nested Structure)
```tsx
<SettingsProvider>
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <MoveProvider>
          <BoxesProvider>
            <OwnersProvider>
              <CalendarProvider>
                <App />
```

### Data Flow
- **Firebase Firestore** for persistent data (boxes, calendar, planner)
- **Local storage** for settings and budget data
- **Context API** for cross-component state sharing
- **Custom hooks** for feature-specific logic

---

## 📁 Important Directories

### Source Code Organization
```
src/
├── features/                 # Feature modules (primary development area)
│   ├── auth/                # Authentication and user management
│   ├── boxes/               # Box tracking and QR code management  
│   ├── budget/              # Financial management with AI receipt scanning
│   ├── calendar/            # Calendar and event management
│   ├── marvin/              # AI assistant functionality
│   ├── owners/              # Owner and space management
│   ├── planner-enhanced/    # Advanced task planning system
│   └── settings/            # Application settings and move management
├── lib/                     # Utilities and shared logic
│   ├── config/              # App configuration and constants
│   ├── utils/               # Utility functions
│   └── animations/          # Framer Motion configurations
└── hooks/                   # Shared custom hooks
```

### Project Structure
```
├── docs/                    # Documentation (development guides, project management)
├── firebase/                # Firebase configuration files
├── Archives/                # Archived legacy implementations
└── EnhancedPlannerComponents/ # User component testing area
```

---

## 🚨 Important Considerations

### Known Limitations
- **Budget feature** uses localStorage only (not Firebase synced)
- **No testing framework** currently configured
- **Large components** exist that could benefit from splitting
- **API dependencies** for full AI functionality (Gemini, Mindee, Picovoice)

### Current Development Focus
- The **planner-enhanced** system is the active implementation
- Legacy planner code has been archived
- Recent codebase cleanup eliminated ~17MB of redundant code

### Firebase Integration
- **Real-time sync** for boxes, calendar, and planner data
- **Firestore security rules** configured
- **Authentication** with email/password only
- **Storage** for user uploads and receipt images

---

## 🔍 Debugging and Development

### Common Issues
- **Environment variables** must be properly configured for AI features
- **Firebase configuration** required for data persistence
- **Camera permissions** needed for QR scanning functionality
- **API rate limits** apply to Mindee receipt scanning (250 calls/month free tier)

### Development Workflow
1. **Features** are developed in their respective `src/features/` directories
2. **Components** follow the established pattern with hooks, services, and types
3. **Firebase integration** should be added to new features requiring persistence
4. **Mobile-first** responsive design is expected

### Key Files to Understand
- `src/App.tsx` - Application routing and layout structure
- `src/main.tsx` - Firebase initialization and provider setup
- `src/lib/config/constants.tsx` - Configuration constants and Firebase setup
- `src/types/index.ts` - Core type definitions for the application

---

**Last Updated:** Based on codebase state as of recent cleanup and archival (commit: `3f7d82a`)