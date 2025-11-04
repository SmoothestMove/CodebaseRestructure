Consolidation Plan: Removable Documentation (.md focus)

Scope and criteria
**- User Notes: Lines that are Xed out are safe to remove.Lines that are strikethrough are not safe to remove & do not need to be touched.**

Section: /
-~~ [ ] ConsoleOutput.md — Transient console logs; safe to delete.~~
-~~ [x] LandingPageAnsw.md — Marketing answers for separate site; not used by app. (removed 2025-11-04)~~
-~~ [x] LandingPageQuest.md — Landing page questionnaire template; no longer needed. (removed 2025-11-04)~~
-~~ [x] Pricing.md — Pricing brainstorm; marketing-only, not used by app. (removed 2025-11-04)~~
~~- [ ] sessionjournal.md — Personal session notes; not part of product docs.~~
~~Section: .claude/agents/~~
~~- [ ] .claude/agents/document-writer.md — Internal agent prompt; not needed for the app.~~
~~- [ ] .claude/agents/react-typescript-architect.md — Internal agent prompt; not needed for the app.~~
~~- [ ] .claude/agents/strategic-planner.md — Internal agent prompt; not needed for the app.~~
~~- [ ] .claude/agents/ui-ux-tailwind-specialist.md — Internal agent prompt; not needed for the app.~~
~~- [ ] .claude/agents/web-research-specialist.md — Internal agent prompt; not needed for the app.~~
 Section: App Chat/
-~~ [x] App Chat/CHANGELOG.md — Demo app docs; unrelated to this codebase. (removed 2025-11-04)~~
-~~ [x] App Chat/NEXT_JS.md — Demo app integration guide; unrelated to this app. (removed 2025-11-04)~~
-~~ [x] App Chat/README.md — Demo app readme; unrelated to this app. (removed 2025-11-04)~~

Section: docs/
-~~ [x] docs/In App Chat.md — CometChat notes; unrelated to this Vite app. (removed 2025-11-04)~~
~~- [ ] docs/claude/claude-session-template.md — Assistant template; not needed in repo.~~
~~- [ ] docs/development/consoleoutput.md — Raw console error logs; transient.~~
-~~ [x] docs/development/ExternalPlannerPlan.md — Marked "PROJECT COMPLETE - 100% INTEGRATED"; safe to remove. (removed 2025-11-04)~~
-~~ [x] docs/development/TestingValidationResults.md — Testing results marked complete; archival only. (removed 2025-11-04)~~
~~- [ ] docs/development/claude-instructions.md — Redundant with `docs/DevDoc.md` and README; remove to reduce duplication.~~
~~- [ ] docs/development/codebase-structure.md — Outdated/misleading structure; superseded by `docs/DevDoc.md`.~~
-~~ [x] docs/design/LandingPageChanges.md — For separate `landing-page/` project; not relevant here. (removed 2025-11-04)~~
-~~ [x] docs/design/LogoGenPrompt.md — Prompt brainstorm; not needed post-branding. (removed 2025-11-04)~~
-~~ [x] docs/design/MARVIN Color and Icon Selection.md — Decisions encoded in Tailwind/theme; exploratory doc no longer needed. (removed 2025-11-04)~~
-~~ [x] docs/design/UserNotes.md — Personal notes; safe to remove. (removed 2025-11-04)~~
-~~ [x] docs/design/UserNotes2.md — Empty/placeholder; safe to remove. (removed 2025-11-04)~~
-~~ [x] docs/project-management/ChecklistTimeline.md — PM checklist; not required for codebase. (removed 2025-11-04)~~
- [ ] docs/project-management/FeatureData.md — Research/PM notes; not required for codebase.
- [ ] docs/project-management/MovePlannerChecklist.md — PM checklist; not required for codebase.
~~- [ ] docs/project-management/Open-Planning.md — Planning scratchpad; not required for codebase.~~
-~~ [x] docs/project-management/PlannerDesign.md — Superseded by implemented planner; safe to remove. (removed 2025-11-04)~~
-~~ [x] docs/project-management/Responses.md — Q&A planning notes; not required for codebase. (removed 2025-11-04)~~
-~~ [x] docs/snapshots/option-a-prealign/README.md — Snapshot doc for pre-alignment; no longer needed. (removed 2025-11-04)~~
-~~ [x] docs/planForRegistrationFix.md — Registration guard/permission fixes shipped; plan no longer required. (removed 2025-11-04)~~
-~~ [x] docs/planForResponsiveUIDesign.md — Superseded by `docs/design/UI-UX-Implementation-Plan.md`. (removed 2025-11-04)~~

Section: landing-page/
-~~ [x] landing-page/README.md — Separate Next.js template readme; remove with that project if unused. (removed 2025-11-04)~~

~~ Section: user-notes/ ~~
~~- [ ] user-notes/BugFixes.md — Personal scratchpad; safe to remove.~~
~~- [ ] user-notes/Interface-Experience.md — Personal notes; safe to remove.~~
~~- [ ] user-notes/NewFeatures.md — Personal ideas; safe to remove.~~
~~- [ ] user-notes/NotesTemplate.md — Personal template; safe to remove.~~
~~- [ ] user-notes/TechSpecCascade.md — Internal spec draft; safe to remove.~~
~~- [ ] user-notes/TechSpecCodex.md — Internal spec draft; safe to remove.~~
~~- [ ] user-notes/TechSpecTemplate.md — Internal template; safe to remove.~~

Notes
- Keep core references: `README.md`, `AGENTS.md`, `.github/workflows/ci.yml`, `.eslintrc.cjs`, `.prettierrc.json`, `docs/DevDoc.md`, `docs/deployment/*`, `docs/development/environment.md`, `docs/design/Developer-Design-Guide.md`, `docs/design/SmoothMovesBrandGuide.md`, `docs/design/UI-UX-Implementation-Plan.md`, and feature/user-facing docs still in active use.
- Mindee OCR docs: keep `docs/development/MindeeOCR/*` if OCR integration remains planned/in-progress.
- Owners/Spaces and RevisionPlan: keep `OWNERS_SPACES_SEPARATION.md` and `RevisionPlan.md` as they track ongoing work.
