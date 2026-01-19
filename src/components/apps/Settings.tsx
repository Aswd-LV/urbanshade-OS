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
  
  // System settings - each with individual state
  const [autoUpdates, setAutoUpdates] = useState(() => loadState("settings_auto_updates", true));
  const [telemetry, setTelemetry] = useState(() => loadState("settings_telemetry", false));
  const [powerMode, setPowerMode] = useState(() => loadState("settings_power_mode", "balanced"));
  const [oemUnlocked, setOemUnlocked] = useState(() => loadState("settings_oem_unlocked", false));
  const [developerMode, setDeveloperMode] = useState(() => loadState("settings_developer_mode", false));
  const [usbDebugging, setUsbDebugging] = useState(() => loadState("settings_usb_debugging", false));
  
  // Display settings
  const [resolution, setResolution] = useState(() => loadState("settings_resolution", "1920x1080"));
  const [nightLight, setNightLight] = useState(() => loadState("settings_night_light", false));
  const [nightLightIntensity, setNightLightIntensity] = useState(() => loadState("settings_night_light_intensity", [30]));
  const [theme, setTheme] = useState(() => loadState("settings_theme", "dark"));
  const [accentColor, setAccentColor] = useState(() => loadState("settings_accent_color", "cyan"));
  const [transparency, setTransparency] = useState(() => loadState("settings_transparency", true));
  const [animations, setAnimations] = useState(() => loadState("settings_animations", true));
  
  // Network settings
  const [wifiEnabled, setWifiEnabled] = useState(() => loadState("settings_wifi", true));
  const [vpnEnabled, setVpnEnabled] = useState(() => loadState("settings_vpn", false));
  
  // Sound settings
  const [volume, setVolume] = useState(() => loadState("settings_volume", [70]));
  const [muteEnabled, setMuteEnabled] = useState(() => loadState("settings_mute", false));
  const [soundEffects, setSoundEffects] = useState(() => loadState("settings_sound_effects", true));
  
  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => loadState("settings_notifications", true));
  const [doNotDisturb, setDoNotDisturb] = useState(() => loadState("settings_dnd", false));

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

  const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-4 mt-6 first:mt-0">
      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    description,
    children,
    accent = "cyan"
  }: { 
    icon: any; 
    title: string; 
    description?: string; 
    children: React.ReactNode;
    accent?: string;
  }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-slate-600/50 transition-all group">
      <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
        <div className={`w-10 h-10 rounded-xl bg-${accent}-500/10 border border-${accent}-500/20 flex items-center justify-center text-${accent}-400 shrink-0 group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm text-slate-200">{title}</div>
          {description && <div className="text-xs text-slate-500 truncate">{description}</div>}
        </div>
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case "system":
        return (
          <div className="space-y-3">
            {/* Hero Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 via-slate-900/50 to-slate-900/50 border border-cyan-500/20 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">UrbanShade OS</h2>
                  <p className="text-sm text-cyan-400">{VERSION.displayVersion} - {VERSION.codename}</p>
                  <span className="text-xs text-slate-500">Build {VERSION.build}</span>
                </div>
              </div>
            </div>

            <SectionHeader title="Updates" />
            
            <SettingCard icon={RefreshCw} title="Automatic Updates" description="Keep system up to date">
              <Switch 
                checked={autoUpdates} 
                onCheckedChange={(checked) => {
                  setAutoUpdates(checked);
                  handleSave("settings_auto_updates", checked);
                }}
              />
            </SettingCard>

            <SettingCard icon={Database} title="Telemetry" description="Help improve the system">
              <Switch 
                checked={telemetry} 
                onCheckedChange={(checked) => {
                  setTelemetry(checked);
                  handleSave("settings_telemetry", checked);
                }}
              />
            </SettingCard>

            <Button 
              className="w-full h-11 mt-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              variant="outline"
              onClick={() => {
                toast.success("Checking for updates...");
                setTimeout(() => onUpdate?.(), 2000);
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check for Updates
            </Button>

            {/* Developer Options */}
            <Collapsible open={developerOptionsOpen} onOpenChange={setDeveloperOptionsOpen} className="mt-6">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 px-4 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400">
                  <div className="flex items-center gap-3">
                    <Code className="w-4 h-4" />
                    <span>Developer Options</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${developerOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3 space-y-3">
                <SettingCard icon={Code} title="Developer Mode" description="Enable DEF-DEV console" accent="amber">
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

                <SettingCard icon={AlertTriangle} title="OEM Unlocking" description="Requires factory reset" accent="red">
                  <Switch 
                    checked={oemUnlocked}
                    onCheckedChange={handleOemUnlockToggle}
                  />
                </SettingCard>

                <SettingCard icon={Smartphone} title="USB Debugging" description="Allow USB debugging" accent="amber">
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
          <div className="space-y-3">
            <SectionHeader title="Appearance" />
            
            <SettingCard icon={Palette} title="Theme" description="Visual style">
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32 h-9 text-xs bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[99999] bg-slate-900 border-slate-700">
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
                <SelectTrigger className="w-32 h-9 text-xs bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[99999] bg-slate-900 border-slate-700">
                  <SelectItem value="cyan">Cyan</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                </SelectContent>
              </Select>
            </SettingCard>

            <SettingCard icon={Eye} title="Transparency Effects" description="Glass-like UI">
              <Switch 
                checked={transparency}
                onCheckedChange={(checked) => {
                  setTransparency(checked);
                  handleSave("settings_transparency", checked);
                }}
              />
            </SettingCard>

            <SettingCard icon={Zap} title="Animations" description="Motion and transitions">
              <Switch 
                checked={animations}
                onCheckedChange={(checked) => {
                  setAnimations(checked);
                  handleSave("settings_animations", checked);
                }}
              />
            </SettingCard>

            <SectionHeader title="Sound" />
            
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">Master Volume</span>
                </div>
                <span className="text-sm font-mono text-cyan-400">{volume[0]}%</span>
              </div>
              <Slider 
                value={volume} 
                max={100} 
                step={1}
                onValueChange={(v) => { setVolume(v); handleSave("settings_volume", v); }}
                className="[&_[role=slider]]:bg-cyan-400"
              />
            </div>

            <SettingCard icon={muteEnabled ? X : Volume2} title="Mute" description="Silence all sounds">
              <Switch 
                checked={muteEnabled}
                onCheckedChange={(checked) => {
                  setMuteEnabled(checked);
                  handleSave("settings_mute", checked);
                }}
              />
            </SettingCard>

            <SettingCard icon={Zap} title="Sound Effects" description="System sounds">
              <Switch 
                checked={soundEffects}
                onCheckedChange={(checked) => {
                  setSoundEffects(checked);
                  handleSave("settings_sound_effects", checked);
                }}
              />
            </SettingCard>

            <SectionHeader title="Display" />

            <SettingCard icon={Monitor} title="Resolution">
              <Select value={resolution} onValueChange={(v) => { setResolution(v); handleSave("settings_resolution", v); }}>
                <SelectTrigger className="w-32 h-9 text-xs bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[99999] bg-slate-900 border-slate-700">
                  <SelectItem value="1920x1080">1920×1080</SelectItem>
                  <SelectItem value="2560x1440">2560×1440</SelectItem>
                  <SelectItem value="3840x2160">3840×2160</SelectItem>
                </SelectContent>
              </Select>
            </SettingCard>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">Night Light</div>
                    <div className="text-xs text-slate-500">Reduce blue light</div>
                  </div>
                </div>
                <Switch 
                  checked={nightLight}
                  onCheckedChange={(checked) => {
                    setNightLight(checked);
                    handleSave("settings_night_light", checked);
                  }}
                />
              </div>
              {nightLight && (
                <div className="pt-4 mt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Intensity</span>
                    <span className="text-xs font-mono text-amber-400">{nightLightIntensity[0]}%</span>
                  </div>
                  <Slider 
                    value={nightLightIntensity} 
                    max={100} 
                    step={5}
                    onValueChange={(v) => { setNightLightIntensity(v); handleSave("settings_night_light_intensity", v); }}
                    className="[&_[role=slider]]:bg-amber-400"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "network":
        return (
          <div className="space-y-3">
            <SectionHeader title="Connections" />

            <SettingCard icon={Wifi} title="Wi-Fi" description={wifiEnabled ? "Connected" : "Disconnected"}>
              <Switch 
                checked={wifiEnabled}
                onCheckedChange={(checked) => {
                  setWifiEnabled(checked);
                  handleSave("settings_wifi", checked);
                }}
              />
            </SettingCard>

            <SettingCard icon={Lock} title="VPN" description={vpnEnabled ? "Connected" : "Not connected"}>
              <Switch 
                checked={vpnEnabled}
                onCheckedChange={(checked) => {
                  setVpnEnabled(checked);
                  handleSave("settings_vpn", checked);
                }}
              />
            </SettingCard>

            {wifiEnabled && (
              <>
                <SectionHeader title="Available Networks" />
                {[
                  { name: "URBANSHADE-SECURE", signal: 4, connected: true, secured: true },
                  { name: "FACILITY-GUEST", signal: 3, connected: false, secured: false },
                  { name: "SCP-NETWORK", signal: 2, connected: false, secured: true },
                ].map(network => (
                  <div key={network.name} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    network.connected 
                      ? 'bg-cyan-500/10 border-cyan-500/30' 
                      : 'bg-slate-900/60 border-slate-700/50 hover:border-slate-600/50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <Wifi className={`w-5 h-5 ${network.connected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-sm font-medium text-slate-200">{network.name}</div>
                        <div className="text-xs text-slate-500">
                          {network.secured ? 'Secured' : 'Open'} · Signal: {network.signal}/4
                        </div>
                      </div>
                    </div>
                    {network.connected && <Check className="w-5 h-5 text-cyan-400" />}
                  </div>
                ))}
              </>
            )}
          </div>
        );

      case "storage":
        return (
          <div className="space-y-3">
            <SectionHeader title="Storage" />

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">Local Storage</div>
                    <div className="text-xs text-slate-500">{storage.usedMB} MB of 5 MB</div>
                  </div>
                </div>
                <span className="text-sm font-mono text-cyan-400">{storage.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={storage.percentage} className="h-2" />
            </div>

            <SectionHeader title="Backup & Restore" />

            <Button 
              variant="outline" 
              className="w-full justify-start h-12 bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/60" 
              onClick={handleExportSystemImage}
            >
              <Download className="w-4 h-4 mr-3 text-cyan-400" />
              Export System Image
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-12 bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/60" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-3 text-cyan-400" />
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
          <div className="space-y-3">
            <SectionHeader title="Account" />

            {user ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{profile?.display_name || profile?.username}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10" 
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-700/50 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-500" />
                </div>
                <div className="text-sm text-slate-400">Not signed in</div>
                <div className="text-xs text-slate-600 mt-1">Sign in to sync settings</div>
              </div>
            )}

            <SectionHeader title="Sync" />

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium text-slate-200">Cloud Sync</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${syncEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {syncEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {lastSyncTime && (
                <div className="text-xs text-slate-500 mb-3">
                  Last sync: {new Date(lastSyncTime).toLocaleString()}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700"
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
          <div className="space-y-3">
            <SectionHeader title="Notifications" />

            <SettingCard icon={Bell} title="Notifications" description="Show notifications">
              <Switch 
                checked={notificationsEnabled}
                onCheckedChange={(checked) => {
                  setNotificationsEnabled(checked);
                  handleSave("settings_notifications", checked);
                }}
              />
            </SettingCard>

            <SettingCard icon={Moon} title="Do Not Disturb" description="Silence notifications">
              <Switch 
                checked={doNotDisturb}
                onCheckedChange={(checked) => {
                  setDoNotDisturb(checked);
                  handleSave("settings_dnd", checked);
                }}
              />
            </SettingCard>
          </div>
        );

      case "about":
        return (
          <div className="space-y-3">
            <SectionHeader title="System Information" />

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-4">
              {[
                { label: "OS Name", value: "UrbanShade OS" },
                { label: "Version", value: VERSION.displayVersion },
                { label: "Codename", value: VERSION.codename },
                { label: "Build", value: VERSION.build, mono: true },
                { label: "Device", value: settings.deviceName || "Terminal" },
                { label: "Architecture", value: "64-bit" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className={`text-sm text-slate-200 ${item.mono ? 'font-mono' : ''}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full h-11 bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/60" asChild>
              <a href="https://urbanshade.lovable.app" target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-2 text-cyan-400" />
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
    <div className="h-full flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <div className="w-60 border-r border-slate-700/50 flex flex-col bg-slate-900/30">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search settings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm bg-slate-800/50 border-slate-700 focus:border-cyan-500/50"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {filteredCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
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
          <div className="p-6 max-w-2xl">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>

      {/* Factory Reset Dialog */}
      <Dialog open={showFactoryResetDialog} onOpenChange={setShowFactoryResetDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Factory Reset
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              This will erase all data including accounts, settings, and installed apps. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFactoryResetDialog(false)} className="border-slate-600">Cancel</Button>
            <Button variant="destructive" onClick={handleFactoryReset}>Reset Everything</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OEM Dialog */}
      <Dialog open={showOemDialog} onOpenChange={setShowOemDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              {oemUnlocked ? 'Lock OEM' : 'Unlock OEM'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {oemUnlocked 
                ? 'Locking OEM will require a factory reset.'
                : 'Unlocking OEM allows custom system modifications. This requires a factory reset.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOemDialog(false)} className="border-slate-600">Cancel</Button>
            <Button variant="destructive" onClick={handleOemUnlockConfirm}>
              {oemUnlocked ? 'Lock & Reset' : 'Unlock & Reset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
