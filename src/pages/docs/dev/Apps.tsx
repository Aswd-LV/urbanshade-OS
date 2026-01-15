import { ArrowLeft, Puzzle, FileCode, Monitor, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const BuildingApps = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-teal-100">Building Apps</h1>
          <Link 
            to="/docs/dev" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dev Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Puzzle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Building Apps</h2>
              <p className="text-slate-400">Create desktop applications for UrbanShade OS</p>
            </div>
          </div>
        </section>

        {/* App Structure */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            App Component Structure
          </h3>
          <p className="text-slate-400">
            Apps are React components placed in <code className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400">src/components/apps/</code>.
          </p>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
{`// src/components/apps/MyApp.tsx
import { useState } from "react";

interface MyAppProps {
  windowId: string;
}

export const MyApp = ({ windowId }: MyAppProps) => {
  const [count, setCount] = useState(0);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold text-foreground">My App</h1>
        <p className="text-muted-foreground">Count: {count}</p>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Increment
        </button>
      </div>
    </div>
  );
};`}
            </pre>
          </div>
        </section>

        {/* Registration */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            Registering Your App
          </h3>
          <p className="text-slate-400">
            Apps need to be registered in two places:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-slate-400">
            <li>
              <strong className="text-white">Desktop.tsx</strong> - Add to the desktop icons and appDefinitions
            </li>
            <li>
              <strong className="text-white">WindowManager.tsx</strong> - Add to the window rendering switch
            </li>
          </ol>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
{`// In Desktop.tsx appDefinitions array:
{
  id: "my-app",
  title: "My App",
  icon: <Puzzle className="w-6 h-6" />,
  component: "my-app"
}

// In WindowManager.tsx switch statement:
case "my-app":
  return <MyApp windowId={window.id} />;`}
            </pre>
          </div>
        </section>

        {/* Best Practices */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Best Practices
          </h3>
          <div className="space-y-3">
            {[
              { title: "Use design tokens", desc: "Always use semantic color classes (bg-background, text-foreground)" },
              { title: "Handle window resize", desc: "Use flex layouts and responsive design" },
              { title: "Persist state wisely", desc: "Use localStorage for settings, not temporary UI state" },
              { title: "Use SystemBus for events", desc: "Emit and listen to events for cross-app communication" }
            ].map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="font-semibold text-white">{tip.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-8 border-t border-slate-800">
          <Link to="/docs/dev" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Developer Docs
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default BuildingApps;
