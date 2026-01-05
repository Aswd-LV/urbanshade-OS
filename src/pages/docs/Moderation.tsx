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
      path: "/docs/moderation/navi-monitor"
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
      path: "/docs/moderation/statistics"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "text-red-400" },
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400" },
      amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "text-amber-400" },
      blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: "text-blue-400" }
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-red-400">Moderation Guide</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center space-y-4">
          <Shield className="w-16 h-16 mx-auto text-red-400" />
          <h2 className="text-4xl font-bold">Moderation Panel Guide</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive guide for admins on how to use the moderation panel effectively. 
            This is an internal document - handle with care.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
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
                className={`p-6 rounded-lg ${colors.bg} border ${colors.border} hover:scale-105 transition-transform group`}
              >
                <Icon className={`w-10 h-10 ${colors.icon} mb-4`} />
                <h3 className={`text-xl font-bold ${colors.text} mb-2`}>{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Moderation;
