import { useState, useEffect } from "react";
import { 
  Monitor, Volume2, Bell, Palette, Wifi, Shield, Info, 
  RotateCcw, Sun, Moon, Zap, Eye, Sparkles
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
  type: 'toggle' | 'slider' | 'select';
  defaultValue: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
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
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    settings: [
      { key: 'notifications', label: 'Enable Notifications', type: 'toggle', defaultValue: true },
      { key: 'dnd', label: 'Do Not Disturb', description: 'Silence all notifications', type: 'toggle', defaultValue: false },
      { key: 'notification_sound', label: 'Notification Sounds', type: 'toggle', defaultValue: true },
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
    ]
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    icon: Shield,
    settings: [
      { key: 'telemetry', label: 'Usage Analytics', description: 'Help improve the system', type: 'toggle', defaultValue: false },
      { key: 'auto_updates', label: 'Automatic Updates', description: 'Download updates automatically', type: 'toggle', defaultValue: true },
      { key: 'developer_mode', label: 'Developer Mode', description: 'Enable advanced debugging', type: 'toggle', defaultValue: false },
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

  // Load all settings from localStorage on mount
  useEffect(() => {
    const loaded: Record<string, any> = {};
    settingsConfig.forEach(category => {
      category.settings.forEach(setting => {
        const storageKey = `settings_${setting.key}`;
        loaded[setting.key] = loadState(storageKey, setting.defaultValue);
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
        defaults[setting.key] = setting.defaultValue;
        saveState(`settings_${setting.key}`, setting.defaultValue);
      });
    });
    setValues(defaults);
    window.dispatchEvent(new Event('storage'));
  };

  const currentCategory = settingsConfig.find(c => c.id === activeCategory);

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
      <div className="w-56 border-r border-border/50 bg-muted/30">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2 space-y-1">
            {settingsConfig.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
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
                    {currentCategory.name}
                  </h3>
                </div>

                <div className="space-y-1">
                  {currentCategory.settings.map(setting => (
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
  if (setting.type === 'toggle') {
    return (
      <div className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-muted/30 transition-colors">
        <div className="flex-1 pr-4">
          <div className="text-sm font-medium text-foreground">{setting.label}</div>
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
          <span className="text-xs text-muted-foreground tabular-nums">{numValue}%</span>
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
