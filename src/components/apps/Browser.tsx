import { useState } from "react";
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home, Lock } from "lucide-react";

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
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">URBANSHADE INTRANET</h1>
            <p className="text-muted-foreground">Secure Internal Network Portal</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("research.urbanshade.local"); }} className="glass-panel p-4 hover:bg-white/10 transition-colors">
              <h3 className="font-bold text-primary mb-2">Research Division</h3>
              <p className="text-sm text-muted-foreground">Access research data and specimen reports</p>
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); navigate("security.urbanshade.local"); }} className="glass-panel p-4 hover:bg-white/10 transition-colors">
              <h3 className="font-bold text-primary mb-2">Security Protocols</h3>
              <p className="text-sm text-muted-foreground">Security procedures and incident logs</p>
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); navigate("personnel.urbanshade.local"); }} className="glass-panel p-4 hover:bg-white/10 transition-colors">
              <h3 className="font-bold text-primary mb-2">Personnel Directory</h3>
              <p className="text-sm text-muted-foreground">Employee information and contacts</p>
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); navigate("operations.urbanshade.local"); }} className="glass-panel p-4 hover:bg-white/10 transition-colors">
              <h3 className="font-bold text-primary mb-2">Operations</h3>
              <p className="text-sm text-muted-foreground">Daily operations and maintenance schedules</p>
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); navigate("docs.urbanshade.local"); }} className="glass-panel p-4 hover:bg-white/10 transition-colors border-2 border-primary/30">
              <h3 className="font-bold text-primary mb-2">📚 Documentation</h3>
              <p className="text-sm text-muted-foreground">System guides and help resources</p>
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); navigate("uur.urbanshade.local"); }} className="glass-panel p-4 hover:bg-white/10 transition-colors border-2 border-cyan-500/30">
              <h3 className="font-bold text-cyan-400 mb-2">📦 UUR Repository</h3>
              <p className="text-sm text-muted-foreground">Community packages and extensions</p>
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); navigate("classified.urbanshade.local"); }} className="glass-panel p-4 hover:bg-white/10 transition-colors border-2 border-destructive/30">
              <h3 className="font-bold text-destructive mb-2">⚠ Classified Archives</h3>
              <p className="text-sm text-muted-foreground">Level 5+ clearance required</p>
            </a>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm">
            <div className="font-bold text-primary mb-2">⚠ SYSTEM NOTICE</div>
            <div className="text-muted-foreground">
              All network activity is monitored and logged. Unauthorized access attempts will result in immediate security response.
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs animate-pulse">
            <div className="font-bold text-yellow-500 mb-1">ANOMALY DETECTED</div>
            <div className="text-yellow-400/80">
              Unusual traffic patterns detected from Terminal T-07. Investigation in progress.
            </div>
          </div>
        </div>
      )
    },
    "research.urbanshade.local": {
      url: "research.urbanshade.local",
      title: "Research Division Portal",
      content: (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">RESEARCH DIVISION</h1>
          
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Active Specimen Research</h3>
                <span className="text-xs text-destructive">CLEARANCE LEVEL 4+</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>• Z-13 "Pressure" - Behavioral Analysis Phase 3</div>
                <div>• Z-96 "Pandemonium" - Containment Protocol Review</div>
                <div>• Z-283 "Angler" - Deep Sea Adaptation Study</div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-2">Recent Publications</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>→ Pressure Resistance in Extreme Environments (Dr. Chen)</div>
                <div>→ Adaptive Behavior Patterns of Deep Sea Specimens (Dr. Martinez)</div>
                <div>→ Containment Optimization Strategies (Research Team Alpha)</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
              <div className="font-bold text-yellow-500 mb-1">⚠ RESEARCH SAFETY NOTICE</div>
              <div className="text-yellow-400/80">
                All specimen interactions must follow Protocol 7-B. Report any unusual behavior immediately to Research Coordinator.
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm animate-pulse">
              <div className="font-bold text-destructive mb-1">🔴 URGENT: Z-13 BEHAVIORAL ALERT</div>
              <div className="text-destructive/80">
                Subject has demonstrated unprecedented pattern recognition. All research personnel advised to maintain minimum safe distance.
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
        <div className="p-8">
          <h1 className="text-2xl font-bold text-destructive mb-6">SECURITY PROTOCOLS</h1>
          
          <div className="space-y-4">
            <div className="glass-panel p-4 border-destructive/20">
              <h3 className="font-bold text-destructive mb-3">ACTIVE ALERTS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⚠</span>
                  <span>Zone 4 - Elevated pressure readings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⚠</span>
                  <span>Terminal T-07 - Failed login attempts</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">Security Clearance Levels</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• LEVEL 5 - Full facility access</div>
                <div>• LEVEL 4 - Research and specimen areas</div>
                <div>• LEVEL 3 - General facility areas</div>
                <div>• LEVEL 2 - Common areas only</div>
                <div>• LEVEL 1 - Public zones</div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">Emergency Procedures</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>1. Containment breach → Activate lockdown protocol</div>
                <div>2. Hull integrity warning → Evacuate to safe zones</div>
                <div>3. Power failure → Backup systems auto-engage</div>
                <div>4. Medical emergency → Contact medical bay immediately</div>
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
        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">PERSONNEL DIRECTORY</h1>
          
          <div className="space-y-3">
            {[
              { name: "Aswd", role: "Administrator", dept: "Administration", clearance: "5" },
              { name: "Dr. Chen", role: "Lead Researcher", dept: "Research", clearance: "4" },
              { name: "Tech Morgan", role: "Chief Engineer", dept: "Engineering", clearance: "3" },
              { name: "Officer Blake", role: "Security Chief", dept: "Security", clearance: "3" },
              { name: "Dr. Martinez", role: "Medical Officer", dept: "Medical", clearance: "4" },
            ].map((person, idx) => (
              <div key={idx} className="glass-panel p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold">{person.name}</div>
                  <div className="text-sm text-muted-foreground">{person.role} • {person.dept}</div>
                </div>
                <div className="text-xs font-mono text-primary">
                  LEVEL-{person.clearance}
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
        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">OPERATIONS CENTER</h1>
          
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">Facility Status</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Power Systems</div>
                  <div className="text-primary font-bold">OPERATIONAL</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Life Support</div>
                  <div className="text-primary font-bold">NOMINAL</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Hull Integrity</div>
                  <div className="text-primary font-bold">98.7%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Containment</div>
                  <div className="text-primary font-bold">SECURE</div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">Today's Schedule</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>08:00 - Morning system diagnostics</div>
                <div>10:00 - Specimen feeding cycle</div>
                <div>14:00 - Staff meeting (Research Division)</div>
                <div>16:00 - Zone 4 pressure maintenance</div>
                <div>20:00 - Evening security sweep</div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">Maintenance Log</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Hull Inspection:</span>
                  <span className="text-primary">2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Backup Generator Test:</span>
                  <span className="text-primary">Scheduled: Tomorrow</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Water Filtration:</span>
                  <span className="text-yellow-500">Filters due for replacement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Communications Array:</span>
                  <span className="text-primary">Optimal</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
              <div className="font-bold text-destructive mb-2">⚠ OPERATIONAL ALERT</div>
              <div className="text-destructive/80 text-xs space-y-1">
                <div>• Zone 4 pressure monitoring increased to hourly intervals</div>
                <div>• Terminal T-07 access restricted pending investigation</div>
                <div>• Emergency evacuation drills scheduled for next week</div>
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
        <div className="p-8">
          <h1 className="text-2xl font-bold text-destructive mb-6">⚠ CLASSIFIED ARCHIVES ⚠</h1>
          <div className="p-4 rounded-lg bg-destructive/10 border-2 border-destructive/30 mb-6">
            <div className="font-bold text-destructive mb-2">LEVEL 5 CLEARANCE VERIFIED</div>
            <div className="text-xs text-muted-foreground">User: aswd • Access Granted</div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-4 border-destructive/20">
              <h3 className="font-bold text-destructive mb-3">PROJECT BLACKBOX</h3>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><span className="text-primary">Objective:</span> [REDACTED] at depth exceeding [REDACTED] meters</div>
                <div><span className="text-primary">Status:</span> Phase 3 - Active monitoring</div>
                <div><span className="text-primary">Lead:</span> Director Morrison</div>
                <div className="text-destructive text-xs mt-3">⚠ Do not discuss outside Level 5 clearance</div>
              </div>
            </div>

            <div className="glass-panel p-4 border-yellow-500/20">
              <h3 className="font-bold text-yellow-500 mb-3">INCIDENT LOG - Z-13</h3>
              <div className="text-sm space-y-2">
                <div className="text-destructive">Date: [REDACTED]</div>
                <div className="text-muted-foreground">Subject breached primary containment for 3.7 seconds before recapture. Two casualties. Enhanced protocols implemented.</div>
                <div className="text-xs text-yellow-500 mt-2">Event designated: Code Amber</div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">PERSONNEL NOTES</h3>
              <div className="text-xs space-y-2 text-muted-foreground font-mono">
                <div>"It was never about the fish." - Director Morrison, 2023</div>
                <div>"The deeper you go, the less the rules apply." - Dr. Chen</div>
                <div>"We're not studying them. They're studying us." - [DELETED]</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black/50 border border-primary/20 animate-pulse">
              <div className="font-bold text-primary mb-2">UNKNOWN FILE DETECTED</div>
              <div className="text-xs text-muted-foreground">
                A file labeled "TRUTH.txt" was found in the archive. It should not exist.
                Attempting to access it causes system instability. Recommend immediate investigation.
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
        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">DOCUMENTATION CENTER</h1>
          
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h3 className="font-bold text-primary mb-3">Getting Started</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Welcome to Urbanshade OS</strong></p>
                <p>This operating system manages all aspects of deep-sea facility operations.</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Use the Start Menu (bottom-left) to access applications</li>
                  <li>Double-click desktop icons to open apps</li>
                  <li>Check Messages regularly for important communications</li>
                  <li>Monitor System Status for facility health</li>
                </ul>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold text-primary mb-3">Terminal Commands</h3>
              <div className="text-sm space-y-2 font-mono">
                <div><span className="text-primary">help</span> - Display all available commands</div>
                <div><span className="text-primary">status</span> - Show system status</div>
                <div><span className="text-primary">scan</span> - Run system diagnostics</div>
                <div><span className="text-primary">list</span> - List directory contents</div>
                <div><span className="text-primary">logs</span> - View system logs</div>
                <div><span className="text-primary">monitor</span> - Open system monitor</div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold text-primary mb-3">Emergency Procedures</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="p-3 rounded bg-destructive/10 border border-destructive/20">
                  <strong className="text-destructive">CODE-BLACK:</strong> Total facility lockdown. Seals all doors, reduces life support. Only use in extreme emergencies.
                </div>
                <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20">
                  <strong className="text-yellow-500">CODE-RED:</strong> Containment breach protocol. Deploy security teams, seal affected zones.
                </div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold text-primary mb-3">System Shortcuts</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Open Start Menu:</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Click Urbanshade logo</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Recovery Mode:</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Hold Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Admin Panel:</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Console: adminPanel()</kbd>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold text-primary mb-3">Facility Planner</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Design custom facility layouts:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Add rooms from the toolbar</li>
                  <li>Drag rooms to reposition</li>
                  <li>Resize using the handle in bottom-right</li>
                  <li>Connect rooms in Connect Mode</li>
                  <li>Save/Load designs for later</li>
                </ul>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold text-primary mb-3">Security Best Practices</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Never share your credentials</li>
                  <li>Report suspicious terminal activity</li>
                  <li>Monitor containment zones regularly</li>
                  <li>Keep clearance badge visible at all times</li>
                  <li>Report pressure anomalies immediately</li>
                </ul>
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
        <div className="p-8">
          <h1 className="text-2xl font-bold text-cyan-400 mb-6">📦 UUR - UrbanShade User Repository</h1>
          
          <div className="space-y-4">
            <div className="glass-panel p-4 border-cyan-500/20">
              <h3 className="font-bold text-cyan-400 mb-3">What is UUR?</h3>
              <p className="text-sm text-muted-foreground">
                The UrbanShade User Repository is a community-driven package manager for extensions, themes, and utilities.
              </p>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">Quick Commands</h3>
              <div className="text-sm space-y-2 font-mono">
                <div><span className="text-cyan-400">uur inst &lt;package&gt;</span> - Install a package</div>
                <div><span className="text-cyan-400">uur rm &lt;package&gt;</span> - Remove a package</div>
                <div><span className="text-cyan-400">uur search &lt;query&gt;</span> - Search packages</div>
                <div><span className="text-cyan-400">uur lst app</span> - List all packages</div>
              </div>
            </div>

            <div className="glass-panel p-4">
              <h3 className="font-bold mb-3">Featured Packages</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>• <strong>hello-world</strong> - Test your UUR installation</div>
                <div>• <strong>system-info</strong> - Display system information</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm">
              <div className="font-bold text-cyan-400 mb-2">💡 TIP</div>
              <div className="text-muted-foreground">
                Open the UUR Manager app from the Desktop to browse and install packages with a GUI.
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
    <div className="flex flex-col h-full">
      {/* Browser Controls */}
      <div className="p-3 border-b border-white/5 bg-black/20 space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(currentUrl)}
            className="p-2 rounded hover:bg-white/10 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("urbanshade.local")}
            className="p-2 rounded hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10">
            <Lock className="w-4 h-4 text-primary" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              placeholder="Enter URL..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary font-bold hover:bg-primary/30 transition-colors text-sm"
          >
            Go
          </button>
        </form>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto bg-black/10">
        {currentPage.content}
      </div>
    </div>
  );
};
