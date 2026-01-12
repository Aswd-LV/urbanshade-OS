import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QUEST_POOL, QuestDefinition, RARITY_CONFIG, selectRandomQuests, getNextQuestReset, getCurrentQuestWindow } from '@/lib/quests';
import { useBattlePass } from './useBattlePass';
import { toast } from 'sonner';

interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  quest_name: string;
  quest_description: string | null;
  rarity: string;
  xp_reward: number;
  progress: number;
  target: number;
  completed: boolean;
  completed_at: string | null;
  reset_at: string;
}

export const useQuests = (userId?: string) => {
  const [quests, setQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [questStreak, setQuestStreak] = useState(0);
  const { grantXp } = useBattlePass(userId);

  // Fetch current quests or generate new ones
  const fetchQuests = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const currentWindow = getCurrentQuestWindow();
      const nextReset = getNextQuestReset();

      // Fetch existing quests for this window
      const { data: existingQuests, error } = await supabase
        .from('user_quests')
        .select('*')
        .eq('user_id', userId)
        .gte('reset_at', currentWindow.toISOString());

      if (error) throw error;

      if (existingQuests && existingQuests.length > 0) {
        setQuests(existingQuests);
      } else {
        // Generate new quests for this window
        await generateNewQuests(nextReset);
      }

      // Count completed quests streak
      const { data: completedQuests } = await supabase
        .from('user_quests')
        .select('completed')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (completedQuests) {
        let streak = 0;
        for (const q of completedQuests) {
          if (q.completed) streak++;
          else break;
        }
        setQuestStreak(streak);
      }
    } catch (err) {
      console.error('Failed to fetch quests:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Generate new quests
  const generateNewQuests = useCallback(async (resetAt: Date) => {
    if (!userId) return;

    const selectedQuests = selectRandomQuests(4);
    const questsToInsert = selectedQuests.map(q => ({
      user_id: userId,
      quest_id: q.id,
      quest_name: q.name,
      quest_description: q.description,
      rarity: q.rarity,
      xp_reward: q.xpReward,
      progress: 0,
      target: q.target,
      completed: false,
      reset_at: resetAt.toISOString(),
    }));

    try {
      const { data, error } = await supabase
        .from('user_quests')
        .insert(questsToInsert)
        .select();

      if (error) throw error;
      if (data) setQuests(data);
    } catch (err) {
      console.error('Failed to generate quests:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchQuests();

    // Set up refresh when quest window changes
    const checkReset = setInterval(() => {
      const now = new Date();
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      
      // Check if we just hit a reset time (within 1 minute)
      if ((hours === 0 || hours === 6 || hours === 12 || hours === 18) && minutes < 1) {
        fetchQuests();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkReset);
  }, [fetchQuests]);

  // Update quest progress
  const updateQuestProgress = useCallback(async (
    trackingType: string, 
    increment: number = 1,
    params?: Record<string, any>
  ) => {
    if (!userId || quests.length === 0) return;

    // Find matching quests
    const matchingQuests = quests.filter(q => {
      const definition = QUEST_POOL.find(d => d.id === q.quest_id);
      if (!definition || definition.trackingType !== trackingType) return false;
      if (q.completed) return false;

      // Check params match if specified
      if (definition.trackingParams && params) {
        for (const [key, value] of Object.entries(definition.trackingParams)) {
          if (params[key] !== value) return false;
        }
      }

      return true;
    });

    for (const quest of matchingQuests) {
      const newProgress = Math.min(quest.progress + increment, quest.target);
      const justCompleted = newProgress >= quest.target && !quest.completed;

      try {
        const updateData: any = { progress: newProgress };
        if (justCompleted) {
          updateData.completed = true;
          updateData.completed_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from('user_quests')
          .update(updateData)
          .eq('id', quest.id);

        if (error) throw error;

        // Update local state
        setQuests(prev => prev.map(q => 
          q.id === quest.id 
            ? { ...q, progress: newProgress, completed: justCompleted || q.completed, completed_at: justCompleted ? new Date().toISOString() : q.completed_at }
            : q
        ));

        if (justCompleted) {
          // Grant XP
          await grantXp(quest.xp_reward, true);
          
          const rarityConfig = RARITY_CONFIG[quest.rarity as keyof typeof RARITY_CONFIG];
          toast.success(
            `✅ Quest Complete: ${quest.quest_name}`,
            { description: `+${quest.xp_reward} XP` }
          );

          // Update streak
          setQuestStreak(prev => prev + 1);

          // Check for streak achievement triggers
          if (questStreak + 1 >= 10) {
            // Trigger quest_streak_10 achievement (handled by achievement triggers)
          }

          // Check for legendary quest achievement
          if (quest.rarity === 'legendary') {
            // Trigger legendary_quest achievement
          }
        }
      } catch (err) {
        console.error('Failed to update quest progress:', err);
      }
    }
  }, [userId, quests, grantXp, questStreak]);

  // Get time until next reset
  const getTimeUntilReset = useCallback(() => {
    const nextReset = getNextQuestReset();
    const now = new Date();
    const diff = nextReset.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }, []);

  // Get completed quest count
  const getCompletedCount = useCallback(() => {
    return quests.filter(q => q.completed).length;
  }, [quests]);

  return {
    quests,
    loading,
    questStreak,
    updateQuestProgress,
    getTimeUntilReset,
    getCompletedCount,
    refetch: fetchQuests,
  };
};
