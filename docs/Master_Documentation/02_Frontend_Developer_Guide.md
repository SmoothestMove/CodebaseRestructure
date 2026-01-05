# Frontend Developer Guide

## Tech Stack
- **Framework:** React 19.1
- **Language:** TypeScript 5.7
- **Build Tool:** Vite 6.2
- **Styling:** TailwindCSS 4.1
- **Routing:** React Router DOM 7.6
- **State Management:** React Context (feature-scoped)
- **UI Library:** Custom components (Radix UI primitives / Shadcn-like structure) + Lucide Icons

## Directory Structure
- `src/main.tsx`: Entry point, Firebase init.
- `src/App.tsx`: Routing and Layout configuration.
- `src/components/`: Shared UI components (Buttons, Inputs, Modals).
- `src/features/`: Domain-specific modules (Auth, Boxes, Budget, etc.). Each feature typically contains:
  - `components/`: Feature-specific UI.
  - `hooks/`: Custom hooks and Context providers.
  - `pages/`: Route components.
  - `types.ts`: Domain interfaces.
- `src/lib/`: Shared utilities (Firebase helpers, formatters, constants).
- `src/hooks/`: Global hooks (theme, debounce).

## Key Patterns

### State Management
We use **React Context** for managing feature-scoped state.
- Example: `BoxesProvider` wraps the app (or a section) to provide access to box data.
- Usage: `const { boxes, addBox } = useBoxes();`

### Styling
- **Tailwind CSS** is used for all styling.
- Global styles are in `src/index.css`.
- Theme toggling (Dark/Light) is handled via `next-themes` (or similar logic in `useTheme`).

### Routing
- **Protected Routes:** `ProtectedRoute` component checks for an authenticated user before rendering child routes.
- **Layout:** `MainAppLayout` includes the `Navbar` and renders the current page via `<Outlet />`.

### Forms
- `react-hook-form` is used for complex forms (e.g., adding boxes, editing profiles).

## Development Workflow
1. **Start Dev Server:** `npm run dev`
2. **Linting:** Currently relies on TS strict mode. (TODO: Add ESLint).
3. **Testing:** Vitest is installed. Run `npm test`.

## Common Tasks
- **Adding a new Page:** Create the page in `src/features/<feature>/pages/`, then add a route in `src/App.tsx`.
- **Adding a new Component:** Place generic components in `src/components/`, specific ones in `src/features/<feature>/components/`.
