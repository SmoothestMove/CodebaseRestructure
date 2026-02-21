# New Member Onboarding

Welcome to the Smooth Moves team! This guide will help you get up to speed with the codebase.

## Quick Start
1. **Clone the Repo:** `git clone <repo-url>`
2. **Install Dependencies:** `npm install`
3. **Environment Setup:**
   - Copy `.env.example` to `.env.local`.
   - Fill in the required Firebase keys (ask a team member for the dev project keys).
4. **Run the App:** `npm run dev`
   - Open [http://localhost:5173](http://localhost:5173).

## Architecture Overview
- **Frontend-First:** The app is a Single Page Application (SPA) built with React and Vite.
- **Serverless:** We rely heavily on Firebase for backend services.
- **Feature-Based Folder Structure:** We organize code by feature (e.g., `auth`, `boxes`, `budget`) rather than by type (e.g., `components`, `actions`).

## Key Files
- `src/App.tsx`: The main router. Start here to understand navigation.
- `src/main.tsx`: App entry point.
- `src/lib/config/constants.tsx`: Configuration and Environment variables.
- `AGENTS.md`: Technical overview and "meta" instructions for the project.

## Workflow
- **Branching:** Create feature branches (e.g., `feature/add-dark-mode`) from `main`.
- **Commits:** Use descriptive commit messages.
- **Testing:** Run `npm test` before pushing.

## Where to find help?
- **Docs:** Check the `docs/` folder.
- **AI:** The codebase is optimized for AI assistance. Refer to `AGENTS.md` to understand how we document for agents.
