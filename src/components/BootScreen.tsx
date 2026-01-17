import { useState, useEffect } from "react";
import { isOfflineMode } from "@/integrations/supabase/client";
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

  // Logo phase - simple delay before loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("loading");
    }, isFastBoot ? 800 : 2000);
    
    return () => clearTimeout(timer);
  }, [isFastBoot]);

  // Loading phase - simple progress bar
  useEffect(() => {
    if (phase !== "loading") return;

    const stages = [
      { progress: 15, text: "Initializing hardware..." },
      { progress: 35, text: "Loading kernel..." },
      { progress: 55, text: "Starting services..." },
      { progress: 75, text: "Connecting to backend..." },
      { progress: 90, text: "Preparing desktop..." },
      { progress: 100, text: "Ready" },
    ];

    let stageIndex = 0;
    const baseDelay = isFastBoot ? 100 : 250;

    const runStage = () => {
      if (stageIndex >= stages.length) {
        setTimeout(() => {
          if (safeModePressed) {
            onSafeMode?.();
          } else {
            onComplete();
          }
        }, isFastBoot ? 50 : 200);
        return;
      }

      const stage = stages[stageIndex];
      setProgress(stage.progress);
      setStatusText(stage.text);
      stageIndex++;

      setTimeout(runStage, baseDelay + Math.random() * 100);
    };

    runStage();
  }, [phase, isFastBoot, onComplete, onSafeMode, safeModePressed]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      {/* Logo */}
      <img 
        src="/favicon.svg" 
        alt="UrbanShade" 
        className={`w-20 h-20 transition-opacity duration-500 ${phase === "loading" ? "opacity-100" : "opacity-80"}`}
      />
      
      {/* Safe mode indicator */}
      {safeModePressed && (
        <p className="mt-4 text-amber-500 text-sm font-mono animate-pulse">
          Entering safe mode...
        </p>
      )}

      {/* Loading bar - only show during loading phase */}
      <div className={`mt-12 w-64 transition-opacity duration-300 ${phase === "loading" ? "opacity-100" : "opacity-0"}`}>
        {/* Status text */}
        <div className="text-center mb-3">
          <span className="text-xs text-cyan-500/80 font-mono">
            {statusText}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-200 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Spinner during logo phase */}
      {phase === "logo" && (
        <div className="mt-12 w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      )}
    </div>
  );
};
