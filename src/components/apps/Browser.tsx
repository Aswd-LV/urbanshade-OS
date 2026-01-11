import { useState } from "react";
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home, Lock, Star, Search, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Page {
  url: string;
  title: string;
  content: JSX.Element;
}

export const Browser = () => {
  const pages: Record<string, Page> = {
    "urbanshade.local": {
      url: "urbanshade.local",
      title: "Urbanshade Intranet Portal",
      content: (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">URBANSHADE INTRANET</h1>
            <p className="text-muted-foreground text-sm">Secure Internal Network Portal</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { url: "research.urbanshade.local", title: "Research Division", desc: "Access research data", color: "primary" },
              { url: "security.urbanshade.local", title: "Security Protocols", desc: "Security procedures", color: "primary" },
              { url: "personnel.urbanshade.local", title: "Personnel Directory", desc: "Employee contacts", color: "primary" },
              { url: "operations.urbanshade.local", title: "Operations", desc: "Daily schedules", color: "primary" },
              { url: "docs.urbanshade.local", title: "Documentation", desc: "System guides", color: "blue" },
              { url: "uur.urbanshade.local", title: "UUR Repository", desc: "Community packages", color: "cyan" },
            ].map(link => (
              <button
                key={link.url}
                onClick={() => navigate(link.url)}
                className={`p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${
                  link.color === "cyan" 
                    ? "bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10" 
                    : link.color === "blue"
                    ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10"
                    : "bg-muted/20 border-border/30 hover:bg-muted/30"
                }`}
              >
                <h3 className={`font-bold text-sm mb-1 ${
                  link.color === "cyan" ? "text-cyan-400" : 
                  link.color === "blue" ? "text-blue-400" : "text-primary"
                }`}>{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("classified.urbanshade.local")}
            className="w-full mt-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-sm text-red-400">Classified Archives</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Level 5+ clearance required</p>
          </button>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="font-bold text-primary text-sm mb-1">System Notice</div>
            <div className="text-xs text-muted-foreground">
              All network activity is monitored. Unauthorized access will result in security response.
            </div>
          </div>
        </div>
      )
    },
    "research.urbanshade.local": {
      url: "research.urbanshade.local",
      title: "Research Division Portal",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">RESEARCH DIVISION</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Active Specimen Research</h3>
                <span className="text-xs text-red-400">CLEARANCE LEVEL 4+</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div>Z-13 "Pressure" - Behavioral Analysis Phase 3</div>
                <div>Z-96 "Pandemonium" - Containment Protocol Review</div>
                <div>Z-283 "Angler" - Deep Sea Adaptation Study</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Recent Publications</h3>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div>Pressure Resistance in Extreme Environments (Dr. Chen)</div>
                <div>Adaptive Behavior Patterns of Deep Sea Specimens</div>
                <div>Containment Optimization Strategies</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="font-bold text-red-400 text-sm mb-1">Z-13 Behavioral Alert</div>
              <div className="text-xs text-red-400/80">
                Subject has demonstrated unprecedented pattern recognition. Maintain minimum safe distance.
              </div>
            </div>
          </div>
        </div>
      )
    },
    "security.urbanshade.local": {
      url: "security.urbanshade.local",
      title: "Security Protocols",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-red-400 mb-6">SECURITY PROTOCOLS</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <h3 className="font-bold text-red-400 text-sm mb-3">Active Alerts</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Zone 4 - Elevated pressure readings
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Terminal T-07 - Failed login attempts
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Clearance Levels</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div>Level 5 - Full facility access</div>
                <div>Level 4 - Research and specimen areas</div>
                <div>Level 3 - General facility areas</div>
                <div>Level 2 - Common areas only</div>
                <div>Level 1 - Public zones</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Emergency Procedures</h3>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div>1. Containment breach - Activate lockdown</div>
                <div>2. Hull integrity warning - Evacuate to safe zones</div>
                <div>3. Power failure - Backup systems auto-engage</div>
                <div>4. Medical emergency - Contact medical bay</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "personnel.urbanshade.local": {
      url: "personnel.urbanshade.local",
      title: "Personnel Directory",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">PERSONNEL DIRECTORY</h1>
          
          <div className="space-y-2">
            {[
              { name: "Aswd", role: "Administrator", dept: "Administration", clearance: "5" },
              { name: "Dr. Chen", role: "Lead Researcher", dept: "Research", clearance: "4" },
              { name: "Tech Morgan", role: "Chief Engineer", dept: "Engineering", clearance: "3" },
              { name: "Officer Blake", role: "Security Chief", dept: "Security", clearance: "3" },
              { name: "Dr. Martinez", role: "Medical Officer", dept: "Medical", clearance: "4" },
            ].map((person, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{person.name}</div>
                  <div className="text-xs text-muted-foreground">{person.role} - {person.dept}</div>
                </div>
                <div className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/10">
                  LVL-{person.clearance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    "operations.urbanshade.local": {
      url: "operations.urbanshade.local",
      title: "Operations Center",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">OPERATIONS CENTER</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Facility Status</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Power Systems</div>
                  <div className="text-green-400 font-medium">OPERATIONAL</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Life Support</div>
                  <div className="text-green-400 font-medium">NOMINAL</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Hull Integrity</div>
                  <div className="text-green-400 font-medium">98.7%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Containment</div>
                  <div className="text-green-400 font-medium">SECURE</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Today's Schedule</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div>08:00 - Morning system diagnostics</div>
                <div>10:00 - Specimen feeding cycle</div>
                <div>14:00 - Staff meeting (Research Division)</div>
                <div>16:00 - Zone 4 pressure maintenance</div>
                <div>20:00 - Evening security sweep</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "classified.urbanshade.local": {
      url: "classified.urbanshade.local",
      title: "Classified Archives - Level 5+",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-red-400 mb-6">CLASSIFIED ARCHIVES</h1>
          
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
            <div className="font-bold text-red-400 text-sm">LEVEL 5 CLEARANCE VERIFIED</div>
            <div className="text-xs text-muted-foreground">User: aswd - Access Granted</div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-red-500/20">
              <h3 className="font-bold text-red-400 text-sm mb-3">PROJECT BLACKBOX</h3>
              <div className="text-sm space-y-1.5 text-muted-foreground">
                <div><span className="text-primary">Objective:</span> [REDACTED] at depth exceeding [REDACTED] meters</div>
                <div><span className="text-primary">Status:</span> Phase 3 - Active monitoring</div>
                <div><span className="text-primary">Lead:</span> Director Morrison</div>
                <div className="text-red-400 text-xs mt-2">Do not discuss outside Level 5 clearance</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-yellow-500/20">
              <h3 className="font-bold text-yellow-400 text-sm mb-3">INCIDENT LOG - Z-13</h3>
              <div className="text-sm space-y-1.5">
                <div className="text-red-400 text-xs">Date: [REDACTED]</div>
                <div className="text-muted-foreground">Subject breached primary containment for 3.7 seconds before recapture. Two casualties. Enhanced protocols implemented.</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Personnel Notes</h3>
              <div className="text-xs space-y-1.5 text-muted-foreground font-mono">
                <div>"It was never about the fish." - Director Morrison</div>
                <div>"The deeper you go, the less the rules apply." - Dr. Chen</div>
                <div>"We're not studying them. They're studying us." - [DELETED]</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "docs.urbanshade.local": {
      url: "docs.urbanshade.local",
      title: "Documentation Center",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">DOCUMENTATION CENTER</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Getting Started</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Welcome to Urbanshade OS - managing all aspects of deep-sea facility operations.</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use the Start Menu to access applications</li>
                  <li>Double-click desktop icons to open apps</li>
                  <li>Check Messages regularly for communications</li>
                  <li>Monitor System Status for facility health</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Terminal Commands</h3>
              <div className="text-sm space-y-1 font-mono">
                <div><span className="text-primary">help</span> - Display all commands</div>
                <div><span className="text-primary">status</span> - Show system status</div>
                <div><span className="text-primary">scan</span> - Run diagnostics</div>
                <div><span className="text-primary">list</span> - List directory contents</div>
                <div><span className="text-primary">logs</span> - View system logs</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Keyboard Shortcuts</h3>
              <div className="text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Open Start Menu</span>
                  <kbd className="px-2 py-0.5 bg-background/50 rounded text-xs">Click U logo</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recovery Mode</span>
                  <kbd className="px-2 py-0.5 bg-background/50 rounded text-xs">Hold Space</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "uur.urbanshade.local": {
      url: "uur.urbanshade.local",
      title: "UUR - UrbanShade User Repository",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-cyan-400 mb-6">UUR - UrbanShade User Repository</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <h3 className="font-bold text-cyan-400 text-sm mb-2">What is UUR?</h3>
              <p className="text-sm text-muted-foreground">
                Community-driven package manager for extensions, themes, and utilities.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Quick Commands</h3>
              <div className="text-sm space-y-1 font-mono">
                <div><span className="text-cyan-400">uur inst &lt;package&gt;</span> - Install</div>
                <div><span className="text-cyan-400">uur rm &lt;package&gt;</span> - Remove</div>
                <div><span className="text-cyan-400">uur search &lt;query&gt;</span> - Search</div>
                <div><span className="text-cyan-400">uur lst app</span> - List all</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Featured Packages</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div><strong>hello-world</strong> - Test your UUR installation</div>
                <div><strong>system-info</strong> - Display system information</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm">
              <div className="font-bold text-cyan-400 mb-1">Tip</div>
              <div className="text-muted-foreground text-xs">
                Open the UUR Manager app from Desktop for a GUI experience.
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const [currentUrl, setCurrentUrl] = useState("urbanshade.local");
  const [inputUrl, setInputUrl] = useState("urbanshade.local");
  const [history, setHistory] = useState<string[]>(["urbanshade.local"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookmarks] = useState(["urbanshade.local", "docs.urbanshade.local", "uur.urbanshade.local"]);

  const navigate = (url: string) => {
    if (pages[url]) {
      setCurrentUrl(url);
      setInputUrl(url);
      const newHistory = [...history.slice(0, historyIndex + 1), url];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(inputUrl);
  };

  const currentPage = pages[currentUrl] || pages["urbanshade.local"];

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Browser Toolbar */}
      <div className="border-b border-border/30 bg-muted/10">
        {/* Navigation Bar */}
        <div className="flex items-center gap-2 p-2">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={goBack}
              disabled={historyIndex === 0}
              className="w-8 h-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className="w-8 h-8 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(currentUrl)}
              className="w-8 h-8 p-0"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("urbanshade.local")}
              className="w-8 h-8 p-0"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>

          {/* URL Bar */}
          <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/30">
              <Lock className="w-3.5 h-3.5 text-green-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-mono"
                placeholder="Enter URL..."
              />
            </div>
            <Button size="sm" type="submit" className="h-8">
              Go
            </Button>
          </form>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center gap-1 px-2 pb-2">
          {bookmarks.map(url => (
            <button
              key={url}
              onClick={() => navigate(url)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all ${
                currentUrl === url 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted/30 text-muted-foreground"
              }`}
            >
              <Star className="w-3 h-3" />
              {url.replace(".urbanshade.local", "").replace("urbanshade.local", "Home")}
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <ScrollArea className="flex-1 bg-background/30">
        {currentPage.content}
      </ScrollArea>

      {/* Status Bar */}
      <div className="h-6 px-3 border-t border-border/30 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
        <span>{currentPage.title}</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-green-400" />
          Secure Connection
        </span>
      </div>
    </div>
  );
};
