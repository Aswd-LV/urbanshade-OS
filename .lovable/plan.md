

## Moderation Panel Polish -- V3.3.1

A set of quality-of-life improvements and missing features for the moderation panel.

### 1. Fix Version Display

The header on line 2136 still shows "v3.2" instead of "v3.3". Simple text fix.

### 2. User List Enhancements

Currently the user list only shows username, role badge, and registration date. Improvements:

- **Show avatar/initials** with the user's actual `avatar_url` from profiles (if available), falling back to the initial letter
- **Show "last seen"** timestamp (already available as `lastActive` in the `UserData` interface but not displayed)
- **Show online status** indicator (green dot for online users)
- **Show clearance level** badge inline

### 3. Access Log Filtering

The Access Log tab currently has no search or filtering -- just a raw list. Add:

- **Search box** to filter by username or action
- **Action type filter** dropdown (PIN OK, PIN FAIL, PIN SET, etc.)
- **Date range filter** (Last hour, 24h, 7d, All time)
- **Export button** to download logs as JSON

### 4. Mod Logs: Show Admin Who Acted

Currently mod log entries show the action type, reason, and target user ID but not *who* performed the action. The `moderation_actions` table has a `created_by` column. Fetch and display the admin's username next to each log entry.

### 5. Direct Message from User Panel

Add a "Send Message" button in the `UserDetailsPanel` that lets an admin send a direct NAVI message to that specific user (using the existing `navi_message` action with a single target).

### 6. Stats Tab: Trial Admin Count

The Stats tab only counts `role === 'admin'` for the "Admins" stat card. It should also count `trial_admin` roles, or show them separately.

### 7. Quick User Count in Header

Show a small "X users online" indicator in the header bar next to the refresh button, using data already fetched.

---

### Technical Details

**Files modified:**
- `src/pages/ModerationPanel.tsx` -- all UI changes (version fix, user list improvements, access log filters, DM button, online count in header)
- `src/components/moderation/StatsTab.tsx` -- count trial admins separately

**No backend changes needed** -- all data fields already exist in the responses.

**No new dependencies** -- uses existing components (Input, Select, Button).

### Changelog Entry
V3.3.1 -- Panel polish: user list shows avatars/online status/clearance, access log filtering, mod logs show acting admin, direct message from user panel, stats count trial admins.
