import { useState, useCallback, useEffect } from "react";

interface GridPosition {
  x: number;
  y: number;
}

interface IconPosition {
  id: string;
  position: GridPosition;
}

const GRID_SIZE = 90; // Grid cell size in pixels
const TASKBAR_HEIGHT = 56; // Height of taskbar
const ICON_MARGIN = 8; // Margin around icons

export const useDesktopGrid = () => {
  const [iconPositions, setIconPositions] = useState<IconPosition[]>(() => {
    const saved = localStorage.getItem('desktop_icon_positions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save positions to localStorage
  useEffect(() => {
    localStorage.setItem('desktop_icon_positions', JSON.stringify(iconPositions));
  }, [iconPositions]);

  // Snap coordinates to grid
  const snapToGrid = useCallback((x: number, y: number): GridPosition => {
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE + ICON_MARGIN;
    const snappedY = Math.max(
      TASKBAR_HEIGHT + ICON_MARGIN,
      Math.round((y - TASKBAR_HEIGHT) / GRID_SIZE) * GRID_SIZE + TASKBAR_HEIGHT + ICON_MARGIN
    );
    return { x: snappedX, y: snappedY };
  }, []);

  // Check if position is occupied
  const isPositionOccupied = useCallback((position: GridPosition, excludeId?: string): boolean => {
    return iconPositions.some(icon => 
      icon.id !== excludeId && 
      icon.position.x === position.x && 
      icon.position.y === position.y
    );
  }, [iconPositions]);

  // Find nearest free position
  const findNearestFreePosition = useCallback((targetPos: GridPosition, excludeId?: string): GridPosition => {
    if (!isPositionOccupied(targetPos, excludeId)) {
      return targetPos;
    }

    // Spiral outward to find free position
    const maxRadius = 10;
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          
          const checkPos: GridPosition = {
            x: targetPos.x + dx * GRID_SIZE,
            y: targetPos.y + dy * GRID_SIZE
          };
          
          // Make sure we're within bounds
          if (checkPos.x < ICON_MARGIN || checkPos.y < TASKBAR_HEIGHT + ICON_MARGIN) continue;
          
          if (!isPositionOccupied(checkPos, excludeId)) {
            return checkPos;
          }
        }
      }
    }
    
    return targetPos; // Fallback
  }, [isPositionOccupied]);

  // Get position for icon
  const getIconPosition = useCallback((iconId: string): GridPosition | undefined => {
    return iconPositions.find(p => p.id === iconId)?.position;
  }, [iconPositions]);

  // Set position for icon
  const setIconPosition = useCallback((iconId: string, x: number, y: number) => {
    const snapped = snapToGrid(x, y);
    const finalPos = findNearestFreePosition(snapped, iconId);
    
    setIconPositions(prev => {
      const existing = prev.find(p => p.id === iconId);
      if (existing) {
        return prev.map(p => p.id === iconId ? { ...p, position: finalPos } : p);
      }
      return [...prev, { id: iconId, position: finalPos }];
    });
    
    return finalPos;
  }, [snapToGrid, findNearestFreePosition]);

  // Initialize positions for new icons
  const initializeIconPosition = useCallback((iconId: string, index: number) => {
    const existing = iconPositions.find(p => p.id === iconId);
    if (existing) return existing.position;

    // Calculate grid position based on index
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const maxRows = Math.floor((viewportHeight - TASKBAR_HEIGHT - ICON_MARGIN * 2) / GRID_SIZE);
    
    const col = Math.floor(index / maxRows);
    const row = index % maxRows;
    
    const position: GridPosition = {
      x: col * GRID_SIZE + ICON_MARGIN,
      y: row * GRID_SIZE + TASKBAR_HEIGHT + ICON_MARGIN
    };
    
    const finalPos = findNearestFreePosition(position, iconId);
    
    setIconPositions(prev => [...prev, { id: iconId, position: finalPos }]);
    
    return finalPos;
  }, [iconPositions, findNearestFreePosition]);

  // Reset all positions
  const resetPositions = useCallback(() => {
    setIconPositions([]);
    localStorage.removeItem('desktop_icon_positions');
  }, []);

  return {
    getIconPosition,
    setIconPosition,
    initializeIconPosition,
    resetPositions,
    snapToGrid,
    gridSize: GRID_SIZE
  };
};
