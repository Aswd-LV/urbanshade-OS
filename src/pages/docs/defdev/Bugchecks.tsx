import { Bug, AlertTriangle, ShieldAlert, Skull, AlertCircle, ChevronRight } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocAlert, DocTable, DocCode } from "@/components/docs";

const DefDevBugchecks = () => {
  const bugcheckTypes = [
    ["DESKTOP_MALFUNC", "0x00000001", "high", "Desktop layout or rendering failure"],
    ["RENDER_FAILURE", "0x00000002", "high", "Component failed to render correctly"],
    ["ICON_COLLISION", "0x00000003", "medium", "Multiple icons occupying same position"],
    ["WINDOW_OVERFLOW", "0x00000004", "medium", "Too many windows or window state error"],
    ["DATA_INCORRECT", "0x00000010", "critical", "Data validation failed, corrupt data"],
    ["STATE_CORRUPTION", "0x00000011", "critical", "Application state became inconsistent"],
    ["STORAGE_OVERFLOW", "0x00000012", "high", "LocalStorage quota exceeded"],
    ["PARSE_FAILURE", "0x00000013", "high", "Failed to parse stored data (JSON error)"],
    ["KERNEL_PANIC", "0x00000020", "critical", "Core system failure, unrecoverable"],
    ["MEMORY_EXHAUSTED", "0x00000021", "critical", "Browser memory limit reached"],
    ["INFINITE_LOOP", "0x00000022", "high", "Process stuck in infinite loop"],
    ["STACK_OVERFLOW", "0x00000023", "critical", "Call stack exceeded maximum size"],
    ["DEV_ERR", "0x000000FF", "info", "Developer-triggered test error"],
    ["UNHANDLED_EXCEPTION", "0x00000099", "high", "Uncaught exception propagated to top level"],
  ];

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-500/20 text-red-400",
      high: "bg-orange-500/20 text-orange-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      info: "bg-slate-500/20 text-slate-400",
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[severity]}`}>{severity}</span>;
  };

  return (
    <DocLayout
      title="Bugchecks"
      description="Understanding real system errors in UrbanShade OS and how to debug them."
      keywords={["def-dev", "bugcheck", "errors", "crash", "debugging", "stop codes"]}
      accentColor="red"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "Admin Panel", path: "/docs/def-dev/admin" }}
      nextPage={{ title: "API Reference", path: "/docs/def-dev/api" }}
    >
      <DocHero
        icon={Bug}
        title="Bugchecks"
        subtitle="Understanding real system errors and how to debug them. (No jokes unfortunately)"
        accentColor="red"
      />

      <DocSection title="What is a Bugcheck?" icon={ShieldAlert} accentColor="red" id="what">
        <DocAlert variant="danger" title="THESE ARE REAL ERRORS">
          A <strong>bugcheck</strong> in UrbanShade OS is a <strong className="text-red-400">real, unrecoverable error</strong> that 
          forces the system to halt immediately. Unlike themed crash screens, a bugcheck indicates something has 
          genuinely gone wrong in the application code.
        </DocAlert>

        <div className="mt-6 p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-slate-400 mb-3">When a bugcheck occurs, the system <strong className="text-slate-100">force crashes</strong> to prevent:</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-red-300">Save corruption</strong> - Your data could become unreadable</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-red-300">State desync</strong> - Application could enter inconsistent state</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-red-300">Cascading failures</strong> - One error leading to many more</span>
            </li>
          </ul>
        </div>

        <DocAlert variant="warning" title="Report Bugchecks">
          If you see a bugcheck screen, something is actually broken. Please report it with the error details so we can fix it.
        </DocAlert>
      </DocSection>

      <DocSection title="When Do Bugchecks Occur?" icon={AlertCircle} accentColor="red" id="when">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
              <Skull className="w-5 h-5" />
              Data Corruption Risks
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• JSON parse failures on critical data</li>
              <li>• LocalStorage write failures</li>
              <li>• State object becoming undefined</li>
              <li>• Conflicting writes to same storage key</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <h4 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              UX-Breaking Issues
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Desktop icons all in same position</li>
              <li>• Window manager losing track of windows</li>
              <li>• Infinite re-render loops detected</li>
              <li>• Critical component failing to mount</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Bugcheck Codes" icon={Bug} accentColor="amber" id="codes">
        <DocTable
          headers={["Stop Code", "Hex", "Severity", "Description"]}
          rows={bugcheckTypes.map(([code, hex, severity, desc]) => [
            <code key={code} className="text-slate-100">{code}</code>,
            <code key={`${code}-hex`} className="text-cyan-400">{hex}</code>,
            getSeverityBadge(severity),
            desc
          ])}
          accentColor="amber"
        />
      </DocSection>

      <DocSection title="Testing Bugchecks" icon={AlertTriangle} accentColor="amber" id="testing">
        <p className="text-slate-400 mb-4">Developers can manually trigger bugchecks for testing:</p>
        
        <DocCode
          title="Terminal Commands"
          code={`$ bugcheck DEV_TEST "Testing bugcheck system"
$ bugcheck KERNEL_PANIC "Simulated kernel failure"
$ sudo set bugcheck 0  # Disables bugchecks until refresh`}
        />
      </DocSection>

      <DocSection title="Viewing Reports" icon={Bug} accentColor="green" id="reports">
        <p className="text-slate-400 mb-4">All bugchecks are automatically saved and visible in DEF-DEV:</p>
        <ol className="space-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-amber-500/20 rounded text-center text-xs leading-5 text-amber-400">1</span>
            Navigate to <code className="px-1.5 py-0.5 bg-slate-800 rounded">/def-dev</code>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-amber-500/20 rounded text-center text-xs leading-5 text-amber-400">2</span>
            Click the "Bugchecks" tab
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-amber-500/20 rounded text-center text-xs leading-5 text-amber-400">3</span>
            View, export, or clear bugcheck reports
          </li>
        </ol>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevBugchecks;