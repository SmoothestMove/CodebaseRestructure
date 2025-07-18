# Plan for Google Auth Cross-Origin-Opener-Policy Error

## Summary
When using the 'Log in with Google' option on the auth page, the following error appears in the browser dev tools:

```
Cross-Origin-Opener-Policy policy would block the window.closed call.
Cross-Origin-Opener-Policy policy would block the window.close call.
```

**Files/Lines:** index-DB5HYihi.js:3199, :3304, :3184
**Impact:** This does not interfere with the actual login process.

## Possible Causes
- Browser security policies (Cross-Origin-Opener-Policy) blocking window.close/closed from OAuth popup windows.
- The Google OAuth flow may involve opening a new window that is subject to stricter browser security rules.
- The frontend code may be attempting to close or check the closed state of a window that is not allowed by the browser due to cross-origin restrictions.

## Investigation Steps
1. Review the code at the referenced lines in `index-DB5HYihi.js` for window.close/closed usage.
2. Check if the OAuth popup is being opened with correct window features and if the redirect URI is on the same origin.
3. Investigate if this warning is browser-specific or appears across Chrome, Firefox, etc.
4. Research if this is a known issue with the auth library or Google OAuth.
5. Check for any recent changes to browser policies on Cross-Origin-Opener-Policy.

## Potential Mitigations
- Update the OAuth window handling to comply with modern browser security policies.
- Suppress or handle the error gracefully if it does not impact user experience.
- Document as a known issue if it cannot be resolved without breaking functionality.

## Status
- [ ] Investigation started
- [ ] Root cause identified
- [ ] Fix implemented (if needed)
- [ ] README updated

## Notes
- This error is non-blocking and does not affect user login.
- Track any user reports of issues related to Google login for further investigation.

---

### Error Log Example
```
Cross-Origin-Opener-Policy policy would block the window.closed call.
e @ index-DB5HYihi.js:3199
Cross-Origin-Opener-Policy policy would block the window.closed call.
e @ index-DB5HYihi.js:3199
Cross-Origin-Opener-Policy policy would block the window.close call.
close @ index-DB5HYihi.js:3304
cleanUp @ index-DB5HYihi.js:3199
unregisterAndCleanUp @ index-DB5HYihi.js:3184
resolve @ index-DB5HYihi.js:3184
onAuthEvent @ index-DB5HYihi.js:3184
```
