import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2, Zap, DoorClosed } from 'lucide-react';
import { DoorDirection } from '../types';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  selectedRoom: string | null;
  lureCooldown: number;
  shockCooldown: number;
  doorBlockCooldown: number;
  doorBlocked: DoorDirection | null;
  power: number;
  onLure: () => void;
  onShock: () => void;
  onBlockDoor: (direction: DoorDirection) => void;
  onReleaseDoor: () => void;
}

export const ControlPanel = ({
  selectedRoom,
  lureCooldown,
  shockCooldown,
  doorBlockCooldown,
  doorBlocked,
  power,
  onLure,
  onShock,
  onBlockDoor,
  onReleaseDoor
}: ControlPanelProps) => {
  const now = Date.now();
  const lureCooldownRemaining = Math.max(0, lureCooldown - now);
  const shockCooldownRemaining = Math.max(0, shockCooldown - now);
  const doorCooldownRemaining = Math.max(0, doorBlockCooldown - now);

  const canUseLure = lureCooldownRemaining === 0 && selectedRoom && power >= 3;
  const canUseShock = shockCooldownRemaining === 0 && selectedRoom && power >= 5;
  const canUseDoors = doorCooldownRemaining === 0 || doorBlocked;

  return (
    <div className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border">
      {/* Room tools */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-muted-foreground">
          {selectedRoom ? `TARGET: ${selectedRoom.toUpperCase()}` : 'SELECT A ROOM'}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onLure}
            disabled={!canUseLure}
            className={cn(
              "flex-1 gap-1",
              canUseLure && "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            )}
          >
            <Volume2 className="w-3 h-3" />
            <span className="text-xs">Lure</span>
            {lureCooldownRemaining > 0 && (
              <span className="text-[10px] ml-1">({Math.ceil(lureCooldownRemaining / 1000)}s)</span>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onShock}
            disabled={!canUseShock}
            className={cn(
              "flex-1 gap-1",
              canUseShock && "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            )}
          >
            <Zap className="w-3 h-3" />
            <span className="text-xs">Shock</span>
            {shockCooldownRemaining > 0 && (
              <span className="text-[10px] ml-1">({Math.ceil(shockCooldownRemaining / 1000)}s)</span>
            )}
          </Button>
        </div>
      </div>

      {/* Door controls */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-muted-foreground flex items-center justify-between">
          <span>DOOR LOCKS</span>
          {doorCooldownRemaining > 0 && !doorBlocked && (
            <span className="text-amber-400">COOLDOWN {Math.ceil(doorCooldownRemaining / 1000)}s</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['left', 'front', 'right'] as DoorDirection[]).map(dir => (
            <Button
              key={dir}
              size="sm"
              variant={doorBlocked === dir ? "destructive" : "outline"}
              onClick={() => doorBlocked === dir ? onReleaseDoor() : onBlockDoor(dir)}
              disabled={!canUseDoors && doorBlocked !== dir}
              className={cn(
                "relative",
                doorBlocked === dir && "animate-pulse"
              )}
            >
              <DoorClosed className="w-3 h-3 mr-1" />
              <span className="text-xs capitalize">{dir}</span>
              {doorBlocked === dir && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Power gauge */}
      <div className="space-y-1">
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
