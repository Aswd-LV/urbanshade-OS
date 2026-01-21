import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ChevronRight } from "lucide-react";

interface DocCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  link?: string;
  accentColor?: "cyan" | "amber" | "teal" | "green" | "purple" | "red" | "blue";
  children?: ReactNode;
  variant?: "default" | "compact" | "feature";
}

const accentStyles = {
  cyan: {
    bg: "bg-cyan-500/5",
    border: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-500/40",
    text: "text-cyan-400",
    glow: "hover:shadow-cyan-500/10",
    iconBg: "bg-cyan-500/10",
  },
  amber: {
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    hoverBorder: "hover:border-amber-500/40",
    text: "text-amber-400",
    glow: "hover:shadow-amber-500/10",
    iconBg: "bg-amber-500/10",
  },
  teal: {
    bg: "bg-teal-500/5",
    border: "border-teal-500/20",
    hoverBorder: "hover:border-teal-500/40",
    text: "text-teal-400",
    glow: "hover:shadow-teal-500/10",
    iconBg: "bg-teal-500/10",
  },
  green: {
    bg: "bg-green-500/5",
    border: "border-green-500/20",
    hoverBorder: "hover:border-green-500/40",
    text: "text-green-400",
    glow: "hover:shadow-green-500/10",
    iconBg: "bg-green-500/10",
  },
  purple: {
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
    hoverBorder: "hover:border-purple-500/40",
    text: "text-purple-400",
    glow: "hover:shadow-purple-500/10",
    iconBg: "bg-purple-500/10",
  },
  red: {
    bg: "bg-red-500/5",
    border: "border-red-500/20",
    hoverBorder: "hover:border-red-500/40",
    text: "text-red-400",
    glow: "hover:shadow-red-500/10",
    iconBg: "bg-red-500/10",
  },
  blue: {
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/40",
    text: "text-blue-400",
    glow: "hover:shadow-blue-500/10",
    iconBg: "bg-blue-500/10",
  },
};

const DocCard = ({
  title,
  description,
  icon: Icon,
  link,
  accentColor = "cyan",
  children,
  variant = "default",
}: DocCardProps) => {
  const accent = accentStyles[accentColor];

  const cardContent = (
    <>
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl ${accent.iconBg} border ${accent.border} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-6 h-6 ${accent.text}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-semibold ${accent.text}`}>{title}</h3>
            {link && (
              <ChevronRight
                className={`w-4 h-4 ${accent.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}
              />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </>
  );

  const baseClasses = `group p-5 rounded-xl ${accent.bg} border ${accent.border} ${accent.hoverBorder} ${accent.glow} hover:shadow-xl transition-all duration-300`;

  if (link) {
    return (
      <Link to={link} className={`${baseClasses} block hover:-translate-y-1`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={baseClasses}>{cardContent}</div>;
};

export default DocCard;
