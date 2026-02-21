Smooth Moves — Developer Design Guide

This guide gives design‑minded developers a concise, accurate reference for the app’s visual system and how to implement it in code. It covers the palette, typography, spacing, elevation, motion, theming, and usage conventions so contributors can work effectively without prior context.

**Source of Truth**
- Tailwind config: `index.html` extends Tailwind via CDN with brand colors (`brand-*`) and animations.
- CSS variables: `index.css` exposes core brand and semantic colors as `--brand-*` and `--neutral-*` custom properties.
- Design tokens (TypeScript):
  - Colors: `src/components/design-system/foundations/colors.ts`
  - Typography: `src/components/design-system/foundations/typography.ts`
  - Spacing: `src/components/design-system/foundations/spacing.ts`
  - Shadows: `src/components/design-system/foundations/shadows.ts`
- Dark mode: Class‑based. The `ThemeProvider` (`src/hooks/useTheme.ts`) toggles the `dark` class on `<html>`. Use `dark:` Tailwind variants or dark token variants.

Note on parity: The Tailwind brand palette (used by class names like `bg-brand-tertiary`) is the UI‑facing canonical palette today. The TypeScript color tokens include a slightly different brand set; when adding new UI, prefer the Tailwind brand tokens and neutrals. See “Aligning Tokens” below.

**Brand Palette (Canonical)**
Defined in Tailwind `index.html` and mirrored in `index.css` custom properties.
- `brand-primary` `#1e3a5f` (dark blue)
- `brand-primary-dark` `#162b45`
- `brand-secondary` `#708090` (slate gray)
- `brand-secondary-dark` `#5a6875`
- `brand-tertiary` `#ff7e00` (bright orange)
- `brand-tertiary-dark` `#e67100`
- `brand-accent` `#e1a95f` (muted peach/orange)
- `brand-accent-dark` `#ca9854`
- `brand-light-gray` `#d3d3d3`
- `brand-light-gray-dark` `#bcbcbc`
- Theme color meta: `#1e3a5f` (sets mobile address bar color)

Dark mode adjuncts (Tailwind extended):
- `dark-body-bg` `#0f172a` (slate‑900)
- `dark-card-bg` `#1e293b` (slate‑800)
- `dark-text-primary` `#f8fafc` (slate‑50)
- `dark-text-secondary` `#cbd5e1` (slate‑300)
- `dark-scrollbar-track` `#1e293b`, `dark-scrollbar-thumb` `#475569`

**Neutrals & Semantics**
Primary neutral scale (from tokens and CSS vars):
- `--neutral-50` `#f8fafc` … `--neutral-900` `#0f172a` (slate range)

Semantic hues (used throughout components):
- Success `#22c55e`, Warning `#f59e0b`, Error `#ef4444`, Info `#3b82f6`

Box status colors (background/border/text presets) from tokens for: prepared, packed, loaded, unloaded, delivered, unpacked. Use `StatusBadge` or the status presets in `BoxCard` for consistency.

**Typography**
Families (`typography.fontFamily`):
- Sans: Inter, system fallbacks (Segoe UI, Roboto, etc.)
- Mono: JetBrains Mono, Fira Code, Monaco, Consolas

Scales (desktop defaults; see `typography.scale`):
- Display: 60px, lh 1.1, weight 800
- Headings: h1 36px, h2 30px, h3 24px, h4 20px, h5 18px, h6 16px
- Body: base 16px, small 14px, large 18px
- UI Buttons: 12–16px with tighter letter spacing on small

Mobile overrides (`typography.mobile.scale`): slightly smaller headings and increased body line‑height for readability (e.g., h1 32px, body base 16px at lh 1.6).

**Spacing**
Rem‑based scale (`spacing.scale`) aligned to Tailwind rhythm: `0, 0.5, 1, 1.5, …, 96` mapping to `px` → `24rem`.

Component spacing presets (`spacing.component`):
- Buttons: sm/md/lg/icon with x/y paddings
- Inputs: sm/md/lg paddings
- Cards: sm→xl padding
- Modals: header/body/footer paddings
- Nav: mobile height 80px; desktop width 256px

Layout spacing (`spacing.layout`):
- Container padding: mobile 1rem, tablet 1.5rem, desktop 2rem
- Sections: xs 1.5rem → xl 6rem
- Grid gaps: xs 0.5rem → xl 2.5rem

Touch targets (`spacing.touch`): min 44px, comfortable 48px.

**Shadows & Elevation**
Shadow scale (`shadows.scale`): `xs` → `2xl` for subtle depth.

Elevation (`shadows.elevation`): levels 0–5 for component tiers (cards, dropdowns, modals, overlays). Dark mode variants lighten density for contrast.

