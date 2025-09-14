# Plan for Responsive UI Design (Mobile-First)

Owner: Cascade
Date: 2025-09-06
Status: Draft

## 1) Current State Analysis

Sources reviewed:
- `index.html` (Tailwind CDN usage with inline `tailwind.config` override; custom styles; meta viewport OK)
- `index.css` (Tailwind `@tailwind` directives + custom CSS variables, dark mode via `.dark` class, planner-specific classes)
- `src/App.tsx` and `src/main.tsx` (layout scaffolding, providers, container paddings)
- `src/components/design-system/` foundations and `src/components/ui/` (shadcn/radix style primitives)

Findings:
- Tailwind is included twice:
  - Build-time via `index.css` using Tailwind v4 (`@tailwind base/components/utilities`) in the Vite pipeline
  - Runtime via CDN in `index.html` with a JS `tailwind.config` object
  - Risk: larger bundle, conflicting configs, no deterministic purging/JIT, harder theming consistency.
- Design tokens exist in two places:
  - CSS custom properties in `index.css` under `:root` (brand/semantic/neutral)
  - TS token files under `src/components/design-system/foundations/` (colors/spacing/typography/shadows)
  - Risk: Divergence over time. Tokens should be single-sourced and projected to both CSS and TS.
- Dark mode strategy is class-based (`dark`), consistently used in `index.html` and custom selectors in `index.css`.
- Layout patterns:
  - `container mx-auto px-4 sm:px-6 lg:px-8` used in `src/App.tsx` with `md:pl-64` (implies left sidebar on md+).
  - Mobile awareness present: `md:hidden` spacer for a mobile bottom nav, but bottom nav implementation appears elsewhere; ensure presence and consistency.
- Component library:
  - `src/components/ui/` includes shadcn-style primitives (dialog/drawer/sheet/sidebar/tabs/forms/etc.) suitable for responsive composition.
  - Some planner-specific custom classes (e.g., `.planner-card`, `.task-card`) are desktop-biased (fixed borders, shadows) without explicit mobile density variants.

Gaps and opportunities:
- Consolidate Tailwind config to build-time only; remove CDN. Add a root `tailwind.config.ts` and `postcss.config.cjs/mjs` using Tailwind v4 conventions.
- Define a clear, mobile-first responsive scale for spacing, typography, containers.
- Introduce fluid typography and spacing via `clamp(...)` with Tailwind plugin or custom utilities.
- Adopt container queries for component-level responsiveness (cards, tables, sidebar).
- Standardize layout primitives (Page, Section, Stack, Cluster, Grid, Sidebar, BottomNav) with responsive defaults.
- Define data display patterns for small screens (table → card/stack, modals → sheets, sidebar → drawer, charts → summary-first).
- Ensure accessibility/responsive UX: touch targets ≥ 44x44px, reduced motion, prefers-contrast, color contrast validation.

## 2) Principles
- Mobile-first: start from `base` styles for <640px, progressively enhance at `sm`, `md`, `lg`, `xl`.
- Layout primitives over ad-hoc spacing: compose from a small set of well-documented primitives.
- Single source of tokens: tokens in TS generate CSS variables; Tailwind consumes CSS vars for runtime theming.
- Deterministic theming: `.dark` class toggling with CSS variables; no duplication between TS and CSS.
- Component-first responsiveness: prefer container queries in components to page breakpoints where feasible.

## 3) Core Tokens and Scales

Colors (example mapping to CSS vars):
- Brand: `--brand-primary`, `--brand-secondary`, `--brand-tertiary`, `--brand-accent`
- Semantic: `--semantic-success`, `--semantic-warning`, `--semantic-error`, `--semantic-info`
- Neutral: `--neutral-50 … --neutral-900`

Typography:
- Base font-size fluid: `clamp(14px, 0.9vw + 12px, 16px)`
- Scale: 12, 14, 16, 18, 20, 24, 30, 36, 48 with fluid presets for headings
- Line-height: 1.4–1.6 body, 1.25 headings

Spacing:
- Base unit: 4px
- Scale: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 with responsive aliases (`space-1..space-10`)

Radii and Shadows:
- Radius: 6, 10, 16 for small/medium/large surfaces
- Shadows: elevation system (1–4) with on-dark variants

## 4) Breakpoints and Containers

Breakpoints (Tailwind defaults):
- `sm` 640px — handset landscape/small tablets
- `md` 768px — tablets
- `lg` 1024px — small laptop
- `xl` 1280px — desktop
- `2xl` 1536px — large desktop

Container widths:
- `.container` enabled with `center: true; padding: { DEFAULT: '1rem', sm: '1.25rem', lg: '2rem' }`.
- Content max-widths: prose (65ch), forms (820px), modals (560/768/960), sheets (100% on mobile).

## 5) Layout Primitives

