// UrbanShade OS v3.1 - Inventory App
import { useState, useEffect } from "react";
import { Package, Crown, Award, Palette, Image, Sparkles, Check, Star, Gift, Coins, Search, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { useKroner } from "@/hooks/useKroner";
import { toast } from "sonner";
import { RARITY_COLORS, getRarityLabel } from "@/lib/shopItems";

interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  source: string;
  acquired_at: string;
  gifted_by?: string;
  // Additional display data
  name?: string;
  rarity?: string;
}

interface EquippedItems {
  equipped_title_id: string | null;
  equipped_badge_id: string | null;
}

// Local definitions for items (since we can't fetch from shop_items always)
const ITEM_DEFINITIONS: Record<string, { name: string; rarity: string; description?: string }> = {
  // Titles
  'title_pioneer': { name: 'Pioneer', rarity: 'rare', description: 'Early adopter of UrbanShade' },
  'title_explorer': { name: 'Explorer', rarity: 'common', description: 'Discovered the depths' },
  'title_champion': { name: 'Champion', rarity: 'epic', description: 'Master of the OS' },
  'title_legend': { name: 'Legend', rarity: 'legendary', description: 'A true legend' },
  'title_shadow': { name: 'Shadow Operative', rarity: 'rare', description: 'Works in the shadows' },
  'title_cyber': { name: 'Cyber Phantom', rarity: 'epic', description: 'Digital ghost' },
  'title_elite': { name: 'Elite Agent', rarity: 'rare', description: 'Top tier operative' },
  'title_veteran': { name: 'Veteran', rarity: 'uncommon', description: 'Long-time user' },
  // Badges
  'badge_star': { name: 'Gold Star', rarity: 'rare', description: 'Outstanding performance' },
  'badge_shield': { name: 'Shield', rarity: 'uncommon', description: 'Protector of the system' },
  'badge_crown': { name: 'Crown', rarity: 'legendary', description: 'Royalty status' },
  'badge_lightning': { name: 'Lightning', rarity: 'epic', description: 'Speed demon' },
  'badge_heart': { name: 'Heart', rarity: 'common', description: 'Full of love' },
  'badge_diamond': { name: 'Diamond', rarity: 'legendary', description: 'Rare and precious' },
  // Themes
  'theme_midnight': { name: 'Midnight', rarity: 'uncommon', description: 'Dark as night' },
  'theme_ocean': { name: 'Ocean Depths', rarity: 'rare', description: 'Deep blue aesthetics' },
  'theme_sunset': { name: 'Sunset', rarity: 'rare', description: 'Warm orange glow' },
  'theme_forest': { name: 'Forest', rarity: 'uncommon', description: 'Natural greens' },
  'theme_neon': { name: 'Neon', rarity: 'epic', description: 'Cyberpunk vibes' },
  'theme_arctic': { name: 'Arctic', rarity: 'rare', description: 'Cool and clean' },
  // Wallpapers
  'wallpaper_abstract1': { name: 'Abstract Flow', rarity: 'common', description: 'Flowing shapes' },
  'wallpaper_space1': { name: 'Deep Space', rarity: 'uncommon', description: 'Stars and nebulas' },
  'wallpaper_city1': { name: 'Night City', rarity: 'rare', description: 'Urban landscape' },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  title: <Crown className="w-4 h-4" />,
  badge: <Award className="w-4 h-4" />,
  theme: <Palette className="w-4 h-4" />,
  wallpaper: <Image className="w-4 h-4" />,
  profile_effect: <Sparkles className="w-4 h-4" />,
};

