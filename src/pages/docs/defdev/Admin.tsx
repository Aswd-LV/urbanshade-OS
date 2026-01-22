import { Shield, Zap, Bug, RefreshCw, Terminal, Lock, Power, HardDrive, AlertTriangle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocCode } from "@/components/docs";

const DefDevAdmin = () => {
  const crashTypes = [
    { name: "KERNEL_PANIC", description: "Core system kernel failure" },
    { name: "CRITICAL_PROCESS_DIED", description: "Essential process terminated" },
    { name: "MEMORY_MANAGEMENT", description: "Memory allocation error" },
    { name: "SYSTEM_SERVICE_EXCEPTION", description: "System service exception" },
    { name: "VIDEO_TDR_FAILURE", description: "Display driver timeout" },
  ];

  const systemControls = [
    { name: "Force Reboot", icon: RefreshCw, description: "Queue a system reboot command", color: "blue" },
    { name: "Force Shutdown", icon: Power, description: "Queue a system shutdown command", color: "purple" },
    { name: "Lockdown Mode", icon: Lock, description: "Trigger facility lockdown screen", color: "red" },
    { name: "Recovery Mode", icon: HardDrive, description: "Boot into recovery environment", color: "cyan" },
  ];

  return (
    <DocLayout
      title="Admin Panel"
      description="Advanced administrative controls for testing crash screens, triggering system states, and managing the OS."
      keywords={["def-dev", "admin", "crash", "bugcheck", "system", "controls"]}
      accentColor="red"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "Terminal", path: "/docs/def-dev/terminal" }}
      nextPage={{ title: "Bugchecks", path: "/docs/def-dev/bugchecks" }}
    >
      <DocHero
        icon={Shield}
        title="Admin Panel"
        subtitle="Advanced administrative controls for testing crash screens, triggering system states, and managing the OS image."
        accentColor="red"
      />

      <DocSection title="Command Queue System" icon={Zap} accentColor="purple" id="queue">
        <DocAlert variant="info">
          The Admin panel uses a <strong>command queue system</strong> to execute commands on the main OS page. 
          When you click a button in DEF-DEV Admin, it queues a command that the main OS polls for and executes.
          <br /><br />
          <strong>Polling rate:</strong> 4× per second • <strong>Commands execute in real-time</strong>
        </DocAlert>
      </DocSection>

      <DocSection title="Crash Screen Triggers" icon={Zap} accentColor="red" id="crashes">
        <p className="text-slate-400 mb-4">
          Trigger various crash screen types to test error handling and user experience.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {crashTypes.map((crash) => (
            <div key={crash.name} className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-red-400" />
                <h5 className="font-semibold text-red-400 text-sm">{crash.name}</h5>
              </div>
              <p className="text-xs text-slate-400">{crash.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-slate-400">
            <strong className="text-blue-400">Note:</strong> Use the "Debug Error" button on crash screens to return to DEF-DEV.
          </p>
        </div>
      </DocSection>

      <DocSection title="Bugcheck Triggers" icon={Bug} accentColor="red" id="bugchecks">
        <p className="text-slate-400 mb-4">
          Bugchecks are detailed crash reports with specific stop codes, similar to Windows BSOD.
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {["FATAL_EXCEPTION", "SYSTEM_CORRUPTION", "HARDWARE_FAILURE", "DRIVER_FAULT"].map((code) => (
            <div key={code} className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="font-mono text-red-400 text-sm">{code}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          <Link to="/docs/def-dev/bugchecks" className="text-amber-400 hover:underline">
            View full bugcheck documentation →
          </Link>
        </p>
      </DocSection>

      <DocSection title="System Controls" icon={Power} accentColor="blue" id="controls">
        <div className="grid md:grid-cols-2 gap-4">
          {systemControls.map((ctrl) => (
            <DocCard key={ctrl.name} title={ctrl.name} icon={ctrl.icon} accentColor={ctrl.color as any}>
              <p className="mt-2 text-sm text-slate-400">{ctrl.description}</p>
            </DocCard>
          ))}
        </div>
      </DocSection>

      <DocSection title="Terminal Commands" icon={Terminal} accentColor="green" id="terminal">
        <DocCode
          title="Admin-Related Commands"
          code={`$ crash [type]    # Trigger crash screen
$ bugcheck [code] # Trigger bugcheck
$ reboot          # Queue system reboot
$ shutdown        # Queue system shutdown
$ lockdown        # Trigger lockdown mode
$ recovery        # Boot to recovery
$ wipe            # Wipe all localStorage`}
        />
      </DocSection>

      <DocSection title="Danger Zone" icon={AlertTriangle} accentColor="red" id="danger">
        <DocAlert variant="danger" title="WIPE SYSTEM">
          Completely clears all localStorage data, removing all settings, accounts, files, and bugcheck history. 
          The system will require a fresh installation after wiping.
        </DocAlert>
      </DocSection>

      <DocSection title="Important" icon={AlertCircle} accentColor="amber" id="important">
        <DocAlert variant="warning">
          Admin panel actions are queued and executed on the main OS page. Make sure you have the main OS page 
          open in another tab, or commands will execute the next time you visit the main page.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevAdmin;