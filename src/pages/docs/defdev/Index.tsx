import { ArrowLeft, Bug, Terminal, Database, Activity, Shield, FileWarning, BookOpen, ChevronRight, ExternalLink, Zap, Code } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const DefDevIndex = () => {
  const sections = [
    {
      icon: Zap,
      title: "Setup & Access",
      description: "Enable Developer Mode and access the DEF-DEV console. Multiple methods available including first-boot setup.",
      link: "/docs/def-dev/setup",
      color: "green"
    },
    {
      icon: Terminal,
      title: "Console Tab",
      description: "Real-time logging with smart error simplification, filtering, and export capabilities.",
      link: "/docs/def-dev/console",
      color: "cyan"
    },
    {
      icon: Activity,
      title: "Actions Tab",
      description: "Monitor system events and user interactions with persistence support.",
      link: "/docs/def-dev/actions",
      color: "purple"
    },
    {
      icon: Database,
      title: "Storage Tab",
      description: "View and manage localStorage entries used by UrbanShade OS including dev-specific storage.",
      link: "/docs/def-dev/storage",
      color: "blue"
    },
    {
      icon: Code,
      title: "DEF-DEV Terminal",
      description: "Command-line interface for executing admin commands and managing the system remotely.",
      link: "/docs/def-dev/terminal",
      color: "green"
    },
    {
      icon: Shield,
      title: "Admin Panel",
      description: "Advanced controls for crash testing, system states, SystemBus integration, and image management.",
      link: "/docs/def-dev/admin",
      color: "red"
    },
    {
      icon: Bug,
      title: "Testing Bugchecks",
      description: "Trigger and analyze bugcheck screens for testing and debugging. Crash entry mode support.",
      link: "/docs/def-dev/bugchecks",
      color: "red"
    },
    {
      icon: FileWarning,
      title: "API Reference",
      description: "Action Dispatcher, Command Queue, and System Bus APIs for advanced integration.",
      link: "/docs/def-dev/api",
      color: "amber"
    },
    {
      icon: Activity,
      title: "Diagnostics",
      description: "Real-time system health monitoring, performance metrics, and diagnostic utilities.",
      link: "/docs/def-dev/diagnostics",
      color: "green"
    }
  ];

  return (
    <>
    <SEO 
      title="DEF-DEV Console" 
      description="Developer debugging console for Urbanshade OS - logging, actions, storage, and system diagnostics."
      path="/docs/def-dev"
    />
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-amber-400">DEF-DEV Documentation</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Title */}
        <section className="text-center space-y-4">
          <p className="text-sm text-gray-500 italic">(No jokes unfortunately)</p>
          <div className="flex items-center justify-center gap-3">
            <Bug className="w-12 h-12 text-amber-400" />
            <h2 className="text-4xl font-bold text-amber-400">DEF-DEV Console</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developer Environment and Debugging Tool for UrbanShade OS v2.4
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">v2.4</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">Developer Tool</span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">Advanced</span>
          </div>
        </section>

        {/* Quick Overview */}
        <section className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            What is DEF-DEV?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            DEF-DEV (Developer Environment Framework - Development) is a comprehensive debugging and development console 
            for UrbanShade OS. It provides real-time logging, localStorage inspection, recovery image management, 
            action monitoring, system diagnostics, and now includes a full terminal with command queue support for 
            executing admin commands on the main OS page.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Terminal className="w-6 h-6 text-cyan-400 mb-2" />
              <h4 className="font-semibold text-cyan-400 mb-1">Real-Time Logging</h4>
              <p className="text-sm text-muted-foreground">Captures all console output with smart error simplification</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400 mb-2" />
              <h4 className="font-semibold text-purple-400 mb-1">Action Monitoring</h4>
              <p className="text-sm text-muted-foreground">Tracks all system events via the Action Dispatcher</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Code className="w-6 h-6 text-green-400 mb-2" />
              <h4 className="font-semibold text-green-400 mb-1">Command Queue</h4>
              <p className="text-sm text-muted-foreground">Execute commands on the main OS via terminal</p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Documentation Sections</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section, i) => (
              <Link
                key={section.title}
                to={section.link}
                className={`p-5 rounded-xl bg-${section.color}-500/10 border border-${section.color}-500/30 hover:bg-${section.color}-500/20 transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${section.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <section.icon className={`w-5 h-5 text-${section.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-${section.color}-400 group-hover:underline`}>
                        {i + 1}. {section.title}
                      </h4>
                      <ExternalLink className={`w-4 h-4 text-${section.color}-400 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section className="p-6 bg-black/40 border border-white/10 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Quick Start</h3>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500/20 rounded text-center text-sm leading-6 text-amber-400 flex-shrink-0">1</span>
              <span>Enable Developer Mode via Settings → Developer Options (or <code className="px-1.5 py-0.5 bg-black/50 rounded text-amber-400">devMode()</code> in browser console)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500/20 rounded text-center text-sm leading-6 text-amber-400 flex-shrink-0">2</span>
              <span>Navigate to <code className="px-1.5 py-0.5 bg-black/50 rounded text-amber-400">/def-dev</code> in your browser</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500/20 rounded text-center text-sm leading-6 text-amber-400 flex-shrink-0">3</span>
              <span>Accept the consent prompt to enable action persistence</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500/20 rounded text-center text-sm leading-6 text-amber-400 flex-shrink-0">4</span>
              <span>Explore the Console, Actions, Storage, Terminal, and Admin tabs</span>
            </li>
          </ol>
        </section>

      {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10">
          <p className="text-sm text-muted-foreground">
            DEF-DEV Documentation • v2.4 • Part of UrbanShade OS
          </p>
          <Link to="/docs" className="inline-block text-amber-400 hover:underline text-sm font-semibold mt-4">
            ← Return to Main Documentation
          </Link>
        </footer>
      </main>
    </div>
    </>
  );
};

export default DefDevIndex;