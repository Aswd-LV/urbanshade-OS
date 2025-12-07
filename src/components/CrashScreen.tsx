import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Skull, Zap, Activity, Cpu, HardDrive, Wifi, WifiOff, Shield, Clock, Terminal } from "lucide-react";

export type CrashType = 
  | "KERNEL_PANIC" 
  | "CRITICAL_PROCESS_DIED" 
  | "SYSTEM_SERVICE_EXCEPTION" 
  | "MEMORY_MANAGEMENT" 
  | "IRQL_NOT_LESS_OR_EQUAL"
  | "PAGE_FAULT_IN_NONPAGED_AREA"
  | "DRIVER_IRQL_NOT_LESS_OR_EQUAL"
  | "SYSTEM_THREAD_EXCEPTION_NOT_HANDLED"
  | "UNEXPECTED_KERNEL_MODE_TRAP"
  | "KMODE_EXCEPTION_NOT_HANDLED"
  | "INACCESSIBLE_BOOT_DEVICE"
  | "VIDEO_TDR_FAILURE"
  | "WHEA_UNCORRECTABLE_ERROR"
  | "DPC_WATCHDOG_VIOLATION"
  | "CLOCK_WATCHDOG_TIMEOUT"
  | "custom";

export interface CrashData {
  stopCode: CrashType;
  process?: string;
  module?: string;
  address?: string;
  description?: string;
  collectingData?: boolean;
}

interface CrashScreenProps {
  onReboot: () => void;
  crashData?: CrashData;
  killedProcess?: string;
  crashType?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload";
  customData?: { title: string; message: string } | null;
}

