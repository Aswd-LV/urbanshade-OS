import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/shared/GlitchText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* Subtle scan lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
      
      {/* Ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, hsl(var(--destructive)) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Error icon */}
      <div className="relative mb-6">
        <AlertTriangle className="w-16 h-16 text-destructive/80" strokeWidth={1.5} />
      </div>

      {/* Error code */}
      <div className="text-7xl font-bold text-foreground/90 mb-2 tracking-wider">
        <GlitchText text="404" glitchInterval={8000} enabled />
      </div>

      {/* Error message */}
      <p className="text-muted-foreground text-lg mb-2">
        ROUTE_NOT_FOUND
      </p>
      
      <p className="text-muted-foreground/60 text-sm mb-8 max-w-md text-center">
        The requested path <span className="text-primary font-medium">{location.pathname}</span> does not exist in this system.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button 
          onClick={() => window.location.href = '/'}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Return Home
        </Button>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/40 text-center">
        <p>URBANSHADE OS • ERROR 0x00000194</p>
      </div>
    </div>
  );
};

export default NotFound;
