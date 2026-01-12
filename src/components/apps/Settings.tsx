import { useState, useRef, useEffect } from "react";
import { 
  Settings as SettingsIcon, Monitor, Wifi, Volume2, HardDrive, Users, Clock, 
  Shield, Palette, Accessibility, Bell, Power, Search, Upload, 
  AlertTriangle, Download, ChevronRight, Code, Cloud, RefreshCw, 
  LogOut, Loader2, Zap, Moon, Sun, Eye, Lock, Database, Globe, 
  Smartphone, ChevronDown, Check, X, Cpu, Battery, Trash2, 
  Languages, MousePointer, Keyboard, Info, ExternalLink, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { saveState, loadState } from "@/lib/persistence";
import { toast } from "sonner";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { useAutoSync } from "@/hooks/useAutoSync";
import { trackThemeChange } from "@/hooks/useAchievementTriggers";
import { VERSION } from "@/lib/versionInfo";

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
  const [nightLightIntensity, setNightLightIntensity] = useState(loadState("settings_night_light_intensity", [30]));
  const [theme, setTheme] = useState(loadState("settings_theme", "dark"));
  const [accentColor, setAccentColor] = useState(loadState("settings_accent_color", "cyan"));
  const [transparency, setTransparency] = useState(loadState("settings_transparency", true));
  const [animations, setAnimations] = useState(loadState("settings_animations", true));
  
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

  // Apply night light filter
  useEffect(() => {
    if (nightLight) {
      document.documentElement.style.filter = `sepia(${nightLightIntensity[0]}%) saturate(${100 - nightLightIntensity[0] / 2}%)`;
    } else {
      document.documentElement.style.filter = '';
    }
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [nightLight, nightLightIntensity]);

  // Apply animations preference
  useEffect(() => {
    if (!animations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [animations]);

  const handleSave = (key: string, value: any) => {
    saveState(key, value);
    // Dispatch storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    handleSave("settings_theme", newTheme);
    await trackThemeChange();
    toast.success(`Theme changed to ${newTheme}`);
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

  // Calculate storage usage
  const calculateStorageUsage = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += (localStorage.getItem(key)?.length || 0) * 2; // UTF-16 = 2 bytes
      }
    }
    return {
      used: total,
      usedMB: (total / 1024 / 1024).toFixed(2),
      percentage: Math.min((total / (5 * 1024 * 1024)) * 100, 100) // 5MB limit
    };
  };

  const storage = calculateStorageUsage();

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
    { id: "about", name: "About", icon: Info, description: "System info" },
  ];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    description, 
    children,
    className = ""
  }: { 
    icon: any; 
    title: string; 
    description?: string; 
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card/80 hover:border-border transition-all group ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium text-sm">{title}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );

  const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case "system":
        return (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">UrbanShade OS</h2>
                  <p className="text-muted-foreground">{VERSION.displayVersion} - {VERSION.codename}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">Up to date</span>
                    <span className="text-xs text-muted-foreground">Build {VERSION.build}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">Device Name</div>
                <div className="font-medium">{settings.deviceName || "Urbanshade Terminal"}</div>
              </div>
              <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">Architecture</div>
                <div className="font-medium">64-bit OS</div>
              </div>
            </div>

            <div className="space-y-3">
              <SettingCard icon={RefreshCw} title="Automatic Updates" description="Keep system up to date">
                <Switch 
                  checked={autoUpdates} 
                  onCheckedChange={(checked) => { setAutoUpdates(checked); handleSave("settings_auto_updates", checked); }} 
                />
              </SettingCard>

              <SettingCard icon={Database} title="Telemetry" description="Help improve the system">
                <Switch 
                  checked={telemetry} 
                  onCheckedChange={(checked) => { setTelemetry(checked); handleSave("settings_telemetry", checked); }} 
                />
              </SettingCard>

              <Button 
                className="w-full h-12 rounded-xl"
                onClick={() => {
                  toast.success("Checking for updates...");
                  setTimeout(() => onUpdate?.(), 2000);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check for Updates
              </Button>
            </div>

            {/* Developer Options */}
            <Collapsible open={developerOptionsOpen} onOpenChange={setDeveloperOptionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-14 px-5 border-amber-500/20 hover:bg-amber-500/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Code className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-amber-500">Developer Options</div>
                      <div className="text-xs text-muted-foreground">Advanced debugging tools</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${developerOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3 space-y-3 pl-1">
                <SettingCard icon={Code} title="Developer Mode" description="Enable DEF-DEV console access">
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
                </SettingCard>

                <SettingCard icon={AlertTriangle} title="OEM Unlocking" description="Requires factory reset">
                  <Switch checked={oemUnlocked} onCheckedChange={handleOemUnlockToggle} />
                </SettingCard>

                <SettingCard icon={Smartphone} title="USB Debugging" description="Allow USB connection debugging">
                  <Switch 
                    checked={usbDebugging} 
                    onCheckedChange={(checked) => {
                      setUsbDebugging(checked);
                      handleSave("settings_usb_debugging", checked);
                    }} 
                  />
                </SettingCard>

                <Button 
                  variant="outline" 
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => setShowFactoryResetDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Factory Reset
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );

      case "display":
        return (
          <div className="space-y-6">
            <SectionHeader title="Appearance" description="Customize how your system looks" />
            
            <div className="space-y-3">
              <SettingCard icon={Palette} title="Theme" description="Choose your visual style">
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-32 h-9 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[99999] bg-background border border-border rounded-lg">
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="midnight">Midnight</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                  </SelectContent>
                </Select>
              </SettingCard>

              <SettingCard icon={Sparkles} title="Accent Color" description="Highlight color">
                <Select value={accentColor} onValueChange={(v) => { setAccentColor(v); handleSave("settings_accent_color", v); }}>
                  <SelectTrigger className="w-32 h-9 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[99999] bg-background border border-border rounded-lg">
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </SettingCard>

              <SettingCard icon={Eye} title="Transparency Effects" description="Glass-like UI elements">
                <Switch 
                  checked={transparency} 
                  onCheckedChange={(checked) => { setTransparency(checked); handleSave("settings_transparency", checked); }} 
                />
              </SettingCard>

              <SettingCard icon={Zap} title="Animations" description="Motion and transitions">
                <Switch 
                  checked={animations} 
                  onCheckedChange={(checked) => { setAnimations(checked); handleSave("settings_animations", checked); }} 
                />
              </SettingCard>
            </div>

            <SectionHeader title="Display" description="Screen and resolution settings" />

            <div className="space-y-3">
              <SettingCard icon={Monitor} title="Resolution" description="Display resolution">
                <Select value={resolution} onValueChange={(v) => { setResolution(v); handleSave("settings_resolution", v); }}>
                  <SelectTrigger className="w-36 h-9 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[99999] bg-background border border-border rounded-lg">
                    <SelectItem value="1920x1080">1920 × 1080</SelectItem>
                    <SelectItem value="2560x1440">2560 × 1440</SelectItem>
                    <SelectItem value="3840x2160">3840 × 2160</SelectItem>
                  </SelectContent>
                </Select>
              </SettingCard>

              <div className="p-5 rounded-xl bg-card/50 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Night Light</div>
                      <div className="text-xs text-muted-foreground">Reduce blue light</div>
                    </div>
                  </div>
                  <Switch 
                    checked={nightLight} 
                    onCheckedChange={(checked) => { setNightLight(checked); handleSave("settings_night_light", checked); }} 
                  />
                </div>
                {nightLight && (
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Intensity</span>
                      <span className="text-xs font-mono">{nightLightIntensity[0]}%</span>
                    </div>
                    <Slider 
                      value={nightLightIntensity} 
                      max={100} 
                      step={5}
                      onValueChange={(v) => { setNightLightIntensity(v); handleSave("settings_night_light_intensity", v); }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "network":
        return (
          <div className="space-y-6">
            <SectionHeader title="Network" description="Manage your connections" />

            <div className="space-y-3">
              <SettingCard icon={Wifi} title="Wi-Fi" description={wifiEnabled ? "Connected to URBANSHADE-SECURE" : "Disconnected"}>
                <Switch 
                  checked={wifiEnabled} 
                  onCheckedChange={(checked) => { setWifiEnabled(checked); handleSave("settings_wifi", checked); }} 
                />
              </SettingCard>

              <SettingCard icon={Lock} title="VPN" description={vpnEnabled ? "Connected" : "Not connected"}>
                <Switch 
                  checked={vpnEnabled} 
                  onCheckedChange={(checked) => { setVpnEnabled(checked); handleSave("settings_vpn", checked); }} 
                />
              </SettingCard>
            </div>

            {wifiEnabled && (
              <div className="space-y-3">
                <SectionHeader title="Available Networks" />
                {[
                  { name: "URBANSHADE-SECURE", signal: 4, connected: true, secured: true },
                  { name: "FACILITY-GUEST", signal: 3, connected: false, secured: false },
                  { name: "SCP-NETWORK", signal: 2, connected: false, secured: true },
                ].map(network => (
                  <div key={network.name} className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer ${
                    network.connected 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-card/50 border-border/50 hover:bg-card/80'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Wifi className={`w-5 h-5 ${network.connected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="font-medium text-sm">{network.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {network.secured ? 'Secured' : 'Open'} · Signal: {network.signal}/4
                        </div>
                      </div>
                    </div>
                    {network.connected && <Check className="w-5 h-5 text-primary" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "sound":
        return (
          <div className="space-y-6">
            <SectionHeader title="Sound" description="Audio and volume settings" />

            <div className="p-5 rounded-xl bg-card/50 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Master Volume</span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{volume[0]}%</span>
              </div>
              <Slider 
                value={volume} 
                max={100} 
                step={1}
                onValueChange={(v) => { setVolume(v); handleSave("settings_volume", v); }}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <SettingCard icon={muteEnabled ? X : Volume2} title="Mute" description="Silence all sounds">
                <Switch 
                  checked={muteEnabled} 
                  onCheckedChange={(checked) => { setMuteEnabled(checked); handleSave("settings_mute", checked); }} 
                />
              </SettingCard>

              <SettingCard icon={Zap} title="Sound Effects" description="System sounds and alerts">
                <Switch 
                  checked={soundEffects} 
                  onCheckedChange={(checked) => { setSoundEffects(checked); handleSave("settings_sound_effects", checked); }} 
                />
              </SettingCard>
            </div>
          </div>
        );

      case "storage":
        return (
          <div className="space-y-6">
            <SectionHeader title="Storage" description="Manage your storage space" />

            <div className="p-5 rounded-xl bg-card/50 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Local Storage</div>
                    <div className="text-xs text-muted-foreground">{storage.usedMB} MB used of 5 MB</div>
                  </div>
                </div>
                <span className="text-lg font-mono">{storage.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={storage.percentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 justify-start rounded-xl" onClick={handleExportSystemImage}>
                <Download className="w-5 h-5 mr-3" />
                Export System Image
              </Button>

              <Button variant="outline" className="w-full h-12 justify-start rounded-xl" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-5 h-5 mr-3" />
                Import System Image
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-12 justify-start rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => {
                  const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
                  keys.forEach(k => localStorage.removeItem(k));
                  toast.success(`Cleared ${keys.length} cached items`);
                }}
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Clear Cache
              </Button>
            </div>

            <input 
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportSystemImage}
            />
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <SectionHeader title="Notifications" description="Control how you receive alerts" />

            <div className="space-y-3">
              <SettingCard icon={Bell} title="Notifications" description="Enable system notifications">
                <Switch 
                  checked={notificationsEnabled} 
                  onCheckedChange={(checked) => { setNotificationsEnabled(checked); handleSave("settings_notifications", checked); }} 
                />
              </SettingCard>

              <SettingCard icon={Moon} title="Do Not Disturb" description="Silence all notifications">
                <Switch 
                  checked={doNotDisturb} 
                  onCheckedChange={(checked) => { setDoNotDisturb(checked); handleSave("settings_dnd", checked); }} 
                />
              </SettingCard>
            </div>

            {notificationsEnabled && (
              <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-sm text-muted-foreground">
                  You'll receive notifications for system alerts, messages, and security events.
                </p>
              </div>
            )}
          </div>
        );

      case "power":
        return (
          <div className="space-y-6">
            <SectionHeader title="Power" description="Battery and performance settings" />

            <div className="p-5 rounded-xl bg-card/50 border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Battery className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Connected to power</div>
                </div>
              </div>
            </div>

            <SettingCard icon={Cpu} title="Power Mode" description="Balance performance and efficiency">
              <Select value={powerMode} onValueChange={(v) => { setPowerMode(v); handleSave("settings_power_mode", v); }}>
                <SelectTrigger className="w-36 h-9 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[99999] bg-background border border-border rounded-lg">
                  <SelectItem value="power_saver">Power Saver</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="performance">High Performance</SelectItem>
                </SelectContent>
              </Select>
            </SettingCard>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">UrbanShade OS</h2>
                  <p className="text-muted-foreground">Deep Ocean Edition</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/50">
                  <div className="text-xs text-muted-foreground mb-1">Version</div>
                  <div className="font-medium">3.1.0</div>
                </div>
                <div className="p-4 rounded-xl bg-background/50">
                  <div className="text-xs text-muted-foreground mb-1">Build</div>
                  <div className="font-medium">8247</div>
                </div>
                <div className="p-4 rounded-xl bg-background/50">
                  <div className="text-xs text-muted-foreground mb-1">Kernel</div>
                  <div className="font-medium">URBCORE v5.8.2</div>
                </div>
                <div className="p-4 rounded-xl bg-background/50">
                  <div className="text-xs text-muted-foreground mb-1">Architecture</div>
                  <div className="font-medium">x64</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 justify-start rounded-xl">
                <ExternalLink className="w-5 h-5 mr-3" />
                Documentation
              </Button>
              <Button variant="outline" className="w-full h-12 justify-start rounded-xl">
                <ExternalLink className="w-5 h-5 mr-3" />
                Report an Issue
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              © 2024 UrbanShade Corporation. All rights reserved.
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a category to configure</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="pl-10 bg-muted/50 border-border/50 rounded-xl"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'hover:bg-muted/50 text-foreground'
                }`}
              >
                <cat.icon className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{cat.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{cat.description}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-bold capitalize">{selectedCategory}</h2>
        </div>
        <ScrollArea className="flex-1 p-6">
          {renderContent()}
        </ScrollArea>
      </div>

      {/* Factory Reset Dialog */}
      <Dialog open={showFactoryResetDialog} onOpenChange={setShowFactoryResetDialog}>
        <DialogContent className="bg-background border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Factory Reset
            </DialogTitle>
            <DialogDescription>
              This will erase all data and settings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFactoryResetDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleFactoryReset}>Reset System</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OEM Unlock Dialog */}
      <Dialog open={showOemDialog} onOpenChange={setShowOemDialog}>
        <DialogContent className="bg-background border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {oemUnlocked ? 'Lock OEM' : 'Unlock OEM'}
            </DialogTitle>
            <DialogDescription>
              {oemUnlocked 
                ? 'Locking OEM will require a factory reset.'
                : 'Unlocking OEM will allow custom system modifications but requires a factory reset.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOemDialog(false)}>Cancel</Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-black"
              onClick={handleOemUnlockConfirm}
            >
              Continue & Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
