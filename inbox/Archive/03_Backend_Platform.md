# Backend Platform Guide

## Overview
Smooth Moves uses **Firebase** as a serverless backend.
- **Auth:** Firebase Authentication.
- **Database:** Cloud Firestore.
- **Storage:** Cloud Storage for Firebase (images).
- **Hosting:** Firebase Hosting (optional, prod uses Vercel).

## Data Model (Firestore)

The database is structured around the `moves` collection. Most data is nested under a specific move document to ensure separation of concerns and easy access control.

### Collections Structure
```
moves/{moveId}
├── boxes/{boxId}             # Box details (QR code, contents, status)
├── owners/{ownerId}          # People/Rooms assigned to boxes
├── calendar_events/{eventId} # Calendar entries
├── expenses/{expenseId}      # Budget items
├── categories/{categoryId}   # Budget categories
├── budget/{budgetDoc}        # Aggregate budget info
├── plannerTasks/{taskId}     # Tasks for the move
├── plannerTimeframes/{tfId}  # Time groupings for tasks
└── plannerConfig/{configId}  # Planner settings
```

### Global Collections
- `users/{userId}`: User profiles.
- `presence/{presenceId}`: Online status tracking.

## Security Rules (`firestore.rules`)
- **Authentication:** All read/write operations require a valid Firebase Auth user.
- **Move Access:** Access to subcollections of `moves/{moveId}` is restricted to:
  - The creator of the move (`createdBy`).
  - Users listed in the `participants` array of the move document.

## Configuration
- **Environment Variables:**
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

- **Initialization:**
  - Logic resides in `src/lib/config/constants.tsx`.
  - Ensure `.env.local` is present for local development.

## Deployment
- **Frontend:** Vercel (recommended for static hosting).
- **Firebase:** Can be deployed via `firebase deploy`.
  - `firebase.json` handles rewrites for SPA (Single Page App) routing.
