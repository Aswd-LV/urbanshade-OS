import { IPCamera } from "@/hooks/useIPCameras";
import { CameraFeed } from "./CameraFeed";
import { cn } from "@/lib/utils";

type GridLayout = '1x1' | '2x2' | '3x3';

interface CameraGridProps {
  cameras: IPCamera[];
  layout: GridLayout;
  selectedCameraId: string | null;
  onSelectCamera: (id: string) => void;
  onStatusChange?: (id: string, status: IPCamera['status']) => void;
}

export const CameraGrid = ({
  cameras,
  layout,
  selectedCameraId,
  onSelectCamera,
  onStatusChange,
}: CameraGridProps) => {
  const getGridClass = () => {
    switch (layout) {
      case '1x1':
        return 'grid-cols-1 grid-rows-1';
      case '2x2':
        return 'grid-cols-2 grid-rows-2';
      case '3x3':
        return 'grid-cols-3 grid-rows-3';
    }
  };

  const getVisibleCameras = () => {
    const maxCameras = layout === '1x1' ? 1 : layout === '2x2' ? 4 : 9;
    
    if (layout === '1x1') {
      const selected = cameras.find(c => c.id === selectedCameraId);
      return selected ? [selected] : cameras.slice(0, 1);
    }
    
    return cameras.slice(0, maxCameras);
  };

  const visibleCameras = getVisibleCameras();

  return (
    <div className={cn("grid gap-1 h-full w-full bg-muted/20", getGridClass())}>
      {visibleCameras.map((camera) => (
        <div
          key={camera.id}
          onClick={() => onSelectCamera(camera.id)}
          className={cn(
            "relative cursor-pointer transition-all duration-200 overflow-hidden",
            selectedCameraId === camera.id && layout !== '1x1' && "ring-2 ring-primary ring-offset-1 ring-offset-background"
          )}
        >
          <CameraFeed
            camera={camera}
            className="w-full h-full"
            showOverlay={layout === '1x1' || layout === '2x2'}
            onStatusChange={(status) => onStatusChange?.(camera.id, status)}
          />
          
          {/* Quick label for grid views */}
          {layout !== '1x1' && (
            <div className="absolute bottom-1 left-1 z-20">
              <div className="bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium truncate max-w-[120px]">
                {camera.name}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Empty cells */}
      {Array.from({ length: Math.max(0, (layout === '2x2' ? 4 : layout === '3x3' ? 9 : 1) - visibleCameras.length) }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="bg-muted/10 border border-dashed border-border/30 flex items-center justify-center"
        >
          <span className="text-xs text-muted-foreground/40">No camera</span>
        </div>
      ))}
    </div>
  );
};
