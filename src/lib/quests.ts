// UrbanShade OS v3.1 - Quest System

export type QuestRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface QuestDefinition {
  id: string;
  name: string;
  description: string;
  rarity: QuestRarity;
  xpReward: number;
  target: number;
  trackingType: 'app_open' | 'chat_send' | 'terminal_command' | 'window_count' | 'file_create' | 'theme_change' | 'friend_add' | 'session_time' | 'quest_complete' | 'profile_update' | 'settings_open' | 'leaderboard_view' | 'process_kill' | 'calculator_use';
  trackingParams?: Record<string, any>;
}

export const RARITY_CONFIG: Record<QuestRarity, { dropRate: number; color: string; bgColor: string; xpRange: [number, number] }> = {
  common: { dropRate: 50, color: 'text-muted-foreground', bgColor: 'bg-muted/50', xpRange: [30, 50] },
  uncommon: { dropRate: 30, color: 'text-green-400', bgColor: 'bg-green-500/10', xpRange: [60, 100] },
  rare: { dropRate: 15, color: 'text-blue-400', bgColor: 'bg-blue-500/10', xpRange: [120, 180] },
  epic: { dropRate: 4, color: 'text-purple-400', bgColor: 'bg-purple-500/10', xpRange: [200, 300] },
  legendary: { dropRate: 1, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', xpRange: [400, 600] },
};

export const QUEST_POOL: QuestDefinition[] = [
  // Common Quests (30-50 XP)
  { id: 'open_any_app', name: 'App Explorer', description: 'Open any application', rarity: 'common', xpReward: 30, target: 1, trackingType: 'app_open' },
  { id: 'open_task_manager', name: 'System Check', description: 'Open Task Manager', rarity: 'common', xpReward: 40, target: 1, trackingType: 'app_open', trackingParams: { appId: 'task-manager' } },
  { id: 'change_theme', name: 'Style Switch', description: 'Change your theme', rarity: 'common', xpReward: 35, target: 1, trackingType: 'theme_change' },
  { id: 'send_chat', name: 'Say Hello', description: 'Send a chat message', rarity: 'common', xpReward: 40, target: 1, trackingType: 'chat_send' },
  { id: 'open_settings', name: 'Configure', description: 'Open Settings', rarity: 'common', xpReward: 30, target: 1, trackingType: 'settings_open' },
  { id: 'view_profile', name: 'Self Check', description: 'View your profile', rarity: 'common', xpReward: 35, target: 1, trackingType: 'profile_update' },

  // Uncommon Quests (60-100 XP)
  { id: 'open_3_apps', name: 'Multi-Tasker', description: 'Open 3 different apps', rarity: 'uncommon', xpReward: 70, target: 3, trackingType: 'app_open' },
  { id: 'send_5_chats', name: 'Chatterbox', description: 'Send 5 chat messages', rarity: 'uncommon', xpReward: 80, target: 5, trackingType: 'chat_send' },
  { id: 'use_terminal', name: 'Command Line', description: 'Use the Terminal', rarity: 'uncommon', xpReward: 75, target: 1, trackingType: 'terminal_command' },
  { id: 'create_file', name: 'File Creator', description: 'Create a file in File Explorer', rarity: 'uncommon', xpReward: 90, target: 1, trackingType: 'file_create' },
  { id: 'view_leaderboards', name: 'Competitive', description: 'View the Leaderboards', rarity: 'uncommon', xpReward: 60, target: 1, trackingType: 'leaderboard_view' },
  { id: 'add_friend', name: 'Social Butterfly', description: 'Add someone as a friend', rarity: 'uncommon', xpReward: 100, target: 1, trackingType: 'friend_add' },

  // Rare Quests (120-180 XP)
  { id: 'kill_process', name: 'Process Terminator', description: 'Kill a process in Task Manager', rarity: 'rare', xpReward: 150, target: 1, trackingType: 'process_kill' },
  { id: 'use_3_commands', name: 'Terminal Pro', description: 'Use 3 terminal commands', rarity: 'rare', xpReward: 140, target: 3, trackingType: 'terminal_command' },
  { id: 'open_5_apps', name: 'Power User', description: 'Open 5 different apps', rarity: 'rare', xpReward: 160, target: 5, trackingType: 'app_open' },
  { id: 'send_10_chats', name: 'Communicator', description: 'Send 10 chat messages', rarity: 'rare', xpReward: 130, target: 10, trackingType: 'chat_send' },
  { id: 'complete_profile', name: 'Identity', description: 'Update your profile bio', rarity: 'rare', xpReward: 120, target: 1, trackingType: 'profile_update' },
  { id: 'create_3_files', name: 'Data Manager', description: 'Create 3 files', rarity: 'rare', xpReward: 180, target: 3, trackingType: 'file_create' },

  // Epic Quests (200-300 XP)
  { id: 'use_5_commands', name: 'Terminal Master', description: 'Use 5 different terminal commands', rarity: 'epic', xpReward: 250, target: 5, trackingType: 'terminal_command' },
  { id: 'open_10_apps', name: 'App Collector', description: 'Open 10 different apps', rarity: 'epic', xpReward: 280, target: 10, trackingType: 'app_open' },
  { id: 'windows_5', name: 'Window Manager', description: 'Have 5 windows open at once', rarity: 'epic', xpReward: 220, target: 5, trackingType: 'window_count' },
  { id: 'send_20_chats', name: 'Socialite', description: 'Send 20 chat messages', rarity: 'epic', xpReward: 240, target: 20, trackingType: 'chat_send' },
  { id: 'session_30min', name: 'Dedicated', description: 'Be online for 30 minutes', rarity: 'epic', xpReward: 300, target: 30, trackingType: 'session_time' },

  // Legendary Quests (400-600 XP)
  { id: 'use_10_commands', name: 'Hacker Elite', description: 'Use 10 unique terminal commands', rarity: 'legendary', xpReward: 500, target: 10, trackingType: 'terminal_command' },
  { id: 'open_all_core', name: 'Completionist', description: 'Open every core app', rarity: 'legendary', xpReward: 600, target: 15, trackingType: 'app_open' },
  { id: 'send_50_chats', name: 'Voice of the Deep', description: 'Send 50 chat messages', rarity: 'legendary', xpReward: 550, target: 50, trackingType: 'chat_send' },
  { id: 'complete_3_quests', name: 'Quest Hunter', description: 'Complete 3 other quests', rarity: 'legendary', xpReward: 400, target: 3, trackingType: 'quest_complete' },
];

// XP required per level (steeper curve with big jump at 100)
export const getXpForLevel = (level: number): number => {
  if (level <= 10) return 100;
  if (level <= 25) return 150;
  if (level <= 40) return 250;
  if (level <= 60) return 350;
  if (level <= 80) return 500;
  if (level <= 99) return 750;
  return 2500; // Level 100 - big jump!
};

// Total XP needed to reach a level
export const getTotalXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i);
  }
  return total;
};

