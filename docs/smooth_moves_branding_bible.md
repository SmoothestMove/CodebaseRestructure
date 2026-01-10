# Branding Bible (Working Draft)

> **How to use this document**
>
> - This is the single source of truth for how the Smooth Moves brand looks, sounds, and behaves.
> - Anything not defined here defaults to: **simple, clear, trustworthy**.
> - If you change something, update this doc first.

---

## 1. Brand Core (Non Negotiables)

### Purpose

**Why we exist:**

> To provide professional graded logistics to DIY movers, without the professional  grade cost.

***Rule:*** *If a feature, design choice, or message doesn’t support this, it’s wrong.*

### Brand Promise

**Users should consistently feel:**

1. **Primary:** You feel stress-free about what needs to be done next
2. **Supporting:** You are at ease about where your belongings are located at all times
3. **Supporting:** You feel supported during one of the hardest endeavors one will face

### Audience

**Primary user:  DIY Movers**

- **Who they are:** Individuals and families who wither don't want or can't afford to hire professional moving companies. 

- **What frustrates them:** Movers frustrate people through unreliable service (delays, no-shows, poor communication), hidden fees from non-binding estimates, damaged or lost belongings due to careless handling, and scams like low-ball quotes escalating on moving day

- **What they fear:** financial uncertainty from unpredictable costs and overcharges, damage or theft of valuables with difficult claims processes, mover unreliability leading to chaos, and emotional stress from the process's complexity disrupting family life.

- **What success feels like:** like a smooth, stress-free process with accurate budgeting, reliable vetted movers arriving on time, no damage to items, efficient task management from planning to settling in, and cost savings from decluttering and off-peak timing.

### Positioning

We are:  A consumer facing all-in-one moving management application. We combine the best features of comparable applications, improve on them, and offer them to consumers, intending to reduce the stress of moving. 

We are not: A moving company, a marketplace, a middleman for movers, enterprise software.

---

## 2. Brand Personality

### Personality Sliders

| Trait Pair                     | Target      |
| ------------------------------ | ----------- |
| **Friendly** ◀──▶ Corporate    | Friendly    |
| **Playful** ◀──▶ Serious       | Playful     |
| **Minimal** ◀──▶ Expressive    | Minimal     |
| **Bold** ◀──▶ Reserved         | Bold        |
| Technical ◀──▶ **Plainspoken** | Plainspoken |

**Rule:** *If copy or UI drifts off these settings, it gets rewritten*.



### Archetype

**Primary: The Guide**

Smooth Moves exists to reduce uncertainty and complexity during relocation by clearly showing users what matters, what comes next, and how to move forward with confidence.

**Secondary (optional): The Ally**

The brand remains human and supportive, especially during errors, uncertainty, or recovery moments, without sacrificing clarity or authority.

Archetype guardrails

- If copy or UI behavior contradicts the archetype, rewrite it.
- Do not blend more than two archetypes.

---

## 3. Voice and Tone

### Voice Rules (Always True)

- **Clarity beats personality.** If something can be misunderstood, rewrite it.
- **Always show the next step.** Every screen should make the next action obvious.
- **Confident, not commanding.** Guide the user; don’t lecture or scold.
- **Reduce stress without naming it.** Show calm through structure and clarity.
- **Use plain language.** Avoid industry jargon unless it’s necessary and explained.
- **Be specific.** Avoid vague terms like “soon,” “easy,” or “quick.”
- **Human, not casual.** Friendly and professional; no jokes or slang in core UI.
- **Support without coddling.** Focus on resolution, not reassurance.
- **One action per message.** Sequence steps when more than one is required.
- **Consistency over cleverness.** Similar situations should sound similar.



### Tone by Context

|                    |                                  |                                                                              |
| ------------------ | -------------------------------- | ---------------------------------------------------------------------------- |
| Context            | Tone                             | Notes                                                                        |
| Onboarding         | Calm, confident, directional     | Establish trust early. Explain purpose briefly and show progress.            |
| Tooltips / Help    | Informative, supportive, concise | Clarify without interrupting flow. Assume intelligence, not expertise.       |
| Empty states       | Encouraging, practical           | Explain why the state exists and present a clear first action. No apologies. |
| Success states     | Acknowledging, restrained        | Confirm progress and guide to what comes next. Avoid celebration language.   |
| Errors             | Calm, factual, solution-oriented | State what happened and how to recover. No blame or dramatization.           |
| Permissions / Risk | Clear, precise, serious          | Slow the user slightly. Be explicit. Caretaker tone allowed here only.       |
|                    |                                  |                                                                              |

