import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import SEO from "@/components/SEO";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface DocLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  accentColor?: "cyan" | "amber" | "teal" | "green" | "purple" | "red" | "blue";
  keywords?: string[];
  prevPage?: { title: string; path: string };
  nextPage?: { title: string; path: string };
}

const accentStyles = {
  cyan: {
    gradient: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    glow: "shadow-cyan-500/20",
    headerGradient: "from-cyan-400 to-blue-500",
  },
  amber: {
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/20",
    headerGradient: "from-amber-400 to-orange-500",
  },
  teal: {
    gradient: "from-teal-500/20 to-emerald-500/20",
    border: "border-teal-500/30",
    text: "text-teal-400",
    bg: "bg-teal-500/10",
    glow: "shadow-teal-500/20",
    headerGradient: "from-teal-400 to-emerald-500",
  },
  green: {
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
    bg: "bg-green-500/10",
    glow: "shadow-green-500/20",
    headerGradient: "from-green-400 to-emerald-500",
  },
  purple: {
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    glow: "shadow-purple-500/20",
    headerGradient: "from-purple-400 to-pink-500",
  },
  red: {
    gradient: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
    bg: "bg-red-500/10",
    glow: "shadow-red-500/20",
    headerGradient: "from-red-400 to-rose-500",
  },
  blue: {
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    glow: "shadow-blue-500/20",
    headerGradient: "from-blue-400 to-indigo-500",
  },
};

const DocLayout = ({
  children,
  title,
  description,
  breadcrumbs = [],
  accentColor = "cyan",
  keywords = [],
  prevPage,
  nextPage,
}: DocLayoutProps) => {
  const location = useLocation();
  const accent = accentStyles[accentColor];

  const allBreadcrumbs: BreadcrumbItem[] = [
    { label: "Docs", path: "/docs" },
    ...breadcrumbs,
    { label: title },
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={location.pathname}
        keywords={keywords}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
        {/* Ambient background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br ${accent.gradient} rounded-full blur-3xl opacity-30`}
          />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-slate-800/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className={`sticky top-0 z-50 border-b ${accent.border} bg-slate-950/90 backdrop-blur-xl`}>
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm">
                <Link
                  to="/docs"
                  className={`${accent.text} hover:opacity-80 transition-opacity`}
                >
                  <Home className="w-4 h-4" />
                </Link>
                {allBreadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    {crumb.path ? (
                      <Link
                        to={crumb.path}
                        className={`${accent.text} hover:opacity-80 transition-opacity`}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-slate-400">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>

              {/* Back button */}
              <Link
                to="/docs"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${accent.bg} border ${accent.border} ${accent.text} hover:opacity-80 transition-all text-sm font-medium group`}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Docs
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          {children}
        </main>

        {/* Prev/Next navigation */}
        {(prevPage || nextPage) && (
          <footer className="relative z-10 max-w-5xl mx-auto px-6 pb-12">
            <div className={`flex items-center justify-between pt-8 border-t ${accent.border}`}>
              {prevPage ? (
                <Link
                  to={prevPage.path}
                  className={`group flex items-center gap-3 px-5 py-3 rounded-xl ${accent.bg} border ${accent.border} hover:${accent.glow} hover:shadow-lg transition-all`}
                >
                  <ArrowLeft className={`w-4 h-4 ${accent.text} group-hover:-translate-x-1 transition-transform`} />
                  <div className="text-left">
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Previous</div>
                    <div className={`font-medium ${accent.text}`}>{prevPage.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextPage && (
                <Link
                  to={nextPage.path}
                  className={`group flex items-center gap-3 px-5 py-3 rounded-xl ${accent.bg} border ${accent.border} hover:${accent.glow} hover:shadow-lg transition-all`}
                >
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Next</div>
                    <div className={`font-medium ${accent.text}`}>{nextPage.title}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${accent.text} group-hover:translate-x-1 transition-transform`} />
                </Link>
              )}
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default DocLayout;
