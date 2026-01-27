// UrbanShade OS v3.0 - Battle Pass Season Definitions

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
    { level: 1, type: 'kroner', value: '50', name: '50 Kroner Welcome' },
    { level: 2, type: 'kroner', value: '25', name: '25 Kroner' },
    { level: 3, type: 'wallpaper', value: 'genesis-grid', name: 'Genesis Grid Wallpaper' },
    { level: 4, type: 'kroner', value: '30', name: '30 Kroner' },
    { level: 5, type: 'title', value: 'rookie_operator', name: 'Rookie Operator Title' },
    { level: 6, type: 'kroner', value: '35', name: '35 Kroner' },
    { level: 7, type: 'kroner', value: '40', name: '40 Kroner' },
    { level: 8, type: 'badge', value: 'genesis-newcomer', name: 'Genesis Newcomer Badge' },
    { level: 9, type: 'kroner', value: '45', name: '45 Kroner' },
    { level: 10, type: 'theme', value: 'digital-dawn', name: 'Digital Dawn Theme' },
    
    // Level 11-20: Building Momentum
    { level: 11, type: 'kroner', value: '50', name: '50 Kroner' },
    { level: 12, type: 'badge', value: 'genesis-starter', name: 'Genesis Starter Badge' },
    { level: 13, type: 'kroner', value: '55', name: '55 Kroner' },
    { level: 14, type: 'kroner', value: '60', name: '60 Kroner' },
    { level: 15, type: 'title', value: 'data_handler', name: 'Data Handler Title' },
    { level: 16, type: 'kroner', value: '65', name: '65 Kroner' },
    { level: 17, type: 'wallpaper', value: 'circuit-flow', name: 'Circuit Flow Wallpaper' },
    { level: 18, type: 'kroner', value: '70', name: '70 Kroner' },
    { level: 19, type: 'kroner', value: '75', name: '75 Kroner' },
    { level: 20, type: 'theme', value: 'neon-circuit', name: 'Neon Circuit Theme' },
    
    // Level 21-30: Rising Star
    { level: 21, type: 'kroner', value: '80', name: '80 Kroner' },
    { level: 22, type: 'badge', value: 'rising-star', name: 'Rising Star Badge' },
    { level: 23, type: 'kroner', value: '85', name: '85 Kroner' },
    { level: 24, type: 'kroner', value: '90', name: '90 Kroner' },
    { level: 25, type: 'profile_effect', value: 'subtle-glow', name: 'Subtle Glow Effect' },
    { level: 26, type: 'kroner', value: '95', name: '95 Kroner' },
    { level: 27, type: 'wallpaper', value: 'data-stream', name: 'Data Stream Wallpaper' },
    { level: 28, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 29, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 30, type: 'title', value: 'rising_star', name: 'Rising Star Title' },
    
    // Level 31-40: Power User
    { level: 31, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 32, type: 'badge', value: 'dedicated-operator', name: 'Dedicated Operator Badge' },
    { level: 33, type: 'kroner', value: '110', name: '110 Kroner' },
    { level: 34, type: 'kroner', value: '110', name: '110 Kroner' },
    { level: 35, type: 'theme', value: 'quantum-shift', name: 'Quantum Shift Theme' },
    { level: 36, type: 'kroner', value: '120', name: '120 Kroner' },
    { level: 37, type: 'wallpaper', value: 'neural-network', name: 'Neural Network Wallpaper' },
    { level: 38, type: 'kroner', value: '120', name: '120 Kroner' },
    { level: 39, type: 'kroner', value: '130', name: '130 Kroner' },
    { level: 40, type: 'profile_effect', value: 'particle-trail', name: 'Particle Trail Effect' },
    
    // Level 41-50: Veteran
    { level: 41, type: 'kroner', value: '130', name: '130 Kroner' },
    { level: 42, type: 'badge', value: 'halfway-hero', name: 'Halfway Hero Badge' },
    { level: 43, type: 'kroner', value: '140', name: '140 Kroner' },
    { level: 44, type: 'kroner', value: '140', name: '140 Kroner' },
    { level: 45, type: 'title', value: 'core_agent', name: 'Core Agent Title' },
    { level: 46, type: 'kroner', value: '150', name: '150 Kroner' },
    { level: 47, type: 'wallpaper', value: 'quantum-field', name: 'Quantum Field Wallpaper' },
    { level: 48, type: 'kroner', value: '150', name: '150 Kroner' },
    { level: 49, type: 'kroner', value: '160', name: '160 Kroner' },
    { level: 50, type: 'theme', value: 'neural-network', name: 'Neural Network Theme' },
    
    // Level 51-60: Elite Territory
    { level: 51, type: 'kroner', value: '160', name: '160 Kroner' },
    { level: 52, type: 'badge', value: 'elite-member', name: 'Elite Member Badge' },
    { level: 53, type: 'kroner', value: '170', name: '170 Kroner' },
    { level: 54, type: 'kroner', value: '170', name: '170 Kroner' },
    { level: 55, type: 'profile_effect', value: 'data-pulse', name: 'Data Pulse Effect' },
    { level: 56, type: 'kroner', value: '180', name: '180 Kroner' },
    { level: 57, type: 'wallpaper', value: 'void-corridor', name: 'Void Corridor Wallpaper' },
    { level: 58, type: 'kroner', value: '180', name: '180 Kroner' },
    { level: 59, type: 'kroner', value: '190', name: '190 Kroner' },
    { level: 60, type: 'title', value: 'elite_agent', name: 'Elite Agent Title' },
    
    // Level 61-70: Master Class
    { level: 61, type: 'kroner', value: '190', name: '190 Kroner' },
    { level: 62, type: 'badge', value: 'season-warrior', name: 'Season Warrior Badge' },
    { level: 63, type: 'kroner', value: '200', name: '200 Kroner' },
    { level: 64, type: 'kroner', value: '200', name: '200 Kroner' },
    { level: 65, type: 'theme', value: 'void-walker', name: 'Void Walker Theme' },
    { level: 66, type: 'kroner', value: '210', name: '210 Kroner' },
    { level: 67, type: 'wallpaper', value: 'genesis-matrix', name: 'Genesis Matrix Wallpaper' },
    { level: 68, type: 'kroner', value: '210', name: '210 Kroner' },
    { level: 69, type: 'kroner', value: '220', name: '220 Kroner' },
    { level: 70, type: 'title', value: 'elite_protocol', name: 'Elite Protocol Title' },
    
    // Level 71-80: Approaching Legend
    { level: 71, type: 'kroner', value: '220', name: '220 Kroner' },
    { level: 72, type: 'badge', value: 'genesis-elite', name: 'Genesis Elite Badge' },
    { level: 73, type: 'kroner', value: '230', name: '230 Kroner' },
    { level: 74, type: 'kroner', value: '230', name: '230 Kroner' },
    { level: 75, type: 'profile_effect', value: 'genesis-aura', name: 'Genesis Aura Effect' },
    { level: 76, type: 'kroner', value: '240', name: '240 Kroner' },
    { level: 77, type: 'wallpaper', value: 'champion-vista', name: 'Champion Vista Wallpaper' },
    { level: 78, type: 'kroner', value: '240', name: '240 Kroner' },
    { level: 79, type: 'kroner', value: '250', name: '250 Kroner' },
    { level: 80, type: 'theme', value: 'genesis-prime', name: 'Genesis Prime Theme' },
    
    // Level 81-90: The Final Push
    { level: 81, type: 'kroner', value: '250', name: '250 Kroner' },
    { level: 82, type: 'badge', value: 'master-badge', name: 'Master Badge' },
    { level: 83, type: 'kroner', value: '275', name: '275 Kroner' },
    { level: 84, type: 'kroner', value: '275', name: '275 Kroner' },
    { level: 85, type: 'title', value: 'genesis_commander', name: 'Genesis Commander Title' },
    { level: 86, type: 'kroner', value: '300', name: '300 Kroner' },
    { level: 87, type: 'wallpaper', value: 'legend-path', name: 'Legend Path Wallpaper' },
    { level: 88, type: 'kroner', value: '300', name: '300 Kroner' },
    { level: 89, type: 'kroner', value: '325', name: '325 Kroner' },
    { level: 90, type: 'profile_effect', value: 'champion-flames', name: 'Champion Flames Effect' },
    
    // Level 91-100: The Legend
    { level: 91, type: 'kroner', value: '325', name: '325 Kroner' },
    { level: 92, type: 'badge', value: 'legend-badge', name: 'Legend Badge' },
    { level: 93, type: 'kroner', value: '350', name: '350 Kroner' },
    { level: 94, type: 'kroner', value: '350', name: '350 Kroner' },
    { level: 95, type: 'title', value: 'master_operator', name: 'Master Operator Title' },
    { level: 96, type: 'kroner', value: '400', name: '400 Kroner' },
    { level: 97, type: 'kroner', value: '400', name: '400 Kroner' },
    { level: 98, type: 'kroner', value: '500', name: '500 Kroner' },
    { level: 99, type: 'kroner', value: '500', name: '500 Kroner' },
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
    { level: 1, type: 'kroner', value: '50', name: '50 Kroner Welcome' },
    { level: 2, type: 'kroner', value: '25', name: '25 Kroner' },
    { level: 3, type: 'wallpaper', value: 'shadow-grid', name: 'Shadow Grid Wallpaper' },
    { level: 4, type: 'kroner', value: '30', name: '30 Kroner' },
    { level: 5, type: 'title', value: 'shadow_initiate', name: 'Shadow Initiate Title' },
    { level: 6, type: 'kroner', value: '35', name: '35 Kroner' },
    { level: 7, type: 'kroner', value: '40', name: '40 Kroner' },
    { level: 8, type: 'badge', value: 'phantom-newcomer', name: 'Phantom Newcomer Badge' },
    { level: 9, type: 'kroner', value: '45', name: '45 Kroner' },
    { level: 10, type: 'theme', value: 'shadow-network', name: 'Shadow Network Theme' },
    
    // Level 11-20: Ghost Protocol
    { level: 11, type: 'kroner', value: '50', name: '50 Kroner' },
    { level: 12, type: 'badge', value: 'phantom-starter', name: 'Phantom Starter Badge' },
    { level: 13, type: 'kroner', value: '55', name: '55 Kroner' },
    { level: 14, type: 'kroner', value: '60', name: '60 Kroner' },
    { level: 15, type: 'title', value: 'ghost_protocol', name: 'Ghost Protocol Title' },
    { level: 16, type: 'kroner', value: '65', name: '65 Kroner' },
    { level: 17, type: 'wallpaper', value: 'stealth-mode', name: 'Stealth Mode Wallpaper' },
    { level: 18, type: 'kroner', value: '70', name: '70 Kroner' },
    { level: 19, type: 'kroner', value: '75', name: '75 Kroner' },
    { level: 20, type: 'theme', value: 'stealth-mode', name: 'Stealth Mode Theme' },
    
    // Level 21-30: Silent Watcher
    { level: 21, type: 'kroner', value: '80', name: '80 Kroner' },
    { level: 22, type: 'badge', value: 'silent-watcher', name: 'Silent Watcher Badge' },
    { level: 23, type: 'kroner', value: '85', name: '85 Kroner' },
    { level: 24, type: 'kroner', value: '90', name: '90 Kroner' },
    { level: 25, type: 'profile_effect', value: 'shadow-mist', name: 'Shadow Mist Effect' },
    { level: 26, type: 'kroner', value: '95', name: '95 Kroner' },
    { level: 27, type: 'wallpaper', value: 'phantom-pulse', name: 'Phantom Pulse Wallpaper' },
    { level: 28, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 29, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 30, type: 'title', value: 'silent_watcher', name: 'Silent Watcher Title' },
    
    // Level 31-40: Phantom Rising
    { level: 31, type: 'kroner', value: '100', name: '100 Kroner' },
    { level: 32, type: 'badge', value: 'phantom-rising', name: 'Phantom Rising Badge' },
    { level: 33, type: 'kroner', value: '110', name: '110 Kroner' },
    { level: 34, type: 'kroner', value: '110', name: '110 Kroner' },
    { level: 35, type: 'theme', value: 'phantom-glow', name: 'Phantom Glow Theme' },
    { level: 36, type: 'kroner', value: '120', name: '120 Kroner' },
    { level: 37, type: 'wallpaper', value: 'night-vision', name: 'Night Vision Wallpaper' },
    { level: 38, type: 'kroner', value: '120', name: '120 Kroner' },
    { level: 39, type: 'kroner', value: '130', name: '130 Kroner' },
    { level: 40, type: 'title', value: 'ghost_machine', name: 'Ghost in the Machine Title' },
    
    // Level 41-50: Night Stalker
    { level: 41, type: 'kroner', value: '130', name: '130 Kroner' },
    { level: 42, type: 'badge', value: 'phantom-halfway', name: 'Phantom Halfway Badge' },
    { level: 43, type: 'kroner', value: '140', name: '140 Kroner' },
    { level: 44, type: 'kroner', value: '140', name: '140 Kroner' },
    { level: 45, type: 'profile_effect', value: 'phantom-trail', name: 'Phantom Trail Effect' },
    { level: 46, type: 'kroner', value: '150', name: '150 Kroner' },
    { level: 47, type: 'wallpaper', value: 'night-stalker', name: 'Night Stalker Wallpaper' },
    { level: 48, type: 'kroner', value: '150', name: '150 Kroner' },
    { level: 49, type: 'kroner', value: '160', name: '160 Kroner' },
    { level: 50, type: 'title', value: 'night_stalker', name: 'Night Stalker Title' },
    
    // Level 51-60: Shadow Agent
    { level: 51, type: 'kroner', value: '160', name: '160 Kroner' },
    { level: 52, type: 'badge', value: 'shadow-agent', name: 'Shadow Agent Badge' },
    { level: 53, type: 'kroner', value: '170', name: '170 Kroner' },
    { level: 54, type: 'kroner', value: '170', name: '170 Kroner' },
    { level: 55, type: 'theme', value: 'invisibility-cloak', name: 'Invisibility Cloak Theme' },
    { level: 56, type: 'kroner', value: '180', name: '180 Kroner' },
    { level: 57, type: 'wallpaper', value: 'infiltrator-hub', name: 'Infiltrator Hub Wallpaper' },
    { level: 58, type: 'kroner', value: '180', name: '180 Kroner' },
    { level: 59, type: 'kroner', value: '190', name: '190 Kroner' },
    { level: 60, type: 'title', value: 'shadow_agent', name: 'Shadow Agent Title' },
    
    // Level 61-70: Infiltrator
    { level: 61, type: 'kroner', value: '190', name: '190 Kroner' },
    { level: 62, type: 'badge', value: 'infiltrator', name: 'Infiltrator Badge' },
    { level: 63, type: 'kroner', value: '200', name: '200 Kroner' },
    { level: 64, type: 'kroner', value: '200', name: '200 Kroner' },
    { level: 65, type: 'profile_effect', value: 'void-shroud', name: 'Void Shroud Effect' },
    { level: 66, type: 'kroner', value: '210', name: '210 Kroner' },
    { level: 67, type: 'wallpaper', value: 'phantom-dimension', name: 'Phantom Dimension Wallpaper' },
    { level: 68, type: 'kroner', value: '210', name: '210 Kroner' },
    { level: 69, type: 'kroner', value: '220', name: '220 Kroner' },
    { level: 70, type: 'theme', value: 'shadow-realm', name: 'Shadow Realm Theme' },
    
    // Level 71-80: Phantom Core
    { level: 71, type: 'kroner', value: '220', name: '220 Kroner' },
    { level: 72, type: 'badge', value: 'phantom-elite', name: 'Phantom Elite Badge' },
    { level: 73, type: 'kroner', value: '230', name: '230 Kroner' },
    { level: 74, type: 'kroner', value: '230', name: '230 Kroner' },
    { level: 75, type: 'title', value: 'phantom_core', name: 'Phantom Core Title' },
    { level: 76, type: 'kroner', value: '240', name: '240 Kroner' },
    { level: 77, type: 'wallpaper', value: 'shadow-throne', name: 'Shadow Throne Wallpaper' },
    { level: 78, type: 'kroner', value: '240', name: '240 Kroner' },
    { level: 79, type: 'kroner', value: '250', name: '250 Kroner' },
    { level: 80, type: 'profile_effect', value: 'phantom-aura', name: 'Phantom Aura Effect' },
    
    // Level 81-90: Master of Shadows
    { level: 81, type: 'kroner', value: '250', name: '250 Kroner' },
    { level: 82, type: 'badge', value: 'phantom-master', name: 'Phantom Master Badge' },
    { level: 83, type: 'kroner', value: '275', name: '275 Kroner' },
    { level: 84, type: 'kroner', value: '275', name: '275 Kroner' },
    { level: 85, type: 'theme', value: 'phantom-prime', name: 'Phantom Prime Theme' },
    { level: 86, type: 'kroner', value: '300', name: '300 Kroner' },
    { level: 87, type: 'wallpaper', value: 'shadow-legend', name: 'Shadow Legend Wallpaper' },
    { level: 88, type: 'kroner', value: '300', name: '300 Kroner' },
    { level: 89, type: 'kroner', value: '325', name: '325 Kroner' },
    { level: 90, type: 'title', value: 'phantom_master', name: 'Phantom Master Title' },
    
    // Level 91-100: The Ultimate Phantom
    { level: 91, type: 'kroner', value: '325', name: '325 Kroner' },
    { level: 92, type: 'badge', value: 'shadow-legend', name: 'Shadow Legend Badge' },
    { level: 93, type: 'kroner', value: '350', name: '350 Kroner' },
    { level: 94, type: 'kroner', value: '350', name: '350 Kroner' },
    { level: 95, type: 'profile_effect', value: 'eternal-shadow', name: 'Eternal Shadow Effect' },
    { level: 96, type: 'kroner', value: '400', name: '400 Kroner' },
    { level: 97, type: 'kroner', value: '400', name: '400 Kroner' },
    { level: 98, type: 'kroner', value: '500', name: '500 Kroner' },
    { level: 99, type: 'kroner', value: '500', name: '500 Kroner' },
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
