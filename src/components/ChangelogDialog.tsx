import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Check, Cloud, PartyPopper, Rocket, Zap, Shield, Monitor, Star, ArrowRight, Info, Paintbrush } from "lucide-react";

export const ChangelogDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("2.9");
  const currentVersion = "2.9";

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

  interface VersionData {
    icon: React.ReactNode;
    color: string;
    tagline: string;
    overview: string;
    sections: Record<string, string[]>;
  }

  const changelogs: Record<string, VersionData> = {
    "2.9": {
      icon: <Paintbrush className="w-5 h-5" />,
      color: "from-purple-500 to-pink-600",
      tagline: "Smol Update",
      overview: "Major improvements to the desktop experience! Virtual desktops now properly isolate windows, new Settings categories for personalization, guest account support, DEF-DEV debugging tools, enhanced system tray, and improved boot experience with animations.",
      sections: {
        "Virtual Desktops": [
          "Fixed window assignment - windows now properly belong to their desktop",
          "Taskbar and Alt+Tab now filter to active desktop only",
          "Slide animations when switching between desktops",
          "Improved Desktop Switcher UI with window previews",
          "Keyboard shortcuts: Ctrl+Win+←/→ to switch desktops"
        ],
        "Settings Overhaul": [
          "NEW: Animation speed control (slow, normal, fast, instant)",
          "NEW: Taskbar position (bottom, top, left, right)",
          "NEW: Window transparency slider",
          "NEW: Start Menu style toggle (modern/classic)",
          "NEW: Desktop switcher visibility toggle",
          "Enhanced appearance section with more customization"
        ],
        "Account Management": [
          "NEW: Guest account support - enable in Settings",
          "Guest sessions are temporary with limited access",
          "Guest login only shows when enabled",
          "Improved account cards with role badges"
        ],
        "DEF-DEV Tools": [
          "NEW: Performance Monitor with CPU/memory graphs",
          "NEW: Network Inspector for request debugging",
          "NEW: Event Debugger for system events",
          "NEW: Component Inspector for React tree"
        ],
        "Boot & System Tray": [
          "Enhanced BIOS screen with semantic colors",
          "Lock screen password visibility toggle",
          "System tray with volume, battery, clock",
          "Hidden icons overflow menu"
        ],
        "Version Updates": [
          "All version strings updated to v2.9 across the system",
          "Updated build number to 20251225"
        ]
      }
    },
    "2.8": {
      icon: <Rocket className="w-5 h-5" />,
      color: "from-cyan-500 to-blue-600",
      tagline: "The Mass Update",
      overview: "A massive overhaul bringing real cloud messaging, admin moderation panel, contacts system, simulation triggers, and polished UI throughout. Send real messages to other UrbanShade users!",
      sections: {
        "Cloud Messaging": [
          "NEW: Real messaging system between cloud users",
          "Contacts/Favorites system - save frequent recipients",
          "Message search through subjects and bodies",
          "Message templates for quick replies",
          "Rate limiting: 15 messages per 5 minutes, 1 hour cooldown",
          "Max 3 pending (unread) messages at a time"
        ],
        "Admin Moderation Panel": [
          "NEW: /moderation route for admin-only access",
          "Warn users with logged reasons",
          "Temp ban (1h, 24h, 7d, 30d) or permanent ban",
          "FAKE BAN prank feature - shows ban then reveals joke!",
          "Full moderation action logs",
          "Server-side admin verification via edge function"
        ],
        "DEF-DEV Simulation Triggers": [
          "NEW: Fake timeout simulation",
          "Network failure simulation",
          "Storage full simulation",
          "Auth failure simulation",
          "Database error simulation"
        ],
        "Quality & Polish": [
          "Disclaimer screen updated for cloud/local mode accuracy",
          "Export/import contacts as JSON",
          "Changelog overview section for each version",
          "Version updated to 2.8.0 throughout"
        ]
      }
    },
    "2.7": {
      icon: <Cloud className="w-5 h-5" />,
      color: "from-blue-500 to-purple-600",
      tagline: "Cloud Sync Update",
      overview: "Introducing cloud synchronization powered by Supabase. Your settings, desktop icons, and installed apps now sync across devices. UUR Manager received a complete visual redesign with advanced filtering and statistics.",
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
      overview: "The foundation for online accounts is here. Sign up with email and password, and your settings automatically sync to the cloud every 2 minutes. Your data is protected with Row Level Security policies.",
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
      overview: "The UUR package manager debuts with real built-in packages. Hello World and System Info ship as proof-of-concept apps, demonstrating the package installation system works correctly.",
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
      overview: "This update doesn't bring new features, however the entire site has been rewritten in TypeScript, React, and Vite. This modernizes the codebase with component-based architecture for better maintainability and improved overall quality.",
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
      <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden animate-scale-in bg-background border-border/50 gap-0 flex flex-col">
        <div className="flex h-full min-h-0 flex-1">
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
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Version Header */}
            <div className={`relative px-8 py-8 bg-gradient-to-br ${versionData?.color || "from-primary to-primary/60"} overflow-hidden shrink-0`}>
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

            {/* Changelog Content - Scrollable */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-5 pb-4">
                {/* Update Overview */}
                {versionData?.overview && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-primary" />
                      <h3 className="font-bold text-sm text-primary">Update Overview</h3>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {versionData.overview}
                    </p>
                  </div>
                )}

                {/* Change Sections */}
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
            <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between shrink-0">
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
