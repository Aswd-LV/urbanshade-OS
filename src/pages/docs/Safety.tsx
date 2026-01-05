import { ArrowLeft, Shield, Award, Lock, Flag } from "lucide-react";
import { Link } from "react-router-dom";

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
      path: "/docs/safety/account-safety"
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
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", icon: "text-purple-400" },
      cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400" },
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "text-red-400" }
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Safety</h1>
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
          <Shield className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">Stay Safe on UrbanShade</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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

export default Safety;
