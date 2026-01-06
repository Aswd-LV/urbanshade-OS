import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GameState, 
  SubjectState, 
  CameraState, 
  DoorDirection,
  NIGHT_DURATION_MS,
  PING_SWEEP_INTERVAL,
  DOOR_BLOCK_COOLDOWN,
  LURE_COOLDOWN,
  SHOCK_COOLDOWN,
  CAMERA_REBOOT_TIME,
  BREACH_WARNING_TIME,
  POWER_DRAIN_PASSIVE,
  POWER_DRAIN_CAMERA,
  POWER_DRAIN_LURE,
  POWER_DRAIN_SHOCK,
  POWER_DRAIN_DOOR
} from '../types';
import { FACILITY_ROOMS, SPAWN_ROOMS, getApproachDirection, getRoomById } from '../data/facilityMap';
import { getSubjectsForNight, getSubjectById } from '../data/subjects';

const createInitialCameras = (): CameraState[] => {
  return FACILITY_ROOMS.filter(r => !r.isControlRoom).map(room => ({
    roomId: room.id,
    isOnline: true,
    rebootProgress: 100,
    isRebooting: false
  }));
};

const createInitialSubjects = (night: number): SubjectState[] => {
  const subjects = getSubjectsForNight(night);
  const shuffledSpawns = [...SPAWN_ROOMS].sort(() => Math.random() - 0.5);
  
  return subjects.map((subject, index) => ({
    subjectId: subject.id,
    currentRoom: shuffledSpawns[index % shuffledSpawns.length],
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
      memeticIntensity: 0
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
      breachWarning: {
        active: false,
        direction: null,
        timeRemaining: 0,
        subjectId: null
      },
      memeticIntensity: 0
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
        
        const newUnlockedLore = [...prev.unlockedLore];
        // Lore unlocks handled elsewhere
        
        const progress = {
          unlockedNights: newUnlockedNights,
          unlockedLore: newUnlockedLore
        };
        localStorage.setItem('containment_game_progress', JSON.stringify(progress));

        return {
          ...prev,
          phase: 'victory',
          unlockedNights: newUnlockedNights
        };
      } else {
        return {
          ...prev,
          phase: 'gameover',
          breachWarning: {
            ...prev.breachWarning,
            subjectId: killedBy || null
          }
        };
      }
    });
  }, []);

  const activateLure = useCallback((roomId: string) => {
    const now = Date.now();
    setGameState(prev => {
      if (prev.lureCooldown > now || prev.power < POWER_DRAIN_LURE) return prev;

      const newSubjects = prev.subjects.map(subject => {
        const subjectData = getSubjectById(subject.subjectId);
        if (!subjectData || subject.stunUntil > now) return subject;

        // Lure sensitivity determines if subject is attracted
        if (Math.random() < subjectData.lureSensitivity) {
          return { ...subject, targetRoom: roomId };
        }
        return subject;
      });

      return {
        ...prev,
        subjects: newSubjects,
        lureCooldown: now + LURE_COOLDOWN,
        power: Math.max(0, prev.power - POWER_DRAIN_LURE)
      };
    });
  }, []);

  const activateShock = useCallback((roomId: string) => {
    const now = Date.now();
    setGameState(prev => {
      if (prev.shockCooldown > now || prev.power < POWER_DRAIN_SHOCK) return prev;

      const newSubjects = prev.subjects.map(subject => {
        if (subject.currentRoom !== roomId) return subject;

        const subjectData = getSubjectById(subject.subjectId);
        if (!subjectData) return subject;

        return {
          ...subject,
          stunUntil: now + (subjectData.shockResistance * 1000),
          targetRoom: null
        };
      });

      return {
        ...prev,
        subjects: newSubjects,
        shockCooldown: now + SHOCK_COOLDOWN,
        power: Math.max(0, prev.power - POWER_DRAIN_SHOCK)
      };
    });
  }, []);

  const blockDoor = useCallback((direction: DoorDirection) => {
    const now = Date.now();
    setGameState(prev => {
      if (prev.doorBlockCooldown > now) return prev;
      return { ...prev, doorBlocked: direction };
    });
  }, []);

  const releaseDoor = useCallback(() => {
    const now = Date.now();
    setGameState(prev => ({
      ...prev,
      doorBlocked: null,
      doorBlockCooldown: now + DOOR_BLOCK_COOLDOWN
    }));
  }, []);

  const rebootCamera = useCallback((roomId: string) => {
    setGameState(prev => {
      const newCameras = prev.cameras.map(cam => {
        if (cam.roomId !== roomId || cam.isOnline || cam.isRebooting) return cam;
        return { ...cam, isRebooting: true, rebootProgress: 0 };
      });
      return { ...prev, cameras: newCameras };
    });
  }, []);

  const returnToMenu = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'menu' }));
  }, []);

  const openLoreViewer = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'lore' }));
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const tick = () => {
      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000; // seconds
      lastTickRef.current = now;

      setGameState(prev => {
        if (prev.phase !== 'playing') return prev;

        let newState = { ...prev };

        // Update clock (scaled to 7 minutes = full night)
        const clockIncrement = (360 / (NIGHT_DURATION_MS / 1000)) * deltaTime;
        newState.clock = Math.min(360, prev.clock + clockIncrement);

        // Check for victory (6AM)
        if (newState.clock >= 360) {
          setTimeout(() => endGame(true), 100);
          return { ...newState, phase: 'playing' };
        }

        // Power drain
        let powerDrain = POWER_DRAIN_PASSIVE * deltaTime;
        if (prev.doorBlocked) {
          powerDrain += POWER_DRAIN_DOOR * deltaTime;
        }

        // Z-15 power drain effect
        const z15 = prev.subjects.find(s => s.subjectId === 'Z-15');
        if (z15) {
          const z15Room = getRoomById(z15.currentRoom);
          if (z15Room && z15Room.y >= 2) { // Close to control room
            powerDrain *= 2;
          }
        }

        newState.power = Math.max(0, prev.power - powerDrain);

        // Camera reboot progress
        newState.cameras = prev.cameras.map(cam => {
          if (!cam.isRebooting) return cam;
          const newProgress = cam.rebootProgress + (100 / (CAMERA_REBOOT_TIME / 1000)) * deltaTime;
          if (newProgress >= 100) {
            return { ...cam, isOnline: true, isRebooting: false, rebootProgress: 100 };
          }
          return { ...cam, rebootProgress: newProgress };
        });

        // Breach warning countdown
        if (prev.breachWarning.active) {
          const newTimeRemaining = prev.breachWarning.timeRemaining - (deltaTime * 1000);
          
          if (newTimeRemaining <= 0) {
            // Check if correct door was blocked
            if (prev.doorBlocked === prev.breachWarning.direction) {
              // Blocked successfully - push subject back
              newState.subjects = prev.subjects.map(s => {
                if (s.subjectId === prev.breachWarning.subjectId) {
                  return { ...s, currentRoom: 'hall-south', targetRoom: null };
                }
                return s;
              });
              newState.breachWarning = {
                active: false,
                direction: null,
                timeRemaining: 0,
                subjectId: null
              };
              newState.power = Math.max(0, newState.power - 10); // Power penalty for block
            } else {
              // Failed to block - game over
              setTimeout(() => endGame(false, prev.breachWarning.subjectId || undefined), 100);
              return newState;
            }
          } else {
            newState.breachWarning = {
              ...prev.breachWarning,
              timeRemaining: newTimeRemaining
            };
          }
        }

        // Calculate memetic intensity based on closest subject
        let maxIntensity = 0;
        for (const subject of prev.subjects) {
          const room = getRoomById(subject.currentRoom);
          if (room) {
            const distance = 4 - room.y; // Higher y = closer to control
            const intensity = Math.max(0, distance) / 4;
            maxIntensity = Math.max(maxIntensity, 1 - intensity);
          }
        }
        newState.memeticIntensity = maxIntensity * (0.5 + prev.currentNight * 0.1);

        return newState;
      });

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = Date.now();
    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.phase, endGame]);

  return {
    gameState,
    startNight,
    endGame,
    activateLure,
    activateShock,
    blockDoor,
    releaseDoor,
    rebootCamera,
    returnToMenu,
    openLoreViewer,
    setGameState
  };
};
