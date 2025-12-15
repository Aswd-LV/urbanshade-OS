import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Check, Cloud, PartyPopper, Rocket, Zap, Shield, Monitor, Star, ArrowRight } from "lucide-react";

export const ChangelogDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("2.8");
  const currentVersion = "2.8";

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem("urbanshade_last_seen_version");
    if (lastSeenVersion !== currentVersion) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("urbanshade_last_seen_version", currentVersion);
    setOpen(false);
  };

  const changelogs: Record<string, { icon: React.ReactNode; color: string; tagline: string; sections: Record<string, string[]> }> = {
    "2.8": {
      icon: <Rocket className="w-5 h-5" />,
      color: "from-cyan-500 to-blue-600",
      tagline: "The Mass Update",
      sections: {
        "Account Management": [
          "New /acc-manage page for full account control",
          "Custom profile icons using Lucide icons with color picker",
          "Data deletion controls - delete specific data categories",
          "Factory reset and account deletion options",
          "Cloud disconnect for switching to local mode"
        ],
        "UUR Package Manager": [
          "REAL GitHub package fetching - install apps from any GitHub repo",
          "Install from GitHub URL directly in UUR Manager",
          "Package manifest validation and HTML rendering",
          "Improved package cards with source indicators"
        ],
        "Quality & Polish": [
          "Wider changelog version selector with text wrapping",
          "Stable 2-minute auto-sync interval",
          "Do Not Disturb mode for notifications",
          "Quick Settings flyout from taskbar"
        ],
        "Window Management": [
          "Window snap zones - drag to edges for positioning",
          "Visual snap indicators while dragging",
          "Improved window controls"
        ],
        "Desktop Enhancements": [
          "Enhanced right-click context menu",
          "View options (Large/Medium/Small icons)",
          "Sort icons by name, type, or date"
        ],
        "Start Menu": [
          "Profile icon now shows custom icon with color",
          "Click profile to open Account Management",
          "Recent files section"
        ]
      }
    },
    "2.7": {
      icon: <Cloud className="w-5 h-5" />,
      color: "from-blue-500 to-purple-600",
      tagline: "Cloud Sync Update",
      sections: {
        "Quality of Life": [
          "Updated version numbers throughout the system to v2.7",
          "Start Menu now shows your actual username and role",
          "Cloud sync indicator in Start Menu when online",
          "Copyright year updated to 2025"
        ],
        "Online Accounts": [
          "UUR submissions now sync to Supabase cloud storage",
          "Better visual feedback for sync status",
          "Connected email displayed in Settings"
        ],
        "UUR Manager Redesign": [
          "Complete visual overhaul with advanced UI",
          "New sidebar navigation with category filters",
          "Enhanced package cards with detailed info",
          "Statistics dashboard showing package counts"
        ]
      }
    },
    "2.6": {
      icon: <Shield className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600",
      tagline: "Security Update",
      sections: {
        "Online Accounts": [
          "Full Supabase-powered online account system",
          "Sign up and sign in with email and password",
          "Automatic settings sync every 2 minutes",
          "Cloud backup of desktop icons, installed apps, and system settings"
        ],
        "Settings Improvements": [
          "New 'Online Account' section (visible when signed in)",
          "View account info, email, and sync status",
          "Sign out and switch to local mode"
        ]
      }
    },
    "2.5": {
      icon: <Zap className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-600",
      tagline: "UUR Manager Update",
      sections: {
        "UUR Manager": [
          "New UUR Manager app accessible from Desktop and Terminal",
          "Real built-in packages: Hello World and System Info",
          "Package submission system for community contributions"
        ],
        "CrashScreen Redesign": [
          "Styled crash screen with different colors per crash type",
          "Clear labeling for testing purposes"
        ]
      }
    },
    "2.0": {
      icon: <Monitor className="w-5 h-5" />,
      color: "from-gray-500 to-slate-600",
      tagline: "Major Rewrite",
      sections: {
        "Major Changes": [
          "Complete rewrite using React and Tailwind CSS",
          "Modern component-based architecture",
          "TypeScript for better code quality"
        ]
      }
    }
  };

  const versionData = changelogs[selectedVersion];
  const isLatestVersion = selectedVersion === currentVersion;
  const versions = Object.keys(changelogs);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden animate-scale-in bg-background border-border/50 gap-0">
        <div className="flex h-full">
          {/* Left Sidebar - Version List */}
          <div className="w-64 bg-muted/30 border-r border-border/50 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-black text-sm">
                  U
                </div>
                <span className="font-bold text-foreground">URBANSHADE</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Release Notes</p>
            </div>

            {/* Version List */}
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-1">
                {versions.map((version) => {
                  const data = changelogs[version];
                  const isSelected = selectedVersion === version;
                  const isLatest = version === currentVersion;
                  
                  return (
                    <button
                      key={version}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary-foreground/20" : "bg-muted"
                        }`}>
                          {data.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">v{version}</span>
                            {isLatest && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                isSelected ? "bg-primary-foreground/20" : "bg-primary/20 text-primary"
                              }`}>
                                NEW
                              </span>
                            )}
                          </div>
                          <p className={`text-xs whitespace-normal break-words ${
                            isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {data.tagline}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Content - Changelog Details */}
          <div className="flex-1 flex flex-col">
            {/* Version Header */}
            <div className={`relative px-8 py-8 bg-gradient-to-br ${versionData?.color || "from-primary to-primary/60"} overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTQgMC00IDQtNCA0czAgNCA0IDRjMiAwIDItMiAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    {versionData?.icon || <Sparkles className="w-7 h-7 text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-black text-white">Version {selectedVersion}</h1>
                      {isLatestVersion && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                          <Star className="w-3 h-3" /> Latest
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm mt-1">{versionData?.tagline}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Changelog Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-5 pb-4">
                {Object.entries(versionData?.sections || {}).map(([section, items], sectionIndex) => (
                  <div 
                    key={section} 
                    className="rounded-xl border border-border/50 overflow-hidden animate-fade-in bg-card/50"
                    style={{ animationDelay: `${sectionIndex * 80}ms` }}
                  >
                    <div className="px-5 py-3 bg-muted/50 border-b border-border/30 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-sm">{section}</h3>
                      <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                        {items.length} {items.length === 1 ? 'change' : 'changes'}
                      </span>
                    </div>
                    <ul className="p-4 space-y-2.5">
                      {items.map((text, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm animate-fade-in group"
                          style={{ animationDelay: `${(sectionIndex * 80) + (i * 40)}ms` }}
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          <span className="text-foreground/85 leading-relaxed">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Thank you for using URBANSHADE OS!
              </p>
              <Button onClick={handleClose} className="px-8 font-bold">
                Let's Go!
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
