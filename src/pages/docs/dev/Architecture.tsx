import { Layers, Box, Database, Zap, GitBranch } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocCode } from "@/components/docs";

const Architecture = () => {
  const techStack = [
    { name: "React 18", desc: "UI library with hooks and concurrent features" },
    { name: "TypeScript", desc: "Type-safe JavaScript for better DX" },
    { name: "Tailwind CSS", desc: "Utility-first CSS framework" },
    { name: "Vite", desc: "Fast build tool and dev server" },
    { name: "Supabase", desc: "Backend-as-a-service for auth and data" },
    { name: "shadcn/ui", desc: "Headless component primitives" }
  ];

  const patterns = [
    { title: "Custom Hooks", desc: "Business logic extracted into reusable hooks (useAchievements, useKroner, etc.)" },
    { title: "Compound Components", desc: "Complex UI like WindowManager uses compound component patterns" },
    { title: "Event-Driven Architecture", desc: "SystemBus enables loose coupling between features" }
  ];

  return (
    <DocLayout
      title="Architecture Overview"
      description="How UrbanShade OS is structured - technology stack, component hierarchy, and key patterns."
      keywords={["architecture", "react", "typescript", "components", "state"]}
      accentColor="teal"
      breadcrumbs={[{ label: "Developer Docs", path: "/docs/dev" }]}
      prevPage={{ title: "Developer Docs", path: "/docs/dev" }}
      nextPage={{ title: "Building Apps", path: "/docs/dev/apps" }}
    >
      <DocHero
        icon={Layers}
        title="Architecture Overview"
        subtitle="How UrbanShade OS is structured under the hood."
        accentColor="teal"
      />

      <DocSection title="Technology Stack" icon={Box} accentColor="teal" id="stack">
        <div className="grid md:grid-cols-2 gap-4">
          {techStack.map((tech) => (
            <DocCard key={tech.name} title={tech.name} accentColor="teal">
              <p className="mt-2 text-sm text-slate-400">{tech.desc}</p>
            </DocCard>
          ))}
        </div>
      </DocSection>

      <DocSection title="Component Hierarchy" icon={GitBranch} accentColor="teal" id="hierarchy">
        <DocCode
          title="Component Tree"
          code={`App
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
        />
      </DocSection>

      <DocSection title="State Management" icon={Database} accentColor="teal" id="state">
        <p className="text-slate-400 mb-4">
          UrbanShade OS uses a combination of React state, localStorage persistence, 
          and the SystemBus for inter-component communication.
        </p>
        <ul className="space-y-2 text-slate-400">
          <li>• <strong className="text-slate-100">Local State:</strong> Component-level state with useState/useReducer</li>
          <li>• <strong className="text-slate-100">Persistence:</strong> localStorage for settings, accounts, preferences</li>
          <li>• <strong className="text-slate-100">SystemBus:</strong> Pub/sub event system for decoupled communication</li>
          <li>• <strong className="text-slate-100">React Query:</strong> Server state management for Supabase data</li>
        </ul>
      </DocSection>

      <DocSection title="Key Patterns" icon={Zap} accentColor="teal" id="patterns">
        <div className="space-y-3">
          {patterns.map((pattern) => (
            <DocCard key={pattern.title} title={pattern.title} accentColor="teal">
              <p className="mt-2 text-sm text-slate-400">{pattern.desc}</p>
            </DocCard>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Architecture;