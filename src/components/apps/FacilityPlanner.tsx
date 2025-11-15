import { useState, useEffect, useRef } from "react";
import { Grid3x3, Plus, Trash2, Move, Save, FolderOpen, Settings as SettingsIcon, Route, Pen, Eraser, Square, ZoomIn, ZoomOut, Maximize2, Link } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";
import { RoomEditor } from "./RoomEditor";
import { HallwayTool } from "./HallwayTool";
import { RoomProperties } from "./RoomProperties";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PlannerRoom {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sections: any[];
  doors: any[];
  connections: string[];
}

interface HallwayPoint {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface HallwaySettings {
  autoGenerate: boolean;
  hallwayWidth: number;
}

export const FacilityPlanner = () => {
  const [rooms, setRooms] = useState<PlannerRoom[]>(() => loadState('facility_planner_rooms', []));
  const [editingRoom, setEditingRoom] = useState<PlannerRoom | null>(null);
  const [hallwayMode, setHallwayMode] = useState(false);
  const [hallwayPoints, setHallwayPoints] = useState<HallwayPoint[]>([]);
  const [clickCount, setClickCount] = useState<{ [key: string]: number }>({});
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(() => loadState('facility_planner_snap', true));
  const [showConnections, setShowConnections] = useState(() => loadState('facility_planner_connections', true));
  const [selectedRoomForConnect, setSelectedRoomForConnect] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [placingRoomType, setPlacingRoomType] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [draggingRoom, setDraggingRoom] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, roomX: 0, roomY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toast.info("Facility Planner - BETA", {
      description: "This feature is in beta. Some features may be unstable.",
      duration: 5000,
    });
  }, []);

  useEffect(() => {
    saveState('facility_planner_rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    saveState('facility_planner_snap', snapToGrid);
  }, [snapToGrid]);

  useEffect(() => {
    saveState('facility_planner_connections', showConnections);
  }, [showConnections]);

  const snapValue = (val: number) => snapToGrid ? Math.round(val / 20) * 20 : val;

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const toggleConnection = (roomId: string) => {
    if (!selectedRoomForConnect) {
      setSelectedRoomForConnect(roomId);
      toast.info("Select another room to connect");
    } else {
      if (selectedRoomForConnect === roomId) {
        setSelectedRoomForConnect(null);
        return;
      }
      setRooms(rooms.map(r => {
        if (r.id === selectedRoomForConnect && !r.connections.includes(roomId)) {
          return { ...r, connections: [...r.connections, roomId] };
        }
        if (r.id === roomId && !r.connections.includes(selectedRoomForConnect)) {
          return { ...r, connections: [...r.connections, selectedRoomForConnect] };
        }
        return r;
      }));
      setSelectedRoomForConnect(null);
      toast.success("Rooms connected");
    }
  };

  const handleRoomClick = (room: PlannerRoom, e: React.MouseEvent) => {
    if (draggingRoom) return;
    setSelectedRoomId(room.id);
    const key = room.id;
    const count = (clickCount[key] || 0) + 1;
    setClickCount({ ...clickCount, [key]: count });
    if (count === 2) {
      setEditingRoom(room);
      setClickCount({});
      setSelectedRoomId(null);
    }
    setTimeout(() => setClickCount(prev => ({ ...prev, [key]: 0 })), 500);
  };

  const handleRoomDragStart = (room: PlannerRoom, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingRoom(room.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      roomX: room.x,
      roomY: room.y,
    });
  };

  const handleRoomDrag = (e: React.MouseEvent) => {
    if (!draggingRoom) return;
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    setRooms(rooms.map(r => 
      r.id === draggingRoom 
        ? { ...r, x: snapValue(dragStart.roomX + dx), y: snapValue(dragStart.roomY + dy) }
        : r
    ));
  };

  const handleRoomDragEnd = () => {
    setDraggingRoom(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hallwayMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = snapValue((e.clientX - rect.left - pan.x) / zoom);
      const y = snapValue((e.clientY - rect.top - pan.y) / zoom);
      setHallwayPoints([...hallwayPoints, { x, y }]);
      return;
    }
    
    if (placingRoomType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = snapValue((e.clientX - rect.left - pan.x) / zoom);
      const y = snapValue((e.clientY - rect.top - pan.y) / zoom);
      setRooms([...rooms, {
        id: `room-${Date.now()}`,
        name: `${placingRoomType} ${rooms.length + 1}`,
        type: placingRoomType,
        x,
        y,
        width: 120,
        height: 80,
        sections: [],
        doors: [],
        connections: []
      }]);
      setPlacingRoomType(null);
      toast.success("Room placed - double-click to edit");
      return;
    }
    
    setSelectedRoomId(null);
  };

  const completeHallway = () => {
    if (hallwayPoints.length < 2) return toast.error("Need at least 2 points");
    for (let i = 0; i < hallwayPoints.length - 1; i++) {
      const [p1, p2] = [hallwayPoints[i], hallwayPoints[i + 1]];
      setRooms(prev => [...prev, {
        id: `hallway-${Date.now()}-${i}`, name: "Hallway", type: "corridor",
        x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y),
        width: Math.abs(p2.x - p1.x) || 40, height: Math.abs(p2.y - p1.y) || 40,
        sections: [], doors: [], connections: []
      }]);
    }
    setHallwayPoints([]);
    setHallwayMode(false);
    toast.success("Hallway created");
  };

  const addRoom = (type: string) => {
    setPlacingRoomType(type);
    toast.info("Click on canvas to place room");
  };

  const selectedRoom = selectedRoomId ? rooms.find(r => r.id === selectedRoomId) : null;

  const getRoomCenter = (room: PlannerRoom) => ({
    x: room.x + room.width / 2,
    y: room.y + room.height / 2
  });

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex gap-2 flex-wrap items-center">
        <Select value={placingRoomType || ""} onValueChange={addRoom}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Add Room..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="control">Control Room</SelectItem>
            <SelectItem value="research">Research Lab</SelectItem>
            <SelectItem value="containment">Containment Cell</SelectItem>
            <SelectItem value="storage">Storage</SelectItem>
            <SelectItem value="medical">Medical Bay</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="laboratory">Laboratory</SelectItem>
            <SelectItem value="observation">Observation</SelectItem>
            <SelectItem value="decontamination">Decontamination</SelectItem>
            <SelectItem value="custom">Custom Room</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setHallwayMode(true); toast.info("Click points to create hallway"); }} size="sm" variant={hallwayMode ? "default" : "outline"}>
          <Route className="w-4 h-4 mr-1" />Hallway Tool
        </Button>
        <div className="h-6 w-px bg-border mx-2" />
        <Button onClick={() => handleZoom(0.1)} size="sm" variant="outline"><ZoomIn className="w-4 h-4" /></Button>
        <Button onClick={() => handleZoom(-0.1)} size="sm" variant="outline"><ZoomOut className="w-4 h-4" /></Button>
        <Button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} size="sm" variant="outline"><Maximize2 className="w-4 h-4" /></Button>
        <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
        <div className="h-6 w-px bg-border mx-2" />
        <div className="flex items-center gap-2">
          <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} id="snap" />
          <Label htmlFor="snap" className="text-xs cursor-pointer">Snap to Grid</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={showConnections} onCheckedChange={setShowConnections} id="connections" />
          <Label htmlFor="connections" className="text-xs cursor-pointer">Show Connections</Label>
        </div>
        <Button onClick={() => setSettingsOpen(true)} size="sm" variant="outline">
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </div>
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden" 
        style={{ 
          background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, hsl(var(--border)) 19px, hsl(var(--border)) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, hsl(var(--border)) 19px, hsl(var(--border)) 20px)',
          cursor: placingRoomType ? 'crosshair' : isPanning ? 'grabbing' : 'grab'
        }} 
        onClick={handleCanvasClick}
        onMouseDown={handlePanStart}
        onMouseMove={(e) => { handlePanMove(e); handleRoomDrag(e); }}
        onMouseUp={() => { handlePanEnd(); handleRoomDragEnd(); }}
        onMouseLeave={() => { handlePanEnd(); handleRoomDragEnd(); }}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
          {showConnections && rooms.map(room => 
            room.connections.map(connId => {
              const targetRoom = rooms.find(r => r.id === connId);
              if (!targetRoom || connId < room.id) return null;
              const c1 = getRoomCenter(room);
              const c2 = getRoomCenter(targetRoom);
              return (
                <svg key={`${room.id}-${connId}`} className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <line x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                </svg>
              );
            })
          )}
          {rooms.map(room => (
            <div 
              key={room.id} 
              className={`absolute border-2 cursor-move transition-colors ${
                selectedRoomId === room.id ? 'border-accent bg-accent/30' : 
                selectedRoomForConnect === room.id ? 'border-accent bg-accent/20' : 
                'border-primary bg-primary/10 hover:bg-primary/20'
              }`}
              style={{ left: room.x, top: room.y, width: room.width, height: room.height }}
              onClick={(e) => { e.stopPropagation(); handleRoomClick(room, e); }}
              onMouseDown={(e) => { e.stopPropagation(); handleRoomDragStart(room, e); }}
              onContextMenu={(e) => { e.preventDefault(); toggleConnection(room.id); }}
            >
              <div className="p-2 text-xs font-semibold">{room.name}</div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); toggleConnection(room.id); }}
              >
                <Link className="w-3 h-3" />
              </Button>
            </div>
          ))}
          {hallwayPoints.map((point, i) => (
            <div key={i} className="absolute w-3 h-3 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" style={{ left: point.x, top: point.y }} />
          ))}
        </div>
      </div>
      
      {hallwayMode && <HallwayTool points={hallwayPoints} onAddPoint={() => {}} onComplete={completeHallway} onCancel={() => { setHallwayMode(false); setHallwayPoints([]); }} />}
      
      <RoomEditor 
        room={editingRoom} 
        open={!!editingRoom} 
        onClose={() => setEditingRoom(null)} 
        onSave={(updated) => setRooms(rooms.map(r => r.id === updated.id ? updated : r))} 
      />

      <RoomProperties
        room={selectedRoom}
        onClose={() => setSelectedRoomId(null)}
        onChange={(updates) => {
          if (selectedRoomId) {
            setRooms(rooms.map(r => r.id === selectedRoomId ? { ...r, ...updates } : r));
          }
        }}
      />

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Facility Planner Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Snap to Grid</Label>
              <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Connections</Label>
              <Switch checked={showConnections} onCheckedChange={setShowConnections} />
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Beta Features:</strong> Custom room shapes, advanced door placement, and multi-section rooms are currently in development.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
