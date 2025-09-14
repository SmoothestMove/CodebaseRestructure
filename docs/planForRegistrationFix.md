# Plan for Registration Permission Fix

## Problem Analysis
Users are experiencing Firebase permission errors during registration:
- `FirebaseError: Missing or insufficient permissions` when creating/joining moves
- `POST https://firestore.googleapis.com/google.firestore.v1.Firestore/Write/channel` returning 400 Bad Request
- Errors occur in `handleMoveOperation` function during auth flow completion

## Root Cause
The registration flow attempts to create/join moves immediately after user creation, but:
1. Firebase security rules may not allow new users to write to the moves collection
2. User document creation and move operations happen simultaneously, causing race conditions
3. Authentication state may not be fully propagated when move operations execute

## Implementation Steps

### Step 1: Fix Authentication Flow Timing
- Ensure user document is created and committed before move operations
- Add proper error handling for permission-related failures
- Implement retry logic for transient permission issues

### Step 2: Improve Move Operation Error Handling
- Add specific error messages for permission failures
- Gracefully handle cases where move operations fail but user registration succeeds
- Allow users to create/join moves later if initial attempt fails

### Step 3: Update Firebase Security Rules (if accessible)
- Ensure authenticated users can create moves
- Verify users can join moves they have permission for
- Add proper validation for move creation/joining

### Step 4: Add Fallback Registration Flow
- Allow registration to complete even if move operations fail
- Provide UI for users to create/join moves after successful registration
- Show clear error messages and next steps

## Testing Plan
- Test new user registration with move creation
- Test new user registration with move joining
- Test registration when Firebase rules are restrictive
- Verify error messages are user-friendly
- Test retry mechanisms

## Success Criteria
- Users can successfully register even if move operations fail
- Clear error messages guide users on next steps
- No more "Missing or insufficient permissions" errors during registration
- Registration flow is resilient to Firebase permission issues
