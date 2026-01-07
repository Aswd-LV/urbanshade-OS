import { useCallback, useEffect } from 'react';
import { MainMenu } from './MainMenu';
import { GameScreen } from './GameScreen';
import { GameOver } from './GameOver';
import { VictoryScreen } from './VictoryScreen';
import { LoreViewer } from './LoreViewer';
import { useGameLoop } from './hooks/useGameLoop';
import { useAudio } from './hooks/useAudio';

interface ContainmentGameProps {
  onClose?: () => void;
  onExclusiveFullscreen?: (enabled: boolean) => void;
}

export const ContainmentGame = ({ onClose, onExclusiveFullscreen }: ContainmentGameProps) => {
  const {
    gameState,
    startNight,
    endGame,
    placeLure,
    activateShock,
    blockDoor,
    releaseDoor,
    rebootCamera,
    selectCamera,
    returnToMenu,
    openLoreViewer,
    setGameState
  } = useGameLoop();

  const audio = useAudio();

  // Notify parent about exclusive fullscreen state
  useEffect(() => {
    onExclusiveFullscreen?.(gameState.isExclusiveFullscreen);
  }, [gameState.isExclusiveFullscreen, onExclusiveFullscreen]);

  const handleExit = useCallback(() => {
    returnToMenu();
    onClose?.();
  }, [returnToMenu, onClose]);

  const handleVictoryContinue = useCallback(() => {
    startNight(gameState.currentNight + 1);
  }, [startNight, gameState.currentNight]);

  const handleRetry = useCallback(() => {
    startNight(gameState.currentNight);
  }, [startNight, gameState.currentNight]);

  switch (gameState.phase) {
    case 'menu':
      return (
        <MainMenu
          unlockedNights={gameState.unlockedNights}
          onStartNight={startNight}
          onOpenLore={openLoreViewer}
          onExit={handleExit}
        />
      );

    case 'playing':
      return (
        <GameScreen
          gameState={gameState}
          setGameState={setGameState}
          onPlaceLure={placeLure}
          onShock={activateShock}
          onBlockDoor={blockDoor}
          onReleaseDoor={releaseDoor}
          onRebootCamera={rebootCamera}
          onSelectCamera={selectCamera}
          onEndGame={endGame}
          onExit={returnToMenu}
        />
      );

    case 'gameover':
      return (
        <GameOver
          subjectId={gameState.breachWarning.subjectId}
          night={gameState.currentNight}
          onRetry={handleRetry}
          onMainMenu={returnToMenu}
        />
      );

    case 'victory':
      return (
        <VictoryScreen
          night={gameState.currentNight}
          powerRemaining={gameState.power}
          hasNextNight={gameState.currentNight < 5}
          onContinue={handleVictoryContinue}
          onMainMenu={returnToMenu}
          onViewLore={openLoreViewer}
        />
      );

    case 'lore':
      return (
        <LoreViewer
          unlockedNights={gameState.unlockedNights}
          onBack={returnToMenu}
        />
      );

    default:
      return null;
  }
};

export default ContainmentGame;