Define minimal components/utilities (could be React components or class recipes):
- Page: vertical stack with responsive gaps and max-width
- Section: `py-4 sm:py-6 lg:py-8`, responsive gutters
- Stack: `flex flex-col gap-3 sm:gap-4 lg:gap-6`
- Cluster: `flex flex-wrap items-center gap-2 sm:gap-3`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`
- Sidebar Layout: mobile drawer + bottom nav; desktop fixed sidebar (`md:pl-64`), main uses container
- Bottom Navigation: fixed at bottom on mobile, aria labels, haptic-area ≥ 44px

## 6) Component Patterns (Mobile-first)

- Navigation
  - Mobile: `Sheet/Drawer` for side menu; `BottomNav` primary actions; search prominent
  - Tablet+: persistent sidebar + topbar

- Cards and Lists
  - Base: 1-column list; larger screens use 2–4 columns (`grid-cols-*`). Density increases with `sm`/`md` (padding/gap grows)
  - Use container queries to reveal extra metadata at larger sizes

- Tables → Cards
  - On base, render items as stacked cards with key fields; show table only at `md+` or when container wide

- Forms
  - Single-column at base; 2-column `md+` for short fields; use `input`, `select`, `textarea` components with consistent hit areas
  - Avoid side-by-side tiny inputs on mobile; use `Stack` and `FormSection`

- Dialogs → Sheets
  - Use `Sheet` component on mobile to replace modal dialogs. Centered Dialogs reserved for `md+`

- Media/Charts
  - Provide summary stats first; lazy-load heavy charts; use `AspectRatio` and `ResizeObserver` responsive rendering

## 7) Accessibility and UX

- Touch targets ≥ 44x44px; minimum tap spacing 8px
- `prefers-reduced-motion`: reduce transitions/animations
- `prefers-contrast` and color contrast ≥ 4.5:1 for text
- Focus styles visible on dark and light themes; rely on Tailwind ring utilities
- Keyboard nav validated with `@axe-core/react` in dev

## 8) Tailwind v4 Configuration Strategy

Actions:
1) Remove CDN Tailwind from `index.html` and migrate inline `tailwind.config` to `tailwind.config.ts`.
2) Add `postcss.config` with Tailwind and Autoprefixer.
3) Configure `content` paths to include `src/**/*.{ts,tsx}` and `index.html`.
4) Map CSS variables to Tailwind color tokens to keep runtime theming flexible.

Example `tailwind.config.ts` sketch:
```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.25rem', lg: '2rem' },
    },
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary-rgb, 30 58 95))',
          secondary: 'rgb(var(--brand-secondary-rgb, 112 128 144))',
          tertiary: 'rgb(var(--brand-tertiary-rgb, 255 126 0))',
          accent: 'rgb(var(--brand-accent-rgb, 225 169 95))',
        },
      },
      screens: {
        // defaults are fine; customize if needed
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out'
      },
    },
  },
  plugins: [],
} satisfies Config
```

Remove from `index.html`:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>/* tailwind.config = {...} */</script>
```

## 9) Container Queries

Adopt `@container` queries for components that need local responsiveness (e.g., card meta, table columns):
- Add a utility `.cq` that applies `container-type: inline-size; container-name: card;`
- Use Tailwind’s `@container` or plugin variant to style children based on width thresholds.

Example:
```css
.card.cq { container-type: inline-size; }
@container (min-width: 420px) {
  .card .meta { display: grid; grid-template-columns: 1fr 1fr; }
}
```

## 10) Performance and Delivery

- Purge: rely on Tailwind v4 content scanning; avoid CDN to ensure minimal CSS
- Code-split heavy pages (charts, calendar)
- Lazy-load images with responsive sizes (`sizes`, `srcset`), use `object-contain` for thumbnails

## 11) Migration Roadmap (Phased)

Phase 0 — Baseline (1 day):
- Add `tailwind.config.ts` and `postcss.config`.
- Remove CDN Tailwind from `index.html`.
- Validate build and CSS size; fix any class name issues.

Phase 1 — Layout Primitives (1–2 days):
- Create React primitives: `Page`, `Section`, `Stack`, `Grid`, `SidebarLayout`, `BottomNav`.
- Replace ad-hoc paddings/gaps in top-level pages with primitives.

Phase 2 — Components (3–5 days):
- Refactor Dialogs to use `Sheet` on mobile.
- Convert tables to card lists at base; show tables at `md+`.
- Add container queries to cards and lists.

Phase 3 — Tokens and Theming (1–2 days):
- Single-source tokens: generate CSS vars from TS or vice versa.
- Map Tailwind theme to CSS vars.

Phase 4 — A11y and QA (ongoing):
- Add `@axe-core/react` in dev to flag issues.
- Device lab test: iOS Safari, Android Chrome, tablet landscape, small laptops, large desktop.

## 12) Acceptance Criteria / Checklist

- Tailwind configured at build-time only; CDN removed
- Base typography and spacing fluid at mobile sizes; readable at all DPIs
- Primary workflows fully usable on 360×640 screens without horizontal scroll
- Sidebar collapses to Drawer on mobile; BottomNav present and operable
- Tables degrade gracefully to cards at small sizes
- Forms single-column at base; no clipped inputs/buttons
- All interactive elements meet 44×44px minimum
- Contrast ratios pass (WCAG AA)

## 13) Known Risks / Open Questions

- Some legacy planner styles may conflict with new primitives; plan to wrap legacy in a compatibility layer during transition.
- Token unification path: prefer CSS vars as primary source with TS typing generated, or TS → CSS generation? Choose based on developer workflow.
- Session journal: root `sessionjournal.md` was not found; confirm if we should create it from the template in `docs/claude/claude-session-template.md`.

## 14) Implementation Notes

- Prefer utility-first classes on primitives, and component APIs that expose `className` for composition.
- Keep imports tree-shaken; avoid global CSS except for tokens and a handful of utilities.
- Use `use-mobile.tsx` helper to gate mobile-only patterns where needed.
