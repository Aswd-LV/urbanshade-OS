import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface DocSectionProps {
  children: ReactNode;
  title?: string;
  icon?: LucideIcon;
  id?: string;
  accentColor?: "cyan" | "amber" | "teal" | "green" | "purple" | "red" | "blue";
}

const accentStyles = {
  cyan: { text: "text-cyan-400", border: "border-cyan-500/30" },
  amber: { text: "text-amber-400", border: "border-amber-500/30" },
  teal: { text: "text-teal-400", border: "border-teal-500/30" },
  green: { text: "text-green-400", border: "border-green-500/30" },
  purple: { text: "text-purple-400", border: "border-purple-500/30" },
  red: { text: "text-red-400", border: "border-red-500/30" },
  blue: { text: "text-blue-400", border: "border-blue-500/30" },
};

const DocSection = ({
  children,
  title,
  icon: Icon,
  id,
  accentColor = "cyan",
}: DocSectionProps) => {
  const accent = accentStyles[accentColor];

  return (
    <section id={id} className="mb-12 scroll-mt-24">
      {title && (
        <div className={`flex items-center gap-3 mb-6 pb-3 border-b ${accent.border}`}>
          {Icon && <Icon className={`w-5 h-5 ${accent.text}`} />}
          <h2 className={`text-2xl font-bold ${accent.text}`}>{title}</h2>
        </div>
      )}
      <div className="space-y-4 text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
};

export default DocSection;
