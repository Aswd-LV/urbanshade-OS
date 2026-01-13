import { useState, useEffect } from "react";
import { ShoppingBag, Coins, Check, Lock, Sparkles, Palette, Crown, Award, Image, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/hooks/useShop";
import { useKroner } from "@/hooks/useKroner";
import { ITEM_TYPE_LABELS, RARITY_COLORS, getRarityLabel, ShopItem } from "@/lib/shopItems";
import { supabase } from "@/integrations/supabase/client";

type ItemCategory = 'theme' | 'title' | 'badge' | 'wallpaper' | 'profile_effect';

const CATEGORY_ICONS: Record<ItemCategory, React.ReactNode> = {
  theme: <Palette className="w-4 h-4" />,
  title: <Crown className="w-4 h-4" />,
  badge: <Award className="w-4 h-4" />,
  wallpaper: <Image className="w-4 h-4" />,
  profile_effect: <Wand2 className="w-4 h-4" />,
};

export const Shop = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('theme');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  const { items, ownsItem, purchaseItem, loading } = useShop(userId);
  const { balance, spendKroner, canAfford } = useKroner(userId);

  const categoryItems = items.filter(item => item.item_type === activeCategory);

  const handlePurchase = async (item: ShopItem) => {
    await purchaseItem(item, spendKroner);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border p-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kroner Shop</h1>
              <p className="text-xs text-muted-foreground">Spend your hard-earned Kroner</p>
            </div>
          </div>
          
          {/* Balance Display */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <Coins className="w-5 h-5 text-yellow-500" />
            <div className="text-right">
              <div className="font-bold text-yellow-500">{balance.spendable.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">Spendable</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ItemCategory)}>
          <TabsList className="w-full grid grid-cols-5">
            {(['theme', 'title', 'badge', 'wallpaper', 'profile_effect'] as ItemCategory[]).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs gap-1">
                {CATEGORY_ICONS[cat]}
                <span className="hidden sm:inline">{ITEM_TYPE_LABELS[cat]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Items Grid */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Loading shop...
          </div>
        ) : categoryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-50" />
            <p>No items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryItems.map((item) => {
              const owned = ownsItem(item.item_type, item.item_id);
              const affordable = canAfford(item.price);
              const rarityStyle = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS];

              return (
                <div
                  key={item.id}
                  className={`relative rounded-xl border p-4 transition-all hover:shadow-lg ${rarityStyle.bg} ${rarityStyle.border} ${
                    owned ? 'opacity-75' : ''
                  }`}
                >
                  {/* Rarity Badge */}
                  <Badge className={`absolute top-2 right-2 text-[10px] ${rarityStyle.text} bg-background/80`}>
                    {getRarityLabel(item.rarity)}
                  </Badge>

                  {/* Item Icon/Preview */}
                  <div className="w-full aspect-square rounded-lg bg-background/50 mb-3 flex items-center justify-center">
                    {item.item_type === 'theme' && <Palette className={`w-12 h-12 ${rarityStyle.text}`} />}
                    {item.item_type === 'title' && <Crown className={`w-12 h-12 ${rarityStyle.text}`} />}
                    {item.item_type === 'badge' && <Award className={`w-12 h-12 ${rarityStyle.text}`} />}
                    {item.item_type === 'wallpaper' && <Image className={`w-12 h-12 ${rarityStyle.text}`} />}
                    {item.item_type === 'profile_effect' && <Sparkles className={`w-12 h-12 ${rarityStyle.text}`} />}
                  </div>

                  {/* Item Info */}
                  <h3 className="font-semibold text-sm text-foreground mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                  {/* Price & Action */}
                  {owned ? (
                    <Button disabled className="w-full" size="sm" variant="outline">
                      <Check className="w-4 h-4 mr-1" />
                      Owned
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={!affordable}
                      onClick={() => handlePurchase(item)}
                    >
                      {affordable ? (
                        <>
                          <Coins className="w-4 h-4 mr-1" />
                          {item.price.toLocaleString()}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-1" />
                          {item.price.toLocaleString()}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer Info */}
      <div className="flex-shrink-0 border-t border-border p-3 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>💡 Earn Kroner from Battle Pass, Quests, and Achievements</span>
          <span>Lifetime: {balance.lifetime.toLocaleString()} K</span>
        </div>
      </div>
    </div>
  );
};
