import { useState, useCallback } from "react";
import { 
  Camera, Grid, Grid2X2, LayoutGrid, Maximize2, Minimize2, 
  ChevronLeft, ChevronRight, Wifi, WifiOff, Settings,
  Volume2, Power, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useIPCameras, IPCamera } from "@/hooks/useIPCameras";
import { CameraFeed, CameraGrid, CameraList, AddCameraDialog } from "./cameras";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PowerMeter } from "@/components/shared/PowerMeter";

type GridLayout = '1x1' | '2x2' | '3x3';

// Facility cameras (simulated)
const FACILITY_CAMERAS: Omit<IPCamera, 'id' | 'createdAt'>[] = [
  { name: "Pressure Chamber Alpha", url: "", protocol: 'simulated', zone: "Heavy Containment", status: 'online' },
  { name: "Specimen Vault B-7", url: "", protocol: 'simulated', zone: "Heavy Containment", status: 'online' },
  { name: "Isolation Cell Block", url: "", protocol: 'simulated', zone: "Heavy Containment", status: 'online' },
  { name: "Research Lab Omega", url: "", protocol: 'simulated', zone: "Heavy Containment", status: 'online' },
  { name: "Central Hub", url: "", protocol: 'simulated', zone: "Mid Level", status: 'online' },
  { name: "Engineering Bay", url: "", protocol: 'simulated', zone: "Mid Level", status: 'online' },
  { name: "Medical Wing", url: "", protocol: 'simulated', zone: "Mid Level", status: 'online' },
  { name: "Access Corridor A", url: "", protocol: 'simulated', zone: "Upper Level", status: 'online' },
  { name: "Security Checkpoint", url: "", protocol: 'simulated', zone: "Upper Level", status: 'online' },
  { name: "Surface Platform", url: "", protocol: 'simulated', zone: "Surface", status: 'online' },
  { name: "Docking Bay", url: "", protocol: 'simulated', zone: "Surface", status: 'online' },
];

// Convert to full IPCamera format
const facilityCameras: IPCamera[] = FACILITY_CAMERAS.map((cam, i) => ({
  ...cam,
  id: `facility-${i}`,
  createdAt: 0,
}));

