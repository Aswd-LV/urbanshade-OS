import { ArrowLeft, Search, Rocket, Folder, Map, Terminal, Shield, Zap, Keyboard, HelpCircle, Package, Cpu, Bug, Code, Users, BookOpen, ChevronRight, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import SupabaseConnectivityChecker from "@/components/SupabaseConnectivityChecker";
import { VERSION } from "@/lib/versionInfo";
import SEO from "@/components/SEO";
import { DocTag } from "@/components/docs";

interface DocArticle {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  tags: string[];
  accent: string;
}

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // All documentation articles with 5 tags each
  const articles: DocArticle[] = [
    // User Guides
    {
      icon: Rocket,
      title: "Getting Started",
      description: "First boot? Start here. Learn how to navigate the facility and stay alive.",
      link: "/docs/getting-started",
      tags: ["Getting-Started", "Apps", "Terminal", "Security", "Advanced"],
      accent: "cyan"
    },
    {
      icon: Folder,
      title: "Core Applications",
      description: "File Explorer, Notepad, Calculator — your standard OS toolkit.",
      link: "/docs/applications",
      tags: ["Apps", "Getting-Started", "Terminal", "Developer", "Advanced"],
      accent: "blue"
    },
    {
      icon: Map,
      title: "Facility Applications",
      description: "Security cameras, containment monitors, and power grid management.",
      link: "/docs/facility",
      tags: ["Apps", "Security", "Advanced", "Getting-Started", "Moderation"],
      accent: "purple"
    },
    {
      icon: Terminal,
      title: "Terminal Guide",
      description: "Command-line reference with all available commands and scripts.",
      link: "/docs/terminal",
      tags: ["Terminal", "Developer", "Advanced", "Apps", "DefDev"],
      accent: "cyan"
    },
    {
      icon: Shield,
      title: "Admin Panel",
      description: "Secret access codes, visual effects, and system controls.",
      link: "/docs/admin-panel",
      tags: ["Advanced", "Developer", "Security", "Moderation", "DefDev"],
      accent: "purple"
    },
    {
      icon: Zap,
      title: "Advanced Features",
      description: "BIOS settings, Recovery Mode, Safe Mode, and developer options.",
      link: "/docs/advanced",
      tags: ["Advanced", "Developer", "Terminal", "DefDev", "Getting-Started"],
      accent: "amber"
    },
    {
      icon: Keyboard,
      title: "Keyboard Shortcuts",
      description: "All hotkeys and key combinations for power users.",
      link: "/docs/shortcuts",
      tags: ["Getting-Started", "Apps", "Advanced", "Terminal", "Developer"],
      accent: "orange"
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "FAQ and solutions for common issues and error codes.",
      link: "/docs/troubleshooting",
      tags: ["Getting-Started", "Advanced", "Security", "Apps", "Terminal"],
      accent: "red"
    },
    {
      icon: Package,
      title: "UUR Repository",
      description: "User-submitted packages, themes, and extensions.",
      link: "/docs/uur",
      tags: ["UUR", "Developer", "Apps", "Advanced", "Getting-Started"],
      accent: "indigo"
    },
    {
      icon: Cpu,
      title: "Features Overview",
      description: "Complete feature list and system capabilities.",
      link: "/docs/features",
      tags: ["Getting-Started", "Apps", "Advanced", "Developer", "Security"],
      accent: "pink"
    },
    // Developer Resources
    {
      icon: Bug,
      title: "DEF-DEV Console",
      description: "Real-time debugging, action logs, and system diagnostics.",
      link: "/docs/def-dev",
      tags: ["DefDev", "Developer", "Advanced", "Terminal", "Apps"],
      accent: "amber"
    },
    {
      icon: Code,
      title: "Developer Docs",
      description: "API documentation, theming, and extension development.",
      link: "/docs/dev",
      tags: ["Developer", "DefDev", "Advanced", "UUR", "Apps"],
      accent: "teal"
    },
    // Community & Safety
    {
      icon: Shield,
      title: "Safety Center",
      description: "User badges, account security, and reporting guidelines.",
      link: "/docs/safety",
      tags: ["Safety", "Security", "Moderation", "Getting-Started", "Advanced"],
      accent: "green"
    },
    {
      icon: Users,
      title: "Moderation Guide",
      description: "Admin tools, user management, and NAVI AI monitoring.",
      link: "/docs/moderation",
      tags: ["Moderation", "Security", "Safety", "Advanced", "Developer"],
      accent: "red"
    }
  ];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach(article => article.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, []);

  // Filter articles by search query and selected tags
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query));
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => article.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, articles]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const getAccentClasses = (accent: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
      cyan: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", iconBg: "bg-cyan-500/10" },
      blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", iconBg: "bg-blue-500/10" },
      purple: { bg: "bg-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", iconBg: "bg-purple-500/10" },
      amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", iconBg: "bg-amber-500/10" },
      orange: { bg: "bg-orange-500/5", border: "border-orange-500/20", text: "text-orange-400", iconBg: "bg-orange-500/10" },
      red: { bg: "bg-red-500/5", border: "border-red-500/20", text: "text-red-400", iconBg: "bg-red-500/10" },
      green: { bg: "bg-green-500/5", border: "border-green-500/20", text: "text-green-400", iconBg: "bg-green-500/10" },
      teal: { bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal-400", iconBg: "bg-teal-500/10" },
      indigo: { bg: "bg-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400", iconBg: "bg-indigo-500/10" },
      pink: { bg: "bg-pink-500/5", border: "border-pink-500/20", text: "text-pink-400", iconBg: "bg-pink-500/10" }
    };
    return colors[accent] || colors.cyan;
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
        <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
          {/* Hero */}
          <section className="text-center space-y-6">
            <div className="relative inline-block">
              <img src="/favicon.svg" alt="UrbanShade" className="w-20 h-20 mx-auto" />
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-3xl rounded-full -z-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Documentation
                </span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Search articles by name or filter by tags to find what you need.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                { icon: BookOpen, label: `${articles.length} Articles` },
                { icon: Terminal, label: "50+ Commands" },
                { icon: Keyboard, label: "30+ Shortcuts" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
                  <stat.icon className="w-4 h-4 text-cyan-400" />
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Search and Filter */}
          <section className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500 text-sm">
                <Filter className="w-4 h-4" />
                Filter by:
              </div>
              {allTags.map((tag) => (
                <DocTag
                  key={tag}
                  tag={tag}
                  active={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                  size="md"
                />
              ))}
            </div>

            {/* Active filters indicator */}
            {(searchQuery || selectedTags.length > 0) && (
              <div className="text-center text-sm text-slate-500">
                Showing {filteredArticles.length} of {articles.length} articles
                {selectedTags.length > 0 && (
                  <span> • Filtered by: {selectedTags.join(", ")}</span>
                )}
              </div>
            )}
          </section>

          {/* Articles Grid */}
          <section className="space-y-6">
            {filteredArticles.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => {
                  const colors = getAccentClasses(article.accent);
                  return (
                    <Link
                      key={article.link}
                      to={article.link}
                      className={`group p-5 rounded-xl ${colors.bg} border ${colors.border} hover:border-opacity-60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <article.icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${colors.text}`}>{article.title}</h4>
                            <ChevronRight className={`w-4 h-4 ${colors.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                          </div>
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{article.description}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {article.tags.slice(0, 3).map((tag) => (
                              <DocTag key={tag} tag={tag} size="sm" />
                            ))}
                            {article.tags.length > 3 && (
                              <span className="px-2 py-0.5 text-xs text-slate-500">+{article.tags.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No articles found matching your search.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
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

          {/* Quick Reference */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-200 text-center">Quick Reference</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: "DEL", label: "Access BIOS", desc: "Press during boot" },
                { key: "F2", label: "Recovery Mode", desc: "Emergency access" },
                { key: "secret", label: "Admin Panel", desc: "Type in Terminal" },
                { key: "Ctrl+Shift+D", label: "DEF-DEV", desc: "Debug console" },
                { key: "Win+Tab", label: "Task View", desc: "Window overview" },
                { key: "Alt+F4", label: "Close Window", desc: "Quick close" }
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

          {/* Footer */}
          <footer className="text-center text-sm text-slate-500 pt-8 border-t border-slate-800">
            <p>UrbanShade OS Documentation • Version {VERSION.displayVersion}</p>
            <p className="mt-2">
              Need help? Check out <Link to="/docs/troubleshooting" className="text-cyan-400 hover:underline">Troubleshooting</Link> or{" "}
              <Link to="/support" className="text-cyan-400 hover:underline">Contact Support</Link>
            </p>
          </footer>
        </main>

        <SupabaseConnectivityChecker currentRoute="docs" />
      </div>
    </>
  );
};

export default Docs;