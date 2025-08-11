[{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '{ isOpen: boolean; onClose: () => void; onAddExpense: (expense: Expense) => void; categories: Category[]; expense: Expense | null; isEditing: boolean; }' is not assignable to type 'IntrinsicAttributes & AddExpenseModalProps'.\n  Property 'onAddExpense' does not exist on type 'IntrinsicAttributes & AddExpenseModalProps'.",
	"source": "ts",
	"startLineNumber": 366,
	"startColumn": 11,
	"endLineNumber": 366,
	"endColumn": 23
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '{ isOpen: boolean; onClose: () => void; onSave: (category: Category) => void; category: Category | null; isEditing: boolean; }' is not assignable to type 'IntrinsicAttributes & CategoryModalProps'.\n  Property 'onSave' does not exist on type 'IntrinsicAttributes & CategoryModalProps'.",
	"source": "ts",
	"startLineNumber": 378,
	"startColumn": 11,
	"endLineNumber": 378,
	"endColumn": 17
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '{ isOpen: boolean; onClose: () => void; onSave: (budgetData: { totalEstimatedAmount: number; moveType: MoveType; }) => void; initialBudget: { totalEstimatedAmount: number; moveType: MoveType; }; }' is not assignable to type 'IntrinsicAttributes & SetupBudgetModalProps'.\n  Property 'onSave' does not exist on type 'IntrinsicAttributes & SetupBudgetModalProps'.",
	"source": "ts",
	"startLineNumber": 386,
	"startColumn": 11,
	"endLineNumber": 386,
	"endColumn": 17
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '{ isOpen: boolean; onClose: () => void; onSetup: (categoryBudgets: { [key: string]: number; }) => void; categories: Category[]; }' is not assignable to type 'IntrinsicAttributes & SetupExpensesModalProps'.\n  Property 'onSetup' does not exist on type 'IntrinsicAttributes & SetupExpensesModalProps'.",
	"source": "ts",
	"startLineNumber": 393,
	"startColumn": 11,
	"endLineNumber": 393,
	"endColumn": 18
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '{ isOpen: boolean; onClose: () => void; expense: Expense | null; category: Category | undefined; }' is not assignable to type 'IntrinsicAttributes & ExpenseDetailModalProps'.\n  Property 'category' does not exist on type 'IntrinsicAttributes & ExpenseDetailModalProps'.",
	"source": "ts",
	"startLineNumber": 401,
	"startColumn": 11,
	"endLineNumber": 401,
	"endColumn": 19
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '{ isOpen: boolean; onClose: () => void; onExpenseExtracted: (expenseData: Omit<Expense, \"id\">) => void; categories: Category[]; }' is not assignable to type 'IntrinsicAttributes & ReceiptScanModalProps'.\n  Property 'onExpenseExtracted' does not exist on type 'IntrinsicAttributes & ReceiptScanModalProps'.",
	"source": "ts",
	"startLineNumber": 407,
	"startColumn": 11,
	"endLineNumber": 407,
	"endColumn": 29
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'BUDGET_TEMPLATES' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 5,
	"startColumn": 30,
	"endLineNumber": 5,
	"endColumn": 46,
	"tags": [
		1
	]
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'setupBudgetAmount' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 52,
	"startColumn": 10,
	"endLineNumber": 52,
	"endColumn": 27,
	"tags": [
		1
	]
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'setSetupBudgetAmount' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 52,
	"startColumn": 29,
	"endLineNumber": 52,
	"endColumn": 49,
	"tags": [
		1
	]
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'setupMoveType' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 53,
	"startColumn": 10,
	"endLineNumber": 53,
	"endColumn": 23,
	"tags": [
		1
	]
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'setSetupMoveType' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 53,
	"startColumn": 25,
	"endLineNumber": 53,
	"endColumn": 41,
	"tags": [
		1
	]
},{
	"resource": "/d:/codebase/CodebaseRestructure/src/features/budget/components/Budgeting.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'closeAllModals' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 169,
	"startColumn": 9,
	"endLineNumber": 169,
	"endColumn": 23,
	"tags": [
		1
	]
}]