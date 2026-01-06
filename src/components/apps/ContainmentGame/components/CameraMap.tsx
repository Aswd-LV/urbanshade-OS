import { useState, useEffect, useCallback } from 'react';
import { FACILITY_ROOMS, getRoomById } from '../data/facilityMap';
import { CameraState, SubjectState, PING_SWEEP_INTERVAL } from '../types';
import { getSubjectById } from '../data/subjects';
import { cn } from '@/lib/utils';

interface CameraMapProps {
  cameras: CameraState[];
  subjects: SubjectState[];
  onRoomClick: (roomId: string) => void;
  onRebootCamera: (roomId: string) => void;
  selectedRoom: string | null;
  lastPingSweep: number;
  power: number;
  isZ04Visible: boolean;
}

export const CameraMap = ({
  cameras,
  subjects,
  onRoomClick,
  onRebootCamera,
  selectedRoom,
  lastPingSweep,
  power,
  isZ04Visible
}: CameraMapProps) => {
  const [showPing, setShowPing] = useState(false);
  const [pingProgress, setPingProgress] = useState(0);

  // Ping sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPing(true);
      setPingProgress(0);
      
      const sweepDuration = 800;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / sweepDuration);
        setPingProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => setShowPing(false), 200);
        }
      };
      
      requestAnimationFrame(animate);
    }, PING_SWEEP_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const getCameraState = (roomId: string): CameraState | undefined => {
    return cameras.find(c => c.roomId === roomId);
  };

  const getSubjectsInRoom = (roomId: string): SubjectState[] => {
    return subjects.filter(s => {
      if (s.currentRoom !== roomId) return false;
      
      // Z-04 visibility toggle
      const subjectData = getSubjectById(s.subjectId);
      if (subjectData?.specialAbility === 'invisible' && !isZ04Visible) {
        return false;
      }
      
      return true;
    });
  };

  const renderRoom = (room: typeof FACILITY_ROOMS[0]) => {
    const camera = getCameraState(room.id);
    const roomSubjects = getSubjectsInRoom(room.id);
    const isSelected = selectedRoom === room.id;
    const isOffline = camera && !camera.isOnline;
    const isRebooting = camera?.isRebooting;

    if (room.isControlRoom) {
      return (
        <div
          key={room.id}
          className="absolute flex items-center justify-center bg-emerald-500/20 border-2 border-emerald-500 rounded"
          style={{
            left: `${room.x * 33 + 5}%`,
            top: `${room.y * 20 + 5}%`,
            width: '23%',
            height: '15%'
          }}
        >
          <span className="text-xs font-bold text-emerald-400">CONTROL</span>
        </div>
      );
    }

    return (
      <button
        key={room.id}
        onClick={() => isOffline && !isRebooting ? onRebootCamera(room.id) : onRoomClick(room.id)}
        className={cn(
          "absolute flex flex-col items-center justify-center rounded transition-all duration-200",
          isSelected && "ring-2 ring-primary",
          isOffline ? "bg-red-500/20 border border-red-500/50" : "bg-muted/30 border border-border hover:bg-muted/50",
          room.isFinalRoom && "border-amber-500/50"
        )}
        style={{
          left: `${room.x * 33 + 5}%`,
          top: `${room.y * 20 + 5}%`,
          width: '23%',
          height: '15%'
        }}
      >
        <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
          {room.name}
        </span>
        
        {isOffline && !isRebooting && (
          <span className="text-[8px] text-red-400 font-bold">OFFLINE</span>
        )}
        
        {isRebooting && (
          <div className="w-3/4 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-100"
              style={{ width: `${camera?.rebootProgress || 0}%` }}
            />
          </div>
        )}

        {/* Subject blips */}
        {!isOffline && roomSubjects.length > 0 && showPing && (
          <div className="absolute inset-0 flex items-center justify-center gap-0.5">
            {roomSubjects.map((s, i) => {
              const subjectData = getSubjectById(s.subjectId);
              const isZ12Fake = subjectData?.id === 'Z-12' && Math.random() < 0.3;
              
              return (
                <div
                  key={s.subjectId}
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    s.stunUntil > Date.now() ? "bg-blue-400" : "bg-red-500",
                    isZ12Fake && "opacity-50"
                  )}
                  title={s.subjectId}
                />
              );
            })}
          </div>
        )}
      </button>
    );
  };

  // Draw connections between rooms
  const renderConnections = () => {
    const lines: JSX.Element[] = [];
    const drawnConnections = new Set<string>();

    FACILITY_ROOMS.forEach(room => {
      room.connections.forEach(connId => {
        const connectionKey = [room.id, connId].sort().join('-');
        if (drawnConnections.has(connectionKey)) return;
        drawnConnections.add(connectionKey);

        const connRoom = getRoomById(connId);
        if (!connRoom) return;

        const x1 = room.x * 33 + 5 + 11.5;
        const y1 = room.y * 20 + 5 + 7.5;
        const x2 = connRoom.x * 33 + 5 + 11.5;
        const y2 = connRoom.y * 20 + 5 + 7.5;

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

  return (
    <div className="relative w-full h-full bg-background/50 rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-muted/50 border-b border-border flex items-center justify-between">
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

        {/* Ping sweep overlay */}
        {showPing && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent ${pingProgress * 100 - 10}%, rgba(34, 197, 94, 0.2) ${pingProgress * 100}%, transparent ${pingProgress * 100 + 10}%)`
            }}
          />
        )}
      </div>
    </div>
  );
};
