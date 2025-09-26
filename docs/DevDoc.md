# Smooth Moves Developer Guide

## Purpose & Audience
- Single-stop technical reference for onboarding and day-to-day development on Smooth Moves.
- Integrates repo structure, local workflows, IDE context, and AI tooling notes (Codex CLI, Gemini MARVIN assistant).

## Product Scope
- Moving project cockpit: boxes with QR tracking, owners/spaces assignments, planner, calendar, budgeting, MARVIN AI assistant.
- Mobile-first React + Firebase SPA; authenticated users manage move-scoped data in Firestore.

## Architecture & Stack
- UI: React 19.1 + TypeScript 5.7, TailwindCSS 4.1, React Router DOM 7.6, @hello-pangea/dnd, framer-motion, recharts, react-toastify, jspdf, lucide-react, uuid.
- Build tooling: Vite 6.2 with path alias `@/* -> ./src/*`, strict TS config (`tsconfig.json`).
- Backend services: Firebase Auth, Firestore, Storage; hosting via Vercel (static) with optional Firebase Hosting config.
- AI & integrations: Google Gemini (MARVIN assistant), Mindee Receipt OCR, Picovoice Porcupine wake word models stored under `public/`.

## Repository Map
- `index.html` - Vite entry point; root mounting.
- `vite.config.ts` - Vite + path aliases; inspect when adding new aliases or optimizeDeps tweaks.
- `tsconfig.json` - Strict TS settings and path mapping for `@` alias.
- `package.json` - Scripts (`dev`, `build`, `preview`, `start`, `deploy` placeholder) and dependencies.
- `public/` - Static assets (QR icons, Porcupine wake word models, favicon).
- `firebase/` - Hosting config (`firebase.json`), Firestore rules/indexes, storage rules.
- `src/` - App source:
  - `main.tsx` bootstraps React, providers, Firebase init using env vars.
  - `App.tsx` defines router/layout shell.
  - `lib/` utilities + config (`lib/config/constants.tsx` handles env ingestion).
  - `hooks/` shared hooks (theme, debounce, localStorage, long press).
  - `components/` UI primitives/layout.
  - `features/` domain modules: `auth`, `boxes`, `owners`, `budget`, `calendar`, `planner`, `marvin`.
- `docs/` - Design, PM, deployment, development, and assistant integration notes (see References section).
- `user-notes/` - Dev scratchpads (e.g., `BugFixes.md`).

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

## Testing & Quality Gates
- TypeScript strict mode active.
- Accessibility tooling (`@axe-core/react`, `jest-axe`) available but not wired.
- Jest/Vitest integration currently absent; `npm test` is not defined despite README note. Plan to add when wiring automated tests.
- No linting scripts configured; consider introducing ESLint/Prettier to enforce style.

## IDE & Workflow Context
- Current active file: `.gitignore` (check ignored paths when adding new asset directories or env files).
- Open tabs (from IDE snapshot):
  - `ConsoleOutput.md`
  - `user-notes/BugFixes.md`
  - `docs/In App Chat.md`
  - `.gitignore`
- Use these tabs to cross-reference bug backlogs, in-app chat requirements, and command outputs during development sessions.
- Codex CLI usage: run repo commands via provided harness (PowerShell in `d:\codebase\CodebaseRestructure`); prefer `npm` scripts over manual tool invocation.

## AI & Tooling Guidance
- **MARVIN / Gemini**: API key sourced from `VITE_GEMINI_API_KEY`; troubleshooting notes in `docs/development/MARVIN Troubleshooting.md`. MARVIN expects JSON responses; guard against Markdown-wrapped JSON from Gemini.
- **Mindee OCR**: Endpoint `https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict`; see `docs/development/MindeeOCR/` for payload examples and rate-limit considerations.
- **Picovoice Porcupine**: Wake word models located under `public/`; load lazily to limit bundle size and respect licensing.
- **Codex CLI**: Current session runs with full filesystem access and enabled networking. Follow harness instructions; avoid manual `cd` by using `workdir` on commands.

## Developer References
- `README.md` - High-level project intro and scripts.
- `AGENTS.md` - Concise repo overview, invariants, glossary, TODO/Risk backlog.
- `docs/In App Chat.md` - In-app chat design considerations.
- `user-notes/BugFixes.md` - Running list of fixes and action items from developers.
- `docs/development/environment.md` - Detailed env setup instructions.
- `docs/development/MARVIN Troubleshooting.md` - Gemini integration troubleshooting.
- `docs/design/` & `docs/project-management/` - UX flows, planning artifacts.

## Known Risks & Follow-Ups (from `AGENTS.md`)
- Update docs referencing deprecated Express/`npm start` server.
- Clean encoding artifacts in README files.
- Introduce lint/test scripts (ESLint, Prettier, Jest/Vitest) and CI automation.
- Scrub sensitive keys from `docs/development/MindeeOCR/*`.
- Verify `.env.local` completeness to avoid Firebase init failures.
- Ensure participant arrays are enforced when creating move docs.
- Harden Gemini/Mindee integrations with retries/backoff.
- Audit Porcupine model licensing and lazy-load strategy.
- Review `vite.config.ts` optimizeDeps overrides for build performance.

## Workflow Tips
- Commit frequently; repo may start dirty, so avoid reverting changes you did not author.
- When expanding features, keep domain modules (`features/*`) cohesive and favor shared utilities in `lib/`.
- For debugging Firebase security, pair `firebase/firestore.rules` with emulator suite or log outputs before deploying.
- Document new troubleshooting steps under `docs/development/` to keep this guide lightweight.
