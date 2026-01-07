// Game Types and Interfaces for Containment Breach

export type SubjectBehavior = 'aggressive' | 'sneaky' | 'erratic' | 'methodical' | 'foxy';
export type DoorDirection = 'front' | 'left' | 'right';
export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory' | 'lore';

export interface Subject {
  id: string; // Z-01, Z-04, etc.
  name: string;
  behavior: SubjectBehavior;
  speed: number; // Movement rate (rooms per minute)
  lureSensitivity: number; // 0-1, how well lures work (0 = ignores lures)
  shockResistance: number; // Seconds to recover from shock
  specialAbility?: 'camera_jam' | 'pack_movement' | 'teleport' | 'invisible' | 'power_drain' | 'ignores_lures';
  description: string;
  deathHint: string;
  activeOnNight: number; // First night this subject appears
  spawnRoom?: string; // Custom spawn room (for Foxy-type)
}

export interface Room {
  id: string;
  name: string;
  x: number; // Map position
  y: number;
  connections: string[]; // Connected room IDs
  isControlRoom?: boolean;
  isFinalRoom?: boolean; // Room before control room (triggers breach warning)
  isContainmentRoom?: boolean; // Shock is available in these rooms
  approachDirection?: DoorDirection; // Which door this room leads to
}

export interface SubjectState {
  subjectId: string;
  currentRoom: string;
  targetRoom: string | null;
  stunUntil: number; // Timestamp when stun ends
  isActive: boolean;
  lastMoveTime: number;
  usedAbility: boolean;
}

export interface CameraState {
  roomId: string;
  isOnline: boolean;
  rebootProgress: number; // 0-100, 100 = online
  isRebooting: boolean;
  autoRepairProgress: number; // 0-100, auto-repair when offline
}

export interface ActiveLure {
  id: string;
  roomId: string;
  expiresAt: number;
}

export interface GameState {
  phase: GamePhase;
  currentNight: number;
  clock: number; // 0-360 representing 12AM-6AM (6 hours = 360 minutes scaled)
  power: number; // 0-100
  subjects: SubjectState[];
  cameras: CameraState[];
  doorBlocked: DoorDirection | null;
  doorBlockCooldown: number; // Timestamp when door can be used again
  lureCooldown: number;
  shockCooldown: number;
  lastPingSweep: number;
  breachWarning: {
    active: boolean;
    direction: DoorDirection | null;
    timeRemaining: number;
    subjectId: string | null;
  };
  unlockedNights: number[];
  unlockedLore: string[];
  memeticIntensity: number; // 0-1, affects visual distortions
  activeLures: ActiveLure[]; // Active lures on the map
  selectedCamera: string | null; // Currently viewed camera
  isExclusiveFullscreen: boolean; // Hide taskbar and window header
}

export interface LoreDocument {
  id: string;
  title: string;
  category: 'incident' | 'dossier' | 'protocol' | 'communication';
  content: string;
  unlockedAfterNight: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  effectsEnabled: boolean;
  difficulty: 'normal' | 'hard' | 'nightmare';
}

// Game Constants
export const NIGHT_DURATION_MS = 420000; // 7 minutes per night
export const PING_SWEEP_INTERVAL = 3500; // 3.5 seconds
export const DOOR_BLOCK_DURATION = 2000; // 2 seconds to hold door
export const DOOR_BLOCK_COOLDOWN = 5000; // 5 seconds between blocks
export const LURE_COOLDOWN = 8000; // 8 seconds
export const LURE_DURATION = 15000; // 15 seconds lure active
export const SHOCK_COOLDOWN = 12000; // 12 seconds
export const CAMERA_REBOOT_TIME = 3000; // 3 seconds manual reboot
export const CAMERA_AUTO_REPAIR_TIME = 20000; // 20 seconds auto-repair
export const BREACH_WARNING_TIME = 3000; // 3 seconds to react
export const POWER_DRAIN_PASSIVE = 0.05; // Per second
export const POWER_DRAIN_CAMERA = 0.02; // Per sweep
export const POWER_DRAIN_LURE = 3; // Per use
export const POWER_DRAIN_SHOCK = 5; // Per use
export const POWER_DRAIN_DOOR = 2; // Per second while blocking
