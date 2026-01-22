import { Activity, HardDrive, MemoryStick, Gauge, Cpu, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocCode, DocAlert } from "@/components/docs";

const DefDevDiagnostics = () => {
  const metrics = [
    { icon: HardDrive, title: "Storage Usage", items: ["Total localStorage entries", "Storage size in bytes/KB/MB", "Largest entries by size", "Quota usage percentage"], accent: "blue" },
    { icon: MemoryStick, title: "Memory Stats", items: ["JS heap size used", "Total JS heap size", "Heap limit", "Memory pressure indicator"], accent: "purple" },
    { icon: Gauge, title: "Performance", items: ["Page load time", "Time to interactive", "DOM content loaded", "Resource timing"], accent: "green" },
    { icon: Cpu, title: "System State", items: ["Active windows count", "Registered event listeners", "Console log count", "Error count"], accent: "cyan" },
  ];

  const terminalCommands = `$ diag           # Run full diagnostics
$ diag storage   # Storage diagnostics only
$ diag memory    # Memory diagnostics only
$ diag health    # Run health checks
$ diag export    # Export diagnostic report`;

  return (
    <DocLayout
      title="Diagnostics Tool"
      description="Real-time system health monitoring, performance metrics, and diagnostic utilities for UrbanShade OS."
      keywords={["diagnostics", "health", "performance", "memory", "storage", "def-dev"]}
      accentColor="green"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "API Reference", path: "/docs/def-dev/api" }}
      nextPage={{ title: "DEF-DEV Overview", path: "/docs/def-dev" }}
    >
      <DocHero
        icon={Activity}
        title="Diagnostics Tool"
        subtitle="Real-time system health monitoring, performance metrics, and diagnostic utilities."
        accentColor="green"
        badge="Real-Time"
      />

      <DocAlert variant="info" title="What is the Diagnostics Tool?">
        The Diagnostics Tool is a real-time system health monitor built into DEF-DEV. It provides insights into 
        localStorage usage, browser performance, memory consumption, and system state. Use it to identify issues, 
        monitor resource usage, and ensure optimal system operation.
      </DocAlert>

      <DocSection title="Available Metrics" icon={Gauge} accentColor="green">
        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map((metric, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-${metric.accent}-500/20 rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 text-${metric.accent}-400`} />
                </div>
                <h4 className="font-bold text-foreground">{metric.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                {metric.items.map((item, j) => (
                  <li key={j}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Health Checks" icon={CheckCircle} accentColor="green">
        <div className="space-y-3">
          {[
            { status: "pass", title: "Storage Integrity", desc: "Validates all JSON entries in localStorage can be parsed" },
            { status: "pass", title: "Admin Account Valid", desc: "Checks admin account exists and has required fields" },
            { status: "pass", title: "Settings Schema", desc: "Validates system settings match expected schema" },
            { status: "warn", title: "Storage Quota", desc: "Warns if localStorage usage exceeds 80% of quota" },
            { status: "warn", title: "Memory Pressure", desc: "Alerts if JS heap usage is critically high" }
          ].map((check, i) => (
            <div key={i} className={`p-4 rounded-xl bg-slate-800/50 border ${check.status === 'pass' ? 'border-green-500/30' : 'border-amber-500/30'} flex items-center gap-4`}>
              {check.status === 'pass' ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              )}
              <div>
                <h4 className={`font-bold ${check.status === 'pass' ? 'text-green-400' : 'text-amber-400'}`}>{check.title}</h4>
                <p className="text-sm text-slate-400">{check.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Terminal Commands" icon={Zap} accentColor="green">
        <DocCode title="Diagnostic Commands" code={terminalCommands} />
      </DocSection>

      <DocSection title="Accessing Diagnostics" icon={Activity} accentColor="green">
        <div className="space-y-3">
          {[
            "Navigate to /def-dev",
            "Click the 'Diagnostics' tab in the navigation",
            "View real-time metrics and run health checks",
            "Use 'Export Report' to save a diagnostic snapshot"
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm flex-shrink-0">{i + 1}</span>
              <span className="text-slate-400">{step}</span>
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevDiagnostics;