export const Inventory = () => {
  const { user, profile, updateProfile } = useOnlineAccount();
  const { balance } = useKroner(user?.id);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [search, setSearch] = useState("");
  const [equipped, setEquipped] = useState<EquippedItems>({
    equipped_title_id: null,
    equipped_badge_id: null,
  });

  // Fetch inventory
  useEffect(() => {
    const fetchInventory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_inventory')
          .select('*')
          .eq('user_id', user.id)
          .order('acquired_at', { ascending: false });

        if (error) throw error;
        
        // Enrich with definitions
        const enrichedItems = (data || []).map(item => ({
          ...item,
          name: ITEM_DEFINITIONS[item.item_id]?.name || item.item_id,
          rarity: ITEM_DEFINITIONS[item.item_id]?.rarity || 'common',
        }));
        
        setItems(enrichedItems);
      } catch (err) {
        console.error('Failed to fetch inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  // Fetch equipped items from profile
  useEffect(() => {
    if (profile) {
      setEquipped({
        equipped_title_id: profile.equipped_title_id || null,
        equipped_badge_id: profile.equipped_badge_id || null,
      });
    }
  }, [profile]);

  const handleEquipTitle = async (itemId: string) => {
    if (!user) return;
    
    try {
      const newTitleId = equipped.equipped_title_id === itemId ? null : itemId;
      
      const { error } = await supabase
        .from('profiles')
        .update({ equipped_title_id: newTitleId })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setEquipped(prev => ({ ...prev, equipped_title_id: newTitleId }));
      toast.success(newTitleId ? 'Title equipped!' : 'Title unequipped');
    } catch (err) {
      console.error('Failed to equip title:', err);
      toast.error('Failed to equip title');
    }
  };

  const handleEquipBadge = async (itemId: string) => {
    if (!user) return;
    
    try {
      const newBadgeId = equipped.equipped_badge_id === itemId ? null : itemId;
      
      const { error } = await supabase
        .from('profiles')
        .update({ equipped_badge_id: newBadgeId })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setEquipped(prev => ({ ...prev, equipped_badge_id: newBadgeId }));
      toast.success(newBadgeId ? 'Badge equipped!' : 'Badge unequipped');
    } catch (err) {
      console.error('Failed to equip badge:', err);
      toast.error('Failed to equip badge');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) || 
                         item.item_id.toLowerCase().includes(search.toLowerCase());
    const matchesTab = selectedTab === "all" || item.item_type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const getItemsByType = (type: string) => items.filter(i => i.item_type === type);

  const renderItemCard = (item: InventoryItem) => {
    const rarityStyle = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common;
    const isEquipped = (item.item_type === 'title' && equipped.equipped_title_id === item.item_id) ||
                      (item.item_type === 'badge' && equipped.equipped_badge_id === item.item_id);
    
    return (
      <div
        key={item.id}
        className={`relative p-4 rounded-xl border transition-all hover:scale-[1.02] ${rarityStyle.bg} ${rarityStyle.border} ${
          isEquipped ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
        }`}
      >
        {isEquipped && (
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${rarityStyle.bg} border ${rarityStyle.border}`}>
            {TYPE_ICONS[item.item_type] || <Package className="w-4 h-4" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm truncate">{item.name}</span>
              <Badge variant="outline" className={`text-[10px] ${rarityStyle.text} ${rarityStyle.border}`}>
                {getRarityLabel(item.rarity || 'common')}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {ITEM_DEFINITIONS[item.item_id]?.description || `${item.item_type}`}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {item.source === 'shop' ? 'Purchased' : item.source === 'gift' ? 'Gifted' : item.source}
              </span>
              
              {(item.item_type === 'title' || item.item_type === 'badge') && (
                <Button
                  size="sm"
                  variant={isEquipped ? "secondary" : "default"}
                  className="h-6 text-xs px-2"
                  onClick={() => {
                    if (item.item_type === 'title') {
                      handleEquipTitle(item.item_id);
                    } else {
                      handleEquipBadge(item.item_id);
                    }
                  }}
                >
                  {isEquipped ? 'Unequip' : 'Equip'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-background p-8">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/50" />
          <h2 className="text-xl font-bold">Sign In Required</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Sign in to view your inventory of collected items, titles, badges, and themes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">My Inventory</h1>
              <p className="text-xs text-muted-foreground">{items.length} items collected</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">{balance.spendable.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>
      </div>
      
      {/* Equipped Section */}
      <div className="p-4 border-b border-border bg-muted/20">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          Currently Equipped
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Crown className="w-3 h-3" />
              Title
            </div>
            <div className="font-medium text-sm">
              {equipped.equipped_title_id ? (
                ITEM_DEFINITIONS[equipped.equipped_title_id]?.name || equipped.equipped_title_id
              ) : (
                <span className="text-muted-foreground">None equipped</span>
              )}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Award className="w-3 h-3" />
              Badge
            </div>
            <div className="font-medium text-sm">
              {equipped.equipped_badge_id ? (
                ITEM_DEFINITIONS[equipped.equipped_badge_id]?.name || equipped.equipped_badge_id
              ) : (
                <span className="text-muted-foreground">None equipped</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs & Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-3">
          <TabsList className="grid grid-cols-5 h-9">
            <TabsTrigger value="all" className="text-xs">All ({items.length})</TabsTrigger>
            <TabsTrigger value="title" className="text-xs">Titles ({getItemsByType('title').length})</TabsTrigger>
            <TabsTrigger value="badge" className="text-xs">Badges ({getItemsByType('badge').length})</TabsTrigger>
            <TabsTrigger value="theme" className="text-xs">Themes ({getItemsByType('theme').length})</TabsTrigger>
            <TabsTrigger value="wallpaper" className="text-xs">Other</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading inventory...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground space-y-2">
              <Package className="w-10 h-10 opacity-50" />
              <p className="text-sm">No items found</p>
              <p className="text-xs">Visit the Shop to purchase items!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map(renderItemCard)}
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
};
