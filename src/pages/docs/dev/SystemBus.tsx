import { Cpu, Zap, MessageSquare, Radio, Code } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCode, DocTable, DocAlert } from "@/components/docs";

const SystemBusDocs = () => {
  const events = [
    ["window:open", "A new window was opened", "{ appId, windowId }"],
    ["window:close", "A window was closed", "{ windowId }"],
    ["window:focus", "Window received focus", "{ windowId }"],
    ["notification:show", "Display a notification", "{ title, message, type }"],
    ["theme:change", "Theme was changed", "{ themeName }"],
    ["user:login", "User logged in", "{ userId, username }"],
    ["user:logout", "User logged out", "{}"],
    ["file:create", "File was created", "{ path, name }"],
    ["file:delete", "File was deleted", "{ path }"],
    ["app:install", "App was installed", "{ appId, appName }"]
  ];

  const subscribeExample = `import { systemBus } from "@/lib/systemBus";

// Subscribe to window events
const unsubscribe = systemBus.subscribe("window:open", (data) => {
  console.log("Window opened:", data.appId);
});

// Clean up when component unmounts
useEffect(() => {
  return () => unsubscribe();
}, []);`;

  const emitExample = `import { systemBus } from "@/lib/systemBus";

// Emit a custom event
systemBus.emit("notification:show", {
  title: "Hello!",
  message: "This is a custom notification",
  type: "info"
});`;

  const customEventExample = `// Define and emit custom events
systemBus.emit("myapp:data-loaded", {
  itemCount: 42,
  timestamp: Date.now()
});

// Listen for custom events anywhere
systemBus.subscribe("myapp:data-loaded", (data) => {
  console.log(\`Loaded \${data.itemCount} items\`);
});`;

  return (
    <DocLayout
      title="System Bus API"
      description="Pub/sub messaging system for inter-component communication in UrbanShade OS."
      keywords={["system bus", "events", "pub/sub", "messaging", "api"]}
      accentColor="teal"
      breadcrumbs={[{ label: "Developer", path: "/docs/dev" }]}
      prevPage={{ title: "Terminal Commands", path: "/docs/dev/terminal" }}
      nextPage={{ title: "UUR Packages", path: "/docs/dev/uur" }}
    >
      <DocHero
        icon={Cpu}
        title="System Bus API"
        subtitle="A pub/sub messaging system for inter-component communication without direct coupling."
        accentColor="teal"
      />

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm">
          <Radio className="w-4 h-4 inline mr-2" />
          Publish/Subscribe Pattern
        </div>
        <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm">
          <Zap className="w-4 h-4 inline mr-2" />
          Type-safe Events
        </div>
        <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Decoupled Architecture
        </div>
      </div>

      <DocSection title="Built-in Events" icon={Zap} accentColor="teal">
        <DocTable
          headers={["Event", "Description", "Payload"]}
          rows={events}
        />
      </DocSection>

      <DocSection title="Subscribing to Events" icon={MessageSquare} accentColor="teal">
        <DocCode title="Subscribe Example" code={subscribeExample} />
      </DocSection>

      <DocSection title="Emitting Events" icon={Radio} accentColor="teal">
        <DocCode title="Emit Example" code={emitExample} />
      </DocSection>

      <DocSection title="Custom Events" icon={Code} accentColor="teal">
        <p className="text-slate-400 mb-4">
          You can define and use your own custom events. Use a namespace prefix to avoid conflicts:
        </p>
        <DocCode title="Custom Events" code={customEventExample} />
        
        <DocAlert variant="tip" title="Best Practice">
          Always use namespaced event names (e.g., <code>myapp:</code>) for custom events to avoid collisions with system events.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default SystemBusDocs;
