import { cn } from '@/lib/utils';

type Status = 'online' | 'offline' | 'warning' | 'critical' | 'rebooting' | 'scanning';

interface StatusIndicatorProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator = ({
  status,
  size = 'md',
  showLabel = false,
  pulse = true,
  className
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const statusConfig = {
    online: {
      color: 'bg-emerald-400',
      glow: 'shadow-emerald-400/50',
      label: 'ONLINE'
    },
    offline: {
      color: 'bg-red-500',
      glow: 'shadow-red-500/50',
      label: 'OFFLINE'
    },
    warning: {
      color: 'bg-amber-400',
      glow: 'shadow-amber-400/50',
      label: 'WARNING'
    },
    critical: {
      color: 'bg-red-500',
      glow: 'shadow-red-500/50',
      label: 'CRITICAL'
    },
    rebooting: {
      color: 'bg-amber-500',
      glow: 'shadow-amber-500/50',
      label: 'REBOOTING'
    },
    scanning: {
      color: 'bg-cyan-400',
      glow: 'shadow-cyan-400/50',
      label: 'SCANNING'
    }
  };

  const config = statusConfig[status];
  const shouldPulse = pulse && (status === 'warning' || status === 'critical' || status === 'rebooting' || status === 'scanning');

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div 
        className={cn(
          "rounded-full shadow-lg",
          sizeClasses[size],
          config.color,
          config.glow,
          shouldPulse && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className={cn(
          "text-xs font-mono uppercase tracking-wider",
          status === 'online' && "text-emerald-400",
          status === 'offline' && "text-red-400",
          status === 'warning' && "text-amber-400",
          status === 'critical' && "text-red-400",
          status === 'rebooting' && "text-amber-400",
          status === 'scanning' && "text-cyan-400"
        )}>
          {config.label}
        </span>
      )}
    </div>
  );
};
