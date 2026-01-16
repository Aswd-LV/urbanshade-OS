import { ArrowLeft, Folder, Terminal, Settings, Globe, FileText, Calculator, Music, Image, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Applications = () => {
  const apps = [
    {
      icon: Folder,
      name: "File Explorer",
      description: "Browse your totally real file system",
      details: "Navigate through directories, view documents, and pretend you're accessing classified facility data. Features include folder navigation, file previews, and that satisfying click sound (just kidding, no sound)."
    },
    {
      icon: Terminal,
      name: "Terminal",
      description: "For when you want to feel like a hacker",
      details: "Command-line interface with various commands. Type 'help' to see what's available. There might be some secret commands hidden in there... who knows? (We do. Check the Terminal docs.)"
    },
    {
      icon: Settings,
      name: "Settings",
      description: "Tweak all the things",
      details: "Configure system preferences, manage user accounts, export/import your system data, and toggle various options. It's like a control panel, but underwater!"
    },
    {
      icon: Globe,
      name: "Browser",
      description: "Surf the intranet (it's like internet, but sadder)",
      details: "Access the facility's internal network. Browse documentation, check the employee directory, and visit internal sites. No cat videos though, sorry."
    },
    {
      icon: FileText,
      name: "Notepad",
      description: "Write things down before you forget",
      details: "A simple text editor for your notes, logs, and definitely-not-secret plans. Auto-saves to localStorage because we care about your unsaved work."
    },
    {
      icon: Calculator,
      name: "Calculator",
      description: "Math. It's what calculators do.",
      details: "Basic arithmetic operations for when you need to calculate... things. Pressure differentials? Oxygen levels? Your remaining sanity? All possible!"
    },
    {
      icon: Music,
      name: "Music Player",
      description: "Tunes for the deep",
      details: "Listen to ambient facility sounds or whatever playlist you've imagined. Perfect for setting the mood while monitoring containment breaches."
    },
    {
      icon: Image,
      name: "Image Viewer",
      description: "Look at pictures",
      details: "View images stored in the facility database. Specimen photos, facility schematics, or that one picture of the cafeteria's mystery meat."
    },
    {
      icon: Clock,
      name: "Clock",
      description: "Time is an illusion. Lunchtime doubly so.",
      details: "Keep track of time, even though day and night don't exist 8km underwater. Features multiple time zones for coordinating with surface operations."
    },
    {
      icon: Folder,
      name: "Task Manager",
      description: "See what's running (and kill it if you must)",
      details: "Monitor running applications, view system resource usage, and terminate unresponsive programs. Like Ctrl+Alt+Delete, but prettier."
    },
    {
      icon: Settings,
      name: "Registry Editor",
      description: "Touch the forbidden settings",
      details: "Direct access to system configuration values. Modify at your own risk - there's no 'Are you sure?' dialog here."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">Core Applications</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center space-y-4">
          <Folder className="w-16 h-16 mx-auto text-cyan-400" />
          <h2 className="text-4xl font-bold text-white">Your Digital Toolbox</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            URBANSHADE OS comes packed with applications designed to help you manage 
            an underwater research facility. Or, you know, just click around and have fun.
          </p>
        </section>

        <div className="grid gap-6">
          {apps.map((app, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <app.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{app.name}</h3>
                  <p className="text-cyan-400 text-sm">{app.description}</p>
                  <p className="text-slate-400 text-sm">{app.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <h3 className="font-bold text-cyan-400 mb-2">💡 Did you know?</h3>
          <p className="text-sm text-slate-400">
            You can open multiple applications at once! Each one opens in its own window 
            that you can drag, resize, minimize, and maximize. It's like a real desktop, 
            except everything is simulated and the files aren't real. Living the dream!
          </p>
        </div>

        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <h3 className="font-bold text-amber-500 mb-2">🔧 Developer Note</h3>
          <p className="text-sm text-slate-400">
            If you have Developer Mode enabled, you can also access DEF-DEV for advanced 
            debugging and system analysis. Check out the DEF-DEV documentation for more info!
          </p>
        </div>

        <div className="flex justify-between pt-8 border-t border-cyan-500/20">
          <Link to="/docs/getting-started" className="text-cyan-400 hover:underline">← Getting Started</Link>
          <Link to="/docs/facility" className="text-cyan-400 hover:underline">Facility Apps →</Link>
        </div>
      </main>
    </div>
  );
};

export default Applications;
