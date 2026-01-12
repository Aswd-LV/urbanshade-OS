import { useState, useEffect, useCallback } from 'react';
import { loadState, saveState } from '@/lib/persistence';

export interface SystemPreferences {
  // Display
  accentColor: string;
  theme: string;
  transparency: boolean;
  animations: boolean;
  nightLight: boolean;
  nightLightIntensity: number;
  resolution: string;
  
  // Sound
  volume: number;
  muted: boolean;
  soundEffects: boolean;
  
  // Power
  powerMode: 'power_saver' | 'balanced' | 'performance';
  
  // Accessibility
  highContrast: boolean;
  largerText: boolean;
  reduceMotion: boolean;
  
  // Time
  use24Hour: boolean;
  dateFormat: 'mdy' | 'dmy' | 'ymd';
  timezone: string;
}

const DEFAULT_PREFERENCES: SystemPreferences = {
  accentColor: 'cyan',
  theme: 'dark',
  transparency: true,
  animations: true,
  nightLight: false,
  nightLightIntensity: 30,
  resolution: '1920x1080',
  volume: 70,
  muted: false,
  soundEffects: true,
  powerMode: 'balanced',
  highContrast: false,
  largerText: false,
  reduceMotion: false,
  use24Hour: false,
  dateFormat: 'mdy',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

// Accent color mappings
const ACCENT_COLORS: Record<string, { primary: string; primaryForeground: string }> = {
  cyan: { primary: '185 100% 50%', primaryForeground: '0 0% 0%' },
  purple: { primary: '270 70% 60%', primaryForeground: '0 0% 100%' },
  green: { primary: '142 70% 45%', primaryForeground: '0 0% 0%' },
  orange: { primary: '25 95% 53%', primaryForeground: '0 0% 0%' },
  pink: { primary: '330 80% 60%', primaryForeground: '0 0% 0%' },
  blue: { primary: '217 91% 60%', primaryForeground: '0 0% 100%' },
  red: { primary: '0 72% 51%', primaryForeground: '0 0% 100%' },
};

export const useSystemPreferences = () => {
  const [preferences, setPreferences] = useState<SystemPreferences>(() => {
    const loaded: Partial<SystemPreferences> = {};
    loaded.accentColor = loadState('settings_accent_color', DEFAULT_PREFERENCES.accentColor);
    loaded.theme = loadState('settings_theme', DEFAULT_PREFERENCES.theme);
    loaded.transparency = loadState('settings_transparency', DEFAULT_PREFERENCES.transparency);
    loaded.animations = loadState('settings_animations', DEFAULT_PREFERENCES.animations);
    loaded.nightLight = loadState('settings_night_light', DEFAULT_PREFERENCES.nightLight);
    loaded.nightLightIntensity = loadState('settings_night_light_intensity', [DEFAULT_PREFERENCES.nightLightIntensity])[0];
    loaded.resolution = loadState('settings_resolution', DEFAULT_PREFERENCES.resolution);
    loaded.volume = loadState('settings_volume', [DEFAULT_PREFERENCES.volume])[0];
    loaded.muted = loadState('settings_mute', DEFAULT_PREFERENCES.muted);
    loaded.soundEffects = loadState('settings_sound_effects', DEFAULT_PREFERENCES.soundEffects);
    loaded.powerMode = loadState('settings_power_mode', DEFAULT_PREFERENCES.powerMode);
    loaded.highContrast = loadState('settings_high_contrast', DEFAULT_PREFERENCES.highContrast);
    loaded.largerText = loadState('settings_larger_text', DEFAULT_PREFERENCES.largerText);
    loaded.reduceMotion = loadState('settings_reduce_motion', DEFAULT_PREFERENCES.reduceMotion);
    loaded.use24Hour = loadState('settings_24_hour', DEFAULT_PREFERENCES.use24Hour);
    loaded.dateFormat = loadState('settings_date_format', DEFAULT_PREFERENCES.dateFormat);
    loaded.timezone = loadState('settings_timezone', DEFAULT_PREFERENCES.timezone);
    return { ...DEFAULT_PREFERENCES, ...loaded };
  });

  // Apply accent color to CSS variables
  useEffect(() => {
    const colors = ACCENT_COLORS[preferences.accentColor] || ACCENT_COLORS.cyan;
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--primary-foreground', colors.primaryForeground);
  }, [preferences.accentColor]);

  // Apply animations preference
  useEffect(() => {
    if (!preferences.animations || preferences.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [preferences.animations, preferences.reduceMotion]);

  // Apply night light filter
  useEffect(() => {
    if (preferences.nightLight) {
      document.documentElement.style.filter = `sepia(${preferences.nightLightIntensity}%) saturate(${100 - preferences.nightLightIntensity / 2}%)`;
    } else {
      document.documentElement.style.filter = '';
    }
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [preferences.nightLight, preferences.nightLightIntensity]);

  // Apply high contrast
  useEffect(() => {
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [preferences.highContrast]);

  // Apply larger text
  useEffect(() => {
    if (preferences.largerText) {
      document.documentElement.classList.add('larger-text');
    } else {
      document.documentElement.classList.remove('larger-text');
    }
  }, [preferences.largerText]);

  // Apply transparency
  useEffect(() => {
    if (!preferences.transparency) {
      document.documentElement.classList.add('no-transparency');
    } else {
      document.documentElement.classList.remove('no-transparency');
    }
  }, [preferences.transparency]);

  const updatePreference = useCallback(<K extends keyof SystemPreferences>(
    key: K,
    value: SystemPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    // Save to localStorage with appropriate key format
    const storageKeyMap: Record<keyof SystemPreferences, string> = {
      accentColor: 'settings_accent_color',
      theme: 'settings_theme',
      transparency: 'settings_transparency',
      animations: 'settings_animations',
      nightLight: 'settings_night_light',
      nightLightIntensity: 'settings_night_light_intensity',
      resolution: 'settings_resolution',
      volume: 'settings_volume',
      muted: 'settings_mute',
      soundEffects: 'settings_sound_effects',
      powerMode: 'settings_power_mode',
      highContrast: 'settings_high_contrast',
      largerText: 'settings_larger_text',
      reduceMotion: 'settings_reduce_motion',
      use24Hour: 'settings_24_hour',
      dateFormat: 'settings_date_format',
      timezone: 'settings_timezone',
    };
    
    // Handle array values for sliders
    if (key === 'volume' || key === 'nightLightIntensity') {
      saveState(storageKeyMap[key], [value]);
    } else {
      saveState(storageKeyMap[key], value);
    }
    
    // Dispatch storage event for other components
    window.dispatchEvent(new Event('storage'));
  }, []);

  return {
    preferences,
    updatePreference,
    ACCENT_COLORS,
    DEFAULT_PREFERENCES,
  };
};

// Get current volume (for sound effects)
export const getSystemVolume = (): number => {
  const muted = loadState('settings_mute', false);
  if (muted) return 0;
  const volume = loadState('settings_volume', [70]);
  return Array.isArray(volume) ? volume[0] : volume;
};

// Check if sound effects are enabled
export const areSoundEffectsEnabled = (): boolean => {
  return loadState('settings_sound_effects', true);
};

// Get power mode for performance adjustments
export const getPowerMode = (): 'power_saver' | 'balanced' | 'performance' => {
  return loadState('settings_power_mode', 'balanced');
};
