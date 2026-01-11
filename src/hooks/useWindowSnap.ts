import { useState, useCallback } from "react";

export type SnapZone = "left" | "right" | "top" | "bottom-left" | "bottom-right" | "top-left" | "top-right" | null;

// Taskbar is at TOP with h-12 (48px) + border, plus some padding
const TASKBAR_HEIGHT = 56;
// Bottom has version info and clock, leave proper margin
const BOTTOM_MARGIN = 80;

export const useWindowSnap = () => {
  const [snapZone, setSnapZone] = useState<SnapZone>(null);
  const EDGE_THRESHOLD = 20;
  const CORNER_SIZE = 100;

  const detectSnapZone = useCallback((x: number, y: number): SnapZone => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Check corners first (relative to usable area)
    if (x <= EDGE_THRESHOLD && y <= TASKBAR_HEIGHT + CORNER_SIZE) return "top-left";
    if (x >= screenWidth - EDGE_THRESHOLD && y <= TASKBAR_HEIGHT + CORNER_SIZE) return "top-right";
    if (x <= EDGE_THRESHOLD && y >= screenHeight - BOTTOM_MARGIN - CORNER_SIZE) return "bottom-left";
    if (x >= screenWidth - EDGE_THRESHOLD && y >= screenHeight - BOTTOM_MARGIN - CORNER_SIZE) return "bottom-right";

    // Check edges
    if (x <= EDGE_THRESHOLD) return "left";
    if (x >= screenWidth - EDGE_THRESHOLD) return "right";
    if (y <= EDGE_THRESHOLD + TASKBAR_HEIGHT) return "top";

    return null;
  }, []);

  const getSnapDimensions = useCallback((zone: SnapZone) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const usableHeight = screenHeight - TASKBAR_HEIGHT - BOTTOM_MARGIN;
    const padding = 8;

    switch (zone) {
      case "left":
        return { 
          x: padding, 
          y: TASKBAR_HEIGHT + padding, 
          width: (screenWidth / 2) - padding * 1.5, 
          height: usableHeight - padding * 2 
        };
      case "right":
        return { 
          x: (screenWidth / 2) + padding / 2, 
          y: TASKBAR_HEIGHT + padding, 
          width: (screenWidth / 2) - padding * 1.5, 
          height: usableHeight - padding * 2 
        };
      case "top":
        return { 
          x: padding, 
          y: TASKBAR_HEIGHT + padding, 
          width: screenWidth - padding * 2, 
          height: usableHeight - padding * 2 
        };
      case "top-left":
        return { 
          x: padding, 
          y: TASKBAR_HEIGHT + padding, 
          width: (screenWidth / 2) - padding * 1.5, 
          height: (usableHeight / 2) - padding * 1.5 
        };
      case "top-right":
        return { 
          x: (screenWidth / 2) + padding / 2, 
          y: TASKBAR_HEIGHT + padding, 
          width: (screenWidth / 2) - padding * 1.5, 
          height: (usableHeight / 2) - padding * 1.5 
        };
      case "bottom-left":
        return { 
          x: padding, 
          y: TASKBAR_HEIGHT + (usableHeight / 2) + padding / 2, 
          width: (screenWidth / 2) - padding * 1.5, 
          height: (usableHeight / 2) - padding * 1.5 
        };
      case "bottom-right":
        return { 
          x: (screenWidth / 2) + padding / 2, 
          y: TASKBAR_HEIGHT + (usableHeight / 2) + padding / 2, 
          width: (screenWidth / 2) - padding * 1.5, 
          height: (usableHeight / 2) - padding * 1.5 
        };
      default:
        return null;
    }
  }, []);

  const handleDragMove = useCallback((x: number, y: number) => {
    const zone = detectSnapZone(x, y);
    setSnapZone(zone);
    return zone;
  }, [detectSnapZone]);

  const handleDragEnd = useCallback((x: number, y: number) => {
    const zone = detectSnapZone(x, y);
    setSnapZone(null);
    return zone ? getSnapDimensions(zone) : null;
  }, [detectSnapZone, getSnapDimensions]);

  const clearSnapZone = useCallback(() => {
    setSnapZone(null);
  }, []);

  return {
    snapZone,
    handleDragMove,
    handleDragEnd,
    clearSnapZone,
    getSnapDimensions
  };
};
