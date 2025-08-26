# Codebase Structure

This document provides an overview of the codebase structure for the application.

## Root Structure

- `src/` - Main source code directory
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point

## Core Directories

### 1. `components/`
Reusable UI components organized by functionality:
- `common/` - General-purpose components (15 items)
- `design-system/` - Core design system components (12 items)
- `layout/` - Layout-related components (4 items)
- `navigation/` - Navigation components (1 item)
- `search/` - Search-related components (1 item)

### 2. `features/`
Feature-based modules containing self-contained functionality:
- `auth/` - Authentication features (8 items)
- `boxes/` - Box management (11 items)
- `budget/` - Budgeting functionality (33 items)
- `calendar/` - Calendar features (11 items)
- `feedback/` - User feedback system (1 item)
- `marvin/` - Marvin-related features (15 items)
- `moves/` - Move management
- `owners/` - Owner management (10 items)
- `planner/` - Planning features (21 items)
- `products/` - Product management (8 items)
- `settings/` - Application settings (8 items)
- `storage/` - Storage management
- `timeline/` - Timeline features

### 3. `hooks/`
Custom React hooks:
- `useAuth.ts` - Authentication hook
- `useDocumentTitle.ts` - Document title management
- `useLocalStorage.tsx` - Local storage utilities

### 4. `lib/`
Core libraries and utilities:
- `animations/` - Animation utilities (3 items)
- `api/` - API-related utilities (2 items)
- `config/` - Configuration files (2 items)
- `gestures/` - Gesture handling (3 items)
- `helpers/` - Helper functions (2 items)
- `services/` - Service layer
- `utils/` - Utility functions (1 item)

### 5. `pages/`
Application pages (currently empty)

### 6. `types/`
TypeScript type definitions:
- `index.ts` - Main type definitions

### 7. `utils/`
Utility functions:
- `api.ts` - API utilities
- `format.ts` - Formatting utilities
- `index.ts` - Utility exports

## Architecture Notes

- The application follows a feature-based architecture with clear separation of concerns
- Core functionality is organized into feature modules within the `features/` directory
- Reusable UI components are maintained in the `components/` directory
- Shared utilities and hooks are kept in their respective root directories
- TypeScript is used throughout the codebase for type safety

## Entry Points

- `main.tsx` - Application entry point
- `App.tsx` - Root component that renders the application

## Development Guidelines

1. Place new features in the `features/` directory
2. Reusable components should go in `components/`
3. Keep utility functions in `utils/` or `lib/` as appropriate
4. Maintain type definitions in the `types/` directory
5. Follow the existing patterns for consistency
