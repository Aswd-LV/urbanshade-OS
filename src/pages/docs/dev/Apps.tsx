import { Puzzle, FileCode, Monitor, Layers } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocCode } from "@/components/docs";

const BuildingApps = () => {
  const bestPractices = [
    { title: "Use design tokens", desc: "Always use semantic color classes (bg-background, text-foreground)" },
    { title: "Handle window resize", desc: "Use flex layouts and responsive design" },
    { title: "Persist state wisely", desc: "Use localStorage for settings, not temporary UI state" },
    { title: "Use SystemBus for events", desc: "Emit and listen to events for cross-app communication" }
  ];

  return (
    <DocLayout
      title="Building Apps"
      description="Create desktop applications for UrbanShade OS with React components."
      keywords={["apps", "components", "development", "react", "windows"]}
      accentColor="blue"
      breadcrumbs={[{ label: "Developer Docs", path: "/docs/dev" }]}
      prevPage={{ title: "Architecture", path: "/docs/dev/architecture" }}
      nextPage={{ title: "Terminal Commands", path: "/docs/dev/terminal" }}
    >
      <DocHero
        icon={Puzzle}
        title="Building Apps"
        subtitle="Create desktop applications for UrbanShade OS."
        accentColor="blue"
      />

      <DocSection title="App Component Structure" icon={FileCode} accentColor="blue" id="structure">
        <p className="text-slate-400 mb-4">
          Apps are React components placed in <code className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400">src/components/apps/</code>.
        </p>
        
        <DocCode
          title="src/components/apps/MyApp.tsx"
          code={`import { useState } from "react";

interface MyAppProps {
  windowId: string;
}

export const MyApp = ({ windowId }: MyAppProps) => {
  const [count, setCount] = useState(0);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold">My App</h1>
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
        />
      </DocSection>

      <DocSection title="Registering Your App" icon={Monitor} accentColor="blue" id="register">
        <p className="text-slate-400 mb-4">
          Apps need to be registered in two places:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-slate-400 mb-6">
          <li>
            <strong className="text-slate-100">Desktop.tsx</strong> - Add to the desktop icons and appDefinitions
          </li>
          <li>
            <strong className="text-slate-100">WindowManager.tsx</strong> - Add to the window rendering switch
          </li>
        </ol>
        
        <DocCode
          title="Registration Examples"
          code={`// In Desktop.tsx appDefinitions array:
{
  id: "my-app",
  title: "My App",
  icon: <Puzzle className="w-6 h-6" />,
  component: "my-app"
}

// In WindowManager.tsx switch statement:
case "my-app":
  return <MyApp windowId={window.id} />;`}
        />
      </DocSection>

      <DocSection title="Best Practices" icon={Layers} accentColor="blue" id="practices">
        <div className="space-y-3">
          {bestPractices.map((tip) => (
            <DocCard key={tip.title} title={tip.title} accentColor="blue">
              <p className="mt-2 text-sm text-slate-400">{tip.desc}</p>
            </DocCard>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default BuildingApps;