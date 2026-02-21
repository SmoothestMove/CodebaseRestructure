# Consolidated Open Planning (Non-Redundant)

Owner: Engineering
Status: In progress

## Purpose
One source of truth for pending work distilled from existing plans. Implemented items are acknowledged and omitted from action lists. This keeps focus on what remains.

## Implemented (reference only)
- Registration flow hardening with fallback + clearer errors — implemented in `src/features/auth/pages/AuthPage.tsx`; Firestore rules support creator/ownerId/participants — `firebase/firestore.rules`; plan doc: `docs/planForRegistrationFix.md`.
- Planner, Calendar, Boxes, Owners, MARVIN baseline features present — see routes in `src/App.tsx`.
- Budget + Receipt OCR via Mindee integrated — `src/features/budget/components/ReceiptScanModal.tsx`, `src/features/budget/services/ReceiptScanningService.ts`.
- Design system primitives and animations — `src/components/design-system/*`, `src/components/common/AnimatedList`, `src/components/common/PageTransition`, `src/lib/animations/*`.

## Open Work (grouped, deduplicated)

### A) Tailwind + Styling Consolidation
- Remove Tailwind CDN and inline config from `index.html`; rely on build-time Tailwind only.
- Add repo-level Tailwind config and PostCSS:
  - `tailwind.config.ts` (darkMode class, content includes `index.html` + `src/**/*.{ts,tsx}`)
  - `postcss.config.(cjs|mjs)` with `tailwindcss` + `autoprefixer`
- Single-source tokens: align `src/components/design-system/foundations/*` with CSS vars in `index.css`; document mapping.
- Action source: `docs/planForResponsiveUIDesign.md` (Sections 1, 8, 11)

### B) Responsive UI Enhancements
- Introduce layout primitives (Page, Section, Stack, Grid, Sidebar, BottomNav) and swap ad‑hoc spacing for primitives where missing.
- Adopt container queries for card/table responsiveness; add `.cq` utility and apply in high-density views.
- Mobile-first table→card rendering for narrow screens where tables exist.
- Action source: `docs/planForResponsiveUIDesign.md` (Sections 5–7, 9)

### C) Accessibility & UX Guardrails
- Wire `@axe-core/react` in dev for key pages; add docs for running a11y checks.
- Respect reduced motion across custom animations; confirm focus-visible styles everywhere.
- Action source: `docs/design/ui-ux-implementation-plan.md`, `docs/planForResponsiveUIDesign.md` (Sections 7)

### D) Testing, Linting, CI
- Add ESLint + Prettier with TS/React presets; `npm run lint` script.
- Add basic unit tests (e.g., utilities, reducer logic) and `npm test` script; consider `jest-axe` for a11y assertions.
- Add CI (GitHub Actions) to run typecheck, lint, build, and tests on PRs.
- Action source: repo status; `package.json` lacks these scripts/configs.

### E) Firebase Security & Config
- Add `firebase/storage.rules` and reference it in `firebase/firebase.json` to secure uploads.
- Validate rules around `participants` and ensure creation flows populate required arrays.
- Action source: `firebase/firebase.json`, `firebase/firestore.rules`.

### F) Documentation Hygiene
- Remove outdated Express/server references and align on Vercel hosting in all docs (`src/claude.md`, `src/utils/GEMINI.md`, `docs/development/claude-instructions.md`).
- Scrub any real API keys from Mindee OCR docs and replace with placeholders (`docs/development/mindee-ocr/*`).
- Confirm screenshots paths or move large/unreferenced media to `docs/archive/`.

### G) Build/Perf Tuning
- Revisit `optimizeDeps.force: true` in `vite.config.ts` (can slow dev cold start); only enable when necessary.
- Consider code-splitting heavy routes (charts, calendar) if needed.

### H) Hosting (Vercel)
- Ensure Vercel project config matches: build `npm run build`, output `dist/`, framework preset Vite.
- Add a short DEPLOYMENT.md if helpful (Vercel env var mapping for `VITE_*`).

## Milestones & Validation
- Milestone 1: Styling consolidation complete (Tailwind config, CDN removed); app builds and renders identically.
- Milestone 2: Lint/test/CI green on main features; PR gate enabled.
- Milestone 3: Firebase storage rules finalized; security review passes.
- Milestone 4: Docs aligned; no Express mentions; OCR docs contain no secrets.

## File Pointers
- Styling: `index.html`, `index.css`, `vite.config.ts`
- Tokens/DS: `src/components/design-system/*`, `src/lib/animations/*`
- OCR: `src/features/budget/services/ReceiptScanningService.ts`
- Auth/Move: `src/features/auth/pages/AuthPage.tsx`, `firebase/firestore.rules`
- Docs: `docs/planForResponsiveUIDesign.md`, `docs/design/ui-ux-implementation-plan.md`, `docs/development/mindee-ocr/*`

