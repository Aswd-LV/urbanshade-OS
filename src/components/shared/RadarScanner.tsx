import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RadarBlip {
  id: string;
  x: number;
  y: number;
  type: 'friendly' | 'hostile' | 'neutral' | 'unknown';
  label?: string;
}

interface RadarScannerProps {
  blips?: RadarBlip[];
  isScanning?: boolean;
  size?: number;
  className?: string;
  sweepSpeed?: number;
}

export const RadarScanner = ({
  blips = [],
  isScanning = false,
  size = 200,
  className,
  sweepSpeed = 3
}: RadarScannerProps) => {
  const [sweepAngle, setSweepAngle] = useState(0);
  const [visibleBlips, setVisibleBlips] = useState<string[]>([]);

  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 1000 / 60);
    
    return () => clearInterval(interval);
  }, [isScanning]);

  // Show blips when sweep passes over them
  useEffect(() => {
    if (!isScanning) return;
    
    blips.forEach(blip => {
      const blipAngle = Math.atan2(blip.y - 50, blip.x - 50) * (180 / Math.PI) + 180;
      const angleDiff = Math.abs(sweepAngle - blipAngle);
      
      if (angleDiff < 10 || angleDiff > 350) {
        if (!visibleBlips.includes(blip.id)) {
          setVisibleBlips(prev => [...prev, blip.id]);
          
          // Fade out after 2 seconds
          setTimeout(() => {
            setVisibleBlips(prev => prev.filter(id => id !== blip.id));
          }, 2000);
        }
      }
    });
  }, [sweepAngle, blips, isScanning, visibleBlips]);

  const getBlipColor = (type: RadarBlip['type']) => {
    switch (type) {
      case 'friendly': return 'bg-emerald-400';
      case 'hostile': return 'bg-red-500';
      case 'neutral': return 'bg-amber-400';
      case 'unknown': return 'bg-cyan-400';
    }
  };

  return (
    <div 
      className={cn("relative rounded-full bg-black/80 border-2 border-cyan-500/30 overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0">
        {/* Concentric circles */}
        {[25, 50, 75].map(radius => (
          <div 
            key={radius}
            className="absolute border border-cyan-500/20 rounded-full"
            style={{
              width: `${radius}%`,
              height: `${radius}%`,
              top: `${(100 - radius) / 2}%`,
              left: `${(100 - radius) / 2}%`
            }}
          />
        ))}
        
        {/* Cross lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/20" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/20" />
      </div>

      {/* Sweep line */}
      {isScanning && (
        <div 
          className="absolute top-1/2 left-1/2 origin-left"
          style={{
            width: '50%',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(0,255,255,0.8), transparent)',
            transform: `rotate(${sweepAngle}deg)`,
            boxShadow: '0 0 10px rgba(0,255,255,0.5)'
          }}
        />
      )}

      {/* Sweep trail */}
      {isScanning && (
        <div 
          className="absolute top-1/2 left-1/2 origin-center"
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(-50%, -50%) rotate(${sweepAngle}deg)`,
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(0,255,255,0.1) 30deg,
              transparent 60deg
            )`
          }}
        />
      )}

      {/* Blips */}
      {blips.map(blip => (
        <div
          key={blip.id}
          className={cn(
            "absolute w-2 h-2 rounded-full transition-opacity duration-500",
            getBlipColor(blip.type),
            visibleBlips.includes(blip.id) ? "opacity-100" : "opacity-30"
          )}
          style={{
            left: `${blip.x}%`,
            top: `${blip.y}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: visibleBlips.includes(blip.id) 
              ? `0 0 8px ${blip.type === 'hostile' ? 'rgba(239,68,68,0.8)' : 'rgba(0,255,255,0.8)'}` 
              : undefined
          }}
        >
          {blip.label && visibleBlips.includes(blip.id) && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] font-mono text-cyan-400 whitespace-nowrap">
              {blip.label}
            </span>
          )}
        </div>
      ))}

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full" />

      {/* Scanning indicator */}
      {isScanning && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-cyan-400 animate-pulse">
          SCANNING
        </div>
      )}
    </div>
  );
};
