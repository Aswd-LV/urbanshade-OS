import { Code, Activity, Send, Radio, Info, ChevronRight } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocAlert, DocCode } from "@/components/docs";

const DefDevAPI = () => {
  return (
    <DocLayout
      title="API Reference"
      description="Complete technical documentation for UrbanShade OS internal APIs: Action Dispatcher, Command Queue, and System Bus."
      keywords={["def-dev", "api", "action dispatcher", "command queue", "system bus"]}
      accentColor="amber"
      breadcrumbs={[{ label: "DEF-DEV", path: "/docs/def-dev" }]}
      prevPage={{ title: "Bugchecks", path: "/docs/def-dev/bugchecks" }}
    >
      <DocHero
        icon={Code}
        title="API Reference"
        subtitle="Complete technical documentation for UrbanShade OS internal APIs: Action Dispatcher, Command Queue, and System Bus."
        accentColor="amber"
      />

      <DocSection title="Overview" icon={Info} accentColor="amber" id="overview">
        <DocAlert variant="info">
          UrbanShade OS uses a layered API architecture. The <strong className="text-purple-400">Action Dispatcher</strong> handles 
          event logging and persistence. The <strong className="text-cyan-400">Command Queue</strong> enables cross-page communication. 
          The <strong className="text-green-400">System Bus</strong> provides real-time pub/sub for same-page components.
        </DocAlert>

        <div className="mt-4 flex gap-3 flex-wrap">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Action Dispatcher</span>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">Command Queue</span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">System Bus</span>
        </div>
      </DocSection>

      <DocSection title="Action Dispatcher" icon={Activity} accentColor="purple" id="action-dispatcher">
        <p className="text-slate-400 mb-4">
          Central event bus for action logging, persistence to localStorage, and subscriber notifications.
        </p>

        <DocCode
          title="Core Methods"
          code={`// Dispatch an action
actionDispatcher.dispatch({
  type: 'SYSTEM',
  action: 'boot_complete',
  details: { version: '2.2.0' }
});

// Subscribe to actions
const unsubscribe = actionDispatcher.subscribe((action) => {
  console.log('Action:', action.type, action.action);
});

// Control persistence
actionDispatcher.setPersistence(true);
actionDispatcher.loadFromStorage();
actionDispatcher.clearStorage();`}
        />

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {["system()", "user()", "app()", "file()", "error()", "security()"].map((method) => (
            <div key={method} className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <ChevronRight className="w-3 h-3 text-purple-400" />
              <code className="text-purple-400">{method}</code>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Command Queue" icon={Send} accentColor="cyan" id="command-queue">
        <p className="text-slate-400 mb-4">
          Enables cross-page communication between DEF-DEV and the main OS via localStorage.
        </p>

        <DocCode
          title="Core Methods"
          code={`// Enqueue a command
commandQueue.enqueue({
  type: 'CRASH',
  payload: { type: 'KERNEL_PANIC' },
  source: 'DEF-DEV Admin'
});

// Dequeue next command
const cmd = commandQueue.dequeue();

// Subscribe to all commands
const unsubscribe = commandQueue.onAny((cmd) => {
  console.log('Command:', cmd.type);
});

// Control polling
commandQueue.startPolling(250); // 4x per second
commandQueue.stopPolling();`}
        />

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {[
            { type: "CRASH", color: "red" },
            { type: "BUGCHECK", color: "red" },
            { type: "REBOOT", color: "amber" },
            { type: "SHUTDOWN", color: "amber" },
            { type: "LOCKDOWN", color: "red" },
            { type: "RECOVERY", color: "blue" },
            { type: "WRITE_STORAGE", color: "purple" },
            { type: "DELETE_STORAGE", color: "purple" },
            { type: "TOAST", color: "green" },
            { type: "WIPE", color: "red" },
          ].map(({ type, color }) => (
            <div key={type} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <ChevronRight className={`w-3 h-3 text-${color}-400`} />
              <code className={`text-${color}-400`}>{type}</code>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="System Bus" icon={Radio} accentColor="green" id="system-bus">
        <p className="text-slate-400 mb-4">
          Real-time publish/subscribe for same-page component communication. Events processed immediately.
        </p>

        <DocCode
          title="Core Methods"
          code={`// Emit an event
systemBus.emit('TRIGGER_CRASH', { 
  crashType: 'KERNEL_PANIC' 
});

// Subscribe to specific event
const unsubscribe = systemBus.on('TRIGGER_CRASH', (event) => {
  console.log('Crash triggered:', event.payload);
});

// Subscribe to all events
systemBus.onAny((event) => {
  console.log('Event:', event.type);
});`}
        />

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {[
            "TRIGGER_CRASH", "TRIGGER_BUGCHECK", "TRIGGER_LOCKDOWN", "ENTER_RECOVERY",
            "TRIGGER_REBOOT", "TRIGGER_SHUTDOWN", "OPEN_DEV_MODE", "MAINTENANCE_MODE"
          ].map((event) => (
            <div key={event} className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <code className="text-green-400">{event}</code>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Global Access" icon={Code} accentColor="amber" id="global">
        <DocCode
          title="Browser Console Access"
          code={`// Access APIs from browser console
window.actionDispatcher
window.commandQueue
window.systemBus`}
        />
      </DocSection>
    </DocLayout>
  );
};

export default DefDevAPI;