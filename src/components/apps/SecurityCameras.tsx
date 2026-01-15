import { useState, useEffect, useCallback } from "react";
import { Camera, AlertTriangle, Power, Radio, Shield, MapPin, Volume2, Eye, EyeOff, ChevronLeft, ChevronRight, Circle, Settings, Wifi, WifiOff, Thermometer, Droplets, Wind } from "lucide-react";
import { toast } from "sonner";
import { FacilityMap } from "./FacilityMap";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { PowerMeter } from "@/components/shared/PowerMeter";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type ZoneId = "surface" | "upper" | "mid" | "deep";

interface CameraFeed {
  id: string;
  name: string;
  shortName: string;
  location: string;
  status: "online" | "offline" | "warning";
  zone: ZoneId;
  depth: number;
}

// Static effect component - only affects camera feed
const CameraStatic = ({ intensity = 'medium', isOffline = false }: { intensity?: 'low' | 'medium' | 'high'; isOffline?: boolean }) => {
  const [noiseOffset, setNoiseOffset] = useState({ x: 0, y: 0 });
  const [glitchBars, setGlitchBars] = useState<{ top: number; height: number }[]>([]);

  useEffect(() => {
    const noiseInterval = setInterval(() => {
      setNoiseOffset({ x: Math.random() * 100, y: Math.random() * 100 });
    }, 50);

    const glitchInterval = setInterval(() => {
      if (Math.random() < (intensity === 'high' ? 0.3 : intensity === 'medium' ? 0.15 : 0.05)) {
        const bars = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
          top: Math.random() * 100,
          height: Math.random() * 5 + 1
        }));
        setGlitchBars(bars);
        setTimeout(() => setGlitchBars([]), 100);
      }
    }, 200);

    return () => {
      clearInterval(noiseInterval);
      clearInterval(glitchInterval);
    };
  }, [intensity]);

  const opacityValues = { low: 0.03, medium: 0.08, high: 0.2 };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Noise grain */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: isOffline ? 0.4 : opacityValues[intensity],
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundPosition: `${noiseOffset.x}px ${noiseOffset.y}px`
        }}
      />

      {/* Scanlines */}
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${isOffline ? 0.3 : 0.1}) 2px,
            rgba(0, 0, 0, ${isOffline ? 0.3 : 0.1}) 4px
          )`
        }}
      />

      {/* Glitch bars */}
      {glitchBars.map((bar, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 bg-white/20"
          style={{
            top: `${bar.top}%`,
            height: `${bar.height}%`,
            transform: `translateX(${(Math.random() - 0.5) * 10}px)`
          }}
        />
      ))}

      {/* Color aberration on edges */}
      {intensity !== 'low' && (
        <div 
          className="absolute inset-0"
          style={{
            boxShadow: `
              inset 2px 0 4px rgba(255, 0, 0, 0.1),
              inset -2px 0 4px rgba(0, 255, 255, 0.1)
            `
          }}
        />
      )}
    </div>
  );
};

export const SecurityCameras = () => {
  const cameras: CameraFeed[] = [
    { id: "CAM-DEEP-01", name: "Pressure Chamber Alpha", shortName: "PCH-A", location: "Deep Zone", status: "online", zone: "deep", depth: 3200 },
    { id: "CAM-DEEP-02", name: "Specimen Vault B-7", shortName: "SV-B7", location: "Deep Zone", status: "warning", zone: "deep", depth: 3150 },
    { id: "CAM-DEEP-03", name: "Isolation Cell Block", shortName: "ICB", location: "Deep Zone", status: "online", zone: "deep", depth: 3100 },
    { id: "CAM-DEEP-04", name: "Research Lab Omega", shortName: "RLO", location: "Deep Zone", status: "online", zone: "deep", depth: 3050 },
    { id: "CAM-MID-01", name: "Central Hub", shortName: "C-HUB", location: "Mid Level", status: "online", zone: "mid", depth: 2000 },
    { id: "CAM-MID-02", name: "Engineering Bay", shortName: "ENG", location: "Mid Level", status: "online", zone: "mid", depth: 1950 },
    { id: "CAM-MID-03", name: "Medical Wing", shortName: "MED", location: "Mid Level", status: "online", zone: "mid", depth: 1900 },
    { id: "CAM-UPPER-01", name: "Access Corridor A", shortName: "AC-A", location: "Upper Level", status: "online", zone: "upper", depth: 500 },
    { id: "CAM-UPPER-02", name: "Access Corridor B", shortName: "AC-B", location: "Upper Level", status: "offline", zone: "upper", depth: 450 },
    { id: "CAM-UPPER-03", name: "Security Checkpoint", shortName: "SEC", location: "Upper Level", status: "online", zone: "upper", depth: 400 },
    { id: "CAM-SURF-01", name: "Surface Platform", shortName: "SURF", location: "Surface", status: "online", zone: "surface", depth: 0 },
    { id: "CAM-SURF-02", name: "Docking Bay", shortName: "DOCK", location: "Surface", status: "online", zone: "surface", depth: 50 },
  ];

  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);
  const [scanLineY, setScanLineY] = useState(0);
  const [frameCounter, setFrameCounter] = useState(0);
  const [auxPower, setAuxPower] = useState(85);
  const maxPower = 110;
  const [pingCount, setPingCount] = useState(5);
  const [speakerActive, setSpeakerActive] = useState(false);
  const [environmentData] = useState({
    pressure: 8247,
    temperature: 4.2,
    humidity: 89
  });

  // Scanline animation for active camera
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLineY(prev => (prev + 0.5) % 100);
      setFrameCounter(prev => prev + 1);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  // Power regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setAuxPower(p => Math.min(maxPower, p + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  const handlePing = () => {
    if (auxPower < 5) {
      toast.error("Insufficient auxiliary power");
      return;
    }
    setAuxPower(p => p - 5);
    setPingCount(c => Math.max(0, c - 1));
    toast.success(`Pinging location: ${selectedCamera.name}`);
  };

  const handleSpeaker = () => {
    if (auxPower < 10) {
      toast.error("Insufficient auxiliary power");
      return;
    }
    setAuxPower(p => p - 10);
    setSpeakerActive(true);
    toast.info("Broadcasting on speaker...");
    setTimeout(() => setSpeakerActive(false), 3000);
  };

  const handleBlackout = () => {
    if (auxPower < 25) {
      toast.error("Insufficient auxiliary power");
      return;
    }
    setAuxPower(p => p - 25);
    toast.warning("BLACKOUT INITIATED - Lights disabled for 10 seconds");
  };

  const getNextCamera = () => {
    const currentIndex = cameras.findIndex(c => c.id === selectedCamera.id);
    const nextIndex = (currentIndex + 1) % cameras.length;
    return cameras[nextIndex];
  };

  const getPrevCamera = () => {
    const currentIndex = cameras.findIndex(c => c.id === selectedCamera.id);
    const prevIndex = (currentIndex - 1 + cameras.length) % cameras.length;
    return cameras[prevIndex];
  };

  const getZoneColor = (zone: ZoneId) => {
    switch (zone) {
      case "deep": return "text-red-400 bg-red-500/20 border-red-500/30";
      case "mid": return "text-amber-400 bg-amber-500/20 border-amber-500/30";
      case "upper": return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "surface": return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
    }
  };

  const getZoneLabel = (zone: ZoneId) => {
    switch (zone) {
      case "deep": return "DEEP ZONE";
      case "mid": return "MID LEVEL";
      case "upper": return "UPPER LEVEL";
      case "surface": return "SURFACE";
    }
  };

  const currentTime = new Date();
  const timestamp = `${currentTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} ${currentTime.toLocaleTimeString('en-US', { hour12: false })}:${String(frameCounter % 30).padStart(2, '0')}`;

  return (
    <div className="flex h-full bg-background font-mono overflow-hidden">
      {/* Main Camera View */}
      <div className="flex-1 flex flex-col">
        {/* Camera Feed Area - This is where static effects apply */}
        <div className="flex-1 relative overflow-hidden bg-muted/20 border-b border-border">
          {selectedCamera.status === "offline" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <CameraStatic intensity="high" isOffline />
              <div className="text-center z-10">
                <EyeOff className="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
                <div className="text-xl font-bold text-muted-foreground tracking-widest">NO SIGNAL</div>
                <div className="text-muted-foreground/50 text-xs mt-2 tracking-wider">CAMERA FEED UNAVAILABLE</div>
                <div className="text-destructive/50 text-[10px] mt-2 font-mono">ERR_CONNECTION_LOST</div>
              </div>
            </div>
          ) : (
            <>
              {/* Static effect - ONLY on camera feed */}
              <CameraStatic intensity={selectedCamera.status === "warning" ? "medium" : "low"} />

              {/* Camera feed visualization */}
              <div className="absolute inset-0">
                {/* Blueprint grid */}
                <div 
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `
                      linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />

                {/* Moving scanline */}
                <div 
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none"
                  style={{ top: `${scanLineY}%` }}
                />

                {/* Room schematic */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full h-full max-w-2xl max-h-96 border border-primary/10 rounded-lg">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary/40 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary/40 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br" />

                    {/* Zone icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/10">
                      <Camera className="w-24 h-24" />
                    </div>

                    {/* Motion detection zones */}
                    {selectedCamera.status === "warning" && (
                      <>
                        <div className="absolute top-1/4 left-1/3 w-20 h-20 border-2 border-destructive/50 bg-destructive/10 rounded animate-pulse">
                          <div className="absolute -top-5 left-0 text-[10px] text-destructive font-bold px-1 bg-background/80 rounded">MOTION</div>
                        </div>
                        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-destructive rounded-full animate-ping" />
                      </>
                    )}

                    {/* Depth indicator */}
                    <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3 h-3" />
                        <span>DEPTH: {selectedCamera.depth}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* HUD Overlays - These are OUTSIDE the static effect */}
            </>
          )}

          {/* Camera info overlay - always clean, no static */}
          {selectedCamera.status !== "offline" && (
            <>
              <div className="absolute top-3 left-3 z-30">
                <div className="bg-background/90 border border-border backdrop-blur-sm p-3 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-lg font-bold tracking-wider text-foreground">
                      {selectedCamera.shortName}
                    </div>
                    <StatusIndicator status={selectedCamera.status} size="md" />
                  </div>
                  <div className="text-muted-foreground text-[10px] tracking-wider">{selectedCamera.location}</div>
                  <div className="text-muted-foreground/60 text-[9px] mt-1">{selectedCamera.id}</div>
                </div>
              </div>

              <div className="absolute top-3 right-3 z-30">
                <div className="bg-background/90 border border-destructive/30 px-3 py-2 flex items-center gap-2 rounded-lg">
                  <Circle className="w-2.5 h-2.5 fill-destructive text-destructive animate-pulse" />
                  <span className="text-destructive text-xs font-bold tracking-widest">REC</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 z-30">
                <div className="bg-background/90 border border-border px-3 py-2 rounded-lg">
                  <div className="text-muted-foreground text-xs font-mono tracking-wider">{timestamp}</div>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 z-30">
                <div className={cn("px-2 py-1 text-[10px] rounded border", getZoneColor(selectedCamera.zone))}>
                  {getZoneLabel(selectedCamera.zone)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Action Bar - Clean UI, no static */}
        <div className="border-t border-border bg-background p-3">
          <div className="flex items-center gap-3">
            {/* Camera navigation */}
            <div className="flex items-center gap-1 border-r border-border pr-3">
              <button 
                onClick={() => setSelectedCamera(getPrevCamera())}
                className="p-2 hover:bg-muted text-foreground transition-colors rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-[10px] text-muted-foreground w-12 text-center">
                {cameras.findIndex(c => c.id === selectedCamera.id) + 1}/{cameras.length}
              </div>
              <button 
                onClick={() => setSelectedCamera(getNextCamera())}
                className="p-2 hover:bg-muted text-foreground transition-colors rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Action buttons */}
            <button 
              onClick={handleSpeaker}
              disabled={auxPower < 10 || speakerActive}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded",
                speakerActive 
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-400" 
                  : "bg-muted border-border text-foreground hover:bg-muted/80"
              )}
            >
              <Volume2 className="w-3 h-3" />
              <span>{speakerActive ? "ACTIVE" : "SPEAKER"}</span>
              <span className="text-muted-foreground text-[9px]">10AP</span>
            </button>

            <button 
              onClick={handleBlackout}
              disabled={auxPower < 25}
              className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded"
            >
              <Power className="w-3 h-3" />
              <span>BLACKOUT</span>
              <span className="text-destructive/60 text-[9px]">25AP</span>
            </button>

            <div className="flex-1" />

            {/* Power meter */}
            <PowerMeter current={auxPower} max={maxPower} compact />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Camera List - Clean UI */}
      <div className="w-56 border-l border-border bg-background flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Pressure Cameras</div>
          <div className="text-sm text-foreground font-medium flex items-center gap-2">
            <Wifi className="w-3 h-3 text-primary" />
            {cameras.filter(c => c.status === "online").length}/{cameras.length} Online
          </div>
        </div>

        {/* Camera list */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {cameras.map(cam => (
              <button
                key={cam.id}
                onClick={() => setSelectedCamera(cam)}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-xs transition-all border rounded-lg",
                  selectedCamera.id === cam.id 
                    ? "bg-primary/10 border-primary/30 text-foreground" 
                    : "hover:bg-muted border-transparent text-muted-foreground hover:border-border",
                  cam.status === "offline" && "opacity-50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{cam.shortName}</span>
                  <StatusIndicator status={cam.status} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">{cam.location}</span>
                  <span className="text-[9px] text-muted-foreground">{cam.depth}m</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Environment status */}
        <div className="border-t border-border p-3 space-y-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Environment</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-muted rounded">
              <Droplets className="w-3 h-3 mx-auto mb-1 text-blue-400" />
              <div className="text-[10px] font-bold text-foreground">{environmentData.pressure}</div>
              <div className="text-[8px] text-muted-foreground">PSI</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <Thermometer className="w-3 h-3 mx-auto mb-1 text-amber-400" />
              <div className="text-[10px] font-bold text-foreground">{environmentData.temperature}°C</div>
              <div className="text-[8px] text-muted-foreground">TEMP</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <Wind className="w-3 h-3 mx-auto mb-1 text-emerald-400" />
              <div className="text-[10px] font-bold text-foreground">{environmentData.humidity}%</div>
              <div className="text-[8px] text-muted-foreground">HUM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
