import { useState, useEffect, useCallback } from "react";
import { Camera, Video, AlertTriangle, Power, Radio, Shield, Users, FlaskConical, HardHat, Skull, Zap, MapPin, Volume2, Eye, EyeOff, ChevronLeft, ChevronRight, Circle, Settings } from "lucide-react";
import { toast } from "sonner";
import { FacilityMap } from "./FacilityMap";
import { CRTEffect } from "@/components/shared/CRTEffect";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { PowerMeter } from "@/components/shared/PowerMeter";
import { GlitchText } from "@/components/shared/GlitchText";
import { cn } from "@/lib/utils";

type ZoneId = "surface" | "light" | "entrance" | "heavy";

interface CameraFeed {
  id: string;
  name: string;
  shortName: string;
  location: string;
  status: "online" | "offline" | "warning";
  zone: ZoneId;
}

export const SecurityCameras = () => {
  const cameras: CameraFeed[] = [
    { id: "CAM-HCZ-01", name: "SCP-049 Entrance", shortName: "049 ENT", location: "Heavy Containment", status: "online", zone: "heavy" },
    { id: "CAM-HCZ-02", name: "SCP-106 Chamber", shortName: "106 CHM", location: "Heavy Containment", status: "warning", zone: "heavy" },
    { id: "CAM-HCZ-03", name: "Tesla Gate", shortName: "TESLA", location: "Heavy Containment", status: "online", zone: "heavy" },
    { id: "CAM-HCZ-04", name: "HCZ Three-Way", shortName: "3-WAY", location: "Heavy Containment", status: "online", zone: "heavy" },
    { id: "CAM-LCZ-01", name: "SCP-173 Containment", shortName: "173 CNT", location: "Light Containment", status: "online", zone: "light" },
    { id: "CAM-LCZ-02", name: "SCP-914 Room", shortName: "914 RM", location: "Light Containment", status: "online", zone: "light" },
    { id: "CAM-LCZ-03", name: "LCZ Armory", shortName: "ARMORY", location: "Light Containment", status: "online", zone: "light" },
    { id: "CAM-EZ-01", name: "Gate A Checkpoint", shortName: "GATE A", location: "Entrance Zone", status: "online", zone: "entrance" },
    { id: "CAM-EZ-02", name: "Gate B Checkpoint", shortName: "GATE B", location: "Entrance Zone", status: "offline", zone: "entrance" },
    { id: "CAM-EZ-03", name: "Intercom Room", shortName: "INTRCM", location: "Entrance Zone", status: "online", zone: "entrance" },
    { id: "CAM-SURF-01", name: "Surface Helipad", shortName: "HELIPAD", location: "Surface", status: "online", zone: "surface" },
    { id: "CAM-SURF-02", name: "Escape Route", shortName: "ESCAPE", location: "Surface", status: "online", zone: "surface" },
  ];

  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);
  const [showMap, setShowMap] = useState(false);
  const [scanLineY, setScanLineY] = useState(0);
  const [frameCounter, setFrameCounter] = useState(0);
  const [accessTier, setAccessTier] = useState(2);
  const [auxPower, setAuxPower] = useState(85);
  const maxPower = 110;
  const [pingCount, setPingCount] = useState(5);
  const [speakerActive, setSpeakerActive] = useState(false);
  const [showInterference, setShowInterference] = useState(false);

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLineY(prev => (prev + 0.5) % 100);
      setFrameCounter(prev => prev + 1);
    }, 33); // ~30fps
    return () => clearInterval(interval);
  }, []);

  // Occasional interference
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setShowInterference(true);
        setTimeout(() => setShowInterference(false), 150);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Power regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setAuxPower(p => Math.min(maxPower, p + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Tab key to toggle map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowMap(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const getZoneIcon = (zone: ZoneId) => {
    switch (zone) {
      case "heavy": return <Skull className="w-16 h-16" />;
      case "light": return <Camera className="w-16 h-16" />;
      case "entrance": return <Shield className="w-16 h-16" />;
      case "surface": return <MapPin className="w-16 h-16" />;
    }
  };

  const currentTime = new Date();
  const timestamp = `${currentTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} ${currentTime.toLocaleTimeString('en-US', { hour12: false })}:${String(frameCounter % 30).padStart(2, '0')}`;

  // If showing map, render the facility map component
  if (showMap) {
    return (
      <div className="relative h-full">
        <FacilityMap />
        {/* Map overlay hint */}
        <div className="absolute top-4 right-4 bg-black/90 border border-cyan-500/40 px-4 py-2.5 text-xs font-mono z-50 backdrop-blur-sm">
          <span className="text-cyan-600">PRESS</span>{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400 font-bold">Tab</kbd>{" "}
          <span className="text-cyan-600">TO CLOSE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-black font-mono overflow-hidden">
      {/* Main Camera View */}
      <div className="flex-1 flex flex-col relative">
        {/* Camera Feed Area */}
        <div className={cn(
          "flex-1 relative overflow-hidden bg-[#050508]",
          showInterference && "animate-signal-interference"
        )}>
          {selectedCamera.status === "offline" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <CRTEffect intensity="high" showFlicker />
              <div className="text-center z-10">
                <EyeOff className="w-24 h-24 text-red-500/40 mx-auto mb-6" />
                <GlitchText 
                  text="NO SIGNAL" 
                  className="text-red-500 font-bold text-3xl tracking-widest"
                  enabled
                />
                <div className="text-red-500/50 text-xs mt-3 tracking-wider">CAMERA FEED UNAVAILABLE</div>
                <div className="text-red-500/30 text-[10px] mt-2">ERR_CONNECTION_LOST</div>
              </div>
            </div>
          ) : (
            <>
              {/* CRT Effects Overlay */}
              <CRTEffect 
                intensity="medium" 
                tint="cyan" 
                showFlicker={selectedCamera.status === "warning"}
              />

              {/* Camera feed visualization */}
              <div className="absolute inset-0">
                {/* Blueprint grid */}
                <div 
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />

                {/* Moving scanline */}
                <div 
                  className="absolute left-0 right-0 h-[3px] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent pointer-events-none"
                  style={{ top: `${scanLineY}%` }}
                />

                {/* Room schematic */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4 border border-cyan-500/10">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/40" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500/40" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-500/40" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/40" />

                    {/* Zone icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500/20">
                      {getZoneIcon(selectedCamera.zone)}
                    </div>

                    {/* Motion detection zones */}
                    {selectedCamera.status === "warning" && (
                      <>
                        <div className="absolute top-1/4 left-1/3 w-16 h-16 border border-red-500/50 bg-red-500/10 animate-pulse">
                          <div className="absolute -top-4 left-0 text-[9px] text-red-400 font-bold">MOTION</div>
                        </div>
                        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      </>
                    )}

                    {/* IR overlay effect */}
                    <div 
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(0,255,255,0.1) 0%, transparent 40%)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* HUD Overlays */}
              {/* Top-left: Camera info */}
              <div className="absolute top-4 left-4 z-30">
                <div className="bg-black/70 border border-cyan-500/30 backdrop-blur-sm p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-cyan-400 text-xl font-bold tracking-wider">
                      {selectedCamera.shortName}
                    </div>
                    <StatusIndicator 
                      status={selectedCamera.status} 
                      size="md"
                    />
                  </div>
                  <div className="text-cyan-600/80 text-[10px] tracking-wider">{selectedCamera.location}</div>
                  <div className="text-cyan-600/60 text-[9px] mt-1">{selectedCamera.id}</div>
                </div>
              </div>

              {/* Top-right: REC indicator */}
              <div className="absolute top-4 right-4 z-30">
                <div className="bg-black/70 border border-red-500/30 px-3 py-2 flex items-center gap-2">
                  <Circle className="w-2.5 h-2.5 fill-red-500 text-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-bold tracking-widest">REC</span>
                </div>
              </div>

              {/* Bottom-left: Timestamp */}
              <div className="absolute bottom-4 left-4 z-30">
                <div className="bg-black/70 border border-cyan-500/30 px-3 py-2">
                  <div className="text-cyan-400/80 text-xs font-mono tracking-wider">{timestamp}</div>
                </div>
              </div>

              {/* Bottom-right: PTZ controls visual */}
              <div className="absolute bottom-4 right-4 z-30">
                <div className="bg-black/70 border border-cyan-500/30 p-2 text-[10px] text-cyan-600">
                  <div className="flex items-center gap-1.5">
                    <span>PTZ</span>
                    <span className="text-cyan-400">LOCKED</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-cyan-500/20 bg-[#0a0a12] p-3">
          <div className="flex items-center gap-3">
            {/* Camera navigation */}
            <div className="flex items-center gap-1 border-r border-cyan-500/20 pr-3">
              <button 
                onClick={() => setSelectedCamera(getPrevCamera())}
                className="p-2 hover:bg-cyan-500/10 text-cyan-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-[10px] text-cyan-600 w-16 text-center">
                {cameras.findIndex(c => c.id === selectedCamera.id) + 1}/{cameras.length}
              </div>
              <button 
                onClick={() => setSelectedCamera(getNextCamera())}
                className="p-2 hover:bg-cyan-500/10 text-cyan-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Action buttons */}
            <button 
              onClick={() => setShowMap(true)}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors"
            >
              <MapPin className="w-3 h-3" />
              <span>MAP</span>
              <kbd className="text-[9px] px-1.5 py-0.5 bg-black/50 rounded ml-1">Tab</kbd>
            </button>

            <button 
              onClick={handlePing}
              disabled={auxPower < 5}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Radio className="w-3 h-3" />
              <span>PING ({pingCount})</span>
              <span className="text-cyan-600 text-[9px]">5AP</span>
            </button>

            <button 
              onClick={handleSpeaker}
              disabled={auxPower < 10 || speakerActive}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                speakerActive 
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-400" 
                  : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              )}
            >
              <Volume2 className="w-3 h-3" />
              <span>{speakerActive ? "ACTIVE" : "SPEAKER"}</span>
              <span className="text-cyan-600 text-[9px]">10AP</span>
            </button>

            <button 
              onClick={handleBlackout}
              disabled={auxPower < 25}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Power className="w-3 h-3" />
              <span>BLACKOUT</span>
              <span className="text-red-600 text-[9px]">25AP</span>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Power meter */}
            <PowerMeter current={auxPower} max={maxPower} compact />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Camera List */}
      <div className="w-52 border-l border-cyan-500/20 bg-[#0a0a12] flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-cyan-500/20">
          <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1">All Cameras</div>
          <div className="text-xs text-cyan-400 font-mono">
            {cameras.filter(c => c.status === "online").length}/{cameras.length} Online
          </div>
        </div>

        {/* Camera list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {cameras.map(cam => (
            <button
              key={cam.id}
              onClick={() => setSelectedCamera(cam)}
              className={cn(
                "w-full text-left px-3 py-2 text-xs transition-all border",
                selectedCamera.id === cam.id 
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" 
                  : "hover:bg-cyan-500/10 border-transparent text-cyan-500/80 hover:border-cyan-500/20",
                cam.status === "offline" && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{cam.shortName}</span>
                <StatusIndicator status={cam.status} size="sm" />
              </div>
              <div className="text-[9px] text-cyan-600/60 mt-0.5">{cam.location}</div>
            </button>
          ))}
        </div>

        {/* Bottom status */}
        <div className="border-t border-cyan-500/20 p-3 space-y-3">
          {/* Access tier */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-cyan-600 mb-1">
              <span>ACCESS TIER</span>
              <span className="text-cyan-400">{accessTier}</span>
            </div>
            <div className="h-1.5 bg-black border border-cyan-500/30">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400" 
                style={{ width: `${(accessTier / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Power */}
          <PowerMeter current={auxPower} max={maxPower} />
        </div>
      </div>
    </div>
  );
};
