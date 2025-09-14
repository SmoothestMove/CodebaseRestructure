# Smooth Moves — Risk/To-Do Implementation Plan

This plan implements the 10 Known risks / TODOs from AGENTS.md in a prioritized, non‑breaking sequence. Changes focus on security and correctness first, then reliability/performance, then developer experience and documentation.

## Guiding principles
- Do not break app startup or core flows.
- Gate optional features (Gemini/Mindee/Porcupine) behind presence checks.
- Prefer documentation/config changes over code where possible.
- Validate via local commands/emulators; deploy only after verification.

---

## Priority 1 — Security & Secrets

### 1) Scrub sensitive keys from docs (AGENTS.md #4)
- Goal: Ensure no real API keys under `docs/development/MindeeOCR/*`.
- Key actions:
  - Replace any literal keys with placeholders (e.g., `VITE_MINDEE_API_KEY=YOUR_KEY`).
  - Add a short README note pointing to `.env.local` for real keys.
  - Add (or update) `.gitignore` in that folder for local samples.
- Touch points: `docs/development/MindeeOCR/*`.
- Validation: Code search shows no key-shaped strings; docs remain readable.
- Risk/rollback: Minimal; text-only changes.

### 2) Add Firebase Storage rules (AGENTS.md #5)
- Goal: Define least-privilege `firebase/storage.rules` and reference in `firebase/firebase.json`.
- Key actions:
  - Create `firebase/storage.rules` mirroring Firestore access patterns (creator/participants allowed in move-scoped paths).
  - Permit public read for static/public assets if required; restrict writes to authenticated users appropriately.
  - Update `firebase/firebase.json` to point to the rules file.
- Touch points: `firebase/storage.rules`, `firebase/firebase.json`.
- Validation: Emulator or rules dry-run; confirm Hosting unaffected.
- Risk/rollback: Low; only effective after deploy.

### 3) Add env example and runtime guards (AGENTS.md #6)
- Goal: Prevent runtime init without required env; improve onboarding.
- Key actions:
  - Add `.env.example` with all `VITE_*` keys.
  - In `src/lib/config/constants.tsx`, assert required envs and provide friendly error messages.
  - Soft-gate optional features (Gemini/Mindee/Porcupine) with presence checks to avoid boot failure.
- Touch points: `.env.example`, `src/lib/config/constants.tsx`, `src/main.tsx`.
- Validation: App shows clear error when missing keys; boots when provided.
- Risk/rollback: Low; guards only.

### 4) Enforce participants in Firestore rules (AGENTS.md #7)
- Goal: Ensure rules don’t assume `participants` and creation enforces it.
- Key actions:
  - Update `firebase/firestore.rules` to check for `participants` existence and membership on create/update.
  - Ensure client creation flows include `participants` array.
- Touch points: `firebase/firestore.rules`.
- Validation: Emulator tests for allow/deny cases.
- Risk/rollback: Medium; coordinate with creation flows.

---

## Priority 2 — Reliability & Performance

### 5) Centralize API retries/backoff (AGENTS.md #8)
- Goal: Stabilize Mindee/Gemini integrations against 429/5xx.
- Key actions:
  - Add utility with exponential backoff + jitter, max attempts, and abort support.
  - Use wrapper in MARVIN and OCR services.
- Touch points: `src/lib/api/retry.ts` (new) and service call sites.
- Validation: Unit tests for retry logic; manual test with simulated failures.
- Risk/rollback: Low; incremental adoption.

### 6) Verify Porcupine licensing and lazy load (AGENTS.md #9)
- Goal: Ensure proper license usage and avoid heavy startup cost.
- Key actions:
  - Document license/source of model files.
  - Defer loading models until wake-word is enabled; dynamic import and capability check.
- Touch points: `public/*porcupine*`, MARVIN wake-word/init paths.
- Validation: App boots without models; feature works when toggled.
- Risk/rollback: Low; feature-gated.

### 7) Review Vite optimizeDeps configuration (AGENTS.md #10)
- Goal: Avoid unnecessary re-bundles during dev.
- Key actions:
  - Inspect `vite.config.ts` for forced includes/excludes.
  - Trim to minimal necessary; benchmark dev server start time.
- Touch points: `vite.config.ts`.
- Validation: `npm run dev` start time improves or remains stable; HMR OK.
- Risk/rollback: Low; config-only.

---

## Priority 3 — Developer Experience & Hygiene

### 8) Remove or fix `npm start` (AGENTS.md #1)
- Goal: Eliminate confusion from missing `server.cjs`.
- Key actions:
  - Remove `start` script or replace with `vite preview` alias.
  - Align README instructions with supported scripts.
- Touch points: `package.json`, `README.md`.
- Validation: `npm run` shows accurate scripts; preview works.
- Risk/rollback: Low.

### 9) Add ESLint, Prettier, Jest, CI hooks (AGENTS.md #3)
- Goal: Establish light quality gates without blocking dev.
- Key actions:
  - Add config files and scripts: `lint`, `format`, `test`.
  - Use lenient rules initially; no autofix on CI.
  - Add GitHub Actions workflow to run lint/test on PR.
- Touch points: `package.json`, `.eslintrc.*`, `.prettierrc`, `jest.config.*`, `.github/workflows/ci.yml`.
- Validation: `npm run lint` and `npm run test` succeed locally.
- Risk/rollback: Medium-low; keep non-blocking at first.

### 10) Clean README encoding artifacts (AGENTS.md #2)
- Goal: Improve docs readability.
- Key actions:
  - Fix encoding artifacts in `README.md` and `README2.md`.
  - Ensure consistent markdown and headings.
- Touch points: `README.md`, `README2.md`.
- Validation: Renders correctly in editor/GitHub preview.
- Risk/rollback: None.

---

## Execution order and checkpoints
1. Scrub keys in docs
2. Add Storage rules + link in firebase.json
3. Add `.env.example` + runtime guards
4. Enforce participants in rules (verify creation flows)
5. Centralize retries/backoff; migrate MARVIN/OCR calls
6. Porcupine: license note + lazy-load
7. Optimize Vite `optimizeDeps` only if needed
8. Remove/fix `npm start`
9. Add ESLint/Prettier/Jest + CI (lenient)
10. Clean README artifacts

## Rollback strategy
- Config-only changes (rules, Vite, scripts) are reversible by restoring prior files.
- Feature gates ensure optional features don’t block boot; can disable gates if needed.
- Documentation edits are non-destructive; keep previous versions in VCS history.

## Acceptance criteria (non-breaking)
- App builds and runs via `npm run dev` before/after each change.
- No runtime crashes due to missing env keys; clear guidance shown instead.
- Security: Storage + Firestore rules align with access contracts; no public writes.
- Integrations: Resilient to transient errors; no unbounded retries.
- DX: `npm run` scripts are accurate; lint/test/CI available but not blocking progress.

