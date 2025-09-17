# Smooth Moves Revision Plan (Consolidated)

**Last Updated:** 2025-09-16

## Scope
- Consolidates the outstanding work from the former ImplementationPlan.md, RootFilesAnalysis.md, OWNERS_SPACES_SEPARATION.md, and LandingPageQuest.md documents.
- Tracks only items that still require action; completed deliverables were archived or removed on this date.
- Each item notes its origin so we can cross-reference historical context if needed.

## Active Backlog

### Low Risk

#### Vite OptimizeDeps Audit
- **Status:** Not started
- **What:** Revisit the unconditional `optimizeDeps.force = true` setting in `vite.config.ts`; profile whether it is still required or if it slows local HMR unnecessarily.
- **Next steps:** Document benchmarking results; revert if no longer needed.
- **Sources:** ImplementationPlan - Priority 2.7.

#### README Encoding Verification
- **Status:** Needs review
- **What:** Re-run doc QA (`README.md`, `README2.md`) to ensure prior encoding artifacts remain resolved; ImplementationPlan flagged this but current copies look cleaned; confirm before closing.
- **Sources:** ImplementationPlan - Priority 3.10.

#### CSS Architecture Consolidation
- **Status:** Not started
- **What:** Extract inline styles from `index.html`, split `index.css` into a structured `src/styles/` hierarchy (globals, components, utilities, tokens, themes), and dedupe overlapping declarations.
- **Benefit:** Improves maintainability and long-term theming flexibility.
- **Sources:** RootFilesAnalysis - Medium Priority (CSS Organization).

#### Debug Log Handling
- **Status:** Not started
- **What:** Delete `pglite-debug.log` (currently empty) and add it (or the generating tool) to `.gitignore` if further logs may appear.
- **Sources:** RootFilesAnalysis - Low Priority.

#### Landing Page Discovery (Client Intake)
- **Status:** Not started
- **What:** Complete the questionnaire in `LandingPageQuest.md` so copy/design work for the marketing site can proceed; transfer answers into the marketing brief once gathered.
- **Sources:** `LandingPageQuest.md`.

### Medium Risk

#### Environment File Parity & Tooling
- **Status:** Not started
- **What:** Create a documented folder or README callout describing the environment file strategy; ensure `.env.local` stays gitignored; consider adding scripts/checks that validate required vars in CI.
- **Dependency:** Complements the high-risk env hardening work; can ship in the same PR.
- **Sources:** RootFilesAnalysis - Medium Priority.

#### API Resilience Utilities
- **Status:** Not started
- **What:** Implement a shared retry/backoff helper (exponential + jitter, abort support) and update MARVIN + Mindee integrations to use it; add targeted tests around the utility.
- **Risk driver:** Avoid unbounded retries to stay within external vendor rate limits.
- **Sources:** ImplementationPlan - Priority 2.5.

#### Porcupine Integration Review
- **Status:** Not started
- **What:** Confirm licensing/distribution requirements for the Porcupine model files in `public/` and lazy-load the engine/models only after the wake-word toggle is enabled (for example via dynamic import).
- **Observation:** Current `wakeWordService` imports `@picovoice/porcupine-web` eagerly.
- **Sources:** ImplementationPlan - Priority 2.6.

#### Owners vs Spaces Migration (Phases 2-4)
- **Status:** In progress
- **Phase 2 - Component Adoption:** Update DynamicBentoGrid, TruckLayoutVisualization, owner/space selectors, and dashboard stats to use the new adapter/hook, replacing legacy string checks with type guards.
- **Phase 3 - Data Layer:** Retrofit `ownerService` (and related persistence) to emit separated types and migrate any localStorage or Firestore code that still relies on the legacy schema.
- **Phase 4 - Cleanup:** Remove superseded components/utilities and deprecate the legacy `Owner` interface once adoption is complete.
- **Sources:** OWNERS_SPACES_SEPARATION.md - Phase 2-4.

### High Risk

#### Environment & Secrets Hygiene
- **Status:** Not started
- **What:** Provide a checked-in `.env.example`, document the expected `VITE_*` keys, and add runtime guards in `src/lib/config/constants.tsx` (and related bootstrapping) so the app fails fast with actionable errors when keys are missing.
- **Related cleanup:** Expand the documented environment matrix (`.env`, `.env.local`, etc.) per RootFilesAnalysis.
- **Sources:** ImplementationPlan - Priority 1.3, RootFilesAnalysis - Medium Priority (Environment Configuration Files).

## Items Removed on 2025-09-16
- `ENHANCED_CLEAR_DATA_IMPLEMENTATION.md`
- `IMPLEMENTATION_COMPLETE.md`
- Historical plan content from the prior RevisionPlan.md has been superseded by this consolidated backlog.

## Conflicts Pending Review
- ImplementationPlan.md still lists tasks 2, 8, and 9 as upcoming, yet the repository already contains `firebase/storage.rules`, a `package.json` start script that uses `vite preview`, and lint/test/CI tooling. Please confirm whether these should be formally marked complete or if additional follow-up is still desired.
- ImplementationPlan.md Priority 1 item (sensitive key scrubbing) appears satisfied - current docs show placeholders only. Confirmation is needed before we strike it from the backlog.


