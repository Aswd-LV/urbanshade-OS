// UrbanShade OS v3.1 - Achievements System

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'onboarding' | 'social' | 'contribution' | 'longevity' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  hidden?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Onboarding
  {
    id: 'first_login',
    name: 'First Boot',
    description: 'Successfully logged into UrbanShade OS',
    icon: '🖥️',
    category: 'onboarding',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'profile_complete',
    name: 'Identity Established',
    description: 'Complete your user profile with a bio',
    icon: '👤',
    category: 'onboarding',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'first_message',
    name: 'First Transmission',
    description: 'Send your first direct message',
    icon: '📨',
    category: 'onboarding',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'first_chat',
    name: 'Hello World',
    description: 'Send your first global chat message',
    icon: '💬',
    category: 'onboarding',
    rarity: 'common',
    points: 10,
  },

  // Social
  {
    id: 'chat_10',
    name: 'Chatterbox',
    description: 'Send 10 global chat messages',
    icon: '🗣️',
    category: 'social',
    rarity: 'common',
    points: 20,
  },
  {
    id: 'chat_50',
    name: 'Communicator',
    description: 'Send 50 global chat messages',
    icon: '📢',
    category: 'social',
    rarity: 'uncommon',
    points: 35,
  },
  {
    id: 'chat_100',
    name: 'Social Butterfly',
    description: 'Send 100 global chat messages',
    icon: '🦋',
    category: 'social',
    rarity: 'rare',
    points: 50,
  },
  {
    id: 'chat_500',
    name: 'Voice of the Deep',
    description: 'Send 500 global chat messages',
    icon: '🔊',
    category: 'social',
    rarity: 'epic',
    points: 100,
  },
  {
    id: 'friend_1',
    name: 'Connection Made',
    description: 'Add your first friend',
    icon: '🤝',
    category: 'social',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'friend_5',
    name: 'Networked',
    description: 'Add 5 friends',
    icon: '🔗',
    category: 'social',
    rarity: 'uncommon',
    points: 30,
  },
  {
    id: 'friend_20',
    name: 'Popular',
    description: 'Add 20 friends',
    icon: '⭐',
    category: 'social',
    rarity: 'rare',
    points: 60,
  },

  // Contribution
  {
    id: 'uur_submit',
    name: 'Package Creator',
    description: 'Submit a UUR package for review',
    icon: '📦',
    category: 'contribution',
    rarity: 'uncommon',
    points: 25,
  },
  {
    id: 'uur_approved',
    name: 'Verified Contributor',
    description: 'Have a UUR package approved',
    icon: '✅',
    category: 'contribution',
    rarity: 'rare',
    points: 75,
  },
  {
    id: 'bug_report',
    name: 'Bug Hunter',
    description: 'Submit a bug report that gets resolved',
    icon: '🐛',
    category: 'contribution',
    rarity: 'uncommon',
    points: 30,
  },
  {
    id: 'helper',
    name: 'Community Helper',
    description: 'Recognized for helping the community',
    icon: '🎗️',
    category: 'contribution',
    rarity: 'rare',
    points: 50,
  },

  // Longevity
  {
    id: 'week_active',
    name: 'Weekly Operator',
    description: 'Active member for 7 days',
    icon: '📅',
    category: 'longevity',
    rarity: 'common',
    points: 20,
  },
  {
    id: 'month_active',
    name: 'Veteran',
    description: 'Active member for 30 days',
    icon: '🎖️',
    category: 'longevity',
    rarity: 'uncommon',
    points: 40,
  },
  {
    id: 'quarter_active',
    name: 'Seasoned Operator',
    description: 'Active member for 90 days',
    icon: '🏅',
    category: 'longevity',
    rarity: 'rare',
    points: 75,
  },
  {
    id: 'year_active',
    name: 'Legacy',
    description: 'Active member for 1 year',
    icon: '🏆',
    category: 'longevity',
    rarity: 'epic',
    points: 150,
  },

  // Special (Admin-granted)
  {
    id: 'beta_tester',
    name: 'Beta Tester',
    description: 'Participated in beta testing',
    icon: '🧪',
    category: 'special',
    rarity: 'rare',
    points: 50,
  },
  {
    id: 'founding_member',
    name: 'Founding Member',
    description: 'Early adopter of UrbanShade OS',
    icon: '🌟',
    category: 'special',
    rarity: 'legendary',
    points: 200,
  },
  {
    id: 'vip',
    name: 'VIP Access',
    description: 'Granted VIP status',
    icon: '👑',
    category: 'special',
    rarity: 'epic',
    points: 100,
  },
  {
    id: 'staff_member',
    name: 'Staff Member',
    description: 'Part of the UrbanShade team',
    icon: '🛡️',
    category: 'special',
    rarity: 'legendary',
    points: 0,
    hidden: true,
  },

  // Explorer
  {
    id: 'app_opener_5',
    name: 'Curious Mind',
    description: 'Open 5 different apps',
    icon: '🔍',
    category: 'onboarding',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'app_opener_15',
    name: 'Power User',
    description: 'Open 15 different apps',
    icon: '⚡',
    category: 'onboarding',
    rarity: 'uncommon',
    points: 25,
  },
  {
    id: 'app_opener_all',
    name: 'Completionist',
    description: 'Open every app at least once',
    icon: '🎯',
    category: 'onboarding',
    rarity: 'rare',
    points: 75,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Use the OS between 12 AM - 4 AM',
    icon: '🦉',
    category: 'special',
    rarity: 'uncommon',
    points: 20,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Use the OS between 5 AM - 7 AM',
    icon: '🐦',
    category: 'special',
    rarity: 'uncommon',
    points: 20,
  },
  {
    id: 'window_multitask_5',
    name: 'Multitasker',
    description: 'Have 5 windows open at once',
    icon: '🪟',
    category: 'onboarding',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'window_multitask_10',
    name: 'Window Manager',
    description: 'Have 10 windows open at once',
    icon: '🖥️',
    category: 'onboarding',
    rarity: 'rare',
    points: 40,
  },
  {
    id: 'theme_changer',
    name: 'Style Switcher',
    description: 'Change your theme',
    icon: '🎨',
    category: 'onboarding',
    rarity: 'common',
    points: 10,
  },
  {
    id: 'customizer',
    name: 'Personalized',
    description: 'Customize profile icon and color',
    icon: '✨',
    category: 'onboarding',
    rarity: 'common',
    points: 15,
  },

  // Secret
  {
    id: 'konami_code',
    name: 'Classic Gamer',
    description: 'Enter the Konami code',
    icon: '🎮',
    category: 'special',
    rarity: 'rare',
    points: 50,
    hidden: true,
  },
  {
    id: 'easter_egg_finder',
    name: 'Egg Hunter',
    description: 'Find a hidden easter egg',
    icon: '🥚',
    category: 'special',
    rarity: 'uncommon',
    points: 30,
    hidden: true,
  },
  {
    id: 'crash_survivor',
    name: 'Crash Survivor',
    description: 'Experience and recover from a system crash',
    icon: '💥',
    category: 'special',
    rarity: 'rare',
    points: 35,
  },
  {
    id: 'terminal_hacker',
    name: 'Terminal Ninja',
    description: 'Use 20 different terminal commands',
    icon: '⌨️',
    category: 'contribution',
    rarity: 'rare',
    points: 45,
  },

  // Engagement
  {
    id: 'session_1hr',
    name: 'Marathon Session',
    description: 'Use the OS for 1 hour straight',
    icon: '⏱️',
    category: 'longevity',
    rarity: 'uncommon',
    points: 25,
  },
  {
    id: 'session_3hr',
    name: 'Dedicated Operator',
    description: 'Use the OS for 3 hours straight',
    icon: '🏃',
    category: 'longevity',
    rarity: 'rare',
    points: 50,
  },
  {
    id: 'daily_streak_3',
    name: 'Getting Started',
    description: 'Log in 3 days in a row',
    icon: '📆',
    category: 'longevity',
    rarity: 'common',
    points: 15,
  },
  {
    id: 'daily_streak_7',
    name: 'Week Warrior',
    description: 'Log in 7 days in a row',
    icon: '🔥',
    category: 'longevity',
    rarity: 'uncommon',
    points: 30,
  },
  {
    id: 'daily_streak_30',
    name: 'Monthly Master',
    description: 'Log in 30 days in a row',
    icon: '👑',
    category: 'longevity',
    rarity: 'epic',
    points: 100,
  },

  // Battle Pass & Advanced
  {
    id: 'battlepass_complete',
    name: 'Pass Champion',
    description: 'Complete a Battle Pass to level 100',
    icon: '🏅',
    category: 'special',
    rarity: 'legendary',
    points: 500,
  },
  {
    id: 'level_50_pass',
    name: 'Halfway There',
    description: 'Reach level 50 in a Battle Pass',
    icon: '⚡',
    category: 'longevity',
    rarity: 'rare',
    points: 75,
  },
  {
    id: 'quest_streak_10',
    name: 'Quest Master',
    description: 'Complete 10 quests in a row',
    icon: '📋',
    category: 'contribution',
    rarity: 'epic',
    points: 150,
  },
  {
    id: 'legendary_quest',
    name: 'Fortune Favors',
    description: 'Complete a Legendary rarity quest',
    icon: '🌟',
    category: 'special',
    rarity: 'rare',
    points: 75,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quest within 1 minute',
    icon: '⚡',
    category: 'special',
    rarity: 'rare',
    points: 60,
  },
  {
    id: 'file_explorer_pro',
    name: 'Data Miner',
    description: 'Create 25 files in File Explorer',
    icon: '📁',
    category: 'contribution',
    rarity: 'uncommon',
    points: 35,
  },
  {
    id: 'calculator_use',
    name: 'Number Cruncher',
    description: 'Use the calculator 50 times',
    icon: '🔢',
    category: 'onboarding',
    rarity: 'uncommon',
    points: 25,
  },
  {
    id: 'notepad_novel',
    name: 'Digital Author',
    description: 'Write 1000+ characters in Notepad',
    icon: '📝',
    category: 'contribution',
    rarity: 'rare',
    points: 50,
  },
  {
    id: 'secret_command',
    name: 'Hidden Protocol',
    description: 'Use a secret terminal command',
    icon: '🔐',
    category: 'special',
    rarity: 'epic',
    points: 100,
    hidden: true,
  },
  {
    id: 'paint_masterpiece',
    name: 'Digital Artist',
    description: 'Save an image in Paint',
    icon: '🎨',
    category: 'onboarding',
    rarity: 'common',
    points: 15,
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id);
};

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return ACHIEVEMENTS.filter(a => a.category === category);
};

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common': return 'text-muted-foreground';
    case 'uncommon': return 'text-green-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-muted-foreground';
  }
};

export const getRarityBgColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common': return 'bg-muted/50';
    case 'uncommon': return 'bg-green-500/10 border-green-500/30';
    case 'rare': return 'bg-blue-500/10 border-blue-500/30';
    case 'epic': return 'bg-purple-500/10 border-purple-500/30';
    case 'legendary': return 'bg-yellow-500/10 border-yellow-500/30';
    default: return 'bg-muted/50';
  }
};

export const calculateTotalPoints = (unlockedIds: string[]): number => {
  return unlockedIds.reduce((total, id) => {
    const achievement = getAchievementById(id);
    return total + (achievement?.points || 0);
  }, 0);
};
