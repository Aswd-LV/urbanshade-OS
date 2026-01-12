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

  // Get BIOS settings
  const biosSettings = getBiosSettings();
  const isFastBoot = biosSettings.fastBoot;
  const bootTimeout = biosSettings.bootTimeout;
  const showBootLogo = biosSettings.bootLogo;

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

  // Boot sequence runner
  useEffect(() => {
    if (showSafeModePrompt || stages.length === 0) return;

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
  }, [showSafeModePrompt, stages.length, isFastBoot, onComplete]);

  const getCurrentAction = () => {
    if (currentStageIndex >= stages.length) return 'Starting...';
    const stage = stages[currentStageIndex];
    if (!stage) return 'Initializing...';
    return stage.label;
  };

  if (showSafeModePrompt) {
    return (
      <div className="fixed inset-0 bg-black font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          {showBootLogo && (
            <div className="text-primary text-2xl font-bold animate-pulse tracking-widest">
              URBANSHADE OS
            </div>
          )}
          {!showBootLogo && (
            <div className="text-primary text-lg">
              Starting Urbanshade OS...
            </div>
          )}
          <div className="text-primary/80 text-sm">
            Press <kbd className="px-3 py-1 bg-primary/20 rounded text-primary font-bold border border-primary/40">F8</kbd> for Safe Mode
          </div>
          <div className="text-primary/50 text-xs">
            Booting normally in {safeModeCountdown}...
            {isFastBoot && <span className="ml-2 text-green-400/70">(Fast Boot)</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black font-mono flex flex-col items-center justify-center">
      {/* Logo */}
      {showBootLogo && (
        <div className="mb-8">
          <div className="text-primary text-3xl font-bold tracking-widest">
            URBANSHADE
          </div>
          <div className="text-primary/50 text-sm text-center mt-1">
            Deep Ocean Edition
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="w-80 space-y-6">
        {/* Current action */}
        <div className="text-center">
          <div className="text-primary/80 text-sm">
            {getCurrentAction()}
            <span className="animate-pulse">...</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-primary/50">
            <span>{progress}%</span>
            <span>{isFastBoot ? 'FAST BOOT' : 'NORMAL BOOT'}</span>
          </div>
        </div>

        {/* Stage indicators (compact) */}
        <div className="flex justify-center gap-1">
          {stages.map((stage, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                stage.status === 'done' ? 'bg-primary' :
                stage.status === 'warn' ? 'bg-yellow-500' :
                stage.status === 'error' ? 'bg-red-500' :
                stage.status === 'running' ? 'bg-primary animate-pulse' :
                'bg-primary/20'
              }`}
              title={stage.label}
            />
          ))}
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="flex justify-between text-[10px] text-primary/40">
          <span>URBANSHADE HADAL BLACKSITE</span>
          <span>DEPTH: 8,247m | HULL: 98.7%</span>
        </div>
      </div>
    </div>
  );
};
