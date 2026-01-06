import { useEffect, useRef } from 'react';
import { GameState, SubjectState } from '../types';
import { getSubjectById } from '../data/subjects';
import { getRoomById, getConnectedRooms, getPathToControl, getApproachDirection } from '../data/facilityMap';

interface UseSubjectAIProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBreach: (subjectId: string, direction: 'front' | 'left' | 'right') => void;
  onCameraAttack: (roomId: string) => void;
}

export const useSubjectAI = ({ gameState, setGameState, onBreach, onCameraAttack }: UseSubjectAIProps) => {
  const lastMoveRef = useRef<Record<string, number>>({});
  const z04VisibleRef = useRef(true); // Toggle for Z-04 visibility

  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const aiTick = setInterval(() => {
      const now = Date.now();
      z04VisibleRef.current = !z04VisibleRef.current; // Toggle Z-04 visibility

      setGameState(prev => {
        if (prev.phase !== 'playing') return prev;

        let newSubjects: SubjectState[] = [...prev.subjects];
        let newCameras = [...prev.cameras];
        let triggerBreach: { subjectId: string; direction: 'front' | 'left' | 'right' } | null = null;
        let cameraToAttack: string | null = null;

        for (let i = 0; i < newSubjects.length; i++) {
          const subject = newSubjects[i];
          const subjectData = getSubjectById(subject.subjectId);
          
          if (!subjectData || !subject.isActive) continue;
          if (subject.stunUntil > now) continue;

          // Calculate movement interval based on speed
          const moveInterval = 60000 / (subjectData.speed * (1 + prev.currentNight * 0.1));
          const lastMove = lastMoveRef.current[subject.subjectId] || 0;
          
          if (now - lastMove < moveInterval) continue;
          lastMoveRef.current[subject.subjectId] = now;

          const currentRoom = getRoomById(subject.currentRoom);
          if (!currentRoom) continue;

          // Special abilities
          if (subjectData.specialAbility === 'camera_jam' && !subject.usedAbility) {
            // Z-01: Disable camera in current room before moving
            const cam = newCameras.find(c => c.roomId === subject.currentRoom);
            if (cam && cam.isOnline) {
              newCameras = newCameras.map(c => 
                c.roomId === subject.currentRoom ? { ...c, isOnline: false, isRebooting: false, rebootProgress: 0 } : c
              );
              cameraToAttack = subject.currentRoom;
              newSubjects[i] = { ...subject, usedAbility: true };
              continue; // Skip movement this tick
            }
          }

          if (subjectData.specialAbility === 'teleport' && Math.random() < 0.3) {
            // Z-19: Chance to teleport forward
            const path = getPathToControl(subject.currentRoom);
            if (path.length > 2) {
              const teleportIndex = Math.min(path.length - 2, Math.floor(Math.random() * 2) + 1);
              newSubjects[i] = { ...subject, currentRoom: path[teleportIndex], usedAbility: true };
              continue;
            }
          }

          if (subjectData.specialAbility === 'power_drain') {
            // Z-15: Extra power drain handled in game loop
          }

          // Determine next room
          let nextRoom: string | null = null;

          if (subject.targetRoom) {
            // Moving toward lure target
            const connectedRooms = getConnectedRooms(subject.currentRoom);
            const targetPath = getPathToControl(subject.targetRoom);
            
            if (subject.currentRoom === subject.targetRoom) {
              // Reached lure target, now head to control
              nextRoom = null;
              newSubjects[i] = { ...subject, targetRoom: null };
            } else {
              // Find connected room that's on path to target
              for (const room of connectedRooms) {
                if (room.id === subject.targetRoom) {
                  nextRoom = room.id;
                  break;
                }
              }
              if (!nextRoom && connectedRooms.length > 0) {
                nextRoom = connectedRooms[Math.floor(Math.random() * connectedRooms.length)].id;
              }
            }
          } else {
            // Moving toward control room
            const path = getPathToControl(subject.currentRoom);
            if (path.length > 1) {
              nextRoom = path[1];
            }
          }

          if (nextRoom) {
            const nextRoomData = getRoomById(nextRoom);
            
            // Check for breach (reaching final room)
            if (nextRoomData?.isFinalRoom) {
              // Already at final room, trying to enter control
              if (subject.currentRoom === 'final-room') {
                const direction = getApproachDirection(subject.currentRoom);
                triggerBreach = { subjectId: subject.subjectId, direction };
              } else {
                newSubjects[i] = { ...subject, currentRoom: nextRoom, usedAbility: false };
              }
            } else if (nextRoomData?.isControlRoom) {
              // Trying to enter control room - trigger breach
              const direction = getApproachDirection(subject.currentRoom);
              triggerBreach = { subjectId: subject.subjectId, direction };
            } else {
              newSubjects[i] = { ...subject, currentRoom: nextRoom, usedAbility: false };
            }
          }

          // Random camera attack (methodical behavior)
          if (subjectData.behavior === 'methodical' && Math.random() < 0.2) {
            const cam = newCameras.find(c => c.roomId === subject.currentRoom && c.isOnline);
            if (cam) {
              newCameras = newCameras.map(c => 
                c.roomId === subject.currentRoom ? { ...c, isOnline: false, isRebooting: false, rebootProgress: 0 } : c
              );
              cameraToAttack = subject.currentRoom;
            }
          }
        }

        // Trigger breach warning if needed
        if (triggerBreach && !prev.breachWarning.active) {
          setTimeout(() => onBreach(triggerBreach!.subjectId, triggerBreach!.direction), 0);
        }

        // Trigger camera attack effect
        if (cameraToAttack) {
          setTimeout(() => onCameraAttack(cameraToAttack!), 0);
        }

        return {
          ...prev,
          subjects: newSubjects,
          cameras: newCameras
        };
      });
    }, 500); // AI tick every 500ms

    return () => clearInterval(aiTick);
  }, [gameState.phase, setGameState, onBreach, onCameraAttack]);

  // Return visibility state for Z-04
  return { isZ04Visible: z04VisibleRef.current };
};