export const SecurityCameras = () => {
  const {
    cameras: ipCameras,
    selectedCamera,
    selectedCameraId,
    setSelectedCameraId,
    addCamera,
    removeCamera,
    testConnection,
    setStatus,
  } = useIPCameras();

  const [activeTab, setActiveTab] = useState<'ip' | 'facility'>('ip');
  const [layout, setLayout] = useState<GridLayout>('1x1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [auxPower, setAuxPower] = useState(85);
  const [speakerActive, setSpeakerActive] = useState(false);
  const maxPower = 110;

  // Combined cameras based on active tab
  const activeCameras = activeTab === 'ip' ? ipCameras : facilityCameras;
  const displayCamera = activeTab === 'ip' 
    ? selectedCamera 
    : facilityCameras.find(c => c.id === selectedCameraId) || facilityCameras[0];

  // Navigation
  const handlePrevCamera = useCallback(() => {
    const currentIndex = activeCameras.findIndex(c => c.id === selectedCameraId);
    const prevIndex = (currentIndex - 1 + activeCameras.length) % activeCameras.length;
    setSelectedCameraId(activeCameras[prevIndex]?.id || null);
  }, [activeCameras, selectedCameraId, setSelectedCameraId]);

  const handleNextCamera = useCallback(() => {
    const currentIndex = activeCameras.findIndex(c => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % activeCameras.length;
    setSelectedCameraId(activeCameras[nextIndex]?.id || null);
  }, [activeCameras, selectedCameraId, setSelectedCameraId]);

  // Actions
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

  const handleStatusChange = useCallback((id: string, status: IPCamera['status']) => {
    if (activeTab === 'ip') {
      setStatus(id, status);
    }
  }, [activeTab, setStatus]);

  const onlineCount = activeCameras.filter(c => c.status === 'online').length;

  return (
    <div className={cn(
      "flex h-full bg-background font-mono overflow-hidden",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Main Camera View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Camera Feed Area */}
        <div className="flex-1 relative overflow-hidden bg-muted/10 border-b border-border">
          {layout === '1x1' ? (
            <CameraFeed
              camera={displayCamera}
              className="w-full h-full"
              onStatusChange={(status) => displayCamera && handleStatusChange(displayCamera.id, status)}
            />
          ) : (
            <CameraGrid
              cameras={activeCameras}
              layout={layout}
              selectedCameraId={selectedCameraId}
              onSelectCamera={setSelectedCameraId}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-3 right-3 z-30 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-border bg-background p-3">
          <div className="flex items-center gap-3">
            {/* Camera navigation */}
            <div className="flex items-center gap-1 border-r border-border pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevCamera}
                disabled={activeCameras.length === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-xs text-muted-foreground w-12 text-center">
                {activeCameras.length > 0 
                  ? `${activeCameras.findIndex(c => c.id === selectedCameraId) + 1}/${activeCameras.length}`
                  : '0/0'
                }
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextCamera}
                disabled={activeCameras.length === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Layout switcher */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setLayout('1x1')}
                className={cn(
                  "p-2 transition-colors",
                  layout === '1x1' ? "bg-primary/20 text-primary" : "hover:bg-muted"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('2x2')}
                className={cn(
                  "p-2 border-l border-border transition-colors",
                  layout === '2x2' ? "bg-primary/20 text-primary" : "hover:bg-muted"
                )}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('3x3')}
                className={cn(
                  "p-2 border-l border-border transition-colors",
                  layout === '3x3' ? "bg-primary/20 text-primary" : "hover:bg-muted"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-border" />

            {/* Action buttons (only for simulated/facility cameras) */}
            {activeTab === 'facility' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSpeaker}
                  disabled={auxPower < 10 || speakerActive}
                  className={cn(
                    "gap-2 text-xs",
                    speakerActive && "bg-amber-500/20 border-amber-500/30 text-amber-500"
                  )}
                >
                  <Volume2 className="w-3 h-3" />
                  {speakerActive ? "ACTIVE" : "SPEAKER"}
                  <span className="text-muted-foreground text-[9px]">10AP</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBlackout}
                  disabled={auxPower < 25}
                  className="gap-2 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Power className="w-3 h-3" />
                  BLACKOUT
                  <span className="text-destructive/60 text-[9px]">25AP</span>
                </Button>
              </>
            )}

            <div className="flex-1" />

            {/* Status indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {onlineCount === activeCameras.length ? (
                <Wifi className="w-4 h-4 text-emerald-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-500" />
              )}
              <span>{onlineCount}/{activeCameras.length} Online</span>
            </div>

            {/* Power meter for facility tab */}
            {activeTab === 'facility' && (
              <PowerMeter current={auxPower} max={maxPower} compact />
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 border-l border-border bg-background flex flex-col">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ip' | 'facility')} className="flex flex-col flex-1">
          <div className="p-3 border-b border-border">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="ip" className="text-xs">
                IP Cameras
              </TabsTrigger>
              <TabsTrigger value="facility" className="text-xs">
                Facility
              </TabsTrigger>
            </TabsList>
          </div>

          {/* IP Cameras Tab */}
          <TabsContent value="ip" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
            <div className="p-3 border-b border-border">
              <AddCameraDialog onAdd={addCamera} testConnection={testConnection} />
            </div>
            <CameraList
              cameras={ipCameras}
              selectedCameraId={selectedCameraId}
              onSelectCamera={setSelectedCameraId}
              onRemoveCamera={removeCamera}
            />
          </TabsContent>

          {/* Facility Cameras Tab */}
          <TabsContent value="facility" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4 text-primary" />
                <span className="font-medium">Facility Cameras</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Built-in facility monitoring system
              </p>
            </div>
            <CameraList
              cameras={facilityCameras}
              selectedCameraId={selectedCameraId}
              onSelectCamera={setSelectedCameraId}
              onRemoveCamera={() => toast.error("Cannot remove facility cameras")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
