// UrbanShade OS v3.1 - Battle Pass Season Definitions

export interface SeasonReward {
  level: number;
  type: 'kroner' | 'title' | 'theme' | 'badge' | 'certificate' | 'wallpaper' | 'profile_effect';
  value: string;
  name: string;
}

export interface SeasonDefinition {
  key: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rewards: SeasonReward[];
}

// Season 1: Genesis (Q1 2025)
export const SEASON_GENESIS: SeasonDefinition = {
  key: 'genesis',
  name: 'Season 1: Genesis',
  description: 'The inaugural season of UrbanShade OS. Unlock exclusive themes, titles, and prove yourself as a Genesis Champion.',
  startDate: '2025-01-01T00:00:00Z',
  endDate: '2025-03-31T23:59:59Z',
  rewards: [
    // Level 1-10: Getting Started
    { level: 1, type: 'kroner', value: '50', name: '50 Kroner' },
    { level: 3, type: 'wallpaper', value: 'genesis-grid', name: 'Genesis Grid Wallpaper' },
    { level: 5, type: 'title', value: 'rookie_operator', name: 'Rookie Operator Title' },
    { level: 7, type: 'kroner', value: '75', name: '75 Kroner' },
    { level: 10, type: 'theme', value: 'neon-pulse', name: 'Neon Pulse Theme' },
    
    // Level 11-20: Building Momentum
    { level: 12, type: 'badge', value: 'genesis-starter', name: 'Genesis Starter Badge' },
    { level: 15, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 18, type: 'wallpaper', value: 'circuit-flow', name: 'Circuit Flow Wallpaper' },
    { level: 20, type: 'title', value: 'system_initiate', name: 'System Initiate Title' },
    
    // Level 21-30: Rising Star
    { level: 22, type: 'kroner', value: '125', name: '125 Kroner' },
    { level: 25, type: 'theme', value: 'cyber-grid', name: 'Cyber Grid Theme' },
    { level: 27, type: 'badge', value: 'rising-star', name: 'Rising Star Badge' },
    { level: 30, type: 'title', value: 'rising_star', name: 'Rising Star Title' },
    
    // Level 31-40: Power User
    { level: 32, type: 'kroner', value: '150', name: '150 Kroner' },
    { level: 35, type: 'wallpaper', value: 'data-stream', name: 'Data Stream Wallpaper' },
    { level: 38, type: 'profile_effect', value: 'subtle-glow', name: 'Subtle Glow Effect' },
    { level: 40, type: 'theme', value: 'crimson-protocol', name: 'Crimson Protocol Theme' },
    
    // Level 41-50: Veteran
    { level: 42, type: 'kroner', value: '175', name: '175 Kroner' },
    { level: 45, type: 'badge', value: 'halfway-hero', name: 'Halfway Hero Badge' },
    { level: 48, type: 'wallpaper', value: 'neural-network', name: 'Neural Network Wallpaper' },
    { level: 50, type: 'title', value: 'veteran_operator', name: 'Veteran Operator Title' },
    
    // Level 51-60: Elite Territory
    { level: 52, type: 'kroner', value: '200', name: '200 Kroner' },
    { level: 55, type: 'theme', value: 'frozen-core', name: 'Frozen Core Theme' },
    { level: 58, type: 'badge', value: 'elite-member', name: 'Elite Member Badge' },
    { level: 60, type: 'profile_effect', value: 'data-pulse', name: 'Data Pulse Effect' },
    
    // Level 61-70: Master Class
    { level: 62, type: 'kroner', value: '250', name: '250 Kroner' },
    { level: 65, type: 'theme', value: 'solar-flare', name: 'Solar Flare Theme' },
    { level: 68, type: 'wallpaper', value: 'quantum-field', name: 'Quantum Field Wallpaper' },
    { level: 70, type: 'title', value: 'elite_agent', name: 'Elite Agent Title' },
    
    // Level 71-80: Approaching Legend
    { level: 72, type: 'kroner', value: '300', name: '300 Kroner' },
    { level: 75, type: 'badge', value: 'genesis-elite', name: 'Genesis Elite Badge' },
    { level: 78, type: 'profile_effect', value: 'genesis-aura', name: 'Genesis Aura Effect' },
    { level: 80, type: 'theme', value: 'void-walker', name: 'Void Walker Theme' },
    
    // Level 81-90: The Final Push
    { level: 82, type: 'kroner', value: '350', name: '350 Kroner' },
    { level: 85, type: 'wallpaper', value: 'genesis-matrix', name: 'Genesis Matrix Wallpaper' },
    { level: 88, type: 'badge', value: 'master-badge', name: 'Master Badge' },
    { level: 90, type: 'title', value: 'master_operator', name: 'Master Operator Title' },
    
    // Level 91-99: Almost There
    { level: 92, type: 'kroner', value: '400', name: '400 Kroner' },
    { level: 95, type: 'theme', value: 'genesis-prime', name: 'Genesis Prime Theme' },
    { level: 98, type: 'profile_effect', value: 'champion-flames', name: 'Champion Flames Effect' },
    
    // Level 100: Ultimate Reward
    { level: 100, type: 'certificate', value: 'genesis_champion', name: 'Genesis Champion Certificate + 1000 Kroner' },
  ]
};

