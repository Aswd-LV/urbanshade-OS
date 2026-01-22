import { Activity, RefreshCw, Database, Trash2, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocCode } from "@/components/docs";

const DefDevActions = () => {
  const actionTypes = [
    { type: "SYSTEM", color: "purple", examples: ["Boot sequence", "Settings changes", "Shutdown events"] },
    { type: "APP", color: "blue", examples: ["App opened", "App closed", "App errors"] },
    { type: "FILE", color: "cyan", examples: ["File created", "File read", "File deleted"] },
    { type: "USER", color: "amber", examples: ["Button clicks", "Form inputs", "Navigation"] },
    { type: "SECURITY", color: "red", examples: ["Login attempts", "Permission changes", "Lockdown events"] },
    { type: "WINDOW", color: "green", examples: ["Window opened", "Window closed", "Focus changes"] },
  ];

  return (
    <DocLayout
      title="Actions Tab"
      description="Monitor all system events and user interactions in real-time with optional persistence."
      keywords={["def-dev", "actions", "events", "persistence", "monitoring"]}
      accentColor="purple"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "Console Tab", path: "/docs/def-dev/console" }}
      nextPage={{ title: "Storage Tab", path: "/docs/def-dev/storage" }}
    >
      <DocHero
        icon={Activity}
        title="Actions Tab"
        subtitle="Monitor all system events and user interactions in real-time with optional persistence to localStorage."
        accentColor="purple"
      />

      <DocSection title="Overview" icon={Info} accentColor="purple" id="overview">
        <DocAlert variant="info">
          The Actions tab connects to the UrbanShade OS action bus via the <strong>Action Dispatcher</strong>. 
          It captures system events, user interactions, and application lifecycle events in real-time.
          When <strong>persistence</strong> is enabled, actions are saved to localStorage for cross-session analysis.
        </DocAlert>
      </DocSection>

      <DocSection title="Action Types" icon={Activity} accentColor="purple" id="types">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionTypes.map(({ type, color, examples }) => (
            <div key={type} className={`p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/30`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                <h5 className={`font-bold text-${color}-400`}>{type}</h5>
              </div>
              <ul className="space-y-1">
                {examples.map((ex) => (
                  <li key={ex} className="text-xs text-slate-400">• {ex}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Persistence" icon={Database} accentColor="cyan" id="persistence">
        <DocCode
          title="LocalStorage Key"
          code={`Key: def-dev-actions
Flag: def-dev-persistence (enabled/disabled)`}
        />

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Benefits
            </h5>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Analyze events across sessions</li>
              <li>• Track boot sequences</li>
              <li>• Debug intermittent issues</li>
              <li>• Review historical activity</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <h5 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Considerations
            </h5>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Uses localStorage space</li>
              <li>• Keeps last 500 actions</li>
              <li>• May slow with many events</li>
              <li>• Cleared with "Clear Actions"</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="How Persistence Works" icon={Database} accentColor="blue" id="how-it-works">
        <div className="space-y-4">
          {[
            { step: "1", title: "On OS Boot", desc: "System checks if def-dev-persistence is enabled in localStorage." },
            { step: "2", title: "If Enabled", desc: "Action Dispatcher loads existing actions and continues appending new ones." },
            { step: "3", title: "If Disabled", desc: "System ignores any existing action data and operates fresh." },
            { step: "4", title: "Toggle in DEF-DEV", desc: "Use 'Toggle Persistence' button in Admin or Actions tab any time." }
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg text-center text-sm leading-8 text-blue-400 flex-shrink-0 font-bold">{item.step}</span>
              <div>
                <h5 className="font-semibold text-slate-100">{item.title}</h5>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Available Actions" icon={RefreshCw} accentColor="amber" id="actions">
        <div className="grid md:grid-cols-2 gap-4">
          <DocCard title="Refresh from localStorage" icon={RefreshCw} accentColor="cyan">
            <p className="mt-2 text-xs text-slate-400">
              Reload actions from localStorage to see the latest persisted events.
            </p>
          </DocCard>
          <DocCard title="Clear Actions" icon={Trash2} accentColor="red">
            <p className="mt-2 text-xs text-slate-400">
              Clear all actions from memory and localStorage.
            </p>
          </DocCard>
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevActions;