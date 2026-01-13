-- UrbanShade OS v3.1 - Currency System, Shop, Enhanced Profiles, Social Features
-- Add currency columns to profiles (lifetime points never decrease, spendable points can be spent)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lifetime_kroner integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS spendable_kroner integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS equipped_title_id text,
ADD COLUMN IF NOT EXISTS equipped_badge_id text,
ADD COLUMN IF NOT EXISTS login_streak integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_bonus timestamp with time zone;

-- Create shop items table
CREATE TABLE public.shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL CHECK (item_type IN ('theme', 'title', 'badge', 'wallpaper', 'profile_effect')),
  item_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price integer NOT NULL DEFAULT 0,
  rarity text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  preview_data jsonb,
  is_available boolean NOT NULL DEFAULT true,
  limited_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on shop_items
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

-- Everyone can view available shop items
CREATE POLICY "Anyone can view shop items" ON public.shop_items
FOR SELECT USING (is_available = true);

-- Create user purchases/inventory table
CREATE TABLE public.user_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  source text NOT NULL CHECK (source IN ('shop', 'battlepass', 'achievement', 'gift', 'admin')),
  acquired_at timestamp with time zone DEFAULT now(),
  gifted_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS on user_inventory
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Users can view their own inventory
CREATE POLICY "Users can view own inventory" ON public.user_inventory
FOR SELECT USING (auth.uid() = user_id);

-- Users can add to their own inventory (for purchases/claims)
CREATE POLICY "Users can add to own inventory" ON public.user_inventory
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create activity feed table
CREATE TABLE public.activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on activity_feed
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Users can view public activities
CREATE POLICY "Anyone can view public activities" ON public.activity_feed
FOR SELECT USING (is_public = true);

-- Users can insert their own activities
CREATE POLICY "Users can add own activities" ON public.activity_feed
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create profile visitors table
CREATE TABLE public.profile_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visited_at timestamp with time zone DEFAULT now(),
  UNIQUE(profile_user_id, visitor_user_id)
);

-- Enable RLS on profile_visitors
ALTER TABLE public.profile_visitors ENABLE ROW LEVEL SECURITY;

-- Users can see who visited their profile
CREATE POLICY "Users can view own visitors" ON public.profile_visitors
FOR SELECT USING (auth.uid() = profile_user_id);

-- Users can record their visits (upsert)
CREATE POLICY "Users can record visits" ON public.profile_visitors
FOR INSERT WITH CHECK (auth.uid() = visitor_user_id);

CREATE POLICY "Users can update own visits" ON public.profile_visitors
FOR UPDATE USING (auth.uid() = visitor_user_id);

-- Create gift transactions table
CREATE TABLE public.gift_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gift_type text NOT NULL CHECK (gift_type IN ('kroner', 'item')),
  item_type text,
  item_id text,
  amount integer,
  message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on gift_transactions
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view gifts they sent or received
CREATE POLICY "Users can view own gifts" ON public.gift_transactions
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send gifts
CREATE POLICY "Users can send gifts" ON public.gift_transactions
FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create user certificates table for Battle Pass + Epic/Legendary achievements
CREATE TABLE public.user_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_type text NOT NULL CHECK (certificate_type IN ('battlepass', 'achievement')),
  certificate_id text NOT NULL,
  certificate_name text NOT NULL,
  season_key text,
  achievement_rarity text,
  earned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, certificate_type, certificate_id)
);

-- Enable RLS on user_certificates
ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON public.user_certificates
FOR SELECT USING (auth.uid() = user_id);

-- Users can earn certificates
CREATE POLICY "Users can earn certificates" ON public.user_certificates
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed initial shop items
INSERT INTO public.shop_items (item_type, item_id, name, description, price, rarity, is_available) VALUES
-- Themes
('theme', 'midnight-haze', 'Midnight Haze', 'A deep blue theme with subtle purple accents', 250, 'common', true),
('theme', 'forest-terminal', 'Forest Terminal', 'Earthy greens inspired by old-school terminals', 250, 'common', true),
('theme', 'sunset-gradient', 'Sunset Gradient', 'Warm oranges and reds fading to purple', 400, 'uncommon', true),
('theme', 'arctic-frost', 'Arctic Frost', 'Clean whites and icy blues', 400, 'uncommon', true),
('theme', 'neon-city', 'Neon City', 'Vibrant cyberpunk-inspired neon colors', 600, 'rare', true),
('theme', 'royal-gold', 'Royal Gold', 'Luxurious gold accents on deep purple', 600, 'rare', true),
('theme', 'obsidian-flame', 'Obsidian Flame', 'Dark obsidian with fiery orange highlights', 1000, 'epic', true),
('theme', 'aurora-borealis', 'Aurora Borealis', 'Shifting greens and purples like northern lights', 1000, 'epic', true),
('theme', 'quantum-shift', 'Quantum Shift', 'Iridescent colors that seem to shift and change', 2500, 'legendary', true),

-- Titles
('title', 'title-pioneer', 'Pioneer', 'An early explorer of the system', 150, 'common', true),
('title', 'title-enthusiast', 'Enthusiast', 'Shows dedication to the platform', 150, 'common', true),
('title', 'title-collector', 'Collector', 'Amasses items and achievements', 300, 'uncommon', true),
('title', 'title-strategist', 'Strategist', 'Plans and executes with precision', 300, 'uncommon', true),
('title', 'title-legend', 'Legend', 'Known throughout the system', 500, 'rare', true),
('title', 'title-mastermind', 'Mastermind', 'A true master of all domains', 800, 'epic', true),
('title', 'title-architect', 'Architect', 'Shapes the very foundation', 2000, 'legendary', true),

-- Badges
('badge', 'badge-star', 'Gold Star', 'A shining gold star badge', 200, 'common', true),
('badge', 'badge-diamond', 'Diamond', 'A brilliant diamond badge', 500, 'rare', true),
('badge', 'badge-crown', 'Royal Crown', 'A majestic crown badge', 1200, 'epic', true),
('badge', 'badge-infinity', 'Infinity', 'An infinite loop badge', 3000, 'legendary', true),

-- Wallpapers
('wallpaper', 'wallpaper-circuit', 'Circuit Board', 'Digital circuit patterns', 100, 'common', true),
('wallpaper', 'wallpaper-nebula', 'Cosmic Nebula', 'Deep space nebula imagery', 200, 'uncommon', true),
('wallpaper', 'wallpaper-matrix', 'Digital Rain', 'Falling code like the Matrix', 350, 'rare', true),
('wallpaper', 'wallpaper-aurora', 'Aurora Sky', 'Beautiful aurora over mountains', 700, 'epic', true),

-- Profile Effects  
('profile_effect', 'effect-sparkle', 'Sparkle', 'Subtle sparkle effect on profile', 300, 'uncommon', true),
('profile_effect', 'effect-glow', 'Aura Glow', 'Glowing aura around avatar', 600, 'rare', true),
('profile_effect', 'effect-flames', 'Flames', 'Animated flame border', 1500, 'epic', true),
('profile_effect', 'effect-hologram', 'Holographic', 'Holographic shimmer effect', 4000, 'legendary', true);

-- Add index for faster shop queries
CREATE INDEX idx_shop_items_type ON public.shop_items(item_type);
CREATE INDEX idx_shop_items_rarity ON public.shop_items(rarity);
CREATE INDEX idx_user_inventory_user ON public.user_inventory(user_id);
CREATE INDEX idx_activity_feed_user ON public.activity_feed(user_id);
CREATE INDEX idx_activity_feed_created ON public.activity_feed(created_at DESC);