// Season 2: Phantom Protocol (Q2 2025)
export const SEASON_PHANTOM: SeasonDefinition = {
  key: 'phantom',
  name: 'Season 2: Phantom Protocol',
  description: 'Embrace the shadows. Unlock stealth-themed rewards and become a Phantom Elite.',
  startDate: '2025-04-01T00:00:00Z',
  endDate: '2025-06-30T23:59:59Z',
  rewards: [
    // Level 1-10: Into the Shadows
    { level: 1, type: 'kroner', value: '50', name: '50 Kroner' },
    { level: 3, type: 'wallpaper', value: 'shadow-grid', name: 'Shadow Grid Wallpaper' },
    { level: 5, type: 'title', value: 'shadow_initiate', name: 'Shadow Initiate Title' },
    { level: 7, type: 'kroner', value: '75', name: '75 Kroner' },
    { level: 10, type: 'theme', value: 'shadow-network', name: 'Shadow Network Theme' },
    
    // Level 11-20: Ghost Protocol
    { level: 12, type: 'badge', value: 'phantom-starter', name: 'Phantom Starter Badge' },
    { level: 15, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 18, type: 'wallpaper', value: 'stealth-mode', name: 'Stealth Mode Wallpaper' },
    { level: 20, type: 'title', value: 'ghost_protocol', name: 'Ghost Protocol Title' },
    
    // Level 21-30: Silent Watcher
    { level: 22, type: 'kroner', value: '125', name: '125 Kroner' },
    { level: 25, type: 'theme', value: 'stealth-mode', name: 'Stealth Mode Theme' },
    { level: 27, type: 'badge', value: 'silent-watcher', name: 'Silent Watcher Badge' },
    { level: 30, type: 'title', value: 'silent_watcher', name: 'Silent Watcher Title' },
    
    // Level 31-40: Phantom Rising
    { level: 32, type: 'kroner', value: '150', name: '150 Kroner' },
    { level: 35, type: 'wallpaper', value: 'phantom-pulse', name: 'Phantom Pulse Wallpaper' },
    { level: 38, type: 'profile_effect', value: 'shadow-mist', name: 'Shadow Mist Effect' },
    { level: 40, type: 'title', value: 'ghost_machine', name: 'Ghost in the Machine Title' },
    
    // Level 41-50: Night Stalker
    { level: 42, type: 'kroner', value: '175', name: '175 Kroner' },
    { level: 45, type: 'badge', value: 'phantom-halfway', name: 'Phantom Halfway Badge' },
    { level: 48, type: 'wallpaper', value: 'night-vision', name: 'Night Vision Wallpaper' },
    { level: 50, type: 'theme', value: 'phantom-glow', name: 'Phantom Glow Theme' },
    
    // Level 51-60: Shadow Agent
    { level: 52, type: 'kroner', value: '200', name: '200 Kroner' },
    { level: 55, type: 'title', value: 'night_stalker', name: 'Night Stalker Title' },
    { level: 58, type: 'badge', value: 'shadow-agent', name: 'Shadow Agent Badge' },
    { level: 60, type: 'profile_effect', value: 'phantom-trail', name: 'Phantom Trail Effect' },
    
    // Level 61-70: Infiltrator
    { level: 62, type: 'kroner', value: '250', name: '250 Kroner' },
    { level: 65, type: 'wallpaper', value: 'infiltrator-hub', name: 'Infiltrator Hub Wallpaper' },
    { level: 68, type: 'theme', value: 'invisibility-cloak', name: 'Invisibility Cloak Theme' },
    { level: 70, type: 'title', value: 'shadow_agent', name: 'Shadow Agent Title' },
    
    // Level 71-80: Phantom Core
    { level: 72, type: 'kroner', value: '300', name: '300 Kroner' },
    { level: 75, type: 'badge', value: 'phantom-elite', name: 'Phantom Elite Badge' },
    { level: 78, type: 'profile_effect', value: 'void-shroud', name: 'Void Shroud Effect' },
    { level: 80, type: 'wallpaper', value: 'phantom-dimension', name: 'Phantom Dimension Wallpaper' },
    
    // Level 81-90: Master of Shadows
    { level: 82, type: 'kroner', value: '350', name: '350 Kroner' },
    { level: 85, type: 'theme', value: 'shadow-realm', name: 'Shadow Realm Theme' },
    { level: 88, type: 'badge', value: 'phantom-master', name: 'Phantom Master Badge' },
    { level: 90, type: 'title', value: 'phantom_master', name: 'Phantom Master Title' },
    
    // Level 91-99: The Final Shadow
    { level: 92, type: 'kroner', value: '400', name: '400 Kroner' },
    { level: 95, type: 'profile_effect', value: 'phantom-aura', name: 'Phantom Aura Effect' },
    { level: 98, type: 'theme', value: 'phantom-prime', name: 'Phantom Prime Theme' },
    
    // Level 100: Ultimate Phantom
    { level: 100, type: 'certificate', value: 'phantom_elite', name: 'Phantom Elite Certificate + 1000 Kroner' },
  ]
};

export const ALL_SEASONS = [SEASON_GENESIS, SEASON_PHANTOM];

export const getSeasonByKey = (key: string): SeasonDefinition | undefined => {
  return ALL_SEASONS.find(s => s.key === key);
};

export const getCurrentSeason = (): SeasonDefinition | undefined => {
  const now = new Date();
  return ALL_SEASONS.find(s => {
    const start = new Date(s.startDate);
    const end = new Date(s.endDate);
    return now >= start && now <= end;
  });
};
