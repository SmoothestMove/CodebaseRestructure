✅ RESOLVED: Budget button console error fixed

Previous Error: Triggered when tapping the Budget button on the sidebar
- Received `false` for a non-boolean attribute `loading`.
- Fixed by changing `loading={isSubmitting}` to `isLoading={isSubmitting}` in SetupBudgetModal.tsx:237

Status: No longer reproducing - React prop warning eliminated. 