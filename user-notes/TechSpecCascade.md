## Smooth Moves Codebase Technical Specification

**PROJECT OVERVIEW**

- **What's the broader product or company context this codebase belongs to?** 
  Smooth Moves is a comprehensive residential moving management web application designed for individuals and families planning and executing a move. The product helps users manage every aspect of their relocation: from tracking boxes with QR codes and assigning items to owners/spaces, to budgeting expenses with OCR receipt scanning, calendar event scheduling, task planning, and receiving AI-powered moving assistance through MARVIN (the integrated Gemini-based assistant).

- **What's the primary goal or responsibility of this codebase?** 
  This codebase delivers a full-featured React + TypeScript single-page application (SPA) that acts as a "moving project cockpit." It provides authenticated users with mobile-first, real-time tools to organize their move, track physical inventory, manage finances, coordinate timelines, and access intelligent assistance—all backed by Firebase (Auth, Firestore, Storage).

- **What are 1–2 core workflows or use cases that this codebase powers?** 
  1. **Box Inventory Management**: Users create a move project, generate QR code labels for boxes, scan boxes via mobile camera, assign boxes to owners/spaces (people or rooms), track box statuses (packed/loaded/delivered), and visualize truck loading layouts.
  2. **Moving Budget & Planning**: Users establish budgets with categories and track expenses (including OCR-based receipt ingestion via Mindee API), schedule move-related events in a calendar, create and organize tasks in the planner with timeframes, and interact with MARVIN AI assistant for tips, reminders, and move-related queries.

**ARCHITECTURE + TECH**

- **How is the system architected?** 
  - **Client-Server SPA Architecture**: Pure frontend React application served as static assets (via Vercel production hosting or optional Firebase Hosting), communicating with Firebase backend services (no custom backend server).
  - **Domain-Driven Feature Organization**: The `src/features/` directory is organized by domain modules (auth, boxes, owners, budget, calendar, planner, marvin, settings), each containing pages, components, hooks, and services.
  - **Context-Based State Management**: React Context providers manage domain state (AuthContext, BoxesProvider, OwnersProvider, CalendarProvider, MoveProvider, SettingsProvider) with Firebase Firestore as the source of truth.
  - **Protected Route Pattern**: All move-scoped routes are wrapped in `ProtectedRoute` component ensuring authentication before access; unauthenticated users are redirected to `/auth`.

