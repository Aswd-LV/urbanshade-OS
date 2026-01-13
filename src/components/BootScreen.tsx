import { useState, useEffect } from "react";
import { isOfflineMode } from "@/integrations/supabase/client";
import { getBiosSettings } from "@/hooks/useBiosSettings";

interface BootScreenProps {
  onComplete: () => void;
  onSafeMode?: () => void;
}

interface BootStage {
  label: string;
  status: 'pending' | 'running' | 'done' | 'warn' | 'error';
}

export const BootScreen = ({ onComplete, onSafeMode }: BootScreenProps) => {
  const [showSafeModePrompt, setShowSafeModePrompt] = useState(true);
  const [safeModeCountdown, setSafeModeCountdown] = useState(3);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stages, setStages] = useState<BootStage[]>([]);
  const [phase, setPhase] = useState<"logo" | "loading">("logo");
  const [logoVisible, setLogoVisible] = useState(false);

  // Get BIOS settings
  const biosSettings = getBiosSettings();
  const isFastBoot = biosSettings.fastBoot;
  const bootTimeout = biosSettings.bootTimeout;

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

  // Initialize countdown from BIOS timeout setting
  useEffect(() => {
    setSafeModeCountdown(bootTimeout);
  }, [bootTimeout]);

  // Safe mode countdown
  useEffect(() => {
    if (!showSafeModePrompt) return;
    
    const interval = setInterval(() => {
      setSafeModeCountdown(prev => {
        if (prev <= 1) {
          setShowSafeModePrompt(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F8' && showSafeModePrompt) {
        setShowSafeModePrompt(false);
        onSafeMode?.();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showSafeModePrompt, onSafeMode]);

  // Logo phase animation
  useEffect(() => {
    if (showSafeModePrompt) return;
    
    // Fade in logo
    setTimeout(() => setLogoVisible(true), 100);
    
    // After 1 second, show loading phase
    const timer = setTimeout(() => {
      setPhase("loading");
    }, isFastBoot ? 500 : 1000);
    
    return () => clearTimeout(timer);
  }, [showSafeModePrompt, isFastBoot]);

  // Boot sequence runner
  useEffect(() => {
    if (phase !== "loading" || stages.length === 0) return;

    const totalStages = stages.length;
    const baseDelay = isFastBoot ? 150 : 350;
    let stageIdx = 0;

    const runStage = () => {
      if (stageIdx >= totalStages) {
        setProgress(100);
        setTimeout(() => onComplete(), isFastBoot ? 100 : 300);
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
  }, [phase, stages.length, isFastBoot, onComplete]);

  const getCurrentAction = () => {
    if (currentStageIndex >= stages.length) return 'Starting...';
    const stage = stages[currentStageIndex];
    if (!stage) return 'Initializing...';
    return stage.label + '...';
  };

  if (showSafeModePrompt) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/favicon.png" 
              alt="UrbanShade" 
              className="w-20 h-20 animate-pulse"
            />
          </div>
          
          <div className="text-cyan-400/80 text-sm font-mono">
            Press <kbd className="px-3 py-1.5 bg-cyan-500/10 rounded-md text-cyan-400 font-bold border border-cyan-500/30 mx-1">F8</kbd> for Safe Mode
          </div>
          <div className="text-slate-600 text-xs font-mono">
            Booting normally in {safeModeCountdown}...
            {isFastBoot && <span className="ml-2 text-cyan-500/50">(Fast Boot)</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Centered Logo */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/favicon.png" 
          alt="UrbanShade" 
          className={`w-24 h-24 transition-opacity duration-500 ${logoVisible ? 'opacity-100' : 'opacity-0'}`}
        />
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
