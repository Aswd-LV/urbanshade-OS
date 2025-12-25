import { useState, useEffect, useCallback } from "react";
import { loadState, saveState } from "@/lib/persistence";

export interface SystemSettings {
  // Appearance
  bgGradientStart: string;
  bgGradientEnd: string;
  accentColor: string;
  fontFamily: string;
  animationsEnabled: boolean;
  glassOpacity: number;
  
  // System
  deviceName: string;
  brightness: number;
  volume: number;
  soundEffects: boolean;
  notifications: boolean;
  
  // New v2.9 settings
  animationSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right';
  windowTransparency: number;
  showDesktopSwitcher: boolean;
  startMenuStyle: 'classic' | 'modern';
  guestAccountEnabled: boolean;
}

const defaultSettings: SystemSettings = {
  bgGradientStart: "#1a1a2e",
  bgGradientEnd: "#16213e",
  accentColor: "cyan",
  fontFamily: "JetBrains Mono",
  animationsEnabled: true,
  glassOpacity: 0.55,
  deviceName: "URBANSHADE-TERMINAL",
  brightness: 80,
  volume: 70,
  soundEffects: true,
  notifications: true,
  // New v2.9 defaults
  animationSpeed: 'normal',
  taskbarPosition: 'bottom',
  windowTransparency: 90,
  showDesktopSwitcher: true,
  startMenuStyle: 'modern',
  guestAccountEnabled: false,
};

export const useSystemSettings = () => {
const [settings, setSettings] = useState<SystemSettings>(() => {
    return {
      bgGradientStart: loadState("settings_bg_gradient_start", defaultSettings.bgGradientStart),
      bgGradientEnd: loadState("settings_bg_gradient_end", defaultSettings.bgGradientEnd),
      accentColor: loadState("settings_accent_color", defaultSettings.accentColor),
      fontFamily: loadState("settings_font_family", defaultSettings.fontFamily),
      animationsEnabled: loadState("settings_animations", defaultSettings.animationsEnabled),
      glassOpacity: loadState("settings_glass_opacity", defaultSettings.glassOpacity),
      deviceName: loadState("settings_device_name", defaultSettings.deviceName),
      brightness: loadState("settings_brightness", defaultSettings.brightness),
      volume: loadState("settings_volume", defaultSettings.volume),
      soundEffects: loadState("settings_sound_effects", defaultSettings.soundEffects),
      notifications: loadState("settings_notifications", defaultSettings.notifications),
      // New v2.9 settings
      animationSpeed: loadState("settings_animation_speed", defaultSettings.animationSpeed),
      taskbarPosition: loadState("settings_taskbar_position", defaultSettings.taskbarPosition),
      windowTransparency: loadState("settings_window_transparency", defaultSettings.windowTransparency),
      showDesktopSwitcher: loadState("settings_show_desktop_switcher", defaultSettings.showDesktopSwitcher),
      startMenuStyle: loadState("settings_start_menu_style", defaultSettings.startMenuStyle),
      guestAccountEnabled: loadState("settings_guest_account_enabled", defaultSettings.guestAccountEnabled),
    };
  });

  // Apply CSS variables when settings change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient-start', settings.bgGradientStart);
    root.style.setProperty('--bg-gradient-end', settings.bgGradientEnd);
    root.style.setProperty('--custom-glass-opacity', String(settings.glassOpacity));
    root.style.setProperty('--window-transparency', String(settings.windowTransparency / 100));
    
    // Apply animation speed
    const speedMap: Record<string, string> = {
      slow: '0.5s',
      normal: '0.3s',
      fast: '0.15s',
      instant: '0s'
    };
    root.style.setProperty('--animation-duration', speedMap[settings.animationSpeed] || '0.3s');
    
    // Apply accent color
    const accentColors: Record<string, { hue: number; saturation: number }> = {
      cyan: { hue: 186, saturation: 100 },
      purple: { hue: 280, saturation: 80 },
      green: { hue: 142, saturation: 70 },
      orange: { hue: 25, saturation: 95 },
      pink: { hue: 330, saturation: 80 },
      blue: { hue: 210, saturation: 90 },
      red: { hue: 0, saturation: 80 },
    };
    
    const accent = accentColors[settings.accentColor] || accentColors.cyan;
    root.style.setProperty('--primary', `${accent.hue} ${accent.saturation}% 44%`);
    root.style.setProperty('--accent', `${accent.hue} ${accent.saturation}% 50%`);
    root.style.setProperty('--ring', `${accent.hue} ${accent.saturation}% 44%`);
    
    // Apply font
    root.style.setProperty('--font-family', settings.fontFamily);
    document.body.style.fontFamily = `'${settings.fontFamily}', monospace`;
    
    // Apply brightness filter
    root.style.setProperty('--brightness', `${settings.brightness / 100}`);
    
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof SystemSettings>(
    key: K, 
    value: SystemSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    saveState(`settings_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`, value);
    window.dispatchEvent(new CustomEvent('settings-changed', { detail: { key, value } }));
  }, []);

  const resetToDefaults = useCallback(() => {
    Object.entries(defaultSettings).forEach(([key, value]) => {
      saveState(`settings_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`, value);
    });
    setSettings(defaultSettings);
    window.dispatchEvent(new CustomEvent('settings-changed', { detail: { reset: true } }));
  }, []);

  return { settings, updateSetting, resetToDefaults };
};

// Static getter for components that can't use hooks
export const getSystemSettings = (): SystemSettings => {
  return {
    bgGradientStart: loadState("settings_bg_gradient_start", defaultSettings.bgGradientStart),
    bgGradientEnd: loadState("settings_bg_gradient_end", defaultSettings.bgGradientEnd),
    accentColor: loadState("settings_accent_color", defaultSettings.accentColor),
    fontFamily: loadState("settings_font_family", defaultSettings.fontFamily),
    animationsEnabled: loadState("settings_animations", defaultSettings.animationsEnabled),
    glassOpacity: loadState("settings_glass_opacity", defaultSettings.glassOpacity),
    deviceName: loadState("settings_device_name", defaultSettings.deviceName),
    brightness: loadState("settings_brightness", defaultSettings.brightness),
    volume: loadState("settings_volume", defaultSettings.volume),
    soundEffects: loadState("settings_sound_effects", defaultSettings.soundEffects),
    notifications: loadState("settings_notifications", defaultSettings.notifications),
    animationSpeed: loadState("settings_animation_speed", defaultSettings.animationSpeed),
    taskbarPosition: loadState("settings_taskbar_position", defaultSettings.taskbarPosition),
    windowTransparency: loadState("settings_window_transparency", defaultSettings.windowTransparency),
    showDesktopSwitcher: loadState("settings_show_desktop_switcher", defaultSettings.showDesktopSwitcher),
    startMenuStyle: loadState("settings_start_menu_style", defaultSettings.startMenuStyle),
    guestAccountEnabled: loadState("settings_guest_account_enabled", defaultSettings.guestAccountEnabled),
  };
};
