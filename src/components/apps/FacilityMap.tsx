import { useState, useEffect, useRef, useCallback } from "react";
import { 
  MapPin, ZoomIn, ZoomOut, RotateCcw, Layers, Search, 
  Skull, Shield, Zap, Camera, AlertTriangle, CheckCircle,
  ChevronRight, X, Users, FlaskConical, HardHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ZoneType = "light" | "heavy" | "entrance" | "surface";

interface Room {
  id: string;
  name: string;
  shortName: string;
  zone: ZoneType;
  status: "operational" | "warning" | "critical" | "offline";
  x: number;
  y: number;
  width: number;
  height: number;
  connections: string[];
  special?: "scp" | "checkpoint" | "elevator" | "tesla" | "nuke" | "servers" | "microhid";
  hasCamera?: boolean;
}

interface Zone {
  id: ZoneType;
  name: string;
  color: string;
  bgGradient: string;
}

const ZONES: Zone[] = [
  { 
    id: "surface", 
    name: "Surface Zone", 
    color: "emerald",
    bgGradient: "from-emerald-500/10 to-emerald-500/5"
  },
  { 
    id: "entrance", 
    name: "Entrance Zone", 
    color: "blue",
    bgGradient: "from-blue-500/10 to-blue-500/5"
  },
  { 
    id: "light", 
    name: "Light Containment", 
    color: "amber",
    bgGradient: "from-amber-500/10 to-amber-500/5"
  },
  { 
    id: "heavy", 
    name: "Heavy Containment", 
    color: "red",
    bgGradient: "from-red-500/10 to-red-500/5"
  },
];

const ROOMS: Room[] = [
  // Heavy Containment
  { id: "hcz-049", name: "SCP-049 Containment", shortName: "SCP-049", zone: "heavy", status: "operational", x: 80, y: 80, width: 100, height: 70, connections: ["hcz-corridor-1"], special: "scp", hasCamera: true },
  { id: "hcz-106", name: "SCP-106 Containment", shortName: "SCP-106", zone: "heavy", status: "critical", x: 220, y: 80, width: 100, height: 70, connections: ["hcz-corridor-1", "hcz-corridor-2"], special: "scp", hasCamera: true },
  { id: "hcz-079", name: "SCP-079 Containment", shortName: "SCP-079", zone: "heavy", status: "operational", x: 360, y: 80, width: 100, height: 70, connections: ["hcz-corridor-2"], special: "scp", hasCamera: true },
  { id: "hcz-096", name: "SCP-096 Containment", shortName: "SCP-096", zone: "heavy", status: "warning", x: 500, y: 80, width: 100, height: 70, connections: ["hcz-corridor-3"], special: "scp", hasCamera: true },
  { id: "hcz-corridor-1", name: "HCZ Corridor Alpha", shortName: "CORRIDOR A", zone: "heavy", status: "operational", x: 80, y: 170, width: 240, height: 35, connections: ["hcz-049", "hcz-106", "hcz-tesla"] },
  { id: "hcz-corridor-2", name: "HCZ Corridor Beta", shortName: "CORRIDOR B", zone: "heavy", status: "operational", x: 220, y: 225, width: 240, height: 35, connections: ["hcz-106", "hcz-079", "hcz-nuke"] },
  { id: "hcz-corridor-3", name: "HCZ Corridor Gamma", shortName: "CORRIDOR G", zone: "heavy", status: "operational", x: 400, y: 170, width: 200, height: 35, connections: ["hcz-079", "hcz-096", "hcz-servers"] },
  { id: "hcz-tesla", name: "Tesla Gate", shortName: "TESLA", zone: "heavy", status: "operational", x: 80, y: 280, width: 80, height: 55, connections: ["hcz-corridor-1", "hcz-elev-a"], special: "tesla" },
  { id: "hcz-nuke", name: "Alpha Warhead", shortName: "NUKE", zone: "heavy", status: "offline", x: 280, y: 280, width: 100, height: 55, connections: ["hcz-corridor-2"], special: "nuke" },
  { id: "hcz-servers", name: "Server Room", shortName: "SERVERS", zone: "heavy", status: "operational", x: 460, y: 280, width: 100, height: 55, connections: ["hcz-corridor-3"], special: "servers", hasCamera: true },
  { id: "hcz-microhid", name: "Micro H.I.D. Storage", shortName: "MICROHID", zone: "heavy", status: "operational", x: 460, y: 355, width: 100, height: 55, connections: ["hcz-servers"], special: "microhid" },
  { id: "hcz-elev-a", name: "Elevator System A", shortName: "ELEV A", zone: "heavy", status: "operational", x: 80, y: 355, width: 80, height: 55, connections: ["hcz-tesla"], special: "elevator" },
  { id: "hcz-elev-b", name: "Elevator System B", shortName: "ELEV B", zone: "heavy", status: "operational", x: 280, y: 355, width: 80, height: 55, connections: ["hcz-nuke"], special: "elevator" },
  { id: "hcz-checkpoint", name: "HCZ/EZ Checkpoint", shortName: "CHECKPOINT", zone: "heavy", status: "operational", x: 180, y: 430, width: 180, height: 45, connections: ["hcz-elev-a", "hcz-elev-b"], special: "checkpoint", hasCamera: true },
  // Light Containment
  { id: "lcz-173", name: "SCP-173 Containment", shortName: "SCP-173", zone: "light", status: "operational", x: 80, y: 80, width: 100, height: 70, connections: ["lcz-corridor-1"], special: "scp", hasCamera: true },
  { id: "lcz-914", name: "SCP-914", shortName: "SCP-914", zone: "light", status: "operational", x: 220, y: 80, width: 100, height: 70, connections: ["lcz-corridor-1"], special: "scp", hasCamera: true },
  { id: "lcz-corridor-1", name: "LCZ Corridor", shortName: "CORRIDOR", zone: "light", status: "operational", x: 80, y: 170, width: 340, height: 35, connections: ["lcz-173", "lcz-914", "lcz-armory"] },
  { id: "lcz-armory", name: "LCZ Armory", shortName: "ARMORY", zone: "light", status: "operational", x: 420, y: 150, width: 100, height: 70, connections: ["lcz-corridor-1"], hasCamera: true },
  { id: "lcz-checkpoint", name: "LCZ/HCZ Checkpoint", shortName: "CHECKPOINT", zone: "light", status: "operational", x: 180, y: 250, width: 180, height: 45, connections: ["lcz-corridor-1"], special: "checkpoint", hasCamera: true },
  // Entrance Zone
  { id: "ez-gate-a", name: "Gate A", shortName: "GATE A", zone: "entrance", status: "operational", x: 80, y: 80, width: 110, height: 70, connections: ["ez-corridor"], special: "checkpoint", hasCamera: true },
  { id: "ez-gate-b", name: "Gate B", shortName: "GATE B", zone: "entrance", status: "operational", x: 450, y: 80, width: 110, height: 70, connections: ["ez-corridor"], special: "checkpoint", hasCamera: true },
  { id: "ez-corridor", name: "EZ Main Corridor", shortName: "CORRIDOR", zone: "entrance", status: "operational", x: 80, y: 170, width: 480, height: 35, connections: ["ez-gate-a", "ez-gate-b", "ez-intercom"] },
  { id: "ez-intercom", name: "Intercom Room", shortName: "INTERCOM", zone: "entrance", status: "operational", x: 270, y: 230, width: 100, height: 55, connections: ["ez-corridor"], hasCamera: true },
  // Surface
  { id: "surf-helipad", name: "Helipad", shortName: "HELIPAD", zone: "surface", status: "operational", x: 180, y: 80, width: 140, height: 90, connections: ["surf-exit"], hasCamera: true },
  { id: "surf-exit", name: "Facility Exit", shortName: "EXIT", zone: "surface", status: "operational", x: 270, y: 200, width: 100, height: 55, connections: ["surf-helipad", "surf-escape"], special: "checkpoint" },
  { id: "surf-escape", name: "Escape Route", shortName: "ESCAPE", zone: "surface", status: "operational", x: 270, y: 280, width: 100, height: 55, connections: ["surf-exit"] },
];

export const FacilityMap = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneType>("heavy");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  const currentZone = ZONES.find(z => z.id === selectedZone)!;
  const currentRooms = ROOMS.filter(r => r.zone === selectedZone);
  const filteredRooms = searchQuery
    ? currentRooms.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.shortName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentRooms;

  // Zoom controls
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2.5, prev + delta)));
  }, []);

  // Pan controls
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  }, [pan]);

  const handlePanMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handlePanEnd = useCallback(() => setIsPanning(false), []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Get status styling
  const getStatusStyles = (status: Room['status']) => {
    switch (status) {
      case "operational":
        return {
          border: "border-emerald-500/40",
          bg: "bg-emerald-500/10",
          glow: "shadow-emerald-500/20",
          text: "text-emerald-400"
        };
      case "warning":
        return {
          border: "border-amber-500/50",
          bg: "bg-amber-500/15",
          glow: "shadow-amber-500/30",
          text: "text-amber-400"
        };
      case "critical":
        return {
          border: "border-destructive/60",
          bg: "bg-destructive/20",
          glow: "shadow-destructive/40",
          text: "text-destructive"
        };
      case "offline":
        return {
          border: "border-muted-foreground/30",
          bg: "bg-muted/20",
          glow: "",
          text: "text-muted-foreground"
        };
    }
  };

  const getSpecialIcon = (special?: Room['special']) => {
    switch (special) {
      case "scp": return <Skull className="w-3.5 h-3.5" />;
      case "checkpoint": return <Shield className="w-3.5 h-3.5" />;
      case "elevator": return <span className="text-xs font-bold">▲▼</span>;
      case "tesla": return <Zap className="w-3.5 h-3.5" />;
      case "nuke": return <span className="text-xs">☢</span>;
      case "servers": return <span className="text-xs">◈</span>;
      case "microhid": return <Zap className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  // Render connection lines
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    const processed = new Set<string>();

    filteredRooms.forEach(room => {
      room.connections.forEach(connId => {
        const connRoom = filteredRooms.find(r => r.id === connId);
        if (connRoom) {
          const key = [room.id, connRoom.id].sort().join("-");
          if (!processed.has(key)) {
            processed.add(key);
            connections.push(
              <line
                key={key}
                x1={room.x + room.width / 2}
                y1={room.y + room.height / 2}
                x2={connRoom.x + connRoom.width / 2}
                y2={connRoom.y + connRoom.height / 2}
                stroke="hsl(var(--primary) / 0.15)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="transition-all duration-300"
              />
            );
          }
        }
      });
    });
    return connections;
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setShowSidebar(true);
  };

  const handleCameraClick = (room: Room) => {
    toast.info(`Opening camera: ${room.name}`);
    // In a real implementation, this would navigate to SecurityCameras with the room selected
  };

  return (
    <div className="flex h-full bg-background font-mono relative overflow-hidden">
      {/* Main Map Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-4">
          {/* Zone selector */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            {ZONES.map(zone => (
              <button
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone.id);
                  setSelectedRoom(null);
                  resetView();
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  selectedZone === zone.id
                    ? `bg-${zone.color}-500/20 text-${zone.color}-400 border border-${zone.color}-500/30`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                style={{
                  backgroundColor: selectedZone === zone.id ? `hsl(var(--${zone.color === 'red' ? 'destructive' : zone.color === 'emerald' ? 'primary' : zone.color === 'amber' ? 'warning' : 'primary'}) / 0.15)` : undefined,
                }}
              >
                {zone.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-border"
            />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleZoom(0.2)} 
              className="h-7 w-7 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleZoom(-0.2)} 
              className="h-7 w-7 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="w-px h-5 bg-border mx-1" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetView} 
              className="h-7 w-7 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Sidebar toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="h-8"
          >
            <Layers className="w-4 h-4 mr-2" />
            Details
          </Button>
        </div>

        {/* Map Canvas */}
        <div 
          ref={mapRef}
          className={cn(
            "flex-1 overflow-hidden relative",
            `bg-gradient-to-br ${currentZone.bgGradient}`
          )}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onContextMenu={(e) => e.preventDefault()}
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate(${pan.x % 50}px, ${pan.y % 50}px)`
            }}
          />

          {/* Map content */}
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
              transition: isPanning ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* Connections SVG */}
            <svg 
              className="absolute pointer-events-none" 
              style={{ width: '700px', height: '550px' }}
            >
              {renderConnections()}
            </svg>

            {/* Rooms */}
            {filteredRooms.map((room) => {
              const styles = getStatusStyles(room.status);
              const isSelected = selectedRoom?.id === room.id;
              const isHovered = hoveredRoom?.id === room.id;

              return (
                <div
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  onMouseEnter={() => setHoveredRoom(room)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  className={cn(
                    "absolute cursor-pointer transition-all duration-200 rounded-lg border-2 backdrop-blur-sm",
                    styles.border,
                    styles.bg,
                    isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    isHovered && !isSelected && `shadow-lg ${styles.glow}`,
                    "hover:scale-[1.02]"
                  )}
                  style={{
                    left: room.x,
                    top: room.y,
                    width: room.width,
                    height: room.height,
                  }}
                >
                  {/* Room content */}
                  <div className="p-2 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-1">
                      <span className={cn(
                        "text-[10px] font-bold tracking-wide truncate",
                        styles.text
                      )}>
                        {room.shortName}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {room.special && (
                          <span className={styles.text}>
                            {getSpecialIcon(room.special)}
                          </span>
                        )}
                        {room.hasCamera && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCameraClick(room);
                            }}
                            className="p-0.5 rounded hover:bg-primary/20 transition-colors"
                          >
                            <Camera className="w-3 h-3 text-primary" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        room.status === 'operational' && "bg-emerald-500",
                        room.status === 'warning' && "bg-amber-500 animate-pulse",
                        room.status === 'critical' && "bg-destructive animate-pulse",
                        room.status === 'offline' && "bg-muted-foreground"
                      )} />
                      <span className="text-[8px] uppercase text-muted-foreground tracking-wider">
                        {room.status}
                      </span>
                    </div>
                  </div>

                  {/* Critical/Warning pulse effect */}
                  {(room.status === 'critical' || room.status === 'warning') && (
                    <div className={cn(
                      "absolute inset-0 rounded-lg animate-pulse pointer-events-none",
                      room.status === 'critical' ? "bg-destructive/10" : "bg-amber-500/10"
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Zone info overlay */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
              Active Zone
            </div>
            <div className="text-sm font-bold">{currentZone.name}</div>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{filteredRooms.length} rooms</span>
              <span>•</span>
              <span className="text-emerald-400">
                {filteredRooms.filter(r => r.status === 'operational').length} operational
              </span>
              {filteredRooms.some(r => r.status === 'critical') && (
                <>
                  <span>•</span>
                  <span className="text-destructive">
                    {filteredRooms.filter(r => r.status === 'critical').length} critical
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      {showSidebar && (
        <div className="w-72 border-l border-border bg-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Room Details</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedRoom ? selectedRoom.name : 'Select a room'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {selectedRoom ? (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Status card */}
                <div className={cn(
                  "rounded-lg border p-4",
                  getStatusStyles(selectedRoom.status).border,
                  getStatusStyles(selectedRoom.status).bg
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedRoom.status === 'operational' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    {selectedRoom.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {selectedRoom.status === 'critical' && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    <span className={cn("text-sm font-medium uppercase", getStatusStyles(selectedRoom.status).text)}>
                      {selectedRoom.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedRoom.status === 'operational' && 'All systems functioning normally'}
                    {selectedRoom.status === 'warning' && 'Anomalous activity detected'}
                    {selectedRoom.status === 'critical' && 'Immediate attention required'}
                    {selectedRoom.status === 'offline' && 'Systems currently offline'}
                  </p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Zone</div>
                    <div className="text-sm font-medium">{currentZone.name}</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Type</div>
                    <div className="text-sm font-medium capitalize">
                      {selectedRoom.special || 'Standard'}
                    </div>
                  </div>
                </div>

                {/* Camera access */}
                {selectedRoom.hasCamera && (
                  <Button 
                    className="w-full gap-2" 
                    variant="outline"
                    onClick={() => handleCameraClick(selectedRoom)}
                  >
                    <Camera className="w-4 h-4" />
                    View Camera Feed
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                )}

                {/* Connections */}
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Connected Rooms
                  </div>
                  <div className="space-y-1">
                    {selectedRoom.connections.map(connId => {
                      const connRoom = ROOMS.find(r => r.id === connId);
                      if (!connRoom) return null;
                      return (
                        <button
                          key={connId}
                          onClick={() => setSelectedRoom(connRoom)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                        >
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm truncate">{connRoom.shortName}</span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Click on a room to view details</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="p-4 border-t border-border">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Legend</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span>Offline</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
