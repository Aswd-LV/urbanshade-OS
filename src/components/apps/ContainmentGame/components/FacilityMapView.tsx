import { useMemo } from 'react';
import { FACILITY_ROOMS, getRoomById } from '../data/facilityMap';
import { CameraState, ActiveLure } from '../types';
import { cn } from '@/lib/utils';
import { Camera, Volume2 } from 'lucide-react';

interface FacilityMapViewProps {
  cameras: CameraState[];
  selectedCamera: string | null;
  onCameraClick: (roomId: string) => void;
  onRebootCamera: (roomId: string) => void;
  activeLures: ActiveLure[];
  power: number;
}

export const FacilityMapView = ({
  cameras,
  selectedCamera,
  onCameraClick,
  onRebootCamera,
  activeLures,
  power
}: FacilityMapViewProps) => {
  // Calculate bounding box for rooms
  const bounds = useMemo(() => {
    const xs = FACILITY_ROOMS.map(r => r.x);
    const ys = FACILITY_ROOMS.map(r => r.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }, []);

  const getCameraState = (roomId: string): CameraState | undefined => {
    return cameras.find(c => c.roomId === roomId);
  };

  const hasActiveLure = (roomId: string): boolean => {
    return activeLures.some(l => l.roomId === roomId && l.expiresAt > Date.now());
  };

  // Scale room positions to percentage
  const getPosition = (x: number, y: number) => {
    const cols = bounds.maxX - bounds.minX + 1;
    const rows = bounds.maxY - bounds.minY + 1;
    const cellWidth = 100 / (cols + 1);
    const cellHeight = 100 / (rows + 1);
    
    return {
      left: ((x - bounds.minX + 0.5) * cellWidth) + '%',
      top: ((y - bounds.minY + 0.5) * cellHeight) + '%',
      width: cellWidth * 0.9 + '%',
      height: cellHeight * 0.8 + '%'
    };
  };

  // Draw connections between rooms
  const renderConnections = () => {
    const lines: JSX.Element[] = [];
    const drawnConnections = new Set<string>();
    const cols = bounds.maxX - bounds.minX + 1;
    const rows = bounds.maxY - bounds.minY + 1;
    const cellWidth = 100 / (cols + 1);
    const cellHeight = 100 / (rows + 1);

    FACILITY_ROOMS.forEach(room => {
      room.connections.forEach(connId => {
        const connectionKey = [room.id, connId].sort().join('-');
        if (drawnConnections.has(connectionKey)) return;
        drawnConnections.add(connectionKey);

        const connRoom = getRoomById(connId);
        if (!connRoom) return;

        const x1 = (room.x - bounds.minX + 0.5) * cellWidth + cellWidth * 0.45;
        const y1 = (room.y - bounds.minY + 0.5) * cellHeight + cellHeight * 0.4;
        const x2 = (connRoom.x - bounds.minX + 0.5) * cellWidth + cellWidth * 0.45;
        const y2 = (connRoom.y - bounds.minY + 0.5) * cellHeight + cellHeight * 0.4;

        lines.push(
          <line
            key={connectionKey}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        );
      });
    });

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {lines}
      </svg>
    );
  };

  const renderRoom = (room: typeof FACILITY_ROOMS[0]) => {
    const camera = getCameraState(room.id);
    const isSelected = selectedCamera === room.id;
    const isOffline = camera && !camera.isOnline;
    const isRebooting = camera?.isRebooting;
    const hasLure = hasActiveLure(room.id);
    const pos = getPosition(room.x, room.y);

    if (room.isControlRoom) {
      return (
        <div
          key={room.id}
          className="absolute flex items-center justify-center bg-emerald-500/20 border-2 border-emerald-500 rounded"
          style={pos}
        >
          <span className="text-[10px] font-bold text-emerald-400">YOU</span>
        </div>
      );
    }

    return (
      <button
        key={room.id}
        onClick={() => isOffline && !isRebooting ? onRebootCamera(room.id) : onCameraClick(room.id)}
        className={cn(
          "absolute flex flex-col items-center justify-center rounded transition-all duration-200",
          isSelected && "ring-2 ring-primary",
          isOffline 
            ? "bg-red-500/20 border border-red-500/50" 
            : "bg-muted/30 border border-border hover:bg-muted/50",
          room.isContainmentRoom && "border-amber-500/50",
          room.isFinalRoom && "border-red-500/30"
        )}
        style={pos}
      >
        {/* Room name */}
        <span className="text-[8px] text-muted-foreground truncate max-w-full px-1 leading-tight">
          {room.name}
        </span>
        
        {/* Camera indicator */}
        <Camera className={cn(
          "w-3 h-3 mt-0.5",
          isOffline ? "text-red-400" : "text-emerald-400/50",
          isSelected && "text-primary"
        )} />
        
        {isOffline && !isRebooting && (
          <span className="text-[6px] text-red-400 font-bold">OFFLINE</span>
        )}
        
        {isRebooting && (
          <div className="w-3/4 h-0.5 bg-muted rounded-full overflow-hidden mt-0.5">
            <div 
              className="h-full bg-amber-500 transition-all duration-100"
              style={{ width: `${camera?.rebootProgress || 0}%` }}
            />
          </div>
        )}

        {/* Lure indicator */}
        {hasLure && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            <Volume2 className="w-2 h-2 text-white" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative w-full h-full bg-background/50 rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-muted/50 border-b border-border flex items-center justify-between z-10">
        <span className="text-xs font-mono text-muted-foreground">FACILITY MAP</span>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            power > 25 ? "bg-emerald-500" : power > 0 ? "bg-amber-500 animate-pulse" : "bg-red-500"
          )} />
          <span className="text-xs font-mono">{Math.round(power)}%</span>
        </div>
      </div>

      {/* Map area */}
      <div className="absolute top-10 left-2 right-2 bottom-2">
        {renderConnections()}
        {FACILITY_ROOMS.map(renderRoom)}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[8px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500/30 border border-amber-500/50 rounded" />
          <span>Containment</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span>Lure Active</span>
        </div>
      </div>
    </div>
  );
};
