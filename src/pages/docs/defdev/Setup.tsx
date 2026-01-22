import { Settings, Terminal, Shield, Wrench, CheckCircle, ChevronRight } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocCode } from "@/components/docs";

const DefDevSetup = () => {
  return (
    <DocLayout
      title="DEF-DEV Setup"
      description="Complete guide to enabling Developer Mode and accessing the DEF-DEV console in UrbanShade OS."
      keywords={["def-dev", "setup", "developer mode", "enable", "access"]}
      accentColor="amber"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "DEF-DEV Overview", path: "/docs/def-dev" }}
      nextPage={{ title: "Console Tab", path: "/docs/def-dev/console" }}
    >
      <DocHero
        icon={Settings}
        title="Setting Up DEF-DEV"
        subtitle="Complete guide to enabling Developer Mode and accessing the DEF-DEV console."
        accentColor="amber"
      />

      <DocSection title="Prerequisites" icon={CheckCircle} accentColor="green" id="prerequisites">
        <div className="space-y-3">
          {[
            { title: "For development and debugging only", desc: "Provides low-level access to system internals." },
            { title: "Action logging may use localStorage", desc: "Persistent logging stores data in your browser." },
            { title: "Some features can disrupt operation", desc: "Admin commands like crashes affect the entire system." }
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100">{item.title}</strong>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Enabling Developer Mode" icon={Wrench} accentColor="amber" id="enable">
        <p className="text-slate-400 mb-6">Four methods to enable Developer Mode:</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <DocCard title="Method 1: During Installation" icon={Settings} accentColor="green">
            <ol className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-500/20 rounded text-center text-xs leading-5 text-green-400 flex-shrink-0">1</span>
                Start or reset UrbanShade OS installation
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-500/20 rounded text-center text-xs leading-5 text-green-400 flex-shrink-0">2</span>
                Navigate to the Configuration step
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-green-500/20 rounded text-center text-xs leading-5 text-green-400 flex-shrink-0">3</span>
                Check "Enable Developer Mode"
              </li>
            </ol>
          </DocCard>

          <DocCard title="Method 2: Via Settings App" icon={Wrench} accentColor="blue">
            <ol className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-500/20 rounded text-center text-xs leading-5 text-blue-400 flex-shrink-0">1</span>
                Open the Settings application
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-500/20 rounded text-center text-xs leading-5 text-blue-400 flex-shrink-0">2</span>
                Navigate to "Developer Options"
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-500/20 rounded text-center text-xs leading-5 text-blue-400 flex-shrink-0">3</span>
                Toggle "Enable Developer Mode" ON
              </li>
            </ol>
          </DocCard>

          <DocCard title="Method 3: Browser Console" icon={Terminal} accentColor="purple">
            <ol className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-purple-500/20 rounded text-center text-xs leading-5 text-purple-400 flex-shrink-0">1</span>
                Open browser DevTools (F12)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-purple-500/20 rounded text-center text-xs leading-5 text-purple-400 flex-shrink-0">2</span>
                Switch to the Console tab
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-purple-500/20 rounded text-center text-xs leading-5 text-purple-400 flex-shrink-0">3</span>
                Type <code className="px-1.5 py-0.5 bg-slate-800 rounded text-purple-400">devMode()</code>
              </li>
            </ol>
          </DocCard>

          <DocCard title="Method 4: Recovery Mode" icon={Shield} accentColor="red">
            <ol className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-orange-500/20 rounded text-center text-xs leading-5 text-orange-400 flex-shrink-0">1</span>
                Reboot or refresh the page
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-orange-500/20 rounded text-center text-xs leading-5 text-orange-400 flex-shrink-0">2</span>
                Press F2 during boot screen
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-orange-500/20 rounded text-center text-xs leading-5 text-orange-400 flex-shrink-0">3</span>
                Select "Developer Mode" option
              </li>
            </ol>
          </DocCard>
        </div>
      </DocSection>

      <DocSection title="Accessing DEF-DEV" icon={Terminal} accentColor="amber" id="access">
        <DocCode
          title="Navigate to DEF-DEV"
          code={`Once Developer Mode is enabled, navigate to:
/def-dev

Or in browser console: window.location.href = '/def-dev'`}
        />

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-slate-100">First-Time Setup</h4>
          <p className="text-sm text-slate-400">
            On your first visit, you'll see a consent screen explaining what DEF-DEV does:
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              "Create a dedicated localStorage key for action logging",
              "Monitor system events and user interactions",
              "Provide admin-level controls over the system"
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </DocSection>

      <DocSection title="Troubleshooting" icon={Shield} accentColor="red" id="troubleshooting">
        <DocAlert variant="danger" title="Access Denied Error">
          If you see <code className="px-1.5 py-0.5 bg-slate-800 rounded text-red-400">!COULDN'T BIND TO PAGE!</code>:
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Developer Mode is not enabled</li>
            <li>• Settings haven't been saved properly</li>
            <li>• LocalStorage might be blocked or cleared</li>
          </ul>
          <p className="mt-2 text-sm"><strong>Solution:</strong> Enable Developer Mode using one of the methods above.</p>
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevSetup;