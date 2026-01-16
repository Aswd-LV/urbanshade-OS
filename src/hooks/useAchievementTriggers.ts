/**
 * Achievement Triggers Hook
 * Centralized logic for triggering achievements throughout the app
 * Also integrates with Quest tracking for Battle Pass
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Storage keys for tracking progress
const STORAGE_KEYS = {
  OPENED_APPS: 'achievement_opened_apps',
  CHAT_COUNT: 'achievement_chat_count',
  TERMINAL_COMMANDS: 'achievement_terminal_commands',
  LOGIN_DATES: 'achievement_login_dates',
  SESSION_START: 'achievement_session_start',
  THEME_CHANGED: 'achievement_theme_changed',
};

// Quest progress tracking event dispatcher
export const dispatchQuestProgress = (trackingType: string, increment: number = 1, params?: Record<string, any>) => {
  window.dispatchEvent(new CustomEvent('quest-progress', { 
    detail: { trackingType, increment, params } 
  }));
};

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Helper to grant achievement
async function grantAchievement(userId: string, achievementId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_achievements')
      .insert({ user_id: userId, achievement_id: achievementId });
    
    if (error) {
      // 23505 = unique violation (already has achievement)
      if (error.code === '23505') return false;
      throw error;
    }
    return true;
  } catch (err) {
    console.error('Failed to grant achievement:', err);
    return false;
  }
}

// Check and grant time-based achievements
export async function checkTimeAchievements(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const hour = new Date().getHours();
  
  // Night Owl: 12 AM - 4 AM (0-4)
  if (hour >= 0 && hour < 4) {
    await grantAchievement(userId, 'night_owl');
  }
  
  // Early Bird: 5 AM - 7 AM
  if (hour >= 5 && hour < 7) {
    await grantAchievement(userId, 'early_bird');
  }
}

// Track app opens and grant explorer achievements
export async function trackAppOpen(appId: string): Promise<void> {
  const userId = await getCurrentUserId();
  
  // Dispatch quest progress for app opens
  dispatchQuestProgress('app_open', 1, { appId });
  
  if (!userId) return;

  const stored = localStorage.getItem(STORAGE_KEYS.OPENED_APPS);
  const openedApps: string[] = stored ? JSON.parse(stored) : [];
  
  if (!openedApps.includes(appId)) {
    openedApps.push(appId);
    localStorage.setItem(STORAGE_KEYS.OPENED_APPS, JSON.stringify(openedApps));
    
    // Also track unique apps for quests
    dispatchQuestProgress('unique_app_open', 1, { totalOpened: openedApps.length });
    
    // Check thresholds
    if (openedApps.length >= 5) {
      await grantAchievement(userId, 'app_opener_5');
    }
    if (openedApps.length >= 15) {
      await grantAchievement(userId, 'app_opener_15');
    }
    // Note: app_opener_all requires knowing total apps - will check in Desktop component
  }
}

// Track chat messages
export async function trackChatMessage(): Promise<void> {
  // Dispatch quest progress for chat messages
  dispatchQuestProgress('chat_message', 1);
  
  const userId = await getCurrentUserId();
  if (!userId) return;

  const count = parseInt(localStorage.getItem(STORAGE_KEYS.CHAT_COUNT) || '0') + 1;
  localStorage.setItem(STORAGE_KEYS.CHAT_COUNT, count.toString());

  // Check thresholds
  if (count === 1) await grantAchievement(userId, 'first_chat');
  if (count === 10) await grantAchievement(userId, 'chat_10');
  if (count === 50) await grantAchievement(userId, 'chat_50');
  if (count === 100) await grantAchievement(userId, 'chat_100');
  if (count === 500) await grantAchievement(userId, 'chat_500');
}

// Track terminal commands
export async function trackTerminalCommand(command: string): Promise<void> {
  // Dispatch quest progress for terminal commands
  dispatchQuestProgress('terminal_command', 1, { command });
  
  const userId = await getCurrentUserId();
  if (!userId) return;

  const stored = localStorage.getItem(STORAGE_KEYS.TERMINAL_COMMANDS);
  const commands: string[] = stored ? JSON.parse(stored) : [];
  
  if (!commands.includes(command)) {
    commands.push(command);
    localStorage.setItem(STORAGE_KEYS.TERMINAL_COMMANDS, JSON.stringify(commands));
    
    // Track unique terminal commands for quests
    dispatchQuestProgress('unique_terminal_command', 1, { totalCommands: commands.length });
    
    if (commands.length >= 20) {
      await grantAchievement(userId, 'terminal_hacker');
    }
  }
}

// Track friend count
export async function trackFriendAdded(friendCount: number): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  if (friendCount >= 1) await grantAchievement(userId, 'friend_1');
  if (friendCount >= 5) await grantAchievement(userId, 'friend_5');
  if (friendCount >= 20) await grantAchievement(userId, 'friend_20');
}

// Track login streaks
export async function trackLogin(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  // Grant first login
  await grantAchievement(userId, 'first_login');

  // Track daily streak
  const today = new Date().toDateString();
  const stored = localStorage.getItem(STORAGE_KEYS.LOGIN_DATES);
  const dates: string[] = stored ? JSON.parse(stored) : [];
  
  if (!dates.includes(today)) {
    dates.push(today);
    // Keep only last 30 dates
    if (dates.length > 30) dates.shift();
    localStorage.setItem(STORAGE_KEYS.LOGIN_DATES, JSON.stringify(dates));
  }

  // Calculate consecutive days
  const sortedDates = dates
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 1;
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = sortedDates[i].getTime() - sortedDates[i + 1].getTime();
    if (diff <= oneDay * 1.5) { // Allow some flexibility
      streak++;
    } else {
      break;
    }
  }

  if (streak >= 3) await grantAchievement(userId, 'daily_streak_3');
  if (streak >= 7) await grantAchievement(userId, 'daily_streak_7');
  if (streak >= 30) await grantAchievement(userId, 'daily_streak_30');
}

// Track window count for multitasking achievements
export async function trackWindowCount(count: number): Promise<void> {
  // Dispatch quest progress for window count
  dispatchQuestProgress('window_count', 0, { count });
  
  const userId = await getCurrentUserId();
  if (!userId) return;

  if (count >= 5) await grantAchievement(userId, 'window_multitask_5');
  if (count >= 10) await grantAchievement(userId, 'window_multitask_10');
}

// Track theme change
export async function trackThemeChange(): Promise<void> {
  // Dispatch quest progress for theme change
  dispatchQuestProgress('theme_change', 1);
  
  const userId = await getCurrentUserId();
  if (!userId) return;

  await grantAchievement(userId, 'theme_changer');
}

// Track crash recovery
export async function trackCrashRecovery(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await grantAchievement(userId, 'crash_survivor');
}

// Start session tracking
export function startSessionTracking(): void {
  localStorage.setItem(STORAGE_KEYS.SESSION_START, Date.now().toString());
}

// Check session duration achievements
export async function checkSessionAchievements(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const startTime = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_START) || '0');
  if (!startTime) return;

  const elapsed = Date.now() - startTime;
  const oneHour = 60 * 60 * 1000;
  const threeHours = 3 * oneHour;

  if (elapsed >= oneHour) {
    await grantAchievement(userId, 'session_1hr');
  }
  if (elapsed >= threeHours) {
    await grantAchievement(userId, 'session_3hr');
  }
}

// UCG Achievement tracking
const UCG_STORAGE = {
  GAMES_COMPLETED: 'ucg_games_completed',
  TOTAL_WINS: 'ucg_total_wins',
};

export async function trackUCGRoundWin(handValue: number, wasBlackjack: boolean): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await grantAchievement(userId, 'ucg_first_win');
  
  if (wasBlackjack) {
    await grantAchievement(userId, 'ucg_blackjack');
  }
  
  if (handValue === 21) {
    await grantAchievement(userId, 'ucg_win_21');
  }
  
  dispatchQuestProgress('ucg_round_win', 1, { handValue, wasBlackjack });
}

export async function trackUCGGameComplete(
  roundsPlayed: number,
  roundsWon: number,
  botDifficulty: string,
  botCount: number
): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await grantAchievement(userId, 'ucg_first_game');
  
  // Track completed games
  const gamesCompleted = parseInt(localStorage.getItem(UCG_STORAGE.GAMES_COMPLETED) || '0') + 1;
  localStorage.setItem(UCG_STORAGE.GAMES_COMPLETED, gamesCompleted.toString());
  
  if (gamesCompleted >= 50) {
    await grantAchievement(userId, 'ucg_50_games');
  }
  
  // Winning streak (5+ wins)
  if (roundsWon >= 5) {
    await grantAchievement(userId, 'ucg_win_5');
  }
  
  // Perfect game
  if (roundsWon === roundsPlayed && roundsPlayed >= 5) {
    await grantAchievement(userId, 'ucg_perfect_game');
  }
  
  // Marathon (10 rounds)
  if (roundsPlayed >= 10) {
    await grantAchievement(userId, 'ucg_marathon');
  }
  
  // Beat hard bots
  if (botDifficulty === 'hard' && botCount >= 3 && roundsWon > roundsPlayed / 2) {
    await grantAchievement(userId, 'ucg_beat_hard');
  }
  
  dispatchQuestProgress('ucg_game_complete', 1, { roundsPlayed, roundsWon });
}

export async function trackUCGCloseCall(playerScore: number, opponentScore: number): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  if (playerScore === 20 && opponentScore === 19) {
    await grantAchievement(userId, 'ucg_close_call');
  }
}

// Containment Breach Achievement tracking
const CONTAINMENT_STORAGE = {
  ENCOUNTERED_SUBJECTS: 'containment_encountered_subjects',
  LORE_READ: 'containment_lore_read',
};

export async function trackContainmentNightComplete(
  night: number,
  powerRemaining: number,
  luresUsed: number
): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  // Night completion achievements
  if (night >= 1) await grantAchievement(userId, 'containment_night1');
  if (night >= 3) await grantAchievement(userId, 'containment_night3');
  if (night >= 5) {
    await grantAchievement(userId, 'containment_night5');
    await grantAchievement(userId, 'containment_master');
  }
  
  // Power saver
  if (powerRemaining >= 50) {
    await grantAchievement(userId, 'containment_power_saver');
  }
  
  // Silent night
  if (luresUsed === 0) {
    await grantAchievement(userId, 'containment_no_lure');
  }
  
  dispatchQuestProgress('containment_night_complete', 1, { night, powerRemaining });
}

export async function trackContainmentDeath(subjectId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await grantAchievement(userId, 'containment_died');
  
  // Track encountered subjects
  const stored = localStorage.getItem(CONTAINMENT_STORAGE.ENCOUNTERED_SUBJECTS);
  const encountered: string[] = stored ? JSON.parse(stored) : [];
  
  if (!encountered.includes(subjectId)) {
    encountered.push(subjectId);
    localStorage.setItem(CONTAINMENT_STORAGE.ENCOUNTERED_SUBJECTS, JSON.stringify(encountered));
    
    // Check if all subjects encountered (assuming 5 unique subjects)
    if (encountered.length >= 5) {
      await grantAchievement(userId, 'containment_all_subjects');
    }
  }
}

export async function trackContainmentCloseCall(timeRemaining: number): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  if (timeRemaining <= 1000) {
    await grantAchievement(userId, 'containment_close_call');
  }
}

export async function trackContainmentLoreRead(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const count = parseInt(localStorage.getItem(CONTAINMENT_STORAGE.LORE_READ) || '0') + 1;
  localStorage.setItem(CONTAINMENT_STORAGE.LORE_READ, count.toString());
  
  if (count >= 5) {
    await grantAchievement(userId, 'containment_lore_reader');
  }
}

export async function trackContainmentSubjectEncounter(subjectId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  // Track encountered subjects
  const storedEncounters = localStorage.getItem(CONTAINMENT_STORAGE.ENCOUNTERED_SUBJECTS);
  const encountered: string[] = storedEncounters ? JSON.parse(storedEncounters) : [];
  
  if (!encountered.includes(subjectId)) {
    encountered.push(subjectId);
    localStorage.setItem(CONTAINMENT_STORAGE.ENCOUNTERED_SUBJECTS, JSON.stringify(encountered));
    
    if (encountered.length >= 5) {
      await grantAchievement(userId, 'containment_all_subjects');
    }
  }
}

// Dark Web Achievement tracking
const DARK_WEB_STORAGE = {
  VISITED_SITES: 'dark_web_visited_sites',
  CONNECTED_TO_DARK: 'dark_web_connected',
};

export async function trackDarkVPNConnect(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const connected = localStorage.getItem(DARK_WEB_STORAGE.CONNECTED_TO_DARK);
  if (!connected) {
    localStorage.setItem(DARK_WEB_STORAGE.CONNECTED_TO_DARK, 'true');
    await grantAchievement(userId, 'dark_explorer');
  }
}

export async function trackDarkWebVisit(siteId: 'depths' | 'blackmarket' | 'void'): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const storedSites = localStorage.getItem(DARK_WEB_STORAGE.VISITED_SITES);
  const visitedSites: string[] = storedSites ? JSON.parse(storedSites) : [];
  
  if (!visitedSites.includes(siteId)) {
    visitedSites.push(siteId);
    localStorage.setItem(DARK_WEB_STORAGE.VISITED_SITES, JSON.stringify(visitedSites));
    
    // Grant individual site achievements
    if (siteId === 'depths') {
      await grantAchievement(userId, 'dark_reader');
    } else if (siteId === 'blackmarket') {
      await grantAchievement(userId, 'black_market_visitor');
    } else if (siteId === 'void') {
      await grantAchievement(userId, 'void_traveler');
    }
    
    // Check if all sites visited
    if (visitedSites.includes('depths') && visitedSites.includes('blackmarket') && visitedSites.includes('void')) {
      await grantAchievement(userId, 'dark_web_master');
    }
  }
}

// Hook for components to use
export function useAchievementTriggers() {
  const triggerAppOpen = useCallback(async (appId: string) => {
    await trackAppOpen(appId);
    await checkTimeAchievements();
  }, []);

  const triggerChatMessage = useCallback(async () => {
    await trackChatMessage();
  }, []);

  const triggerTerminalCommand = useCallback(async (command: string) => {
    await trackTerminalCommand(command);
  }, []);

  const triggerFriendAdded = useCallback(async (count: number) => {
    await trackFriendAdded(count);
  }, []);

  const triggerLogin = useCallback(async () => {
    await trackLogin();
    startSessionTracking();
  }, []);

  const triggerWindowCount = useCallback(async (count: number) => {
    await trackWindowCount(count);
  }, []);

  const triggerThemeChange = useCallback(async () => {
    await trackThemeChange();
  }, []);

  const triggerCrashRecovery = useCallback(async () => {
    await trackCrashRecovery();
  }, []);

  const checkSession = useCallback(async () => {
    await checkSessionAchievements();
  }, []);

  // UCG triggers
  const triggerUCGRoundWin = useCallback(async (handValue: number, wasBlackjack: boolean) => {
    await trackUCGRoundWin(handValue, wasBlackjack);
  }, []);

  const triggerUCGGameComplete = useCallback(async (
    roundsPlayed: number,
    roundsWon: number,
    botDifficulty: string,
    botCount: number
  ) => {
    await trackUCGGameComplete(roundsPlayed, roundsWon, botDifficulty, botCount);
  }, []);

  const triggerUCGCloseCall = useCallback(async (playerScore: number, opponentScore: number) => {
    await trackUCGCloseCall(playerScore, opponentScore);
  }, []);

  // Containment triggers
  const triggerContainmentNightComplete = useCallback(async (
    night: number,
    powerRemaining: number,
    luresUsed: number
  ) => {
    await trackContainmentNightComplete(night, powerRemaining, luresUsed);
  }, []);

  const triggerContainmentDeath = useCallback(async (subjectId: string) => {
    await trackContainmentDeath(subjectId);
  }, []);

  const triggerContainmentCloseCall = useCallback(async (timeRemaining: number) => {
    await trackContainmentCloseCall(timeRemaining);
  }, []);

  const triggerContainmentLoreRead = useCallback(async () => {
    await trackContainmentLoreRead();
  }, []);

  // Dark Web triggers
  const triggerDarkVPNConnect = useCallback(async () => {
    await trackDarkVPNConnect();
  }, []);

  const triggerDarkWebVisit = useCallback(async (siteId: 'depths' | 'blackmarket' | 'void') => {
    await trackDarkWebVisit(siteId);
  }, []);

  return {
    triggerAppOpen,
    triggerChatMessage,
    triggerTerminalCommand,
    triggerFriendAdded,
    triggerLogin,
    triggerWindowCount,
    triggerThemeChange,
    triggerCrashRecovery,
    checkSession,
    // UCG
    triggerUCGRoundWin,
    triggerUCGGameComplete,
    triggerUCGCloseCall,
    // Containment
    triggerContainmentNightComplete,
    triggerContainmentDeath,
    triggerContainmentCloseCall,
    triggerContainmentLoreRead,
    // Dark Web
    triggerDarkVPNConnect,
    triggerDarkWebVisit,
  };
}
