import { Bug, Terminal, Database, Activity, Shield, FileWarning, BookOpen, Zap, Code, Wrench, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const DefDevIndex = () => {
  const sections = [
    { icon: Zap, title: "Setup & Access", description: "Enable Developer Mode and access the DEF-DEV console.", link: "/docs/def-dev/setup", accent: "green" },
    { icon: Terminal, title: "Console Tab", description: "Real-time logging with smart error simplification.", link: "/docs/def-dev/console", accent: "cyan" },
    { icon: Activity, title: "Actions Tab", description: "Monitor system events and user interactions.", link: "/docs/def-dev/actions", accent: "purple" },
    { icon: Database, title: "Storage Tab", description: "View and manage localStorage entries.", link: "/docs/def-dev/storage", accent: "blue" },
    { icon: Code, title: "DEF-DEV Terminal", description: "Command-line interface for admin commands.", link: "/docs/def-dev/terminal", accent: "green" },
    { icon: Shield, title: "Admin Panel", description: "Advanced controls for crash testing and system states.", link: "/docs/def-dev/admin", accent: "red" },
    { icon: Bug, title: "Testing Bugchecks", description: "Trigger and analyze bugcheck screens.", link: "/docs/def-dev/bugchecks", accent: "red" },
    { icon: FileWarning, title: "API Reference", description: "Action Dispatcher, Command Queue, and System Bus APIs.", link: "/docs/def-dev/api", accent: "amber" },
    { icon: Activity, title: "Diagnostics", description: "Real-time system health monitoring.", link: "/docs/def-dev/diagnostics", accent: "green" }
  ];

  const getAccent = (accent: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" },
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
      blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" },
      amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" }
    };
    return colors[accent] || colors.amber;
  };

  return (
    <DocLayout
      title="DEF-DEV Console"
      description="Developer debugging console for Urbanshade OS - logging, actions, storage, and system diagnostics."
      accentColor="amber"
      keywords={["def-dev", "debugging", "console", "developer", "diagnostics"]}
      prevPage={{ title: "Developer Docs", path: "/docs/dev" }}
    >
      <DocHero
        icon={Bug}
        title="DEF-DEV Console"
        subtitle="Developer Environment Framework - your toolkit for debugging, monitoring, and controlling UrbanShade OS."
        accentColor="amber"
      />

      {/* What is DEF-DEV */}
      <DocSection title="What is DEF-DEV?" icon={BookOpen} accentColor="amber">
        <p className="text-slate-400 mb-6">
          DEF-DEV (Developer Environment Framework - Development) is a comprehensive debugging and development console 
          for UrbanShade OS. It provides real-time logging, localStorage inspection, action monitoring, system diagnostics, 
          and a terminal with command queue support for executing admin commands on the main OS page.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <DocCard title="Real-Time Logging" description="Captures all console output with smart error simplification." icon={Terminal} accentColor="cyan" />
          <DocCard title="Action Monitoring" description="Tracks all system events via the Action Dispatcher." icon={Activity} accentColor="purple" />
          <DocCard title="Command Queue" description="Execute commands on the main OS via terminal." icon={Code} accentColor="green" />
        </div>
      </DocSection>

      {/* Documentation Sections */}
      <DocSection title="Documentation Sections" icon={Wrench} accentColor="amber">
        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((section, i) => {
            const accent = getAccent(section.accent);
            return (
              <Link
                key={section.title}
                to={section.link}
                className={`group p-5 rounded-xl ${accent.bg} border ${accent.border} hover:opacity-80 transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}>
                    <section.icon className={`w-5 h-5 ${accent.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold ${accent.text} group-hover:underline`}>
                        {i + 1}. {section.title}
                      </h4>
                      <ChevronRight className={`w-4 h-4 ${accent.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{section.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </DocSection>

      {/* Quick Start */}
      <DocSection title="Quick Start" icon={Zap} accentColor="amber">
        <div className="space-y-3">
          {[
            "Enable Developer Mode via Settings → Developer Options (or devMode() in browser console)",
            "Navigate to /def-dev in your browser",
            "Accept the consent prompt to enable action persistence",
            "Explore the Console, Actions, Storage, Terminal, and Admin tabs"
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500/20 rounded text-center text-sm leading-6 text-amber-400 flex-shrink-0">{i + 1}</span>
              <span className="text-slate-400">{step}</span>
            </div>
          ))}
        </div>

        <DocAlert variant="tip" title="Handshake Feature">
          DEF-DEV now includes a handshake mechanism! Click the connection indicator in the header to sync with the main OS and get real-time system state.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default DefDevIndex;