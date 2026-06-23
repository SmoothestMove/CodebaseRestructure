# Codebase Audit & Consolidation Report

This report summarizes the actions taken during the codebase audit and consolidation process.

## 1. Actions Taken

### 📂 Archived Files
Moved to `/inbox/Archive/`:
- `FeatureInfo.txt` (Duplicate/Outdated marketing content)
- `user-notes/BugFixes.md` (Empty template duplicate)
- `user-notes/NewFeatures.md` (Empty template duplicate)
- `user-notes/NotesTemplate.md` (Duplicate of `user-notes/templates/`)
- `user-notes/TechSpecTemplate.md` (Duplicate)
- `user-notes/Interface-Experience.md` (Outdated duplicate)
- `docs/master-documentation/02-frontend-developer-guide.md` (Consolidated into `developer-guide.md`)
- `docs/master-documentation/03-backend-platform.md` (Consolidated into `developer-guide.md`)
- `docs/master-documentation/04-new-member-onboarding.md` (Consolidated into `developer-guide.md`)
- `docs/master-documentation/05-ai-agent-context.md` (Consolidated into `developer-guide.md`)

### 🗑️ Removed Files
Moved to `/inbox/Remove/` (Marked for deletion):
- `ConsoleOutput.md` (Junk/Log file)
- `docs/development/consoleoutput.md` (Junk/Log file)

### 🔄 Consolidated Documentation
- **Target:** `docs/developer-guide.md`
- **Sources:**
  - `docs/DevDoc.md` (Renamed base file)
  - `docs/master-documentation/02-frontend-developer-guide.md`
  - `docs/master-documentation/03-backend-platform.md`
  - `docs/master-documentation/04-new-member-onboarding.md`
  - `docs/master-documentation/05-ai-agent-context.md`
- **Result:** A single, comprehensive developer guide covering frontend, backend, AI context, and onboarding.

### ✏️ Renamed Files & Standardization
Applied `kebab-case` naming convention to all files in `docs/` and `user-notes/`.
Key renames:
- `docs/DevDoc.md` → `docs/developer-guide.md`
- `docs/smooth_moves_branding_bible.md` → `docs/branding-bible.md`
- `docs/design/SmoothMovesBrandGuide.md` → `docs/design/brand-guide.md`
- `docs/Master_Documentation/` → `docs/master-documentation/`
- `docs/DataExportTemplates/` → `docs/data-export-templates/`
- `docs/development/MindeeOCR/` → `docs/development/mindee-ocr/`

### 🔗 Reference Updates
- Updated internal links in `README.md`, `AGENTS.md`, and `docs/developer-guide.md` to point to the new file paths (e.g., `mindee-ocr`, `developer-guide.md`).

## 2. Flagged Items (Requires Human Review)

### 🚩 Documentation in Source Tree
The following documentation files were found inside `src/`. Per instructions, these were **not moved** autonomously but are recommended for relocation to `docs/`:

- `src/claude.md` → Recommend move to `docs/development/claude.md`
- `src/features/budget/ReceiptScanning.md` → Recommend move to `docs/features/budget/receipt-scanning.md`
- `src/features/budget/components/SetupBudgetModalAdditions.md`
- `src/features/marvin/MarvinManual.md`
- `src/features/marvin/ElevenLabsVoice.md`
- `src/features/planner-enhanced/docs/FIREBASE_INTEGRATION.md`
- `src/features/planner-enhanced/docs/PHASE_4_SUMMARY.md`

### 🚩 Ambiguous / Broken References
- `docs/project-management/open-planning.md` references `docs/planForResponsiveUIDesign.md`, which does not exist. (See `BROKEN_REFERENCES.md`)

## 3. Final File Map
See `file_map.md` in the root directory for the complete inventory of the repository in its current state.
