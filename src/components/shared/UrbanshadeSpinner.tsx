import { cn } from "@/lib/utils";

interface UrbanshadeSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UrbanshadeSpinner = ({ size = "md", className }: UrbanshadeSpinnerProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer rotating ring */}
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
      <div 
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-400/50 animate-spin"
        style={{ animationDuration: "1.5s" }}
      />
      
      {/* Inner rotating ring (opposite direction) */}
      <div 
        className="absolute inset-2 rounded-full border border-transparent border-b-blue-500 border-l-blue-500/50 animate-spin"
        style={{ animationDuration: "2s", animationDirection: "reverse" }}
      />
      
      {/* Orbiting dots */}
      <div 
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "3s" }}
      >
        <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50", dotSizes[size])} />
      </div>
      <div 
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "3s", animationDelay: "-1s" }}
      >
        <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50", dotSizes[size])} />
      </div>
      <div 
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "3s", animationDelay: "-2s" }}
      >
        <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50", dotSizes[size])} />
      </div>
      
      {/* Center glow */}
      <div className="absolute inset-1/3 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 blur-sm animate-pulse" />
    </div>
  );
};
