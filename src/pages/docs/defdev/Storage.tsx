import { Database, Search, Download, Trash2, CheckCircle, Info, Key, HardDrive } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocTable, DocCode } from "@/components/docs";

const DefDevStorage = () => {
  const commonKeys = [
    ["urbanshade_admin", "Admin account credentials and settings"],
    ["urbanshade_accounts", "All user account data"],
    ["urbanshade_settings", "System settings and preferences"],
    ["urbanshade_installed", "Installation completion flag"],
    ["urbanshade_bugchecks", "Stored bugcheck/crash reports"],
    ["urbanshade_files", "Virtual file system data"],
    ["urbanshade_bios", "BIOS configuration settings"],
    ["def-dev-actions", "Persisted action log entries"],
    ["def-dev-persistence", "Persistence enabled/disabled flag"],
    ["urbanshade_command_queue", "Pending commands from DEF-DEV"],
  ];

  return (
    <DocLayout
      title="Storage Tab"
      description="View, search, and manage all localStorage entries used by UrbanShade OS."
      keywords={["def-dev", "storage", "localStorage", "data", "keys"]}
      accentColor="blue"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "Actions Tab", path: "/docs/def-dev/actions" }}
      nextPage={{ title: "Terminal", path: "/docs/def-dev/terminal" }}
    >
      <DocHero
        icon={Database}
        title="Storage Tab"
        subtitle="View, search, and manage all localStorage entries used by UrbanShade OS."
        accentColor="blue"
      />

      <DocSection title="Overview" icon={Info} accentColor="blue" id="overview">
        <DocAlert variant="info">
          The Storage tab provides a complete view of all localStorage entries used by UrbanShade OS. 
          You can view raw values, search by key name, and manage entries directly from DEF-DEV.
        </DocAlert>
      </DocSection>

      <DocSection title="Features" icon={HardDrive} accentColor="blue" id="features">
        <div className="grid md:grid-cols-2 gap-4">
          <DocCard title="Search Entries" icon={Search} accentColor="blue">
            <p className="mt-2 text-sm text-slate-400">
              Search through localStorage keys by name. Find specific settings or data quickly.
            </p>
          </DocCard>
          <DocCard title="View Raw Values" icon={Key} accentColor="blue">
            <p className="mt-2 text-sm text-slate-400">
              Expand any entry to see its raw JSON value. Useful for debugging data formats.
            </p>
          </DocCard>
          <DocCard title="Storage Metrics" icon={HardDrive} accentColor="blue">
            <p className="mt-2 text-sm text-slate-400">
              View total storage size and entry count. Monitor localStorage usage.
            </p>
          </DocCard>
          <DocCard title="Export Snapshot" icon={Download} accentColor="blue">
            <p className="mt-2 text-sm text-slate-400">
              Export all localStorage data as a JSON file for backup or analysis.
            </p>
          </DocCard>
        </div>
      </DocSection>

      <DocSection title="Common Storage Keys" icon={Key} accentColor="amber" id="keys">
        <DocTable
          headers={["Key", "Description"]}
          rows={commonKeys.map(([key, desc]) => [
            <code key={key} className="text-cyan-400">{key}</code>,
            desc
          ])}
          accentColor="amber"
        />
      </DocSection>

      <DocSection title="Terminal Commands" icon={Database} accentColor="green" id="commands">
        <DocCode
          title="Storage Commands"
          code={`$ ls              # List all localStorage keys
$ get [key]       # Get a specific value
$ set [key] [val] # Set a value
$ del [key]       # Delete a key
$ wipe            # Clear ALL localStorage (dangerous!)`}
        />
      </DocSection>

      <DocSection title="Tips" icon={CheckCircle} accentColor="green" id="tips">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-slate-100">Export Before Changes</h5>
              <p className="text-xs text-slate-400">
                Always export a snapshot before making significant changes or clearing storage.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-slate-100">Use Terminal for Edits</h5>
              <p className="text-xs text-slate-400">
                The terminal's set command allows direct value editing without UI limitations.
              </p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Caution" icon={Trash2} accentColor="red" id="caution">
        <DocAlert variant="danger">
          Modifying or deleting storage keys can break UrbanShade OS functionality. 
          Some keys are critical for system operation. Make sure you understand what 
          a key does before modifying or deleting it.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevStorage;