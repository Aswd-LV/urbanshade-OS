import { useState, useEffect } from "react";
import { isOfflineMode } from "@/integrations/supabase/client";
import { getBiosSettings } from "@/hooks/useBiosSettings";
import { UrbanshadeSpinner } from "@/components/shared/UrbanshadeSpinner";

interface BootScreenProps {
  onComplete: () => void;
  onSafeMode?: () => void;
}

interface BootStage {
  label: string;
  status: 'pending' | 'running' | 'done' | 'warn' | 'error';
}

export const BootScreen = ({ onComplete, onSafeMode }: BootScreenProps) => {
  const [safeModePressed, setSafeModePressed] = useState(false);
  const [safeModeDelay, setSafeModeDelay] = useState(true);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stages, setStages] = useState<BootStage[]>([]);
  const [phase, setPhase] = useState<"logo" | "loading">("logo");
  const [logoVisible, setLogoVisible] = useState(false);

  // Get BIOS settings
  const biosSettings = getBiosSettings();
  const isFastBoot = biosSettings.fastBoot;

  // Initialize stages
  useEffect(() => {
    const bootStages: BootStage[] = [
      { label: 'Initializing hardware', status: 'pending' },
      { label: 'Loading kernel modules', status: 'pending' },
      { label: 'Mounting file systems', status: 'pending' },
      { label: 'Starting network services', status: 'pending' },
    ];
    
    if (!isFastBoot) {
      bootStages.splice(1, 0, { label: 'Running memory diagnostics', status: 'pending' });
      bootStages.splice(3, 0, { label: 'Verifying system integrity', status: 'pending' });
    }
    
    bootStages.push({ label: 'Connecting to backend', status: 'pending' });
    bootStages.push({ label: 'Launching desktop', status: 'pending' });
    
    setStages(bootStages);
  }, [isFastBoot]);

  // Handle F8 keypress for safe mode (silent - no UI indication)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F8') {
        setSafeModePressed(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extended logo display phase (6 seconds total)
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setSafeModeDelay(false);
    }, 6000);

    return () => {
      clearTimeout(delayTimer);
    };
  }, []);

  // Logo phase animation - starts after safe mode delay ends (or immediately if safe mode pressed)
  useEffect(() => {
    if (safeModeDelay) return;
    
    // Fade in logo
    setTimeout(() => setLogoVisible(true), 100);
    
    // After logo animation, start loading phase
    const timer = setTimeout(() => {
      setPhase("loading");
    }, isFastBoot ? 500 : 1000);
    
    return () => clearTimeout(timer);
  }, [safeModeDelay, isFastBoot]);

  // Boot sequence runner
  useEffect(() => {
    if (phase !== "loading" || stages.length === 0) return;

    const totalStages = stages.length;
    const baseDelay = isFastBoot ? 150 : 350;
    let stageIdx = 0;

    const runStage = () => {
      if (stageIdx >= totalStages) {
        setProgress(100);
        setTimeout(() => {
          if (safeModePressed) {
            onSafeMode?.();
          } else {
            onComplete();
          }
        }, isFastBoot ? 100 : 300);
        return;
      }

      // Set current stage to running
      setCurrentStageIndex(stageIdx);
      setStages(prev => prev.map((s, i) => 
        i === stageIdx ? { ...s, status: 'running' } : s
      ));
      
      setProgress(Math.round(((stageIdx + 0.5) / totalStages) * 100));

      // Complete stage after delay
      const delay = baseDelay + Math.random() * 100;
      setTimeout(() => {
        // Check for backend connection status
        const isBackendStage = stages[stageIdx]?.label.includes('backend');
        const newStatus = isBackendStage && isOfflineMode ? 'warn' : 'done';
        
        setStages(prev => prev.map((s, i) => 
          i === stageIdx ? { ...s, status: newStatus } : s
        ));
        
        setProgress(Math.round(((stageIdx + 1) / totalStages) * 100));
        stageIdx++;
        
        setTimeout(runStage, 50);
      }, delay);
    };

    runStage();
  }, [phase, stages.length, isFastBoot, onComplete, onSafeMode, safeModePressed]);

  const getCurrentAction = () => {
    if (currentStageIndex >= stages.length) return 'Starting...';
    const stage = stages[currentStageIndex];
    if (!stage) return 'Initializing...';
    return stage.label + '...';
  };

  // During logo display period - show logo with spinner
  if (safeModeDelay) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
        <img 
          src="/favicon.svg" 
          alt="UrbanShade" 
          className="w-24 h-24"
        />
        <div className="mt-8">
          <UrbanshadeSpinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Centered Logo */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img 
          src="/favicon.svg" 
          alt="UrbanShade" 
          className={`w-24 h-24 transition-opacity duration-500 ${logoVisible ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Safe mode message */}
        {safeModePressed && logoVisible && (
          <p className="mt-4 text-amber-500 text-sm font-mono animate-pulse">
            Entering safe mode...
          </p>
        )}
      </div>

      {/* Bottom Progress Bar - Only visible during loading phase */}
      <div className={`h-12 transition-opacity duration-300 ${phase === "loading" ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress bar at the very bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Status text on the right */}
          <div className="flex justify-end px-4 mb-1">
            <span className="text-xs text-cyan-500/70 font-mono">
              {getCurrentAction()}
            </span>
          </div>
          
          {/* Thin blue progress bar */}
          <div className="h-1 bg-slate-900">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
