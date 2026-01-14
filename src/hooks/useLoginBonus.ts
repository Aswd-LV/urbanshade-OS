// UrbanShade OS v3.1 - Login Bonus Hook
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LoginBonusResult {
  kroner: number;
  streak: number;
  isNewDay: boolean;
}

const STREAK_BONUSES = [10, 15, 20, 25, 30, 40, 50]; // Day 1-7+ bonuses

export const useLoginBonus = (userId?: string) => {
  const [lastBonus, setLastBonus] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  // Check if bonus was already claimed today
  const isNewDay = useCallback((lastBonusDate: string | null): boolean => {
    if (!lastBonusDate) return true;
    
    const last = new Date(lastBonusDate);
    const now = new Date();
    
    // Check if it's a different day
    return last.toDateString() !== now.toDateString();
  }, []);

  // Calculate streak bonus
  const getStreakBonus = useCallback((currentStreak: number): number => {
    const index = Math.min(currentStreak - 1, STREAK_BONUSES.length - 1);
    return STREAK_BONUSES[Math.max(0, index)];
  }, []);

  // Fetch current status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('last_login_bonus, login_streak')
          .eq('user_id', userId)
          .single();

        if (error) throw error;

        setLastBonus(data?.last_login_bonus || null);
        setStreak(data?.login_streak || 0);
        setClaimed(!isNewDay(data?.last_login_bonus));
      } catch (err) {
        console.error('Failed to fetch login bonus status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [userId, isNewDay]);

  // Claim daily bonus
  const claimBonus = useCallback(async (): Promise<LoginBonusResult | null> => {
    if (!userId || claimed) return null;

    try {
      // Calculate new streak
      let newStreak = 1;
      if (lastBonus) {
        const lastDate = new Date(lastBonus);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // If last bonus was yesterday, continue streak
        if (diffDays === 1) {
          newStreak = streak + 1;
        } else if (diffDays === 0) {
          // Already claimed today
          return null;
        }
        // If more than 1 day, reset streak to 1
      }

      const bonusAmount = getStreakBonus(newStreak);

      // Update profile with new streak and bonus time
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('spendable_kroner, lifetime_kroner')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          last_login_bonus: new Date().toISOString(),
          login_streak: newStreak,
          spendable_kroner: (profile?.spendable_kroner || 0) + bonusAmount,
          lifetime_kroner: (profile?.lifetime_kroner || 0) + bonusAmount,
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Record activity
      await supabase.from('activity_feed').insert({
        user_id: userId,
        activity_type: 'login_bonus',
        activity_data: { kroner: bonusAmount, streak: newStreak },
      });

      setLastBonus(new Date().toISOString());
      setStreak(newStreak);
      setClaimed(true);

      toast.success(`🎁 Daily Bonus: +${bonusAmount} Kroner!`, {
        description: newStreak > 1 ? `${newStreak} day streak!` : 'Come back tomorrow for more!',
      });

      return { kroner: bonusAmount, streak: newStreak, isNewDay: true };
    } catch (err) {
      console.error('Failed to claim login bonus:', err);
      toast.error('Failed to claim daily bonus');
      return null;
    }
  }, [userId, claimed, lastBonus, streak, getStreakBonus]);

  // Auto-claim on mount if new day
  useEffect(() => {
    if (!loading && userId && !claimed && isNewDay(lastBonus)) {
      claimBonus();
    }
  }, [loading, userId, claimed, lastBonus, isNewDay, claimBonus]);

  return {
    streak,
    lastBonus,
    claimed,
    loading,
    claimBonus,
    getStreakBonus,
    nextBonus: getStreakBonus(streak + 1),
  };
};
