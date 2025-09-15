# Smooth Moves - Essential Context

## Project Overview
**Smooth Moves** is a comprehensive React-based web application for managing residential or office moves. It provides QR code-based box tracking, owner/space management, comprehensive budget tracking (Financial Navigator), and real-time collaboration features.

**Tech Stack:**
- **Frontend:** React 19.1 + TypeScript + Vite 6.2
- **Styling:** TailwindCSS 4.1
- **Backend:** Firebase (Firestore + Auth + Storage)
- **Routing:** React Router DOM 7.6
- **Charts:** Recharts 3.1
- **Animations:** Framer Motion 12.18

## Development Commands
```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm start        # Start local production preview (Vite preview)
npm run deploy   # Deploy to Firebase hosting
```

## Architecture Overview

### Project Structure
```
src/
├── components/common/     # Reusable UI components (Button, Modal, Input, etc.)
├── components/layout/     # Layout components (Header, Footer)
├── features/             # Feature modules (auth, boxes, budget, owners, etc.)
├── hooks/                # Shared custom hooks
├── lib/                  # Configuration and utilities
├── types/                # Global type definitions
├── main.tsx              # App entry point with Firebase setup
└── App.tsx               # Root component with routing
```

### Key Features
- 📦 **Box Management** - QR code generation, scanning, status tracking
- 👥 **Owner & Space Management** - Assign items to people/rooms  
- 💰 **Financial Navigator** - Comprehensive budget tracking with charts
- 🤖 **AI Receipt Scanning** - Mindee OCR integration for automatic expense extraction
- 🔄 **Real-time Collaboration** - Multi-user moves with live updates
- 📱 **Mobile-First Design** - Responsive interface with touch support
- 🎨 **Dark/Light Mode** - System-wide theme switching

## Authentication & Routing

### Firebase Authentication
- Email/password and Google OAuth integration
- Route protection with `ProtectedRoute` component
- Multi-user move collaboration with move codes
- Real-time presence tracking and participant management

### Routing Structure
```
/ or /auth → AuthPage (public)
/app → Protected routes:
  ├── / → DashboardPage
  ├── /scan → QR Code scanning
  ├── /boxes → Box management
  ├── /budget → Financial Navigator
  ├── /owners → People management
  └── /settings → App settings
```

### Context Hierarchy
```
BrowserRouter → AuthProvider → ThemeProvider → SettingsProvider 
→ MoveProvider → BoxesProvider → OwnersProvider → App Components
```

## Feature Modules

### Budget Feature (Financial Navigator)
**Location:** `src/features/budget/`

**Architecture:**
- **State Management:** Custom `usePersistentReducer` with localStorage persistence
- **Components:** BudgetPage, BudgetSetup, AddExpenseModal, CategoryModal, ReceiptScanModal, charts
- **Data Storage:** Client-side only (localStorage) - no Firebase integration
- **AI Integration:** Mindee OCR API for automated receipt scanning and data extraction
- **Key Features:** Expense tracking, AI receipt scanning, receipt uploads (base64), budget templates, visual analytics

**Main Types:**
```typescript
interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  merchantName: string;
  description: string;
  receiptImageBase64?: string;
}

interface Category {
  id: string;
  name: string;
  estimatedAmount: number;
  color: string;
  icon: string;
}
```

### AI Receipt Scanning (Mindee OCR Integration)
**Location:** `src/features/budget/services/ReceiptScanningService.ts`, `src/features/budget/components/ReceiptScanModal.tsx`

**Features:**
- **Automated Data Extraction:** Merchant name, amount, date, line items from receipt images
- **Smart Category Mapping:** AI-suggested categories mapped to local budget categories  
- **Confidence Scoring:** Visual indicators showing extraction accuracy (High/Medium/Low)
- **Multi-format Support:** JPEG, PNG, GIF, PDF files up to 5MB
- **3-step Workflow:** Upload → AI Processing → Review & Edit extracted data
- **Error Handling:** Comprehensive error handling with retry logic and user-friendly messages

**Usage:**
- Click "Scan Receipt with AI" button in AddExpenseModal
- Upload receipt image via drag-and-drop or file picker
- Review and edit AI-extracted data before saving
- Supports both AI scanning and manual entry in same interface

**Configuration:**
- API Key: Set `VITE_MINDEE_API_KEY` environment variable
- Rate Limits: 250 API calls/month, 20 calls/minute (free tier)
- Processing Time: ~1 second average per receipt

### Box Management
**Location:** `src/features/boxes/`
- QR code generation and scanning
- Status workflow: Prepared → Packed → Loaded → Unloaded → Delivered → Unpacked
- Firebase integration for real-time updates
- Truck loading visualization

### Owner/Space Management
**Location:** `src/features/owners/`
- Personal owners and shared spaces (Kitchen, Living Room, etc.)
- Color-coded identification system
- PDF label generation for batch printing

## Configuration

### Environment Variables
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_MINDEE_API_KEY
```

### Key Configuration Files
- `vite.config.ts` - Vite configuration with @ path alias
- `tsconfig.json` - TypeScript configuration
- `src/lib/config/constants.tsx` - Firebase config, icons, predefined data
- `firebase.json` - Firebase hosting configuration

## Current Branch Context
**Branch:** `feat/budget-ui-calculations-fix`
**Recent Activity:** Working on budget feature improvements and calculations

## Development Notes

### Known Issues
- Duplicate imports in App.tsx (lines 14-17)
- Budget feature lacks Firebase integration (client-side only)
- Large components could benefit from splitting (BudgetPage.tsx ~673 lines)

### Code Conventions
- Uses TypeScript with strict mode enabled
- Feature-based folder structure with index.ts exports
- Custom hooks for state management (usePersistentReducer pattern)
- TailwindCSS for styling with custom color palette
- Path aliases with @ for cleaner imports

### Testing & Quality
- No test framework currently configured
- TypeScript strict mode for type safety
- ESLint/Prettier configurations not detected

### Performance Considerations
- Vite for fast development builds
- Source maps disabled in production
- Dependencies optimized in vite.config.ts
- Content hashing for cache busting

## Quick Reference

### Adding New Features
1. Create feature folder in `src/features/`
2. Follow pattern: components/, hooks/, pages/, services/, types/
3. Add index.ts exports
4. Update routing in App.tsx
5. Add to navigation if needed

### Styling Guidelines
- Use TailwindCSS utility classes
- Follow existing color palette (brand-primary, brand-secondary, etc.)
- Responsive design with mobile-first approach
- Dark mode support with dark: prefixes

### State Management Patterns
- Use context providers for feature-specific state
- usePersistentReducer for client-side persistence
- Firebase listeners for real-time data
- Custom hooks for complex state logic
