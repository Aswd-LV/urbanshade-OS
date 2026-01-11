import { useState, useRef } from "react";
import { 
  Settings as SettingsIcon, Monitor, Wifi, Volume2, HardDrive, Users, Clock, 
  Shield, Palette, Accessibility, Bell, Power, Search, Upload, 
  AlertTriangle, Download, ChevronRight, Code, Cloud, RefreshCw, 
  LogOut, Loader2, Zap, Moon, Sun, Eye, Lock, Database, Globe, 
  Smartphone, ChevronDown, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveState, loadState } from "@/lib/persistence";
import { toast } from "sonner";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { useAutoSync } from "@/hooks/useAutoSync";

export const Settings = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { settings, updateSetting, resetToDefaults } = useSystemSettings();
  const { user, profile, isOnlineMode, signOut, updateProfile, loadCloudSettings } = useOnlineAccount();
  const { lastSyncTime, isSyncing, manualSync, isEnabled: syncEnabled, hasConflict, cloudSettings, resolveConflict } = useAutoSync();
  
  const [selectedCategory, setSelectedCategory] = useState("system");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFactoryResetDialog, setShowFactoryResetDialog] = useState(false);
  const [showOemDialog, setShowOemDialog] = useState(false);
  const [developerOptionsOpen, setDeveloperOptionsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // System settings
  const [autoUpdates, setAutoUpdates] = useState(loadState("settings_auto_updates", true));
  const [telemetry, setTelemetry] = useState(loadState("settings_telemetry", false));
  const [powerMode, setPowerMode] = useState(loadState("settings_power_mode", "balanced"));
  const [oemUnlocked, setOemUnlocked] = useState(loadState("settings_oem_unlocked", false));
  const [developerMode, setDeveloperMode] = useState(loadState("settings_developer_mode", false));
  const [usbDebugging, setUsbDebugging] = useState(loadState("settings_usb_debugging", false));
  
  // Display settings
  const [resolution, setResolution] = useState(loadState("settings_resolution", "1920x1080"));
  const [nightLight, setNightLight] = useState(loadState("settings_night_light", false));
  const [theme, setTheme] = useState(loadState("settings_theme", "dark"));
  
  // Network settings
  const [wifiEnabled, setWifiEnabled] = useState(loadState("settings_wifi", true));
  const [vpnEnabled, setVpnEnabled] = useState(loadState("settings_vpn", false));
  
  // Sound settings
  const [volume, setVolume] = useState(loadState("settings_volume", [70]));
  const [muteEnabled, setMuteEnabled] = useState(loadState("settings_mute", false));
  const [soundEffects, setSoundEffects] = useState(loadState("settings_sound_effects", true));
  
  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(loadState("settings_notifications", true));
  const [doNotDisturb, setDoNotDisturb] = useState(loadState("settings_dnd", false));

  const handleSave = (key: string, value: any) => {
    saveState(key, value);
  };

  const handleFactoryReset = () => {
    localStorage.clear();
    toast.success("Factory reset initiated. Reloading system...");
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleOemUnlockToggle = () => {
    setShowOemDialog(true);
  };

  const handleOemUnlockConfirm = () => {
    const newValue = !oemUnlocked;
    setOemUnlocked(newValue);
    handleSave("settings_oem_unlocked", newValue);
    setShowOemDialog(false);
    handleFactoryReset();
  };

  const handleExportSystemImage = () => {
    const systemImage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) systemImage[key] = localStorage.getItem(key) || "";
    }
    
    const blob = new Blob([JSON.stringify(systemImage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urbanshade_system_image_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("System image exported successfully");
  };

  const handleImportSystemImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const systemImage = JSON.parse(e.target?.result as string);
        localStorage.clear();
        Object.keys(systemImage).forEach(key => localStorage.setItem(key, systemImage[key]));
        toast.success("System image imported successfully. Reloading...");
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        toast.error("Failed to import system image. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const categories = [
    { id: "system", name: "System", icon: Monitor, description: "Device info, updates" },
    { id: "display", name: "Display", icon: Palette, description: "Theme, resolution" },
    { id: "network", name: "Network", icon: Wifi, description: "Wi-Fi, VPN" },
    { id: "sound", name: "Sound", icon: Volume2, description: "Volume, effects" },
    { id: "storage", name: "Storage", icon: HardDrive, description: "Disk usage" },
    { id: "accounts", name: "Accounts", icon: Users, description: "Users, sync" },
    { id: "time", name: "Time & Language", icon: Clock, description: "Clock, region" },
    { id: "privacy", name: "Privacy", icon: Shield, description: "Security settings" },
    { id: "accessibility", name: "Accessibility", icon: Accessibility, description: "Visual aids" },
    { id: "notifications", name: "Notifications", icon: Bell, description: "Alerts, DND" },
    { id: "power", name: "Power", icon: Power, description: "Battery, sleep" },
    { id: "about", name: "About", icon: SettingsIcon, description: "System info" },
  ];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SettingRow = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: { 
    icon: any; 
    title: string; 
    description?: string; 
    children: React.ReactNode 
  }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium text-sm">{title}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case "system":
        return (
          <div className="space-y-3">
            <div className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Monitor className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Urbanshade OS</h2>
                  <p className="text-sm text-muted-foreground">Version 3.0</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-md bg-background/50 border border-border/30">
                  <span className="text-muted-foreground text-xs">Device</span>
                  <div className="font-medium">{settings.deviceName || "Urbanshade Terminal"}</div>
                </div>
                <div className="p-3 rounded-md bg-background/50 border border-border/30">
                  <span className="text-muted-foreground text-xs">Architecture</span>
                  <div className="font-medium">64-bit OS</div>
                </div>
              </div>
            </div>

            <SettingRow icon={RefreshCw} title="Automatic Updates" description="Keep system up to date">
              <Switch 
                checked={autoUpdates} 
                onCheckedChange={(checked) => { setAutoUpdates(checked); handleSave("settings_auto_updates", checked); }} 
              />
            </SettingRow>

            <SettingRow icon={Database} title="Telemetry" description="Help improve the system">
              <Switch 
                checked={telemetry} 
                onCheckedChange={(checked) => { setTelemetry(checked); handleSave("settings_telemetry", checked); }} 
              />
            </SettingRow>

            <Button 
              className="w-full h-11"
              onClick={() => {
                toast.success("Checking for updates...");
                setTimeout(() => onUpdate?.(), 2000);
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check for Updates
            </Button>

            <Collapsible open={developerOptionsOpen} onOpenChange={setDeveloperOptionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 px-4 border-amber-500/20 hover:bg-amber-500/5">
                  <div className="flex items-center gap-3">
                    <Code className="w-4 h-4 text-amber-500" />
                    <div className="text-left">
                      <div className="font-medium text-amber-500 text-sm">Developer Options</div>
                      <div className="text-xs text-muted-foreground">Advanced debugging tools</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${developerOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3 space-y-3">
                <SettingRow icon={Code} title="Developer Mode" description="Enable DEF-DEV console access">
                  <Switch 
                    checked={developerMode} 
                    onCheckedChange={(checked) => {
                      setDeveloperMode(checked);
                      handleSave("settings_developer_mode", checked);
                      if (checked) {
                        toast.success("Developer Mode enabled");
                        window.open("/def-dev", "_blank");
                      }
                    }} 
                  />
                </SettingRow>

                <SettingRow icon={AlertTriangle} title="OEM Unlocking" description="Requires factory reset">
                  <Switch checked={oemUnlocked} onCheckedChange={handleOemUnlockToggle} />
                </SettingRow>

                <SettingRow icon={Smartphone} title="USB Debugging" description="Allow USB connection debugging">
                  <Switch 
                    checked={usbDebugging} 
                    onCheckedChange={(checked) => {
                      setUsbDebugging(checked);
                      handleSave("settings_usb_debugging", checked);
                    }} 
                  />
                </SettingRow>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );

      case "display":
        return (
          <div className="space-y-3">
            <SettingRow icon={Palette} title="Theme" description="Choose your visual style">
              <Select value={theme} onValueChange={(v) => { setTheme(v); handleSave("settings_theme", v); }}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[99999] bg-background border border-border">
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>

            <SettingRow icon={Monitor} title="Resolution" description="Display resolution">
              <Select value={resolution} onValueChange={(v) => { setResolution(v); handleSave("settings_resolution", v); }}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[99999] bg-background border border-border">
                  <SelectItem value="1920x1080">1920 x 1080</SelectItem>
                  <SelectItem value="2560x1440">2560 x 1440</SelectItem>
                  <SelectItem value="3840x2160">3840 x 2160</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>

            <SettingRow icon={Moon} title="Night Light" description="Reduce blue light">
              <Switch 
                checked={nightLight} 
                onCheckedChange={(checked) => { setNightLight(checked); handleSave("settings_night_light", checked); }} 
              />
            </SettingRow>
          </div>
        );

      case "network":
        return (
          <div className="space-y-3">
            <SettingRow icon={Wifi} title="Wi-Fi" description="Wireless network connection">
              <Switch 
                checked={wifiEnabled} 
                onCheckedChange={(checked) => { setWifiEnabled(checked); handleSave("settings_wifi", checked); }} 
              />
            </SettingRow>

            <SettingRow icon={Lock} title="VPN" description="Secure connection">
              <Switch 
                checked={vpnEnabled} 
                onCheckedChange={(checked) => { setVpnEnabled(checked); handleSave("settings_vpn", checked); }} 
              />
            </SettingRow>

            {wifiEnabled && (
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30 space-y-2">
                <div className="text-sm font-medium mb-3">Available Networks</div>
                {["URBANSHADE-SECURE", "FACILITY-GUEST", "SCP-NETWORK"].map(network => (
                  <div key={network} className="flex items-center justify-between p-3 rounded-md bg-background/50 border border-border/30 hover:bg-background/80 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-4 h-4 text-primary" />
                      <span className="text-sm">{network}</span>
                    </div>
                    {network === "URBANSHADE-SECURE" && <Check className="w-4 h-4 text-green-500" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "sound":
        return (
          <div className="space-y-3">
            <div className="p-5 rounded-lg bg-muted/20 border border-border/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">Master Volume</span>
                </div>
                <span className="text-sm text-muted-foreground font-mono">{volume[0]}%</span>
              </div>
              <Slider 
                value={volume} 
                max={100} 
                step={1}
                onValueChange={(v) => { setVolume(v); handleSave("settings_volume", v); }}
                className="w-full"
              />
            </div>

            <SettingRow icon={muteEnabled ? X : Volume2} title="Mute" description="Silence all sounds">
              <Switch 
                checked={muteEnabled} 
                onCheckedChange={(checked) => { setMuteEnabled(checked); handleSave("settings_mute", checked); }} 
              />
            </SettingRow>

            <SettingRow icon={Zap} title="Sound Effects" description="System sounds and alerts">
              <Switch 
                checked={soundEffects} 
                onCheckedChange={(checked) => { setSoundEffects(checked); handleSave("settings_sound_effects", checked); }} 
              />
            </SettingRow>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-3">
            <SettingRow icon={Bell} title="Notifications" description="Enable system notifications">
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={(checked) => { setNotificationsEnabled(checked); handleSave("settings_notifications", checked); }} 
              />
            </SettingRow>

            <SettingRow icon={Moon} title="Do Not Disturb" description="Silence notifications">
              <Switch 
                checked={doNotDisturb} 
                onCheckedChange={(checked) => { setDoNotDisturb(checked); handleSave("settings_dnd", checked); }} 
              />
            </SettingRow>
          </div>
        );

      case "accounts":
        return (
          <div className="space-y-3">
            <div className="p-5 rounded-lg bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Cloud className="w-7 h-7 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{isOnlineMode ? "Connected" : "Offline Mode"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isOnlineMode ? `Signed in as ${profile?.username || user?.email}` : "Sign in to sync your data"}
                  </p>
                </div>
                {isOnlineMode ? (
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button size="sm">Sign In</Button>
                )}
              </div>
            </div>

            {isOnlineMode && syncEnabled && (
              <SettingRow icon={RefreshCw} title="Sync Status" description={lastSyncTime ? `Last synced: ${new Date(lastSyncTime).toLocaleString()}` : "Never synced"}>
                <Button variant="ghost" size="sm" onClick={manualSync} disabled={isSyncing}>
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </SettingRow>
            )}
          </div>
        );

      case "about":
        return (
          <div className="space-y-3">
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 text-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-1">Urbanshade OS</h2>
              <p className="text-muted-foreground text-sm mb-3">Version 3.0.0 Build 2024</p>
              <div className="text-xs text-muted-foreground">Urbanshade Corporation</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input ref={fileInputRef} type="file" accept=".img,.json" onChange={handleImportSystemImage} className="hidden" />
              <Button variant="outline" className="h-11" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import Image
              </Button>
              <Button variant="outline" className="h-11" onClick={handleExportSystemImage}>
                <Download className="w-4 h-4 mr-2" />
                Export Image
              </Button>
            </div>

            <Button 
              variant="destructive" 
              className="w-full h-11"
              onClick={() => setShowFactoryResetDialog(true)}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Factory Reset
            </Button>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <SettingsIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Select a category to view settings</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-background/50">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/30 flex flex-col bg-muted/10">
        <div className="p-3 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background/50 text-sm"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{category.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{category.description}</div>
                  </div>
                  <ChevronRight className={`w-3 h-3 transition-transform ${selectedCategory === category.id ? 'text-primary' : 'text-muted-foreground'}`} />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-5 border-b border-border/30 bg-muted/5">
          <h1 className="text-lg font-bold">{categories.find(c => c.id === selectedCategory)?.name || "Settings"}</h1>
          <p className="text-sm text-muted-foreground">{categories.find(c => c.id === selectedCategory)?.description}</p>
        </div>

        <ScrollArea className="flex-1 p-5">
          {renderContent()}
        </ScrollArea>
      </div>

      {/* Factory Reset Dialog */}
      <Dialog open={showFactoryResetDialog} onOpenChange={setShowFactoryResetDialog}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Factory Reset
            </DialogTitle>
            <DialogDescription>
              This will erase ALL data and settings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFactoryResetDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleFactoryReset}>Reset Everything</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OEM Unlock Dialog */}
      <Dialog open={showOemDialog} onOpenChange={setShowOemDialog}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              OEM Unlock Warning
            </DialogTitle>
            <DialogDescription>
              Changing OEM unlock state requires a factory reset. All data will be erased.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOemDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleOemUnlockConfirm}>Continue with Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
