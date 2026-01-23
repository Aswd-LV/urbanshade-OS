import { useState, useEffect } from "react";
import { 
  Monitor, Volume2, Bell, Palette, Wifi, Shield, Info, 
  RotateCcw, Code, HardDrive, Gauge, Keyboard, Zap,
  ChevronRight, Search, Unlock, Terminal, Trash2, AlertTriangle,
  Sun, Moon, Sparkles, Lock
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { saveState, loadState } from "@/lib/persistence";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { systemBus } from "@/lib/systemBus";

// ============ SETTINGS CONFIG ============

interface SettingItem {
  key: string;
  label: string;
  description?: string;
  type: 'toggle' | 'slider' | 'info' | 'action';
  defaultValue: any;
  min?: number;
  max?: number;
  requiresRestart?: boolean;
  dangerous?: boolean;
  infoValue?: () => string;
  action?: () => void;
  actionLabel?: string;
  icon?: React.ElementType;
}

interface SettingCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description?: string;
  settings: SettingItem[];
}

const getSettingsConfig = (handlers: {
  onOpenDefDev: () => void;
  onOemUnlock: () => void;
  onFactoryReset: () => void;
}): SettingCategory[] => [
  {
    id: 'display',
    name: 'Display',
    icon: Monitor,
    description: 'Screen brightness, night light, and visual effects',
    settings: [
      { key: 'night_light', label: 'Night Light', description: 'Reduce blue light for eye comfort', type: 'toggle', defaultValue: false, icon: Sun },
      { key: 'night_light_intensity', label: 'Night Light Intensity', type: 'slider', defaultValue: 30, min: 10, max: 80 },
      { key: 'brightness', label: 'Brightness', type: 'slider', defaultValue: 80, min: 20, max: 100 },
      { key: 'transparency', label: 'Window Transparency', description: 'Enable glass blur effects', type: 'toggle', defaultValue: true },
      { key: 'animations', label: 'Animations', description: 'Enable UI animations', type: 'toggle', defaultValue: true },
      { key: 'crt_effect', label: 'CRT Effect', description: 'Add retro scan lines', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'sound',
    name: 'Sound',
    icon: Volume2,
    description: 'Volume, audio effects, and notification sounds',
    settings: [
      { key: 'volume', label: 'Master Volume', type: 'slider', defaultValue: 70, min: 0, max: 100 },
      { key: 'mute', label: 'Mute All Sounds', type: 'toggle', defaultValue: false },
      { key: 'sound_effects', label: 'UI Sound Effects', description: 'Play sounds for clicks and alerts', type: 'toggle', defaultValue: true },
      { key: 'notification_sound', label: 'Notification Sounds', description: 'Play sounds for notifications', type: 'toggle', defaultValue: true },
      { key: 'boot_sound', label: 'Boot Sound', description: 'Play sound on system startup', type: 'toggle', defaultValue: true },
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    description: 'Manage alerts and notification preferences',
    settings: [
      { key: 'notifications', label: 'Enable Notifications', type: 'toggle', defaultValue: true },
      { key: 'dnd', label: 'Do Not Disturb', description: 'Silence all notifications', type: 'toggle', defaultValue: false, icon: Moon },
      { key: 'toast_duration', label: 'Toast Duration (seconds)', type: 'slider', defaultValue: 4, min: 2, max: 10 },
      { key: 'desktop_notifications', label: 'Desktop Badges', description: 'Show notification badges on taskbar', type: 'toggle', defaultValue: true },
    ]
  },
  {
    id: 'appearance',
    name: 'Appearance',
    icon: Palette,
    description: 'Themes, colors, and visual customization',
    settings: [
      { key: 'dark_mode', label: 'Dark Mode', description: 'Use dark color scheme', type: 'toggle', defaultValue: true, icon: Moon },
      { key: 'high_contrast', label: 'High Contrast', description: 'Increase visual contrast', type: 'toggle', defaultValue: false },
      { key: 'reduce_motion', label: 'Reduce Motion', description: 'Minimize animations', type: 'toggle', defaultValue: false },
      { key: 'compact_mode', label: 'Compact Mode', description: 'Smaller UI elements', type: 'toggle', defaultValue: false },
      { key: 'blur_effects', label: 'Blur Effects', description: 'Enable backdrop blur', type: 'toggle', defaultValue: true, icon: Sparkles },
    ]
  },
  {
    id: 'network',
    name: 'Network',
    icon: Wifi,
    description: 'Wi-Fi, VPN, and connection settings',
    settings: [
      { key: 'wifi', label: 'Wi-Fi', description: 'Enable wireless networking', type: 'toggle', defaultValue: true },
      { key: 'vpn', label: 'VPN', description: 'Route traffic through VPN', type: 'toggle', defaultValue: false, icon: Lock },
      { key: 'metered_connection', label: 'Metered Connection', description: 'Limit data usage', type: 'toggle', defaultValue: false },
      { key: 'offline_mode', label: 'Offline Mode', description: 'Disable all network features', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    icon: Shield,
    description: 'Security options and data privacy',
    settings: [
      { key: 'telemetry', label: 'Usage Analytics', description: 'Help improve the system', type: 'toggle', defaultValue: false },
      { key: 'auto_updates', label: 'Automatic Updates', description: 'Download updates automatically', type: 'toggle', defaultValue: true },
      { key: 'crash_reports', label: 'Crash Reports', description: 'Send crash reports for debugging', type: 'toggle', defaultValue: true },
      { key: 'lock_after_idle', label: 'Lock After Idle', description: 'Lock screen after inactivity', type: 'toggle', defaultValue: false, icon: Lock },
    ]
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    icon: Keyboard,
    description: 'Shortcuts and input preferences',
    settings: [
      { key: 'keyboard_shortcuts', label: 'Keyboard Shortcuts', description: 'Enable global keyboard shortcuts', type: 'toggle', defaultValue: true },
      { key: 'alt_tab', label: 'Alt+Tab Switcher', description: 'Switch windows with Alt+Tab', type: 'toggle', defaultValue: true },
      { key: 'ctrl_shortcuts', label: 'Ctrl Shortcuts', description: 'Copy, paste, undo, etc.', type: 'toggle', defaultValue: true },
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: HardDrive,
    description: 'Data storage and cache management',
    settings: [
      { 
        key: 'storage_info', 
        label: 'LocalStorage Used', 
        type: 'info', 
        defaultValue: '', 
        infoValue: () => {
          let total = 0;
          for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
              total += localStorage[key].length * 2;
            }
          }
          return `${(total / 1024).toFixed(2)} KB / ~5 MB`;
        }
      },
      { 
        key: 'storage_keys', 
        label: 'Storage Keys', 
        type: 'info', 
        defaultValue: '', 
        infoValue: () => `${localStorage.length} keys`
      },
      { key: 'auto_save', label: 'Auto-Save', description: 'Automatically save changes', type: 'toggle', defaultValue: true },
      { key: 'compress_data', label: 'Compress Data', description: 'Compress saved data to save space', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: Gauge,
    description: 'System performance and optimization',
    settings: [
      { key: 'hardware_acceleration', label: 'Hardware Acceleration', description: 'Use GPU for rendering', type: 'toggle', defaultValue: true },
      { key: 'lazy_loading', label: 'Lazy Loading', description: 'Load components on demand', type: 'toggle', defaultValue: true },
      { key: 'max_windows', label: 'Max Open Windows', type: 'slider', defaultValue: 10, min: 3, max: 20 },
      { key: 'gc_interval', label: 'Cleanup Interval (min)', description: 'Auto garbage collection', type: 'slider', defaultValue: 5, min: 1, max: 15 },
    ]
  },
  {
    id: 'developer',
    name: 'Developer Options',
    icon: Code,
    description: 'Advanced tools for developers',
    settings: [
      { key: 'developer_mode', label: 'Developer Mode', description: 'Enable DEF-DEV console and advanced debugging', type: 'toggle', defaultValue: false, icon: Terminal },
      { 
        key: 'open_defdev', 
        label: 'Open DEF-DEV Console', 
        description: 'Launch the developer console', 
        type: 'action', 
        defaultValue: null,
        actionLabel: 'Launch',
        action: handlers.onOpenDefDev,
        icon: Terminal
      },
      { key: 'debug_overlay', label: 'Debug Overlay', description: 'Show FPS and performance info', type: 'toggle', defaultValue: false },
      { key: 'console_logs', label: 'Verbose Console Logs', description: 'Log all actions to console', type: 'toggle', defaultValue: false },
      { key: 'disable_bugchecks', label: 'Disable Bugchecks', description: 'Suppress bugcheck screens (dangerous)', type: 'toggle', defaultValue: false, dangerous: true },
      { key: 'mock_slow_network', label: 'Simulate Slow Network', description: 'Add artificial latency', type: 'toggle', defaultValue: false },
      { key: 'show_render_outlines', label: 'Render Outlines', description: 'Show component boundaries', type: 'toggle', defaultValue: false },
      { 
        key: 'oem_unlock', 
        label: 'OEM Unlock', 
        description: 'Allow bootloader modifications and custom firmware', 
        type: 'action', 
        defaultValue: null,
        actionLabel: 'Unlock',
        action: handlers.onOemUnlock,
        dangerous: true,
        icon: Unlock
      },
    ]
  },
  {
    id: 'experimental',
    name: 'Experimental',
    icon: Zap,
    description: 'Unstable features and beta options',
    settings: [
      { key: 'experimental_features', label: 'Enable Experimental', description: 'Enable unstable features', type: 'toggle', defaultValue: false, dangerous: true },
      { key: 'new_renderer', label: 'New Render Engine', description: 'Use experimental renderer', type: 'toggle', defaultValue: false, requiresRestart: true },
      { key: 'ai_assist', label: 'AI Assistant', description: 'Enable Navi AI integration', type: 'toggle', defaultValue: false },
      { key: 'beta_updates', label: 'Beta Updates', description: 'Receive beta version updates', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'system',
    name: 'System',
    icon: Info,
    description: 'System information and reset options',
    settings: [
      { key: 'version', label: 'Version', type: 'info', defaultValue: '', infoValue: () => 'UrbanShade OS 2.5.0' },
      { key: 'build', label: 'Build', type: 'info', defaultValue: '', infoValue: () => `US-${Date.now().toString(36).slice(-6).toUpperCase()}` },
      { key: 'platform', label: 'Platform', type: 'info', defaultValue: '', infoValue: () => navigator.platform },
      { key: 'user_agent', label: 'Browser', type: 'info', defaultValue: '', infoValue: () => {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
      }},
      { 
        key: 'factory_reset', 
        label: 'Factory Reset', 
        description: 'Erase all data and restore to defaults', 
        type: 'action', 
        defaultValue: null,
        actionLabel: 'Reset',
        action: handlers.onFactoryReset,
        dangerous: true,
        icon: Trash2
      },
    ]
  },
];

// ============ COMPONENT ============

interface SettingsProps {
  onUpdate?: () => void;
}

const Settings = ({ onUpdate }: SettingsProps) => {
  const [activeCategory, setActiveCategory] = useState('display');
  const [values, setValues] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOemDialog, setShowOemDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [oemUnlocked, setOemUnlocked] = useState(() => loadState('settings_oem_unlocked', false));

  // Handlers for developer options
  const handleOpenDefDev = () => {
    systemBus.openDevMode();
    toast.success('DEF-DEV Console launched');
  };

  const handleOemUnlock = () => {
    setShowOemDialog(true);
  };

  const confirmOemUnlock = () => {
    const newState = !oemUnlocked;
    setOemUnlocked(newState);
    saveState('settings_oem_unlocked', newState);
    setShowOemDialog(false);
    toast.success(newState ? 'OEM Unlock enabled' : 'OEM Unlock disabled');
  };

  const handleFactoryReset = () => {
    setShowResetDialog(true);
  };

  const confirmFactoryReset = () => {
    // Clear all localStorage
    localStorage.clear();
    sessionStorage.clear();
    setShowResetDialog(false);
    toast.success('Factory reset complete. Reloading...');
    setTimeout(() => window.location.reload(), 1500);
  };

  const settingsConfig = getSettingsConfig({
    onOpenDefDev: handleOpenDefDev,
    onOemUnlock: handleOemUnlock,
    onFactoryReset: handleFactoryReset,
  });

  // Load all settings from localStorage on mount
  useEffect(() => {
    const loaded: Record<string, any> = {};
    settingsConfig.forEach(category => {
      category.settings.forEach(setting => {
        if (setting.type !== 'info' && setting.type !== 'action') {
          const storageKey = `settings_${setting.key}`;
          loaded[setting.key] = loadState(storageKey, setting.defaultValue);
        }
      });
    });
    setValues(loaded);
    setIsLoaded(true);
  }, []);

  // Apply effects when values change
  useEffect(() => {
    if (!isLoaded) return;

    // Night light effect
    if (values.night_light) {
      const intensity = values.night_light_intensity || 30;
      document.documentElement.style.filter = `sepia(${intensity}%) saturate(${100 - intensity / 2}%)`;
    } else {
      document.documentElement.style.filter = '';
    }

    // Reduce motion
    if (values.reduce_motion || !values.animations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Render outlines (dev)
    if (values.show_render_outlines) {
      document.documentElement.classList.add('debug-outlines');
    } else {
      document.documentElement.classList.remove('debug-outlines');
    }

    // Broadcast settings change
    window.dispatchEvent(new Event('storage'));
  }, [values, isLoaded]);

  // Update a single setting
  const updateValue = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
    saveState(`settings_${key}`, value);
  };

  // Reset all to defaults
  const resetAll = () => {
    const defaults: Record<string, any> = {};
    settingsConfig.forEach(category => {
      category.settings.forEach(setting => {
        if (setting.type !== 'info' && setting.type !== 'action') {
          defaults[setting.key] = setting.defaultValue;
          saveState(`settings_${setting.key}`, setting.defaultValue);
        }
      });
    });
    setValues(defaults);
    window.dispatchEvent(new Event('storage'));
    toast.success('Settings reset to defaults');
  };

  // Filter settings by search
  const filteredCategories = searchQuery 
    ? settingsConfig.map(cat => ({
        ...cat,
        settings: cat.settings.filter(s => 
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(cat => cat.settings.length > 0)
    : settingsConfig;

  const currentCategory = searchQuery 
    ? null 
    : settingsConfig.find(c => c.id === activeCategory);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/40 bg-muted/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/40">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            Settings
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 h-9"
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <div className="px-2 space-y-0.5">
            {settingsConfig.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id && !searchQuery;
              return (
                <button
                  key={category.id}
                  onClick={() => { setActiveCategory(category.id); setSearchQuery(''); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group",
                    isActive 
                      ? "bg-primary/15 text-primary shadow-sm" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isActive ? "bg-primary/20" : "bg-muted/50 group-hover:bg-muted"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium flex-1">{category.name}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity",
                    isActive && "opacity-100"
                  )} />
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border/40">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetAll}
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-2xl">
            {searchQuery ? (
              // Search Results
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground">Search Results</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Found {filteredCategories.reduce((acc, cat) => acc + cat.settings.length, 0)} matching settings
                  </p>
                </div>
                <div className="space-y-6">
                  {filteredCategories.map(category => (
                    <div key={category.id} className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                        {category.name}
                      </h4>
                      <div className="space-y-1 bg-muted/20 rounded-xl p-2">
                        {category.settings.map(setting => (
                          <SettingRow
                            key={setting.key}
                            setting={setting}
                            value={values[setting.key]}
                            onChange={(val) => updateValue(setting.key, val)}
                            oemUnlocked={oemUnlocked}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : currentCategory ? (
              // Category View
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <currentCategory.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{currentCategory.name}</h3>
                      {currentCategory.description && (
                        <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 bg-muted/20 rounded-xl p-2">
                  {currentCategory.settings.map(setting => (
                    <SettingRow
                      key={setting.key}
                      setting={setting}
                      value={values[setting.key]}
                      onChange={(val) => updateValue(setting.key, val)}
                      oemUnlocked={oemUnlocked}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </ScrollArea>
      </div>

      {/* OEM Unlock Dialog */}
      <AlertDialog open={showOemDialog} onOpenChange={setShowOemDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {oemUnlocked ? 'Disable OEM Unlock?' : 'Enable OEM Unlock?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {oemUnlocked 
                ? 'This will re-enable bootloader protection and disable custom firmware options.'
                : 'This will unlock the bootloader and allow custom firmware modifications. This may void your warranty and could make the system unstable.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmOemUnlock}
              className={oemUnlocked ? "" : "bg-amber-600 hover:bg-amber-700"}
            >
              {oemUnlocked ? 'Disable' : 'Unlock'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Factory Reset Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Factory Reset
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your data, settings, and customizations. The system will restart and return to its default state. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmFactoryReset}
              className="bg-destructive hover:bg-destructive/90"
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ============ SETTING ROW COMPONENT ============

interface SettingRowProps {
  setting: SettingItem;
  value: any;
  onChange: (value: any) => void;
  oemUnlocked?: boolean;
}

const SettingRow = ({ setting, value, onChange, oemUnlocked }: SettingRowProps) => {
  const Icon = setting.icon;

  if (setting.type === 'info') {
    const displayValue = setting.infoValue ? setting.infoValue() : value;
    return (
      <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm font-medium text-foreground">{setting.label}</span>
        </div>
        <span className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
          {displayValue}
        </span>
      </div>
    );
  }

  if (setting.type === 'action') {
    return (
      <div className={cn(
        "flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors",
        setting.dangerous && "border border-destructive/20 bg-destructive/5"
      )}>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              setting.dangerous ? "bg-destructive/20" : "bg-muted/50"
            )}>
              <Icon className={cn(
                "w-4 h-4",
                setting.dangerous ? "text-destructive" : "text-muted-foreground"
              )} />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-foreground flex items-center gap-2">
              {setting.label}
              {setting.key === 'oem_unlock' && oemUnlocked && (
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded font-semibold">
                  UNLOCKED
                </span>
              )}
            </div>
            {setting.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
            )}
          </div>
        </div>
        <Button 
          size="sm" 
          variant={setting.dangerous ? "destructive" : "secondary"}
          onClick={setting.action}
          className="h-8"
        >
          {setting.key === 'oem_unlock' ? (oemUnlocked ? 'Lock' : 'Unlock') : setting.actionLabel}
        </Button>
      </div>
    );
  }

  if (setting.type === 'toggle') {
    return (
      <div className={cn(
        "flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors",
        setting.dangerous && "border border-destructive/20 bg-destructive/5"
      )}>
        <div className="flex items-center gap-3 flex-1 pr-4">
          {Icon && (
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              setting.dangerous ? "bg-destructive/20" : "bg-muted/50"
            )}>
              <Icon className={cn(
                "w-4 h-4",
                setting.dangerous ? "text-destructive" : "text-muted-foreground"
              )} />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-foreground flex items-center gap-2">
              {setting.label}
              {setting.dangerous && (
                <span className="text-[10px] px-1.5 py-0.5 bg-destructive/20 text-destructive rounded font-semibold">
                  DANGER
                </span>
              )}
              {setting.requiresRestart && (
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded font-semibold">
                  RESTART
                </span>
              )}
            </div>
            {setting.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
            )}
          </div>
        </div>
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onChange}
        />
      </div>
    );
  }

  if (setting.type === 'slider') {
    return (
      <div className="py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">{setting.label}</span>
          <span className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
            {value}
          </span>
        </div>
        <Slider
          value={[value]}
          onValueChange={([val]) => onChange(val)}
          min={setting.min}
          max={setting.max}
          step={1}
          className="w-full"
        />
      </div>
    );
  }

  return null;
};

export default Settings;
