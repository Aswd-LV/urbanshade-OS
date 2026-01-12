-- Battle Pass Seasons
CREATE TABLE public.battlepass_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_key text NOT NULL UNIQUE, -- 'genesis', 'phantom', etc.
  name text NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_active boolean DEFAULT false,
  max_level integer DEFAULT 100,
  rewards jsonb NOT NULL DEFAULT '[]', -- Array of {level, type, value, name}
  created_at timestamptz DEFAULT now()
);

-- User Battle Pass Progress
CREATE TABLE public.user_battlepass (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  season_id uuid REFERENCES public.battlepass_seasons(id) ON DELETE CASCADE,
  current_level integer DEFAULT 1,
  current_xp integer DEFAULT 0,
  total_xp_earned integer DEFAULT 0,
  last_xp_tick timestamptz DEFAULT now(),
  claimed_rewards jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, season_id)
);

-- User Quests
CREATE TABLE public.user_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quest_id text NOT NULL,
  quest_name text NOT NULL,
  quest_description text,
  rarity text NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  xp_reward integer NOT NULL,
  progress integer DEFAULT 0,
  target integer DEFAULT 1,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  reset_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User Titles (earned from Battle Pass OR achievements)
CREATE TABLE public.user_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title_id text NOT NULL,
  title_name text NOT NULL,
  source text NOT NULL CHECK (source IN ('battlepass', 'achievement', 'special')),
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, title_id)
);

-- Enable Row Level Security
ALTER TABLE public.battlepass_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_battlepass ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_titles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for battlepass_seasons (publicly readable)
CREATE POLICY "Anyone can view battle pass seasons"
ON public.battlepass_seasons FOR SELECT
USING (true);

CREATE POLICY "Admins can manage seasons"
ON public.battlepass_seasons FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_battlepass
CREATE POLICY "Users can view own battle pass progress"
ON public.user_battlepass FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own battle pass progress"
ON public.user_battlepass FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own battle pass progress"
ON public.user_battlepass FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all battle pass progress"
ON public.user_battlepass FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_quests
CREATE POLICY "Users can view own quests"
ON public.user_quests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests"
ON public.user_quests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests"
ON public.user_quests FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quests"
ON public.user_quests FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for user_titles
CREATE POLICY "Anyone can view titles"
ON public.user_titles FOR SELECT
USING (true);

CREATE POLICY "Users can earn titles"
ON public.user_titles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage titles"
ON public.user_titles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert Season 1: Genesis
INSERT INTO public.battlepass_seasons (season_key, name, description, starts_at, ends_at, is_active, rewards) VALUES (
  'genesis',
  'Season 1: Genesis',
  'The inaugural season of UrbanShade OS. Unlock exclusive themes, titles, and prove yourself as a Genesis Champion.',
  '2025-01-01T00:00:00Z',
  '2025-03-31T23:59:59Z',
  true,
  '[
    {"level": 1, "type": "points", "value": 50, "name": "50 Leaderboard Points"},
    {"level": 5, "type": "title", "value": "rookie_operator", "name": "Rookie Operator"},
    {"level": 10, "type": "theme", "value": "neon-pulse", "name": "Neon Pulse Theme"},
    {"level": 15, "type": "points", "value": 100, "name": "100 Leaderboard Points"},
    {"level": 20, "type": "badge", "value": "s1_starter", "name": "Season 1 Starter Badge"},
    {"level": 25, "type": "theme", "value": "cyber-grid", "name": "Cyber Grid Theme"},
    {"level": 30, "type": "title", "value": "rising_star", "name": "Rising Star"},
    {"level": 35, "type": "points", "value": 200, "name": "200 Leaderboard Points"},
    {"level": 40, "type": "theme", "value": "crimson-protocol", "name": "Crimson Protocol Theme"},
    {"level": 45, "type": "badge", "value": "halfway_hero", "name": "Halfway Hero Badge"},
    {"level": 50, "type": "title", "value": "veteran_operator", "name": "Veteran Operator"},
    {"level": 55, "type": "theme", "value": "frozen-core", "name": "Frozen Core Theme"},
    {"level": 60, "type": "points", "value": 400, "name": "400 Leaderboard Points"},
    {"level": 65, "type": "theme", "value": "solar-flare", "name": "Solar Flare Theme"},
    {"level": 70, "type": "title", "value": "elite_agent", "name": "Elite Agent"},
    {"level": 75, "type": "badge", "value": "s1_elite", "name": "Season 1 Elite Badge"},
    {"level": 80, "type": "theme", "value": "void-walker", "name": "Void Walker Theme"},
    {"level": 85, "type": "points", "value": 500, "name": "500 Leaderboard Points"},
    {"level": 90, "type": "title", "value": "master_operator", "name": "Master Operator"},
    {"level": 95, "type": "theme", "value": "genesis-prime", "name": "Genesis Theme"},
    {"level": 100, "type": "certificate", "value": "genesis_champion", "name": "Genesis Certificate + Genesis Champion Title + 1000 Points"}
  ]'::jsonb
);

