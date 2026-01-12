// UrbanShade OS v3.1 - Battle Pass Season Definitions

export interface SeasonReward {
  level: number;
  type: 'points' | 'title' | 'theme' | 'badge' | 'certificate';
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
    { level: 1, type: 'points', value: '50', name: '50 Leaderboard Points' },
    { level: 5, type: 'title', value: 'rookie_operator', name: 'Rookie Operator' },
    { level: 10, type: 'theme', value: 'neon-pulse', name: 'Neon Pulse Theme' },
    { level: 15, type: 'points', value: '100', name: '100 Leaderboard Points' },
    { level: 20, type: 'badge', value: 's1_starter', name: 'Season 1 Starter Badge' },
    { level: 25, type: 'theme', value: 'cyber-grid', name: 'Cyber Grid Theme' },
    { level: 30, type: 'title', value: 'rising_star', name: 'Rising Star' },
    { level: 35, type: 'points', value: '200', name: '200 Leaderboard Points' },
    { level: 40, type: 'theme', value: 'crimson-protocol', name: 'Crimson Protocol Theme' },
    { level: 45, type: 'badge', value: 'halfway_hero', name: 'Halfway Hero Badge' },
    { level: 50, type: 'title', value: 'veteran_operator', name: 'Veteran Operator' },
    { level: 55, type: 'theme', value: 'frozen-core', name: 'Frozen Core Theme' },
    { level: 60, type: 'points', value: '400', name: '400 Leaderboard Points' },
    { level: 65, type: 'theme', value: 'solar-flare', name: 'Solar Flare Theme' },
    { level: 70, type: 'title', value: 'elite_agent', name: 'Elite Agent' },
    { level: 75, type: 'badge', value: 's1_elite', name: 'Season 1 Elite Badge' },
    { level: 80, type: 'theme', value: 'void-walker', name: 'Void Walker Theme' },
    { level: 85, type: 'points', value: '500', name: '500 Leaderboard Points' },
    { level: 90, type: 'title', value: 'master_operator', name: 'Master Operator' },
    { level: 95, type: 'theme', value: 'genesis-prime', name: 'Genesis Theme' },
    { level: 100, type: 'certificate', value: 'genesis_champion', name: 'Genesis Certificate + Genesis Champion Title + 1000 Points' },
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
    { level: 1, type: 'points', value: '50', name: '50 Leaderboard Points' },
    { level: 5, type: 'title', value: 'shadow_initiate', name: 'Shadow Initiate' },
    { level: 10, type: 'theme', value: 'shadow-network', name: 'Shadow Network Theme' },
    { level: 15, type: 'points', value: '100', name: '100 Leaderboard Points' },
    { level: 20, type: 'badge', value: 's2_starter', name: 'Season 2 Starter Badge' },
    { level: 25, type: 'theme', value: 'stealth-mode', name: 'Stealth Mode Theme' },
    { level: 30, type: 'title', value: 'silent_watcher', name: 'Silent Watcher' },
    { level: 35, type: 'points', value: '200', name: '200 Leaderboard Points' },
    { level: 40, type: 'title', value: 'ghost_machine', name: 'Ghost in the Machine' },
    { level: 45, type: 'badge', value: 'phantom_half', name: 'Phantom Halfway Badge' },
    { level: 50, type: 'theme', value: 'phantom-glow', name: 'Phantom Glow Theme' },
    { level: 55, type: 'points', value: '300', name: '300 Leaderboard Points' },
    { level: 60, type: 'points', value: '400', name: '400 Leaderboard Points' },
    { level: 65, type: 'title', value: 'night_stalker', name: 'Night Stalker' },
    { level: 70, type: 'title', value: 'shadow_agent', name: 'Shadow Agent' },
    { level: 75, type: 'badge', value: 's2_elite', name: 'Season 2 Elite Badge' },
    { level: 80, type: 'theme', value: 'invisibility-cloak', name: 'Invisibility Cloak Theme' },
    { level: 85, type: 'points', value: '500', name: '500 Leaderboard Points' },
    { level: 90, type: 'title', value: 'phantom_master', name: 'Phantom Master' },
    { level: 95, type: 'points', value: '750', name: '750 Leaderboard Points' },
    { level: 100, type: 'certificate', value: 'phantom_elite', name: 'Phantom Certificate + Phantom Elite Title + 1000 Points' },
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
