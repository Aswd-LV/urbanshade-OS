import { Button } from '@/components/ui/button';
import { Play, BookOpen, Settings, Moon, Lock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainMenuProps {
  unlockedNights: number[];
  onStartNight: (night: number) => void;
  onOpenLore: () => void;
  onExit: () => void;
}

export const MainMenu = ({ unlockedNights, onStartNight, onOpenLore, onExit }: MainMenuProps) => {
  const maxNight = 5;
  const highestUnlocked = Math.max(...unlockedNights);

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('containment_game_progress');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-background to-muted/30 p-6">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 tracking-wider">
          CONTAINMENT BREACH
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          NIGHT SHIFT OPERATOR TERMINAL
        </p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Moon className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-muted-foreground">
            Survive until 6 AM
          </span>
        </div>
      </div>

      {/* Night Selection */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        <h2 className="text-sm font-mono text-muted-foreground text-center mb-3">
          SELECT NIGHT
        </h2>
        
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: maxNight }).map((_, i) => {
            const night = i + 1;
            const isUnlocked = unlockedNights.includes(night);
            const isCompleted = unlockedNights.includes(night + 1) || night === highestUnlocked && highestUnlocked > 1;
            
            return (
              <Button
                key={night}
                variant={isUnlocked ? "outline" : "ghost"}
                size="sm"
                onClick={() => isUnlocked && onStartNight(night)}
                disabled={!isUnlocked}
                className={cn(
                  "h-12 flex flex-col gap-0.5 relative",
                  isCompleted && "border-emerald-500/50 bg-emerald-500/10",
                  !isUnlocked && "opacity-50"
                )}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-lg font-bold">{night}</span>
                    {isCompleted && (
                      <span className="text-[8px] text-emerald-400">✓</span>
                    )}
                  </>
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Quick start button */}
        <Button
          className="w-full gap-2 mt-4"
          onClick={() => onStartNight(highestUnlocked)}
        >
          <Play className="w-4 h-4" />
          Start Night {highestUnlocked}
        </Button>
      </div>

      {/* Menu options */}
      <div className="w-full max-w-xs space-y-2">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={onOpenLore}
        >
          <BookOpen className="w-4 h-4" />
          Documents ({unlockedNights.length > 1 ? 'New Available' : 'None'})
        </Button>

        <Button
          variant="ghost"
          className="w-full gap-2 text-muted-foreground"
          onClick={onExit}
        >
          Exit to Desktop
        </Button>
      </div>

      {/* Reset progress */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-8 text-xs text-muted-foreground/50 hover:text-destructive"
        onClick={handleResetProgress}
      >
        <Trash2 className="w-3 h-3 mr-1" />
        Reset Progress
      </Button>

      {/* Version */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 font-mono">
        v1.0.0
      </div>
    </div>
  );
};
