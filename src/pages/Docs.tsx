import { ArrowLeft, Terminal, Rocket, Folder, Map, Keyboard, HelpCircle, Zap, Shield, Bug, Code, ChevronRight, Waves, Search, Package, BookOpen, Cpu, ExternalLink, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SupabaseConnectivityChecker from "@/components/SupabaseConnectivityChecker";
import { VERSION } from "@/lib/versionInfo";
import SEO from "@/components/SEO";

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "First boot? Start here. Learn how to navigate the facility and stay alive.",
      link: "/docs/getting-started",
      accent: "cyan",
      keywords: ["install", "setup", "begin", "start", "new"]
    },
    {
      icon: Folder,
      title: "Core Applications",
      description: "File Explorer, Notepad, Calculator — your standard OS toolkit.",
      link: "/docs/applications",
      accent: "blue",
      keywords: ["apps", "programs", "software", "tools"]
    },
    {
      icon: Map,
      title: "Facility Applications",
      description: "Security cameras, containment monitors, and power grid management.",
      link: "/docs/facility",
      accent: "purple",
      keywords: ["security", "cameras", "containment", "power"]
    },
    {
      icon: Terminal,
      title: "Terminal Guide",
      description: "Command-line reference with all available commands and scripts.",
      link: "/docs/terminal",
      accent: "cyan",
      keywords: ["command", "cli", "shell", "bash"]
    },
    {
      icon: Shield,
      title: "Admin Panel",
      description: "Secret access codes, visual effects, and system controls.",
      link: "/docs/admin-panel",
      accent: "purple",
      keywords: ["admin", "secret", "control", "effects"]
    },
    {
      icon: Zap,
      title: "Advanced Features",
      description: "BIOS settings, Recovery Mode, Safe Mode, and developer options.",
      link: "/docs/advanced",
      accent: "amber",
      keywords: ["bios", "recovery", "safe", "developer"]
    },
    {
      icon: Keyboard,
      title: "Keyboard Shortcuts",
      description: "All hotkeys and key combinations for power users.",
      link: "/docs/shortcuts",
      accent: "orange",
      keywords: ["keys", "hotkeys", "shortcuts", "bindings"]
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "FAQ and solutions for common issues and error codes.",
      link: "/docs/troubleshooting",
      accent: "red",
      keywords: ["help", "fix", "error", "problem", "faq"]
    },
    {
      icon: Package,
      title: "UUR Repository",
      description: "User-submitted packages, themes, and extensions.",
      link: "/docs/uur",
      accent: "indigo",
      keywords: ["packages", "extensions", "themes", "repository"]
    },
    {
      icon: Cpu,
      title: "Features Overview",
      description: "Complete feature list and system capabilities.",
      link: "/docs/features",
      accent: "pink",
      keywords: ["features", "capabilities", "overview"]
    }
  ];

  const devSections = [
    {
      icon: Bug,
      title: "DEF-DEV Console",
      description: "Real-time debugging, action logs, and system diagnostics.",
      link: "/docs/def-dev",
      accent: "amber",
      keywords: ["debug", "console", "logs", "diagnostics"]
    },
    {
      icon: Code,
      title: "Developer Docs",
      description: "API documentation, theming, and extension development.",
      link: "/docs/dev",
      accent: "teal",
      keywords: ["api", "dev", "code", "extension"]
    }
  ];

  const communitySections = [
    {
      icon: Shield,
      title: "Safety Center",
      description: "User badges, account security, and reporting guidelines.",
      link: "/docs/safety",
      accent: "green",
      keywords: ["safety", "badges", "report", "trust"]
    },
    {
      icon: Users,
      title: "Moderation Guide",
      description: "Admin tools, user management, and NAVI AI monitoring.",
      link: "/docs/moderation",
      accent: "red",
      keywords: ["moderation", "admin", "ban", "navi"]
    }
  ];

  const getAccentClasses = (accent: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; glow: string; iconBg: string }> = {
      cyan: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", glow: "hover:shadow-cyan-500/10", iconBg: "bg-cyan-500/10" },
      blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", glow: "hover:shadow-blue-500/10", iconBg: "bg-blue-500/10" },
      purple: { bg: "bg-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", glow: "hover:shadow-purple-500/10", iconBg: "bg-purple-500/10" },
      amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", glow: "hover:shadow-amber-500/10", iconBg: "bg-amber-500/10" },
      orange: { bg: "bg-orange-500/5", border: "border-orange-500/20", text: "text-orange-400", glow: "hover:shadow-orange-500/10", iconBg: "bg-orange-500/10" },
      red: { bg: "bg-red-500/5", border: "border-red-500/20", text: "text-red-400", glow: "hover:shadow-red-500/10", iconBg: "bg-red-500/10" },
      green: { bg: "bg-green-500/5", border: "border-green-500/20", text: "text-green-400", glow: "hover:shadow-green-500/10", iconBg: "bg-green-500/10" },
      teal: { bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal-400", glow: "hover:shadow-teal-500/10", iconBg: "bg-teal-500/10" },
      indigo: { bg: "bg-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400", glow: "hover:shadow-indigo-500/10", iconBg: "bg-indigo-500/10" },
      pink: { bg: "bg-pink-500/5", border: "border-pink-500/20", text: "text-pink-400", glow: "hover:shadow-pink-500/10", iconBg: "bg-pink-500/10" }
    };
    return colors[accent] || colors.cyan;
  };

  const filterSections = (items: typeof sections) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.keywords.some((k) => k.includes(query))
    );
  };

  const filteredMain = filterSections(sections);
  const filteredDev = filterSections(devSections);
  const filteredCommunity = filterSections(communitySections);

  const renderSection = (section: typeof sections[0]) => {
    const colors = getAccentClasses(section.accent);
    return (
      <Link
        key={section.link}
        to={section.link}
        className={`group p-5 rounded-xl ${colors.bg} border ${colors.border} hover:border-opacity-60 ${colors.glow} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <section.icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold ${colors.text}`}>{section.title}</h4>
              <ChevronRight className={`w-4 h-4 ${colors.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
            </div>
            <p className="text-sm text-slate-400 mt-1">{section.description}</p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <SEO
        title="Documentation"
        description="Complete documentation for Urbanshade OS - a browser-based operating system simulation with terminal, apps, and developer tools. Learn installation, features, and troubleshooting."
        path="/docs"
        keywords={["urbanshade documentation", "os simulation guide", "browser os tutorial", "terminal commands", "desktop environment"]}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
        {/* Ambient background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/favicon.svg" alt="UrbanShade" className="w-9 h-9" />
                <div className="absolute -inset-1 bg-cyan-500/20 blur-md rounded-full -z-10 group-hover:bg-cyan-500/30 transition-colors" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">URBANSHADE OS</h1>
                <p className="text-xs text-slate-500 font-mono">Documentation v{VERSION.shortVersion}</p>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                />
              </div>
            </div>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to App
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-20">
          {/* Hero */}
          <section className="text-center space-y-8">
            <div className="relative inline-block">
              <img src="/favicon.svg" alt="UrbanShade" className="w-24 h-24 mx-auto" />
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-3xl rounded-full -z-10" />
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  URBANSHADE OS
                </span>
                <span className="text-slate-300 font-light"> Documentation</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Your complete guide to navigating the depths. From first boot to advanced configuration, 
                we've got you covered.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                { icon: BookOpen, label: `${sections.length + devSections.length + communitySections.length} Guides` },
                { icon: Terminal, label: "50+ Commands" },
                { icon: Keyboard, label: "30+ Shortcuts" },
                { icon: Package, label: "UUR Packages" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
                  <stat.icon className="w-4 h-4 text-cyan-400" />
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Start Banner */}
          <Link
            to="/docs/getting-started"
            className="block p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-cyan-400">New to Urbanshade?</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Start with our Getting Started guide to learn the basics and set up your facility.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          {/* Main Documentation */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-slate-200">User Guides</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
            </div>

            {filteredMain.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredMain.map(renderSection)}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No guides found matching "{searchQuery}"</p>
            )}
          </section>

          {/* Developer Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-slate-200">Developer Resources</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
            </div>

            {filteredDev.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredDev.map(renderSection)}
              </div>
            ) : searchQuery && (
              <p className="text-slate-500 text-center py-4">No developer docs found</p>
            )}
          </section>

          {/* Community & Safety */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-bold text-slate-200">Community & Safety</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-green-500/20 to-transparent" />
            </div>

            {filteredCommunity.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredCommunity.map(renderSection)}
              </div>
            ) : searchQuery && (
              <p className="text-slate-500 text-center py-4">No community docs found</p>
            )}
          </section>

          {/* Quick Tips */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-200 text-center">Quick Reference</h3>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { key: "DEL", label: "Access BIOS", desc: "Press during boot" },
                { key: "F2", label: "Recovery Mode", desc: "Emergency access" },
                { key: "F3", label: "Boot Select", desc: "Choose boot device" },
                { key: "secret", label: "Admin Panel", desc: "Type in Terminal" },
                { key: "Ctrl+Shift+D", label: "DEF-DEV", desc: "Debug console" },
                { key: "Win+Tab", label: "Task View", desc: "Window overview" }
              ].map((tip) => (
                <div key={tip.key} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center space-y-2 hover:border-cyan-500/30 transition-colors">
                  <kbd className="inline-block px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-600 text-cyan-400 text-sm font-mono">
                    {tip.key}
                  </kbd>
                  <div className="text-slate-200 font-medium">{tip.label}</div>
                  <div className="text-xs text-slate-500">{tip.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* External Links */}
          <section className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/urbanshade"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub Repository
            </a>
            <Link
              to="/team"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors text-sm"
            >
              <Users className="w-4 h-4" />
              Meet the Team
            </Link>
            <Link
              to="/status"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors text-sm"
            >
              <Waves className="w-4 h-4" />
              System Status
            </Link>
          </section>

          {/* Footer */}
          <footer className="text-center pt-12 border-t border-slate-800/50 space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-slate-500">URBANSHADE OS Documentation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span className="text-cyan-500/70 font-mono">v{VERSION.shortVersion}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span className="text-slate-500">© 2025 Urbanshade Corporation</span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              This is a fictional simulation for entertainment purposes. All facility data is procedurally generated.
            </p>
          </footer>
        </main>

        <SupabaseConnectivityChecker currentRoute="docs" />
      </div>
    </>
  );
};

export default Docs;
