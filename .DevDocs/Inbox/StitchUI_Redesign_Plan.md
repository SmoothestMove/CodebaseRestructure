# Stitch UI Redesign Project Plan

> **Created:** 2026-01-07 | **Updated:** 2026-01-08  
> **Status:** Awaiting Stakeholder Approval  
> **Scope:** 9 screens based on Stitch design mockups

---

## I. Task Checklist

### Phase 1: Planning & Documentation _(Current Phase)_

- [x] Analyze all 9 Stitch UI designs (HTML + screenshots)
- [x] Review Smooth Moves branding bible
- [x] Explore existing codebase structure
- [x] Create detailed implementation plan
- [x] Incorporate stakeholder feedback on navigation, auth, planner
- [ ] Receive final stakeholder approval

### Phase 2: Design System Alignment

- [ ] Update design tokens to match Stitch palette
- [ ] Ensure Nunito Sans typography consistency
- [ ] Integrate Material Symbols Outlined icons
- [ ] Create dark mode tokens

### Phase 3: Core Layout Components

- [ ] Refactor mobile app shell (`max-w-md` container)
- [ ] Implement sticky header with blur backdrop
- [ ] Create bottom nav: **Dashboard | Manifest | Scanner (center, larger) | Budget | Planner**

### Phase 4: Page-by-Page Implementation

- [ ] **Authentication** — segmented intent, **preserved moveID input**, social login
- [ ] **Dashboard** — progress cards, spaces grid, truck visualization
- [ ] **Budget** — expense list, category filters, tabs
- [ ] **Calendar** _(NEW feature)_ — monthly grid, event cards, FAB
- [ ] **Planner** _(Dual-format)_ — kanban overview + block time for days, **preserved customizations**
- [ ] **Settings** — iOS-style groups, toggles, danger zone
- [ ] **Box Details** — hero layout, timeline, action bar
- [ ] **Manage Spaces** — color-coded cards, quick actions
- [ ] **Manage Owners** — owner cards, initials avatars

### Phase 5: Testing & Verification

- [ ] Visual regression (light & dark modes)
- [ ] Responsive behavior verification
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## II. Key Decisions Made

| Area              | Decision                                                       |
| ----------------- | -------------------------------------------------------------- |
| **Bottom Nav**    | Dashboard, Manifest, Scanner (center, larger), Budget, Planner |
| **Auth**          | Preserve moveID input for "Join Existing Move"                 |
| **Calendar**      | NEW feature (not yet implemented)                              |
| **Planner**       | Dual-format: Kanban overview + Block time for days             |
| **Customization** | All existing planner customization options preserved           |

---

## III. Remaining Questions

1. **Primary Color:** Stitch `#2f4a81` vs branding bible `#1E3A5F`?
2. **Font:** Standardize on Nunito Sans?
3. **Icons:** Migrate to Material Symbols or keep Lucide?
4. **Missing Screens:** Apply Stitch pattern or wait for mockups?
5. **Dark Mode:** Full scope or light-mode priority?

---

## IV. Development Roadmap

```
Week 1  ─── Planning & Approval ────────────────────────
        ├── [x] Design analysis & stakeholder feedback
        └── [ ] Final approval

Week 2  ─── Design System & Layout ─────────────────────
        ├── [ ] Update design tokens
        ├── [ ] Refactor mobile shell
        └── [ ] Build new bottom navigation

Week 3-4 ─── Page Implementation ───────────────────────
        ├── [ ] Auth, Dashboard, Budget
        ├── [ ] Calendar (NEW)
        └── [ ] Planner (Dual-format)

Week 5  ─── Remaining Pages & Testing ──────────────────
        ├── [ ] Settings, Box Details, Spaces, Owners
        └── [ ] QA & Accessibility
```

---

## Reference Files

- **Stitch Designs:** `docs/design/Redesign/Stitch/*`
- **Branding Bible:** `docs/smooth_moves_branding_bible.md`
- **Design Tokens:** `src/styles/design-tokens.css`
- **Features:** `src/features/auth|boxes|budget|calendar|planner|settings|owners`
- **App_Pages_Elements.md:** `docs/project-management/App_Pages_Elements.md`