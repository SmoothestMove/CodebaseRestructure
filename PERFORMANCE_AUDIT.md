# Performance Audit Report ⚡

This document outlines the findings of a performance audit conducted on the Smooth Moves codebase. Each entry details a specific performance issue, its impact, and a recommended solution.

## Asset Optimization & Code Structure

### [PERF-001] Lack of Route-Based Code Splitting
**Location:** `src/App.tsx` (Lines 2-16 & 111-136)
**Severity:** 🔴 Critical

**The Issue:**
All page components (`DashboardPage`, `ScanPage`, `BoxDetailsPage`, etc.) are imported statically at the top of `App.tsx`. They are then used directly in the `<Route>` definitions.

**Why it matters:**
This approach bundles all application pages into a single, monolithic JavaScript file. When a user first visits the application, they are forced to download the code for every single page, even if they only ever access the dashboard. This dramatically increases the initial load time and wastes bandwidth. For an application with many features, the initial bundle size can become enormous, leading to a poor user experience, especially on mobile or slow networks.

**Recommended Fix:**
Implement route-based code splitting using `React.lazy()` and `React.Suspense`. This will ensure that the code for each page is only downloaded when the user navigates to it.

```tsx
// Current (Slow)
import DashboardPage from '@/features/settings/pages/DashboardPage';
import ScanPage from '@/features/boxes/pages/ScanPage';
// ... more static imports

const App: React.FC = () => {
  return (
    // ...
    <Route path="scan" element={<ScanPage />} />
    // ...
  );
};

// Recommended (Fast)
import React, { Suspense, lazy } from 'react';
import { BrandedLoader } from '@/components/design-system'; // Use a lightweight loader

// Dynamically import page components
const DashboardPage = lazy(() => import('@/features/settings/pages/DashboardPage'));
const ScanPage = lazy(() => import('@/features/boxes/pages/ScanPage'));
// ... lazy load all other pages

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <Suspense fallback={<BrandedLoader text="Loading page..." />}>
        <Routes>
          {/* ... routes */}
          <Route path="scan" element={<ScanPage />} />
          {/* ... other routes */}
        </Routes>
      </Suspense>
    </SettingsProvider>
  );
};
```

### [PERF-002] Large static asset included in the public directory
**Location:** `public/porcupine_params.pv`
**Severity:** 🔴 Critical

**The Issue:**
The file `porcupine_params.pv` is nearly 1MB in size and is located in the `public` directory. Files in this directory are typically copied directly to the build output and are loaded by the browser on initial page load.

**Why it matters:**
Loading a 1MB file can significantly slow down the initial page load time, especially for users on slower network connections. This asset blocks the critical rendering path, meaning the user will see a blank screen for longer. Since this appears to be a model for the Porcupine wake word engine, it's likely only needed for a specific feature and should not be loaded upfront.

**Recommended Fix:**
Move the asset out of the `public` directory and load it dynamically when the feature that requires it is initialized.

```tsx
// Recommended (Fast)

// 1. Move the file from `public` to a directory like `src/assets`.

// 2. In the component or service that uses Porcupine,
//    dynamically import the model file.
const initializePorcupine = async () => {
  // Use a dynamic import to load the file on demand
  const porcupineModel = await import('@/assets/porcupine_params.pv?url');

  // Now, initialize Porcupine with the dynamically loaded model
  // ...
};
```

## Rendering & Data Fetching

### [PERF-003] Inefficient fetching and real-time subscription for the entire 'boxes' collection
**Location:** `src/features/boxes/hooks/useBoxes.ts` (Lines 41-63)
**Severity:** 🟡 Moderate

**The Issue:**
The `useBoxes` hook fetches the entire collection of boxes for a given `moveId` and subscribes to real-time updates using a single `onSnapshot` listener. The entire list of boxes is then stored in a single state array.

**Why it matters:**
As the number of boxes in a move grows, this pattern becomes increasingly inefficient. Every time a single box is added, updated, or removed, the `onSnapshot` listener returns the *entire* updated collection. This forces the client to re-download and process the full dataset, leading to several problems:
- **High Bandwidth Usage:** Transmits the full dataset on every minor change, which is wasteful.
- **Excessive Re-renders:** Any component that consumes the `useBoxes` hook will re-render whenever *any* box in the collection changes, even if that component only cares about a small subset of the data.
- **Client-Side Strain:** Storing and processing a potentially massive array of box objects in memory can lead to UI jank and slow performance, especially on less powerful devices.

**Recommended Fix:**
Refactor the data fetching logic to be more granular. Instead of fetching the entire collection at once, components should only fetch the data they specifically need.

```tsx
// Current (Slow)
useEffect(() => {
  if (!moveId) return;

  const q = query(
    collection(db, 'moves', moveId, 'boxes'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q,
    (snapshot) => {
      const boxesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Box[];
      setBoxes(boxesData);
      setIsLoading(false);
    },
    // ... error handling
  );

  return () => unsubscribe();
}, [moveId]);

// Recommended (Fast)
// Option 1: Implement pagination for lists.
// Option 2: Create a hook to fetch a single document.
// This allows components to subscribe to only the data they need.

// Example for a component that needs a single box:
export const useBox = (moveId: string, boxId: string) => {
  const [box, setBox] = useState<Box | null>(null);
  // ... loading and error state

  useEffect(() => {
    if (!moveId || !boxId) return;

    const docRef = doc(db, 'moves', moveId, 'boxes', boxId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setBox({ id: doc.id, ...doc.data() } as Box);
      } else {
        // Handle case where box doesn't exist
      }
    });

    return () => unsubscribe();
  }, [moveId, boxId]);

  return { box /*, isLoading, error */ };
};
```
