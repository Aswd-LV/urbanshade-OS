import { ArrowLeft, Shield, BookOpen, Eye, Zap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Moderation = () => {
  const sections = [
    {
      title: "Overview",
      description: "Getting started with the moderation panel, user management, and quick actions.",
      icon: BookOpen,
      color: "red",
      path: "/docs/moderation/overview"
    },
    {
      title: "NAVI Monitor",
      description: "Real-time insights into NAVI bot activity, message filtering, and lockout events.",
      icon: Eye,
      color: "cyan",
      path: "/docs/moderation/navi"
    },
    {
      title: "Actions",
      description: "Detailed guide on warnings, bans, VIP grants, and other moderation actions.",
      icon: Zap,
      color: "amber",
      path: "/docs/moderation/actions"
    },
    {
      title: "Statistics",
      description: "Analytics dashboard with user growth, moderation metrics, and activity heatmaps.",
      icon: BarChart3,
      color: "blue",
      path: "/docs/moderation/stats"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string; glow: string }> = {
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "text-red-400", glow: "group-hover:shadow-red-500/20" },
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400", glow: "group-hover:shadow-cyan-500/20" },
      amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "text-amber-400", glow: "group-hover:shadow-amber-500/20" },
      blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: "text-blue-400", glow: "group-hover:shadow-blue-500/20" }
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-red-400">Moderation Guide</h1>
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
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-4xl font-bold text-slate-100">Moderation Panel Guide</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A comprehensive guide for admins on how to use the moderation panel effectively. 
            This is an internal document - handle with care.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <Shield className="w-4 h-4" />
            Admin Access Required
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const colors = getColorClasses(section.color);
            const Icon = section.icon;
            
            return (
              <Link
                key={section.path}
                to={section.path}
                className={`group p-6 rounded-xl ${colors.bg} border ${colors.border} hover:scale-105 transition-all duration-300 ${colors.glow} hover:shadow-xl`}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <h3 className={`text-xl font-bold ${colors.text} mb-2`}>{section.title}</h3>
                <p className="text-sm text-slate-400">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Moderation;