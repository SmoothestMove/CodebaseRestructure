# Auth Page UI Fixes Plan

> Combined planning document for Auth Page UI fixes (post-redesign)

---

## Task Checklist

- [x] Hide Move Mode Selection (Start/Join) when Sign In is active
- [x] Remove orange square styling from radio buttons on selection
- [x] Verify changes work correctly in browser

---

## Implementation Plan

Fix two minor UI issues on the Auth Page identified during post-redesign dev review.

### Proposed Changes

#### [MODIFY] [AuthPage.tsx](file:///d:/Projects/codebase/CodebaseRestructure/src/features/auth/pages/AuthPage.tsx)

**1. Hide Move Mode Selection for Sign In Tab**

Wrap the Move Mode Selection `<div>` (lines 389-419) with a conditional check so it only renders when `activeTab === 'register'`.

**2. Remove Orange Square Focus Styling from Radio Buttons**

Replace `focus:ring-2 focus:ring-offset-2 focus:ring-brand-tertiary` with native `accent-accent` styling to color the radio dot without adding a visible focus ring/square.

---

## ~~Development Roadmap~~

| Phase | Description       | Status      |
| ----- | ----------------- | ----------- |
| 1     | Planning & Review | ✅ Complete |
| 2     | Implementation    | ✅ Complete |
| 3     | Verification      | ✅ Complete |

---

## Verification Plan

Manual browser testing:

1. Run dev server (`npm run dev`)
2. Navigate to Auth page
3. Confirm Move Option section is hidden on Sign In tab
4. Confirm Move Option section is visible on Register tab
5. Confirm no orange square appears when selecting radio buttons

---

## Walkthrough

### Changes Made

render_diffs(file:///d:/Projects/codebase/CodebaseRestructure/src/features/auth/pages/AuthPage.tsx)

### Verification Results

All tests passed ✅

- Sign In tab correctly hides Move Option section
- Register tab correctly shows Move Option section
- Radio buttons no longer display orange square on selection

![Verification flow demo](file:///C:/Users/justi/.gemini/antigravity/brain/c3249d58-a502-458c-8ee4-4f1ed0f99499/auth_page_verification_1768006656693.webp)
