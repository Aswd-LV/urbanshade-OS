// UrbanShade OS v3.1 - Shop Items Definitions

export interface ShopItem {
  id: string;
  item_type: 'theme' | 'title' | 'badge' | 'wallpaper' | 'profile_effect';
  item_id: string;
  name: string;
  description: string;
  price: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  preview_data?: any;
  is_available: boolean;
  limited_until?: string;
}

export const ITEM_TYPE_LABELS: Record<string, string> = {
  theme: 'Themes',
  title: 'Titles',
  badge: 'Badges',
  wallpaper: 'Wallpapers',
  profile_effect: 'Profile Effects',
};

export const RARITY_COLORS = {
  common: {
    text: 'text-muted-foreground',
    bg: 'bg-muted/50',
    border: 'border-muted',
  },
  uncommon: {
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  rare: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  epic: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  legendary: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
};

export const getRarityLabel = (rarity: string): string => {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
};
