import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BanInfo {
  isBanned: boolean;
  isFakeBan: boolean;
  reason: string | null;
  expiresAt: Date | null;
  actionType: string | null;
}

export const useBanCheck = () => {
  const [banInfo, setBanInfo] = useState<BanInfo>({
    isBanned: false,
    isFakeBan: false,
    reason: null,
    expiresAt: null,
    actionType: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isVip, setIsVip] = useState(false);
  const [vipReason, setVipReason] = useState<string | null>(null);
  const [showVipWelcome, setShowVipWelcome] = useState(false);

  const checkBanStatus = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBanInfo({ isBanned: false, isFakeBan: false, reason: null, expiresAt: null, actionType: null });
        setIsVip(false);
        setIsLoading(false);
        return;
      }

      // Check VIP status
      const { data: vipData } = await supabase.rpc('is_vip', { _user_id: user.id });
      const userIsVip = vipData === true;
      setIsVip(userIsVip);

      // If VIP, check if we should show welcome popup
      if (userIsVip) {
        const vipWelcomeShown = localStorage.getItem(`urbanshade_vip_welcome_${user.id}`);
        if (!vipWelcomeShown) {
          // Fetch VIP reason
          const { data: vipRecord } = await supabase
            .from('vips')
            .select('reason')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (vipRecord) {
            setVipReason(vipRecord.reason);
            setShowVipWelcome(true);
          }
        }
      }

      // Check for active bans
      const { data: banData, error } = await supabase
        .from('moderation_actions')
        .select('*')
        .eq('target_user_id', user.id)
        .eq('is_active', true)
        .in('action_type', ['ban', 'temp_ban'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking ban status:', error);
        setIsLoading(false);
        return;
      }

      if (banData) {
        // Check if ban has expired
        if (banData.expires_at && new Date(banData.expires_at) < new Date()) {
          // Ban has expired - don't block
          setBanInfo({ isBanned: false, isFakeBan: false, reason: null, expiresAt: null, actionType: null });
        } else {
          setBanInfo({
            isBanned: true,
            isFakeBan: banData.is_fake || false,
            reason: banData.reason,
            expiresAt: banData.expires_at ? new Date(banData.expires_at) : null,
            actionType: banData.action_type,
          });
        }
      } else {
        setBanInfo({ isBanned: false, isFakeBan: false, reason: null, expiresAt: null, actionType: null });
      }
    } catch (error) {
      console.error('Error in ban check:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dismissVipWelcome = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      localStorage.setItem(`urbanshade_vip_welcome_${user.id}`, 'true');
    }
    setShowVipWelcome(false);
  }, []);

  useEffect(() => {
    checkBanStatus();

    // Re-check every 5 minutes
    const interval = setInterval(checkBanStatus, 5 * 60 * 1000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkBanStatus();
      } else if (event === 'SIGNED_OUT') {
        setBanInfo({ isBanned: false, isFakeBan: false, reason: null, expiresAt: null, actionType: null });
        setIsVip(false);
        setShowVipWelcome(false);
      }
    });

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [checkBanStatus]);

  return {
    ...banInfo,
    isLoading,
    isVip,
    vipReason,
    showVipWelcome,
    dismissVipWelcome,
    refreshBanStatus: checkBanStatus,
  };
};
