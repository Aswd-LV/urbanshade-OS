import { Terminal, ChevronRight, AlertTriangle, Zap, Database, Settings, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { DocLayout, DocSection, DocHero, DocCode, DocAlert, DocTable } from "@/components/docs";

const DefDevTerminal = () => {
  return (
    <DocLayout
      title="Terminal Commands"
      description="Complete command reference for DEF-DEV Terminal"
      accentColor="green"
      prevPage={{ title: "DEF-DEV", path: "/docs/def-dev" }}
      nextPage={{ title: "Storage", path: "/docs/def-dev/storage" }}
    >
      <DocHero
        icon={Terminal}
        title="DEF-DEV Terminal"
        subtitle="Interactive command-line interface for system control and debugging"
        accentColor="green"
      />

      <DocAlert variant="info" title="Terminal Access">
        Access the terminal from DEF-DEV Console → Terminal tab (in the Core section), 
        or open DEF-DEV with <code>Ctrl+Shift+D</code>.
      </DocAlert>

      {/* Core Commands */}
      <DocSection title="Core Commands" icon={Terminal} accentColor="green">
        <DocTable
          headers={["Command", "Description", "Example"]}
          rows={[
            ["help", "Show all available commands", "help"],
            ["help [cmd]", "Show help for specific command", "help crash"],
            ["clear", "Clear terminal output", "clear"],
            ["echo [msg]", "Print a message", "echo Hello World"],
            ["date", "Show current date/time", "date"],
            ["uptime", "Show system uptime", "uptime"],
            ["whoami", "Show current user info", "whoami"],
            ["status", "Show system status", "status"],
          ]}
          accentColor="green"
        />
      </DocSection>

      {/* System Commands */}
      <DocSection title="System Commands" icon={Zap} accentColor="purple">
        <DocTable
          headers={["Command", "Description", "Example"]}
          rows={[
            ["crash [type]", "Queue a crash screen", "crash KERNEL_PANIC"],
            ["bugcheck [code] [desc]", "Queue a bugcheck BSOD", "bugcheck FATAL_ERROR Test"],
            ["reboot", "Queue system reboot", "reboot"],
            ["shutdown", "Queue system shutdown", "shutdown"],
            ["lockdown [protocol]", "Trigger lockdown mode", "lockdown ALPHA"],
            ["recovery", "Boot into recovery mode", "recovery"],
            ["wipe --confirm", "Wipe all data (DANGEROUS)", "wipe --confirm"],
          ]}
          accentColor="purple"
        />
        
        <DocCode code={`# Queue a bugcheck with custom code
$ bugcheck DATA_INCONSISTENCY Database validation failed
Bugcheck queued: DATA_INCONSISTENCY

# Trigger lockdown protocol
$ lockdown GAMMA
Lockdown protocol GAMMA queued`} />
      </DocSection>

      {/* Storage Commands */}
      <DocSection title="Storage Commands" icon={Database} accentColor="blue">
        <DocTable
          headers={["Command", "Description", "Example"]}
          rows={[
            ["ls [filter]", "List localStorage keys", "ls settings"],
            ["get <key>", "Get a storage value", "get urbanshade_theme"],
            ["set <key> <value>", "Queue setting a value", "set debug true"],
            ["del <key>", "Queue deleting a key", "del temp_data"],
          ]}
          accentColor="blue"
        />

        <DocCode code={`# List keys containing 'settings'
$ ls settings
settings_theme
settings_volume
settings_notifications

# Get a specific value
$ get settings_theme
"urbanshade-dark"

# Set a value (queued for main OS)
$ set mykey myvalue
Storage write queued: mykey`} />
      </DocSection>

      {/* Utility Commands */}
      <DocSection title="Utility Commands" icon={Settings} accentColor="cyan">
        <DocTable
          headers={["Command", "Description"]}
          rows={[
            ["toast <type> <msg>", "Queue a toast notification (success/error/info/warning)"],
            ["queue", "Show pending commands in queue"],
            ["exec <cmd>", "Execute a raw command"],
          ]}
          accentColor="cyan"
        />
      </DocSection>

      {/* UUR Package Manager */}
      <DocSection title="UUR Package Manager" icon={Code} accentColor="amber">
        <DocTable
          headers={["Command", "Description"]}
          rows={[
            ["uur", "Show UUR help"],
            ["uur lst", "List installed packages"],
            ["uur search <query>", "Search available packages"],
          ]}
          accentColor="amber"
        />

        <DocCode code={`# Search for packages
$ uur search terminal
  terminal-plus - Enhanced terminal features (v1.0.0)
  terminal-themes - Custom terminal color schemes (v1.2.0)

# List installed
$ uur lst
  base-system (1.0.0)
  def-dev-tools (1.0.0)`} />
      </DocSection>

      {/* Command Queue System */}
      <DocSection title="Command Queue System" icon={Zap} accentColor="purple">
        <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            How It Works
          </h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Commands like <code className="text-green-400">crash</code>, <code className="text-green-400">reboot</code>, 
              and <code className="text-green-400">set</code> don't execute immediately. They are queued to localStorage.
            </p>
            <p>
              The main OS page polls localStorage 4× per second for pending commands, then executes them.
              This allows DEF-DEV to control the main OS from a separate window/tab.
            </p>
            <p>
              Use <code className="text-green-400">queue</code> to see pending commands and 
              <code className="text-green-400">status</code> to check if persistence is enabled.
            </p>
          </div>
        </div>
      </DocSection>

      {/* Keyboard Shortcuts */}
      <DocSection title="Keyboard Shortcuts" icon={Terminal} accentColor="green">
        <DocTable
          headers={["Shortcut", "Action"]}
          rows={[
            ["Enter", "Execute command"],
            ["↑ / ↓", "Navigate command history"],
            ["Tab", "Auto-complete (if supported)"],
          ]}
          accentColor="green"
        />
      </DocSection>

      {/* Warning */}
      <DocSection title="Dangerous Commands" icon={AlertTriangle} accentColor="red">
        <DocAlert variant="danger" title="Data Loss Warning">
          The <code className="text-red-400">wipe --confirm</code> command permanently deletes ALL localStorage data, 
          including settings, accounts, files, and all OS state. This cannot be undone.
        </DocAlert>
      </DocSection>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-border/50">
        <Link 
          to="/docs/def-dev"
          className="flex-1 p-4 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold group-hover:text-primary transition-colors">← Back to DEF-DEV</span>
          </div>
          <p className="text-xs text-muted-foreground">Return to main documentation</p>
        </Link>
        <Link 
          to="/docs/def-dev/storage"
          className="flex-1 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="font-semibold group-hover:text-blue-400 transition-colors">Storage Guide</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
          <p className="text-xs text-muted-foreground">Learn about localStorage inspection</p>
        </Link>
      </div>
    </DocLayout>
  );
};

export default DefDevTerminal;
