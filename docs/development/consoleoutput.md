hook.js:608 Email auth error: FirebaseError: Firebase: Error (auth/invalid-credential).
    at createErrorInternal (assert.ts:146:55)
    at _fail (assert.ts:65:9)
    at _performFetchWithErrorHandling (index.ts:243:9)
    at async _performSignInRequest (index.ts:264:26)
    at async _signInWithCredential (credential.ts:44:20)
    at async handleEmailAuth (AuthPage.tsx:206:26)
    at async handleSubmit (AuthPage.tsx:300:5)
overrideMethod	@	hook.js:608
handleEmailAuth	@	AuthPage.tsx:225
await in handleEmailAuth		
handleSubmit	@	AuthPage.tsx:300
executeDispatch	@	react-dom-client.development.js:16368
runWithFiberInDEV	@	react-dom-client.development.js:1519
processDispatchQueue	@	react-dom-client.development.js:16418
(anonymous)	@	react-dom-client.development.js:17016
batchedUpdates$1	@	react-dom-client.development.js:3262
dispatchEventForPluginEventSystem	@	react-dom-client.development.js:16572
dispatchEvent	@	react-dom-client.development.js:20658
dispatchDiscreteEvent	@	react-dom-client.development.js:20626