# Smooth Moves Developer Guide

> **Note:** This file was consolidated from `DevDoc.md`, `02-frontend-developer-guide.md`, `03-backend-platform.md`, `04-new-member-onboarding.md`, and `05-ai-agent-context.md` on 2025-05-15.

## Purpose & Audience
- Single-stop technical reference for onboarding and day-to-day development on Smooth Moves.
- Integrates repo structure, local workflows, IDE context, and AI tooling notes.

## Product Scope
- Moving project cockpit: boxes with QR tracking, owners/spaces assignments, planner, calendar, budgeting, MARVIN AI assistant.
- Mobile-first React + Firebase SPA; authenticated users manage move-scoped data in Firestore.

## Architecture & Stack
- **UI:** React 19.1 + TypeScript 5.7, TailwindCSS 4.1, React Router DOM 7.6.
- **Key Libraries:** @hello-pangea/dnd, framer-motion, recharts, react-toastify, jspdf, lucide-react, uuid.
- **Build tooling:** Vite 6.2 with path alias `@/* -> ./src/*`, strict TS config (`tsconfig.json`).
- **Backend services:** Firebase Auth, Firestore, Storage; hosting via Vercel (static) with optional Firebase Hosting config.
- **AI & integrations:** Google Gemini (MARVIN assistant), Mindee Receipt OCR, Picovoice Porcupine wake word models stored under `public/`.

## Repository Map
- `index.html` - Vite entry point; root mounting.
- `vite.config.ts` - Vite + path aliases; inspect when adding new aliases or optimizeDeps tweaks.
- `tsconfig.json` - Strict TS settings and path mapping for `@` alias.
- `package.json` - Scripts (`dev`, `build`, `preview`, `start`, `deploy`) and dependencies.
- `public/` - Static assets (QR icons, Porcupine wake word models, favicon).
- `firebase/` - Hosting config (`firebase.json`), Firestore rules/indexes, storage rules.
- `src/` - App source:
  - `main.tsx` bootstraps React, providers, Firebase init using env vars.
  - `App.tsx` defines router/layout shell.
  - `lib/` utilities + config (`lib/config/constants.tsx` handles env ingestion).
  - `hooks/` shared hooks (theme, debounce, localStorage, long press).
  - `components/` UI primitives/layout.
  - `features/` domain modules: `auth`, `boxes`, `owners`, `budget`, `calendar`, `planner`, `marvin`.
- `docs/` - Design, PM, deployment, development, and assistant integration notes.
- `user-notes/` - Dev scratchpads.

## Environment & Secrets
1. Copy `.env.example` to `.env.local` and populate Firebase + integration keys.
2. Required keys: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_GEMINI_API_KEY`.
3. Optional keys: `VITE_MINDEE_API_KEY` (budget OCR) and `VITE_PICOVOICE_ACCESS_KEY` (wake word).
4. Validation: `npm run env:verify` (script checks `.env.local` then `.env`).
5. Runtime mapping happens in `src/lib/config/constants.tsx`; missing values should fail fast before Firebase init.

## Day-to-Day Commands
- Install dependencies: `npm install`
- Dev server: `npm run dev` (http://localhost:5173)
- Production build: `npm run build` -> `dist/`
- Preview built assets: `npm run preview` or `npm start`
- Deploy to Vercel: `vercel` (dev) / `vercel --prod`
- Optional env sanity check: `npm run env:verify`

## Data Model & Access Control
- Firestore root `moves/{moveId}` documents own nested collections: `boxes`, `owners`, `calendar_events`, `expenses`, `categories`, `budget`, `planner*` subsets.
- `users/{userId}` stores profiles; `presence/` tracks online status.
- Firestore rules enforce owner/participant access; ensure creation flows populate `participants` arrays.
- Storage rules captured in `firebase/storage.rules` (referenced in `firebase/firebase.json`).

## Frontend Patterns

### State Management
We use **React Context** for managing feature-scoped state.
- Example: `BoxesProvider` wraps the app (or a section) to provide access to box data.
- Usage: `const { boxes, addBox } = useBoxes();`

### Styling
- **Tailwind CSS** is used for all styling.
- Global styles are in `src/index.css`.
- Theme toggling (Dark/Light) is handled via `next-themes` (or similar logic in `useTheme`).

### Routing
- **Protected Routes:** `ProtectedRoute` component checks for an authenticated user before rendering child routes.
- **Layout:** `MainAppLayout` includes the `Navbar` and renders the current page via `<Outlet />`.

### Forms
- `react-hook-form` is used for complex forms (e.g., adding boxes, editing profiles).

## Backend Platform Details
Smooth Moves uses **Firebase** as a serverless backend.

### Collections Structure (Firestore)
```
moves/{moveId}
├── boxes/{boxId}             # Box details (QR code, contents, status)
├── owners/{ownerId}          # People/Rooms assigned to boxes
├── calendar_events/{eventId} # Calendar entries
├── expenses/{expenseId}      # Budget items
├── categories/{categoryId}   # Budget categories
├── budget/{budgetDoc}        # Aggregate budget info
├── plannerTasks/{taskId}     # Tasks for the move
├── plannerTimeframes/{tfId}  # Time groupings for tasks
└── plannerConfig/{configId}  # Planner settings
```

### Security Rules
- **Authentication:** All read/write operations require a valid Firebase Auth user.
- **Move Access:** Access to subcollections of `moves/{moveId}` is restricted to:
  - The creator of the move (`createdBy`).
  - Users listed in the `participants` array of the move document.

## Coding Standards & Patterns

### Codebase Principles
1. **Strict TypeScript:** No `any`. Always define interfaces for props and data models.
2. **Functional Components:** Use React Functional Components with Hooks.
3. **Tailwind CSS:** Use utility classes for styling. Avoid inline styles or separate CSS files unless necessary.
4. **Feature Isolation:** When adding a new feature, keep its components, hooks, and types within `src/features/<feature-name>`.

### Common Patterns
- **Firestore Data Fetching:** Use `useEffect` inside a custom hook to subscribe to Firestore data. Handle `loading` and `error` states.
- **Context Usage:** Prefer small, focused contexts (e.g., `BoxesContext`) over a single global store.
- **Imports:** Use the `@/` alias for imports from `src/`.

### "Gotchas" & Constraints
- **Environment Variables:** Must start with `VITE_`. Accessed via `import.meta.env`.
- **Firebase Auth:** User object might be null initially. Always check `loading` state from `useAuth`.

## AI & Tooling Guidance
- **MARVIN / Gemini**: API key sourced from `VITE_GEMINI_API_KEY`. MARVIN expects JSON responses; guard against Markdown-wrapped JSON from Gemini.
- **Mindee OCR**: Endpoint `https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict`.
- **Picovoice Porcupine**: Wake word models located under `public/`; load lazily.

## Known Risks & Follow-Ups
- Update docs referencing deprecated Express/`npm start` server.
- Clean encoding artifacts in README files.
- Introduce lint/test scripts (ESLint, Prettier, Jest/Vitest) and CI automation.
- Scrub sensitive keys from `docs/development/mindee-ocr/*`.
- Verify `.env.local` completeness to avoid Firebase init failures.
- Ensure participant arrays are enforced when creating move docs.
- Harden Gemini/Mindee integrations with retries/backoff.
- Audit Porcupine model licensing and lazy-load strategy.
- Review `vite.config.ts` optimizeDeps overrides for build performance.
