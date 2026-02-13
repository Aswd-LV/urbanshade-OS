## Moderation Panel Improvements: 2FA PIN, Trial Admin, and Extended Management

### Overview

Three functional upgrades to the moderation panel: a PIN-based second factor for access, a "Trial Admin" role with limited permissions, and additional per-user management actions.

### 1. Moderation PIN (Simple 2FA)

Add a configurable 4-6 digit PIN that admins must enter after logging in, before the moderation panel loads. This acts as a simple second layer of protection.

**How it works:**

- When an admin first accesses `/moderation` and no PIN is set, they see a "Set PIN" screen (enter + confirm)
- The PIN is stored server-side in a new `admin_pins` table (hashed with SHA-256, and all auth of so must be SERVERSIDE. No users except admins can accsess this table at all)
- On subsequent visits, after the JWT role check passes, a PIN prompt appears before showing the panel
- 3 failed PIN attempts = 15 minute lockout
- PIN can be changed or removed from within the panel (under a new "Security" section in sidebar)

**Database migration:**

```sql
CREATE TABLE admin_pins (
  user_id UUID PRIMARY KEY,
  pin_hash TEXT NOT NULL,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pin"
  ON admin_pins FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Edge function changes (`admin-actions`):**

- New actions: `set_pin`, `verify_pin`, `remove_pin`
- `set_pin`: accepts `pin` (4-6 digits), hashes it, stores in `admin_pins`
- `verify_pin`: checks hash match, increments failed attempts on failure, returns success/fail
- `remove_pin`: deletes the pin entry

**Frontend flow in `ModerationPanel.tsx`:**

- New state: `pinVerified`, `showPinSetup`, `showPinPrompt`
- After admin role is confirmed, check if PIN exists (new GET action `check_pin_status`)
- If PIN exists and not verified: show PIN entry screen (4-6 digit input using the existing `InputOTP` component)
- If no PIN exists: show optional "Set up PIN" prompt (skippable)
- Add "Security" tab in sidebar under System group

### 2. Trial Admin Role

A limited admin role where users can moderate but cannot perform high-impact actions.

**What Trial Admins CAN do:**

- View all users
- Issue warnings
- Temp ban (max 24h)
- View logs and reports
- Respond to support tickets

**What Trial Admins CANNOT do:**

- Permanent ban
- Grant/revoke VIP
- OP/De-OP other users
- Lock site
- Send broadcasts
- Access NAVI config
- Start test emergencies

**Database migration:**

```sql
-- Add 'trial_admin' to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'trial_admin';
```

**Update `has_role` function behavior:**

- Trial admins should be treated as having `admin` access for the edge function role check so they can access the panel
- But the edge function response will include `role: 'trial_admin'` so the frontend can restrict UI

**Edge function changes:**

- Update role check to also allow `trial_admin`
- Return the specific role in the response so frontend knows the permission level
- Add `action === 'set_trial_admin'` handler (only full admins/creators can grant this)
- Add `action === 'promote_trial'` handler to promote trial admin to full admin

**Frontend changes in `ModerationPanel.tsx`:**

- New state: `adminRole` (stores 'admin' | 'creator' | 'trial_admin')
- Conditionally disable/hide buttons based on role:
  - Hide "Lock Site", "Broadcast", "NAVI Message" buttons for trial admins
  - In ban dialog, hide "PERMANENT" duration option for trial admins
  - Hide "Grant Admin (OP)" button for trial admins
  - Hide NAVI Config and Test Emergency sidebar tabs for trial admins
- In UserDetailsPanel, add "Grant Trial Admin" button (available to full admins)
- Show a subtle badge in the header showing the admin's own role level

### 3. Extended Management Options

New per-user actions in the UserDetailsPanel:

**a) Edit Clearance Level**

- Dropdown to set clearance 1-5
- Calls new edge function action `set_clearance` which updates `profiles.clearance`

**b) Reset User Password**

- Sends a password reset email to the user
- New edge function action `reset_password` using Supabase Admin API

**c) Force Logout**

- Invalidates all of a user's sessions
- New edge function action `force_logout`

**d) User Notes (Admin-only)**

- Small text area to add private admin notes about a user
- Stored in a new `admin_notes` table
- Displayed in the user details panel

**Database migration for admin notes:**

```sql
CREATE TABLE admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL,
  author_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notes"
  ON admin_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
```

### Technical Summary

**Files modified:**

- `supabase/functions/admin-actions/index.ts` -- new actions: `set_pin`, `verify_pin`, `remove_pin`, `check_pin_status`, `set_clearance`, `reset_password`, `force_logout`, `add_note`, `get_notes`, `set_trial_admin`, `promote_trial`
- `src/pages/ModerationPanel.tsx` -- PIN gate flow, trial admin permission checks, new management buttons in UserDetailsPanel, Security sidebar tab, admin notes display

**New database tables:**

- `admin_pins` (PIN storage)
- `admin_notes` (admin notes on users)

**Database enum change:**

- `app_role` gets `trial_admin` value

**No new dependencies needed** -- uses existing `InputOTP` component for PIN entry.

&nbsp;

New thing Aswd would like: New section for user controls about Moderation (pin, available or not, etc)