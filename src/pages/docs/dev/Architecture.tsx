import { ArrowLeft, Layers, Box, Database, Zap, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";

const Architecture = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-teal-100">Architecture Overview</h1>
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
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <Layers className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Architecture Overview</h2>
              <p className="text-slate-400">How UrbanShade OS is structured</p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-teal-400" />
            Technology Stack
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "React 18", desc: "UI library with hooks and concurrent features" },
              { name: "TypeScript", desc: "Type-safe JavaScript for better DX" },
              { name: "Tailwind CSS", desc: "Utility-first CSS framework" },
              { name: "Vite", desc: "Fast build tool and dev server" },
              { name: "Supabase", desc: "Backend-as-a-service for auth and data" },
              { name: "shadcn/ui", desc: "Headless component primitives" }
            ].map((tech, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="font-semibold text-white">{tech.name}</h4>
                <p className="text-sm text-slate-400 mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Component Hierarchy */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-teal-400" />
            Component Hierarchy
          </h3>
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700 font-mono text-sm">
            <pre className="text-slate-300 overflow-x-auto">
{`App
├── Boot Sequence
│   ├── BiosScreen
│   ├── BootScreen
│   ├── InstallationScreen
│   └── OOBEScreen
├── Auth Flow
│   ├── LockScreen
│   └── LoginScreen
└── Desktop Environment
    ├── Desktop (icons, wallpaper)
    ├── WindowManager (app windows)
    ├── Taskbar (start menu, tray)
    ├── StartMenu
    └── NotificationCenter`}
            </pre>
          </div>
        </section>

        {/* State Management */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-400" />
            State Management
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400">
              UrbanShade OS uses a combination of React state, localStorage persistence, 
              and the SystemBus for inter-component communication.
            </p>
            <ul className="space-y-2 text-slate-400 mt-4">
              <li><strong className="text-white">Local State:</strong> Component-level state with useState/useReducer</li>
              <li><strong className="text-white">Persistence:</strong> localStorage for settings, accounts, and preferences</li>
              <li><strong className="text-white">SystemBus:</strong> Pub/sub event system for decoupled communication</li>
              <li><strong className="text-white">React Query:</strong> Server state management for Supabase data</li>
            </ul>
          </div>
        </section>

        {/* Key Patterns */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            Key Patterns
          </h3>
          <div className="space-y-4">
            {[
              { 
                title: "Custom Hooks", 
                desc: "Business logic is extracted into reusable hooks (useAchievements, useKroner, useNotifications, etc.)" 
              },
              { 
                title: "Compound Components", 
                desc: "Complex UI like WindowManager uses compound component patterns for flexibility" 
              },
              { 
                title: "Event-Driven Architecture", 
                desc: "SystemBus enables loose coupling between features (achievements, notifications, quests)" 
              }
            ].map((pattern, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="font-semibold text-teal-400">{pattern.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{pattern.desc}</p>
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

export default Architecture;
