# Section 1: Project & Business Overview

### App Name
Smooth Moves

### Primary Contact
- **Name:** TBD
- **Email:** TBD
- **Role:** Product Owner / Founder

### Project Timeline
- Target launch for the marketing site: align with public beta (tentatively Q4 2025).
- Critical deadline: site must be live before the beta invitation email sequence (~4 weeks prior to launch).

### Elevator Pitch
Smooth Moves is a web application that keeps residential moves on track with QR-labeled box management, owners/spaces assignments, planning tools, budgeting with receipt OCR, and the MARVIN AI assistant, all built on React + TypeScript and Firebase.

---

# Section 2: Goals & Success Metrics

### Primary Goal
- [x] Join a waitlist / beta program

Capture interested movers before full launch so we can run a controlled beta.

### Secondary Goals
- Encourage visitors to follow development updates and changelog entries.
- Provide clear feature overviews to validate product-market fit with DIY movers.

### Success Metrics
- 250 waitlist sign-ups before beta launch.
- 35% of visitors scroll to the feature overview section.
- Collect at least 50 qualitative feedback submissions via the dev updates form in the first month.

---

# Section 3: Target Audience

### Ideal User Profile
- **Demographics:** Adults 25-55 coordinating residential moves in North America; includes homeowners, renters, and small moving coordinators.
- **Psychographics:** Organized planners who value visibility into their move, track belongings, and collaborate with family or roommates.
- **Technical Skill Level:** Comfortable with modern mobile/web apps; average-to-advanced digital literacy.

### Pain Point
People managing a move struggle to keep track of boxes, owners, rooms, dates, and budgets across multiple spreadsheets, sticky notes, and text threads.

**Current workaround:** Ad-hoc spreadsheets or generic to-do apps that lack QR support, household assignments, and budgeting context; these tools fall apart when multiple people contribute.

### "Aha!" Moment
Scanning a QR code on a box instantly surfaces contents, assigned owner/space, status, and related tasks, giving movers confidence that nothing is lost.

---

# Section 4: Content & Messaging

### Value Proposition
Smooth Moves centralizes every aspect of a residential move—inventory, people, rooms, scheduling, budgeting, and AI assistance—so teams stay coordinated from packing through delivery.

### Key Features & Benefits
- **Box Management**
  **Benefit:** Generate and scan QR codes to view contents, photos, and status updates on any device.
- **Owners & Spaces**
  **Benefit:** Color-code boxes by people or rooms to keep assignments clear during packing and unloading.
- **Financial Navigator**
  **Benefit:** Track categories, expenses, and totals with optional receipt OCR for faster reconciliation.
- **Calendar & Planner**
  **Benefit:** Plan timelines, tasks, and events that sync with move milestones and participants.
- **MARVIN Assistant**
  **Benefit:** Use a Gemini-powered AI helper (with optional Porcupine wake word) for quick answers and command-and-control.

### Call to Action (CTA) Text
"Join the Waitlist" for the primary hero button; secondary CTA "Follow Development Updates."

### Trust & Social Proof
- [ ] Testimonials from users
- [ ] Case studies
- [ ] Number of users/downloads
- [ ] Awards or recognitions
- [ ] "As featured in" media logos
- [ ] Star ratings

### Objections & FAQs
- **Data ownership:** All move data stays within your Firebase project; export paths will be documented.
- **Pricing:** Final pricing model TBD; early beta will be free.
- **Security:** Auth via Firebase; granular Firestore rules gate move data to owners/participants.
- **Offline/scan reliability:** QR workflow works offline and syncs when connectivity resumes (document limitations on launch).

---

# Section 5: Design & Branding

### Brand Guidelines
- [ ] Yes
- [x] No

### Core Brand Assets
- **Logo:** In progress (placeholder wordmark in use).
- **Colors:** Primary palette draws from CSS tokens (`#1e3a5f`, `#ff7e00`, `#e1a95f`, supporting neutrals).
- **Fonts:** Inter for body/heading text.

### Overall Tone & Vibe
Modern, Friendly, Trustworthy, Technical, Energetic.

### Inspiration
- TODO: Add 2-3 reference URLs with notes (e.g., linear.app, notion.so landing page structure).

### Things to Avoid
Overly corporate stock photography; cluttered moving checklists that overwhelm visitors.

---

# Section 6: Technical Requirements

### Domain Name
movingsmooth.com

**Domain ownership:** [x] Yes   [ ] No

### Hosting
Vercel (static deploy, build command `npm run build`, output `dist/`). Firebase Hosting configuration exists for SPA rewrites if we need a fallback.

### Analytics & Tracking
- **Google Analytics (GA4 Measurement ID):** TBD
- **Meta (Facebook) Pixel ID:** Not set
- **Other tracking tools:** None yet

### Legal Pages
- [ ] Yes, I will provide the links.
- [x] No, need to draft Privacy Policy and Terms of Service before launch.

---

# Section 7: Asset Checklist

- [ ] Logo Files (SVG/AI/PNG)
- [ ] App Screenshots (high-resolution)
- [ ] Lifestyle Photos or Illustrations
- [ ] Demo Video or GIFs
- [ ] App Store / Google Play Store Badges
- [ ] Written Marketing Copy (beyond README)
- [ ] Testimonials (names, companies, photos)
- [ ] Brand Style Guide (optional)
