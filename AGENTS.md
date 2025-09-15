# AGENTS.md

## Project overview
Smooth Moves is a React + TypeScript (Vite) web app for managing residential moves: box tracking with QR codes, owners/spaces assignment, a planner, calendar, budgeting with receipt OCR, and the MARVIN AI assistant integrated with Firebase (Auth, Firestore, Storage). App bootstraps via Vite and initializes Firebase from env-configured values.

## Repo map
- ./index.html — Vite entry HTML
- ./vite.config.ts — Vite config and path alias `@ -> ./src`
- ./tsconfig.json — TS strict config; path mapping
- ./package.json — scripts: dev/build/preview/start/deploy
- ./public/ — static assets (Porcupine wake word models, favicon)
- ./firebase/
  - firebase.json — Hosting config (public: dist, SPA rewrites); Firestore rules/indexes
  - firestore.rules — Firestore security rules
  - firestore.indexes.json — Index definitions
- ./src/
  - main.tsx — App root, initializes Firebase and providers
  - App.tsx — Router and main layout
  - lib/config/constants.tsx — Firebase env mapping, icons, constants
  - lib/ — utils, config, api helpers
  - hooks/ — theme, debounce, localStorage, long press
  - components/ — UI primitives (Radix/Shadcn-style), layout
  - features/
    - auth/ — Auth page, context, guards; Firebase Auth
    - boxes/ — QR code scanning, box CRUD, truck load
    - owners/ — owners/spaces management
    - budget/ — budgeting UI; OCR integration planned
    - calendar/ — calendar views and provider
    - planner/ — task planner
    - marvin/ — AI assistant (Gemini, TTS, wake word)
- ./docs/ — design, PM, OCR integration notes


## Build & run commands
- Install: `npm install`
- Dev server: `npm run dev` (serve at http://localhost:5173)
- Build: `npm run build` (outputs to `dist/`)
- Preview built app: `npm run preview` or `npm start` (vite preview)
- Production hosting: Vercel (build command `npm run build`, output `dist/`)
- Optional: Firebase Hosting config exists for SPA rewrites (`firebase/firebase.json`).

## Test & quality gates
- Unit/e2e: No root test runner configured. `jest-axe` present in devDependencies; no `test` script found.
- Linting: No ESLint/Prettier config at root; TS strict mode enabled (`tsconfig.json`).
- Accessibility: `@axe-core/react` and `jest-axe` installed, usage not wired.
- CI: No CI config detected in repo.

## Code style & conventions
- Languages: TypeScript 5.7, React 19, Vite 6, TailwindCSS 4.
- Module alias: `@/*` -> `./src/*` (Vite + TS paths).
- State/context: React Context providers per domain (auth, boxes, owners, calendar, move).
- Error handling: Promise try/catch around Firebase calls; toasts for UX feedback in UI components.
- Formatting/linting: rely on TS strict and Vite; no explicit linters configured at root.

## Domain glossary
- Move: A top-level Firestore doc representing a relocation project; has participants.
- Box: Item container tracked with QR code, statuses, owner/space assignments.
- Owner/Space: Person or room assignment for boxes.
- Planner: Task management entities for the move (timeframes, tasks, config).
- Budget: Categories, expenses, and totals for move finances; supports OCR ingestion.
- MARVIN: In-app AI assistant (Gemini) with optional wake word (Porcupine).

## Invariants & contracts
- Auth required: All move-scoped data (boxes/owners/calendar/budget/planner) guarded by Firestore rules; access only for creator/owner or listed participants.
- SPA routing: Firebase Hosting rewrites all paths to `/index.html`.
- Env-driven Firebase: App will not initialize without valid `VITE_FIREBASE_*` values.
- Path alias `@` must resolve consistently in Vite and TS.

## External services & APIs
- Firebase: Auth, Firestore, Storage, Hosting
  - Config source: `src/lib/config/constants.tsx`
  - Hosting config: `firebase/firebase.json`
  - Security rules: `firebase/firestore.rules`
  - Storage rules: `firebase/storage.rules` (added)
- Hosting: Vercel for production (static deploy of Vite `dist/`)
- Google Gemini (@google/genai): API key via `VITE_GEMINI_API_KEY`; used in MARVIN feature.
- Mindee Receipt OCR: Endpoint `https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict` (see docs under `docs/development/MindeeOCR/`).
- Picovoice Porcupine: Wake word model files in `public/` for optional voice activation.

## Configuration & env vars
- File: `.env.local` (not committed). Consumed via Vite.
- Keys (required unless noted):
  - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
  - `VITE_GEMINI_API_KEY` (for MARVIN)
  - `VITE_MINDEE_API_KEY` (for receipt OCR)
  - `VITE_PICOVOICE_ACCESS_KEY` (optional; wake word)
- Loading site: `src/lib/config/constants.tsx` reads from `import.meta.env` and sanitizes values.

## Data models & storage
- Firestore collections (see `firebase/firestore.rules`):
  - `moves/{moveId}` — move metadata; participants; createdBy/ownerId
    - `boxes/{boxId}` — box records
    - `owners/{ownerId}` — owners/spaces
    - `calendar_events/{eventId}` — calendar items
    - `expenses/{expenseId}` — budget expenses
    - `categories/{categoryId}` — budget categories
    - `budget/{budgetDoc}` — aggregate budget doc(s)
    - `plannerTasks/{taskId}` — tasks
    - `plannerTimeframes/{timeframeId}` — timeframes
    - `plannerConfig/{configId}` — planner configuration
  - `users/{userId}` — user profile; self-RW + read by authed users
  - `presence/{presenceId}` — online presence; RW by authed users

## Known risks / TODOs
1) Docs reference Express/`npm start` server; start now uses Vite preview — reconcile docs (`README.md`, `src/claude.md`, `docs/development/*`). [In progress]
2) README files show encoding artifacts — clean up for readability (`README.md`, `README2.md`)
3) No `test` or `lint` scripts configured — add ESLint/Prettier/Jest and CI hooks (`package.json`)
4) Sensitive API key values appear in docs — scrub `docs/development/MindeeOCR/*`
5) `firebase/storage.rules` not found — add storage rules and reference in `firebase.json` [Done]
6) Ensure `.env.local` is populated; Firebase init will fail otherwise (`src/main.tsx`, `src/lib/config/constants.tsx`)
7) Access control assumes participants array present — validate creation flows enforce this (`firebase/firestore.rules`)
8) Mindee/Gemini error handling & rate limits — centralize retries/backoff (`docs/development/MindeeOCR/*`, MARVIN services)
9) Large Porcupine model files in `public/` — verify licensing and lazy loading
10) OptimizeDeps forced re-bundle may slow dev — confirm necessity (`vite.config.ts`)
