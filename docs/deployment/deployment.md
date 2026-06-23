# Vercel Deployment

- Build command: `npm run build`
- Output directory: `dist/`
- Framework preset: Vite

## Environment Variables (Vercel Project Settings → Environment Variables)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY`
- `VITE_MINDEE_API_KEY`
- `VITE_PICOVOICE_ACCESS_KEY` (optional)

## Notes
- Use `npm start` locally for a production-like preview (Vite preview).
- Ensure Firebase Storage rules are deployed if you use Storage for uploads (see `firebase/storage.rules`).

