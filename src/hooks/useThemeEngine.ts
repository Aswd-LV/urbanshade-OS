import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

export type ThemeMode = "dark" | "light" | "auto";

export interface ThemeColors {
  // Core colors (HSL values without hsl() wrapper)
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  card: string;
  cardForeground: string;
  border: string;
  // Custom urbanshade tokens
  glass: string;
  glassStrong: string;
  glow: string;
}

export interface ThemeSettings {
  // Acrylic/Blur
  blurIntensity: number; // 0-24
  enableAcrylic: boolean;
  // Animations
  enableAnimations: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  reduceMotion: boolean;
  // Mode
  mode: ThemeMode;
  autoModeStartHour: number;
  autoModeEndHour: number;
  // Fonts
  fontFamily: string;
  monoFontFamily: string;
}

export interface FullTheme {
  id: string;
  name: string;
  author?: string;
  description?: string;
  darkColors: ThemeColors;
  lightColors?: ThemeColors;
  settings?: Partial<ThemeSettings>;
  createdAt?: string;
}

// Built-in theme presets
export const THEME_PRESETS: FullTheme[] = [
  {
    id: "urbanshade-dark",
    name: "Urbanshade Dark",
    description: "The default deep ocean tech theme",
    darkColors: {
      background: "212 75% 4%",
      foreground: "192 100% 96%",
      primary: "186 100% 44%",
      primaryForeground: "210 100% 3%",
      secondary: "212 40% 10%",
      secondaryForeground: "192 100% 96%",
      muted: "210 30% 15%",
      mutedForeground: "200 20% 60%",
      accent: "186 100% 50%",
      accentForeground: "210 100% 3%",
      destructive: "0 84% 60%",
      card: "214 100% 3%",
      cardForeground: "192 100% 96%",
      border: "186 100% 44% / 0.08",
      glass: "212 80% 6% / 0.55",
      glassStrong: "214 90% 4% / 0.75",
      glow: "186 100% 50%"
    }
  },
  {
    id: "urbanshade-light",
    name: "Urbanshade Light",
    description: "Light mode for day use",
    darkColors: {
      background: "210 20% 98%",
      foreground: "212 75% 10%",
      primary: "186 100% 35%",
      primaryForeground: "0 0% 100%",
      secondary: "210 15% 92%",
      secondaryForeground: "212 75% 10%",
      muted: "210 15% 90%",
      mutedForeground: "212 30% 40%",
      accent: "186 100% 40%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      card: "0 0% 100%",
      cardForeground: "212 75% 10%",
      border: "212 20% 80%",
      glass: "210 20% 98% / 0.75",
      glassStrong: "0 0% 100% / 0.85",
      glow: "186 100% 50%"
    }
  },
  {
    id: "windows-11",
    name: "Windows 11",
    description: "Microsoft Fluent design inspired",
    darkColors: {
      background: "0 0% 7%",
      foreground: "0 0% 100%",
      primary: "207 100% 52%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 12%",
      secondaryForeground: "0 0% 100%",
      muted: "0 0% 15%",
      mutedForeground: "0 0% 65%",
      accent: "207 100% 52%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      card: "0 0% 10%",
      cardForeground: "0 0% 100%",
      border: "0 0% 20%",
      glass: "0 0% 10% / 0.7",
      glassStrong: "0 0% 8% / 0.85",
      glow: "207 100% 52%"
    }
  },
  {
    id: "macos",
    name: "macOS",
    description: "Apple-inspired design",
    darkColors: {
      background: "240 6% 10%",
      foreground: "0 0% 100%",
      primary: "211 100% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "240 4% 16%",
      secondaryForeground: "0 0% 100%",
      muted: "240 4% 20%",
      mutedForeground: "240 4% 65%",
      accent: "211 100% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 72% 51%",
      card: "240 6% 12%",
      cardForeground: "0 0% 100%",
      border: "240 4% 22%",
      glass: "240 6% 10% / 0.6",
      glassStrong: "240 6% 8% / 0.8",
      glow: "211 100% 50%"
    }
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
    description: "Ubuntu Linux inspired",
    darkColors: {
      background: "300 6% 7%",
      foreground: "0 0% 100%",
      primary: "17 100% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "300 4% 14%",
      secondaryForeground: "0 0% 100%",
      muted: "300 4% 18%",
      mutedForeground: "300 4% 60%",
      accent: "17 100% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      card: "300 6% 10%",
      cardForeground: "0 0% 100%",
      border: "300 4% 22%",
      glass: "300 6% 7% / 0.7",
      glassStrong: "300 6% 5% / 0.85",
      glow: "17 100% 50%"
    }
  },
  {
    id: "scp-facility",
    name: "SCP Facility",
    description: "Containment terminal green",
    darkColors: {
      background: "120 15% 4%",
      foreground: "120 100% 75%",
      primary: "120 100% 45%",
      primaryForeground: "120 15% 4%",
      secondary: "120 10% 10%",
      secondaryForeground: "120 100% 75%",
      muted: "120 8% 15%",
      mutedForeground: "120 30% 50%",
      accent: "120 100% 50%",
      accentForeground: "120 15% 4%",
      destructive: "0 84% 60%",
      card: "120 15% 6%",
      cardForeground: "120 100% 75%",
      border: "120 100% 45% / 0.15",
      glass: "120 15% 5% / 0.7",
      glassStrong: "120 15% 3% / 0.85",
      glow: "120 100% 50%"
    }
  },
  {
    id: "hacker-mode",
    name: "Hacker Mode",
    description: "Matrix-style green on black",
    darkColors: {
      background: "0 0% 0%",
      foreground: "120 100% 50%",
      primary: "120 100% 50%",
      primaryForeground: "0 0% 0%",
      secondary: "120 50% 5%",
      secondaryForeground: "120 100% 50%",
      muted: "120 20% 8%",
      mutedForeground: "120 50% 40%",
      accent: "120 100% 60%",
      accentForeground: "0 0% 0%",
      destructive: "0 100% 50%",
      card: "0 0% 2%",
      cardForeground: "120 100% 50%",
      border: "120 100% 50% / 0.2",
      glass: "120 50% 3% / 0.8",
      glassStrong: "0 0% 0% / 0.9",
      glow: "120 100% 50%"
    }
  },
  {
    id: "synthwave",
    name: "Synthwave",
    description: "Retro 80s pink and purple",
    darkColors: {
      background: "270 50% 5%",
      foreground: "300 100% 90%",
      primary: "320 100% 60%",
      primaryForeground: "270 50% 5%",
      secondary: "270 40% 12%",
      secondaryForeground: "300 100% 90%",
      muted: "270 30% 18%",
      mutedForeground: "270 30% 60%",
      accent: "180 100% 50%",
      accentForeground: "270 50% 5%",
      destructive: "0 100% 60%",
      card: "270 50% 8%",
      cardForeground: "300 100% 90%",
      border: "320 100% 60% / 0.15",
      glass: "270 50% 6% / 0.7",
      glassStrong: "270 50% 4% / 0.85",
      glow: "320 100% 60%"
    }
  },
  {
    id: "nord",
    name: "Nord",
    description: "Arctic, north-bluish color palette",
    darkColors: {
      background: "220 16% 14%",
      foreground: "218 27% 92%",
      primary: "213 32% 52%",
      primaryForeground: "220 16% 14%",
      secondary: "220 16% 20%",
      secondaryForeground: "218 27% 92%",
      muted: "220 16% 24%",
      mutedForeground: "219 14% 65%",
      accent: "179 25% 65%",
      accentForeground: "220 16% 14%",
      destructive: "354 42% 56%",
      card: "220 16% 16%",
      cardForeground: "218 27% 92%",
      border: "220 16% 28%",
      glass: "220 16% 14% / 0.7",
      glassStrong: "220 16% 12% / 0.85",
      glow: "213 32% 52%"
    }
  },
  {
    id: "dracula",
    name: "Dracula",
    description: "Dark theme for vampires",
    darkColors: {
      background: "231 15% 13%",
      foreground: "60 30% 96%",
      primary: "265 89% 78%",
      primaryForeground: "231 15% 13%",
      secondary: "232 14% 18%",
      secondaryForeground: "60 30% 96%",
      muted: "232 14% 23%",
      mutedForeground: "225 14% 55%",
      accent: "135 94% 65%",
      accentForeground: "231 15% 13%",
      destructive: "0 100% 67%",
      card: "232 15% 15%",
      cardForeground: "60 30% 96%",
      border: "232 14% 25%",
      glass: "231 15% 13% / 0.7",
      glassStrong: "231 15% 10% / 0.85",
      glow: "265 89% 78%"
    }
  },
  // New Pressure-Inspired Themes
  {
    id: "hadal-blacksite",
    name: "Hadal Blacksite",
    description: "Deep-sea research facility aesthetic",
    darkColors: {
      background: "212 50% 5%",
      foreground: "45 20% 90%",
      primary: "45 100% 50%",
      primaryForeground: "212 50% 5%",
      secondary: "212 40% 10%",
      secondaryForeground: "45 20% 90%",
      muted: "212 30% 15%",
      mutedForeground: "212 20% 55%",
      accent: "45 100% 55%",
      accentForeground: "212 50% 5%",
      destructive: "0 84% 60%",
      card: "212 50% 7%",
      cardForeground: "45 20% 90%",
      border: "45 100% 50% / 0.12",
      glass: "212 50% 6% / 0.7",
      glassStrong: "212 50% 4% / 0.85",
      glow: "45 100% 50%"
    }
  },
  {
    id: "navi-terminal",
    name: "NAVI Terminal",
    description: "CRT green retro terminal vibes",
    darkColors: {
      background: "0 0% 2%",
      foreground: "120 100% 50%",
      primary: "120 100% 50%",
      primaryForeground: "0 0% 2%",
      secondary: "120 30% 6%",
      secondaryForeground: "120 100% 50%",
      muted: "120 15% 10%",
      mutedForeground: "120 50% 40%",
      accent: "120 100% 60%",
      accentForeground: "0 0% 2%",
      destructive: "0 100% 50%",
      card: "0 0% 4%",
      cardForeground: "120 100% 50%",
      border: "120 100% 50% / 0.2",
      glass: "120 30% 4% / 0.8",
      glassStrong: "0 0% 2% / 0.9",
      glow: "120 100% 50%"
    }
  },
  {
    id: "pressure-industrial",
    name: "Pressure Industrial",
    description: "Brutalist mechanical aesthetic",
    darkColors: {
      background: "210 5% 10%",
      foreground: "25 20% 90%",
      primary: "25 80% 45%",
      primaryForeground: "210 5% 10%",
      secondary: "210 5% 15%",
      secondaryForeground: "25 20% 90%",
      muted: "210 5% 20%",
      mutedForeground: "210 5% 55%",
      accent: "25 90% 50%",
      accentForeground: "210 5% 10%",
      destructive: "0 84% 60%",
      card: "210 5% 12%",
      cardForeground: "25 20% 90%",
      border: "25 60% 40% / 0.15",
      glass: "210 5% 12% / 0.7",
      glassStrong: "210 5% 8% / 0.85",
      glow: "25 80% 45%"
    }
  },
  {
    id: "mantle-zone",
    name: "Mantle Zone",
    description: "Hellish volcanic extraction zone",
    darkColors: {
      background: "0 20% 8%",
      foreground: "30 100% 90%",
      primary: "10 90% 50%",
      primaryForeground: "0 20% 8%",
      secondary: "0 15% 14%",
      secondaryForeground: "30 100% 90%",
      muted: "0 10% 18%",
      mutedForeground: "0 10% 55%",
      accent: "25 100% 55%",
      accentForeground: "0 20% 8%",
      destructive: "0 100% 60%",
      card: "0 20% 10%",
      cardForeground: "30 100% 90%",
      border: "10 90% 50% / 0.15",
      glass: "0 20% 9% / 0.7",
      glassStrong: "0 20% 6% / 0.85",
      glow: "10 90% 50%"
    }
  },
  {
    id: "oxygen-gardens",
    name: "Oxygen Gardens",
    description: "Bioluminescent alien flora aesthetic",
    darkColors: {
      background: "180 30% 5%",
      foreground: "160 80% 90%",
      primary: "160 100% 45%",
      primaryForeground: "180 30% 5%",
      secondary: "180 25% 10%",
      secondaryForeground: "160 80% 90%",
      muted: "180 20% 15%",
      mutedForeground: "180 20% 55%",
      accent: "180 100% 50%",
      accentForeground: "180 30% 5%",
      destructive: "0 84% 60%",
      card: "180 30% 7%",
      cardForeground: "160 80% 90%",
      border: "160 100% 45% / 0.12",
      glass: "180 30% 6% / 0.7",
      glassStrong: "180 30% 4% / 0.85",
      glow: "160 100% 50%"
    }
  }
];

