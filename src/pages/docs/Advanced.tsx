import { Cpu, RotateCcw, Shield, Wrench, Lock, Skull, Bug, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocCode } from "@/components/docs";

const Advanced = () => {
  return (
    <DocLayout
      title="Advanced Features"
      description="BIOS settings, Recovery Mode, DEF-DEV console, and advanced system features in Urbanshade OS."
      keywords={["bios", "recovery mode", "def-dev", "advanced", "system", "developer"]}
      accentColor="cyan"
      prevPage={{ title: "Admin Panel", path: "/docs/admin-panel" }}
      nextPage={{ title: "Shortcuts", path: "/docs/shortcuts" }}
    >
      <DocHero
        icon={Wrench}
        title="Power User Territory"
        subtitle="Welcome to the advanced section. Here be dragons. And by dragons, we mean system-level features that can really mess things up. In a fun way!"
        accentColor="cyan"
      />

      <DocSection title="BIOS Access" icon={Cpu} accentColor="cyan" id="bios">
        <div className="flex items-center gap-3 mb-4">
          <kbd className="px-4 py-2 bg-slate-900 rounded-lg border border-cyan-500/30 font-mono text-cyan-400 text-lg">DEL</kbd>
          <span className="text-slate-400">Press during boot sequence</span>
        </div>
        
        <p className="text-slate-400 mb-4">
          The BIOS (Basic Input/Output System) lets you configure low-level system settings. 
          It looks like those blue screens from the 90s because nostalgia is real.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <DocCard title="BIOS Features" accentColor="cyan">
            <ul className="mt-2 text-sm text-slate-400 space-y-1">
              <li>• View system information (fake hardware specs!)</li>
              <li>• Configure boot order (feels important)</li>
              <li>• Set a BIOS password</li>
              <li>• Toggle various hardware options</li>
            </ul>
          </DocCard>
          <DocCard title="Tip" accentColor="amber">
            <p className="mt-2 text-sm text-amber-400">
              You need to press DEL at the right moment during boot. Watch for the prompt!
            </p>
          </DocCard>
        </div>
      </DocSection>

      <DocSection title="Recovery Mode" icon={RotateCcw} accentColor="cyan" id="recovery">
        <div className="flex items-center gap-3 mb-4">
          <kbd className="px-4 py-2 bg-slate-900 rounded-lg border border-cyan-500/30 font-mono text-cyan-400 text-lg">F2</kbd>
          <span className="text-slate-400">Press during boot sequence</span>
        </div>

        <p className="text-slate-400 mb-4">
          Recovery Mode is your safety net. Forgot your password? System acting weird? 
          This is where you go to fix things (or make them worse).
        </p>

        <div className="grid gap-3 lg:grid-cols-2">
          {[
            { title: "Reset Password", desc: "For when 'password123' didn't work" },
            { title: "System Repair", desc: "Fix corrupted settings" },
            { title: "Factory Reset", desc: "Nuclear option. Deletes everything." },
            { title: "Boot Logs", desc: "See what went wrong" }
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-lg bg-slate-800/50 border border-cyan-500/20">
              <h4 className="font-bold text-white">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Admin Panel" icon={Shield} accentColor="cyan" id="admin">
        <p className="text-slate-400 mb-4">
          The Admin Panel gives you godlike control over the system. 
          With great power comes great potential for rainbow-colored, glitch-filled chaos.
        </p>

        <DocAlert variant="info" title="How to Access">
          <ul className="space-y-1 text-sm">
            <li>• Type <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-400">secret</code> in the Terminal</li>
            <li>• Or use browser console: <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-400">adminPanel()</code></li>
          </ul>
        </DocAlert>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <DocCard title="Visual Effects" accentColor="cyan">
            <p className="mt-2 text-sm text-slate-400">
              Rainbow mode, glitch mode, matrix mode, screen rotation, blur effects...
            </p>
          </DocCard>
          <DocCard title="System Control" accentColor="cyan">
            <p className="mt-2 text-sm text-slate-400">
              Trigger crashes, modify behavior, disable security, cause creative chaos.
            </p>
          </DocCard>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Full guide: <Link to="/docs/admin-panel" className="text-cyan-400 hover:underline">Admin Panel Documentation</Link>
        </p>
      </DocSection>

      <DocSection title="DEF-DEV Console" icon={Bug} accentColor="amber" id="def-dev">
        <p className="text-slate-400 mb-4">
          DEF-DEV (Developer Environment Framework) is the ultimate debugging tool. 
          Real-time system monitoring, storage inspection, and remote command execution.
        </p>

        <DocCode
          title="How to Access"
          code={`1. Enable Developer Mode in Settings → Developer Options
2. Navigate to /def-dev
3. Or open from crash screen's "Debug Error" button`}
        />

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {[
            { name: "Console Tab", desc: "Real-time log capture" },
            { name: "Actions Tab", desc: "Monitor system events" },
            { name: "Storage Tab", desc: "Inspect localStorage" },
            { name: "Terminal", desc: "Remote OS commands" },
            { name: "Recovery", desc: "System snapshots" },
            { name: "Bugchecks", desc: "Crash history" }
          ].map((item) => (
            <div key={item.name} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-medium text-amber-400">{item.name}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Full guide: <Link to="/docs/def-dev" className="text-amber-400 hover:underline">DEF-DEV Documentation</Link>
        </p>
      </DocSection>

      <DocSection title="SystemBus API" icon={Zap} accentColor="blue" id="systembus">
        <p className="text-slate-400 mb-4">
          The SystemBus is an internal event system for component-to-component communication 
          and system-wide events.
        </p>

        <DocCode
          title="Available Events"
          code={`TRIGGER_CRASH    - Trigger a crash screen
TRIGGER_REBOOT   - Initiate system reboot
TRIGGER_SHUTDOWN - Initiate shutdown
ENTER_RECOVERY   - Enter recovery mode
OPEN_DEV_MODE    - Open DEF-DEV console

// Access via: window.systemBus`}
        />
      </DocSection>

      <DocSection title="System States" icon={Lock} accentColor="amber" id="states">
        <div className="grid gap-4 md:grid-cols-2">
          <DocCard title="⚙️ Maintenance Mode" accentColor="amber">
            <p className="mt-2 text-sm text-slate-400">
              System maintenance state. Limited access while "updates" are happening.
            </p>
          </DocCard>
          <DocCard title="🔐 Lockdown Mode" accentColor="red">
            <p className="mt-2 text-sm text-slate-400">
              Emergency lockdown! System access restricted. Something went very wrong.
            </p>
          </DocCard>
          <DocCard title="🔄 Update Mode" accentColor="blue">
            <p className="mt-2 text-sm text-slate-400">
              System updates in progress. Watch fake file names scroll by.
            </p>
          </DocCard>
          <DocCard title="💥 Crash Screen" accentColor="red">
            <p className="mt-2 text-sm text-slate-400">
              The dramatic crash screen. Don't worry, just refresh the page!
            </p>
          </DocCard>
        </div>
      </DocSection>

      <DocSection title="Danger Zone" icon={Skull} accentColor="red" id="danger">
        <DocAlert variant="danger" title="Caution!">
          These actions can significantly affect your simulated facility. 
          Use with reckless abandon — it's all just localStorage anyway.
        </DocAlert>

        <div className="mt-4 space-y-2">
          {[
            { name: "Factory Reset", desc: "Wipes all data and starts fresh" },
            { name: "Disable All Security", desc: "What could go wrong?" },
            { name: "Trigger Containment Breach", desc: "For 'testing' purposes only" }
          ].map((item) => (
            <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-red-400 font-bold">•</span>
              <div>
                <span className="font-medium text-white">{item.name}</span>
                <span className="text-slate-400 text-sm"> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500 italic">
          * No actual files will be harmed. This is all localStorage. Relax.
        </p>
      </DocSection>
    </DocLayout>
  );
};

export default Advanced;