import { Clock, Moon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  clock: number; // 0-360 representing 12AM-6AM
  night: number;
  power: number;
}

export const StatusBar = ({ clock, night, power }: StatusBarProps) => {
  // Convert clock value to time string
  const getTimeString = (clockValue: number) => {
    const totalMinutes = Math.floor((clockValue / 360) * 360); // 6 hours in minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    const displayHour = hours === 0 ? 12 : hours;
    const period = hours < 6 ? 'AM' : 'AM'; // Always AM for night shift
    
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Calculate segments for the progress bar
  const hourSegments = 6;
  const currentHour = Math.floor((clock / 360) * hourSegments);

  return (
    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg border border-border">
      {/* Night indicator */}
      <div className="flex items-center gap-2">
        <Moon className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-bold">Night {night}</span>
      </div>

      {/* Clock display */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <div className="flex flex-col items-center">
          <span className={cn(
            "font-mono text-lg font-bold",
            clock >= 300 ? "text-emerald-400" : "text-foreground"
          )}>
            {getTimeString(clock)}
          </span>
          
          {/* Hour progress bar */}
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: hourSegments }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-1 rounded-sm transition-colors duration-300",
                  i < currentHour 
                    ? "bg-emerald-500" 
                    : i === currentHour 
                      ? "bg-emerald-500/50 animate-pulse" 
                      : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Power compact display */}
      <div className="flex items-center gap-1">
        <Zap className={cn(
          "w-4 h-4",
          power > 50 ? "text-emerald-400" : power > 25 ? "text-amber-400" : "text-red-400"
        )} />
        <span className={cn(
          "text-sm font-mono font-bold",
          power > 50 ? "text-emerald-400" : power > 25 ? "text-amber-400" : "text-red-400"
        )}>
          {Math.round(power)}%
        </span>
      </div>
    </div>
  );
};
