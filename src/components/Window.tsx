import { useState, useRef, useEffect, useCallback } from "react";
import { X, Minus, Maximize2, Loader2, Minimize2 } from "lucide-react";
import { useWindowSnap, SnapZone } from "@/hooks/useWindowSnap";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onMinimize?: () => void;
  onSnap?: (zone: SnapZone) => void;
  onShake?: () => void;
}

export const Window = ({ title, children, zIndex, onClose, onFocus, onMinimize, onSnap, onShake }: WindowProps) => {
  const [position, setPosition] = useState({ x: 100 + Math.random() * 200, y: 80 + Math.random() * 100 });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [previousState, setPreviousState] = useState<{ position: { x: number; y: number }; size: { width: number; height: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSnapped, setIsSnapped] = useState(false);
  const [currentSnapZone, setCurrentSnapZone] = useState<SnapZone>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Shake detection for Aero Shake
  const shakeRef = useRef<{ positions: { x: number; y: number; time: number }[]; lastShake: number }>({
    positions: [],
    lastShake: 0
  });

  const { handleDragMove, handleDragEnd, getSnapDimensions } = useWindowSnap();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800 + Math.random() * 400);

    return () => clearTimeout(timer);
  }, []);

  // Aero Shake detection
  const detectShake = useCallback((x: number, y: number) => {
    const now = Date.now();
    const positions = shakeRef.current.positions;
    
    // Add current position
    positions.push({ x, y, time: now });
    
    // Keep only last 500ms of positions
    while (positions.length > 0 && now - positions[0].time > 500) {
      positions.shift();
    }
    
    // Need at least 5 positions to detect shake
    if (positions.length < 5) return false;
    
    // Count direction changes
    let directionChanges = 0;
    for (let i = 2; i < positions.length; i++) {
      const prevDx = positions[i - 1].x - positions[i - 2].x;
      const currDx = positions[i].x - positions[i - 1].x;
      if ((prevDx > 0 && currDx < 0) || (prevDx < 0 && currDx > 0)) {
        directionChanges++;
      }
    }
    
    // If 3+ direction changes in 500ms = shake
    if (directionChanges >= 3 && now - shakeRef.current.lastShake > 1000) {
      shakeRef.current.lastShake = now;
      return true;
    }
    
    return false;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    // Reset snap state when starting to drag
    if (isSnapped || isMaximized) {
      // Restore to pre-snap size but keep under cursor
      if (previousState) {
        const cursorRatio = (e.clientX - position.x) / size.width;
        const newX = e.clientX - (previousState.size.width * cursorRatio);
        setDragStart({
          x: previousState.size.width * cursorRatio,
          y: e.clientY - position.y
        });
        setSize(previousState.size);
        setIsMaximized(false);
        setIsSnapped(false);
        setCurrentSnapZone(null);
      }
    }
    
    onFocus();
  };

  // Double-click title bar to maximize
  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    handleMaximize();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
        
        // Detect snap zone
        const zone = handleDragMove(e.clientX, e.clientY);
        setCurrentSnapZone(zone);
        
        // Detect shake (Aero Shake)
        if (detectShake(e.clientX, e.clientY)) {
          onShake?.();
        }
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setSize({
          width: Math.max(400, resizeStart.width + deltaX),
          height: Math.max(300, resizeStart.height + deltaY)
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        // Check if we should snap
        const snapDimensions = handleDragEnd(e.clientX, e.clientY);
        if (snapDimensions) {
          setPreviousState({ position, size });
          setPosition({ x: snapDimensions.x, y: snapDimensions.y });
          setSize({ width: snapDimensions.width, height: snapDimensions.height });
          setIsSnapped(true);
        }
      }
      setIsDragging(false);
      setIsResizing(false);
      setCurrentSnapZone(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, handleDragMove, handleDragEnd, detectShake, onShake, position, size]);

  const handleMaximize = () => {
    if (isMaximized) {
      // Restore
      if (previousState) {
        setPosition(previousState.position);
        setSize(previousState.size);
      }
      setIsMaximized(false);
      setIsSnapped(false);
    } else {
      // Maximize - leave space at TOP for taskbar (48px), cover the bottom
      setPreviousState({ position, size });
      setPosition({ x: 0, y: 48 }); // Start below the top taskbar
      setSize({ width: window.innerWidth, height: window.innerHeight - 48 }); // Full height minus taskbar
      setIsMaximized(true);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setTimeout(() => {
      if (onMinimize) {
        onMinimize();
      }
    }, 150);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMaximized || isSnapped) return; // Can't resize when maximized/snapped
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  return (
    <>
      <div
        ref={windowRef}
        className={`absolute rounded-xl glass-panel shadow-2xl flex flex-col overflow-hidden gpu-accelerated ${
          isMinimized ? 'animate-minimize' : 'animate-scale-in'
        } ${isDragging ? '' : 'transition-all duration-200 ease-spring'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: Math.max(zIndex, 1000),
          transformOrigin: 'bottom center'
        }}
        onMouseDown={onFocus}
      >
        {/* Title Bar */}
        <div
          className="h-12 flex items-center px-3 border-b border-white/5 cursor-move select-none"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleTitleDoubleClick}
        >
          <div className="flex-1 font-bold text-sm truncate">{title}</div>
          <div className="window-controls flex gap-1">
            <button 
              onClick={handleMinimize}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Minimize"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button 
              onClick={handleMaximize}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-destructive/20 text-destructive transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <div className="text-sm text-muted-foreground font-mono">Loading {title}...</div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Resize Handle */}
        {!isMaximized && !isSnapped && (
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group"
          >
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/20 group-hover:border-primary/50 transition-colors" />
          </div>
        )}
      </div>
      
      {/* Snap Zone Indicator (only show when dragging this window) */}
      {isDragging && currentSnapZone && (
        <SnapIndicator zone={currentSnapZone} />
      )}
    </>
  );
};

// Inline snap indicator for this window
const SnapIndicator = ({ zone }: { zone: SnapZone }) => {
  if (!zone) return null;

  const getZoneStyles = () => {
    switch (zone) {
      case "left":
        return "left-1 top-[49px] bottom-1 w-[calc(50%-4px)]";
      case "right":
        return "right-1 top-[49px] bottom-1 w-[calc(50%-4px)]";
      case "top":
        return "left-1 right-1 top-[49px] bottom-1";
      case "top-left":
        return "left-1 top-[49px] w-[calc(50%-4px)] h-[calc(50%-26px)]";
      case "top-right":
        return "right-1 top-[49px] w-[calc(50%-4px)] h-[calc(50%-26px)]";
      case "bottom-left":
        return "left-1 bottom-1 w-[calc(50%-4px)] h-[calc(50%-26px)]";
      case "bottom-right":
        return "right-1 bottom-1 w-[calc(50%-4px)] h-[calc(50%-26px)]";
      default:
        return "";
    }
  };

  return (
    <div
      className={`fixed ${getZoneStyles()} rounded-xl border-2 border-primary/60 bg-primary/15 backdrop-blur-sm z-[9998] pointer-events-none animate-scale-in`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent rounded-xl" />
    </div>
  );
};
