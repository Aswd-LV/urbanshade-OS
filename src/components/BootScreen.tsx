import { useState, useEffect } from "react";
import { getBiosSettings } from "@/hooks/useBiosSettings";

interface BootScreenProps {
  onComplete: () => void;
  onSafeMode?: () => void;
}

export const BootScreen = ({ onComplete, onSafeMode }: BootScreenProps) => {
  const [safeModePressed, setSafeModePressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "loading">("logo");
  const [statusText, setStatusText] = useState("Starting...");
  const [dotCount, setDotCount] = useState(0);

  const biosSettings = getBiosSettings();
  const isFastBoot = biosSettings.fastBoot;

  // Handle F8 keypress for safe mode (silent)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F8') {
        setSafeModePressed(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Logo phase - pulsing animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("loading");
    }, isFastBoot ? 600 : 1500);
    
    return () => clearTimeout(timer);
  }, [isFastBoot]);

  // Loading phase - smooth progress
  useEffect(() => {
    if (phase !== "loading") return;

    const stages = [
      { progress: 15, text: "Initializing hardware" },
      { progress: 30, text: "Loading kernel" },
      { progress: 50, text: "Starting services" },
      { progress: 70, text: "Connecting to backend" },
      { progress: 85, text: "Preparing desktop" },
      { progress: 100, text: "Ready" },
    ];

    let stageIndex = 0;
    const baseDelay = isFastBoot ? 80 : 200;

    const runStage = () => {
      if (stageIndex >= stages.length) {
        setTimeout(() => {
          if (safeModePressed) {
            onSafeMode?.();
          } else {
            onComplete();
          }
        }, isFastBoot ? 50 : 150);
        return;
      }

      const stage = stages[stageIndex];
      setProgress(stage.progress);
      setStatusText(stage.text);
      stageIndex++;

      setTimeout(runStage, baseDelay + Math.random() * 80);
    };

    runStage();
  }, [phase, isFastBoot, onComplete, onSafeMode, safeModePressed]);

  return (
    <div className="fixed inset-0 bg-[#030508] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Logo with pulse */}
      <div className={`relative transition-all duration-500 ${phase === "loading" ? "scale-100" : "scale-110"}`}>
        <img 
          src="/favicon.svg" 
          alt="UrbanShade" 
          className="w-24 h-24 relative z-10"
          style={{
            filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.4))',
          }}
        />
        
        {/* Pulsing ring during logo phase */}
        {phase === "logo" && (
          <div className="absolute inset-0 -m-4">
            <div 
              className="absolute inset-0 rounded-full border border-primary/30 animate-ping"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
        )}
      </div>

      {/* Loading section */}
      <div className={`mt-16 w-72 transition-all duration-500 ${phase === "loading" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Progress bar container */}
        <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
          {/* Glow underneath */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px hsl(var(--primary) / 0.3)`,
            }}
          />
          
          {/* Progress fill */}
          <div 
            className="h-full rounded-full relative transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)',
            }}
          >
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        
        {/* Status text */}
        <div className="text-center mt-4">
          <span className="text-xs text-primary/80 font-mono tracking-wide">
            {statusText}{'.'.repeat(dotCount)}
          </span>
        </div>
      </div>

      {/* Spinner during logo phase */}
      {phase === "logo" && (
        <div className="mt-16">
          <div className="relative w-8 h-8">
            <div 
              className="absolute inset-0 rounded-full border-2 border-primary/20"
            />
            <div 
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
              style={{ animationDuration: '0.8s' }}
            />
          </div>
        </div>
      )}

      {/* CSS for shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
