import { useEffect, useState } from 'react';
import { AlertTriangle, DoorClosed } from 'lucide-react';
import { DoorDirection } from '../types';
import { cn } from '@/lib/utils';

interface BreachAlertProps {
  active: boolean;
  direction: DoorDirection | null;
  timeRemaining: number;
  subjectId: string | null;
}

export const BreachAlert = ({ active, direction, timeRemaining, subjectId }: BreachAlertProps) => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setFlash(f => !f);
    }, 150);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  const timeLeft = Math.ceil(timeRemaining / 1000);

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
      flash ? "bg-red-500/20" : "bg-transparent"
    )}>
      {/* Pulsing border */}
      <div className={cn(
        "absolute inset-0 border-8",
        flash ? "border-red-500" : "border-red-500/50"
      )} />

      {/* Alert content */}
      <div className="bg-black/90 p-6 rounded-lg border-2 border-red-500 max-w-md text-center animate-pulse">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <span className="text-2xl font-bold text-red-500 font-mono">BREACH WARNING</span>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <div className="mb-4">
          <span className="text-lg text-muted-foreground">{subjectId} APPROACHING</span>
        </div>

        {/* Direction indicator */}
        <div className="mb-4">
          <span className="text-sm text-muted-foreground mb-2 block">BLOCK THE DOOR</span>
          <div className="flex justify-center gap-4">
            {(['left', 'front', 'right'] as DoorDirection[]).map(dir => (
              <div
                key={dir}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border-2 transition-all",
                  direction === dir 
                    ? "border-red-500 bg-red-500/20 scale-110" 
                    : "border-muted bg-muted/20 opacity-50"
                )}
              >
                <DoorClosed className={cn(
                  "w-6 h-6 mb-1",
                  direction === dir ? "text-red-500" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs uppercase font-bold",
                  direction === dir ? "text-red-500" : "text-muted-foreground"
                )}>
                  {dir}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown */}
        <div className="text-4xl font-mono font-bold text-red-500">
          {timeLeft}
        </div>
        <div className="text-xs text-muted-foreground mt-1">SECONDS REMAINING</div>
      </div>
    </div>
  );
};
