import { ReactNode } from "react";
import { Info, AlertTriangle, AlertCircle, Lightbulb, CheckCircle } from "lucide-react";

interface DocAlertProps {
  children: ReactNode;
  variant?: "info" | "warning" | "danger" | "tip" | "success";
  title?: string;
}

const variants = {
  info: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    titleColor: "text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    titleColor: "text-amber-400",
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    titleColor: "text-red-400",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    titleColor: "text-purple-400",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    iconColor: "text-green-400",
    titleColor: "text-green-400",
  },
};

const defaultTitles = {
  info: "Note",
  warning: "Warning",
  danger: "Danger",
  tip: "Pro Tip",
  success: "Success",
};

const DocAlert = ({ children, variant = "info", title }: DocAlertProps) => {
  const style = variants[variant];
  const Icon = style.icon;
  const displayTitle = title || defaultTitles[variant];

  return (
    <div
      className={`p-4 rounded-xl ${style.bg} border ${style.border} flex gap-4`}
    >
      <div className={`flex-shrink-0 mt-0.5`}>
        <Icon className={`w-5 h-5 ${style.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold ${style.titleColor} mb-1`}>
          {displayTitle}
        </div>
        <div className="text-sm text-slate-300">{children}</div>
      </div>
    </div>
  );
};

export default DocAlert;
