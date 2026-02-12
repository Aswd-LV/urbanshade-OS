## Expand Moderation Panel: Functional Depth Improvements

### Overview

Instead of adding more tabs, this plan makes existing features work better -- following the "more that FUNCTION" principle. Three key improvements to the `/moderation` panel.

### Changes

**1. Multi-Select + Bulk Actions Bar (Personnel tab)**

The backend already supports `bulk_warn`, `bulk_ban`, and `bulk_vip` but there's zero UI for it. Add:

- Checkbox on each user row for multi-select
- "Select All" / "Deselect All" controls
- A floating action bar that appears when 2+ users are selected, showing:
  - "Warn All (X)" button
  - "Ban All (X)" button  
  - "Grant VIP All (X)" button
  - Clear selection button
- Bulk action dialogs (reusing existing warn/ban dialog patterns)

**2. Enhanced Logs Tab with Filters**

Current logs tab just lists everything with no way to filter. Add:

- Filter by action type (warn, ban, unban, op, deop, etc.)
- Filter by date range (last hour, 24h, 7d, 30d, all)
- Search by reason text
- Show the admin who performed the action and the target user (currently just shows raw data)
- Color-coded action type badges (already partially there)

**3. Sidebar Tab Categories**

Organize the 10 tabs into labeled groups for clarity:

- **Users**: Personnel, Reports, Support Tickets
- **System**: Zone Control, Authorities, Stats, Logs
- **NAVI**: NAVI Config, Chat, Test Emergency

### Technical Details

**File: `src/pages/ModerationPanel.tsx**`

1. **Bulk selection state**: Add `selectedUserIds` as `useState<Set<string>>`, checkbox toggle per row, floating bar component
2. **Bulk action handlers**: Wire to existing edge function actions (`bulk_warn`, `bulk_ban`, `bulk_vip`) with confirmation dialogs
3. **Logs filtering**: Add filter state (`logActionFilter`, `logDateFilter`, `logSearch`), apply to logs array before rendering, add filter UI row above logs list
4. **Sidebar restructure**: Group the `SidebarNavItem` calls under category headers ("Users", "System", "NAVI") -- same pattern as the existing "Communication" separator already in the code

### No database or edge function changes needed

All bulk actions and log fetching are already supported server-side. This is purely a frontend improvement.

Extra I'd like: add more management options