| ***Rule:*** *Error messages should reduce stress, not explain engineering.* |
| --------------------------------------------------------------------------- |

### Copy Do's / Don’t's



**DO:**

- Use direct, action-oriented language that clearly tells the user what to do next
- Explain *why* a step exists when it improves understanding or trust
- Keep sentences short and focused on a single action
- Reuse consistent phrasing for similar actions and states
- Prioritize clarity and structure over personality or flair

**DON’T:**

- Use slang, jokes, emojis, or playful language in core UI
- Over-apologize, dramatize errors, or assign blame
- Use vague reassurance like “Don’t worry,” “Easy,” or “Just”
- Combine multiple instructions into a single message
- Invent new phrasing for familiar actions or repeated flows

---

## 4. Visual Identity

### Color System

> Define colors by **role**, not just hex.

- **Primary (Structure & Orientation):**
  - **HEX:** `#1E3A5F`
  - **Usage:** App structure and navigation. Used for the sidebar, top bars, section headers, and the active navigation state. This color tells the user *where they are*. It is never used for buttons or calls to action.
- **Secondary (Support & Readability):**
  - **HEX:** `#708090`
  - **Usage:** Supporting UI elements such as secondary text, icons, labels, inactive navigation items, and subtle dividers. This color provides clarity without pulling focus.
- **Neutrals:**
  - **Background:** `#D3D3D3`
  - **Surface:** `#FFFFFF`
  - **Text:** `#1F1F1F`
  - **Borders:** `#C4C4C4`
  - **Usage:** Page backgrounds, cards, input fields, and layout surfaces. Neutrals should make up the majority of the interface to keep the UI calm and reduce cognitive load.
- **Accent (rare, passive emphasis only):**
  - **HEX:** `#E1A95F`
  - **Usage:** Light emphasis only, such as badges, counts, or subtle highlights. Never used for buttons or primary actions. If removed entirely, the interface should still function correctly.

***Rules:*** Accent is never decorative,  Contrast beats vibes, Neutrals do the heavy lifting.

### Primary Action Rule

- **Primary Action Color:** `#FF7E00`
- **Rule:** This color is used **only** for the single most important action on a screen. If more than one element is orange, the screen hierarchy is wrong and must be corrected.

**Clarifications (non-negotiable):**

- Never used for navigation
- Never used for status indicators
- Never used for decoration
- Never used twice on the same screen

If the user should *do something right now*, it’s orange.\
If not, it isn’t.



\---

### Typography



**Primary Font**

- **Font:** Nunito
- **Usage:** Navigation labels, section headers, card titles, key UI text
- **Weights:**
  - Regular (400)
  - SemiBold (600)
  - Bold (700)

### Fallback Fonts

Use in this order if Nunito is unavailable:

1. `system-ui`
2. `-apple-system`
3. `Segoe UI`
4. `Roboto`
5. `Helvetica Neue`
6. `Arial`
7. `sans-serif`

Rules:  No decorative fonts.

- No new fonts without updating this doc.

### Iconography

- Style:
- Stroke / fill:
- Corner radius:
- Grid:

---

## 4. Logo System

### Logo Variants

- Primary (full lockup)
- Mark only
- Monochrome
- App icon

### Clear Space and Minimum Size

- Clear space rule:
- Minimum size:

### Forbidden Uses

- No stretching
- No recoloring
- No shadows
- No outlines
- No effects

---

## 6) UI Principles

> These guide product decisions when visuals are not enough.

1.
2.
3.
4.

---

## 7) Messaging Framework

### One Line Description

-

### Core Message

-

### Supporting Messages (3–5)

-
-
-

### Feature Messaging Formula

**Outcome → How → Reassurance**

- Template:
- Example:

---

## 8) AI and Automation Guardrails

- AI generated copy must follow Voice Rules.
- Avoid jokes in transactional UI.
- Emojis: allowed in marketing; avoided in core UI.
- Prefer human first explanations; technical second.

---

## 9) Governance

### Ownership

- Brand owner:
- Approvers:

### Requires Approval

- New colors
- New fonts
- Tone changes
- New logo variants
- Major UI pattern changes

### Review Cadence

- Quarterly brand check

---

## 10) One Page Summary (Cheat Sheet)

- **Purpose:**
- **Promise:**
- **Archetype:**
- **Personality sliders:**
- **Core colors:**
- **Fonts:**
- **Voice rules:**
- **Example sentence that sounds right:**