// STYLED crash screen themes - these are for testing/simulation, NOT real errors
const CRASH_THEMES: Record<CrashType, { 
  color: string; 
  bgGradient: string;
  icon: React.ReactNode;
  emoticon: string;
  title: string;
  subtitle: string;
}> = {
  KERNEL_PANIC: {
    color: "text-blue-400",
    bgGradient: "from-blue-950 via-blue-900/90 to-slate-950",
    icon: <Skull className="w-16 h-16" />,
    emoticon: ":(",
    title: "Your system ran into a problem",
    subtitle: "We're collecting some info, and then we'll restart for you."
  },
  CRITICAL_PROCESS_DIED: {
    color: "text-blue-400",
    bgGradient: "from-blue-950 via-blue-900/90 to-slate-950",
    icon: <AlertTriangle className="w-16 h-16" />,
    emoticon: ":(",
    title: "A critical process has stopped",
    subtitle: "The system cannot continue without this process."
  },
  SYSTEM_SERVICE_EXCEPTION: {
    color: "text-cyan-400",
    bgGradient: "from-cyan-950 via-cyan-900/90 to-slate-950",
    icon: <Zap className="w-16 h-16" />,
    emoticon: ":/",
    title: "System service exception",
    subtitle: "A system service encountered an unexpected error."
  },
  MEMORY_MANAGEMENT: {
    color: "text-purple-400",
    bgGradient: "from-purple-950 via-purple-900/90 to-slate-950",
    icon: <Cpu className="w-16 h-16" />,
    emoticon: ":0",
    title: "Memory management error",
    subtitle: "The system detected a memory allocation failure."
  },
  IRQL_NOT_LESS_OR_EQUAL: {
    color: "text-amber-400",
    bgGradient: "from-amber-950 via-amber-900/90 to-slate-950",
    icon: <Activity className="w-16 h-16" />,
    emoticon: ":|",
    title: "IRQL violation detected",
    subtitle: "A process accessed memory at an invalid level."
  },
  PAGE_FAULT_IN_NONPAGED_AREA: {
    color: "text-orange-400",
    bgGradient: "from-orange-950 via-orange-900/90 to-slate-950",
    icon: <HardDrive className="w-16 h-16" />,
    emoticon: ":X",
    title: "Page fault in nonpaged area",
    subtitle: "Invalid memory was referenced."
  },
  DRIVER_IRQL_NOT_LESS_OR_EQUAL: {
    color: "text-yellow-400",
    bgGradient: "from-yellow-950 via-yellow-900/90 to-slate-950",
    icon: <Wifi className="w-16 h-16" />,
    emoticon: ":\\",
    title: "Driver IRQL violation",
    subtitle: "A driver accessed memory incorrectly."
  },
  SYSTEM_THREAD_EXCEPTION_NOT_HANDLED: {
    color: "text-red-400",
    bgGradient: "from-red-950 via-red-900/90 to-slate-950",
    icon: <WifiOff className="w-16 h-16" />,
    emoticon: ":#",
    title: "Thread exception not handled",
    subtitle: "A system thread generated an unhandled exception."
  },
  UNEXPECTED_KERNEL_MODE_TRAP: {
    color: "text-pink-400",
    bgGradient: "from-pink-950 via-pink-900/90 to-slate-950",
    icon: <Shield className="w-16 h-16" />,
    emoticon: ":?",
    title: "Unexpected kernel trap",
    subtitle: "The kernel encountered an unexpected trap."
  },
  KMODE_EXCEPTION_NOT_HANDLED: {
    color: "text-rose-400",
    bgGradient: "from-rose-950 via-rose-900/90 to-slate-950",
    icon: <AlertTriangle className="w-16 h-16" />,
    emoticon: ":!",
    title: "Kernel exception not handled",
    subtitle: "A kernel mode exception was not caught."
  },
  INACCESSIBLE_BOOT_DEVICE: {
    color: "text-slate-400",
    bgGradient: "from-slate-900 via-slate-800 to-slate-950",
    icon: <HardDrive className="w-16 h-16" />,
    emoticon: ":'(",
    title: "Boot device inaccessible",
    subtitle: "The system cannot access the boot device."
  },
  VIDEO_TDR_FAILURE: {
    color: "text-green-400",
    bgGradient: "from-green-950 via-green-900/90 to-slate-950",
    icon: <Activity className="w-16 h-16" />,
    emoticon: ":v",
    title: "Display driver timeout",
    subtitle: "The display driver failed to respond in time."
  },
  WHEA_UNCORRECTABLE_ERROR: {
    color: "text-red-500",
    bgGradient: "from-red-950 via-red-900 to-slate-950",
    icon: <Zap className="w-16 h-16" />,
    emoticon: ":(",
    title: "Hardware error detected",
    subtitle: "A fatal hardware error has occurred."
  },
  DPC_WATCHDOG_VIOLATION: {
    color: "text-indigo-400",
    bgGradient: "from-indigo-950 via-indigo-900/90 to-slate-950",
    icon: <Clock className="w-16 h-16" />,
    emoticon: ":@",
    title: "DPC watchdog violation",
    subtitle: "A deferred procedure call exceeded timeout."
  },
  CLOCK_WATCHDOG_TIMEOUT: {
    color: "text-teal-400",
    bgGradient: "from-teal-950 via-teal-900/90 to-slate-950",
    icon: <Clock className="w-16 h-16" />,
    emoticon: ":>",
    title: "Clock watchdog timeout",
    subtitle: "Processor clock interrupt was not received."
  },
  custom: {
    color: "text-blue-400",
    bgGradient: "from-blue-950 via-blue-900/90 to-slate-950",
    icon: <AlertTriangle className="w-16 h-16" />,
    emoticon: ":(",
    title: "System error",
    subtitle: "The system encountered an error."
  }
};

