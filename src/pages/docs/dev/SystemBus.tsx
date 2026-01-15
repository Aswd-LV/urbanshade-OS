import { ArrowLeft, Cpu, Zap, MessageSquare, Code, ChevronRight, Copy, Check, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SystemBusDocs = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const events = [
    { name: "window:open", description: "A new window was opened", payload: "{ appId, windowId }" },
    { name: "window:close", description: "A window was closed", payload: "{ windowId }" },
    { name: "window:focus", description: "Window received focus", payload: "{ windowId }" },
    { name: "notification:show", description: "Display a notification", payload: "{ title, message, type }" },
    { name: "theme:change", description: "Theme was changed", payload: "{ themeName }" },
    { name: "user:login", description: "User logged in", payload: "{ userId, username }" },
    { name: "user:logout", description: "User logged out", payload: "{}" },
    { name: "file:create", description: "File was created", payload: "{ path, name }" },
    { name: "file:delete", description: "File was deleted", payload: "{ path }" },
    { name: "app:install", description: "App was installed", payload: "{ appId, appName }" }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-teal-100">System Bus API</h1>
              <p className="text-xs text-teal-500/70">Developer Documentation</p>
            </div>
          </div>
          <Link 
            to="/docs/dev" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">System Bus</h2>
          <p className="text-slate-400 leading-relaxed">
            The System Bus provides a pub/sub messaging system for inter-component communication.
            Components can emit events and subscribe to events from other parts of the system without
            direct coupling.
          </p>
          
          <div className="flex flex-wrap gap-3">
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
        </section>

        {/* Built-in Events */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            Built-in Events
          </h3>
          
          <div className="overflow-hidden rounded-xl border border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {events.map((event, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-sm font-mono text-teal-400">{event.name}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{event.description}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded">{event.payload}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Subscribing */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-400" />
            Subscribing to Events
          </h3>
          
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-sm font-mono overflow-x-auto">
              <code className="text-slate-300">{subscribeExample}</code>
            </pre>
            <button
              onClick={() => copyCode(subscribeExample, 'subscribe')}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copied === 'subscribe' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </section>

        {/* Emitting */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-teal-400" />
            Emitting Events
          </h3>
          
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-sm font-mono overflow-x-auto">
              <code className="text-slate-300">{emitExample}</code>
            </pre>
            <button
              onClick={() => copyCode(emitExample, 'emit')}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copied === 'emit' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </section>

        {/* Custom Events */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-400" />
            Custom Events
          </h3>
          
          <p className="text-slate-400 text-sm">
            You can define and use your own custom events. Use a namespace prefix to avoid conflicts:
          </p>
          
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-sm font-mono overflow-x-auto">
              <code className="text-slate-300">{customEventExample}</code>
            </pre>
            <button
              onClick={() => copyCode(customEventExample, 'custom')}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copied === 'custom' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-300 text-sm">
              <strong>Best Practice:</strong> Always use namespaced event names (e.g., <code className="text-amber-400">myapp:</code>) 
              for custom events to avoid collisions with system events.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <Link to="/docs/dev/terminal" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Terminal Commands
            </Link>
            <Link to="/docs/dev/uur" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              UUR Packages
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SystemBusDocs;
