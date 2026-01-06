import { useState, useCallback, useEffect } from 'react';
import { CameraMap } from './components/CameraMap';
import { ControlPanel } from './components/ControlPanel';
import { StatusBar } from './components/StatusBar';
import { BreachAlert } from './components/BreachAlert';
import { MemeticEffects } from './components/MemeticEffects';
import { GameState, DoorDirection, BREACH_WARNING_TIME, PING_SWEEP_INTERVAL } from './types';
import { useSubjectAI } from './hooks/useSubjectAI';
import { useAudio } from './hooks/useAudio';
import { getApproachDirection } from './data/facilityMap';
import { Button } from '@/components/ui/button';
import { Pause, Play, X } from 'lucide-react';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onLure: (roomId: string) => void;
  onShock: (roomId: string) => void;
  onBlockDoor: (direction: DoorDirection) => void;
  onReleaseDoor: () => void;
  onRebootCamera: (roomId: string) => void;
  onEndGame: (victory: boolean, killedBy?: string) => void;
  onExit: () => void;
}

export const GameScreen = ({
  gameState,
  setGameState,
  onLure,
  onShock,
  onBlockDoor,
  onReleaseDoor,
  onRebootCamera,
  onEndGame,
  onExit
}: GameScreenProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [lastPingSweep, setLastPingSweep] = useState(Date.now());
  const [z04Visible, setZ04Visible] = useState(true);

  const audio = useAudio();

  // Handle breach warnings
  const handleBreach = useCallback((subjectId: string, direction: DoorDirection) => {
    audio.playBreachWarning();
    setGameState(prev => ({
      ...prev,
      breachWarning: {
        active: true,
        direction,
        timeRemaining: BREACH_WARNING_TIME,
        subjectId
      }
    }));
  }, [setGameState, audio]);

  // Handle camera attacks
  const handleCameraAttack = useCallback((roomId: string) => {
    audio.playStatic();
  }, [audio]);

  // Subject AI
  const { isZ04Visible } = useSubjectAI({
    gameState,
    setGameState,
    onBreach: handleBreach,
    onCameraAttack: handleCameraAttack
  });

  // Ping sweep timer for audio
  useEffect(() => {
    if (gameState.phase !== 'playing' || isPaused) return;

    const interval = setInterval(() => {
      audio.playPingSweep();
      setLastPingSweep(Date.now());
      setZ04Visible(v => !v);
    }, PING_SWEEP_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.phase, isPaused, audio]);

  // Handle pause
  const togglePause = () => {
    setIsPaused(p => !p);
    // Note: In a full implementation, we'd pause the game loop too
  };

  const handleLure = () => {
    if (selectedRoom) {
      audio.playLure();
      onLure(selectedRoom);
    }
  };

  const handleShock = () => {
    if (selectedRoom) {
      audio.playShock();
      onShock(selectedRoom);
    }
  };

  const handleBlockDoor = (direction: DoorDirection) => {
    audio.playDoorSlam();
    onBlockDoor(direction);
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {/* Memetic effects overlay */}
      <MemeticEffects 
        intensity={gameState.memeticIntensity} 
        enabled={!isPaused}
      />

      {/* Breach alert overlay */}
      <BreachAlert
        active={gameState.breachWarning.active}
        direction={gameState.breachWarning.direction}
        timeRemaining={gameState.breachWarning.timeRemaining}
        subjectId={gameState.breachWarning.subjectId}
      />

      {/* Main game UI */}
      <div className="flex flex-col h-full p-2 gap-2">
        {/* Top bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <StatusBar 
              clock={gameState.clock}
              night={gameState.currentNight}
              power={gameState.power}
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={togglePause}
            className="shrink-0"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onExit}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex gap-2 min-h-0">
          {/* Camera map */}
          <div className="flex-1 min-w-0">
            <CameraMap
              cameras={gameState.cameras}
              subjects={gameState.subjects}
              onRoomClick={setSelectedRoom}
              onRebootCamera={onRebootCamera}
              selectedRoom={selectedRoom}
              lastPingSweep={lastPingSweep}
              power={gameState.power}
              isZ04Visible={z04Visible}
            />
          </div>

          {/* Control panel */}
          <div className="w-48 shrink-0">
            <ControlPanel
              selectedRoom={selectedRoom}
              lureCooldown={gameState.lureCooldown}
              shockCooldown={gameState.shockCooldown}
              doorBlockCooldown={gameState.doorBlockCooldown}
              doorBlocked={gameState.doorBlocked}
              power={gameState.power}
              onLure={handleLure}
              onShock={handleShock}
              onBlockDoor={handleBlockDoor}
              onReleaseDoor={onReleaseDoor}
            />
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-30">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">PAUSED</h2>
            <div className="space-x-2">
              <Button onClick={togglePause}>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
              <Button variant="outline" onClick={onExit}>
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
