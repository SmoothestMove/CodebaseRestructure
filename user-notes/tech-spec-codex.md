## Codebase Ingestion Prompt Template

**PROJECT OVERVIEW**

- **What's the broader product or company context this codebase belongs to?** Smooth Moves is a consumer-facing web app that helps households orchestrate residential moves by consolidating box tracking, planning, budgeting, and AI assistance into a single workspace.
- **What's the primary goal or responsibility of this codebase?** This Vite-powered React + TypeScript single-page app manages the end-to-end moving experience, coordinating Firebase-backed data for boxes, owners/spaces, planners, calendars, budgets, and the MARVIN AI assistant.
- **What are 1-2 core workflows or use cases that this codebase powers?** Users catalog moving boxes via QR codes, assign owners or rooms, schedule and track moving tasks on a calendar, manage budgets with receipt OCR, and interact with the MARVIN assistant for planning support.

**ARCHITECTURE + TECH**

- **How is the system architected?** The app is a client-heavy SPA served by Vite, with Firebase providing backend services (Auth, Firestore, Storage). React contexts supply domain-specific state and data access, and routing is handled client-side.
- **What's the tech stack used across the frontend, backend, database, and infra?** Frontend: React 19, TypeScript 5.7, Vite 6, TailwindCSS 4, Radix/Shadcn-inspired components. Backend/infra: Firebase (Auth, Firestore, Storage, Hosting), Vercel for static hosting. Supporting APIs: Google Gemini, Mindee OCR, Picovoice Porcupine.
- **What custom patterns, internal frameworks, or architectural decisions are unique to this codebase?** Uses a strict TypeScript configuration with the `@/*` alias; each feature domain (auth, boxes, owners, planner, budget, calendar, MARVIN) encapsulates its own context/providers and Firebase interactions. Configuration centralizes in `src/lib/config/constants.tsx`, and Firebase initialization is enforced at app start.
- **What external systems does this codebase connect to?** Firebase services, Google Gemini for AI responses, Mindee expense receipt OCR, and Picovoice Porcupine for optional wake-word detection.

**PRIVATE DEPENDENCIES + RUNNING THE CODE**

- **When building this project, do we need access to any internal dependencies, packages, or libraries?** No private packages are required; all dependencies are open-source and defined in `package.json`.
- **Are there any secrets, environment variables, or configurations required to compile and run the project successfully?** Yes - populate `.env.local` with Firebase (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`), Gemini (`VITE_GEMINI_API_KEY`), Mindee (`VITE_MINDEE_API_KEY`), and optional Picovoice (`VITE_PICOVOICE_ACCESS_KEY`) values as referenced in `src/lib/config/constants.tsx`.
- **Do you have a complete, step-by-step set of build instructions that takes a developer from a clean machine to running the project?** Yes - install dependencies with `npm install`, start the dev server via `npm run dev`, build with `npm run build`, and preview the production bundle using `npm run preview` (or `npm start`). These commands are documented in `package.json` and summarized in the project overview documentation.

**BUSINESS CONTEXT + DOMAIN KNOWLEDGE**

- **What business rules or compliance requirements shape this code?** Firestore security rules enforce that move-specific data is accessible only to authenticated users who created the move or are listed participants, reflecting privacy and access-control requirements for personal moving data.
- **Any industry or domain-specific terminology or acronyms we should understand?** Key terms: Move (top-level relocation project), Box (QR-tracked container), Owner/Space (people or rooms associated with boxes), Planner (task planning entities), Budget (expense tracking with OCR), MARVIN (AI assistant).
- **What's the "why" behind major architectural choices?** Leveraging Firebase reduces backend overhead and supports real-time collaboration, while Vite + React provides rapid iteration for a client-first experience. Integrations with Gemini, Mindee, and Porcupine add intelligent assistance and automation aligned with the product's value proposition.

**CURRENT STATUS + EVOLUTION**

- **What stage is this codebase in?** The app is in active development with production hosting targets (Vercel) but ongoing refinements noted in project TODOs.
- **Have there been any major architectural shifts or technical constraints that shaped the current system?** Documentation references legacy Express hosting, but the project now relies on Vite preview/Vercel. Storage rules were recently added (`firebase/storage.rules`) and integrated into hosting configuration.
- **Are there any incomplete components, known edge cases, or areas under active refactor?** Known risks include outdated docs, lack of lint/test tooling, sensitive data cleanup in docs, validation of move participant creation, and performance considerations around Porcupine models and Vite optimizeDeps (see project TODO list).

**AREAS TO IGNORE**

- **Are there specific file paths or directories that aren't relevant?** No directories are explicitly marked as obsolete; however, large wake word assets in `public/` and legacy documentation under `docs/` may not impact core feature development and can be deprioritized unless working on those integrations.

