import { useState, useEffect, useCallback } from "react";
import { 
  Download, Check, Search, Package, Star, ChevronLeft, ChevronRight,
  Sparkles, Shield, Gamepad2, Wrench, Cpu, Globe, Camera, Music,
  MessageSquare, BookOpen, Trash2, RefreshCw, HardDrive, Eye,
  TrendingUp, X, Loader2
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

const CATEGORY_ICONS: Record<string, typeof Package> = {
  Productivity: BookOpen,
  Graphics: Camera,
  Entertainment: Music,
  Utilities: Wrench,
  Security: Shield,
  Communication: MessageSquare,
  Network: Globe,
  System: Cpu,
  Games: Gamepad2,
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);
  const [downloads, setDownloads] = useState<DownloadState[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("browse");

  const featuredApps = AVAILABLE_APPS.filter(app => app.featured);

  useEffect(() => {
    const installed = localStorage.getItem("urbanshade_installed_apps");
    if (installed) setInstalledApps(JSON.parse(installed));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredApps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredApps.length]);

  const categories = ["All", ...Array.from(new Set(AVAILABLE_APPS.map(app => app.category)))];

  const filteredApps = AVAILABLE_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                         app.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = useCallback((app: StoreApp) => {
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

          const dlList = JSON.parse(localStorage.getItem('downloads_installers') || '[]');
          dlList.push({
            id: Date.now().toString(),
            name: `${app.name} Installer.exe`,
            appId: app.id,
            appName: app.name,
            size: app.size,
            downloaded: new Date().toISOString()
          });
          localStorage.setItem('downloads_installers', JSON.stringify(dlList));

          toast.success(`${app.name} downloaded!`);
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
  }, [onInstall]);

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
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );

  const CategoryIcon = ({ category }: { category: string }) => {
    const Icon = CATEGORY_ICONS[category] || Package;
    return <Icon className="w-4 h-4" />;
  };

  // App Detail View
  if (selectedApp) {
    const app = selectedApp;
    const AppIcon = CATEGORY_ICONS[app.category] || Package;
    const dlState = getDownloadState(app.id);
    
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 border-b border-border shrink-0">
          <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium flex-1 truncate">{app.name}</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* App Header */}
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                <AppIcon className="w-8 h-8 text-primary" />
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
              <Button size="lg" onClick={() => handleInstall(app)} className="w-full gap-2">
                <Download className="w-4 h-4" />
                Download ({app.size})
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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-3 space-y-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold truncate">App Store</h1>
            <p className="text-xs text-muted-foreground">{AVAILABLE_APPS.length} apps</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="browse" className="text-xs gap-1 px-2">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Browse</span>
            </TabsTrigger>
            <TabsTrigger value="installed" className="text-xs gap-1 px-2">
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">Installed</span>
              <span className="sm:hidden">({installedApps.length})</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="text-xs gap-1 px-2">
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === "browse" && (
          <div className="p-3 space-y-4">
            {/* Featured - Compact on mobile */}
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-3">
              <Badge className="mb-2 bg-primary/20 text-primary text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold truncate">{featuredApps[featuredIndex]?.name}</h2>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {featuredApps[featuredIndex]?.description}
                  </p>
                  <div className="flex items-center gap-2">
                    {renderStars(featuredApps[featuredIndex]?.rating || 0)}
                    <span className="text-xs text-muted-foreground">
                      {featuredApps[featuredIndex]?.downloads}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="shrink-0"
                  onClick={() => featuredApps[featuredIndex] && handleInstall(featuredApps[featuredIndex])}
                  disabled={isInstalled(featuredApps[featuredIndex]?.id || '') || isDownloading(featuredApps[featuredIndex]?.id || '')}
                >
                  {isInstalled(featuredApps[featuredIndex]?.id || '') ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                </Button>
              </div>
              
              {/* Dots */}
              <div className="flex gap-1 justify-center mt-3">
                {featuredApps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFeaturedIndex(i)}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      i === featuredIndex ? "bg-primary w-4" : "bg-primary/30"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search apps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Categories - Horizontal scroll */}
            <ScrollArea className="w-full">
              <div className="flex gap-1.5 pb-1">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="gap-1 shrink-0 h-7 px-2 text-xs"
                  >
                    {cat !== "All" && <CategoryIcon category={cat} />}
                    {cat}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* New Apps */}
            {selectedCategory === "All" && !search && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  New & Updated
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_APPS.filter(a => a.new).slice(0, 4).map(app => {
                    const Icon = CATEGORY_ICONS[app.category] || Package;
                    return (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all text-left"
                      >
                        <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs truncate">{app.name}</div>
                          <div className="flex items-center gap-1">
                            {renderStars(app.rating)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* App List */}
            <div>
              <h3 className="text-sm font-semibold mb-2">
                {selectedCategory === "All" ? "All Apps" : selectedCategory}
              </h3>
              <div className="space-y-2">
                {filteredApps.map(app => {
                  const Icon = CATEGORY_ICONS[app.category] || Package;
                  const dlState = getDownloadState(app.id);
                  
                  return (
                    <div 
                      key={app.id} 
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                    >
                      <button 
                        onClick={() => setSelectedApp(app)} 
                        className="p-2 rounded-lg bg-primary/10 shrink-0"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                      </button>
                      
                      <button 
                        onClick={() => setSelectedApp(app)} 
                        className="flex-1 min-w-0 text-left"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm truncate">{app.name}</span>
                          {app.new && <Badge className="bg-green-500/20 text-green-400 text-[10px] px-1">NEW</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {renderStars(app.rating)}
                          <span>{app.size}</span>
                        </div>
                      </button>

                      <div className="shrink-0">
                        {isDownloading(app.id) ? (
                          <Button size="sm" disabled className="h-8 w-16 text-xs">
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            {Math.round(dlState?.progress || 0)}%
                          </Button>
                        ) : isInstalled(app.id) ? (
                          <Button variant="outline" size="sm" disabled className="h-8 w-16">
                            <Check className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleInstall(app)} className="h-8 w-16 text-xs">
                            Get
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredApps.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No apps found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "installed" && (
          <div className="p-3 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <HardDrive className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm">{installedApps.length} apps</div>
                <div className="text-xs text-muted-foreground">Installed</div>
              </div>
            </div>

            {installedApps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No apps installed</p>
              </div>
            ) : (
              <div className="space-y-2">
                {AVAILABLE_APPS.filter(app => installedApps.includes(app.id)).map(app => {
                  const Icon = CATEGORY_ICONS[app.category] || Package;
                  return (
                    <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{app.name}</div>
                        <div className="text-xs text-muted-foreground">{app.size} • v{app.version}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)} className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleUninstall(app.id, app.name)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "updates" && (
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Available Updates</h3>
              <Button size="sm" className="h-7 text-xs gap-1">
                <RefreshCw className="w-3 h-3" />
                Update All
              </Button>
            </div>

            {installedApps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Check className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No updates available</p>
              </div>
            ) : (
              <div className="space-y-2">
                {AVAILABLE_APPS.filter((app, i) => installedApps.includes(app.id) && i % 3 === 0).map(app => (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{app.name}</div>
                      <div className="text-xs text-muted-foreground">
                        v{app.version} → v{(parseFloat(app.version) + 0.1).toFixed(1)}.0
                      </div>
                    </div>
                    <Button size="sm" className="h-7 text-xs gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Update
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Downloads Bar */}
      {downloads.length > 0 && (
        <div className="border-t border-border p-2 space-y-1 shrink-0">
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
