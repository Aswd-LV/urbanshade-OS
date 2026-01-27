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
    id: "digital-dawn",
    name: "Digital Dawn",
    colors: {
      bgGradientStart: "#0a1628",
      bgGradientEnd: "#1a2a42",
      accentColor: "#00d4ff"
    },
    source: 'battlepass',
    requiredLevel: 10,
    seasonId: 'genesis'
  },
  {
    id: "neon-circuit",
    name: "Neon Circuit",
    colors: {
      bgGradientStart: "#0a0a1a",
      bgGradientEnd: "#1a0a2a",
      accentColor: "#ff00ff"
    },
    source: 'battlepass',
    requiredLevel: 20,
    seasonId: 'genesis'
  },
  {
    id: "quantum-shift",
    name: "Quantum Shift",
    colors: {
      bgGradientStart: "#140a20",
      bgGradientEnd: "#201030",
      accentColor: "#8855ff"
    },
    source: 'battlepass',
    requiredLevel: 35,
    seasonId: 'genesis'
  },
  {
    id: "neural-network",
    name: "Neural Network",
    colors: {
      bgGradientStart: "#001a00",
      bgGradientEnd: "#0a2a0a",
      accentColor: "#00ff88"
    },
    source: 'battlepass',
    requiredLevel: 50,
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
    requiredLevel: 65,
    seasonId: 'genesis'
  },
  {
    id: "genesis-prime",
    name: "Genesis Prime",
    colors: {
      bgGradientStart: "#0f0a1a",
      bgGradientEnd: "#1a1030",
      accentColor: "#ffd700"
    },
    source: 'battlepass',
    requiredLevel: 80,
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
    requiredLevel: 20,
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
    requiredLevel: 35,
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
    requiredLevel: 55,
    seasonId: 'phantom'
  },
  {
    id: "shadow-realm",
    name: "Shadow Realm",
    colors: {
      bgGradientStart: "#0a0510",
      bgGradientEnd: "#120a18",
      accentColor: "#5533aa"
    },
    source: 'battlepass',
    requiredLevel: 70,
    seasonId: 'phantom'
  },
  {
    id: "phantom-prime",
    name: "Phantom Prime",
    colors: {
      bgGradientStart: "#08080f",
      bgGradientEnd: "#101018",
      accentColor: "#c0c0c0"
    },
    source: 'battlepass',
    requiredLevel: 85,
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
