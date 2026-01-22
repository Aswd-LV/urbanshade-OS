import { ArrowLeft, Search, Rocket, Folder, Map, Terminal, Shield, Zap, Keyboard, HelpCircle, Package, Cpu, Bug, Code, Users, BookOpen, ChevronRight, Filter, X, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
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
  featured?: boolean;
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
      tags: ["Beginner", "Setup", "Guide", "Desktop", "Navigation"],
      accent: "cyan",
      featured: true
    },
    {
      icon: Folder,
      title: "Core Applications",
      description: "File Explorer, Notepad, Calculator — your standard OS toolkit.",
      link: "/docs/applications",
      tags: ["Apps", "Productivity", "System", "Guide", "Desktop"],
      accent: "blue",
      featured: true
    },
    {
      icon: Map,
      title: "Facility Applications",
      description: "Security cameras, containment monitors, and power grid management.",
      link: "/docs/facility",
      tags: ["Facility", "Security", "Infrastructure", "Advanced", "Roleplay"],
      accent: "purple"
    },
    {
      icon: Terminal,
      title: "Terminal Guide",
      description: "Command-line reference with all available commands and scripts.",
      link: "/docs/terminal",
      tags: ["Terminal", "Commands", "CLI", "Advanced", "Developer"],
      accent: "green",
      featured: true
    },
    {
      icon: Shield,
      title: "Admin Panel",
      description: "Secret access codes, visual effects, and chaos controls.",
      link: "/docs/admin-panel",
      tags: ["Admin", "Secret", "Effects", "Advanced", "Fun"],
      accent: "amber"
    },
    {
      icon: Zap,
      title: "Advanced Features",
      description: "BIOS settings, Recovery Mode, Safe Mode, and developer options.",
      link: "/docs/advanced",
      tags: ["Advanced", "BIOS", "Recovery", "Developer", "System"],
      accent: "orange"
    },
    {
      icon: Keyboard,
      title: "Keyboard Shortcuts",
      description: "All hotkeys and key combinations for power users.",
      link: "/docs/shortcuts",
      tags: ["Shortcuts", "Keyboard", "Hotkeys", "Productivity", "Guide"],
      accent: "teal",
      featured: true
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "FAQ and solutions for common issues and error codes.",
      link: "/docs/troubleshooting",
      tags: ["Help", "FAQ", "Errors", "Fixes", "Support"],
      accent: "red",
      featured: true
    },
    {
      icon: Package,
      title: "UUR Repository",
      description: "User-submitted packages, themes, and extensions.",
      link: "/docs/uur",
      tags: ["UUR", "Packages", "Themes", "Extensions", "Community"],
      accent: "indigo"
    },
    {
      icon: Cpu,
      title: "Features Overview",
      description: "Complete feature list and system capabilities.",
      link: "/docs/features",
      tags: ["Features", "Overview", "Capabilities", "Guide", "System"],
      accent: "pink"
    },
    // Developer Resources
    {
      icon: Bug,
      title: "DEF-DEV Console",
      description: "Real-time debugging, action logs, and system diagnostics.",
      link: "/docs/def-dev",
      tags: ["DEF-DEV", "Debug", "Developer", "Console", "Advanced"],
      accent: "amber",
      featured: true
    },
    {
      icon: Code,
      title: "Developer Docs",
      description: "API documentation, theming, and extension development.",
      link: "/docs/dev",
      tags: ["Developer", "API", "Theming", "Extensions", "Code"],
      accent: "emerald"
    },
    // Community & Safety
    {
      icon: Shield,
      title: "Safety Center",
      description: "User badges, account security, and reporting guidelines.",
      link: "/docs/safety",
      tags: ["Safety", "Security", "Badges", "Reporting", "Community"],
      accent: "green"
    },
    {
      icon: Users,
      title: "Moderation Guide",
      description: "Admin tools, user management, and NAVI AI monitoring.",
      link: "/docs/moderation",
      tags: ["Moderation", "Admin", "NAVI", "Management", "Staff"],
      accent: "red"
    }
  ];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach(article => article.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, []);

  // Featured articles (top 6)
  const featuredArticles = useMemo(() => 
    articles.filter(a => a.featured).slice(0, 6), 
  []);

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
    const colors: Record<string, { bg: string; border: string; text: string; iconBg: string; glow: string }> = {
      cyan: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", iconBg: "bg-cyan-500/10", glow: "shadow-cyan-500/20" },
      blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", iconBg: "bg-blue-500/10", glow: "shadow-blue-500/20" },
      purple: { bg: "bg-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", iconBg: "bg-purple-500/10", glow: "shadow-purple-500/20" },
      amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", iconBg: "bg-amber-500/10", glow: "shadow-amber-500/20" },
      orange: { bg: "bg-orange-500/5", border: "border-orange-500/20", text: "text-orange-400", iconBg: "bg-orange-500/10", glow: "shadow-orange-500/20" },
      red: { bg: "bg-red-500/5", border: "border-red-500/20", text: "text-red-400", iconBg: "bg-red-500/10", glow: "shadow-red-500/20" },
      green: { bg: "bg-green-500/5", border: "border-green-500/20", text: "text-green-400", iconBg: "bg-green-500/10", glow: "shadow-green-500/20" },
      teal: { bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal-400", iconBg: "bg-teal-500/10", glow: "shadow-teal-500/20" },
      emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", iconBg: "bg-emerald-500/10", glow: "shadow-emerald-500/20" },
      indigo: { bg: "bg-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400", iconBg: "bg-indigo-500/10", glow: "shadow-indigo-500/20" },
      pink: { bg: "bg-pink-500/5", border: "border-pink-500/20", text: "text-pink-400", iconBg: "bg-pink-500/10", glow: "shadow-pink-500/20" }
    };
    return colors[accent] || colors.cyan;
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  return (
    <>
      <SEO
        title="Documentation"
        description="Complete documentation for Urbanshade OS - a browser-based operating system simulation with terminal, apps, and developer tools. Learn installation, features, and troubleshooting."
        path="/docs"
        keywords={["urbanshade documentation", "os simulation guide", "browser os tutorial", "terminal commands", "desktop environment"]}
      />
      <div className="min-h-screen bg-black text-white">
        {/* Subtle gradient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/favicon.svg" alt="UrbanShade" className="w-9 h-9" />
                <div className="absolute -inset-1 bg-white/10 blur-md rounded-full -z-10 group-hover:bg-white/20 transition-colors" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">URBANSHADE OS</h1>
                <p className="text-xs text-gray-500 font-mono">Documentation v{VERSION.shortVersion}</p>
              </div>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to App
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-16">
          {/* Hero */}
          <section className="text-center space-y-6">
            <div className="relative inline-block">
              <img src="/favicon.svg" alt="UrbanShade" className="w-20 h-20 mx-auto" />
              <div className="absolute -inset-6 bg-white/5 blur-3xl rounded-full -z-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white">
                Documentation
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
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
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 text-gray-400">
                  <stat.icon className="w-4 h-4 text-white" />
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Articles */}
          {!hasActiveFilters && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Featured</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featuredArticles.map((article) => {
                  const colors = getAccentClasses(article.accent);
                  return (
                    <Link
                      key={article.link}
                      to={article.link}
                      className={`group p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-lg ${colors.iconBg} border ${colors.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <article.icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{article.title}</h4>
                            <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Search and Filter */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-bold text-white">Browse All</h3>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-all"
              />
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-gray-600 text-sm">
                <Filter className="w-4 h-4" />
                Filter:
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
            {hasActiveFilters && (
              <div className="text-sm text-gray-500">
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
              <div className="grid gap-3 md:grid-cols-2">
                {filteredArticles.map((article) => {
                  const colors = getAccentClasses(article.accent);
                  return (
                    <Link
                      key={article.link}
                      to={article.link}
                      className="group p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center gap-4"
                    >
                      <div className={`w-10 h-10 rounded-lg ${colors.iconBg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                        <article.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white">{article.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{article.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {article.tags.slice(0, 2).map((tag) => (
                          <DocTag key={tag} tag={tag} size="sm" />
                        ))}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500">No articles found matching your search.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* Quick Reference */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Quick Reference</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: "DEL", label: "Access BIOS", desc: "Press during boot" },
                { key: "F2", label: "Recovery Mode", desc: "Press during boot" },
                { key: "Shift+/", label: "Global Search", desc: "Search anything" },
                { key: "Shift+Esc", label: "Task Manager", desc: "View processes" },
                { key: "Shift+E", label: "File Explorer", desc: "Browse files" },
                { key: "Shift+T", label: "Terminal", desc: "Command line" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                  <kbd className="px-2 py-1 rounded bg-white/10 text-white text-xs font-mono border border-white/10">
                    {item.key}
                  </kbd>
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-12 border-t border-white/10 text-center">
            <p className="text-gray-600 text-sm">
              UrbanShade OS Documentation • Built with 🖥️ at depth 8,247m
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-600">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Docs;