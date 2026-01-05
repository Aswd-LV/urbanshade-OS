# Pending Cloud Implementation Tasks

This file lists features that need backend/cloud implementation by the developer (Aswd).

---

## 🔧 NAVI Authorities System - NEEDS SQL TABLE

### Description
The NAVI Authorities feature allows admins to toggle site-wide restrictions like disabling signups, read-only mode, maintenance mode, etc.

### Frontend Status
✅ NaviAuthoritiesTab component created
✅ Wired into ModerationPanel as "Authorities" tab
✅ Edge function endpoints added (get/set settings)

### Required SQL - Paste in Supabase SQL Editor

```sql
-- NAVI Settings Table for Authority Controls
CREATE TABLE IF NOT EXISTS public.navi_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authority toggles
    disable_signups boolean DEFAULT false NOT NULL,
    read_only_mode boolean DEFAULT false NOT NULL,
    maintenance_mode boolean DEFAULT false NOT NULL,
    disable_messages boolean DEFAULT false NOT NULL,
    vip_only_mode boolean DEFAULT false NOT NULL,
    lockdown_mode boolean DEFAULT false NOT NULL,
    
    -- Maintenance message
    maintenance_message text DEFAULT NULL,
    
    -- Metadata
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.navi_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read settings (through edge function with service role)
-- No direct client access needed - edge function handles it

-- Insert default row
INSERT INTO public.navi_settings (disable_signups, read_only_mode, maintenance_mode, disable_messages, vip_only_mode, lockdown_mode)
VALUES (false, false, false, false, false, false)
ON CONFLICT DO NOTHING;

-- Grant usage to service role
GRANT ALL ON public.navi_settings TO service_role;
```

---

## ✅ Previously Completed Features

### VIP System - FULLY IMPLEMENTED
- ✅ `vips` table created with RLS policies
- ✅ `is_vip()` function created
- ✅ Admin endpoints for grant/revoke VIP
- ✅ VIP welcome popup on login
- ✅ VIP status shown in Messages badges

### Lock Site Feature - IMPLEMENTED
- ✅ `site_locks` table created
- ✅ Admin endpoints for lock/unlock site

### NAVI AI Bot - Live Announcements - FULLY IMPLEMENTED
- ✅ `navi_messages` table created
- ✅ Admin endpoints for sending NAVI messages
- ✅ Bot badge in Messages.tsx
- ✅ NAVI Message dialog in ModerationPanel

### Ban Enforcement - FULLY IMPLEMENTED
- ✅ `useBanCheck` hook
- ✅ BannedScreen component
- ✅ Fake bans with "just kidding" reveal

### Messages User Discovery - FIXED
- ✅ RLS policy for profile viewing
- ✅ Users can see and message each other

### Friends System - IMPLEMENTED
- ✅ `friends` table with RLS
- ✅ Friend requests flow

### Stats Tab - WORKING
- ✅ Queries moderation_actions for counts
- ✅ Shows user distribution charts

---

## Notes

- Once the `navi_settings` table is created, the Authorities tab will be fully functional
- Settings are managed via the admin-actions edge function
- The frontend uses demo mode when not connected to cloud
