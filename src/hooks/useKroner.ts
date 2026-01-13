// UrbanShade OS v3.1 - Kroner Currency System Hook
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KronerBalance {
  lifetime: number;
  spendable: number;
}

export const useKroner = (userId?: string) => {
  const [balance, setBalance] = useState<KronerBalance>({ lifetime: 0, spendable: 0 });
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('lifetime_kroner, spendable_kroner')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setBalance({
        lifetime: data?.lifetime_kroner || 0,
        spendable: data?.spendable_kroner || 0,
      });
    } catch (err) {
      console.error('Failed to fetch kroner balance:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Subscribe to balance updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('kroner-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setBalance({
            lifetime: newData.lifetime_kroner || 0,
            spendable: newData.spendable_kroner || 0,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Award kroner (adds to both lifetime and spendable)
  const awardKroner = useCallback(async (amount: number, reason?: string, showToast: boolean = true): Promise<boolean> => {
    if (!userId || amount <= 0) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          lifetime_kroner: balance.lifetime + amount,
          spendable_kroner: balance.spendable + amount,
        })
        .eq('user_id', userId);

      if (error) throw error;

      setBalance(prev => ({
        lifetime: prev.lifetime + amount,
        spendable: prev.spendable + amount,
      }));

      if (showToast) {
        toast.success(`+${amount} Kroner${reason ? ` - ${reason}` : ''}`, {
          icon: '💰',
        });
      }

      // Record activity
      await supabase.from('activity_feed').insert({
        user_id: userId,
        activity_type: 'kroner_earned',
        activity_data: { amount, reason },
      });

      return true;
    } catch (err) {
      console.error('Failed to award kroner:', err);
      return false;
    }
  }, [userId, balance]);

  // Spend kroner (only deducts from spendable)
  const spendKroner = useCallback(async (amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) return false;

    if (balance.spendable < amount) {
      toast.error('Not enough Kroner!');
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          spendable_kroner: balance.spendable - amount,
        })
        .eq('user_id', userId);

      if (error) throw error;

      setBalance(prev => ({
        ...prev,
        spendable: prev.spendable - amount,
      }));

      return true;
    } catch (err) {
      console.error('Failed to spend kroner:', err);
      return false;
    }
  }, [userId, balance]);

  // Gift kroner to another user
  const giftKroner = useCallback(async (recipientId: string, amount: number, message?: string): Promise<boolean> => {
    if (!userId || amount <= 0) return false;

    if (balance.spendable < amount) {
      toast.error('Not enough Kroner to gift!');
      return false;
    }

    try {
      // Deduct from sender
      const { error: senderError } = await supabase
        .from('profiles')
        .update({
          spendable_kroner: balance.spendable - amount,
        })
        .eq('user_id', userId);

      if (senderError) throw senderError;

      // Add to recipient (both lifetime and spendable)
      const { data: recipientData } = await supabase
        .from('profiles')
        .select('lifetime_kroner, spendable_kroner')
        .eq('user_id', recipientId)
        .single();

      if (recipientData) {
        await supabase
          .from('profiles')
          .update({
            lifetime_kroner: (recipientData.lifetime_kroner || 0) + amount,
            spendable_kroner: (recipientData.spendable_kroner || 0) + amount,
          })
          .eq('user_id', recipientId);
      }

      // Record gift transaction
      await supabase.from('gift_transactions').insert({
        sender_id: userId,
        recipient_id: recipientId,
        gift_type: 'kroner',
        amount,
        message,
      });

      setBalance(prev => ({
        ...prev,
        spendable: prev.spendable - amount,
      }));

      toast.success(`Gifted ${amount} Kroner!`);
      return true;
    } catch (err) {
      console.error('Failed to gift kroner:', err);
      toast.error('Failed to send gift');
      return false;
    }
  }, [userId, balance]);

  // Check if can afford
  const canAfford = useCallback((amount: number): boolean => {
    return balance.spendable >= amount;
  }, [balance]);

  return {
    balance,
    loading,
    awardKroner,
    spendKroner,
    giftKroner,
    canAfford,
    refetch: fetchBalance,
  };
};
