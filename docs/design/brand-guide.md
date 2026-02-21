# Smooth Moves Brand Guide

## Purpose
This document aligns product, marketing, and support teams on how to represent the Smooth Moves brand consistently across product UI, marketing collateral, and partner communications.

## Brand Foundation
- **Mission**: Give households and organizers one calm, coordinated command center for every stage of a residential move.
- **Promise**: Replace scattered checklists and guesswork with clarity, accountability, and timely nudges.
- **Personality**: Confident, empathetic, collaborative, quietly upbeat.
- **Audience Pillars**:
  - Households coordinating complex moves together.
  - Professional organizers and relocation assistants.
  - Frequent movers who need a reusable system.

## Voice & Messaging
- **Tone**: Warm expertise. Lead with solutions, avoid fear or hype.
- **Linguistic Traits**: Actionable verbs, plain-language explanations, short sentences.
- **Tagline Starter**: "Because moving is stressful enough." Reserve for high-level hero areas only.
- **Writing Patterns**:
  - Begin with outcomes, then explain how the product makes them possible.
  - Use supportive second-person voice ("You can", "Your team") to emphasize partnership.
  - Call attention to MARVIN as an assistant, not a replacement for human judgment.
- **Do**: "Label boxes once, trace them forever." **Don't**: "Never lose a box again." (Avoid absolutes.)

