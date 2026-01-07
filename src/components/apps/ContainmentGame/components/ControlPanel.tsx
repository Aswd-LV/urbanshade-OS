import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2, Zap, DoorClosed, AlertTriangle } from 'lucide-react';
import { DoorDirection, CameraState } from '../types';
import { isContainmentRoom } from '../data/facilityMap';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  selectedRoom: string | null;
  cameras: CameraState[];
  lureCooldown: number;
  shockCooldown: number;
  doorBlockCooldown: number;
  doorBlocked: DoorDirection | null;
  power: number;
  onPlaceLure: () => void;
  onShock: () => void;
  onBlockDoor: (direction: DoorDirection) => void;
  onReleaseDoor: () => void;
}

export const ControlPanel = ({
  selectedRoom,
  cameras,
  lureCooldown,
  shockCooldown,
  doorBlockCooldown,
  doorBlocked,
  power,
  onPlaceLure,
  onShock,
  onBlockDoor,
  onReleaseDoor
}: ControlPanelProps) => {
  const now = Date.now();
  const lureCooldownRemaining = Math.max(0, lureCooldown - now);
  const shockCooldownRemaining = Math.max(0, shockCooldown - now);
  const doorCooldownRemaining = Math.max(0, doorBlockCooldown - now);

  // Check if selected room has an online camera (required for lure placement)
  const selectedCamera = selectedRoom ? cameras.find(c => c.roomId === selectedRoom) : null;
  const cameraOnline = selectedCamera?.isOnline ?? false;
  
  // Check if shock is available (only in containment rooms)
  const canShockRoom = selectedRoom ? isContainmentRoom(selectedRoom) : false;

  const canUseLure = lureCooldownRemaining === 0 && selectedRoom && power >= 3 && cameraOnline;
  const canUseShock = shockCooldownRemaining === 0 && selectedRoom && power >= 5 && canShockRoom && cameraOnline;
  const canUseDoors = doorCooldownRemaining === 0 || doorBlocked;

  return (
    <div className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border h-full">
      {/* Selected room info */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-muted-foreground">
          {selectedRoom ? `TARGET: ${selectedRoom.toUpperCase()}` : 'SELECT A CAMERA'}
        </div>
        
        {/* Room tools */}
        <div className="space-y-2">
          {/* Lure button - requires online camera */}
          <Button
            size="sm"
            variant="outline"
            onClick={onPlaceLure}
            disabled={!canUseLure}
            className={cn(
              "w-full gap-1",
              canUseLure && "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            )}
          >
            <Volume2 className="w-3 h-3" />
            <span className="text-xs">Place Lure</span>
            {lureCooldownRemaining > 0 && (
              <span className="text-[10px] ml-1">({Math.ceil(lureCooldownRemaining / 1000)}s)</span>
            )}
          </Button>
          
          {selectedRoom && !cameraOnline && (
            <p className="text-[10px] text-amber-400 px-1">
              Camera offline - cannot place lure
            </p>
          )}

          {/* Shock button - only in containment rooms */}
          <Button
            size="sm"
            variant="outline"
            onClick={onShock}
            disabled={!canUseShock}
            className={cn(
              "w-full gap-1",
              canUseShock && "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            )}
          >
            <Zap className="w-3 h-3" />
            <span className="text-xs">Shock</span>
            {shockCooldownRemaining > 0 && (
              <span className="text-[10px] ml-1">({Math.ceil(shockCooldownRemaining / 1000)}s)</span>
            )}
          </Button>
          
          {selectedRoom && !canShockRoom && (
            <div className="flex items-center gap-1 px-1">
              <AlertTriangle className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">
                Shock only in containment rooms
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Door controls */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-muted-foreground flex items-center justify-between">
          <span>DOOR LOCKS</span>
          {doorCooldownRemaining > 0 && !doorBlocked && (
            <span className="text-amber-400">CD {Math.ceil(doorCooldownRemaining / 1000)}s</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {(['left', 'front', 'right'] as DoorDirection[]).map(dir => (
            <Button
              key={dir}
              size="sm"
              variant={doorBlocked === dir ? "destructive" : "outline"}
              onClick={() => doorBlocked === dir ? onReleaseDoor() : onBlockDoor(dir)}
              disabled={!canUseDoors && doorBlocked !== dir}
              className={cn(
                "relative text-xs px-2",
                doorBlocked === dir && "animate-pulse"
              )}
            >
              <DoorClosed className="w-3 h-3 mr-1" />
              <span className="capitalize">{dir[0]}</span>
              {doorBlocked === dir && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Power gauge */}
      <div className="space-y-1 mt-auto">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-muted-foreground">POWER</span>
          <span className={cn(
            "font-bold",
            power > 50 ? "text-emerald-400" : power > 25 ? "text-amber-400" : "text-red-400"
          )}>
            {Math.round(power)}%
          </span>
        </div>
        <Progress 
          value={power} 
          className={cn(
            "h-2",
            power > 50 ? "[&>div]:bg-emerald-500" : power > 25 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
          )}
        />
      </div>
    </div>
  );
};
