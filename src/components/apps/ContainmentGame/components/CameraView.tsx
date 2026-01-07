import { useState, useEffect } from 'react';
import { CameraState, SubjectState, PING_SWEEP_INTERVAL } from '../types';
import { getRoomById } from '../data/facilityMap';
import { getSubjectById } from '../data/subjects';
import { cn } from '@/lib/utils';
import { Camera, AlertTriangle, Radio } from 'lucide-react';

interface CameraViewProps {
  cameraId: string | null;
  cameras: CameraState[];
  subjects: SubjectState[];
  isZ04Visible: boolean;
  lastPingSweep: number;
}

export const CameraView = ({
  cameraId,
  cameras,
  subjects,
  isZ04Visible,
  lastPingSweep
}: CameraViewProps) => {
  const [showPing, setShowPing] = useState(false);
  
  // Ping animation when sweep happens
  useEffect(() => {
    setShowPing(true);
    const timeout = setTimeout(() => setShowPing(false), 800);
    return () => clearTimeout(timeout);
  }, [lastPingSweep]);

  if (!cameraId) {
    return (
      <div className="h-full flex items-center justify-center bg-background/50 rounded-lg border border-border">
        <div className="text-center text-muted-foreground">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-mono">SELECT A CAMERA</p>
          <p className="text-xs mt-1">Click on a camera node to view</p>
        </div>
      </div>
    );
  }

  const camera = cameras.find(c => c.roomId === cameraId);
  const room = getRoomById(cameraId);

  if (!room) {
    return (
      <div className="h-full flex items-center justify-center bg-background/50 rounded-lg border border-border">
        <p className="text-sm text-destructive font-mono">CAMERA NOT FOUND</p>
      </div>
    );
  }

  // Camera offline
  if (camera && !camera.isOnline) {
    return (
      <div className="h-full flex flex-col bg-background/50 rounded-lg border border-destructive/50 overflow-hidden">
        <div className="p-2 bg-destructive/20 border-b border-destructive/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-destructive">CAM: {room.name.toUpperCase()}</span>
            <span className="text-xs font-mono text-destructive animate-pulse">OFFLINE</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.1)_2px,rgba(255,0,0,0.1)_4px)]" />
              <Camera className="w-full h-full text-destructive/30" />
            </div>
            <p className="text-sm text-destructive font-mono">NO SIGNAL</p>
            {camera.isRebooting && (
              <div className="mt-2">
                <div className="w-32 h-1.5 bg-muted rounded-full mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${camera.rebootProgress}%` }}
                  />
                </div>
                <p className="text-xs text-amber-400 mt-1">REBOOTING...</p>
              </div>
            )}
            {!camera.isRebooting && camera.autoRepairProgress > 0 && (
              <div className="mt-2">
                <div className="w-32 h-1 bg-muted rounded-full mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-blue-500/50 transition-all"
                    style={{ width: `${camera.autoRepairProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-blue-400/70 mt-1">AUTO-REPAIR</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Get subjects in this room (this is where pings show!)
  const subjectsInRoom = subjects.filter(s => {
    if (s.currentRoom !== cameraId) return false;
    
    // Z-04 visibility toggle
    const subjectData = getSubjectById(s.subjectId);
    if (subjectData?.specialAbility === 'invisible' && !isZ04Visible) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-background/50 rounded-lg border border-border overflow-hidden">
      {/* Camera header */}
      <div className="p-2 bg-muted/30 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">CAM: {room.name.toUpperCase()}</span>
          <div className="flex items-center gap-2">
            {room.isContainmentRoom && (
              <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 bg-amber-500/10 rounded">
                CONTAINMENT
              </span>
            )}
            <div className={cn(
              "w-2 h-2 rounded-full",
              camera?.isOnline ? "bg-emerald-500" : "bg-red-500"
            )} />
          </div>
        </div>
      </div>

      {/* Camera feed area */}
      <div className="flex-1 relative bg-black/20">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

        {/* Room visualization */}
        <div className="absolute inset-4 border border-emerald-500/20 rounded flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-16 h-16 mx-auto text-emerald-500/30" />
            <p className="text-sm text-emerald-400/50 font-mono mt-2">{room.name}</p>
          </div>
        </div>

        {/* Entity ping indicators - ONLY visible on the camera you're viewing */}
        {subjectsInRoom.length > 0 && showPing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-4">
              {subjectsInRoom.map((subject) => {
                const subjectData = getSubjectById(subject.subjectId);
                const isStunned = subject.stunUntil > Date.now();
                const isZ12Fake = subjectData?.id === 'Z-12' && Math.random() < 0.3;
                
                return (
                  <div
                    key={subject.subjectId}
                    className={cn(
                      "relative flex flex-col items-center",
                      isZ12Fake && "opacity-50"
                    )}
                  >
                    {/* Ping blip */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isStunned 
                          ? "bg-blue-500/30 border-2 border-blue-400" 
                          : "bg-red-500/30 border-2 border-red-500 animate-pulse"
                      )}
                    >
                      <Radio className={cn(
                        "w-4 h-4",
                        isStunned ? "text-blue-400" : "text-red-400"
                      )} />
                    </div>
                    
                    {/* Subject ID */}
                    <span className={cn(
                      "text-[10px] font-mono mt-1",
                      isStunned ? "text-blue-400" : "text-red-400"
                    )}>
                      {subject.subjectId}
                    </span>
                    
                    {isStunned && (
                      <span className="text-[8px] text-blue-300">STUNNED</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Warning if entity detected */}
        {subjectsInRoom.length > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded border border-red-500/50">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-[10px] font-mono text-red-400">
              {subjectsInRoom.length} CONTACT{subjectsInRoom.length > 1 ? 'S' : ''}
            </span>
          </div>
        )}

        {/* Timestamp */}
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-500/50">
          {new Date().toLocaleTimeString()}
        </div>

        {/* Ping sweep indicator */}
        {showPing && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono text-emerald-400">SCANNING</span>
          </div>
        )}
      </div>
    </div>
  );
};