export const CrashScreen = ({ 
  onReboot, 
  crashData,
  killedProcess, 
  crashType = "kernel", 
  customData 
}: CrashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"collecting" | "ready">("collecting");
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [qrCode, setQrCode] = useState<string[]>([]);

  // Convert legacy props to new format
  const resolvedCrashData: CrashData = crashData || {
    stopCode: crashType === "bluescreen" ? "CRITICAL_PROCESS_DIED" :
              crashType === "memory" ? "MEMORY_MANAGEMENT" :
              crashType === "overload" ? "DPC_WATCHDOG_VIOLATION" :
              crashType === "virus" ? "SYSTEM_SERVICE_EXCEPTION" :
              "KERNEL_PANIC",
    process: killedProcess || customData?.title,
    description: customData?.message
  };

  const theme = CRASH_THEMES[resolvedCrashData.stopCode] || CRASH_THEMES.KERNEL_PANIC;

  useEffect(() => {
    // Progress to 100%
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("ready");
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Generate fake QR code pattern
  useEffect(() => {
    const size = 21;
    const pattern: string[] = [];
    for (let i = 0; i < size; i++) {
      let row = '';
      for (let j = 0; j < size; j++) {
        // Fixed corners for QR authenticity
        const isCorner = (i < 7 && j < 7) || (i < 7 && j >= size - 7) || (i >= size - 7 && j < 7);
        if (isCorner) {
          const isOuter = i === 0 || i === 6 || j === 0 || j === 6 || 
                          (i >= size - 7 && (i === size - 7 || i === size - 1)) ||
                          (j >= size - 7 && (j === size - 7 || j === size - 1));
          const isInner = (i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
                          (i >= 2 && i <= 4 && j >= size - 5 && j <= size - 3) ||
                          (i >= size - 5 && i <= size - 3 && j >= 2 && j <= 4);
          row += (isOuter || isInner) ? '█' : ' ';
        } else {
          row += Math.random() > 0.5 ? '█' : ' ';
        }
      }
      pattern.push(row);
    }
    setQrCode(pattern);
  }, []);

  // Glitch effect for virus type
  useEffect(() => {
    if (crashType === "virus") {
      const interval = setInterval(() => {
        setGlitchIntensity(Math.random());
      }, 100);
      return () => clearInterval(interval);
    }
  }, [crashType]);

  const displayProgress = Math.min(100, Math.floor(progress));

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br ${theme.bgGradient} text-white font-sans overflow-hidden flex flex-col`}
      style={crashType === "virus" ? {
        filter: `hue-rotate(${glitchIntensity * 30}deg)`,
        transform: `translate(${(glitchIntensity - 0.5) * 4}px, ${(glitchIntensity - 0.5) * 2}px)`
      } : undefined}
    >
      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' 
        }} 
      />

      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-8">
          {/* Emoticon */}
          <div className={`text-[120px] md:text-[180px] font-light ${theme.color} leading-none`}>
            {theme.emoticon}
          </div>

          {/* Main message */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-light text-white leading-relaxed">
              {customData?.title || theme.title}
            </h1>
            <p className="text-lg text-white/70">
              {customData?.message || theme.subtitle}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-3 max-w-lg">
            <p className="text-sm text-white/60">
              {phase === "collecting" ? `${displayProgress}% complete` : "Ready to restart"}
            </p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${theme.color.replace('text-', 'bg-')} transition-all duration-100 ease-out`}
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>

          {/* Info grid */}
          <div className="flex flex-wrap gap-8 pt-4">
            {/* QR Code */}
            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg">
                <div className="font-mono text-[4px] leading-[4px] text-black whitespace-pre">
                  {qrCode.map((row, i) => (
                    <div key={i}>{row}</div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-white/50 max-w-xs">
                <p className="mb-2">For more information about this issue and possible fixes, visit:</p>
                <p className={`font-mono ${theme.color}`}>urbanshade.os/support</p>
              </div>
            </div>

            {/* Technical info */}
            <div className="space-y-2 text-xs text-white/40">
              <p>Stop code: <span className={`font-mono ${theme.color}`}>{resolvedCrashData.stopCode}</span></p>
              {resolvedCrashData.process && (
                <p>What failed: <span className="font-mono text-white/60">{resolvedCrashData.process}</span></p>
              )}
              {resolvedCrashData.module && (
                <p>Module: <span className="font-mono text-white/60">{resolvedCrashData.module}</span></p>
              )}
            </div>
          </div>

          {/* Notice - This is styled/simulated */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <Terminal className={`w-5 h-5 ${theme.color} flex-shrink-0 mt-0.5`} />
              <div className="text-sm text-white/60">
                <p className="font-medium text-white/80 mb-1">Styled Crash Screen</p>
                <p className="text-xs">
                  This is a <strong>styled crash screen</strong> for testing or demonstration. 
                  It simulates a system crash but is not caused by an actual error. 
                  If this was triggered from DEF-DEV, it's working as expected.
                </p>
              </div>
            </div>
          </div>

          {/* Restart button */}
          {phase === "ready" && (
            <button
              onClick={onReboot}
              className={`flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20`}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Restart System</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer timestamp */}
      <div className="p-4 text-xs text-white/30 text-center">
        {new Date().toLocaleString()} | Build: US-2.3.0-{Date.now().toString(36).slice(-4).toUpperCase()}
      </div>
    </div>
  );
};

// Helper function to trigger crashes programmatically
export const triggerCrash = (type: CrashType, options?: Partial<CrashData>) => {
  return {
    stopCode: type,
    ...options
  } as CrashData;
};
