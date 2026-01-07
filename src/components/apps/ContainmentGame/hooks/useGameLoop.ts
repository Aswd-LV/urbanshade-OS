import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GameState, 
  SubjectState, 
  CameraState, 
  DoorDirection,
  ActiveLure,
  NIGHT_DURATION_MS,
  DOOR_BLOCK_COOLDOWN,
  LURE_COOLDOWN,
  LURE_DURATION,
  SHOCK_COOLDOWN,
  CAMERA_REBOOT_TIME,
  CAMERA_AUTO_REPAIR_TIME,
  POWER_DRAIN_PASSIVE,
  POWER_DRAIN_LURE,
  POWER_DRAIN_SHOCK,
  POWER_DRAIN_DOOR
} from '../types';
import { FACILITY_ROOMS, SPAWN_ROOMS, FOXY_SPAWN_ROOM, getRoomById, isContainmentRoom } from '../data/facilityMap';
import { getSubjectsForNight, getSubjectById } from '../data/subjects';

const createInitialCameras = (): CameraState[] => {
  return FACILITY_ROOMS.filter(r => !r.isControlRoom).map(room => ({
    roomId: room.id,
    isOnline: true,
    rebootProgress: 100,
    isRebooting: false,
    autoRepairProgress: 0
  }));
};

