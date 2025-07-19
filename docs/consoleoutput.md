## Direct Console Output:

### Category of Message
    - Error
    - Warning
    - Info

### Message

----------------------------------

## Supplemental Information

1. What was done to cause the error to occur: npm run dev and attempted to reach app
2. What Page was open when the error occurred: 
3. What was the expected behavior: 
4. What was the actual behavior: 
5. What other indicators were present (in app errors, blank screen, etc.):
6. Did the error disrupt the user's workflow (prevented login, prevented access to a feature, etc.)
    - If yes, what was impacted:
    - If no, log as such 

Error:   Failed to scan for dependencies from entries:
  D:/codebase/CodebaseRestructure/index.html

  X [ERROR] Expected ";" but found "size"

    src/features/budget/components/BudgetSetup.tsx:297:37:
      297 │       title="Set Your Moving Budget" size="lg"
          │                                      ~~~~
          ╵                                      ;


    at failureErrorWithLog (D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:1463:15)
    at D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:924:25
    at runOnEndCallbacks (D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:1303:45)
    at buildResponseToResult (D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:922:7)
    at D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:934:9
    at new Promise (<anonymous>)
    at requestCallbacks.on-end (D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:933:54)
    at handleRequest (D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:626:17)
    at handleIncomingPacket (D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:651:7)
    at Socket.readFromStdout (D:\codebase\CodebaseRestructure\node_modules\esbuild\lib\main.js:579:7)


    [{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/BudgetSetup.tsx",
	"owner": "typescript",
	"code": "2304",
	"severity": 8,
	"message": "Cannot find name 'title'.",
	"source": "ts",
	"startLineNumber": 297,
	"startColumn": 7,
	"endLineNumber": 297,
	"endColumn": 12
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/BudgetSetup.tsx",
	"owner": "typescript",
	"code": "1005",
	"severity": 8,
	"message": "';' expected.",
	"source": "ts",
	"startLineNumber": 297,
	"startColumn": 38,
	"endLineNumber": 297,
	"endColumn": 42
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/BudgetSetup.tsx",
	"owner": "typescript",
	"code": "2304",
	"severity": 8,
	"message": "Cannot find name 'size'.",
	"source": "ts",
	"startLineNumber": 297,
	"startColumn": 38,
	"endLineNumber": 297,
	"endColumn": 42
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/BudgetSetup.tsx",
	"owner": "typescript",
	"code": "2365",
	"severity": 8,
	"message": "Operator '>' cannot be applied to types 'string' and 'Element'.",
	"source": "ts",
	"startLineNumber": 297,
	"startColumn": 43,
	"endLineNumber": 472,
	"endColumn": 14
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/BudgetSetup.tsx",
	"owner": "typescript",
	"code": "1128",
	"severity": 8,
	"message": "Declaration or statement expected.",
	"source": "ts",
	"startLineNumber": 473,
	"startColumn": 5,
	"endLineNumber": 473,
	"endColumn": 7
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/BudgetSetup.tsx",
	"owner": "typescript",
	"code": "1109",
	"severity": 8,
	"message": "Expression expected.",
	"source": "ts",
	"startLineNumber": 474,
	"startColumn": 3,
	"endLineNumber": 474,
	"endColumn": 4
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/BudgetSetup.tsx",
	"owner": "typescript",
	"code": "1128",
	"severity": 8,
	"message": "Declaration or statement expected.",
	"source": "ts",
	"startLineNumber": 475,
	"startColumn": 1,
	"endLineNumber": 475,
	"endColumn": 2
}]