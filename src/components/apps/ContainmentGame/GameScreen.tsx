import { useState, useCallback, useEffect } from 'react';
import { FacilityMapView } from './components/FacilityMapView';
import { CameraView } from './components/CameraView';
import { ControlPanel } from './components/ControlPanel';
import { StatusBar } from './components/StatusBar';
import { BreachAlert } from './components/BreachAlert';
import { MemeticEffects } from './components/MemeticEffects';
import { GameState, DoorDirection, BREACH_WARNING_TIME, PING_SWEEP_INTERVAL } from './types';
import { useSubjectAI } from './hooks/useSubjectAI';
import { useAudio } from './hooks/useAudio';
import { Button } from '@/components/ui/button';
import { Pause, Play, X } from 'lucide-react';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onPlaceLure: (roomId: string) => void;
  onShock: (roomId: string) => void;
  onBlockDoor: (direction: DoorDirection) => void;
  onReleaseDoor: () => void;
  onRebootCamera: (roomId: string) => void;
  onSelectCamera: (roomId: string | null) => void;
  onEndGame: (victory: boolean, killedBy?: string) => void;
  onExit: () => void;
}

export const GameScreen = ({
  gameState,
  setGameState,
  onPlaceLure,
  onShock,
  onBlockDoor,
  onReleaseDoor,
  onRebootCamera,
  onSelectCamera,
  onEndGame,
  onExit
}: GameScreenProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [lastPingSweep, setLastPingSweep] = useState(Date.now());
  const [z04Visible, setZ04Visible] = useState(true);

  const audio = useAudio();

  const handleBreach = useCallback((subjectId: string, direction: DoorDirection) => {
    audio.playBreachWarning();
    setGameState(prev => ({
      ...prev,
      breachWarning: { active: true, direction, timeRemaining: BREACH_WARNING_TIME, subjectId }
    }));
  }, [setGameState, audio]);

  const handleCameraAttack = useCallback((roomId: string) => {
    audio.playStatic();
  }, [audio]);

  const { isZ04Visible } = useSubjectAI({
    gameState,
    setGameState,
    onBreach: handleBreach,
    onCameraAttack: handleCameraAttack
  });

  useEffect(() => {
    if (gameState.phase !== 'playing' || isPaused) return;
    const interval = setInterval(() => {
      audio.playPingSweep();
      setLastPingSweep(Date.now());
      setZ04Visible(v => !v);
    }, PING_SWEEP_INTERVAL);
    return () => clearInterval(interval);
  }, [gameState.phase, isPaused, audio]);

  const handleLure = () => {
    if (gameState.selectedCamera) {
      audio.playLure();
      onPlaceLure(gameState.selectedCamera);
    }
  };

  const handleShock = () => {
    if (gameState.selectedCamera) {
      audio.playShock();
      onShock(gameState.selectedCamera);
    }
  };

  const handleBlockDoor = (direction: DoorDirection) => {
    audio.playDoorSlam();
    onBlockDoor(direction);
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      <MemeticEffects intensity={gameState.memeticIntensity} enabled={!isPaused} />
      <BreachAlert
        active={gameState.breachWarning.active}
        direction={gameState.breachWarning.direction}
        timeRemaining={gameState.breachWarning.timeRemaining}
        subjectId={gameState.breachWarning.subjectId}
      />

      <div className="flex flex-col h-full p-2 gap-2">
        {/* Top bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <StatusBar clock={gameState.clock} night={gameState.currentNight} power={gameState.power} />
          </div>
          <Button size="icon" variant="ghost" onClick={() => setIsPaused(p => !p)} className="shrink-0">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={onExit} className="shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex gap-2 min-h-0">
          {/* Facility map */}
          <div className="w-1/3 min-w-0">
            <FacilityMapView
              cameras={gameState.cameras}
              selectedCamera={gameState.selectedCamera}
              onCameraClick={onSelectCamera}
              onRebootCamera={onRebootCamera}
              activeLures={gameState.activeLures}
              power={gameState.power}
            />
          </div>

          {/* Camera view - pings only show here */}
          <div className="flex-1 min-w-0">
            <CameraView
              cameraId={gameState.selectedCamera}
              cameras={gameState.cameras}
              subjects={gameState.subjects}
              isZ04Visible={z04Visible}
              lastPingSweep={lastPingSweep}
            />
          </div>

          {/* Control panel */}
          <div className="w-44 shrink-0">
            <ControlPanel
              selectedRoom={gameState.selectedCamera}
              cameras={gameState.cameras}
              lureCooldown={gameState.lureCooldown}
              shockCooldown={gameState.shockCooldown}
              doorBlockCooldown={gameState.doorBlockCooldown}
              doorBlocked={gameState.doorBlocked}
              power={gameState.power}
              onPlaceLure={handleLure}
              onShock={handleShock}
              onBlockDoor={handleBlockDoor}
              onReleaseDoor={onReleaseDoor}
            />
          </div>
        </div>
      </div>

      {isPaused && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-30">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">PAUSED</h2>
            <div className="space-x-2">
              <Button onClick={() => setIsPaused(false)}><Play className="w-4 h-4 mr-2" />Resume</Button>
              <Button variant="outline" onClick={onExit}>Exit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
