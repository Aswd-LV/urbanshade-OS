import { useState, useEffect, useRef } from "react";
import { MapPin, AlertTriangle, CheckCircle, XCircle, Users, Crosshair, ZoomIn, ZoomOut, RotateCcw, Move, Download, Skull, Shield, FlaskConical, HardHat, Zap, Radio, Eye, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CRTEffect } from "@/components/shared/CRTEffect";
import { PowerMeter } from "@/components/shared/PowerMeter";
import { RadarScanner } from "@/components/shared/RadarScanner";
import { GlitchText } from "@/components/shared/GlitchText";
import { cn } from "@/lib/utils";

type ZoneType = "light" | "heavy" | "entrance" | "surface";
type TeamId = "exrP" | "scientists" | "foundation" | "chaos";

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
}

interface PersonnelStats {
  scps: number;
  mtf: number;
  scientists: number;
  exrP: number;
  mrP: number;
  chaos: number;
}

export const FacilityMap = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneType>("heavy");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [entityEscaped, setEntityEscaped] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 400, y: 300 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showScanner, setShowScanner] = useState(false);
  const [accessTier, setAccessTier] = useState(1);
  const [auxPower, setAuxPower] = useState(85);
  const [searchQuery, setSearchQuery] = useState("");
  const maxPower = 110;
  const mapRef = useRef<HTMLDivElement>(null);

  // Scanner state
  const [zoneEnabled, setZoneEnabled] = useState<Record<ZoneType, boolean>>({
    surface: true,
    light: true,
    entrance: true,
    heavy: true,
  });
  const [teamDetection, setTeamDetection] = useState<Record<TeamId, boolean>>({
    exrP: true,
    scientists: true,
    foundation: false,
    chaos: true,
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuspended, setScanSuspended] = useState(true);

  const [personnel, setPersonnel] = useState<PersonnelStats>({
    scps: 1,
    mtf: 0,
    scientists: 2,
    exrP: 3,
    mrP: 2,
    chaos: 0,
  });

  // Zone definitions with colors
  const zones: { id: ZoneType; name: string; color: string; bgColor: string; borderColor: string }[] = [
    { id: "surface", name: "Surface Zone", color: "text-emerald-400", bgColor: "bg-emerald-600", borderColor: "border-emerald-500" },
    { id: "light", name: "Light Containment", color: "text-amber-400", bgColor: "bg-amber-600", borderColor: "border-amber-500" },
    { id: "heavy", name: "Heavy Containment", color: "text-red-400", bgColor: "bg-red-600", borderColor: "border-red-500" },
    { id: "entrance", name: "Entrance Zone", color: "text-blue-400", bgColor: "bg-blue-600", borderColor: "border-blue-500" },
  ];

  // Rooms per zone
  const rooms: Room[] = [
    // Heavy Containment
    { id: "hcz-049", name: "SCP-049 Containment", shortName: "SCP-049", zone: "heavy", status: "operational", x: 100, y: 100, width: 100, height: 80, connections: ["hcz-corridor-1"], special: "scp" },
    { id: "hcz-106", name: "SCP-106 Containment", shortName: "SCP-106", zone: "heavy", status: "critical", x: 250, y: 100, width: 100, height: 80, connections: ["hcz-corridor-1", "hcz-corridor-2"], special: "scp" },
    { id: "hcz-079", name: "SCP-079 Containment", shortName: "SCP-079", zone: "heavy", status: "operational", x: 400, y: 100, width: 100, height: 80, connections: ["hcz-corridor-2"], special: "scp" },
    { id: "hcz-096", name: "SCP-096 Containment", shortName: "SCP-096", zone: "heavy", status: "warning", x: 550, y: 100, width: 100, height: 80, connections: ["hcz-corridor-3"], special: "scp" },
    { id: "hcz-corridor-1", name: "HCZ Corridor Alpha", shortName: "CORRIDOR A", zone: "heavy", status: "operational", x: 100, y: 200, width: 250, height: 40, connections: ["hcz-049", "hcz-106", "hcz-tesla"] },
    { id: "hcz-corridor-2", name: "HCZ Corridor Beta", shortName: "CORRIDOR B", zone: "heavy", status: "operational", x: 250, y: 260, width: 250, height: 40, connections: ["hcz-106", "hcz-079", "hcz-nuke"] },
    { id: "hcz-corridor-3", name: "HCZ Corridor Gamma", shortName: "CORRIDOR G", zone: "heavy", status: "operational", x: 450, y: 200, width: 200, height: 40, connections: ["hcz-079", "hcz-096", "hcz-servers"] },
    { id: "hcz-tesla", name: "Tesla Gate", shortName: "TESLA", zone: "heavy", status: "operational", x: 100, y: 320, width: 80, height: 60, connections: ["hcz-corridor-1", "hcz-elev-a"], special: "tesla" },
    { id: "hcz-nuke", name: "Alpha Warhead", shortName: "NUKE", zone: "heavy", status: "offline", x: 300, y: 320, width: 100, height: 60, connections: ["hcz-corridor-2"], special: "nuke" },
    { id: "hcz-servers", name: "Server Room", shortName: "SERVERS", zone: "heavy", status: "operational", x: 500, y: 320, width: 100, height: 60, connections: ["hcz-corridor-3"], special: "servers" },
    { id: "hcz-microhid", name: "Micro H.I.D. Storage", shortName: "MICROHID", zone: "heavy", status: "operational", x: 500, y: 400, width: 100, height: 60, connections: ["hcz-servers"], special: "microhid" },
    { id: "hcz-elev-a", name: "Elevator System A", shortName: "ELEV A", zone: "heavy", status: "operational", x: 100, y: 400, width: 80, height: 60, connections: ["hcz-tesla"], special: "elevator" },
    { id: "hcz-elev-b", name: "Elevator System B", shortName: "ELEV B", zone: "heavy", status: "operational", x: 300, y: 400, width: 80, height: 60, connections: ["hcz-nuke"], special: "elevator" },
    { id: "hcz-checkpoint", name: "HCZ/EZ Checkpoint", shortName: "CHECKPOINT", zone: "heavy", status: "operational", x: 200, y: 480, width: 180, height: 50, connections: ["hcz-elev-a", "hcz-elev-b"], special: "checkpoint" },
    // Light Containment
    { id: "lcz-173", name: "SCP-173 Containment", shortName: "SCP-173", zone: "light", status: "operational", x: 100, y: 100, width: 100, height: 80, connections: ["lcz-corridor-1"], special: "scp" },
    { id: "lcz-914", name: "SCP-914", shortName: "SCP-914", zone: "light", status: "operational", x: 250, y: 100, width: 100, height: 80, connections: ["lcz-corridor-1"], special: "scp" },
    { id: "lcz-corridor-1", name: "LCZ Corridor", shortName: "CORRIDOR", zone: "light", status: "operational", x: 100, y: 200, width: 350, height: 40, connections: ["lcz-173", "lcz-914", "lcz-armory"] },
    { id: "lcz-armory", name: "LCZ Armory", shortName: "ARMORY", zone: "light", status: "operational", x: 450, y: 180, width: 100, height: 80, connections: ["lcz-corridor-1"] },
    { id: "lcz-checkpoint", name: "LCZ/HCZ Checkpoint", shortName: "CHECKPOINT", zone: "light", status: "operational", x: 200, y: 300, width: 180, height: 50, connections: ["lcz-corridor-1"], special: "checkpoint" },
    // Entrance Zone
    { id: "ez-gate-a", name: "Gate A", shortName: "GATE A", zone: "entrance", status: "operational", x: 100, y: 100, width: 120, height: 80, connections: ["ez-corridor"], special: "checkpoint" },
    { id: "ez-gate-b", name: "Gate B", shortName: "GATE B", zone: "entrance", status: "operational", x: 500, y: 100, width: 120, height: 80, connections: ["ez-corridor"], special: "checkpoint" },
    { id: "ez-corridor", name: "EZ Main Corridor", shortName: "CORRIDOR", zone: "entrance", status: "operational", x: 100, y: 200, width: 520, height: 40, connections: ["ez-gate-a", "ez-gate-b", "ez-intercom"] },
    { id: "ez-intercom", name: "Intercom Room", shortName: "INTERCOM", zone: "entrance", status: "operational", x: 300, y: 280, width: 100, height: 60, connections: ["ez-corridor"] },
    // Surface
    { id: "surf-helipad", name: "Helipad", shortName: "HELIPAD", zone: "surface", status: "operational", x: 200, y: 100, width: 150, height: 100, connections: ["surf-exit"] },
    { id: "surf-exit", name: "Facility Exit", shortName: "EXIT", zone: "surface", status: "operational", x: 300, y: 250, width: 100, height: 60, connections: ["surf-helipad", "surf-escape"] },
    { id: "surf-escape", name: "Escape Route", shortName: "ESCAPE", zone: "surface", status: "operational", x: 300, y: 350, width: 100, height: 60, connections: ["surf-exit"] },
  ];

  const currentZoneRooms = rooms.filter(r => r.zone === selectedZone);
  const filteredRooms = searchQuery 
    ? currentZoneRooms.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.shortName.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentZoneRooms;

  useEffect(() => {
    const checkForEscape = () => {
      if (Math.random() < 0.01) {
        setEntityEscaped(true);
        setPersonnel(p => ({ ...p, scps: p.scps + 1 }));
        toast.error("🚨 CONTAINMENT BREACH - SCP-106 HAS ESCAPED!", { duration: 10000 });
      }
    };
    const interval = setInterval(checkForEscape, 300000);
    return () => clearInterval(interval);
  }, []);

  // Randomize personnel counts
  useEffect(() => {
    const interval = setInterval(() => {
      setPersonnel(p => ({
        scps: Math.max(0, p.scps + (Math.random() < 0.3 ? (Math.random() < 0.5 ? -1 : 1) : 0)),
        mtf: Math.max(0, Math.min(12, p.mtf + (Math.random() < 0.3 ? Math.floor(Math.random() * 3) - 1 : 0))),
        scientists: Math.max(0, Math.min(8, p.scientists + (Math.random() < 0.3 ? Math.floor(Math.random() * 3) - 1 : 0))),
        exrP: Math.max(0, Math.min(10, p.exrP + (Math.random() < 0.3 ? Math.floor(Math.random() * 3) - 1 : 0))),
        mrP: Math.max(0, Math.min(6, p.mrP + (Math.random() < 0.2 ? Math.floor(Math.random() * 2) - 1 : 0))),
        chaos: Math.max(0, Math.min(5, p.chaos + (Math.random() < 0.2 ? Math.floor(Math.random() * 2) : 0))),
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Power regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setAuxPower(p => Math.min(maxPower, p + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
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

  const handlePanEnd = () => setIsPanning(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "border-emerald-500/60 bg-emerald-500/10";
      case "warning": return "border-amber-500/60 bg-amber-500/15";
      case "critical": return "border-red-500/70 bg-red-500/20";
      case "offline": return "border-gray-600/50 bg-gray-800/30";
      default: return "border-gray-600/50 bg-gray-800/30";
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case "operational": return "shadow-emerald-500/30";
      case "warning": return "shadow-amber-500/40";
      case "critical": return "shadow-red-500/50";
      default: return "";
    }
  };

  const getZoneBorderColor = (zone: ZoneType) => {
    const z = zones.find(z => z.id === zone);
    return z?.borderColor || "border-gray-500";
  };

  const getSpecialIcon = (special?: string) => {
    switch (special) {
      case "scp": return <Skull className="w-3 h-3 text-red-400" />;
      case "checkpoint": return <Shield className="w-3 h-3 text-blue-400" />;
      case "elevator": return <span className="text-[10px] text-cyan-400 font-bold">▲▼</span>;
      case "tesla": return <Zap className="w-3 h-3 text-yellow-400" />;
      case "nuke": return <span className="text-[10px] text-red-400 font-bold">☢</span>;
      case "servers": return <span className="text-[10px] text-cyan-400">◈</span>;
      case "microhid": return <span className="text-[10px] text-purple-400 font-bold">⚡</span>;
      default: return null;
    }
  };

  const getTeamColor = (team: TeamId) => {
    switch (team) {
      case "exrP": return "text-orange-400";
      case "scientists": return "text-white";
      case "foundation": return "text-blue-400";
      case "chaos": return "text-green-400";
    }
  };

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
            const zoneData = zones.find(z => z.id === selectedZone);
            const strokeColor = selectedZone === "heavy" ? "rgba(239, 68, 68, 0.4)" : 
                              selectedZone === "light" ? "rgba(245, 158, 11, 0.4)" :
                              selectedZone === "entrance" ? "rgba(59, 130, 246, 0.4)" :
                              "rgba(16, 185, 129, 0.4)";
            connections.push(
              <line
                key={key}
                x1={room.x + room.width / 2}
                y1={room.y + room.height / 2}
                x2={connRoom.x + connRoom.width / 2}
                y2={connRoom.y + connRoom.height / 2}
                stroke={strokeColor}
                strokeWidth="3"
                strokeDasharray="8 4"
                className="animate-pulse"
                style={{ animationDuration: '3s' }}
              />
            );
          }
        }
      });
    });
    return connections;
  };

  // Breach Scanner View
  if (showScanner) {
    return (
      <div className="h-full bg-[#050508] font-mono flex flex-col relative">
        <CRTEffect intensity="low" tint="cyan" />
        
        {/* Header */}
        <div className="border-b border-cyan-500/20 p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-cyan-400 tracking-wider">BREACH SCANNER</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-xs font-mono",
              scanSuspended ? "text-amber-400" : "text-emerald-400 animate-pulse"
            )}>
              {scanSuspended ? "SCAN SEQUENCE SUSPENDED" : "● SCANNING..."}
            </span>
            <button 
              onClick={() => setShowScanner(false)}
              className="px-4 py-2 text-xs text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
            >
              RETURN TO MAP <kbd className="ml-2 px-1.5 bg-black/50 rounded">Space</kbd>
            </button>
          </div>
        </div>

        {/* Scanner Content */}
        <div className="flex-1 p-6 overflow-auto relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
            {/* Radar display */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-xs text-cyan-600 uppercase tracking-widest">Radar Display</div>
              <RadarScanner 
                isScanning={isScanning}
                size={220}
                blips={[
                  { id: '1', x: 30, y: 40, type: 'hostile', label: 'SCP-106' },
                  { id: '2', x: 70, y: 60, type: 'friendly', label: 'MTF-E11' },
                  { id: '3', x: 50, y: 80, type: 'neutral', label: 'D-9341' },
                ]}
              />
            </div>

            {/* Zone Selection */}
            <div className="space-y-4">
              <div className="text-xs text-cyan-600 uppercase tracking-widest">Select Zones to Scan</div>
              <div className="grid grid-cols-1 gap-2">
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setZoneEnabled(z => ({ ...z, [zone.id]: !z[zone.id] }))}
                    className={cn(
                      "p-3 border text-xs font-bold transition-all",
                      zoneEnabled[zone.id] 
                        ? `${zone.bgColor} text-white border-white/20 shadow-lg` 
                        : "bg-gray-800/50 text-gray-400 border-gray-600/30 hover:bg-gray-800"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{zone.name}</span>
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] rounded",
                        zoneEnabled[zone.id] ? "bg-white/20" : "bg-gray-700"
                      )}>
                        {zoneEnabled[zone.id] ? "ON" : "OFF"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Team Detection */}
            <div className="space-y-4">
              <div className="text-xs text-cyan-600 uppercase tracking-widest">Select Teams to Detect</div>
              <div className="space-y-2">
                {(["exrP", "scientists", "foundation", "chaos"] as TeamId[]).map(team => (
                  <label
                    key={team}
                    className={cn(
                      "flex items-center gap-3 p-3 border cursor-pointer transition-all",
                      teamDetection[team]
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : "bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={teamDetection[team]}
                      onChange={() => setTeamDetection(t => ({ ...t, [team]: !t[team] }))}
                      className="w-4 h-4 accent-cyan-500"
                    />
                    <span className={cn("text-sm font-medium", getTeamColor(team))}>
                      {team === "exrP" ? "EXR-P Personnel" :
                       team === "scientists" ? "Scientists" :
                       team === "foundation" ? "Foundation Personnel" : "Chaos Insurgency"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="border-t border-cyan-500/20 p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-[10px] text-cyan-600 mb-1">ACCESS TIER {accessTier}</div>
              <div className="w-28 h-2 bg-black border border-cyan-500/30">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${(accessTier / 5) * 100}%` }} />
              </div>
            </div>
            <PowerMeter current={auxPower} max={maxPower} />
          </div>
          <Button 
            onClick={() => {
              if (auxPower < 50) {
                toast.error("Insufficient power");
                return;
              }
              setAuxPower(p => p - 50);
              setScanSuspended(false);
              setIsScanning(true);
              setTimeout(() => {
                setIsScanning(false);
                setScanSuspended(true);
                toast.success("Scan complete - 3 entities detected");
              }, 4000);
            }}
            disabled={isScanning || auxPower < 50}
            className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 px-6"
          >
            {isScanning ? "SCANNING..." : "INITIATE SCAN (50 AP)"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#050508] font-mono relative">
      <CRTEffect intensity="low" tint="cyan" showNoise={false} />
      
      {/* Map View */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Stats Panel - Top */}
        <div className="bg-black/60 backdrop-blur-sm border-b border-cyan-500/20 px-4 py-3 flex items-center gap-6">
          {/* Personnel stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <Skull className="w-4 h-4 text-red-500" />
              <span className="text-gray-500">SCPs:</span>
              <span className="font-bold text-red-400">{personnel.scps}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-gray-500">MTF:</span>
              <span className="font-bold text-blue-400">{personnel.mtf}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <FlaskConical className="w-4 h-4 text-white" />
              <span className="text-gray-500">Scientists:</span>
              <span className="font-bold text-white">{personnel.scientists}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <HardHat className="w-4 h-4 text-orange-400" />
              <span className="text-gray-500">EXR-P:</span>
              <span className="font-bold text-orange-400">{personnel.exrP}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-600" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 h-7 pl-7 pr-2 text-xs bg-black/50 border border-cyan-500/30 text-cyan-400 placeholder:text-cyan-600/50 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            
            <Button size="sm" variant="ghost" onClick={() => setShowScanner(true)} className="h-7 px-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30">
              <Radio className="w-3 h-3 mr-1.5" />
              <span className="text-xs">SCANNER</span>
            </Button>
            <div className="flex border border-cyan-500/30">
              <Button size="sm" variant="ghost" onClick={() => handleZoom(0.1)} className="h-7 px-2 hover:bg-cyan-500/10 rounded-none">
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleZoom(-0.1)} className="h-7 px-2 hover:bg-cyan-500/10 rounded-none border-l border-cyan-500/30">
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="h-7 px-2 hover:bg-cyan-500/10 rounded-none border-l border-cyan-500/30">
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Map Canvas */}
        <div 
          ref={mapRef}
          className="flex-1 overflow-hidden relative"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(0,40,60,0.3) 0%, transparent 70%),
              linear-gradient(180deg, #050508 0%, #0a0a12 100%)
            `
          }}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* Blueprint grid */}
            <div 
              className="absolute pointer-events-none"
              style={{
                width: '800px',
                height: '600px',
                backgroundImage: `
                  linear-gradient(rgba(0, 200, 255, 0.06) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 200, 255, 0.06) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />

            {/* Connections */}
            <svg className="absolute pointer-events-none" style={{ width: '800px', height: '600px' }}>
              {renderConnections()}
            </svg>

            {/* Rooms */}
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                onMouseEnter={() => setHoveredRoom(room)}
                onMouseLeave={() => setHoveredRoom(null)}
                className={cn(
                  "absolute cursor-pointer transition-all duration-200 border-2 rounded-sm",
                  getStatusColor(room.status),
                  selectedRoom?.id === room.id && "ring-2 ring-cyan-400/60 ring-offset-1 ring-offset-transparent",
                  hoveredRoom?.id === room.id && "brightness-125 scale-[1.02]",
                  room.status === "critical" && "animate-pulse",
                  getStatusGlow(room.status),
                  room.status !== "offline" && "shadow-lg"
                )}
                style={{
                  left: `${room.x}px`,
                  top: `${room.y}px`,
                  width: `${room.width}px`,
                  height: `${room.height}px`,
                }}
              >
                <div className="flex flex-col h-full justify-between p-2">
                  <div className="flex items-start justify-between">
                    {getSpecialIcon(room.special)}
                    {room.status === "critical" && (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    )}
                    {room.status === "warning" && (
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="text-[9px] font-bold text-white/90 text-center leading-tight uppercase tracking-wide">
                    {room.shortName}
                  </div>
                </div>

                {/* Hover tooltip */}
                {hoveredRoom?.id === room.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-cyan-500/40 text-[10px] whitespace-nowrap z-50 pointer-events-none">
                    <div className="text-cyan-400 font-bold">{room.name}</div>
                    <div className="text-cyan-600">{room.status.toUpperCase()}</div>
                  </div>
                )}
              </div>
            ))}

            {/* Player Position */}
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: `${playerPos.x}px`,
                top: `${playerPos.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Crosshair className="w-6 h-6 text-emerald-400 drop-shadow-lg" />
            </div>

            {/* Entity indicator */}
            {entityEscaped && (
              <div
                className="absolute w-10 h-10 bg-red-600/70 rounded-full animate-pulse flex items-center justify-center z-40"
                style={{
                  left: `${180 + Math.random() * 200}px`,
                  top: `${150 + Math.random() * 150}px`,
                  filter: "drop-shadow(0 0 15px rgba(239, 68, 68, 0.9))"
                }}
              >
                <Skull className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/90 border border-cyan-500/30 p-3 text-[10px] space-y-2 z-10 backdrop-blur-sm">
            <div className="font-bold text-xs text-cyan-400 mb-2 tracking-wider">LEGEND</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2 border-emerald-500/60 bg-emerald-500/10 rounded-sm" />
              <span className="text-gray-400">Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2 border-amber-500/60 bg-amber-500/15 rounded-sm" />
              <span className="text-gray-400">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2 border-red-500/70 bg-red-500/20 rounded-sm" />
              <span className="text-gray-400">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2 border-gray-600/50 bg-gray-800/30 rounded-sm" />
              <span className="text-gray-400">Offline</span>
            </div>
          </div>

          {/* Controls hint */}
          <div className="absolute bottom-4 right-4 bg-black/90 border border-cyan-500/30 px-4 py-2 text-[10px] text-cyan-600 z-10 backdrop-blur-sm">
            <Move className="w-3 h-3 inline mr-1.5" />
            Shift+Drag to pan • Scroll to zoom
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-black/60 backdrop-blur-sm border-t border-cyan-500/20 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-[10px] text-cyan-600 mb-1">ACCESS TIER {accessTier}</div>
              <div className="w-28 h-2 bg-black border border-cyan-500/30">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${(accessTier / 5) * 100}%` }} />
              </div>
            </div>
            <PowerMeter current={auxPower} max={maxPower} compact />
          </div>
          <div className="text-[10px] text-cyan-600">
            {filteredRooms.length} rooms • Zone: <span className="text-cyan-400">{zones.find(z => z.id === selectedZone)?.name}</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Zones */}
      <div className="w-56 border-l border-cyan-500/20 bg-black/60 backdrop-blur-sm flex flex-col relative z-10">
        <div className="p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-sm text-cyan-400 tracking-wider">FACILITY ZONES</h2>
          </div>
          
          <div className="space-y-2">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => { setSelectedZone(zone.id); setSelectedRoom(null); setSearchQuery(""); }}
                className={cn(
                  "w-full text-left p-3 transition-all text-xs font-medium border",
                  selectedZone === zone.id 
                    ? `${zone.bgColor} text-white border-white/20 shadow-lg` 
                    : "bg-gray-900/50 hover:bg-gray-800/70 text-gray-400 border-gray-700/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{zone.name}</span>
                  <span className="text-[10px] opacity-70">
                    {rooms.filter(r => r.zone === zone.id).length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Room Details */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {selectedRoom ? (
              <div className="space-y-4">
                <div>
                  <GlitchText 
                    text={selectedRoom.name}
                    className="font-bold text-sm text-white"
                    enabled={selectedRoom.status === "critical"}
                  />
                  <div className="text-[10px] text-cyan-600 uppercase tracking-widest mt-1">
                    {zones.find(z => z.id === selectedRoom.zone)?.name}
                  </div>
                </div>

                <div className="p-3 bg-black/50 border border-cyan-500/20">
                  <div className="text-[10px] text-cyan-600 mb-1.5">STATUS</div>
                  <div className={cn(
                    "font-bold uppercase text-sm",
                    selectedRoom.status === "operational" && "text-emerald-400",
                    selectedRoom.status === "warning" && "text-amber-400",
                    selectedRoom.status === "critical" && "text-red-400 animate-pulse",
                    selectedRoom.status === "offline" && "text-gray-400"
                  )}>
                    {selectedRoom.status}
                  </div>
                </div>

                {selectedRoom.special && (
                  <div className="p-3 bg-black/50 border border-cyan-500/20">
                    <div className="text-[10px] text-cyan-600 mb-1.5">TYPE</div>
                    <div className="font-bold uppercase text-sm text-cyan-400 flex items-center gap-2">
                      {getSpecialIcon(selectedRoom.special)}
                      {selectedRoom.special}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-black/50 border border-cyan-500/20">
                  <div className="text-[10px] text-cyan-600 mb-2">CONNECTED TO</div>
                  <div className="space-y-1">
                    {selectedRoom.connections.map(connId => {
                      const connRoom = rooms.find(r => r.id === connId);
                      return connRoom ? (
                        <button
                          key={connId}
                          onClick={() => setSelectedRoom(connRoom)}
                          className="w-full text-left text-[10px] p-2 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors text-cyan-400 border border-cyan-500/20"
                        >
                          {connRoom.shortName}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>

                {selectedRoom.status === "critical" && (
                  <div className="p-3 bg-red-500/20 border border-red-500/40 animate-pulse">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-[10px] font-bold text-red-400 tracking-wider">BREACH DETECTED</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-xs py-8">
                <MapPin className="w-8 h-8 mx-auto mb-3 opacity-30" />
                Select a room to view details
              </div>
            )}

            {entityEscaped && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <Skull className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-red-400 tracking-wider">SCP BREACH</span>
                </div>
                <p className="text-[10px] text-red-300">
                  SCP-106 has breached containment. All personnel proceed to nearest checkpoint.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
