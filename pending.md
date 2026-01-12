# Pending Cloud Implementation Tasks

This file lists features that need backend/cloud implementation.

---

## 🎮 21 Card Game - NEEDS BACKEND

### Description
A multiplayer card game based on the Roblox "Twenty One" game. Players draw cards to get as close to 21 without going over. Features online multiplayer and bot support.

### Frontend Status
✅ Game component created with full UI
✅ Bot AI implemented for single player
✅ Card animations and styling done
⏳ Real-time multiplayer needs Supabase

### Required SQL - Paste in Supabase SQL Editor

```sql
-- 21 Game Tables
CREATE TABLE IF NOT EXISTS public.game_rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code text UNIQUE NOT NULL,
    host_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    status text DEFAULT 'waiting' NOT NULL, -- waiting, playing, finished
    max_players int DEFAULT 4 NOT NULL,
    current_round int DEFAULT 1 NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.game_players (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    is_bot boolean DEFAULT false,
    bot_difficulty text, -- easy, medium, hard
    hand jsonb DEFAULT '[]'::jsonb,
    score int DEFAULT 0,
    is_standing boolean DEFAULT false,
    is_bust boolean DEFAULT false,
    turn_order int NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.game_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    player_id uuid REFERENCES public.game_players(id) ON DELETE CASCADE,
    action_type text NOT NULL, -- hit, stand, join, leave
    card_drawn jsonb,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view rooms they're in" ON public.game_rooms
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.game_players WHERE room_id = id AND user_id = auth.uid())
        OR host_id = auth.uid()
    );

CREATE POLICY "Users can create rooms" ON public.game_rooms
    FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update their rooms" ON public.game_rooms
    FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Users can view players in their room" ON public.game_players
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.game_rooms WHERE id = room_id AND (
            host_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM public.game_players gp WHERE gp.room_id = room_id AND gp.user_id = auth.uid())
        ))
    );

CREATE POLICY "Users can join rooms" ON public.game_players
    FOR INSERT WITH CHECK (user_id = auth.uid() OR is_bot = true);

CREATE POLICY "Users can update their own player" ON public.game_players
    FOR UPDATE USING (user_id = auth.uid() OR is_bot = true);

-- Grant access
GRANT ALL ON public.game_rooms TO authenticated;
GRANT ALL ON public.game_players TO authenticated;
GRANT ALL ON public.game_actions TO authenticated;
```

### Edge Function Required
- Create `game-actions` edge function for:
  - Creating/joining rooms
  - Drawing cards (server-side deck management)
  - Broadcasting game state updates
  - Bot turn automation

---

## 🔧 NAVI Authorities System - NEEDS SQL TABLE

### Description
The NAVI Authorities feature allows admins to toggle site-wide restrictions.

### Frontend Status
✅ NaviAuthoritiesTab component created
✅ Wired into ModerationPanel as "Authorities" tab
✅ Edge function endpoints added

### Required SQL

```sql
CREATE TABLE IF NOT EXISTS public.navi_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    disable_signups boolean DEFAULT false NOT NULL,
    read_only_mode boolean DEFAULT false NOT NULL,
    maintenance_mode boolean DEFAULT false NOT NULL,
    disable_messages boolean DEFAULT false NOT NULL,
    vip_only_mode boolean DEFAULT false NOT NULL,
    lockdown_mode boolean DEFAULT false NOT NULL,
    maintenance_message text DEFAULT NULL,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.navi_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO public.navi_settings (disable_signups, read_only_mode, maintenance_mode, disable_messages, vip_only_mode, lockdown_mode)
VALUES (false, false, false, false, false, false)
ON CONFLICT DO NOTHING;

GRANT ALL ON public.navi_settings TO service_role;
```

---

## ✅ Previously Completed Features

- VIP System - FULLY IMPLEMENTED
- Lock Site Feature - IMPLEMENTED  
- NAVI AI Bot - FULLY IMPLEMENTED
- Ban Enforcement - FULLY IMPLEMENTED
- Messages User Discovery - FIXED
- Friends System - IMPLEMENTED
- Stats Tab - WORKING
