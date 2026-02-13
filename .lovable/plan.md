
## Fix: Security Tab Blank + Trial Admin Demotion

Two bugs to fix in `src/pages/ModerationPanel.tsx`:

### Bug 1: Security Tab Shows Nothing

The `SecurityTab` component is fully implemented (lines 740-867) with PIN management UI, but it is never rendered in the main content area. The sidebar button sets `activeTab` to `'security'`, but there is no corresponding `{activeTab === 'security' && <SecurityTab />}` block alongside the other tab renders.

**Fix:** Add the missing render block after the Stats tab (around line 2266):
```jsx
{activeTab === 'security' && (
  <SecurityTab />
)}
```

### Bug 2: Cannot Demote Trial Admins

The `UserDetailsPanel` action buttons have a condition on line 486: `user.role !== 'admin' && user.role !== 'creator'`. Trial admins (`role === 'trial_admin'`) pass this check and land in the "non-admin" branch, which shows Promote but no Demote/Revoke button.

**Fix:** Add a "Revoke Trial Admin" button in the non-admin branch, visible when `user.role === 'trial_admin'` and the current admin is not a trial admin themselves. This button will call the existing `handleDeop` function (which sends `action: 'deop'` to the edge function, already capable of demoting any role).

The button will appear next to "Promote to Full Admin":
```jsx
{!isTrialAdmin && user.role === 'trial_admin' && (
  <Button onClick={onDeop} variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2">
    <UserCog className="w-4 h-4" /> Revoke Trial Admin
  </Button>
)}
```

### Files Modified
- `src/pages/ModerationPanel.tsx` only (two small edits)

### No backend changes needed
The `deop` action in the edge function already handles demoting any admin role back to user.
