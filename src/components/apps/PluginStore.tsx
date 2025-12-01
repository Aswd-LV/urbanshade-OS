import { useState, useEffect } from "react";
import { Puzzle, Download, Check, Palette, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Plugin {
  id: string;
  name: string;
  category: "theme" | "command" | "utility";
  description: string;
  version: string;
  author: string;
  config?: any;
}

const AVAILABLE_PLUGINS: Plugin[] = [
  { id: "dark-neon", name: "Dark Neon Theme", category: "theme", description: "Cyberpunk-inspired neon theme", version: "1.0.0", author: "ThemeStudio", config: { accent: "#00ffff", glow: true } },
  { id: "ocean-blue", name: "Ocean Blue Theme", category: "theme", description: "Calming blue underwater theme", version: "1.2.0", author: "ColorCraft" },
  { id: "blood-red", name: "Blood Red Theme", category: "theme", description: "Intense red horror theme", version: "1.0.1", author: "DarkDesigns" },
  { id: "cmd-sysinfo", name: "sysinfo Command", category: "command", description: "Display detailed system information", version: "2.0.0", author: "SysTech" },
  { id: "cmd-netstat", name: "netstat Command", category: "command", description: "Show active network connections", version: "1.5.0", author: "NetTools" },
  { id: "cmd-hack", name: "hack Command", category: "command", description: "Fun hacking simulation effect", version: "1.0.0", author: "HackSim" },
  { id: "cmd-matrix", name: "matrix Command", category: "command", description: "Matrix-style falling text", version: "1.1.0", author: "RetroFX" },
  { id: "cmd-weather", name: "weather Command", category: "command", description: "Check weather from terminal", version: "1.3.0", author: "CliWeather" },
  { id: "quick-notes", name: "Quick Notes Widget", category: "utility", description: "Sticky notes on desktop", version: "2.1.0", author: "ProductivityPro" },
  { id: "auto-backup", name: "Auto Backup", category: "utility", description: "Automatic system backups", version: "3.0.0", author: "BackupTools" },
  { id: "screen-recorder", name: "Screen Recorder", category: "utility", description: "Record screen activity", version: "1.4.0", author: "MediaSuite" },
];

export const PluginStore = () => {
  const [installedPlugins, setInstalledPlugins] = useState<string[]>(() => {
    const saved = localStorage.getItem('installed_plugins');
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    localStorage.setItem('installed_plugins', JSON.stringify(installedPlugins));
    window.dispatchEvent(new Event('storage'));
  }, [installedPlugins]);

  const categories = ["All", "theme", "command", "utility"];

  const filteredPlugins = AVAILABLE_PLUGINS.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(search.toLowerCase()) || 
                         plugin.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (plugin: Plugin) => {
    setInstalledPlugins(prev => [...prev, plugin.id]);
    toast.success(`${plugin.name} installed!`);
    
    // Apply plugin based on category
    if (plugin.category === "theme") {
      applyTheme(plugin);
    } else if (plugin.category === "command") {
      registerCommand(plugin);
    } else if (plugin.category === "utility") {
      activateUtility(plugin);
    }
  };

  const applyTheme = (plugin: Plugin) => {
    const themeMap: Record<string, any> = {
      'dark-neon': { primary: '180 100% 50%', accent: '300 100% 50%', background: '240 100% 5%' },
      'ocean-blue': { primary: '200 100% 50%', accent: '210 100% 60%', background: '210 80% 10%' },
      'blood-red': { primary: '0 100% 50%', accent: '10 100% 60%', background: '0 50% 5%' }
    };
    
    const theme = themeMap[plugin.id];
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, String(value));
        localStorage.setItem(`theme_${key}`, String(value));
      });
      localStorage.setItem('active_theme', plugin.id);
      toast.success(`${plugin.name} applied! Refresh to see all changes.`);
    }
  };

  const registerCommand = (plugin: Plugin) => {
    const commands = JSON.parse(localStorage.getItem('plugin_commands') || '[]');
    commands.push({
      id: plugin.id,
      name: plugin.name.toLowerCase().replace(/\s/g, ''),
      description: plugin.description
    });
    localStorage.setItem('plugin_commands', JSON.stringify(commands));
    toast.success(`Command registered! Use in Terminal.`);
  };

  const activateUtility = (plugin: Plugin) => {
    localStorage.setItem(`utility_${plugin.id}`, 'active');
    toast.success(`${plugin.name} activated!`);
  };

  const handleUninstall = (pluginId: string) => {
    setInstalledPlugins(prev => prev.filter(id => id !== pluginId));
    toast.success("Plugin uninstalled");
  };

  const isInstalled = (pluginId: string) => installedPlugins.includes(pluginId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "theme": return <Palette className="w-4 h-4" />;
      case "command": return <Terminal className="w-4 h-4" />;
      case "utility": return <Zap className="w-4 h-4" />;
      default: return <Puzzle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Puzzle className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Plugin Store</h1>
          <Badge variant="secondary" className="ml-auto">
            {installedPlugins.length} Installed
          </Badge>
        </div>
        
        <div className="relative">
          <Input
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-3"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "All" ? "All" : getCategoryIcon(cat)}
              <span className="ml-1 capitalize">{cat}</span>
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredPlugins.map(plugin => (
            <div
              key={plugin.id}
              className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getCategoryIcon(plugin.category)}
                    <h3 className="font-semibold text-lg">{plugin.name}</h3>
                    <Badge variant="outline" className="capitalize">{plugin.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{plugin.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>v{plugin.version}</span>
                    <span>by {plugin.author}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {isInstalled(plugin.id) ? (
                    <>
                      <Button variant="outline" size="sm" disabled>
                        <Check className="w-4 h-4 mr-2" />
                        Installed
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleUninstall(plugin.id)}
                      >
                        Uninstall
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleInstall(plugin)}>
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredPlugins.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Puzzle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No plugins found matching your search</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
