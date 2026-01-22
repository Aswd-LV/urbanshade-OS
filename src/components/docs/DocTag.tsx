import { cn } from "@/lib/utils";

interface DocTagProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  // Categories
  "getting-started": { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  "apps": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  "terminal": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  "advanced": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "security": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  "developer": { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
  "moderation": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  "safety": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "defdev": { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  "uur": { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  // Default
  "default": { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" },
};

const getTagStyle = (tag: string) => {
  const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");
  return tagColors[normalizedTag] || tagColors.default;
};

const DocTag = ({ tag, active = false, onClick, size = "sm" }: DocTagProps) => {
  const style = getTagStyle(tag);
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border transition-all",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        style.bg,
        style.text,
        style.border,
        onClick && "cursor-pointer hover:opacity-80",
        active && "ring-2 ring-offset-1 ring-offset-slate-950"
      )}
    >
      {tag}
    </button>
  );
};

export default DocTag;