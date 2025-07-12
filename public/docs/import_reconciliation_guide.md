# Import Reconciliation Guide

This document provides a detailed mapping of old import paths to their new locations for every affected file in the codebase. Use this as your checklist to ensure the application builds correctly after refactoring.

## 1. Core Application Files (src/)

### File: `src/App.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `./components/Navbar` | `@/components/layout/Header` |
| `./context/AuthContext` | `@/features/auth/hooks/AuthContext` |
| `./contexts/MoveContext` | `@/features/settings/hooks/MoveContext` |
| `./components/ProtectedRoute` | `@/features/auth/components/ProtectedRoute` |
| `./pages/DashboardPage` | `@/features/settings/pages/DashboardPage` |
| `./pages/AuthPage` | `@/features/auth/pages/AuthPage` |
| `./pages/BoxesListPage` | `@/features/boxes/pages/BoxesListPage` |
| `./pages/BoxDetailsPage` | `@/features/boxes/pages/BoxDetailsPage` |
| `./pages/PackBoxPage` | `@/features/boxes/pages/PackBoxPage` |
| `./pages/ManageOwnersPage` | `@/features/owners/pages/ManageOwnersPage` |
| `./pages/ManageSpacesPage` | `@/features/owners/pages/ManageSpacesPage` |
| `./pages/ScanPage` | `@/features/boxes/pages/ScanPage` |
| `./pages/SettingsPage` | `@/features/settings/pages/SettingsPage` |
| `./pages/TruckLoadPage` | `@/features/boxes/pages/TruckLoadPage` |
| `./hooks/useTheme` | `@/hooks/useTheme` |

## 2. Shared Components

### File: `src/components/layout/Header/index.tsx` (was Navbar.tsx)

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../context/AuthContext` | `@/features/auth/hooks/AuthContext` |
| `../../contexts/MoveContext` | `@/features/settings/hooks/MoveContext` |
| `../../hooks/useTheme` | `@/hooks/useTheme` |

## 3. Feature: Authentication (src/features/auth/)

### File: `src/features/auth/pages/AuthPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../context/AuthContext` | `@/features/auth/hooks/AuthContext` |
| `../../services/moveService` | `@/features/settings/services/moveService` |
| `../../components/Input` | `@/components/common/Input` |
| `../../components/Button` | `@/components/common/Button` |
| `../../components/Alert` | `@/components/common/Alert` |

### File: `src/features/auth/components/ProtectedRoute.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../context/AuthContext` | `@/features/auth/hooks/AuthContext` |

### File: `src/features/auth/hooks/AuthContext.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../services/moveService` | `@/features/settings/services/moveService` |
| `../types` | `@/types` |

## 4. Feature: Box Management (src/features/boxes/)

### File: `src/features/boxes/pages/BoxesListPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../hooks/useBoxes` | `../hooks/useBoxes` |
| `../../components/BoxCard` | `../components/BoxCard` |
| `../../components/Button` | `@/components/common/Button` |
| `../../types` | `@/types` |

### File: `src/features/boxes/pages/BoxDetailsPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../hooks/useBoxes` | `../hooks/useBoxes` |
| `../../components/QRCodeDisplay` | `@/components/common/QRCodeDisplay` |
| `../../components/Button` | `@/components/common/Button` |
| `../../components/Alert` | `@/components/common/Alert` |
| `../../types` | `@/types` |

### File: `src/features/boxes/pages/PackBoxPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../hooks/useBoxes` | `../hooks/useBoxes` |
| `../../hooks/useOwners` | `@/features/owners/hooks/useOwners` |
| `../../components/Input` | `@/components/common/Input` |
| `../../components/Textarea` | `@/components/common/Textarea` |
| `../../components/Select` | `@/components/common/Select` |
| `../../components/Button` | `@/components/common/Button` |
| `../../components/Alert` | `@/components/common/Alert` |
| `../../types` | `@/types` |

### File: `src/features/boxes/pages/ScanPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../components/QRCodeScanner` | `../components/QRCodeScanner` |

### File: `src/features/boxes/pages/TruckLoadPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../hooks/useBoxes` | `../hooks/useBoxes` |
| `../../components/TruckDiagram` | `@/components/common/TruckDiagram` |
| `../../components/TruckZoneSelectorModal` | `../components/TruckZoneSelectorModal` |
| `../../components/Button` | `@/components/common/Button` |
| `../../types` | `@/types` |

### File: `src/features/boxes/components/TruckZoneSelectorModal.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../../components/Modal` | `@/components/common/Modal` |
| `../../../components/TruckDiagram` | `@/components/common/TruckDiagram` |
| `../../../components/Button` | `@/components/common/Button` |
| `../../../types` | `@/types` |

### File: `src/features/boxes/hooks/useBoxes.ts`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../services/boxService` | `../services/boxService` |
| `../context/AuthContext` | `@/features/auth/hooks/AuthContext` |
| `../contexts/MoveContext` | `@/features/settings/hooks/MoveContext` |
| `../types` | `@/types` |

## 5. Feature: Owner & Space Management (src/features/owners/)

### File: `src/features/owners/pages/ManageOwnersPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../hooks/useOwners` | `../hooks/useOwners` |
| `../../components/OwnerCard` | `../components/OwnerCard` |
| `../../components/AddOwnerModal` | `../components/AddOwnerModal` |
| `../../components/Button` | `@/components/common/Button` |
| `../../components/PrintLabelsModal` | `../components/PrintLabelsModal` |
| `../../types` | `@/types` |

### File: `src/features/owners/pages/ManageSpacesPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../hooks/useOwners` | `../hooks/useOwners` |
| `../../components/OwnerCard` | `../components/OwnerCard` |
| `../../components/AddSpaceModal` | `../components/AddSpaceModal` |
| `../../components/Button` | `@/components/common/Button` |
| `../../types` | `@/types` |

### File: `src/features/owners/components/AddOwnerModal.tsx`
*And other modals like AddSpaceModal, PrintLabelsModal, etc.*

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../../components/Modal` | `@/components/common/Modal` |
| `../../../components/Input` | `@/components/common/Input` |
| `../../../components/Button` | `@/components/common/Button` |

### File: `src/features/owners/hooks/useOwners.ts`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../services/ownerService` | `../services/ownerService` |
| `../context/AuthContext` | `@/features/auth/hooks/AuthContext` |
| `../contexts/MoveContext` | `@/features/settings/hooks/MoveContext` |
| `../types` | `@/types` |

## 6. Feature: Settings & Move Management (src/features/settings/)

### File: `src/features/settings/pages/DashboardPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../contexts/MoveContext` | `../hooks/MoveContext` |
| `../../components/Button` | `@/components/common/Button` |

### File: `src/features/settings/pages/SettingsPage.tsx`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../../hooks/useSettings` | `../hooks/useSettings` |
| `../../hooks/useTheme` | `@/hooks/useTheme` |
| `../../components/Button` | `@/components/common/Button` |
| `../../components/Select` | `@/components/common/Select` |
| `../../components/Alert` | `@/components/common/Alert` |

### File: `src/features/settings/hooks/useSettings.ts`

| Original Import Path | New Import Path |
|---------------------|-----------------|
| `../services/settingsService` | `../services/settingsService` |
| `../context/AuthContext` | `@/features/auth/hooks/AuthContext` |
| `../types` | `@/types` |

---

**Note:** Use this guide systematically to update all import statements in your codebase. Consider using find-and-replace tools or IDE refactoring features to make the process more efficient.