const createInitialSubjects = (night: number): SubjectState[] => {
  const subjects = getSubjectsForNight(night);
  const shuffledSpawns = [...SPAWN_ROOMS].sort(() => Math.random() - 0.5);
  
  return subjects.map((subject, index) => ({
    subjectId: subject.id,
    currentRoom: subject.spawnRoom || shuffledSpawns[index % shuffledSpawns.length],
    targetRoom: null,
    stunUntil: 0,
    isActive: true,
    lastMoveTime: Date.now(),
    usedAbility: false
  }));
};

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedProgress = localStorage.getItem('containment_game_progress');
    const progress = savedProgress ? JSON.parse(savedProgress) : { unlockedNights: [1], unlockedLore: [] };
    
    return {
      phase: 'menu',
      currentNight: 1,
      clock: 0,
      power: 100,
      subjects: [],
      cameras: createInitialCameras(),
      doorBlocked: null,
      doorBlockCooldown: 0,
      lureCooldown: 0,
      shockCooldown: 0,
      lastPingSweep: Date.now(),
      breachWarning: {
        active: false,
        direction: null,
        timeRemaining: 0,
        subjectId: null
      },
      unlockedNights: progress.unlockedNights,
      unlockedLore: progress.unlockedLore,
      memeticIntensity: 0,
      activeLures: [],
      selectedCamera: null,
      isExclusiveFullscreen: false
    };
  });

  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const startNight = useCallback((night: number) => {
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      currentNight: night,
      clock: 0,
      power: 100,
      subjects: createInitialSubjects(night),
      cameras: createInitialCameras(),
      doorBlocked: null,
      doorBlockCooldown: 0,
      lureCooldown: 0,
      shockCooldown: 0,
      lastPingSweep: Date.now(),
      breachWarning: { active: false, direction: null, timeRemaining: 0, subjectId: null },
      memeticIntensity: 0,
      activeLures: [],
      selectedCamera: null,
      isExclusiveFullscreen: true
    }));
  }, []);

  const endGame = useCallback((victory: boolean, killedBy?: string) => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    setGameState(prev => {
      if (victory) {
        const newUnlockedNights = prev.unlockedNights.includes(prev.currentNight + 1)
          ? prev.unlockedNights
          : [...prev.unlockedNights, prev.currentNight + 1];
        
        localStorage.setItem('containment_game_progress', JSON.stringify({
          unlockedNights: newUnlockedNights,
          unlockedLore: prev.unlockedLore
        }));

        return { ...prev, phase: 'victory', unlockedNights: newUnlockedNights, isExclusiveFullscreen: false };
      } else {
        return { ...prev, phase: 'gameover', breachWarning: { ...prev.breachWarning, subjectId: killedBy || null }, isExclusiveFullscreen: false };
      }
    });
  }, []);

  const placeLure = useCallback((roomId: string) => {
    const now = Date.now();
    setGameState(prev => {
      if (prev.lureCooldown > now || prev.power < POWER_DRAIN_LURE) return prev;
      const camera = prev.cameras.find(c => c.roomId === roomId);
      if (!camera?.isOnline) return prev;

      const newLure: ActiveLure = { id: `lure-${now}`, roomId, expiresAt: now + LURE_DURATION };

      const newSubjects = prev.subjects.map(subject => {
        const subjectData = getSubjectById(subject.subjectId);
        if (!subjectData || subject.stunUntil > now) return subject;
        if (subjectData.specialAbility === 'ignores_lures' || subjectData.lureSensitivity === 0) return subject;
        if (Math.random() < subjectData.lureSensitivity) {
          return { ...subject, targetRoom: roomId };
        }
        return subject;
      });

      return {
        ...prev,
        subjects: newSubjects,
        activeLures: [...prev.activeLures, newLure],
        lureCooldown: now + LURE_COOLDOWN,
        power: Math.max(0, prev.power - POWER_DRAIN_LURE)
      };
    });
  }, []);

  const activateShock = useCallback((roomId: string) => {
    const now = Date.now();
    setGameState(prev => {
      if (prev.shockCooldown > now || prev.power < POWER_DRAIN_SHOCK) return prev;
      if (!isContainmentRoom(roomId)) return prev;

      const newSubjects = prev.subjects.map(subject => {
        if (subject.currentRoom !== roomId) return subject;
        const subjectData = getSubjectById(subject.subjectId);
        if (!subjectData) return subject;
        return { ...subject, stunUntil: now + (subjectData.shockResistance * 1000), targetRoom: null };
      });

      return { ...prev, subjects: newSubjects, shockCooldown: now + SHOCK_COOLDOWN, power: Math.max(0, prev.power - POWER_DRAIN_SHOCK) };
    });
  }, []);

  const blockDoor = useCallback((direction: DoorDirection) => {
    setGameState(prev => prev.doorBlockCooldown > Date.now() ? prev : { ...prev, doorBlocked: direction });
  }, []);

  const releaseDoor = useCallback(() => {
    setGameState(prev => ({ ...prev, doorBlocked: null, doorBlockCooldown: Date.now() + DOOR_BLOCK_COOLDOWN }));
  }, []);

  const rebootCamera = useCallback((roomId: string) => {
    setGameState(prev => ({
      ...prev,
      cameras: prev.cameras.map(cam => cam.roomId !== roomId || cam.isOnline || cam.isRebooting ? cam : { ...cam, isRebooting: true, rebootProgress: 0 })
    }));
  }, []);

  const selectCamera = useCallback((roomId: string | null) => {
    setGameState(prev => ({ ...prev, selectedCamera: roomId }));
  }, []);

  const returnToMenu = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'menu', isExclusiveFullscreen: false }));
  }, []);

  const openLoreViewer = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'lore' }));
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const tick = () => {
      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setGameState(prev => {
        if (prev.phase !== 'playing') return prev;
        let newState = { ...prev };

        // Clock
        newState.clock = Math.min(360, prev.clock + (360 / (NIGHT_DURATION_MS / 1000)) * deltaTime);
        if (newState.clock >= 360) {
          setTimeout(() => endGame(true), 100);
          return newState;
        }

        // Power drain
        let powerDrain = POWER_DRAIN_PASSIVE * deltaTime;
        if (prev.doorBlocked) powerDrain += POWER_DRAIN_DOOR * deltaTime;
        const z15 = prev.subjects.find(s => s.subjectId === 'Z-15');
        if (z15) {
          const z15Room = getRoomById(z15.currentRoom);
          if (z15Room && z15Room.y >= 3) powerDrain *= 2;
        }
        newState.power = Math.max(0, prev.power - powerDrain);

        // Camera reboot & auto-repair
        newState.cameras = prev.cameras.map(cam => {
          if (cam.isRebooting) {
            const newProgress = cam.rebootProgress + (100 / (CAMERA_REBOOT_TIME / 1000)) * deltaTime;
            if (newProgress >= 100) return { ...cam, isOnline: true, isRebooting: false, rebootProgress: 100, autoRepairProgress: 0 };
            return { ...cam, rebootProgress: newProgress };
          }
          if (!cam.isOnline && !cam.isRebooting) {
            const autoProgress = cam.autoRepairProgress + (100 / (CAMERA_AUTO_REPAIR_TIME / 1000)) * deltaTime;
            if (autoProgress >= 100) return { ...cam, isOnline: true, autoRepairProgress: 0 };
            return { ...cam, autoRepairProgress: autoProgress };
          }
          return cam;
        });

        // Expire old lures
        newState.activeLures = prev.activeLures.filter(l => l.expiresAt > now);

        // Breach warning countdown
        if (prev.breachWarning.active) {
          const newTimeRemaining = prev.breachWarning.timeRemaining - (deltaTime * 1000);
          if (newTimeRemaining <= 0) {
            if (prev.doorBlocked === prev.breachWarning.direction) {
              newState.subjects = prev.subjects.map(s => s.subjectId === prev.breachWarning.subjectId ? { ...s, currentRoom: 'hall-mid', targetRoom: null } : s);
              newState.breachWarning = { active: false, direction: null, timeRemaining: 0, subjectId: null };
              newState.power = Math.max(0, newState.power - 10);
            } else {
              setTimeout(() => endGame(false, prev.breachWarning.subjectId || undefined), 100);
              return newState;
            }
          } else {
            newState.breachWarning = { ...prev.breachWarning, timeRemaining: newTimeRemaining };
          }
        }

        // Memetic intensity
        let maxIntensity = 0;
        for (const subject of prev.subjects) {
          const room = getRoomById(subject.currentRoom);
          if (room) {
            const intensity = Math.max(0, room.y / 6);
            maxIntensity = Math.max(maxIntensity, intensity);
          }
        }
        newState.memeticIntensity = maxIntensity * (0.5 + prev.currentNight * 0.1);

        return newState;
      });

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = Date.now();
    gameLoopRef.current = requestAnimationFrame(tick);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameState.phase, endGame]);

  return { gameState, startNight, endGame, placeLure, activateShock, blockDoor, releaseDoor, rebootCamera, selectCamera, returnToMenu, openLoreViewer, setGameState };
};
