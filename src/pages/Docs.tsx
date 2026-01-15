import { ArrowLeft, Terminal, Rocket, Folder, Map, Keyboard, HelpCircle, Zap, Shield, Bug, BookOpen, Cpu, Package, Code, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { DocSearch } from "@/components/DocSearch";
import SupabaseConnectivityChecker from "@/components/SupabaseConnectivityChecker";
import { VERSION } from "@/lib/versionInfo";
import { UrbanshadeSpinner } from "@/components/shared/UrbanshadeSpinner";

const Docs = () => {
  const sections = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "New to the facility? Start here! Learn the ropes before something inevitably goes wrong.",
      link: "/docs/getting-started",
      accent: "cyan"
    },
    {
      icon: Folder,
      title: "Core Applications",
      description: "Your digital toolbox: File Explorer, Notepad, Calculator, and other apps you'll pretend to use productively.",
      link: "/docs/applications",
      accent: "blue"
    },
    {
      icon: Map,
      title: "Facility Applications",
      description: "Security cameras, containment monitors, and apps for managing your totally-not-haunted underwater base.",
      link: "/docs/facility",
      accent: "purple"
    },
    {
      icon: Terminal,
      title: "Terminal Guide",
      description: "Feel like a movie hacker with our command line interface. Authentic typing sounds not included.",
      link: "/docs/terminal",
      accent: "cyan"
    },
    {
      icon: Shield,
      title: "Admin Panel",
      description: "The control panel for chaos enthusiasts. Warning: May cause uncontrollable power trips.",
      link: "/docs/admin-panel",
      accent: "purple"
    },
    {
      icon: Zap,
      title: "Advanced Features",
      description: "BIOS, Recovery Mode, and other ways to pretend you're a systems engineer.",
      link: "/docs/advanced",
      accent: "amber"
    },
    {
      icon: Keyboard,
      title: "Keyboard Shortcuts",
      description: "Learn all the key combos because real pros don't use mice.",
      link: "/docs/shortcuts",
      accent: "orange"
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "When things go wrong (and they will). From 'I forgot my password' to 'Why is everything rainbow?'",
      link: "/docs/troubleshooting",
      accent: "red"
    },
    {
      icon: Bug,
      title: "DEF-DEV Console",
      description: "Developer debugging tool. Real-time logging, action monitoring, and system debugging.",
      link: "/docs/def-dev",
      accent: "amber"
    },
    {
      icon: Shield,
      title: "Safety & Badges",
      description: "Stay safe online! Learn about user badges, how to spot scammers, and report rule breakers.",
      link: "/docs/safety",
      accent: "green"
    },
    {
      icon: Code,
      title: "Developer Docs",
      description: "Build extensions, themes, and integrations for UrbanShade OS. Full API documentation included.",
      link: "/docs/dev",
      accent: "teal"
    }
  ];

  const getAccentClasses = (accent: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
      blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
      amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
      orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", glow: "shadow-orange-500/20" },
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", glow: "shadow-red-500/20" },
      green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", glow: "shadow-green-500/20" },
      teal: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400", glow: "shadow-teal-500/20" }
    };
    return colors[accent] || colors.cyan;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="UrbanShade" className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold text-cyan-100">URBANSHADE OS</h1>
              <p className="text-xs text-cyan-500/70">Documentation Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DocSearch />
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-8">
          <div className="relative inline-flex flex-col items-center gap-6">
            <div className="relative">
              <img src="/favicon.svg" alt="UrbanShade" className="w-24 h-24" />
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-2xl rounded-full -z-10" />
            </div>
            <UrbanshadeSpinner size="lg" className="opacity-80" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-light text-white">
              Welcome to <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">URBANSHADE OS</span>
            </h2>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The only operating system designed for managing fictional underwater research facilities. 
              Now with 100% fewer actual containment breaches than the real thing! 🐙
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { emoji: "🌊", text: "Depth: 8,247m Below Sea Level" },
              { emoji: "🔬", text: "100% Fictional" },
              { emoji: "🎮", text: "0% Actual OS Functionality" },
              { emoji: "☕", text: "Powered by Too Much Coffee" }
            ].map((badge, i) => (
              <span 
                key={i}
                className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300"
              >
                {badge.emoji} {badge.text}
              </span>
            ))}
          </div>
        </section>

        {/* What is this */}
        <section className="relative p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-slate-800/50 to-blue-600/10 border border-cyan-500/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full" />
          <div className="relative space-y-4">
            <h3 className="text-2xl font-bold text-cyan-100">So, what exactly is this thing?</h3>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                <strong className="text-white">URBANSHADE OS</strong> is a web-based simulation of a 
                retro-futuristic operating system, lovingly <em>inspired by</em> the game Pressure. 
                It's like playing pretend, but with more terminal commands and fewer real consequences.
              </p>
              <p>
                Everything runs in your browser. Your "files" aren't real files. 
                Your "passwords" are stored in localStorage (<strong className="text-amber-400">please don't use real passwords</strong>). 
                The containment units contain nothing but your imagination and some JSON data.
              </p>
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-cyan-100 font-medium">
                  <strong>TL;DR:</strong> It's a fun, interactive experience that lets you roleplay as an underwater 
                  facility operator. Click things, explore, break stuff, fix stuff! 🐙✨
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Choose Your Adventure</h3>
            <p className="text-slate-400">Pick a topic and dive in. Get it? Dive? Because we're underwater? 🤿</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section, index) => {
              const colors = getAccentClasses(section.accent);
              return (
                <Link
                  key={index}
                  to={section.link}
                  className={`group p-5 rounded-xl ${colors.bg} border ${colors.border} hover:shadow-xl ${colors.glow} transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <section.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${colors.text}`}>
                          {section.title}
                        </h4>
                        <ChevronRight className={`w-4 h-4 ${colors.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                      </div>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white text-center">Quick Tips for New Recruits</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { emoji: "🔑", key: "DEL", text: "Press during boot to access BIOS. On Chromebook? Just type 'del'." },
              { emoji: "🔄", key: "F2", text: "Press during boot for Recovery Mode. For when things go REALLY wrong." },
              { emoji: "🤫", key: "secret", text: "Type in Terminal for admin access. Shh, it's a secret. (Not really.)" }
            ].map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center space-y-2">
                <div className="text-2xl">{tip.emoji}</div>
                <kbd className="inline-block px-3 py-1 bg-slate-900 rounded-lg border border-slate-600 text-cyan-400 text-sm font-mono">
                  {tip.key}
                </kbd>
                <p className="text-sm text-slate-400">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-slate-500">URBANSHADE OS Documentation</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-cyan-500/70">v{VERSION.shortVersion}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-slate-500">© 2025 Urbanshade Corporation</span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            This is a fictional simulation for entertainment purposes. No actual deep-sea facilities 
            were harmed in the making of this software. 🐙
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Return to Simulation
          </Link>
        </footer>
      </main>
      <SupabaseConnectivityChecker currentRoute="docs" />
    </div>
  );
};

export default Docs;
