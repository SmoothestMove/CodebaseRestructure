hook.js:608 Move operation error: FirebaseError: Missing or insufficient permissions.
overrideMethod @ hook.js:608
handleMoveOperation @ AuthPage.tsx:136
await in handleMoveOperation
completeAuthFlow @ AuthPage.tsx:170
await in completeAuthFlow
handleEmailAuth @ AuthPage.tsx:222Understand this error
hook.js:608 Auth flow completion error: Error: Failed to new move: Missing or insufficient permissions.
    at handleMoveOperation (AuthPage.tsx:137:13)
    at async completeAuthFlow (AuthPage.tsx:170:23)
    at async handleEmailAuth (AuthPage.tsx:222:9)
    at async handleSubmit (AuthPage.tsx:300:5)
overrideMethod @ hook.js:608
completeAuthFlow @ AuthPage.tsx:192
await in completeAuthFlow
handleEmailAuth @ AuthPage.tsx:222Understand this error
webchannel_blob_es2018.js:69  POST https://firestore.googleapis.com/google.firestore.v1.Firestore/Write/channel?VER=8&database=projects%2Fsmoothmoves-60679%2Fdatabases%2F(default)&gsessionid=wVZxr4obDUqSj358VtWDKGSqwNayk1YVPhnxJPJrmUc&SID=8GE0zjn3NQIalAUNeA3C_Q&RID=17116&TYPE=terminate&zx=atzutyclui9z 400 (Bad Request)