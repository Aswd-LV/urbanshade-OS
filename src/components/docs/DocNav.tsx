import { Link } from "react-router-dom";
import { LucideIcon, ChevronRight } from "lucide-react";

interface NavItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  badge?: string;
}

interface DocNavProps {
  items: NavItem[];
  currentPath?: string;
  accentColor?: "cyan" | "amber" | "teal" | "green" | "purple" | "red";
  title?: string;
}

const accentStyles = {
  cyan: {
    activeBg: "bg-cyan-500/10",
    activeBorder: "border-cyan-500/40",
    activeText: "text-cyan-400",
    hoverBg: "hover:bg-cyan-500/5",
    border: "border-cyan-500/20",
  },
  amber: {
    activeBg: "bg-amber-500/10",
    activeBorder: "border-amber-500/40",
    activeText: "text-amber-400",
    hoverBg: "hover:bg-amber-500/5",
    border: "border-amber-500/20",
  },
  teal: {
    activeBg: "bg-teal-500/10",
    activeBorder: "border-teal-500/40",
    activeText: "text-teal-400",
    hoverBg: "hover:bg-teal-500/5",
    border: "border-teal-500/20",
  },
  green: {
    activeBg: "bg-green-500/10",
    activeBorder: "border-green-500/40",
    activeText: "text-green-400",
    hoverBg: "hover:bg-green-500/5",
    border: "border-green-500/20",
  },
  purple: {
    activeBg: "bg-purple-500/10",
    activeBorder: "border-purple-500/40",
    activeText: "text-purple-400",
    hoverBg: "hover:bg-purple-500/5",
    border: "border-purple-500/20",
  },
  red: {
    activeBg: "bg-red-500/10",
    activeBorder: "border-red-500/40",
    activeText: "text-red-400",
    hoverBg: "hover:bg-red-500/5",
    border: "border-red-500/20",
  },
};

const DocNav = ({
  items,
  currentPath,
  accentColor = "cyan",
  title,
}: DocNavProps) => {
  const accent = accentStyles[accentColor];

  return (
    <nav className={`rounded-xl border ${accent.border} overflow-hidden`}>
      {title && (
        <div className={`px-4 py-3 border-b ${accent.border} bg-slate-800/30`}>
          <span className={`text-sm font-semibold ${accent.activeText}`}>
            {title}
          </span>
        </div>
      )}
      <div className="p-2">
        {items.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? `${accent.activeBg} border ${accent.activeBorder}`
                  : `border border-transparent ${accent.hoverBg}`
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? accent.activeText : "text-slate-500"
                  }`}
                />
              )}
              <span
                className={`flex-1 text-sm ${
                  isActive ? accent.activeText : "text-slate-400"
                }`}
              >
                {item.title}
              </span>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${accent.activeBg} ${accent.activeText}`}
                >
                  {item.badge}
                </span>
              )}
              <ChevronRight
                className={`w-4 h-4 ${
                  isActive
                    ? accent.activeText
                    : "text-slate-600 group-hover:text-slate-400"
                } transition-colors`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DocNav;
