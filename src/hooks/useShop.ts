// UrbanShade OS v3.1 - Shop Hook
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShopItem } from '@/lib/shopItems';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  source: string;
  acquired_at: string;
  gifted_by?: string;
}

export const useShop = (userId?: string) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShopItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_available', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setItems((data || []) as ShopItem[]);
    } catch (err) {
      console.error('Failed to fetch shop items:', err);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchShopItems();
    fetchInventory();
  }, [fetchShopItems, fetchInventory]);

  // Check if user owns an item
  const ownsItem = useCallback((itemType: string, itemId: string): boolean => {
    return inventory.some(i => i.item_type === itemType && i.item_id === itemId);
  }, [inventory]);

  // Purchase an item
  const purchaseItem = useCallback(async (item: ShopItem, spendKroner: (amount: number) => Promise<boolean>): Promise<boolean> => {
    if (!userId) {
      toast.error('Sign in to purchase items');
      return false;
    }

    if (ownsItem(item.item_type, item.item_id)) {
      toast.error('You already own this item!');
      return false;
    }

    // Spend kroner first
    const spent = await spendKroner(item.price);
    if (!spent) return false;

    try {
      const { error } = await supabase
        .from('user_inventory')
        .insert({
          user_id: userId,
          item_type: item.item_type,
          item_id: item.item_id,
          source: 'shop',
        });

      if (error) throw error;

      // Update local inventory
      setInventory(prev => [...prev, {
        id: crypto.randomUUID(),
        user_id: userId,
        item_type: item.item_type,
        item_id: item.item_id,
        source: 'shop',
        acquired_at: new Date().toISOString(),
      }]);

      // Record activity
      await supabase.from('activity_feed').insert({
        user_id: userId,
        activity_type: 'item_purchased',
        activity_data: { item_type: item.item_type, item_id: item.item_id, item_name: item.name, price: item.price },
      });

      toast.success(`Purchased ${item.name}!`, { icon: '🛒' });
      return true;
    } catch (err) {
      console.error('Failed to purchase item:', err);
      toast.error('Purchase failed');
      return false;
    }
  }, [userId, ownsItem]);

  // Add item to inventory (for battlepass/achievement rewards)
  const addToInventory = useCallback(async (itemType: string, itemId: string, source: 'battlepass' | 'achievement' | 'gift' | 'admin'): Promise<boolean> => {
    if (!userId) return false;

    if (ownsItem(itemType, itemId)) return true; // Already owns

    try {
      const { error } = await supabase
        .from('user_inventory')
        .insert({
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
          source,
        });

      if (error) {
        if (error.code === '23505') return true; // Already exists
        throw error;
      }

      setInventory(prev => [...prev, {
        id: crypto.randomUUID(),
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        source,
        acquired_at: new Date().toISOString(),
      }]);

      return true;
    } catch (err) {
      console.error('Failed to add to inventory:', err);
      return false;
    }
  }, [userId, ownsItem]);

  // Get items by type
  const getItemsByType = useCallback((itemType: string): ShopItem[] => {
    return items.filter(i => i.item_type === itemType);
  }, [items]);

  // Get owned items by type
  const getOwnedByType = useCallback((itemType: string): InventoryItem[] => {
    return inventory.filter(i => i.item_type === itemType);
  }, [inventory]);

  return {
    items,
    inventory,
    loading,
    ownsItem,
    purchaseItem,
    addToInventory,
    getItemsByType,
    getOwnedByType,
    refetch: () => { fetchShopItems(); fetchInventory(); },
  };
};