-- Insert Season 2: Phantom Protocol
INSERT INTO public.battlepass_seasons (season_key, name, description, starts_at, ends_at, is_active, rewards) VALUES (
  'phantom',
  'Season 2: Phantom Protocol',
  'Embrace the shadows. Unlock stealth-themed rewards and become a Phantom Elite.',
  '2025-04-01T00:00:00Z',
  '2025-06-30T23:59:59Z',
  false,
  '[
    {"level": 1, "type": "points", "value": 50, "name": "50 Leaderboard Points"},
    {"level": 5, "type": "title", "value": "shadow_initiate", "name": "Shadow Initiate"},
    {"level": 10, "type": "theme", "value": "shadow-network", "name": "Shadow Network Theme"},
    {"level": 15, "type": "points", "value": 100, "name": "100 Leaderboard Points"},
    {"level": 20, "type": "badge", "value": "s2_starter", "name": "Season 2 Starter Badge"},
    {"level": 25, "type": "theme", "value": "stealth-mode", "name": "Stealth Mode Theme"},
    {"level": 30, "type": "title", "value": "silent_watcher", "name": "Silent Watcher"},
    {"level": 35, "type": "points", "value": 200, "name": "200 Leaderboard Points"},
    {"level": 40, "type": "title", "value": "ghost_machine", "name": "Ghost in the Machine"},
    {"level": 45, "type": "badge", "value": "phantom_half", "name": "Phantom Halfway Badge"},
    {"level": 50, "type": "theme", "value": "phantom-glow", "name": "Phantom Glow Theme"},
    {"level": 55, "type": "points", "value": 300, "name": "300 Leaderboard Points"},
    {"level": 60, "type": "points", "value": 400, "name": "400 Leaderboard Points"},
    {"level": 65, "type": "title", "value": "night_stalker", "name": "Night Stalker"},
    {"level": 70, "type": "title", "value": "shadow_agent", "name": "Shadow Agent"},
    {"level": 75, "type": "badge", "value": "s2_elite", "name": "Season 2 Elite Badge"},
    {"level": 80, "type": "theme", "value": "invisibility-cloak", "name": "Invisibility Cloak Theme"},
    {"level": 85, "type": "points", "value": 500, "name": "500 Leaderboard Points"},
    {"level": 90, "type": "title", "value": "phantom_master", "name": "Phantom Master"},
    {"level": 95, "type": "points", "value": 750, "name": "750 Leaderboard Points"},
    {"level": 100, "type": "certificate", "value": "phantom_elite", "name": "Phantom Certificate + Phantom Elite Title + 1000 Points"}
  ]'::jsonb
);

-- Create index for faster queries
CREATE INDEX idx_user_battlepass_user ON public.user_battlepass(user_id);
CREATE INDEX idx_user_quests_user ON public.user_quests(user_id);
CREATE INDEX idx_user_quests_reset ON public.user_quests(reset_at);
CREATE INDEX idx_user_titles_user ON public.user_titles(user_id);