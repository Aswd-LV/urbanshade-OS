import { 
  Terminal, Bug, Shield, Activity, Database, Send, Cpu, Globe, Zap, 
  Layers, Power, Skull, MemoryStick, Package, Cloud, Gavel, ChevronRight,
  Wrench, Code
} from "lucide-react";
import { Link } from "react-router-dom";
import { DocLayout, DocSection, DocHero, DocAlert, DocTable } from "@/components/docs";

const DefDevIndex = () => {
  const coreFeatures = [
    { icon: Terminal, title: "Console", desc: "Real-time log viewer with filtering", link: "/docs/def-dev/console", color: "text-cyan-400" },
    { icon: Activity, title: "Actions", desc: "Trigger system events and commands", link: "/docs/def-dev/actions", color: "text-purple-400" },
    { icon: Send, title: "Terminal", desc: "Interactive command-line interface", link: "/docs/def-dev/terminal", color: "text-green-400" },
    { icon: Database, title: "Storage", desc: "LocalStorage browser and editor", link: "/docs/def-dev/storage", color: "text-blue-400" },
  ];

  const diagnosticFeatures = [
    { icon: Shield, title: "Bugchecks", desc: "View and analyze BSOD-style crashes", link: "/docs/def-dev/bugchecks", color: "text-red-400" },
    { icon: Cpu, title: "Performance", desc: "FPS, memory, and render monitoring", color: "text-teal-400" },
    { icon: Globe, title: "Network", desc: "HTTP request inspection and mocking", color: "text-sky-400" },
    { icon: Zap, title: "Events", desc: "System bus event monitoring", color: "text-yellow-400" },
  ];

  const advancedFeatures = [
    { icon: Layers, title: "Components", desc: "React component tree inspector", color: "text-indigo-400" },
    { icon: Power, title: "Boot Analyzer", desc: "Startup timing breakdown", color: "text-violet-400" },
    { icon: Skull, title: "Crash Analyzer", desc: "Crash dump inspector", color: "text-rose-400" },
    { icon: MemoryStick, title: "Memory Profiler", desc: "Memory usage tracking", color: "text-emerald-400" },
    { icon: Package, title: "Mod Manager", desc: "Plugin and mod system", color: "text-pink-400" },
    { icon: Cloud, title: "Supabase", desc: "Database connection debugger", color: "text-emerald-400" },
    { icon: Gavel, title: "FakeMod", desc: "Test moderation actions locally", link: "/docs/def-dev/fakemod", color: "text-rose-400" },
    { icon: Skull, title: "Admin Tools", desc: "Administrative testing utilities", link: "/docs/def-dev/admin", color: "text-amber-400" },
  ];

  return (
    <DocLayout
      title="DEF-DEV Console 3.0"
      description="Advanced developer tools for UrbanShade OS"
    >
      <DocHero
        icon={Bug}
        title="DEF-DEV Console 3.0"
        subtitle="The complete developer toolkit for debugging, testing, and analyzing UrbanShade OS"
        accentColor="amber"
      />

      <DocAlert variant="info" title="New in 3.0">
        DEF-DEV 3.0 features a completely redesigned interface with grouped navigation tabs, 
        integrated FakeMod for testing moderation actions in the main view, expanded terminal commands, 
        and enhanced admin tools. Access via Settings → Developer Options or press <code>Ctrl+Shift+D</code>.
      </DocAlert>

      {/* Quick Start */}
      <DocSection title="Quick Start" icon={Wrench} accentColor="amber">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            DEF-DEV is UrbanShade's built-in developer console. It provides powerful debugging tools
            without affecting the production experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-2xl font-bold text-primary mb-1">1</div>
              <h4 className="font-semibold mb-1">Enable Dev Mode</h4>
              <p className="text-xs text-muted-foreground">Settings → Developer Options → Enable Developer Mode</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-2xl font-bold text-primary mb-1">2</div>
              <h4 className="font-semibold mb-1">Open Console</h4>
              <p className="text-xs text-muted-foreground">Press <code className="text-primary">Ctrl+Shift+D</code> or click "Launch" in Settings</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-2xl font-bold text-primary mb-1">3</div>
              <h4 className="font-semibold mb-1">Start Debugging</h4>
              <p className="text-xs text-muted-foreground">Use grouped tabs on the right to access different tools</p>
            </div>
          </div>
        </div>
      </DocSection>

      {/* Interface Overview */}
      <DocSection title="Interface Overview" icon={Terminal} accentColor="cyan">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-amber-400 font-bold">DEF-DEV 3.0</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">UrbanShade Developer Console</span>
          </div>
          <div className="flex h-36">
            <div className="flex-1 p-2 text-slate-400">
              <div className="text-cyan-400 mb-1">// Main Content Area</div>
              <div className="text-slate-600">Console output, tools,</div>
              <div className="text-slate-600">and diagnostic data</div>
              <div className="text-slate-600">displayed here</div>
            </div>
            <div className="w-36 border-l border-slate-800 p-2">
              <div className="text-amber-400 mb-1.5">Navigation</div>
              <div className="text-[9px] text-slate-600 uppercase mb-0.5">Core</div>
              <div className="space-y-0.5 text-[10px] mb-2">
                <div className="text-cyan-400">→ Console</div>
                <div className="text-slate-500">  Terminal</div>
                <div className="text-slate-500">  Actions</div>
              </div>
              <div className="text-[9px] text-slate-600 uppercase mb-0.5">Diagnostics</div>
              <div className="space-y-0.5 text-[10px]">
                <div className="text-slate-500">  Bugchecks</div>
                <div className="text-slate-500">  ...</div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          DEF-DEV 3.0 features grouped navigation tabs (Core, Diagnostics, System, Tools) for easier access to features.
        </p>
      </DocSection>

      {/* Core Features */}
      <DocSection title="Core Features" icon={Bug} accentColor="cyan">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {coreFeatures.map((feature) => (
            <Link key={feature.title} to={feature.link || "#"} className="block">
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/50 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-background/50 ${feature.color}`}>
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">{feature.title}</h4>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </DocSection>

      {/* Diagnostic Tools */}
      <DocSection title="Diagnostic Tools" icon={Activity} accentColor="purple">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {diagnosticFeatures.map((feature) => (
            <div key={feature.title} className="p-4 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-background/50 ${feature.color}`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold">{feature.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      {/* Advanced Tools */}
      <DocSection title="Advanced Tools" icon={Code} accentColor="amber">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {advancedFeatures.map((feature) => (
            <div key={feature.title} className="p-3 rounded-lg bg-muted/10 border border-border/30">
              <div className="flex items-center gap-2 mb-1">
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <h4 className="text-sm font-semibold">{feature.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      {/* Terminal Commands */}
      <DocSection title="Terminal Commands" icon={Send} accentColor="green">
        <DocTable
          headers={["Command", "Description"]}
          rows={[
            ["help", "Show all available commands"],
            ["clear", "Clear the terminal output"],
            ["sysinfo", "Display system information"],
            ["bugcheck <code>", "Trigger a test BSOD with code"],
            ["crash [type]", "Force a crash screen"],
            ["reboot", "Restart the system"],
            ["shutdown", "Power off the system"],
            ["ls [filter]", "List localStorage keys"],
            ["get <key>", "Get a storage value"],
            ["set <key> <value>", "Set a storage value"],
            ["del <key>", "Delete a storage key"],
            ["toast <type> <msg>", "Show a toast notification"],
            ["status", "Show system status"],
            ["queue", "Show pending commands"],
            ["lockdown [protocol]", "Trigger lockdown mode"],
            ["recovery", "Boot into recovery mode"],
          ]}
          accentColor="green"
        />
        <Link to="/docs/def-dev/terminal" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3">
          View all terminal commands <ChevronRight className="w-4 h-4" />
        </Link>
      </DocSection>

      {/* FakeMod */}
      <DocSection title="FakeMod Testing" icon={Gavel} accentColor="red">
        <DocAlert variant="warning" title="Test Environment Only">
          FakeMod actions are purely cosmetic and don't affect real user data or permissions.
        </DocAlert>
        <div className="mt-4 space-y-3">
          <p className="text-muted-foreground">
            FakeMod allows you to test moderation UI without affecting real users. The FakeMod tab 
            displays ban/warn/mute popups directly in the DEF-DEV window for realistic testing.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { action: "Ban", desc: "Full ban popup" },
              { action: "Warning", desc: "Warning notification" },
              { action: "Mute", desc: "Mute indicator" },
              { action: "Kick", desc: "Session kick" },
            ].map((item) => (
              <div key={item.action} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                <div className="font-semibold text-rose-400">{item.action}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </DocSection>

      {/* Keyboard Shortcuts */}
      <DocSection title="Keyboard Shortcuts" icon={Terminal} accentColor="cyan">
        <DocTable
          headers={["Shortcut", "Action"]}
          rows={[
            ["Ctrl+Shift+D", "Open DEF-DEV Console"],
            ["Ctrl+L", "Clear console (when focused)"],
            ["Tab", "Cycle through tabs"],
            ["Escape", "Close DEF-DEV"],
            ["↑ / ↓", "Navigate terminal history"],
          ]}
          accentColor="cyan"
        />
      </DocSection>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border/50">
        <Link 
          to="/docs/def-dev/console"
          className="flex-1 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold group-hover:text-cyan-400 transition-colors">Console Guide</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
          <p className="text-xs text-muted-foreground">Learn about the real-time log viewer</p>
        </Link>
        <Link 
          to="/docs/def-dev/terminal"
          className="flex-1 p-4 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-4 h-4 text-green-400" />
            <span className="font-semibold group-hover:text-green-400 transition-colors">Terminal Commands</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
          <p className="text-xs text-muted-foreground">Full command reference</p>
        </Link>
      </div>
    </DocLayout>
  );
};

export default DefDevIndex;
