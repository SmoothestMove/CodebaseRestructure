# AI Agent Context

## Purpose
This document provides context and instructions for AI agents (like Jules, GitHub Copilot, etc.) working on the Smooth Moves codebase.

## Codebase Principles
1. **Strict TypeScript:** No `any`. Always define interfaces for props and data models.
2. **Functional Components:** Use React Functional Components with Hooks.
3. **Tailwind CSS:** Use utility classes for styling. Avoid inline styles or separate CSS files unless necessary.
4. **Feature Isolation:** When adding a new feature, keep its components, hooks, and types within `src/features/<feature-name>`.

## Common Patterns

### Firestore Data Fetching
- Use `useEffect` inside a custom hook to subscribe to Firestore data.
- Always handle `loading` and `error` states.
- **Example:**
  ```typescript
  // src/features/boxes/hooks/useBoxes.ts
  useEffect(() => {
    const q = query(collection(db, 'moves', moveId, 'boxes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boxesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Box[];
      setBoxes(boxesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [moveId]);
  ```

### Context Usage
- Prefer small, focused contexts (e.g., `BoxesContext`) over a single global store.
- Wrap providers in `src/App.tsx` or `src/main.tsx` as appropriate.

## "Gotchas" & Constraints
- **Environment Variables:** Must start with `VITE_`. Accessed via `import.meta.env`.
- **Firebase Auth:** User object might be null initially. Always check `loading` state from `useAuth`.
- **Imports:** Use the `@/` alias for imports from `src/`.
  - Correct: `import Button from '@/components/ui/button';`
  - Incorrect: `import Button from '../../components/ui/button';`

## Documentation Maintenance
- When modifying code, check if `AGENTS.md` or `docs/Master_Documentation` needs updating.
- Keep comments concise and focused on "why", not "what".