Focus rings (`shadows.focus`): default blue; primary ring can align to brand (orange) where appropriate. Use semantic rings for success/error feedback.

**Motion**
Central config: `src/lib/animations/config.ts`
- Durations: fast 150ms, normal 250ms, slow 400ms; respects `prefers-reduced-motion`.
- Easings: bounce, smooth, sharp, linear.
- Variants: `page`, `card`, `button`, `modal`, `bottomSheet`, `listItem`, `spinner`, `feedback`.
- Use `PageTransition` and `AnimatedList` from the design system for built‑ins.

**Theming & Dark Mode**
- Activation: `ThemeProvider` writes/removes `dark` class on `<html>`; persists in `localStorage`.
- Usage: prefer Tailwind `dark:` utilities for color/text/background borders.
- Components: Many presets include dark variants (e.g., `StatusBadge`, `Card`, planner styles in `index.css`). Verify contrast (WCAG AA) and focus visibility.

**Components & Composition**
Design system entry: `src/components/design-system/index.ts`
- Foundations re‑exported from `foundations/*`.
- Components: `Card`, `StatusBadge`, `Skeleton` variants, `FormField` variants, `AnimatedList`, `PageTransition`, `BottomSheetModal`.
- App UI also uses Shadcn/Radix‑style components under `src/components/ui/*` for inputs, tabs, dialogs, etc.

Usage conventions:
- Prefer design‑system components for new surfaces to inherit tokens, motion, and dark mode.
- When using Tailwind utility classes, use `brand-*` and neutral scale; avoid hard‑coding hex values in components.

**Iconography**
- Libraries: `react-icons` (Ionicons, etc.).
- Custom icons: exported from `src/lib/config/constants.tsx` (e.g., `IconPlus`, `IconCamera`, `IconSettings`).
- Color: inherit current text color; use `text-brand-tertiary` for brand accents.

**Accessibility**
- Color contrast: target 4.5:1 for text; check status badges in both themes.
- Focus: visible focus rings on interactive elements (`focus:ring-2` etc.).
- Motion: respect `prefers-reduced-motion`; variants already zero out durations via `shouldReduceMotion()`.
- Touch targets: 44px minimum (`spacing.touch`).

**Tailwind Usage & Patterns**
- Dark mode: class strategy (`dark:` variants). HTML/body classes applied in `index.html` and via ThemeProvider.
- Brand tokens: `bg-brand-tertiary`, `text-brand-primary`, `border-brand-secondary`, etc.
- Neutrals: Tailwind slate scale or CSS vars in `index.css` for planner.
- Animations: custom keyframes configured in `index.html` (`fade-in`, `slide-up`, `scan-line`).

**Aligning Tokens (Important)**
There is a mismatch between the TypeScript brand tokens and the Tailwind brand palette used in classes.
- Tailwind brand (in use): `brand-primary #1e3a5f`, `brand-tertiary #ff7e00`, etc.
- TS tokens `colors.brand` currently define a different set (e.g., `primary #1f4054`, `tertiary #e67e22`).

Recommendation for consistency:
1) Treat Tailwind `brand-*` as canonical for UI class usage.
2) Update `src/components/design-system/foundations/colors.ts` brand values to match Tailwind (or vice versa) so programmatic access mirrors UI.
3) Optionally derive Tailwind from CSS variables to ensure single‑source definitions.

**Adding or Changing Design Tokens**
When you introduce or update a token/color:
1) Tailwind: add/update under `tailwind.config` in `index.html` (`theme.extend.colors`).
2) CSS variables: mirror in `index.css :root` and dark overrides if needed.
3) TypeScript tokens: update `foundations/*` so components using tokens stay in sync.
4) Verify dark mode: add `dark:` variants or dark token entries.
5) Test: run app in both themes, check contrast and focus states.

**Quick Examples**
- Brand button: `bg-brand-tertiary text-white hover:bg-opacity-90 focus:ring-2 focus:ring-brand-tertiary`
- Emphasis text: `text-brand-primary dark:text-brand-accent`
- Card surface: use `Card` with `variant="default"` for built‑in elevation and dark mode.
- Status chip: `StatusBadge status="packed" variant="soft"` for consistent colors in both themes.

**File Map Reference**
- Tailwind + animations: `index.html`
- Global CSS vars + planner styles: `index.css`
- Theme hook: `src/hooks/useTheme.ts`
- Tokens: `src/components/design-system/foundations/*`
- Design system components: `src/components/design-system/*`
- Animations config: `src/lib/animations/config.ts`

—
Questions or changes to the design system? Open a PR touching the files above and include screenshots in light/dark to validate contrast and consistency.

