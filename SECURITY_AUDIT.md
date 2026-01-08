# Security Audit Report

**Date:** [Current Date]
**Auditor:** Jules (AI Agent)
**Project:** Smooth Moves
**Scope:** Client-side Codebase, Authentication Flows, Move Logic, Data Access Patterns

---

## Executive Summary

This audit focused on the security of the Smooth Moves application, specifically analyzing the authentication mechanisms, the `moveId` based isolation, and data access patterns.

**Critical Finding:** The `firestore.rules` file is missing from the repository. This prevents a complete audit of the server-side access controls, which are the primary line of defense for a Firebase application. Without verifying these rules, we must assume that data isolation relies entirely on client-side logic, which is insecure by definition.

**High-Level Risks:**
1.  **Server-Side Access Control (Unknown/Unverified):** Missing rules file implies potential for unauthorized data access if default rules are insecure.
2.  **Move Code Brute-Force:** The 6-character move code used for joining is susceptible to brute-force attacks.
3.  **Data Isolation:** Isolation between moves relies on the `moveId` parameter in client-side queries. Without server-side enforcement, this can be bypassed.

---

## Detailed Findings

### 1. Missing `firestore.rules` (Critical)

*   **Observation:** The `firebase/` directory contains `firebase.json` which points to `firestore.rules`, but the file itself is absent from the repository.
*   **Implication:** It is impossible to verify if the application enforces:
    *   **Authentication:** That users must be logged in to read/write data.
    *   **Authorization:** That users can only access data belonging to the `move` they are a participant of.
    *   **Validation:** That data written to the database adheres to the expected schema and constraints.
*   **Risk:** **Critical**. If the deployed rules are in "Test Mode" (open to all) or poorly defined, any malicious user can read or overwrite all data in the system.

### 2. Move Joining Logic (`moveCode`)

*   **Observation:** `moveService.ts` implements a `joinMove` function that takes a 6-character alphanumeric `moveCode`.
    *   The code space is approx. 1 billion combinations ($32^6$).
    *   There is no visible rate-limiting mechanism in the client (and unknown on the server).
*   **Implication:** An attacker could script a brute-force attack to try random codes. Once a valid code is found, `joinMove` immediately adds the attacker's `userId` to the move's `participants` list.
*   **Risk:** **High**. An attacker could join active moves without invitation, gaining access to all inventory, location, and owner data.
*   **Logic Flaw:** `generateMoveCode` does not check for uniqueness. If a collision occurs (two moves have the same code), `joinMove` blindly takes `querySnapshot.docs[0]`. This could prevent legitimate users from joining the intended move.

### 3. Data Isolation (`moveId`)

*   **Observation:** Data access hooks (e.g., `useBoxes.ts`, `useOwners.ts`) rely on the `moveId` context value to construct Firestore paths:
    ```typescript
    // useBoxes.ts
    const q = query(collection(db, 'moves', moveId, 'boxes'), ...);
    ```
*   **Implication:** The "isolation" is purely structural. If a user manually modifies the `moveId` in their local storage or application state, the client will attempt to fetch data from that other move.
*   **Risk:** **High** (dependent on rules). If `firestore.rules` does not explicitly check `request.auth.uid in get(/databases/$(database)/documents/moves/$(moveId)).data.participants`, then data isolation is non-existent.

### 4. Client-Side Authentication

*   **Observation:** `AuthContext.tsx` and `ProtectedRoute.tsx` correctly handle client-side routing protection. `moveService.ts` handles specific permission errors (`permission-denied`), suggesting that *some* rules are likely active in the deployed environment.
*   **Status:** **Good** (Client-side implementation is standard).

---

## Recommendations

### Immediate Actions

1.  **Commit `firestore.rules`:** Locate the active security rules and commit them to the repository immediately. This is the only way to ensure the application is secure.
2.  **Verify Participant Checks:** Ensure every read/write rule for subcollections (`boxes`, `owners`, etc.) includes a check similar to:
    ```javascript
    match /moves/{moveId}/{document=**} {
      allow read, write: if request.auth != null &&
        request.auth.uid in get(/databases/$(database)/documents/moves/$(moveId)).data.participants;
    }
    ```

### Strategic Improvements

1.  **Rate Limiting:** Implement Firebase App Check or use Cloud Functions for the `joinMove` logic to enforce rate limiting and prevent brute-force attacks.
2.  **Move Code Uniqueness:** Update `createMove` to use a Firestore transaction that ensures the generated `moveCode` is unique before creating the document.
3.  **Invitation Flow:** Consider adding an "Approval" step or a password requirement for joining a move, rather than relying solely on the code.

---

## Conclusion

The client-side architecture follows standard patterns, but the security of the entire system hinges on the missing `firestore.rules` file. Without verifying these rules, the application cannot be considered secure. The "Security by Capability" model used for joining moves (via a short code) presents a significant risk of unauthorized access if not paired with strict rate limiting and monitoring.
