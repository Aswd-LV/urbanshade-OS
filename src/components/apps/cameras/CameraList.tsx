import { Camera, Trash2, MoreVertical, Wifi, WifiOff, Settings } from "lucide-react";
import { IPCamera } from "@/hooks/useIPCameras";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CameraListProps {
  cameras: IPCamera[];
  selectedCameraId: string | null;
  onSelectCamera: (id: string) => void;
  onRemoveCamera: (id: string) => void;
}

export const CameraList = ({
  cameras,
  selectedCameraId,
  onSelectCamera,
  onRemoveCamera,
}: CameraListProps) => {
  const getStatusColor = (status: IPCamera['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'connecting':
        return 'bg-amber-500 animate-pulse';
      case 'offline':
        return 'bg-destructive';
    }
  };

  const getStatusIcon = (status: IPCamera['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-3 h-3 text-emerald-500" />;
      case 'connecting':
        return <Wifi className="w-3 h-3 text-amber-500 animate-pulse" />;
      case 'offline':
        return <WifiOff className="w-3 h-3 text-destructive" />;
    }
  };

  if (cameras.length === 0) {
    return (
      <div className="p-4 text-center">
        <Camera className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No cameras added</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Add an IP camera to get started
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            onClick={() => onSelectCamera(camera.id)}
            className={cn(
              "group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all",
              selectedCameraId === camera.id
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-muted/50 border border-transparent"
            )}
          >
            {/* Thumbnail / Icon */}
            <div className="w-12 h-9 rounded bg-muted/50 border border-border flex items-center justify-center overflow-hidden shrink-0">
              {camera.thumbnail ? (
                <img src={camera.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-4 h-4 text-muted-foreground/50" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{camera.name}</span>
                {getStatusIcon(camera.status)}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                <span className="uppercase">{camera.protocol}</span>
                <span>•</span>
                <span className="truncate">{camera.zone}</span>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Camera
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCamera(camera.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Camera
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
