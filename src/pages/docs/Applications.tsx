import { Folder, Terminal, Settings, Globe, FileText, Calculator, Music, Image, Clock, Cpu, PenTool, Play, Archive } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const Applications = () => {
  const productivityApps = [
    {
      icon: Folder,
      name: "File Explorer",
      description: "Browse your virtual file system, navigate directories, and manage files.",
      features: ["Folder navigation", "File previews", "Search functionality", "Context menus"]
    },
    {
      icon: FileText,
      name: "Notepad",
      description: "Simple text editor for notes, logs, and documentation.",
      features: ["Auto-save", "Syntax highlighting", "Multiple tabs", "Export options"]
    },
    {
      icon: Calculator,
      name: "Calculator",
      description: "Basic and scientific calculations for facility operations.",
      features: ["Standard mode", "Scientific mode", "History", "Keyboard support"]
    },
    {
      icon: PenTool,
      name: "Paint",
      description: "Image editor for diagrams, annotations, and creative work.",
      features: ["Drawing tools", "Shapes", "Text", "Layer support"]
    }
  ];

  const systemApps = [
    {
      icon: Terminal,
      name: "Terminal",
      description: "Command-line interface with full scripting support.",
      features: ["50+ commands", "Tab completion", "Command history", "Scripting"]
    },
    {
      icon: Settings,
      name: "Settings",
      description: "Configure system preferences, themes, and user accounts.",
      features: ["Personalization", "Privacy", "System", "Accounts"]
    },
    {
      icon: Cpu,
      name: "Task Manager",
      description: "Monitor running processes and system resources.",
      features: ["Process list", "CPU/Memory usage", "Kill processes", "Startup apps"]
    },
    {
      icon: Archive,
      name: "Registry Editor",
      description: "Direct access to system configuration values.",
      features: ["Key browsing", "Value editing", "Search", "Export/Import"]
    }
  ];

  const mediaApps = [
    {
      icon: Globe,
      name: "Browser",
      description: "Access the facility intranet and internal documentation.",
      features: ["Tab browsing", "Bookmarks", "History", "Dev tools"]
    },
    {
      icon: Music,
      name: "Music Player",
      description: "Listen to ambient sounds and facility audio.",
      features: ["Playlist support", "Shuffle", "Repeat", "Volume control"]
    },
    {
      icon: Image,
      name: "Image Viewer",
      description: "View and manage images stored in the facility database.",
      features: ["Zoom", "Slideshow", "Rotation", "Metadata"]
    },
    {
      icon: Play,
      name: "Video Player",
      description: "Play facility recordings and training videos.",
      features: ["Playback controls", "Fullscreen", "Speed control", "Subtitles"]
    },
    {
      icon: Clock,
      name: "Clock",
      description: "Track time across multiple zones for surface coordination.",
      features: ["World clock", "Alarms", "Timer", "Stopwatch"]
    }
  ];

  const renderAppGrid = (apps: typeof productivityApps) => (
    <div className="grid gap-4 lg:grid-cols-2">
      {apps.map((app) => (
        <DocCard
          key={app.name}
          title={app.name}
          description={app.description}
          icon={app.icon}
          accentColor="blue"
        >
          <div className="mt-3 flex flex-wrap gap-2">
            {app.features.map((feature) => (
              <span
                key={feature}
                className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                {feature}
              </span>
            ))}
          </div>
        </DocCard>
      ))}
    </div>
  );

  return (
    <DocLayout
      title="Core Applications"
      description="Complete guide to Urbanshade OS applications - File Explorer, Terminal, Notepad, Calculator, Settings, and more."
      keywords={["apps", "file explorer", "terminal", "notepad", "calculator", "settings", "applications"]}
      accentColor="blue"
      prevPage={{ title: "Getting Started", path: "/docs/getting-started" }}
      nextPage={{ title: "Facility Apps", path: "/docs/facility" }}
    >
      <DocHero
        icon={Folder}
        title="Core Applications"
        subtitle="Your digital toolbox for facility operations. From file management to system configuration, these are the apps you'll use every day."
        accentColor="blue"
      />

      <DocSection title="Productivity" icon={FileText} accentColor="blue">
        <p>Essential tools for creating, editing, and managing your work.</p>
        {renderAppGrid(productivityApps)}
      </DocSection>

      <DocSection title="System Tools" icon={Cpu} accentColor="blue">
        <p>Power tools for system administration and configuration.</p>
        {renderAppGrid(systemApps)}

        <DocAlert variant="warning" title="Registry Warning">
          The Registry Editor provides direct access to system settings. Incorrect modifications 
          may cause unexpected behavior. There's no "Are you sure?" dialog!
        </DocAlert>
      </DocSection>

      <DocSection title="Media & Communication" icon={Globe} accentColor="blue">
        <p>Stay connected and entertained during long shifts at the facility.</p>
        {renderAppGrid(mediaApps)}
      </DocSection>

      <DocSection title="Tips & Tricks" icon={Settings} accentColor="blue">
        <div className="space-y-4">
          <DocAlert variant="tip" title="Multi-Window Workflow">
            Open multiple apps simultaneously! Each window can be dragged, resized, 
            minimized, and snapped to screen edges for efficient multitasking.
          </DocAlert>

          <DocAlert variant="info" title="Developer Mode">
            Enable Developer Mode in Settings to access DEF-DEV console and additional 
            debugging tools. Check the <a href="/docs/def-dev" className="text-blue-400 hover:underline">DEF-DEV documentation</a> for more.
          </DocAlert>
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Applications;
