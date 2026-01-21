import { ArrowLeft, Shield, Award, Lock, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Safety = () => {
  const sections = [
    {
      title: "Badges",
      description: "Learn about user badges and what they mean - from Creator to VIP status.",
      icon: Award,
      color: "purple",
      path: "/docs/safety/badges"
    },
    {
      title: "Account Safety",
      description: "Tips for keeping your account secure with strong passwords and privacy settings.",
      icon: Lock,
      color: "cyan",
      path: "/docs/safety/account"
    },
    {
      title: "Reporting",
      description: "How to report rule breakers and who to contact for help.",
      icon: Flag,
      color: "red",
      path: "/docs/safety/reporting"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string; glow: string }> = {
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", icon: "text-purple-400", glow: "group-hover:shadow-purple-500/20" },
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400", glow: "group-hover:shadow-cyan-500/20" },
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "text-red-400", glow: "group-hover:shadow-red-500/20" }
    };
    return colors[color] || colors.purple;
  };

  return (
    <>
    <SEO 
      title="Safety" 
      description="Stay safe on Urbanshade OS - user badges, account security tips, and how to report rule violations."
      path="/docs/safety"
    />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">Safety</h1>
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
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-slate-100">Stay Safe on UrbanShade</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Your safety matters to us. Learn about trust indicators, account security, 
            and how to report issues.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
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
    </>
  );
};

export default Safety;