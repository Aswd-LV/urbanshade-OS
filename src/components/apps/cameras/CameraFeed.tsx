import { useState, useEffect, useRef } from "react";
import { Camera, WifiOff, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { IPCamera } from "@/hooks/useIPCameras";
import { cn } from "@/lib/utils";

interface CameraFeedProps {
  camera: IPCamera | null;
  className?: string;
  showOverlay?: boolean;
  onStatusChange?: (status: IPCamera['status']) => void;
}

export const CameraFeed = ({ camera, className, showOverlay = true, onStatusChange }: CameraFeedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Auto-refresh for image protocol
  useEffect(() => {
    if (camera?.protocol === 'image' && camera.refreshInterval) {
      const interval = setInterval(() => {
        setImageKey(prev => prev + 1);
      }, camera.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [camera?.protocol, camera?.refreshInterval]);

  // Reset states when camera changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [camera?.id, camera?.url]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onStatusChange?.('online');
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onStatusChange?.('offline');
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setImageKey(prev => prev + 1);
  };

  if (!camera) {
    return (
      <div className={cn("relative bg-muted/30 flex items-center justify-center", className)}>
        <div className="text-center text-muted-foreground">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No camera selected</p>
        </div>
      </div>
    );
  }

  // Simulated camera - show blueprint visualization
  if (camera.protocol === 'simulated') {
    return (
      <div className={cn("relative bg-muted/20 overflow-hidden", className)}>
        <SimulatedFeed camera={camera} />
        {showOverlay && <CameraOverlay camera={camera} />}
      </div>
    );
  }

  // Build the image URL with cache busting for image protocol
  const imageUrl = camera.protocol === 'image' 
    ? `${camera.url}${camera.url.includes('?') ? '&' : '?'}_t=${imageKey}`
    : camera.url;

  return (
    <div className={cn("relative bg-black overflow-hidden", className)}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <div className="text-center">
            <WifiOff className="w-12 h-12 mx-auto mb-2 text-destructive/60" />
            <p className="text-sm text-muted-foreground mb-2">Connection failed</p>
            <button 
              onClick={handleRetry}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded transition-colors mx-auto"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Camera feed */}
      {(camera.protocol === 'mjpeg' || camera.protocol === 'image') && (
        <img
          ref={imgRef}
          key={imageKey}
          src={imageUrl}
          alt={camera.name}
          className={cn(
            "w-full h-full object-contain transition-opacity",
            isLoading || hasError ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* HLS would require additional library support */}
      {camera.protocol === 'hls' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-sm">HLS streaming requires additional setup</p>
            <p className="text-xs opacity-60 mt-1">Use MJPEG or Image mode for best compatibility</p>
          </div>
        </div>
      )}

      {showOverlay && <CameraOverlay camera={camera} />}
    </div>
  );
};

// Simulated feed component with blueprint aesthetic
const SimulatedFeed = ({ camera }: { camera: IPCamera }) => {
  const [scanLineY, setScanLineY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLineY(prev => (prev + 0.5) % 100);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {/* Blueprint grid */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.4) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Scanline */}
      <div 
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none"
        style={{ top: `${scanLineY}%` }}
      />

      {/* Room visualization */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-xl max-h-80 border border-primary/20 rounded-lg">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/50 rounded-tl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary/50 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary/50 rounded-bl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/50 rounded-br" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/15">
            <Camera className="w-20 h-20" />
          </div>

          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/60 font-mono">
            SIMULATED FEED
          </div>
        </div>
      </div>
    </div>
  );
};

// Camera overlay with info
const CameraOverlay = ({ camera }: { camera: IPCamera }) => {
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameCount(prev => prev + 1);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + 
    ':' + String(frameCount % 30).padStart(2, '0');

  return (
    <>
      {/* Top left - camera info */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-background/80 backdrop-blur-sm border border-border px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{camera.name}</span>
            <div className={cn(
              "w-2 h-2 rounded-full",
              camera.status === 'online' ? "bg-emerald-500" :
              camera.status === 'connecting' ? "bg-amber-500 animate-pulse" :
              "bg-destructive"
            )} />
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {camera.zone} • {camera.protocol.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Top right - REC indicator */}
      {camera.status === 'online' && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-background/80 backdrop-blur-sm border border-destructive/40 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-destructive text-xs font-bold tracking-wider">REC</span>
          </div>
        </div>
      )}

      {/* Bottom left - timestamp */}
      <div className="absolute bottom-3 left-3 z-20">
        <div className="bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg">
          <span className="text-xs font-mono text-muted-foreground">{timestamp}</span>
        </div>
      </div>
    </>
  );
};
