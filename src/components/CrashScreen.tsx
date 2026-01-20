import { useEffect, useState } from "react";
import { RefreshCw, AlertTriangle, Terminal, ArrowRight } from "lucide-react";

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

// Crash info mapping
const CRASH_INFO: Record<CrashType, { 
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}> = {
  KERNEL_PANIC: { title: "Kernel Panic", description: "The system kernel encountered a fatal error.", severity: 'critical' },
  CRITICAL_PROCESS_DIED: { title: "Critical Process Died", description: "A critical system process has stopped unexpectedly.", severity: 'critical' },
  SYSTEM_SERVICE_EXCEPTION: { title: "System Service Exception", description: "A system service encountered an unexpected error.", severity: 'high' },
  MEMORY_MANAGEMENT: { title: "Memory Error", description: "A memory allocation or management failure occurred.", severity: 'high' },
  IRQL_NOT_LESS_OR_EQUAL: { title: "IRQL Violation", description: "A process accessed memory at an invalid interrupt level.", severity: 'high' },
  PAGE_FAULT_IN_NONPAGED_AREA: { title: "Page Fault", description: "Invalid memory was referenced in a non-paged area.", severity: 'high' },
  DRIVER_IRQL_NOT_LESS_OR_EQUAL: { title: "Driver Error", description: "A driver accessed memory incorrectly.", severity: 'medium' },
  SYSTEM_THREAD_EXCEPTION_NOT_HANDLED: { title: "Thread Exception", description: "A system thread generated an unhandled exception.", severity: 'high' },
  UNEXPECTED_KERNEL_MODE_TRAP: { title: "Kernel Trap", description: "The kernel encountered an unexpected trap.", severity: 'critical' },
  KMODE_EXCEPTION_NOT_HANDLED: { title: "Kernel Exception", description: "A kernel mode exception was not caught.", severity: 'critical' },
  INACCESSIBLE_BOOT_DEVICE: { title: "Boot Failure", description: "The system cannot access the boot device.", severity: 'critical' },
  VIDEO_TDR_FAILURE: { title: "Display Timeout", description: "The display driver failed to respond in time.", severity: 'medium' },
  WHEA_UNCORRECTABLE_ERROR: { title: "Hardware Error", description: "A fatal hardware error has occurred.", severity: 'critical' },
  DPC_WATCHDOG_VIOLATION: { title: "Watchdog Timeout", description: "A deferred procedure call exceeded timeout.", severity: 'high' },
  CLOCK_WATCHDOG_TIMEOUT: { title: "Clock Timeout", description: "Processor clock interrupt was not received.", severity: 'high' },
  custom: { title: "System Error", description: "The system encountered an error.", severity: 'medium' }
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
  const [countdown, setCountdown] = useState(30);

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

  const info = CRASH_INFO[resolvedCrashData.stopCode] || CRASH_INFO.custom;
  const severityColor = info.severity === 'critical' ? 'text-red-500' : info.severity === 'high' ? 'text-orange-500' : 'text-yellow-500';

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("ready");
          return 100;
        }
        return prev + Math.random() * 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onReboot();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, onReboot]);

  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-200 font-mono flex flex-col z-[9999]">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className={`w-5 h-5 ${severityColor}`} />
          <span className="font-semibold">UrbanShade Error</span>
        </div>
        <div className="text-xs text-slate-500">{new Date().toLocaleTimeString()}</div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-xl w-full space-y-8">
          {/* Error code */}
          <div className="space-y-2">
            <div className={`text-sm font-medium ${severityColor} uppercase tracking-wider`}>
              {info.severity} Error
            </div>
            <h1 className="text-3xl font-bold text-white">
              {customData?.title || info.title}
            </h1>
            <p className="text-slate-400 leading-relaxed">
              {customData?.message || info.description}
            </p>
          </div>

          {/* Stop code box */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Stop Code</span>
              <code className="text-cyan-400">{resolvedCrashData.stopCode}</code>
            </div>
            {resolvedCrashData.process && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Process</span>
                <code className="text-slate-300">{resolvedCrashData.process}</code>
              </div>
            )}
            {resolvedCrashData.module && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Module</span>
                <code className="text-slate-300">{resolvedCrashData.module}</code>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {phase === "collecting" ? "Collecting diagnostic data..." : "Ready to restart"}
              </span>
              <span className="text-slate-500">{Math.min(100, Math.floor(progress))}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 transition-all duration-100"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          {phase === "ready" && (
            <div className="flex items-center gap-4">
              <button
                onClick={onReboot}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Restart Now
              </button>
              <span className="text-sm text-slate-500">
                Auto-restart in {countdown}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600">
        <span>UrbanShade OS</span>
        <span>Error reference: US-{Date.now().toString(36).slice(-6).toUpperCase()}</span>
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