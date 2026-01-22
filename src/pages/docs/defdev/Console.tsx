import { Terminal, Eye, Search, Pause, Copy, Download, Trash2, Filter, CheckCircle, Info } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocTable } from "@/components/docs";

const DefDevConsole = () => {
  const errorSimplifications = [
    ["Cannot read properties of undefined", "Something tried to use data that doesn't exist yet"],
    ["Maximum call stack size exceeded", "The system got stuck in a loop"],
    ["Failed to fetch", "Couldn't connect to the server"],
    ["Unexpected token", "The code has a syntax error"],
    ["null is not an object", "Tried to use something that wasn't set up properly"],
    ["Permission denied", "You don't have access to do that"],
  ];

  return (
    <DocLayout
      title="Console Tab"
      description="Real-time console logging with smart error simplification, filtering, and export capabilities."
      keywords={["def-dev", "console", "logs", "errors", "debugging"]}
      accentColor="cyan"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "Setup", path: "/docs/def-dev/setup" }}
      nextPage={{ title: "Actions Tab", path: "/docs/def-dev/actions" }}
    >
      <DocHero
        icon={Terminal}
        title="Console Tab"
        subtitle="Real-time console logging with smart error simplification, filtering, and export capabilities."
        accentColor="cyan"
      />

      <DocSection title="Overview" icon={Info} accentColor="cyan" id="overview">
        <DocAlert variant="info">
          The Console tab captures and displays all console output from UrbanShade OS, including logs, warnings, 
          errors, and system messages. It intercepts the browser's console methods to provide a unified view.
        </DocAlert>
      </DocSection>

      <DocSection title="Features" icon={Eye} accentColor="cyan" id="features">
        <div className="grid md:grid-cols-2 gap-4">
          <DocCard title="Simple/Technical Views" icon={Eye} accentColor="cyan">
            <p className="mt-2 text-sm text-slate-400">
              Toggle between simplified human-readable error messages and raw technical output.
            </p>
          </DocCard>

          <DocCard title="Search & Filter" icon={Search} accentColor="cyan">
            <p className="mt-2 text-sm text-slate-400">
              Search through logs by keyword and filter by log type (error, warn, info, debug).
            </p>
          </DocCard>

          <DocCard title="Pause/Resume" icon={Pause} accentColor="cyan">
            <p className="mt-2 text-sm text-slate-400">
              Pause logging to examine entries without auto-scrolling. Essential for rapid log sequences.
            </p>
          </DocCard>

          <DocCard title="Log Type Colors" icon={Filter} accentColor="cyan">
            <p className="mt-2 text-sm text-slate-400">
              Color-coded: red for errors, yellow for warnings, blue for info, gray for debug.
            </p>
          </DocCard>
        </div>
      </DocSection>

      <DocSection title="Available Actions" icon={Copy} accentColor="amber" id="actions">
        <div className="grid md:grid-cols-3 gap-4">
          <DocCard title="Copy Logs" icon={Copy} accentColor="cyan">
            <p className="mt-2 text-xs text-slate-400">
              Copy all visible logs to clipboard in plain text format.
            </p>
          </DocCard>

          <DocCard title="Export" icon={Download} accentColor="cyan">
            <p className="mt-2 text-xs text-slate-400">
              Download logs as a .txt file with timestamps.
            </p>
          </DocCard>

          <DocCard title="Clear" icon={Trash2} accentColor="red">
            <p className="mt-2 text-xs text-slate-400">
              Clear all captured logs from the current session.
            </p>
          </DocCard>
        </div>
      </DocSection>

      <DocSection title="Smart Error Simplification" icon={CheckCircle} accentColor="green" id="simplification">
        <p className="text-slate-400 mb-4">
          Technical errors are automatically translated into plain language. Click any error to see full details.
        </p>

        <DocTable
          headers={["Technical Error", "Simplified Message"]}
          rows={errorSimplifications.map(([tech, simple]) => [
            <code key={tech} className="text-red-400 text-xs">{tech}</code>,
            <span key={simple} className="text-green-400">{simple}</span>
          ])}
          accentColor="green"
        />
      </DocSection>

      <DocSection title="Tips & Best Practices" icon={CheckCircle} accentColor="green" id="tips">
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { title: "Use Pause for Analysis", desc: "Pause the console to prevent auto-scrolling during rapid logs." },
            { title: "Filter by Type", desc: "Focus on errors only when troubleshooting to reduce noise." },
            { title: "Export Before Clearing", desc: "Always export logs if you need to preserve them for later." },
            { title: "Technical View for Debugging", desc: "Switch to technical view when you need stack traces." }
          ].map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-slate-100">{tip.title}</h5>
                <p className="text-xs text-slate-400">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevConsole;