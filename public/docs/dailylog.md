# Daily Log

## 2025-07-18
- **Issue:** Cross-Origin-Opener-Policy error occurs in dev tools when using 'Log in with Google'.
- **Details:**
    - Error: `Cross-Origin-Opener-Policy policy would block the window.closed call.` and `window.close call.`
    - File/Line: index-DB5HYihi.js:3199, :3304, :3184
    - Impact: Does not block Google login.
    - Plan for investigation created: `docs/planForGoogleAuthError.md`
- **Action:** Documented error, created investigation plan, and will update README with known issue if needed.
