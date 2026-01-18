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
        total += (localStorage.getItem(key)?.length || 0) * 2;
      }
    }
    return {
      used: total,
      usedMB: (total / 1024 / 1024).toFixed(2),
      percentage: Math.min((total / (5 * 1024 * 1024)) * 100, 100)
    };
  };

  const storage = calculateStorageUsage();

  const categories = [
    { id: "system", name: "System", icon: Monitor, description: "Updates, power & info" },
    { id: "display", name: "Personalization", icon: Palette, description: "Theme, sound, visuals" },
    { id: "network", name: "Network", icon: Wifi, description: "Wi-Fi, VPN" },
    { id: "storage", name: "Storage & Data", icon: HardDrive, description: "Backup, import/export" },
    { id: "accounts", name: "Accounts & Sync", icon: Users, description: "Profile, cloud sync" },
    { id: "notifications", name: "Notifications", icon: Bell, description: "Alerts, DND" },
    { id: "about", name: "About", icon: Info, description: "System info" },
  ];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simple Row component - label on left, control on right (separated)
  const SettingRow = ({ 
    icon: Icon, 
    title, 
    description,
    children
  }: { 
    icon: any; 
    title: string; 
    description?: string; 
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-card/40 border border-border/30 hover:bg-card/60 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm">{title}</div>
          {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
        </div>
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  // Toggle Row - specifically for switches
  const ToggleRow = ({
    icon: Icon,
    title,
    description,
    checked,
    onCheckedChange
  }: {
    icon: any;
    title: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-card/40 border border-border/30 hover:bg-card/60 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm">{title}</div>
          {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );

  // Dropdown Row - specifically for selects
  const SelectRow = ({
    icon: Icon,
    title,
    description,
    value,
    onValueChange,
    options
  }: {
    icon: any;
    title: string;
    description?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-card/40 border border-border/30 hover:bg-card/60 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm">{title}</div>
          {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
        </div>
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[99999]">
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-3 mt-6 first:mt-0">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case "system":
        return (
          <div className="space-y-2">
            {/* Hero Card */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">UrbanShade OS</h2>
                  <p className="text-sm text-muted-foreground">{VERSION.displayVersion} - {VERSION.codename}</p>
                  <span className="text-xs text-muted-foreground">Build {VERSION.build}</span>
                </div>
              </div>
            </div>

            <SectionHeader title="Updates" />
            
            <ToggleRow
              icon={RefreshCw}
              title="Automatic Updates"
              description="Keep system up to date"
              checked={autoUpdates}
              onCheckedChange={(checked) => { setAutoUpdates(checked); handleSave("settings_auto_updates", checked); }}
            />

            <ToggleRow
              icon={Database}
              title="Telemetry"
              description="Help improve the system"
              checked={telemetry}
              onCheckedChange={(checked) => { setTelemetry(checked); handleSave("settings_telemetry", checked); }}
            />

            <Button 
              className="w-full h-10 mt-3"
              onClick={() => {
                toast.success("Checking for updates...");
                setTimeout(() => onUpdate?.(), 2000);
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check for Updates
            </Button>

            {/* Developer Options */}
            <Collapsible open={developerOptionsOpen} onOpenChange={setDeveloperOptionsOpen} className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 px-4 border-amber-500/20 hover:bg-amber-500/5">
                  <div className="flex items-center gap-3">
                    <Code className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500">Developer Options</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${developerOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2 space-y-2">
                <ToggleRow
                  icon={Code}
                  title="Developer Mode"
                  description="Enable DEF-DEV console"
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

                <ToggleRow
                  icon={AlertTriangle}
                  title="OEM Unlocking"
                  description="Requires factory reset"
                  checked={oemUnlocked}
                  onCheckedChange={handleOemUnlockToggle}
                />

                <ToggleRow
                  icon={Smartphone}
                  title="USB Debugging"
                  description="Allow USB debugging"
                  checked={usbDebugging}
                  onCheckedChange={(checked) => {
                    setUsbDebugging(checked);
                    handleSave("settings_usb_debugging", checked);
                  }}
                />

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
          <div className="space-y-2">
            <SectionHeader title="Appearance" />
            
            <SelectRow
              icon={Palette}
              title="Theme"
              description="Visual style"
              value={theme}
              onValueChange={handleThemeChange}
              options={[
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
                { value: "system", label: "System" },
                { value: "midnight", label: "Midnight" },
                { value: "ocean", label: "Ocean" },
              ]}
            />

            <SelectRow
              icon={Sparkles}
              title="Accent Color"
              description="Highlight color"
              value={accentColor}
              onValueChange={(v) => { setAccentColor(v); handleSave("settings_accent_color", v); }}
              options={[
                { value: "cyan", label: "Cyan" },
                { value: "purple", label: "Purple" },
                { value: "green", label: "Green" },
                { value: "orange", label: "Orange" },
                { value: "pink", label: "Pink" },
              ]}
            />

            <ToggleRow
              icon={Eye}
              title="Transparency Effects"
              description="Glass-like UI"
              checked={transparency}
              onCheckedChange={(checked) => { setTransparency(checked); handleSave("settings_transparency", checked); }}
            />

            <ToggleRow
              icon={Zap}
              title="Animations"
              description="Motion and transitions"
              checked={animations}
              onCheckedChange={(checked) => { setAnimations(checked); handleSave("settings_animations", checked); }}
            />

            <SectionHeader title="Sound" />
            
            <div className="py-3 px-4 rounded-lg bg-card/40 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Master Volume</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{volume[0]}%</span>
              </div>
              <Slider 
                value={volume} 
                max={100} 
                step={1}
                onValueChange={(v) => { setVolume(v); handleSave("settings_volume", v); }}
              />
            </div>

            <ToggleRow
              icon={muteEnabled ? X : Volume2}
              title="Mute"
              description="Silence all sounds"
              checked={muteEnabled}
              onCheckedChange={(checked) => { setMuteEnabled(checked); handleSave("settings_mute", checked); }}
            />

            <ToggleRow
              icon={Zap}
              title="Sound Effects"
              description="System sounds"
              checked={soundEffects}
              onCheckedChange={(checked) => { setSoundEffects(checked); handleSave("settings_sound_effects", checked); }}
            />

            <SectionHeader title="Display" />

            <SelectRow
              icon={Monitor}
              title="Resolution"
              value={resolution}
              onValueChange={(v) => { setResolution(v); handleSave("settings_resolution", v); }}
              options={[
                { value: "1920x1080", label: "1920×1080" },
                { value: "2560x1440", label: "2560×1440" },
                { value: "3840x2160", label: "3840×2160" },
              ]}
            />

            <div className="py-3 px-4 rounded-lg bg-card/40 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Moon className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Night Light</div>
                    <div className="text-xs text-muted-foreground">Reduce blue light</div>
                  </div>
                </div>
                <Switch 
                  checked={nightLight} 
                  onCheckedChange={(checked) => { setNightLight(checked); handleSave("settings_night_light", checked); }} 
                />
              </div>
              {nightLight && (
                <div className="pt-3 mt-2 border-t border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Intensity</span>
                    <span className="text-xs font-mono">{nightLightIntensity[0]}%</span>
                  </div>
                  <Slider 
                    value={nightLightIntensity} 
                    max={100} 
                    step={5}
                    onValueChange={(v) => { setNightLightIntensity(v); handleSave("settings_night_light_intensity", v); }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "network":
        return (
          <div className="space-y-2">
            <SectionHeader title="Connections" />

            <ToggleRow
              icon={Wifi}
              title="Wi-Fi"
              description={wifiEnabled ? "Connected" : "Disconnected"}
              checked={wifiEnabled}
              onCheckedChange={(checked) => { setWifiEnabled(checked); handleSave("settings_wifi", checked); }}
            />

            <ToggleRow
              icon={Lock}
              title="VPN"
              description={vpnEnabled ? "Connected" : "Not connected"}
              checked={vpnEnabled}
              onCheckedChange={(checked) => { setVpnEnabled(checked); handleSave("settings_vpn", checked); }}
            />

            {wifiEnabled && (
              <>
                <SectionHeader title="Available Networks" />
                {[
                  { name: "URBANSHADE-SECURE", signal: 4, connected: true, secured: true },
                  { name: "FACILITY-GUEST", signal: 3, connected: false, secured: false },
                  { name: "SCP-NETWORK", signal: 2, connected: false, secured: true },
                ].map(network => (
                  <div key={network.name} className={`flex items-center justify-between py-3 px-4 rounded-lg border cursor-pointer transition-colors ${
                    network.connected 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-card/40 border-border/30 hover:bg-card/60'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Wifi className={`w-4 h-4 ${network.connected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="text-sm font-medium">{network.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {network.secured ? 'Secured' : 'Open'} · Signal: {network.signal}/4
                        </div>
                      </div>
                    </div>
                    {network.connected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                ))}
              </>
            )}
          </div>
        );

      case "storage":
        return (
          <div className="space-y-2">
            <SectionHeader title="Storage" />

            <div className="py-3 px-4 rounded-lg bg-card/40 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HardDrive className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Local Storage</div>
                    <div className="text-xs text-muted-foreground">{storage.usedMB} MB of 5 MB</div>
                  </div>
                </div>
                <span className="text-sm font-mono">{storage.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={storage.percentage} className="h-1.5" />
            </div>

            <SectionHeader title="Backup & Restore" />

            <Button variant="outline" className="w-full justify-start h-10" onClick={handleExportSystemImage}>
              <Download className="w-4 h-4 mr-2" />
              Export System Image
            </Button>

            <Button variant="outline" className="w-full justify-start h-10" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import System Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportSystemImage}
            />
          </div>
        );

      case "accounts":
        return (
          <div className="space-y-2">
            <SectionHeader title="Account" />

            {user ? (
              <div className="py-3 px-4 rounded-lg bg-card/40 border border-border/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{profile?.display_name || profile?.username}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="py-4 px-4 rounded-lg bg-card/40 border border-border/30 text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Not signed in</div>
                <div className="text-xs text-muted-foreground">Sign in to sync settings</div>
              </div>
            )}

            <SectionHeader title="Sync" />

            <div className="py-3 px-4 rounded-lg bg-card/40 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Cloud Sync</span>
                </div>
                <span className={`text-xs ${syncEnabled ? 'text-green-400' : 'text-muted-foreground'}`}>
                  {syncEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {lastSyncTime && (
                <div className="text-xs text-muted-foreground">
                  Last sync: {new Date(lastSyncTime).toLocaleString()}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={manualSync}
                disabled={isSyncing || !user}
              >
                {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Sync Now
              </Button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-2">
            <SectionHeader title="Notifications" />

            <ToggleRow
              icon={Bell}
              title="Notifications"
              description="Show notifications"
              checked={notificationsEnabled}
              onCheckedChange={(checked) => { setNotificationsEnabled(checked); handleSave("settings_notifications", checked); }}
            />

            <ToggleRow
              icon={Moon}
              title="Do Not Disturb"
              description="Silence notifications"
              checked={doNotDisturb}
              onCheckedChange={(checked) => { setDoNotDisturb(checked); handleSave("settings_dnd", checked); }}
            />
          </div>
        );

      case "about":
        return (
          <div className="space-y-2">
            <SectionHeader title="System Information" />

            <div className="py-4 px-4 rounded-lg bg-card/40 border border-border/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">OS Name</span>
                <span className="text-sm font-medium">UrbanShade OS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-medium">{VERSION.displayVersion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Codename</span>
                <span className="text-sm font-medium">{VERSION.codename}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Build</span>
                <span className="text-sm font-mono">{VERSION.build}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Device</span>
                <span className="text-sm font-medium">{settings.deviceName || "Terminal"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Architecture</span>
                <span className="text-sm font-medium">64-bit</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <a href="https://urbanshade.lovable.app" target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </a>
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-56 border-r border-border/50 flex flex-col">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search settings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {filteredCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 max-w-xl">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>

      {/* Factory Reset Dialog */}
      <Dialog open={showFactoryResetDialog} onOpenChange={setShowFactoryResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Factory Reset
            </DialogTitle>
            <DialogDescription>
              This will erase all data including accounts, settings, and installed apps. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFactoryResetDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleFactoryReset}>Reset Everything</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OEM Dialog */}
      <Dialog open={showOemDialog} onOpenChange={setShowOemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              {oemUnlocked ? 'Lock OEM' : 'Unlock OEM'}
            </DialogTitle>
            <DialogDescription>
              {oemUnlocked 
                ? 'Locking OEM will require a factory reset.'
                : 'Unlocking OEM allows custom system modifications. This requires a factory reset.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOemDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleOemUnlockConfirm}>
              {oemUnlocked ? 'Lock & Reset' : 'Unlock & Reset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