## Visual Identity
- **Logo**: Use `IconSmoothMovesLogo` (`src/lib/config/constants.tsx:161`). Maintain clear space equal to the height of the logomark around all edges. Never recolor the mark; place on brand primary (#1e3a5f) or neutral-50 backgrounds.
- **Color System** (source: `tailwind.config.ts`, `src/styles/design-tokens.css`):
  - Primary: #1e3a5f (dark mode #1e293b)
  - Primary Dark: #162b45
  - Secondary: #708090 (dark mode #475569)
  - Tertiary / CTA: #ff7e00 (dark mode #f97316)
  - Accent: #e1a95f (dark mode #eab308)
  - Neutral ramp: 50 #f8fafc -> 900 #0f172a
  - Semantic: Success #22c55e, Warning #f59e0b, Error #ef4444, Info #3b82f6
- **Usage Rules**:
  - Reserve Tertiary for primary CTAs and focal highlights.
  - Use Secondary for supporting navigation and data strokes.
  - Accent is best for progress states, budget totals, and highlight cards.
  - Maintain WCAG AA contrast for text/icon overlays; pair orange (#ff7e00) with white text only on surfaces darker than #334155.
- **Gradients & Overlays**: Planner gradient (`.planner-gradient-bg`) blends neutral-900 -> neutral-800; reuse for hero backgrounds and high-level dashboards.

## Typography
- **Primary Typeface**: Inter (with system fallbacks); declared globally (`src/styles/globals.css:4`).
- **Style Set** (align with in-product presets):
  - **Title**: Inter ExtraBold 48-56 px, line height 110%, tracking -1%; hero headlines and marketing hero copy.
  - **Subtitle**: Inter Semibold 28-32 px, line height 120%; supporting statements directly beneath a Title.
  - **Heading**: Inter Semibold 24-28 px, line height 120%; primary headers inside product surfaces and documentation.
  - **Subheading**: Inter Medium 20-22 px, line height 125%; secondary headers, card titles, and modal headings.
  - **Section header**: Inter Medium 18-20 px, uppercase disabled; apply letter-spacing +2% when additional separation is needed.
  - **Body**: Inter Regular 16 px, line height 150%; default copy size across product and marketing surfaces.
  - **Quote**: Inter Medium 16-18 px, line height 150%; use italics only for direct quotations, paired with an accent rule or quotation marks.
  - **Caption**: Inter Medium 12-14 px, line height 140%; annotations, helper text, figure labels, and legal copy.
- **Styling Principles**:
  - Use letter-spacing adjustments instead of full uppercase for emphasis whenever possible.
  - Reserve italics for the Quote style; rely on weight and color contrast elsewhere.
  - In dark mode keep body copy at neutral-100 (#f8fafc) minimum contrast against background values.

## Iconography & Illustration
- **Icon Sources**: Custom React SVGs in `src/lib/config/constants.tsx` and Lucide/React Icons. Favor outline icons with 1.5-1.8 px strokes and rounded joins.
- **Usage**:
  - Align icons to an 18-24 px bounding box.
  - Combine icons with concise labels; avoid icon-only navigation except for mobile quick actions.
  - Maintain consistent stroke style per surface (do not mix solid and outline in the same cluster).
- **Illustrations & Overlays**:
  - Use muted photography of packing, planning, or shared workspaces.
  - Apply navy or slate gradient overlays at 45-60% opacity to keep text legible and brand colors prominent (`.glassmorphism`, `planner-card`).

## UI Components
- **Buttons** (`src/components/common/Button/index.tsx`):
  - Primary variant uses Tertiary background; keep min touch target 44 px.
  - Secondary variant relies on Secondary color; ensure focus ring remains visible on dark backgrounds.
  - Ghost variant only for tertiary actions within dense lists or cards.
- **Navigation** (`src/components/layout/Header/index.tsx`):
  - Desktop: Keep icon+label pairs with even spacing; highlight active route using Tertiary background + white text.
  - Mobile: Maintain category rail with elevated scan action; do not replace the central CTA color.
- **Cards & Panels** (`src/styles/components.css`):
  - Use translucent navy backgrounds with subtle borders (rgba neutrals) for depth.
  - Hover states elevate via accent border and soft shadow; keep motion under 150 ms.
- **Badges & Status**: Match semantic colors listed above; text always white or neutral-50.

## Motion & Interaction
- **Keyframes** (`tailwind.config.ts`): fade-in, fade-out, slide-up, pulse-bg-once, scan-line. Use motion sparingly to reinforce state changes (success, loading, scanning).
- **Philosophy**: Functional motion first. Animation durations 200-300 ms easing ease-out for entrances, ease-in for exits.
- **Accessibility**: Follow `shouldReduceMotion()` logic (see Button component). Always check prefers-reduced-motion before triggering looping animation.

## Imagery & Media Guidelines
- **Themes**: Moving day preparation, collaborative planning, organized spaces, receipts and budgeting scenes.
- **Color Treatment**: Cool shadows with warm highlights; align with palette by sampling from Primary and Accent tones.
- **Composition**: Leave top-left or bottom-right negative space for copy and overlays. Prioritize lifestyle shots that feel candid, not staged.
- **Video**: Include branded lower thirds with Primary background and white text; CTA buttons should mirror product UI style.

## Accessibility & Inclusivity
- Maintain minimum AA contrast using the neutral ramp for backgrounds and text.
- Preserve focus outlines and ring styles defined in `utilities.css` for web and app parity.
- Provide alt text describing function rather than appearance ("Button to add new box" vs. "Orange button").
- Represent diverse households and helpers in imagery (age, family structure, mobility).

## Implementation Checklist
- Source of truth for tokens: `src/styles/design-tokens.css`. Sync any updates into Tailwind config and Figma.
- Ensure marketing assets reference the same hex values; avoid exporting color variants from secondary tools.
- When introducing new UI components, map variants to existing tokens before creating new colors or spacings.

## Governance
- **Owners**: Product Design leads maintain this guide; Marketing collaborates on messaging updates.
- **Review Cadence**: Quarterly or alongside major launch phases.
- **Change Process**: Document proposals in `docs/design/` with before/after visuals; secure approval from design and product leads prior to implementation.

## Quick Reference
- Primary Hex: #1e3a5f / Dark #1e293b
- CTA Hex: #ff7e00 / Dark #f97316
- Accent Hex: #e1a95f / Dark #eab308
- Typeface: Inter (Google Fonts)
- Logotype Asset: `IconSmoothMovesLogo`
- Motion Defaults: 200-300 ms, ease-out








