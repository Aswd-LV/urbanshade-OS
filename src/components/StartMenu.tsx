import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "./Desktop";
import { LogOut, Activity, RotateCcw, Power, ChevronUp, Shield, HardDrive, Cloud, Clock, X, FileText, Folder, Search, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRecentFiles, RecentFile } from "@/hooks/useRecentFiles";
import { ScrollArea } from "./ui/scroll-area";
import * as icons from "lucide-react";

interface StartMenuProps {
  open: boolean;
  apps: App[];
  onClose: () => void;
  onOpenApp: (app: App) => void;
  onReboot: () => void;
  onShutdown: () => void;
  onLogout: () => void;
}

export const StartMenu = ({ open, apps, onClose, onOpenApp, onReboot, onShutdown, onLogout }: StartMenuProps) => {
  const [search, setSearch] = useState("");
  const [rebootMenuOpen, setRebootMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { recentFiles, addRecent, clearRecent } = useRecentFiles();
  const navigate = useNavigate();

  // Get current user data
  const currentUserData = JSON.parse(localStorage.getItem("urbanshade_current_user") || "{}");
  const userName = currentUserData.name || currentUserData.username || "User";
  const userRole = currentUserData.role || "User";
  
  // Get profile icon
  const profileIconName = localStorage.getItem("urbanshade_profile_icon") || "User";
  const profileColor = localStorage.getItem("urbanshade_profile_color") || "#00d4ff";
  const ProfileIcon = (icons as any)[profileIconName] || icons.User;
  
  // Check if online mode is active
  const isOnlineMode = localStorage.getItem("urbanshade_online_mode") === "true";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startBtn = document.querySelector('[data-start-button]');
        if (startBtn && !startBtn.contains(e.target as Node)) {
          onClose();
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search on open
      setTimeout(() => searchRef.current?.focus(), 100);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  // Reset search when closing
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  if (!open) return null;

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenApp = (app: App) => {
    // Add to recent
    addRecent({
      name: app.name,
      type: "app",
      appId: app.id
    });
    onOpenApp(app);
    onClose();
  };

  const getRecentIcon = (item: RecentFile) => {
    switch (item.type) {
      case "app":
        return <Activity className="w-4 h-4" />;
      case "folder":
        return <Folder className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatRecentTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div
      ref={menuRef}
      className="fixed left-3 bottom-[78px] w-[680px] h-[740px] rounded-2xl backdrop-blur-2xl bg-background/95 border border-border/50 z-[9999] shadow-2xl overflow-hidden animate-slide-in-right"
    >
      {/* Search Bar at Top */}
      <div className="p-6 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search for apps, settings, and documents"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-[calc(100%-140px)]">
        <ScrollArea className="flex-1">
          {/* Pinned Apps Section */}
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Pinned</h3>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  All apps →
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-3">
              {filteredApps.slice(0, 18).map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => handleOpenApp(app)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all group animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                  <div className="text-[10px] text-center text-foreground leading-tight line-clamp-2">
                    {app.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Section */}
            {recentFiles.length > 0 && !search && (
              <div className="mt-6 pt-6 border-t border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Recent
                  </h3>
                  <button 
                    onClick={clearRecent}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentFiles.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.appId) {
                          const app = apps.find(a => a.id === item.appId);
                          if (app) handleOpenApp(app);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-primary">
                        {getRecentIcon(item)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatRecentTime(item.timestamp)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with User and Power */}
        <div className="border-t border-border/30 p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                navigate("/acc-manage");
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted/50 transition-all"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${profileColor}20` }}
              >
                <ProfileIcon className="w-4 h-4" style={{ color: profileColor }} />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  {userName}
                  {isOnlineMode && <Cloud className="w-3 h-3 text-blue-400" />}
                </div>
                <div className="text-xs text-muted-foreground">{userRole}</div>
              </div>
            </button>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  onShutdown();
                  onClose();
                }}
                className="w-10 h-10 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-all group"
                title="Shut down"
              >
                <Power className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
              
              <Popover open={rebootMenuOpen} onOpenChange={setRebootMenuOpen}>
                <PopoverTrigger asChild>
                  <button 
                    className="w-10 h-10 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-all group"
                    title="Reboot options"
                  >
                    <RotateCcw className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="end"
                  className="w-56 p-2 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl animate-scale-in"
                >
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onReboot();
                        onClose();
                        setRebootMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-all text-left group"
                    >
                      <RotateCcw className="w-4 h-4 text-primary group-hover:text-primary/80" />
                      <div>
                        <div className="text-sm font-medium text-foreground">Restart</div>
                        <div className="text-xs text-muted-foreground">Standard reboot</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log("Restart to BIOS");
                        setRebootMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-all text-left group"
                    >
                      <Shield className="w-4 h-4 text-primary group-hover:text-primary/80" />
                      <div>
                        <div className="text-sm font-medium text-foreground">Restart to BIOS</div>
                        <div className="text-xs text-muted-foreground">Enter system setup</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log("Restart to Recovery");
                        setRebootMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-all text-left group"
                    >
                      <HardDrive className="w-4 h-4 text-primary group-hover:text-primary/80" />
                      <div>
                        <div className="text-sm font-medium text-foreground">Restart to Recovery</div>
                        <div className="text-xs text-muted-foreground">Advanced options</div>
                      </div>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <button 
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-10 h-10 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-all group"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
