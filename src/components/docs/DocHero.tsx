import { LucideIcon } from "lucide-react";

interface DocHeroProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accentColor?: "cyan" | "amber" | "teal" | "green" | "purple" | "red" | "blue";
  badge?: string;
}

const accentStyles = {
  cyan: {
    iconBg: "from-cyan-500/20 to-blue-500/20",
    iconBorder: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    titleGradient: "from-cyan-400 via-blue-400 to-cyan-300",
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-400",
  },
  amber: {
    iconBg: "from-amber-500/20 to-orange-500/20",
    iconBorder: "border-amber-500/30",
    iconColor: "text-amber-400",
    titleGradient: "from-amber-400 via-orange-400 to-amber-300",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
  },
  teal: {
    iconBg: "from-teal-500/20 to-emerald-500/20",
    iconBorder: "border-teal-500/30",
    iconColor: "text-teal-400",
    titleGradient: "from-teal-400 via-emerald-400 to-teal-300",
    badgeBg: "bg-teal-500/10",
    badgeBorder: "border-teal-500/30",
    badgeText: "text-teal-400",
  },
  green: {
    iconBg: "from-green-500/20 to-emerald-500/20",
    iconBorder: "border-green-500/30",
    iconColor: "text-green-400",
    titleGradient: "from-green-400 via-emerald-400 to-green-300",
    badgeBg: "bg-green-500/10",
    badgeBorder: "border-green-500/30",
    badgeText: "text-green-400",
  },
  purple: {
    iconBg: "from-purple-500/20 to-pink-500/20",
    iconBorder: "border-purple-500/30",
    iconColor: "text-purple-400",
    titleGradient: "from-purple-400 via-pink-400 to-purple-300",
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-400",
  },
  red: {
    iconBg: "from-red-500/20 to-rose-500/20",
    iconBorder: "border-red-500/30",
    iconColor: "text-red-400",
    titleGradient: "from-red-400 via-rose-400 to-red-300",
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-500/30",
    badgeText: "text-red-400",
  },
  blue: {
    iconBg: "from-blue-500/20 to-indigo-500/20",
    iconBorder: "border-blue-500/30",
    iconColor: "text-blue-400",
    titleGradient: "from-blue-400 via-indigo-400 to-blue-300",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-400",
  },
};

const DocHero = ({
  icon: Icon,
  title,
  subtitle,
  accentColor = "cyan",
  badge,
}: DocHeroProps) => {
  const accent = accentStyles[accentColor];

  return (
    <section className="text-center space-y-6 mb-16">
      {/* Icon with glow */}
      <div className="relative inline-block">
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${accent.iconBg} border ${accent.iconBorder} flex items-center justify-center mx-auto`}
        >
          <Icon className={`w-10 h-10 ${accent.iconColor}`} />
        </div>
        <div
          className={`absolute -inset-4 bg-gradient-to-br ${accent.iconBg} blur-2xl -z-10 opacity-50`}
        />
      </div>

      {/* Title */}
      <h1
        className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${accent.titleGradient} bg-clip-text text-transparent`}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>

      {/* Optional badge */}
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${accent.badgeBg} border ${accent.badgeBorder} ${accent.badgeText} text-sm font-medium`}
        >
          {badge}
        </div>
      )}
    </section>
  );
};

export default DocHero;
