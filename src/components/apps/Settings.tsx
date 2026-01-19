import { useState, useEffect } from "react";
import { 
  Monitor, Volume2, Bell, Palette, Wifi, Shield, Info, 
  RotateCcw, Code, Database, Gauge, Keyboard, Clock,
  HardDrive, Bug, Terminal, Zap, Eye, EyeOff
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveState, loadState } from "@/lib/persistence";

// ============ SETTINGS CONFIG ============

interface SettingItem {
  key: string;
  label: string;
  description?: string;
  type: 'toggle' | 'slider' | 'info';
  defaultValue: any;
  min?: number;
  max?: number;
  requiresRestart?: boolean;
  dangerous?: boolean;
  infoValue?: () => string;
}

interface SettingCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  settings: SettingItem[];
}

const settingsConfig: SettingCategory[] = [
  {
    id: 'display',
    name: 'Display',
    icon: Monitor,
    settings: [
      { key: 'night_light', label: 'Night Light', description: 'Reduce blue light for eye comfort', type: 'toggle', defaultValue: false },
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
    settings: [
      { key: 'notifications', label: 'Enable Notifications', type: 'toggle', defaultValue: true },
      { key: 'dnd', label: 'Do Not Disturb', description: 'Silence all notifications', type: 'toggle', defaultValue: false },
      { key: 'toast_duration', label: 'Toast Duration (seconds)', type: 'slider', defaultValue: 4, min: 2, max: 10 },
      { key: 'desktop_notifications', label: 'Desktop Badges', description: 'Show notification badges on taskbar', type: 'toggle', defaultValue: true },
    ]
  },
  {
    id: 'appearance',
    name: 'Appearance',
    icon: Palette,
    settings: [
      { key: 'dark_mode', label: 'Dark Mode', description: 'Use dark color scheme', type: 'toggle', defaultValue: true },
      { key: 'high_contrast', label: 'High Contrast', description: 'Increase visual contrast', type: 'toggle', defaultValue: false },
      { key: 'reduce_motion', label: 'Reduce Motion', description: 'Minimize animations', type: 'toggle', defaultValue: false },
      { key: 'compact_mode', label: 'Compact Mode', description: 'Smaller UI elements', type: 'toggle', defaultValue: false },
      { key: 'blur_effects', label: 'Blur Effects', description: 'Enable backdrop blur', type: 'toggle', defaultValue: true },
    ]
  },
  {
    id: 'network',
    name: 'Network',
    icon: Wifi,
    settings: [
      { key: 'wifi', label: 'Wi-Fi', description: 'Enable wireless networking', type: 'toggle', defaultValue: true },
      { key: 'vpn', label: 'VPN', description: 'Route traffic through VPN', type: 'toggle', defaultValue: false },
      { key: 'metered_connection', label: 'Metered Connection', description: 'Limit data usage', type: 'toggle', defaultValue: false },
      { key: 'offline_mode', label: 'Offline Mode', description: 'Disable all network features', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    icon: Shield,
    settings: [
      { key: 'telemetry', label: 'Usage Analytics', description: 'Help improve the system', type: 'toggle', defaultValue: false },
      { key: 'auto_updates', label: 'Automatic Updates', description: 'Download updates automatically', type: 'toggle', defaultValue: true },
      { key: 'crash_reports', label: 'Crash Reports', description: 'Send crash reports for debugging', type: 'toggle', defaultValue: true },
      { key: 'lock_after_idle', label: 'Lock After Idle', description: 'Lock screen after inactivity', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    icon: Keyboard,
    settings: [
      { key: 'keyboard_shortcuts', label: 'Keyboard Shortcuts', description: 'Enable global keyboard shortcuts', type: 'toggle', defaultValue: true },
      { key: 'alt_tab', label: 'Alt+Tab Switcher', description: 'Switch windows with Alt+Tab', type: 'toggle', defaultValue: true },
      { key: 'ctrl_shortcuts', label: 'Ctrl Shortcuts', description: 'Copy, paste, undo, etc.', type: 'toggle', defaultValue: true },
    ]
  },
  {
    id: 'developer',
    name: 'Developer',
    icon: Code,
    settings: [
      { key: 'developer_mode', label: 'Developer Mode', description: 'Enable DEF-DEV console and advanced debugging', type: 'toggle', defaultValue: false },
      { key: 'debug_overlay', label: 'Debug Overlay', description: 'Show FPS and performance info', type: 'toggle', defaultValue: false },
      { key: 'console_logs', label: 'Verbose Console Logs', description: 'Log all actions to console', type: 'toggle', defaultValue: false },
      { key: 'disable_bugchecks', label: 'Disable Bugchecks', description: 'Suppress bugcheck screens (dangerous)', type: 'toggle', defaultValue: false, dangerous: true },
      { key: 'mock_slow_network', label: 'Simulate Slow Network', description: 'Add artificial latency', type: 'toggle', defaultValue: false },
      { key: 'show_render_outlines', label: 'Render Outlines', description: 'Show component boundaries', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: HardDrive,
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
              total += localStorage[key].length * 2; // UTF-16
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
    settings: [
      { key: 'hardware_acceleration', label: 'Hardware Acceleration', description: 'Use GPU for rendering', type: 'toggle', defaultValue: true },
      { key: 'lazy_loading', label: 'Lazy Loading', description: 'Load components on demand', type: 'toggle', defaultValue: true },
      { key: 'max_windows', label: 'Max Open Windows', type: 'slider', defaultValue: 10, min: 3, max: 20 },
      { key: 'gc_interval', label: 'Cleanup Interval (min)', description: 'Auto garbage collection', type: 'slider', defaultValue: 5, min: 1, max: 15 },
    ]
  },
  {
    id: 'experimental',
    name: 'Experimental',
    icon: Zap,
    settings: [
      { key: 'experimental_features', label: 'Enable Experimental', description: 'Enable unstable features', type: 'toggle', defaultValue: false, dangerous: true },
      { key: 'new_renderer', label: 'New Render Engine', description: 'Use experimental renderer', type: 'toggle', defaultValue: false, requiresRestart: true },
      { key: 'ai_assist', label: 'AI Assistant', description: 'Enable Navi AI integration', type: 'toggle', defaultValue: false },
      { key: 'beta_updates', label: 'Beta Updates', description: 'Receive beta version updates', type: 'toggle', defaultValue: false },
    ]
  },
  {
    id: 'about',
    name: 'About',
    icon: Info,
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

  // Load all settings from localStorage on mount
  useEffect(() => {
    const loaded: Record<string, any> = {};
    settingsConfig.forEach(category => {
      category.settings.forEach(setting => {
        if (setting.type !== 'info') {
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
        if (setting.type !== 'info') {
          defaults[setting.key] = setting.defaultValue;
          saveState(`settings_${setting.key}`, setting.defaultValue);
        }
      });
    });
    setValues(defaults);
    window.dispatchEvent(new Event('storage'));
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
    ? filteredCategories[0] 
    : settingsConfig.find(c => c.id === activeCategory);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-background/80">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background/95 backdrop-blur-sm">
      {/* Sidebar */}
      <div className="w-56 border-r border-border/50 bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-3">Settings</h2>
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background/50 border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {settingsConfig.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id && !searchQuery;
              return (
                <button
                  key={category.id}
                  onClick={() => { setActiveCategory(category.id); setSearchQuery(''); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Reset button at bottom */}
          <div className="p-3 mt-4 border-t border-border/50">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetAll}
              className="w-full gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {currentCategory && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <currentCategory.icon className="w-5 h-5 text-primary" />
                    {searchQuery ? 'Search Results' : currentCategory.name}
                  </h3>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Found {currentCategory.settings.length} matching settings
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  {(searchQuery ? filteredCategories.flatMap(c => c.settings) : currentCategory.settings).map(setting => (
                    <SettingRow
                      key={setting.key}
                      setting={setting}
                      value={values[setting.key]}
                      onChange={(val) => updateValue(setting.key, val)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

// ============ SETTING ROW COMPONENT ============

interface SettingRowProps {
  setting: SettingItem;
  value: any;
  onChange: (value: any) => void;
}

const SettingRow = ({ setting, value, onChange }: SettingRowProps) => {
  if (setting.type === 'info') {
    const displayValue = setting.infoValue ? setting.infoValue() : value;
    return (
      <div className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-muted/30 transition-colors">
        <div className="text-sm font-medium text-foreground">{setting.label}</div>
        <div className="text-sm text-muted-foreground font-mono">{displayValue}</div>
      </div>
    );
  }

  if (setting.type === 'toggle') {
    return (
      <div className={`flex items-center justify-between py-4 px-4 rounded-lg hover:bg-muted/30 transition-colors ${setting.dangerous ? 'border border-destructive/30 bg-destructive/5' : ''}`}>
        <div className="flex-1 pr-4">
          <div className="text-sm font-medium text-foreground flex items-center gap-2">
            {setting.label}
            {setting.dangerous && <span className="text-[10px] px-1.5 py-0.5 bg-destructive/20 text-destructive rounded">DANGER</span>}
            {setting.requiresRestart && <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded">RESTART</span>}
          </div>
          {setting.description && (
            <div className="text-xs text-muted-foreground mt-0.5">{setting.description}</div>
          )}
        </div>
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    );
  }

  if (setting.type === 'slider') {
    const numValue = typeof value === 'number' ? value : (Array.isArray(value) ? value[0] : setting.defaultValue);
    return (
      <div className="py-4 px-4 rounded-lg hover:bg-muted/30 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-foreground">{setting.label}</div>
          <span className="text-xs text-muted-foreground tabular-nums">{numValue}</span>
        </div>
        <Slider
          value={[numValue]}
          onValueChange={(v) => onChange(v[0])}
          min={setting.min ?? 0}
          max={setting.max ?? 100}
          step={1}
          className="w-full"
        />
      </div>
    );
  }

  return null;
};

export { Settings };
export default Settings;