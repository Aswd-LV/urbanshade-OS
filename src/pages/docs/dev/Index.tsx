import { ArrowLeft, Code, Palette, Puzzle, Terminal, BookOpen, Zap, ChevronRight, ExternalLink, Layers, Cpu, GitBranch, Package } from "lucide-react";
import { Link } from "react-router-dom";

const DevDocsIndex = () => {
  const sections = [
    {
      icon: Layers,
      title: "Architecture Overview",
      description: "Understand how UrbanShade OS is structured. Component hierarchy, state management, and data flow.",
      link: "/docs/dev/architecture",
      badge: "Start Here"
    },
    {
      icon: Palette,
      title: "Theming & Styling",
      description: "Create custom themes, use design tokens, and understand the Urbanshade design system.",
      link: "/docs/dev/theming"
    },
    {
      icon: Puzzle,
      title: "Building Apps",
      description: "Create new applications for the desktop. Window management, icons, and integration guides.",
      link: "/docs/dev/apps"
    },
    {
      icon: Terminal,
      title: "Terminal Commands",
      description: "Register custom terminal commands and scripts. Command API and execution context.",
      link: "/docs/dev/terminal"
    },
    {
      icon: Cpu,
      title: "System Bus API",
      description: "Inter-component communication using the SystemBus. Events, subscriptions, and messaging.",
      link: "/docs/dev/system-bus"
    },
    {
      icon: Package,
      title: "UUR Packages",
      description: "Create and publish packages to the Urbanshade User Repository. Packaging standards and submission.",
      link: "/docs/dev/uur"
    },
    {
      icon: GitBranch,
      title: "Contributing",
      description: "Contribute to UrbanShade OS development. Git workflow, code standards, and PR guidelines.",
      link: "/docs/dev/contributing"
    }
  ];

  const quickLinks = [
    { label: "GitHub Repository", url: "https://github.com", icon: GitBranch },
    { label: "Component Library", url: "/docs/dev/components", icon: Layers },
    { label: "API Reference", url: "/docs/def-dev/api", icon: Code }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center">
              <Code className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-teal-100">Developer Documentation</h1>
              <p className="text-xs text-teal-500/70">Build for UrbanShade OS</p>
            </div>
          </div>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm">
            <Zap className="w-4 h-4" />
            Developer Preview
          </div>
          
          <h2 className="text-4xl font-light text-white">
            Build for <span className="font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">UrbanShade OS</span>
          </h2>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Create applications, themes, terminal commands, and extensions. 
            Everything you need to extend the Urbanshade experience.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500/30 transition-all text-sm"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-800/50 to-cyan-500/10 border border-teal-500/20">
          <h3 className="text-lg font-bold text-teal-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Quick Start
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Clone the repo", desc: "Get the source code from GitHub" },
              { step: "2", title: "Install dependencies", desc: "Run npm install or bun install" },
              { step: "3", title: "Start developing", desc: "npm run dev to launch locally" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white">Documentation</h3>
          
          <div className="grid gap-4">
            {sections.map((section, index) => (
              <Link
                key={index}
                to={section.link}
                className="group flex items-center gap-4 p-5 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-teal-500/30 hover:bg-slate-800/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:border-teal-500/30 group-hover:bg-teal-500/10 transition-all">
                  <section.icon className="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white group-hover:text-teal-100 transition-colors">
                      {section.title}
                    </h4>
                    {section.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-medium">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Coming Soon Notice */}
        <section className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-amber-400 text-sm">
            <strong>Note:</strong> Developer documentation is actively being written. 
            Some sections may be incomplete or under construction. Check back soon for updates!
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-slate-800 space-y-4">
          <p className="text-sm text-slate-500">
            Need help? Join our community or check out the{" "}
            <Link to="/docs/def-dev" className="text-teal-400 hover:underline">DEF-DEV Console docs</Link>{" "}
            for debugging tools.
          </p>
          <Link to="/docs" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Documentation
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default DevDocsIndex;
