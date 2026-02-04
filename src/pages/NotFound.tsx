import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft, BookOpen, Flag, Headphones, Users, Terminal, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/shared/GlitchText";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const suggestedRoutes = [
    { path: "/docs", label: "Documentation", icon: BookOpen, description: "Browse guides & FAQs" },
    { path: "/support", label: "Support", icon: Headphones, description: "Get help from our team" },
    { path: "/report", label: "Report", icon: Flag, description: "Report an issue" },
    { path: "/team", label: "Team", icon: Users, description: "Meet the developers" },
    { path: "/status", label: "Status", icon: Terminal, description: "System status" },
  ];

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center font-mono overflow-hidden z-50">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Ambient glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-[0.08] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, hsl(var(--primary)) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full px-6">
        {/* Error header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <FileQuestion className="w-8 h-8 text-destructive/70" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-bold text-foreground/90 tracking-wider">
              <GlitchText text="404" glitchInterval={10000} enabled />
            </div>
          </div>
        </div>

        {/* Error message */}
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
          Route Not Found
        </p>
        
        <p className="text-muted-foreground/60 text-sm mb-8 text-center">
          The path <code className="px-2 py-0.5 rounded bg-muted/50 text-primary font-medium">{location.pathname}</code> doesn't exist.
        </p>

        {/* Quick actions */}
        <div className="flex gap-3 mb-10">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="gap-2 border-border/50 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        {/* Suggested pages */}
        <div className="w-full">
          <p className="text-xs text-muted-foreground/50 uppercase tracking-wider mb-3 text-center">
            Maybe you were looking for
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {suggestedRoutes.map((route) => (
              <button
                key={route.path}
                onClick={() => navigate(route.path)}
                className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-200"
              >
                <route.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  {route.label}
                </span>
                <span className="text-[10px] text-muted-foreground/50 text-center leading-tight hidden sm:block">
                  {route.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/30 text-center z-10 font-mono">
        <p>URBANSHADE OS • ERR_ROUTE_NOT_FOUND • 0x00000194</p>
      </div>
    </div>
  );
};

export default NotFound;
