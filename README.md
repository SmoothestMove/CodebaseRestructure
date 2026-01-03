# Smooth Moves

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.8-orange.svg)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC.svg)](https://tailwindcss.com/)

A web application to manage moving projects: QR-labeled box tracking, owners/spaces, planner and calendar, budgeting with receipt OCR, and the MARVIN AI assistant - built with React + TypeScript and Firebase.

## Features

- Box Management: QR code generation, scanning, statuses, contents, photos
- Owners & Spaces: Assign boxes to people or rooms, color-coded
- Financial Navigator: Budget, categories, expenses, charts; optional OCR import
- Calendar: Event scheduling and views; move-aware
- Planner: Tasks, timeframes, drag-and-drop
- MARVIN Assistant: Gemini-powered assistant; optional wake-word with Porcupine
- Mobile-First UI: Responsive, with camera integration for scanning

## Future Features

- MARVIN Assistant: AI-powered assistant; optional wake-word with Porcupine
- Pre-built task lists: "Local Move", "Cross-Country", "Storage + Move", "Apartment to House"
  - Example: Click "2BR Apartment Move" → 68 pre-filled tasks appear instantly

## Tech Stack

- Frontend: React 19.1, TypeScript 5.7
- Build: Vite 6.2
- Styling: TailwindCSS 4.1
- Backend: Firebase (Auth, Firestore, Storage, Hosting)
- Routing: React Router DOM 7.6
- Key Libraries: @hello-pangea/dnd, date-fns, framer-motion, recharts, react-toastify, jspdf, lucide-react, uuid

## Quick Start

```bash
# Clone the repository
git clone https://github.com/SmoothestMove/CodebaseRestructure.git
cd CodebaseRestructure

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 in your browser.

## Environment Configuration

1. Copy `.env.example` to `.env.local` and fill in the required values.
2. Run `npm run env:verify` to confirm everything is configured before starting the dev server.

```bash
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# MARVIN AI Assistant (Required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Mindee OCR API (Optional for receipt scanning)
VITE_MINDEE_API_KEY=your_mindee_api_key

# Picovoice Wake Word (Optional - enhances MARVIN)
VITE_PICOVOICE_ACCESS_KEY=your_picovoice_key
```

The app reads these via `import.meta.env` in `src/lib/config/constants.tsx`. See `docs/development/environment.md` for detailed environment guidance.

## Scripts

- Dev: `npm run dev`
- Build: `npm run build` (outputs `dist/`)
- Preview: `npm run preview`
- Start: `npm start` (vite preview)
- Deploy (Vercel): connect repo in Vercel or use CLI (`vercel`, then `vercel --prod`).

## Hosting

- Production: Vercel (Static site)
  - Build command: `npm run build`
  - Output directory: `dist/`
  - Framework preset: Vite
- Optional (not used for prod): Firebase Hosting config exists at `firebase/firebase.json` with SPA rewrites to `/index.html`.
- Firebase backend security: Firestore rules at `firebase/firestore.rules`; indexes at `firebase/firestore.indexes.json`.
- Firebase Storage rules at `firebase/storage.rules`; referenced in `firebase/firebase.json`.

## Development Notes

- Path alias: `@/*` -> `./src/*` (configured in `vite.config.ts` and `tsconfig.json`)
- Strict TypeScript is enabled; ESLint/Prettier configured at root
- Accessibility tooling present (`@axe-core/react`, `jest-axe`) but not wired
- Tests: Vitest configured (run `npm test` or `npm run test:ui`)

## Security & Privacy

- Do not commit API keys. Use `.env.local` which is gitignored.
- Firestore access is restricted to move owners/participants; see `firebase/firestore.rules`.
- Documentation under `docs/development/MindeeOCR/` contains example API references; ensure no real secrets are committed.

## Screenshots (optional)

- Add images under `docs/assets/` and reference here once available.

## License

No LICENSE file is present in this repository. Add one if you intend to open-source.
