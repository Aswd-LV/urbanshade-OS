import { Monitor, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const MobileBlockScreen = () => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-muted to-background z-[99999] flex flex-col items-center justify-center p-6 text-center">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Monitor className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
        </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Desktop Experience Only
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          <span className="text-primary font-semibold">UrbanShade OS</span> is designed 
          as a full desktop operating system simulation. For the best experience, 
          please visit on a desktop or laptop computer.
        </p>

        {/* Features blocked */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 mb-8">
          <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            Features require desktop
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Window Management
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              File System
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Terminal
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Applications
            </div>
          </div>
        </div>

        {/* Docs access */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            You can still access our documentation:
          </p>
          <Button 
            onClick={() => navigate('/docs')}
            className="w-full gap-2"
            size="lg"
          >
            <BookOpen className="w-4 h-4" />
            View Documentation
            <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 space-y-4">
          <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            UrbanShade OS
          </div>
          <button
            onClick={() => setIsHidden(true)}
            className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline underline-offset-2"
          >
            Believe this was a mistake? Click here
          </button>
        </div>
      </div>
    </div>
  );
};
