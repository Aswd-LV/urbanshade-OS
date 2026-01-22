import { Code, Palette, Puzzle, Terminal, BookOpen, Zap, ChevronRight, Layers, Cpu, GitBranch, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { DocLayout, DocHero, DocSection, DocAlert } from "@/components/docs";

const DevDocsIndex = () => {
  const sections = [
    { icon: Layers, title: "Architecture Overview", description: "Component hierarchy, state management, and data flow.", link: "/docs/dev/architecture", badge: "Start Here" },
    { icon: Palette, title: "Theming & Styling", description: "Create custom themes and use design tokens.", link: "/docs/dev/theming" },
    { icon: Puzzle, title: "Building Apps", description: "Create new desktop applications.", link: "/docs/dev/apps" },
    { icon: Terminal, title: "Terminal Commands", description: "Register custom terminal commands.", link: "/docs/dev/terminal" },
    { icon: Cpu, title: "System Bus API", description: "Inter-component communication.", link: "/docs/dev/system-bus" },
    { icon: Package, title: "UUR Packages", description: "Create and publish packages.", link: "/docs/dev/uur" },
    { icon: GitBranch, title: "Contributing", description: "Git workflow and PR guidelines.", link: "/docs/dev/contributing" }
  ];

  return (
    <DocLayout
      title="Developer Docs"
      description="Build extensions, themes, and apps for Urbanshade OS. Architecture, theming, and API documentation."
      accentColor="teal"
      keywords={["developer", "api", "theming", "apps", "extensions"]}
      prevPage={{ title: "DEF-DEV Console", path: "/docs/def-dev" }}
    >
      <DocHero
        icon={Code}
        title="Developer Documentation"
        subtitle="Create applications, themes, terminal commands, and extensions. Everything you need to extend the Urbanshade experience."
        accentColor="teal"
      />

      {/* Quick Start */}
      <DocSection title="Quick Start" icon={BookOpen} accentColor="teal">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Clone the repo", desc: "Get the source code from GitHub" },
            { step: "2", title: "Install dependencies", desc: "Run npm install or bun install" },
            { step: "3", title: "Start developing", desc: "npm run dev to launch locally" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-medium text-slate-200 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* Documentation Sections */}
      <DocSection title="Documentation" icon={Zap} accentColor="teal">
        <div className="space-y-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.link}
              className="group flex items-center gap-4 p-5 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-teal-500/30 hover:bg-slate-800/50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:border-teal-500/30 group-hover:bg-teal-500/10 transition-all">
                <section.icon className="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-200 group-hover:text-teal-100 transition-colors">
                    {section.title}
                  </h4>
                  {section.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-medium">
                      {section.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <DocAlert variant="info" title="Work in Progress">
          Developer documentation is actively being written. Some sections may be incomplete. Check back soon for updates!
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default DevDocsIndex;