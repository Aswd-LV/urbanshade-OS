import { useState, useEffect } from "react";
import { List, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface DocTOCProps {
  items: TOCItem[];
  accentColor?: "cyan" | "amber" | "teal" | "green" | "purple" | "red" | "blue";
}

const accentStyles = {
  cyan: { text: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10", active: "bg-cyan-500/20" },
  amber: { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", active: "bg-amber-500/20" },
  teal: { text: "text-teal-400", border: "border-teal-500/30", bg: "bg-teal-500/10", active: "bg-teal-500/20" },
  green: { text: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10", active: "bg-green-500/20" },
  purple: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", active: "bg-purple-500/20" },
  red: { text: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10", active: "bg-red-500/20" },
  blue: { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", active: "bg-blue-500/20" },
};

const DocTOC = ({ items, accentColor = "cyan" }: DocTOCProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const accent = accentStyles[accentColor];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%", threshold: 0 }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <div className={`p-4 rounded-xl ${accent.bg} border ${accent.border} mb-8`}>
      <div className={`flex items-center gap-2 mb-3 ${accent.text} font-semibold text-sm`}>
        <List className="w-4 h-4" />
        On this page
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-slate-800/50",
              item.level > 1 && "ml-4",
              activeId === item.id
                ? `${accent.active} ${accent.text} font-medium`
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <ChevronRight className={cn("w-3 h-3", activeId === item.id ? "opacity-100" : "opacity-0")} />
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default DocTOC;