// Get next 6-hour UTC reset time
export const getNextQuestReset = (): Date => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const resetHours = [0, 6, 12, 18];
  
  let nextResetHour = resetHours.find(h => h > utcHours);
  if (nextResetHour === undefined) {
    nextResetHour = 0;
    now.setUTCDate(now.getUTCDate() + 1);
  }
  
  now.setUTCHours(nextResetHour, 0, 0, 0);
  return now;
};

// Get current quest window start time
export const getCurrentQuestWindow = (): Date => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const resetHours = [0, 6, 12, 18];
  
  let currentWindowHour = 0;
  for (const h of resetHours) {
    if (utcHours >= h) currentWindowHour = h;
  }
  
  const windowStart = new Date(now);
  windowStart.setUTCHours(currentWindowHour, 0, 0, 0);
  return windowStart;
};

// Select random quests based on rarity weights
export const selectRandomQuests = (count: number = 4): QuestDefinition[] => {
  const selected: QuestDefinition[] = [];
  const availableQuests = [...QUEST_POOL];
  
  while (selected.length < count && availableQuests.length > 0) {
    // Roll for rarity
    const roll = Math.random() * 100;
    let targetRarity: QuestRarity;
    
    if (roll < RARITY_CONFIG.legendary.dropRate) {
      targetRarity = 'legendary';
    } else if (roll < RARITY_CONFIG.legendary.dropRate + RARITY_CONFIG.epic.dropRate) {
      targetRarity = 'epic';
    } else if (roll < RARITY_CONFIG.legendary.dropRate + RARITY_CONFIG.epic.dropRate + RARITY_CONFIG.rare.dropRate) {
      targetRarity = 'rare';
    } else if (roll < RARITY_CONFIG.legendary.dropRate + RARITY_CONFIG.epic.dropRate + RARITY_CONFIG.rare.dropRate + RARITY_CONFIG.uncommon.dropRate) {
      targetRarity = 'uncommon';
    } else {
      targetRarity = 'common';
    }
    
    // Find quests of target rarity
    const matchingQuests = availableQuests.filter(q => q.rarity === targetRarity);
    
    if (matchingQuests.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingQuests.length);
      const quest = matchingQuests[randomIndex];
      selected.push(quest);
      
      // Remove from available pool
      const poolIndex = availableQuests.findIndex(q => q.id === quest.id);
      if (poolIndex > -1) availableQuests.splice(poolIndex, 1);
    }
  }
  
  return selected;
};
