Snapshot: Option A pre-alignment (brand tokens)

This folder contains the current, unmodified design token file(s) that would be changed by Option A (aligning TypeScript brand tokens to Tailwind brand colors).

Files
- colors.ts — snapshot of src/components/design-system/foundations/colors.ts before alignment

Restore instructions
1) Copy the snapshot back over the source file:
   - From: docs/snapshots/option-a-prealign/colors.ts
   - To:   src/components/design-system/foundations/colors.ts
2) Rebuild/refresh the app.

Notes
- Tailwind config and CSS variables are not modified in Option A; this snapshot focuses on TypeScript tokens only.