- **What's the tech stack used across the frontend, backend, database, and infra?** 
  - **Frontend**: React 19.1, TypeScript 5.7, React Router DOM 7.6, TailwindCSS 4.1
  - **UI Components**: Radix UI primitives (@radix-ui/*), Lucide React icons, Framer Motion animations, @hello-pangea/dnd for drag-and-drop, recharts for data visualization
  - **Build Tooling**: Vite 6.2 with path alias `@/* -> ./src/*`, strict TypeScript configuration, Vitest for testing
  - **Backend Services**: Firebase 11.8 (Authentication, Firestore database, Cloud Storage)
  - **Hosting**: Vercel (production static site deployment), optional Firebase Hosting configured
  - **AI Integrations**: Google Gemini API (@google/genai) for MARVIN assistant, Mindee Receipt OCR API for expense scanning, Picovoice Porcupine for wake word detection
  - **Additional Libraries**: date-fns, jsPDF, react-big-calendar, react-toastify, uuid, class-variance-authority, cmdk

- **What custom patterns, internal frameworks, or architectural decisions are unique to this codebase?** 
  - **Path Alias Pattern**: Consistent use of `@/*` import alias mapped to `./src/*` across both Vite config and TypeScript paths
  - **Environment Variable Sanitization**: Custom `getEnvVar()` helper in `src/lib/config/constants.tsx` validates and sanitizes all Firebase and API keys, failing fast with descriptive errors if required values are missing
  - **Move-Scoped Data Model**: All user data is hierarchically organized under a parent `moves/{moveId}` Firestore document, with subcollections for boxes, owners, calendar_events, expenses, plannerTasks, etc.
  - **Participants-Based Access Control**: Firestore security rules enforce that only the move owner (`createdBy` or `ownerId`) and users listed in the `participants` object/array can read/write move data
  - **QR Code Generation**: Each box is assigned a unique QR code that encodes the box ID, enabling camera-based scanning for quick box lookup and updates
  - **Predefined Communal Spaces**: System includes predefined communal room types (Kitchen, Living Room, Bathroom, etc.) with preset colors, automatically available in every move
  - **Theme Context**: Dark/light mode managed via `ThemeProvider` using `next-themes` library
  - **New User Onboarding Flow**: After registration, `sessionStorage` flags trigger an owner-creation modal to add the user as a move participant

- **What external systems does this codebase connect to?** 
  - **Firebase Services**: Authentication (email/password, Google OAuth), Firestore (NoSQL database), Cloud Storage (file uploads)
  - **Google Gemini API**: AI assistant (MARVIN) for conversational support, move planning suggestions, and query responses
  - **Mindee Receipt OCR API**: Expense receipt scanning and data extraction (`https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict`)
  - **Picovoice Porcupine**: Optional wake word voice activation for MARVIN assistant (models stored in `public/` directory)

**PRIVATE DEPENDENCIES + RUNNING THE CODE**

- **When building this project, do we need access to any internal dependencies, packages, or libraries?** 
  No internal or private npm packages are required. All dependencies are publicly available via npm registry and listed in `package.json`.

- **Are there any secrets, environment variables, or configurations required to compile and run the project successfully?** 
  Yes, environment variables are required. Create a `.env.local` file in the root directory (gitignored) with the following:
  
  **Required for Firebase (app will not initialize without these)**:
  ```
  VITE_FIREBASE_API_KEY=your_firebase_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  ```
  
  **Required for MARVIN AI assistant**:
  ```
  VITE_GEMINI_API_KEY=your_gemini_api_key
  ```
  
  **Optional for enhanced features**:
  ```
  VITE_MINDEE_API_KEY=your_mindee_api_key  # For receipt OCR scanning
  VITE_PICOVOICE_ACCESS_KEY=your_picovoice_key  # For wake word detection
  ```
  
  - Environment variables are loaded via Vite's `import.meta.env` and processed in `src/lib/config/constants.tsx`
  - Run `npm run env:verify` to validate environment configuration before starting development
  - See `docs/development/environment.md` for detailed environment setup guidance

- **Do you have a complete, step-by-step set of build instructions that takes a developer from a clean machine to running the project?** 
  
  **Prerequisites**: Node.js 18+ and npm installed
  
  **Build Instructions**:
  ```bash
  # 1. Clone the repository
  git clone https://github.com/SmoothestMove/CodebaseRestructure.git
  cd CodebaseRestructure
  
  # 2. Install dependencies
  npm install
  
  # 3. Set up environment variables
  # Create .env.local file and populate with Firebase + API keys (see section above)
  
  # 4. Verify environment configuration (optional but recommended)
  npm run env:verify
  
  # 5. Start development server
  npm run dev
  # App will be available at http://localhost:5173
  
  # 6. Build for production
  npm run build  # Output to dist/ directory
  
  # 7. Preview production build locally
  npm run preview  # or npm start
  ```
  
  **Additional Documentation**:
  - Quick start: `README.md`
  - Developer guide: `docs/DevDoc.md`
  - Environment setup: `docs/development/environment.md`
  - MARVIN troubleshooting: `docs/development/MARVIN Troubleshooting.md`
  - Mindee OCR integration: `docs/development/MindeeOCR/`

**BUSINESS CONTEXT + DOMAIN KNOWLEDGE**

- **What business rules or compliance requirements shape this code?** 
  - **User Data Privacy**: All user data is scoped to authenticated Firebase users; Firestore security rules enforce that only move creators/owners and explicitly listed participants can access move data
  - **Multi-Tenancy via Move Isolation**: Each move is a separate data tenant; users can participate in multiple moves but data is strictly isolated per move
  - **No PCI Compliance**: Budget feature tracks expenses but does NOT process payments or store credit card information
  - **API Key Security**: All API keys must be kept in `.env.local` (gitignored); hardcoded keys are explicitly forbidden
  - **CORS & Authentication**: Firebase Auth handles session management; custom domain support exists for `movingsmooth.com` with proper auth domain configuration

- **Any industry or domain-specific terminology or acronyms we should understand?** 
  - **Move**: A top-level project representing a single relocation event; contains all associated data (boxes, owners, budget, calendar, etc.)
  - **Box**: A physical container tracked in the system, identified by QR code, with properties like contents, status, owner, space, and photos
  - **Owner**: A person assigned to boxes (e.g., "John Doe"); used to track personal belongings during a move
  - **Space**: A room or location assigned to boxes (e.g., "Kitchen", "Bedroom 1"); can be a predefined communal space or custom
  - **Participant**: A user who has been granted access to a move; stored in the move document's `participants` field
  - **MARVIN**: Moving Assistant for Residential and Vital Information Navigation—the AI assistant powered by Google Gemini
  - **OCR**: Optical Character Recognition; used with Mindee API to extract expense data from receipt photos
  - **Wake Word**: Voice trigger phrase (via Porcupine) to activate MARVIN hands-free
  - **Truck Load**: Visual layout planning feature showing how boxes should be loaded into a moving truck
  - **Timeframe**: A planning period in the planner feature (e.g., "6-8 weeks before move")
  - **UID**: Unique identifier; used for user IDs (Firebase Auth), box IDs, owner IDs, etc.

- **What's the "why" behind major architectural choices?** 
  - **Firebase Backend-as-a-Service**: Chosen to eliminate custom backend development, reduce infrastructure costs, and provide real-time synchronization across devices without managing servers
  - **Mobile-First Design**: Primary users are individuals managing moves on mobile devices during packing/unpacking; desktop is secondary
  - **QR Code System**: Physical labels provide fast, reliable box identification without manual typing, critical when moving hundreds of boxes
  - **Feature-Based Directory Structure**: Organizing by domain (`features/boxes`, `features/budget`, etc.) keeps related code co-located and supports independent feature development
  - **Context Providers Over Redux**: Simpler state management suitable for app scale; Firebase real-time listeners already provide reactive data updates
  - **Vite Over Create-React-App**: Faster dev server startup and hot module replacement critical for developer experience
  - **TailwindCSS Over Component Libraries**: Provides design consistency with flexibility, smaller bundle size than full component frameworks
  - **Radix UI Primitives**: Accessible, unstyled components provide foundation for custom-styled UI while maintaining WCAG compliance
  - **Vercel Hosting**: Zero-config static deployment with global CDN, better performance than Firebase Hosting for SPAs

**CURRENT STATUS + EVOLUTION**

- **What stage is this codebase in?** 
  Active development with production deployment. The app is functional and in use (version 0.2.0 per `package.json`), with ongoing feature enhancements, bug fixes, and UX improvements. Core features (boxes, owners, calendar, budget, planner, MARVIN) are implemented but some areas are being refined or expanded.

- **Have there been any major architectural shifts or technical constraints that shaped the current system?** 
  - **Recent Registration Flow Fix**: Modified auth flow to handle Firebase permission errors gracefully; users can now register successfully even if initial move creation/joining fails, with ability to create/join moves later from dashboard
  - **Responsive UI Initiative**: Ongoing migration to mobile-first responsive design with consistent breakpoint strategy and Tailwind config standardization (see `docs/planForResponsiveUIDesign.md`)
  - **Component Library Evolution**: Some legacy/deprecated components exist in excluded directories (`src/components/common/**`, `src/components/design-system/**`) per `tsconfig.json` exclude rules
  - **Session Journal System**: Implemented shared documentation approach between multiple AI assistants (Cascade, Gemini CLI) with real-time task tracking in `sessionjournal.md`
  - **Field Name Consistency**: Firestore rules support both `createdBy` and `ownerId` field names for backward compatibility during field name migration
  - **Testing Infrastructure Added**: Vitest, ESLint, and Prettier recently configured (see `package.json` scripts: `test`, `lint`, `format`)

- **Are there any incomplete components, known edge cases, or areas under active refactor?** 
  
  **Known Technical Debt & TODOs** (from AGENTS.md):
  1. Documentation contains encoding artifacts—needs cleanup in `README.md` and `README2.md`
  2. Accessibility tooling installed (`@axe-core/react`, `jest-axe`) but not yet integrated into development workflow
  3. Storage rules need verification and potential enhancement in `firebase/storage.rules`
  4. Ensure `.env.local` population validation; Firebase init fails silently without proper error handling in some edge cases
  5. Validate that all move creation flows enforce `participants` array presence (access control dependency)
  6. Centralize Mindee/Gemini error handling with retry logic and rate limit backoff
  7. Verify Porcupine model file licensing and implement lazy loading to reduce initial bundle size
  8. Review `vite.config.ts` optimizeDeps forced re-bundle—may slow dev server startup unnecessarily
  9. Some sensitive API key values appear in docs—scrub `docs/development/MindeeOCR/*`
  10. No CI/CD pipeline configured—no GitHub Actions or automated deployment workflows detected
  
  **Areas Under Active Development**:
  - Enhanced planner features (see `src/features/planner-enhanced/` directory)
  - Budget feature refinement (see `src/features/budget/` with 33 items)
  - Products integration feature (see `src/features/products/` - purpose unclear, needs investigation)
  - In-app chat design (see `docs/In App Chat.md`)
  - Timeline and storage features (empty directories in `src/features/timeline/` and `src/features/storage/`)
  
  **Excluded/Deprecated Code** (per `tsconfig.json`):
  - `src/components/common/**`
  - `src/components/design-system/**`
  - `src/components/search/**`
  - `src/features/planner-enhanced/services/**`
  - `src/features/planner-enhanced/components/**`
  - `src/features/budget/**`
  - `src/features/settings/components/DynamicBentoGrid.tsx`
  - `src/features/settings/components/TruckLayoutVisualization.tsx`
  - `src/features/settings/pages/DashboardPage.tsx`

**AREAS TO IGNORE**

- **Are there specific file paths or directories that aren't relevant?** 
  
  **Excluded from TypeScript Compilation** (defined in `tsconfig.json`):
  - `dist/` - Build output directory
  - `node_modules/` - Third-party dependencies
  - `docs/**` - Documentation files (not part of application code)
  - `src/components/common/**` - Deprecated common components
  - `src/components/design-system/**` - Deprecated design system components
  - `src/components/search/**` - Deprecated search components
  - `src/features/planner-enhanced/services/**` - Legacy planner services
  - `src/features/planner-enhanced/components/**` - Legacy planner components
  - `src/features/budget/**` - Under major refactor, excluded from type checking
  - `src/features/settings/components/DynamicBentoGrid.tsx` - Deprecated component
  - `src/features/settings/components/TruckLayoutVisualization.tsx` - Deprecated component
  - `src/features/settings/pages/DashboardPage.tsx` - Under refactor
  
  **Empty/Placeholder Directories** (no implementation yet):
  - `src/features/moves/` - Empty directory
  - `src/features/storage/` - Empty directory
  - `src/features/timeline/` - Empty directory
  - `docs/assets/` - Empty directory for future screenshots
  
  **User Workspace Files** (not part of application):
  - `user-notes/` - Developer scratchpads and notes
  - `ConsoleOutput.md` - Development session output logs
  
  **Configuration/Build Artifacts**:
  - `.env.local` - Local environment variables (gitignored)
  - `.env.example` - Not present in repo (should be added)
  - Any `*.log` files
  - Firebase emulator data directories if present

---

## QUESTIONS FOR REVIEW

*The following items could not be determined from the codebase and require clarification:*

1. **Line 18 (Environment Variables)**: Is there a `.env.example` file that should be created as a template? Currently not found in repository.

2. **Line N/A (Business Context)**: Are there any GDPR, CCPA, or other privacy regulation compliance requirements beyond basic Firebase Auth?

3. **Line N/A (External Systems)**: Is there a specific Vercel project name/URL for production deployment?

4. **Line N/A (Domain Knowledge)**: What is the purpose of the `src/features/products/` directory (8 items)? Is this for moving supplies/products marketplace?

5. **Line N/A (Architecture)**: Is there a plan for the empty `src/features/timeline/`, `src/features/storage/`, and `src/features/moves/` directories?

6. **Line N/A (Tech Debt)**: What is the timeline/priority for the 10 known TODOs listed in AGENTS.md?

7. **Line N/A (Testing)**: Are there existing test files? Testing infrastructure is configured but no test execution results or test files were examined.

8. **Line N/A (CI/CD)**: Is there a planned CI/CD pipeline? Currently no GitHub Actions or automation detected.

9. **Line N/A (Licensing)**: What license is this project under? No LICENSE file found in repository.

10. **Line N/A (Business Context)**: What are the user/usage metrics or scale expectations (concurrent users, moves per month, etc.)?
