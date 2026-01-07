import { Subject } from '../types';

// Based on Urbanshade Z-## classification system
export const SUBJECTS: Subject[] = [
  {
    id: 'Z-01',
    name: 'The Watcher',
    behavior: 'methodical',
    speed: 1.2,
    lureSensitivity: 0.6,
    shockResistance: 4,
    specialAbility: 'camera_jam',
    description: 'First documented memetic hazard. Disables surveillance systems before advancing. Highly intelligent.',
    deathHint: 'Z-01 always disables cameras before moving. Watch for sudden offline cameras in sequence - that\'s your warning.',
    activeOnNight: 1
  },
  {
    id: 'Z-04',
    name: 'The Lurker',
    behavior: 'sneaky',
    speed: 0.8,
    lureSensitivity: 0.3,
    shockResistance: 2,
    specialAbility: 'invisible',
    description: 'Only appears on every other ping sweep. Moves silently through ventilation systems.',
    deathHint: 'Z-04 is invisible to half of your scans. If you don\'t see it for 2 sweeps, assume it\'s still moving.',
    activeOnNight: 1
  },
  {
    id: 'Z-07',
    name: 'The Swarm',
    behavior: 'aggressive',
    speed: 2.0,
    lureSensitivity: 0.9,
    shockResistance: 1,
    specialAbility: 'pack_movement',
    description: 'Collective entity that moves as one. Extremely fast but easily distracted by audio lures.',
    deathHint: 'Z-07 is fast but dumb. Audio lures are extremely effective - use them early and often.',
    activeOnNight: 2
  },
  {
    id: 'Z-12',
    name: 'The Mimic',
    behavior: 'erratic',
    speed: 1.5,
    lureSensitivity: 0.5,
    shockResistance: 3,
    description: 'Creates false signals on ping sweeps. Can appear in multiple rooms simultaneously.',
    deathHint: 'Z-12 creates phantom blips. The real one moves in a pattern - watch for consistent movement.',
    activeOnNight: 2
  },
  {
    id: 'Z-15',
    name: 'The Drain',
    behavior: 'methodical',
    speed: 0.6,
    lureSensitivity: 0.4,
    shockResistance: 5,
    specialAbility: 'power_drain',
    description: 'Feeds on electrical systems. Proximity causes accelerated power consumption.',
    deathHint: 'Z-15 drains your power faster when close. Keep it at the far end of the facility or you\'ll go dark.',
    activeOnNight: 3
  },
  {
    id: 'Z-19',
    name: 'The Glitch',
    behavior: 'erratic',
    speed: 2.5,
    lureSensitivity: 0.2,
    shockResistance: 1,
    specialAbility: 'teleport',
    description: 'Exists in a state of spatial flux. Can teleport short distances through walls.',
    deathHint: 'Z-19 teleports but has a cooldown. After it jumps, you have 8 seconds before it can jump again.',
    activeOnNight: 4
  },
  {
    id: 'Z-22',
    name: 'The Prophet',
    behavior: 'aggressive',
    speed: 1.8,
    lureSensitivity: 0.7,
    shockResistance: 2,
    description: 'Predicts operator actions. Seems to anticipate lures and shocks.',
    deathHint: 'Z-22 predicts patterns. Vary your timing randomly - don\'t fall into a rhythm.',
    activeOnNight: 4
  },
  {
    id: 'Z-31',
    name: 'The Null',
    behavior: 'sneaky',
    speed: 1.0,
    lureSensitivity: 0.1,
    shockResistance: 6,
    description: 'Absorbs memetic energy. Highly resistant to containment shocks. Immune to most lures.',
    deathHint: 'Z-31 ignores most of your tools. Doors are your only reliable defense - don\'t waste power on shocks.',
    activeOnNight: 5
  },
  // Foxy-type entity - ignores lures completely, unique attack pattern
  {
    id: 'Z-XX',
    name: 'The Stalker',
    behavior: 'foxy',
    speed: 3.0, // Very fast when triggered
    lureSensitivity: 0, // Completely ignores lures
    shockResistance: 2,
    specialAbility: 'ignores_lures',
    description: 'A predatory entity that charges when not observed. Audio lures have no effect. Must be monitored constantly.',
    deathHint: 'Z-XX only moves when you\'re not watching. Check its camera frequently or it will charge without warning.',
    activeOnNight: 2,
    spawnRoom: 'foxy-room' // Custom spawn
  }
];

export const getSubjectsForNight = (night: number): Subject[] => {
  return SUBJECTS.filter(s => s.activeOnNight <= night);
};

export const getSubjectById = (id: string): Subject | undefined => {
  return SUBJECTS.find(s => s.id === id);
};
