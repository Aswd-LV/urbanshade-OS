import { useState, useEffect, useCallback } from "react";
import { getBiosSettings } from "@/hooks/useBiosSettings";

interface PostScreenProps {
  onComplete: () => void;
  onEnterBios: () => void;
}

export const PostScreen = ({ onComplete, onEnterBios }: PostScreenProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showBiosPrompt, setShowBiosPrompt] = useState(false);
  const [memoryProgress, setMemoryProgress] = useState(0);
  const [phase, setPhase] = useState<'memory' | 'devices' | 'prompt' | 'done'>('memory');

  const biosSettings = getBiosSettings();
  const isFastBoot = biosSettings.fastBoot;

  // Handle key presses for BIOS entry
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'F2') {
      e.preventDefault();
      onEnterBios();
    }
  }, [onEnterBios]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Memory test phase
  useEffect(() => {
    if (phase !== 'memory') return;

    const targetMemory = 32768; // 32GB in MB
    const steps = isFastBoot ? 5 : 20;
    const stepSize = targetMemory / steps;
    const delay = isFastBoot ? 30 : 80;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setMemoryProgress(Math.min(currentStep * stepSize, targetMemory));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setLines(prev => [...prev, `Memory Test: ${targetMemory} MB OK`]);
        setTimeout(() => setPhase('devices'), isFastBoot ? 100 : 300);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [phase, isFastBoot]);

  // Device detection phase
  useEffect(() => {
    if (phase !== 'devices') return;

    const devices = [
      { name: 'CPU: Urbanshade Quantum Core v4 @ 4.2GHz', delay: isFastBoot ? 50 : 150 },
      { name: 'GPU: Urbanshade Quantum Graphics 8GB', delay: isFastBoot ? 50 : 120 },
      { name: 'NVMe: URBANSHADE-SSD-01 (2048GB)', delay: isFastBoot ? 50 : 100 },
      { name: 'Network: Urbanshade Gigabit Ethernet', delay: isFastBoot ? 50 : 100 },
      { name: 'USB: 4 Ports Detected', delay: isFastBoot ? 50 : 80 },
      { name: `TPM 2.0: ${biosSettings.tpmEnabled ? 'Active' : 'Disabled'}`, delay: isFastBoot ? 50 : 80 },
    ];

    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const showNext = () => {
      if (index < devices.length) {
        const device = devices[index];
        if (device) {
          setLines(prev => [...prev, device.name]);
          const delay = device.delay;
          index++;
          timeoutId = setTimeout(showNext, delay);
        }
      } else {
        setLines(prev => [...prev, '', 'All devices initialized successfully.']);
        timeoutId = setTimeout(() => setPhase('prompt'), isFastBoot ? 200 : 500);
      }
    };

    showNext();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phase, isFastBoot, biosSettings.tpmEnabled]);

  // Prompt phase
  useEffect(() => {
    if (phase !== 'prompt') return;
    
    setShowBiosPrompt(true);
    
    // Auto-continue after timeout
    const timeout = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, isFastBoot ? 800 : 2000);

    return () => clearTimeout(timeout);
  }, [phase, isFastBoot, onComplete]);

  return (
    <div className="fixed inset-0 bg-black font-mono text-[#00ff00] overflow-hidden">
      <div className="p-6 text-sm leading-relaxed">
        {/* Header */}
        <div className="mb-4">
          <div className="text-lg font-bold text-white mb-1">URBANSHADE UEFI BIOS v2.9.0</div>
          <div className="text-xs text-[#00ff00]/70">Copyright (C) 2025 Urbanshade Corporation</div>
          <div className="text-xs text-[#00ff00]/70">Licensed for Hadal Blacksite Operations</div>
        </div>

        <div className="border-t border-[#00ff00]/30 my-3" />

        {/* Memory test */}
        {phase === 'memory' && (
          <div className="mb-4">
            <span className="text-yellow-400">Memory Test:</span>{' '}
            <span>{memoryProgress.toLocaleString()} MB</span>
            <span className="animate-pulse ml-2">▌</span>
          </div>
        )}

        {/* Device list */}
        {lines.map((line, i) => (
          <div key={i} className={line === '' ? 'h-4' : ''}>
            {line && (
              <span>
                <span className="text-[#00ff00]/60">› </span>
                {line}
              </span>
            )}
          </div>
        ))}

        {/* BIOS prompt */}
        {showBiosPrompt && (
          <div className="mt-8 animate-pulse">
            <div className="text-yellow-400">
              Press <span className="bg-yellow-400/20 px-2 py-0.5 rounded font-bold">DEL</span> or{' '}
              <span className="bg-yellow-400/20 px-2 py-0.5 rounded font-bold">F2</span> to enter UEFI Setup
            </div>
            <div className="text-[#00ff00]/50 text-xs mt-2">
              {isFastBoot ? 'Fast Boot enabled - Press any key to interrupt' : 'Booting from primary device...'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#00ff00]/20 bg-black/80">
        <div className="flex justify-between text-xs text-[#00ff00]/60">
          <span>URBANSHADE HADAL BLACKSITE</span>
          <span>{biosSettings.secureBoot ? 'Secure Boot: ON' : 'Secure Boot: OFF'}</span>
          <span>UEFI v2.9.0</span>
        </div>
      </div>
    </div>
  );
};
