import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface CrashScreenProps {
  onReboot: () => void;
  killedProcess?: string;
  crashType?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload";
  customData?: { title: string; message: string } | null;
}

export const CrashScreen = ({ onReboot, killedProcess, crashType = "kernel", customData }: CrashScreenProps) => {
  const [showScreen, setShowScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setShowScreen(true);
    }, 2000);

    return () => {
      clearTimeout(showTimeout);
    };
  }, []);

  useEffect(() => {
    if (showScreen && crashType === "bluescreen") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showScreen, crashType]);

  if (!showScreen) {
    return <div className="fixed inset-0 bg-black" />;
  }

  // Custom crash screen
  if (customData) {
    const bgClass = crashType === "bluescreen" ? "bg-blue-600" :
                    crashType === "memory" ? "bg-gradient-to-br from-red-950 to-black" :
                    crashType === "corruption" ? "bg-black" :
                    crashType === "overload" ? "bg-gradient-to-br from-orange-950 to-black" :
                    crashType === "virus" ? "bg-gradient-to-br from-green-950 to-black" :
                    "bg-gradient-to-br from-slate-950 to-black";

    return (
      <div className={`fixed inset-0 ${bgClass} flex flex-col items-center justify-center text-white font-mono p-8 ${crashType === "virus" ? "animate-pulse" : ""}`}>
        <div className="max-w-4xl w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-4xl font-bold tracking-wider text-primary">
              {customData.title}
            </h1>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <pre className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {customData.message}
            </pre>
          </div>

          <div className="text-center space-y-2 text-xs text-muted-foreground">
            <div>Process: {killedProcess}</div>
            <div>Type: {crashType.toUpperCase()}</div>
            <div>Time: {new Date().toLocaleString()}</div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onReboot}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-lg shadow-lg hover:scale-105"
            >
              Restart System 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Blue Screen of Death (friendly version)
  if (crashType === "bluescreen") {
    return (
      <div className="fixed inset-0 bg-blue-600 text-white font-sans p-8 overflow-auto flex items-center justify-center">
        <div className="max-w-4xl w-full animate-fade-in">
          <div className="mb-8 text-[120px] leading-none">🙁</div>
          
          <div className="space-y-6 text-xl mb-8">
            <div className="text-3xl font-bold">Oops! Something went wrong</div>
            <div>Your simulated PC ran into a problem and needs to restart.</div>
            <div>We're collecting some error info, then we'll restart for you.</div>
          </div>

          <div className="text-4xl font-bold mb-8">{progress}% complete</div>

          <div className="space-y-4 text-lg mb-8 opacity-90">
            <div>If you want to know more, here's the technical stuff:</div>
            <div className="mt-4 text-2xl font-mono bg-blue-700/50 p-4 rounded-lg">
              PROCESS_STOPPED: {killedProcess || "system.core"}
            </div>
            <div className="text-sm opacity-70">
              (Don't worry, it's all simulated. Your real computer is fine! 😊)
            </div>
          </div>

          <button
            onClick={onReboot}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-lg shadow-xl"
          >
            Restart Now
          </button>
        </div>
      </div>
    );
  }

  // Memory error (friendly)
  if (crashType === "memory") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-950 to-black text-red-400 font-mono p-8 overflow-auto flex items-center justify-center">
        <div className="max-w-4xl w-full animate-fade-in">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">🧠</div>
            <div className="text-4xl font-bold text-red-500 mb-4">Memory Overload!</div>
            <div className="text-xl text-muted-foreground">The simulation ran out of pretend memory</div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6 space-y-4 mb-8">
            <div className="text-red-400 font-bold text-lg">What happened?</div>
            <div className="text-muted-foreground space-y-2">
              <div>• Process: {killedProcess || "memory.manager"}</div>
              <div>• Issue: Simulated memory corruption</div>
              <div>• Impact: System needs a quick restart</div>
              <div className="text-sm opacity-70 mt-4">(This is all pretend - your real RAM is doing great!)</div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onReboot}
              className="px-8 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all text-lg shadow-xl"
            >
              Clear Memory & Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // System overload (friendly)
  if (crashType === "overload") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-950 to-black text-orange-400 font-mono p-8 overflow-auto flex items-center justify-center">
        <div className="max-w-4xl w-full animate-fade-in">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">🔥</div>
            <div className="text-4xl font-bold text-orange-500 mb-4">System Overheated!</div>
            <div className="text-xl text-muted-foreground">Too much simulated processing power</div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-orange-500/30 p-6 space-y-4 mb-8">
            <div className="text-orange-400 font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Temperature Check
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>CPU Temperature:</span>
                <span className="text-red-500 font-bold">127°C (Simulated!)</span>
              </div>
              <div className="flex justify-between">
                <span>System Load:</span>
                <span className="text-orange-400 font-bold">100%</span>
              </div>
              <div className="flex justify-between">
                <span>Killed Process:</span>
                <span className="text-muted-foreground">{killedProcess || "power.management"}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4 opacity-70">
                Don't worry! This is just part of the simulation. Your real computer is running cool! ❄️
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onReboot}
              className="px-8 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-lg shadow-xl"
            >
              Cool Down & Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default kernel panic (friendly)
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 to-black text-primary font-mono p-8 overflow-auto flex items-center justify-center">
      <div className="max-w-4xl w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-6">⚠️</div>
          <div className="text-4xl font-bold text-destructive mb-4">System Stopped</div>
          <div className="text-xl text-muted-foreground">A critical process was ended</div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 space-y-4 mb-8">
          <div className="text-destructive font-bold text-lg">What happened?</div>
          <div className="text-muted-foreground space-y-2 text-sm">
            <div>• You stopped a critical system process: <span className="text-primary font-bold">{killedProcess || "system.core"}</span></div>
            <div>• The simulation can't continue without it</div>
            <div>• A restart will fix everything</div>
            <div className="text-xs opacity-70 mt-4">
              (Pro tip: Try not to end critical processes next time! 😅)
            </div>
          </div>
        </div>

        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-8">
          <div className="text-xs space-y-1 text-muted-foreground font-mono opacity-70">
            <div>[ERROR] Critical process terminated: {killedProcess || "system.core"}</div>
            <div>[ERROR] System integrity compromised</div>
            <div>[INFO] Restart required to restore normal operation</div>
            <div>[TIME] {new Date().toLocaleString()}</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onReboot}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-lg shadow-xl hover:scale-105"
          >
            Restart System
          </button>
        </div>
      </div>
    </div>
  );
};