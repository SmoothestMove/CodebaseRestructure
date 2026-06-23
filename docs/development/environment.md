# Environment Setup

This project relies on Vite environment variables. Use the provided `.env.example` as the canonical list of keys, then create a `.env.local` file for your personal values:

```bash
cp .env.example .env.local
```

Only `.env.local` should contain real secrets. It is already ignored by git.

## Required Keys

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY`

## Optional Keys

- `VITE_MINDEE_API_KEY` — enables receipt OCR in the Budget feature.
- `VITE_PICOVOICE_ACCESS_KEY` — enables wake-word detection for MARVIN.

## Verification

Run `npm run env:verify` to validate that the required keys are present. The script checks `.env.local` first and falls back to `.env` if you prefer that file for CI or staging.

CI can run the same command to fail fast when variables are missing.

## Runtime Mapping

`src/lib/config/constants.tsx` reads the Vite variables via `import.meta.env`. High-risk follow-up work will add explicit runtime guards so the app surfaces friendly errors when keys are missing.