const DEFAULT_SETTINGS: ThemeSettings = {
  blurIntensity: 12,
  enableAcrylic: true,
  enableAnimations: true,
  animationSpeed: "normal",
  reduceMotion: false,
  mode: "dark",
  autoModeStartHour: 8,
  autoModeEndHour: 20,
  fontFamily: "'JetBrains Mono', monospace",
  monoFontFamily: "'JetBrains Mono', monospace"
};

export const useThemeEngine = () => {
  const [currentThemeId, setCurrentThemeId] = useState(() => 
    localStorage.getItem("theme_id") || "urbanshade-dark"
  );
  
  const [customThemes, setCustomThemes] = useState<FullTheme[]>(() => {
    const saved = localStorage.getItem("custom_themes");
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem("theme_settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  // All available themes
  const allThemes = useMemo(() => [...THEME_PRESETS, ...customThemes], [customThemes]);

  // Current theme object
  const currentTheme = useMemo(() => 
    allThemes.find(t => t.id === currentThemeId) || THEME_PRESETS[0],
    [allThemes, currentThemeId]
  );

  // Determine if we should use dark or light mode
  const effectiveMode = useMemo(() => {
    if (settings.mode === "auto") {
      const hour = new Date().getHours();
      return (hour >= settings.autoModeStartHour && hour < settings.autoModeEndHour) ? "light" : "dark";
    }
    return settings.mode;
  }, [settings.mode, settings.autoModeStartHour, settings.autoModeEndHour]);

  // Apply CSS variables to document
  const applyTheme = useCallback((theme: FullTheme, mode: "dark" | "light") => {
    const colors = mode === "light" && theme.lightColors ? theme.lightColors : theme.darkColors;
    const root = document.documentElement;

    // Apply color variables
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--destructive", colors.destructive);
    root.style.setProperty("--destructive-foreground", "210 40% 98%");
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--popover", colors.card);
    root.style.setProperty("--popover-foreground", colors.cardForeground);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--input", colors.border);
    root.style.setProperty("--ring", colors.primary);
    
    // Urbanshade tokens
    root.style.setProperty("--glass", colors.glass);
    root.style.setProperty("--glass-strong", colors.glassStrong);
    root.style.setProperty("--glow", colors.glow);

    // Apply blur intensity
    root.style.setProperty("--blur-intensity", `${settings.blurIntensity}px`);
    
    // Apply animation speed
    const speedMultiplier = settings.animationSpeed === "slow" ? 1.5 : settings.animationSpeed === "fast" ? 0.5 : 1;
    root.style.setProperty("--animation-speed", `${speedMultiplier}`);

    // Toggle classes
    root.classList.toggle("reduce-motion", settings.reduceMotion || !settings.enableAnimations);
    root.classList.toggle("no-acrylic", !settings.enableAcrylic);
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");

    // Apply font
    root.style.fontFamily = settings.fontFamily;
  }, [settings]);

  // Apply theme on mount and changes
  useEffect(() => {
    applyTheme(currentTheme, effectiveMode);
  }, [currentTheme, effectiveMode, applyTheme]);

  // Persist state
  useEffect(() => {
    localStorage.setItem("theme_id", currentThemeId);
  }, [currentThemeId]);

  useEffect(() => {
    localStorage.setItem("theme_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("custom_themes", JSON.stringify(customThemes));
  }, [customThemes]);

  // Auto mode check every minute
  useEffect(() => {
    if (settings.mode !== "auto") return;
    const interval = setInterval(() => {
      applyTheme(currentTheme, effectiveMode);
    }, 60000);
    return () => clearInterval(interval);
  }, [settings.mode, currentTheme, effectiveMode, applyTheme]);

  // Actions
  const setTheme = useCallback((themeId: string) => {
    const theme = allThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentThemeId(themeId);
      toast.success(`Applied "${theme.name}" theme`);
    }
  }, [allThemes]);

  const updateSettings = useCallback((newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const createTheme = useCallback((theme: Omit<FullTheme, "id" | "createdAt">) => {
    const newTheme: FullTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCustomThemes(prev => [...prev, newTheme]);
    toast.success(`Created theme "${theme.name}"`);
    return newTheme;
  }, []);

  const updateTheme = useCallback((themeId: string, updates: Partial<FullTheme>) => {
    setCustomThemes(prev => prev.map(t => 
      t.id === themeId ? { ...t, ...updates } : t
    ));
  }, []);

  const deleteTheme = useCallback((themeId: string) => {
    setCustomThemes(prev => prev.filter(t => t.id !== themeId));
    if (currentThemeId === themeId) {
      setCurrentThemeId("urbanshade-dark");
    }
    toast.success("Theme deleted");
  }, [currentThemeId]);

  const exportTheme = useCallback((themeId: string) => {
    const theme = allThemes.find(t => t.id === themeId);
    if (!theme) return null;
    
    const exportData = JSON.stringify(theme, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Theme exported");
    return exportData;
  }, [allThemes]);

  const importTheme = useCallback((jsonString: string) => {
    try {
      const theme = JSON.parse(jsonString) as FullTheme;
      if (!theme.name || !theme.darkColors) {
        throw new Error("Invalid theme format");
      }
      
      const newTheme: FullTheme = {
        ...theme,
        id: `imported-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      setCustomThemes(prev => [...prev, newTheme]);
      toast.success(`Imported theme "${theme.name}"`);
      return newTheme;
    } catch (e) {
      toast.error("Failed to import theme");
      return null;
    }
  }, []);

  const duplicateTheme = useCallback((themeId: string) => {
    const theme = allThemes.find(t => t.id === themeId);
    if (!theme) return null;
    
    return createTheme({
      ...theme,
      name: `${theme.name} (Copy)`
    });
  }, [allThemes, createTheme]);

  return {
    // State
    currentTheme,
    currentThemeId,
    effectiveMode,
    settings,
    allThemes,
    customThemes,
    presets: THEME_PRESETS,
    
    // Actions
    setTheme,
    updateSettings,
    createTheme,
    updateTheme,
    deleteTheme,
    exportTheme,
    importTheme,
    duplicateTheme
  };
};
