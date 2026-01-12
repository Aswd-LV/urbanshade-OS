import { useCallback } from "react";
import { toast } from "sonner";

export interface ThemePreset {
  id: string;
  name: string;
  colors: {
    bgGradientStart: string;
    bgGradientEnd: string;
    accentColor?: string;
  };
  source?: 'default' | 'battlepass' | 'achievement';
  requiredLevel?: number; // For battlepass themes
  seasonId?: string; // Which season unlocks this
}

export const themePresets: ThemePreset[] = [
  // Default Themes (always available)
  {
    id: "urbanshade-dark",
    name: "Urbanshade Dark",
    colors: {
      bgGradientStart: "#1a1a2e",
      bgGradientEnd: "#16213e"
    },
    source: 'default'
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    colors: {
      bgGradientStart: "#0f0f23",
      bgGradientEnd: "#1a1a40"
    },
    source: 'default'
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    colors: {
      bgGradientStart: "#0d1117",
      bgGradientEnd: "#161b22"
    },
    source: 'default'
  },
  {
    id: "forest-green",
    name: "Forest Green",
    colors: {
      bgGradientStart: "#0d1f0d",
      bgGradientEnd: "#1a2f1a"
    },
    source: 'default'
  },
  {
    id: "ruby-red",
    name: "Ruby Red",
    colors: {
      bgGradientStart: "#1f0d0d",
      bgGradientEnd: "#2f1a1a"
    },
    source: 'default'
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    colors: {
      bgGradientStart: "#1a0d1f",
      bgGradientEnd: "#2a1a2f"
    },
    source: 'default'
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    colors: {
      bgGradientStart: "#1f1a0d",
      bgGradientEnd: "#2f2a1a"
    },
    source: 'default'
  },
  {
    id: "arctic-blue",
    name: "Arctic Blue",
    colors: {
      bgGradientStart: "#0d1a1f",
      bgGradientEnd: "#1a2a2f"
    },
    source: 'default'
  },

  // Battle Pass Season 1: Genesis Themes
  {
    id: "neon-pulse",
    name: "Neon Pulse",
    colors: {
      bgGradientStart: "#0a0a1a",
      bgGradientEnd: "#1a0a2a",
      accentColor: "#00ffff"
    },
    source: 'battlepass',
    requiredLevel: 10,
    seasonId: 'genesis'
  },
  {
    id: "cyber-grid",
    name: "Cyber Grid",
    colors: {
      bgGradientStart: "#001a00",
      bgGradientEnd: "#0a2a0a",
      accentColor: "#00ff00"
    },
    source: 'battlepass',
    requiredLevel: 25,
    seasonId: 'genesis'
  },
  {
    id: "crimson-protocol",
    name: "Crimson Protocol",
    colors: {
      bgGradientStart: "#1a0000",
      bgGradientEnd: "#2a0a0a",
      accentColor: "#ff3333"
    },
    source: 'battlepass',
    requiredLevel: 40,
    seasonId: 'genesis'
  },
  {
    id: "frozen-core",
    name: "Frozen Core",
    colors: {
      bgGradientStart: "#0a1a2a",
      bgGradientEnd: "#1a2a3a",
      accentColor: "#88ccff"
    },
    source: 'battlepass',
    requiredLevel: 55,
    seasonId: 'genesis'
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    colors: {
      bgGradientStart: "#1a1000",
      bgGradientEnd: "#2a2010",
      accentColor: "#ffaa00"
    },
    source: 'battlepass',
    requiredLevel: 65,
    seasonId: 'genesis'
  },
  {
    id: "void-walker",
    name: "Void Walker",
    colors: {
      bgGradientStart: "#050505",
      bgGradientEnd: "#0a0a15",
      accentColor: "#aa55ff"
    },
    source: 'battlepass',
    requiredLevel: 80,
    seasonId: 'genesis'
  },
  {
    id: "genesis-prime",
    name: "Genesis",
    colors: {
      bgGradientStart: "#0f0a1a",
      bgGradientEnd: "#1a1030",
      accentColor: "#ff00ff"
    },
    source: 'battlepass',
    requiredLevel: 95,
    seasonId: 'genesis'
  },

  // Battle Pass Season 2: Phantom Protocol Themes
  {
    id: "shadow-network",
    name: "Shadow Network",
    colors: {
      bgGradientStart: "#080808",
      bgGradientEnd: "#121218",
      accentColor: "#666688"
    },
    source: 'battlepass',
    requiredLevel: 10,
    seasonId: 'phantom'
  },
  {
    id: "stealth-mode",
    name: "Stealth Mode",
    colors: {
      bgGradientStart: "#050505",
      bgGradientEnd: "#0a0a0a",
      accentColor: "#444444"
    },
    source: 'battlepass',
    requiredLevel: 25,
    seasonId: 'phantom'
  },
  {
    id: "phantom-glow",
    name: "Phantom Glow",
    colors: {
      bgGradientStart: "#0a0a14",
      bgGradientEnd: "#14141e",
      accentColor: "#8888aa"
    },
    source: 'battlepass',
    requiredLevel: 50,
    seasonId: 'phantom'
  },
  {
    id: "invisibility-cloak",
    name: "Invisibility Cloak",
    colors: {
      bgGradientStart: "#030305",
      bgGradientEnd: "#08080c",
      accentColor: "#333355"
    },
    source: 'battlepass',
    requiredLevel: 80,
    seasonId: 'phantom'
  }
];

export const useThemePresets = () => {
  const applyPreset = useCallback((preset: ThemePreset) => {
    localStorage.setItem("settings_bg_gradient_start", preset.colors.bgGradientStart);
    localStorage.setItem("settings_bg_gradient_end", preset.colors.bgGradientEnd);
    if (preset.colors.accentColor) {
      localStorage.setItem("settings_accent_color", preset.colors.accentColor);
    }
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"));
    toast.success(`Applied "${preset.name}" theme`);
  }, []);

  const getCurrentPreset = useCallback((): ThemePreset | null => {
    const start = localStorage.getItem("settings_bg_gradient_start");
    const end = localStorage.getItem("settings_bg_gradient_end");
    
    return themePresets.find(
      (p) => p.colors.bgGradientStart === start && p.colors.bgGradientEnd === end
    ) || null;
  }, []);

  return {
    presets: themePresets,
    applyPreset,
    getCurrentPreset
  };
};
