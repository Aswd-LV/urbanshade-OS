import { useState, useEffect, useCallback } from "react";
import { 
  Download, Check, Search, Package, Star, ChevronLeft,
  Sparkles, Shield, Gamepad2, Wrench, Cpu, Globe, Camera, Music,
  MessageSquare, BookOpen, Trash2, RefreshCw, HardDrive, Eye,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AppReview {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface StoreApp {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  size: string;
  rating: number;
  downloads: string;
  featured?: boolean;
  new?: boolean;
  reviews?: AppReview[];
  permissions?: string[];
  lastUpdate?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: typeof Package; label: string; color: string }> = {
  Productivity: { icon: BookOpen, label: "Productivity", color: "text-blue-400" },
  Graphics: { icon: Camera, label: "Graphics", color: "text-pink-400" },
  Entertainment: { icon: Music, label: "Entertainment", color: "text-purple-400" },
  Utilities: { icon: Wrench, label: "Utilities", color: "text-amber-400" },
  Security: { icon: Shield, label: "Security", color: "text-green-400" },
  Communication: { icon: MessageSquare, label: "Communication", color: "text-cyan-400" },
  Network: { icon: Globe, label: "Network", color: "text-indigo-400" },
  System: { icon: Cpu, label: "System", color: "text-orange-400" },
  Games: { icon: Gamepad2, label: "Games", color: "text-red-400" },
};

const generateReviews = (appName: string): AppReview[] => {
  const reviewers = ['Alex_Dev', 'CyberUser99', 'TechEnthusiast', 'ProUser2024', 'SiteAdmin'];
  const comments = [
    'Works flawlessly! Exactly what I needed.',
    'Great app, but could use more features.',
    'Essential tool for daily operations.',
    'Exceeded my expectations!',
    'Good but a bit slow on older systems.',
  ];
  
  return reviewers.slice(0, 3).map((user, i) => ({
    user,
    rating: 3 + Math.floor(Math.random() * 3),
    comment: comments[i % comments.length],
    date: `${Math.floor(Math.random() * 30) + 1} days ago`,
  }));
};

const AVAILABLE_APPS: StoreApp[] = [
  { id: "notepad", name: "Notepad", category: "Productivity", description: "Simple text editor", version: "2.1.0", size: "1.2 MB", rating: 4.5, downloads: "12.5K", featured: true, permissions: ['File Access'], lastUpdate: '2024-01-15' },
  { id: "paint", name: "Paint Tool", category: "Graphics", description: "Image editing suite", version: "3.0.1", size: "2.8 MB", rating: 4.2, downloads: "8.3K", new: true, permissions: ['File Access', 'Graphics'], lastUpdate: '2024-01-20' },
  { id: "music-player", name: "Media Player", category: "Entertainment", description: "Audio/video playback", version: "5.2.0", size: "8.4 MB", rating: 4.7, downloads: "25.1K", featured: true, permissions: ['Audio', 'File Access'], lastUpdate: '2024-01-18' },
  { id: "weather", name: "Weather", category: "Utilities", description: "Weather tracking", version: "1.8.3", size: "3.1 MB", rating: 4.3, downloads: "15.2K", permissions: ['Network'], lastUpdate: '2024-01-10' },
  { id: "clock", name: "World Clock", category: "Utilities", description: "Multi-timezone clock", version: "2.5.0", size: "1.5 MB", rating: 4.4, downloads: "9.8K", permissions: ['Notifications'], lastUpdate: '2024-01-12' },
  { id: "calendar", name: "Calendar", category: "Productivity", description: "Event scheduling", version: "4.1.2", size: "4.7 MB", rating: 4.6, downloads: "18.4K", featured: true, permissions: ['Notifications', 'File Access'], lastUpdate: '2024-01-08' },
  { id: "notes", name: "Advanced Notes", category: "Productivity", description: "Rich text notes", version: "3.3.0", size: "5.2 MB", rating: 4.8, downloads: "22.7K", new: true, permissions: ['File Access', 'Encryption'], lastUpdate: '2024-01-22' },
  { id: "vpn", name: "Secure VPN", category: "Security", description: "Network tunneling", version: "2.0.4", size: "6.3 MB", rating: 4.5, downloads: "31.2K", permissions: ['Network', 'System'], lastUpdate: '2024-01-05' },
  { id: "firewall", name: "Firewall", category: "Security", description: "Packet filtering", version: "7.1.0", size: "12.5 MB", rating: 4.7, downloads: "28.9K", featured: true, permissions: ['Network', 'System', 'Admin'], lastUpdate: '2024-01-03' },
  { id: "antivirus", name: "Virus Scanner", category: "Security", description: "Threat detection", version: "9.2.1", size: "45.8 MB", rating: 4.9, downloads: "45.3K", permissions: ['Full System'], lastUpdate: '2024-01-01' },
  { id: "backup", name: "Data Backup", category: "Utilities", description: "Automated backup", version: "3.4.0", size: "7.9 MB", rating: 4.6, downloads: "19.5K", permissions: ['File Access', 'Network'], lastUpdate: '2024-01-14' },
  { id: "compression", name: "Compressor", category: "Utilities", description: "Archive formats", version: "4.0.2", size: "2.3 MB", rating: 4.4, downloads: "14.1K", permissions: ['File Access'], lastUpdate: '2024-01-11' },
  { id: "pdf-reader", name: "PDF Viewer", category: "Productivity", description: "Read & annotate PDFs", version: "6.1.0", size: "8.7 MB", rating: 4.5, downloads: "20.8K", permissions: ['File Access'], lastUpdate: '2024-01-09' },
  { id: "spreadsheet", name: "Data Sheets", category: "Productivity", description: "Spreadsheet editor", version: "5.3.1", size: "15.2 MB", rating: 4.7, downloads: "16.4K", new: true, permissions: ['File Access'], lastUpdate: '2024-01-21' },
  { id: "chat", name: "Instant Chat", category: "Communication", description: "Secure messaging", version: "7.4.2", size: "9.8 MB", rating: 4.7, downloads: "35.2K", permissions: ['Network', 'Notifications'], lastUpdate: '2024-01-16' },
  { id: "ssh", name: "SSH Terminal", category: "Network", description: "Secure shell client", version: "4.5.2", size: "6.4 MB", rating: 4.8, downloads: "12.3K", permissions: ['Network', 'File Access'], lastUpdate: '2024-01-04' },
  { id: "disk-manager", name: "Disk Utility", category: "System", description: "Storage management", version: "6.0.1", size: "8.9 MB", rating: 4.5, downloads: "10.1K", permissions: ['System', 'Admin'], lastUpdate: '2024-01-06' },
  { id: "game-center", name: "Game Hub", category: "Games", description: "Mini-games collection", version: "2.0.0", size: "34.2 MB", rating: 4.5, downloads: "42.8K", new: true, permissions: ['Graphics', 'Audio'], lastUpdate: '2024-01-23' },
  { id: "containment-game", name: "Containment Breach", category: "Games", description: "Survive the night shift monitoring escaped anomalies. Use cameras, doors, and lures to prevent containment breaches until 6AM.", version: "1.0.0", size: "18.7 MB", rating: 4.9, downloads: "67.2K", featured: true, new: true, permissions: ['Graphics', 'Audio', 'Notifications'], lastUpdate: '2024-01-24' },
  { id: "untitled-card-game", name: "Untitled Card Game", category: "Games", description: "A 21-style card game. Get as close to 21 as you can without going bust! Play against bots of varying difficulty.", version: "1.0.0", size: "12.4 MB", rating: 4.6, downloads: "23.5K", new: true, permissions: ['Graphics', 'Audio'], lastUpdate: '2024-01-25' },
  { id: "shop", name: "Kroner Shop", category: "Lifestyle", description: "Spend your hard-earned Kroner on themes, titles, badges, wallpapers, and profile effects. Customize your UrbanShade experience!", version: "1.0.0", size: "2.1 MB", rating: 4.9, downloads: "89.3K", featured: true, new: true, permissions: ['Network'], lastUpdate: '2026-01-13' },
  { id: "certificate-viewer", name: "Certificate Viewer", category: "Lifestyle", description: "View all your earned certificates from Battle Pass completions and Epic/Legendary achievements.", version: "1.0.0", size: "1.8 MB", rating: 4.8, downloads: "45.2K", new: true, permissions: [], lastUpdate: '2026-01-13' },
  { id: "encryption", name: "File Encryptor", category: "Security", description: "AES-256 encryption", version: "6.2.0", size: "4.8 MB", rating: 4.9, downloads: "27.4K", permissions: ['File Access', 'Encryption'], lastUpdate: '2024-01-02' },
  { id: "password-manager", name: "Password Vault", category: "Security", description: "Secure passwords", version: "7.1.3", size: "5.6 MB", rating: 4.7, downloads: "38.1K", featured: true, permissions: ['Encryption', 'System'], lastUpdate: '2024-01-17' },
].map(app => ({ ...app, reviews: generateReviews(app.name) }));

interface DownloadState {
  appId: string;
  progress: number;
  status: 'downloading' | 'installing' | 'complete';
}

export const AppStore = ({ onInstall }: { onInstall?: (appId: string) => void }) => {
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);
  const [downloads, setDownloads] = useState<DownloadState[]>([]);
  const [activeTab, setActiveTab] = useState("browse");

  useEffect(() => {
    const installed = localStorage.getItem("urbanshade_installed_apps");
    if (installed) setInstalledApps(JSON.parse(installed));
  }, []);

  const categories = ["all", ...Array.from(new Set(AVAILABLE_APPS.map(app => app.category.toLowerCase())))];

  const filteredApps = AVAILABLE_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                         app.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || app.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = useCallback((app: StoreApp) => {
    // Check if already installed
    if (installedApps.includes(app.id)) {
      toast.info(`${app.name} is already installed`);
      return;
    }

    setDownloads(prev => [...prev, { appId: app.id, progress: 0, status: 'downloading' }]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setDownloads(prev => prev.map(d => 
          d.appId === app.id ? { ...d, progress: 100, status: 'installing' } : d
        ));

        setTimeout(() => {
          setDownloads(prev => prev.map(d => 
            d.appId === app.id ? { ...d, status: 'complete' } : d
          ));

          // Auto-install: Add directly to installed apps
          const currentInstalled = JSON.parse(localStorage.getItem('urbanshade_installed_apps') || '[]');
          if (!currentInstalled.includes(app.id)) {
            currentInstalled.push(app.id);
            localStorage.setItem('urbanshade_installed_apps', JSON.stringify(currentInstalled));
            setInstalledApps(currentInstalled);
          }

          toast.success(`${app.name} installed successfully!`);
          onInstall?.(app.id);
          window.dispatchEvent(new Event('storage'));

          setTimeout(() => {
            setDownloads(prev => prev.filter(d => d.appId !== app.id));
          }, 2000);
        }, 800);
      } else {
        setDownloads(prev => prev.map(d => 
          d.appId === app.id ? { ...d, progress } : d
        ));
      }
    }, 150);
  }, [onInstall, installedApps]);

  const handleUninstall = (appId: string, appName: string) => {
    if (!window.confirm(`Uninstall ${appName}?`)) return;
    const newInstalled = installedApps.filter(id => id !== appId);
    setInstalledApps(newInstalled);
    localStorage.setItem("urbanshade_installed_apps", JSON.stringify(newInstalled));
    toast.success(`${appName} uninstalled!`);
    window.dispatchEvent(new Event('storage'));
  };

  const isInstalled = (appId: string) => installedApps.includes(appId);
  const isDownloading = (appId: string) => downloads.some(d => d.appId === appId);
  const getDownloadState = (appId: string) => downloads.find(d => d.appId === appId);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star}
          className={cn(
            "w-3 h-3",
            star <= Math.floor(rating) 
              ? "fill-amber-400 text-amber-400" 
              : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );

  // App Detail View
  if (selectedApp) {
    const app = selectedApp;
    const config = CATEGORY_CONFIG[app.category];
    const AppIcon = config?.icon || Package;
    const dlState = getDownloadState(app.id);
    
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-cyan-500/5">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
          <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium flex-1 truncate">{app.name}</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* App Header */}
            <div className="flex items-start gap-3">
              <div className={cn("p-3 rounded-xl bg-muted/50 shrink-0", config?.color)}>
                <AppIcon className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold truncate">{app.name}</h1>
                <p className="text-sm text-muted-foreground">{app.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  {renderStars(app.rating)}
                  <span className="text-sm">{app.rating}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {isDownloading(app.id) ? (
              <Button size="lg" disabled className="w-full gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {Math.round(dlState?.progress || 0)}%
              </Button>
            ) : isInstalled(app.id) ? (
              <div className="flex gap-2">
                <Button size="lg" variant="outline" disabled className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Installed
                </Button>
                <Button size="lg" variant="destructive" onClick={() => handleUninstall(app.id, app.name)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button size="lg" onClick={() => handleInstall(app)} className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600 text-white">
                <Download className="w-4 h-4" />
                Install
              </Button>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-muted/50">
                <div className="font-bold text-sm">{app.downloads}</div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <div className="font-bold text-sm">v{app.version}</div>
                <div className="text-xs text-muted-foreground">Version</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <div className="font-bold text-sm">{app.size}</div>
                <div className="text-xs text-muted-foreground">Size</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-1 text-sm">About</h3>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </div>

            {/* Permissions */}
            {app.permissions && (
              <div>
                <h3 className="font-semibold mb-2 text-sm">Permissions</h3>
                <div className="flex flex-wrap gap-1.5">
                  {app.permissions.map(perm => (
                    <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Reviews</h3>
              <div className="space-y-2">
                {app.reviews?.map((review, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{review.user}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-cyan-500/5">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20">
            <Package className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">App Store</h1>
            <p className="text-xs text-muted-foreground">Download apps for your system</p>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <Package className="w-3 h-3" />
            {installedApps.length} Installed
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="browse" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="installed" className="gap-2">
              <Check className="w-4 h-4" />
              Installed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === "browse" && (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search apps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                const categoryKey = key.toLowerCase();
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === categoryKey ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(categoryKey)}
                    className="gap-1.5"
                  >
                    <Icon className={cn("w-3 h-3", selectedCategory !== categoryKey && config.color)} />
                    {config.label}
                  </Button>
                );
              })}
            </div>

            {/* Featured Section */}
            {selectedCategory === "all" && !search && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Featured Apps
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_APPS.filter(p => p.featured).slice(0, 4).map(app => (
                    <AppCard
                      key={app.id}
                      app={app}
                      compact
                      isInstalled={isInstalled(app.id)}
                      onInstall={() => handleInstall(app)}
                      onView={() => setSelectedApp(app)}
                      renderStars={renderStars}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* App List */}
            <div className="space-y-2">
              {filteredApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  isInstalled={isInstalled(app.id)}
                  isDownloading={isDownloading(app.id)}
                  downloadProgress={getDownloadState(app.id)?.progress}
                  onInstall={() => handleInstall(app)}
                  onUninstall={() => handleUninstall(app.id, app.name)}
                  onView={() => setSelectedApp(app)}
                  renderStars={renderStars}
                />
              ))}

              {filteredApps.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No apps found</p>
                  <p className="text-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "installed" && (
          <div className="p-4 space-y-3">
            {installedApps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No apps installed</p>
                <p className="text-sm">Browse the store to find apps</p>
              </div>
            ) : (
              AVAILABLE_APPS.filter(p => installedApps.includes(p.id)).map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  isInstalled
                  onInstall={() => {}}
                  onUninstall={() => handleUninstall(app.id, app.name)}
                  onView={() => setSelectedApp(app)}
                  renderStars={renderStars}
                />
              ))
            )}
          </div>
        )}
      </ScrollArea>

      {/* Downloads Bar */}
      {downloads.length > 0 && (
        <div className="border-t border-border p-2 space-y-1 shrink-0 bg-background/80 backdrop-blur-sm">
          {downloads.map(dl => {
            const app = AVAILABLE_APPS.find(a => a.id === dl.appId);
            return (
              <div key={dl.appId} className="flex items-center gap-2 text-xs">
                <span className="truncate flex-1">{app?.name}</span>
                <Progress value={dl.progress} className="w-20 h-1.5" />
                <span className="w-12 text-right text-muted-foreground">
                  {dl.status === 'complete' ? '✓' : `${Math.round(dl.progress)}%`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// App Card Component
interface AppCardProps {
  app: StoreApp;
  compact?: boolean;
  isInstalled: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
  onInstall: () => void;
  onUninstall?: () => void;
  onView: () => void;
  renderStars: (rating: number) => React.ReactNode;
}

const AppCard = ({ 
  app, compact, isInstalled, isDownloading, downloadProgress, onInstall, onUninstall, onView, renderStars 
}: AppCardProps) => {
  const config = CATEGORY_CONFIG[app.category];
  const Icon = config?.icon || Package;

  if (compact) {
    return (
      <button
        onClick={onView}
        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all text-left"
      >
        <div className={cn("p-2 rounded-lg bg-muted/50", config?.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{app.name}</div>
          <div className="flex items-center gap-2">
            {renderStars(app.rating)}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="group flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
      <button 
        onClick={onView}
        className={cn("p-2.5 rounded-xl bg-muted/50 shrink-0", config?.color)}
      >
        <Icon className="w-5 h-5" />
      </button>
      
      <div className="flex-1 min-w-0">
        <button onClick={onView} className="text-left w-full">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{app.name}</h3>
            {app.new && <Badge className="bg-green-500/20 text-green-400 text-[10px] px-1.5">NEW</Badge>}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">{app.description}</p>
        </button>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {renderStars(app.rating)}
          <span>{app.downloads}</span>
          <Badge variant="outline" className="text-[10px] capitalize">{app.category}</Badge>
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        {isDownloading ? (
          <Button variant="outline" size="sm" disabled className="gap-1 text-xs min-w-[70px]">
            <Loader2 className="w-3 h-3 animate-spin" />
            {Math.round(downloadProgress || 0)}%
          </Button>
        ) : isInstalled ? (
          <>
            <Button variant="outline" size="sm" disabled className="gap-1 text-xs">
              <Check className="w-3 h-3" />
            </Button>
            {onUninstall && (
              <Button variant="ghost" size="sm" onClick={onUninstall} className="text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </>
        ) : (
          <Button size="sm" onClick={onInstall} className="gap-1 text-xs bg-cyan-500 hover:bg-cyan-600 text-white">
            <Download className="w-3 h-3" />
            Install
          </Button>
        )}
      </div>
    </div>
  );
};
