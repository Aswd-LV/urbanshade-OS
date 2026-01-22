import { Terminal, Code, Zap, Info, AlertTriangle } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocTable, DocCode } from "@/components/docs";

const DefDevTerminal = () => {
  const commands = [
    ["help", "", "Show all available commands"],
    ["clear", "", "Clear the terminal screen"],
    ["echo", "[message]", "Print a message to the terminal"],
    ["status", "", "Show system status and persistence state"],
    ["crash", "[type]", "Queue a crash screen (KERNEL_PANIC, etc.)"],
    ["bugcheck", "[code]", "Queue a bugcheck (FATAL_EXCEPTION, etc.)"],
    ["reboot", "", "Queue a system reboot"],
    ["shutdown", "", "Queue a system shutdown"],
    ["lockdown", "", "Trigger facility lockdown mode"],
    ["recovery", "", "Boot into recovery mode"],
    ["wipe", "", "Clear all localStorage (DANGEROUS)"],
    ["ls", "", "List all localStorage keys"],
    ["get", "[key]", "Get a localStorage value"],
    ["set", "[key] [value]", "Set a localStorage value"],
    ["del", "[key]", "Delete a localStorage key"],
    ["toast", "[message]", "Show a toast notification"],
    ["queue", "", "Show pending commands in queue"],
    ["exec", "[command]", "Execute a raw command"],
  ];

  const categories = [
    { name: "System", commands: ["crash", "bugcheck", "reboot", "shutdown", "lockdown", "recovery", "wipe"], color: "red" },
    { name: "Storage", commands: ["ls", "get", "set", "del"], color: "cyan" },
    { name: "Utility", commands: ["help", "clear", "echo", "status", "toast", "queue", "exec"], color: "green" },
  ];

  return (
    <DocLayout
      title="DEF-DEV Terminal"
      description="Powerful command-line interface for executing admin commands and managing UrbanShade OS."
      keywords={["def-dev", "terminal", "commands", "cli", "admin"]}
      accentColor="green"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "Storage Tab", path: "/docs/def-dev/storage" }}
      nextPage={{ title: "Admin Panel", path: "/docs/def-dev/admin" }}
    >
      <DocHero
        icon={Terminal}
        title="DEF-DEV Terminal"
        subtitle="A powerful command-line interface for executing admin commands, managing localStorage, and controlling UrbanShade OS."
        accentColor="green"
      />

      <DocSection title="Overview" icon={Info} accentColor="green" id="overview">
        <DocAlert variant="info">
          The DEF-DEV Terminal provides direct access to system commands. Commands that affect the main OS use the 
          <strong> command queue system</strong>, which the main OS polls 4 times per second.
          Type <code className="px-1.5 py-0.5 bg-slate-800 rounded text-green-400">help</code> to see all available commands.
        </DocAlert>
      </DocSection>

      <DocSection title="Command Categories" icon={Code} accentColor="green" id="categories">
        <div className="grid md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <DocCard key={cat.name} title={`${cat.name} Commands`} accentColor={cat.color as any}>
              <ul className="mt-3 space-y-1">
                {cat.commands.map((cmd) => (
                  <li key={cmd} className="text-sm font-mono text-slate-300">• {cmd}</li>
                ))}
              </ul>
            </DocCard>
          ))}
        </div>
      </DocSection>

      <DocSection title="Command Reference" icon={Terminal} accentColor="amber" id="reference">
        <DocTable
          headers={["Command", "Arguments", "Description"]}
          rows={commands.map(([name, args, desc]) => [
            <code key={name} className="text-green-400">{name}</code>,
            <code key={`${name}-args`} className="text-cyan-400">{args || "—"}</code>,
            desc
          ])}
          accentColor="amber"
        />
      </DocSection>

      <DocSection title="Usage Examples" icon={Code} accentColor="green" id="examples">
        <div className="space-y-4">
          <DocCode
            title="Trigger a crash"
            code={`$ crash KERNEL_PANIC
→ Queued crash: KERNEL_PANIC`}
          />
          <DocCode
            title="Manage localStorage"
            code={`$ get urbanshade_settings
→ {'theme':'dark','sound':true}

$ set mykey myvalue
→ Set mykey = myvalue`}
          />
          <DocCode
            title="Check status"
            code={`$ status
DEF-DEV v2.0
Persistence: Enabled
Queued commands: 0
LocalStorage keys: 12`}
          />
        </div>
      </DocSection>

      <DocSection title="Command Queue System" icon={Zap} accentColor="purple" id="queue">
        <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            How It Works
          </h4>
          <div className="space-y-3 text-sm text-slate-400">
            <p>
              Commands like <code className="text-green-400">crash</code>, <code className="text-green-400">reboot</code>, 
              and <code className="text-green-400">shutdown</code> don't execute immediately. They are queued to localStorage.
            </p>
            <p>
              The main OS page polls localStorage 4× per second for pending commands, then executes them.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Warning" icon={AlertTriangle} accentColor="red" id="warning">
        <DocAlert variant="danger" title="Dangerous Commands">
          The <code className="text-red-400">wipe</code> command permanently deletes all localStorage data, 
          including settings, accounts, files, and all OS state. Use with extreme caution.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevTerminal;