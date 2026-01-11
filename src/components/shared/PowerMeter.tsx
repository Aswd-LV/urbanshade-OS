import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PowerMeterProps {
  current: number;
  max: number;
  label?: string;
  showIcon?: boolean;
  compact?: boolean;
  className?: string;
}

export const PowerMeter = ({
  current,
  max,
  label = "AUXILIARY POWER",
  showIcon = true,
  compact = false,
  className
}: PowerMeterProps) => {
  const percentage = (current / max) * 100;
  const isLow = percentage < 25;
  const isCritical = percentage < 10;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {showIcon && (
          <Zap className={cn(
            "w-3 h-3",
            isCritical ? "text-red-400 animate-pulse" : isLow ? "text-amber-400" : "text-cyan-400"
          )} />
        )}
        <div className="w-20 h-1.5 bg-black/50 border border-cyan-500/30 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-cyan-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={cn(
          "text-[10px] font-mono tabular-nums",
          isCritical ? "text-red-400" : isLow ? "text-amber-400" : "text-cyan-400"
        )}>
          {Math.round(percentage)}%
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="flex items-center gap-1.5 text-cyan-600">
          {showIcon && <Zap className="w-3 h-3" />}
          {label}
        </span>
        <span className={cn(
          isCritical ? "text-red-400" : isLow ? "text-amber-400" : "text-cyan-400"
        )}>
          {current} / {max}
        </span>
      </div>
      <div className="h-2 bg-black border border-cyan-500/30 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            isCritical ? "bg-red-500/80 animate-pulse" : isLow ? "bg-amber-500/80" : "bg-gradient-to-r from-cyan-600 to-cyan-400"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isCritical && (
        <div className="text-[9px] text-red-400 font-mono animate-pulse">
          ⚠ CRITICAL POWER LEVEL
        </div>
      )}
    </div>
  );
};
