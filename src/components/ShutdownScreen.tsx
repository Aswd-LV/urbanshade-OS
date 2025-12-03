import { useEffect, useState } from "react";
import { Waves, Shield, Database, Lock } from "lucide-react";

interface ShutdownScreenProps {
  onComplete: () => void;
}

export const ShutdownScreen = ({ onComplete }: ShutdownScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const shutdownMessages = [
    "[  OK  ] Stopping Security Monitoring Service",
    "[  OK  ] Stopping Containment Systems",
    "[  OK  ] Stopping Network Scanners",
    "[  OK  ] Stopping Facility Monitoring",
    "[  OK  ] Unmounting /data/research",
    "[  OK  ] Unmounting /data/specimens",
    "[  OK  ] Unmounting /data/logs",
    "[  OK  ] Stopped Database Manager",
    "[  OK  ] Stopped Authentication Service",
    "[  OK  ] Encrypting session data...",
    "[  OK  ] Clearing temporary files",
    "[  OK  ] Reached target Shutdown",
    "[  OK  ] Powering down facility systems...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < shutdownMessages.length) {
        setMessages(prev => [...prev, shutdownMessages[index]]);
        setProgress(((index + 1) / shutdownMessages.length) * 100);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowFinalScreen(true), 800);
        // Never call onComplete - screen stays forever
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  if (showFinalScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 flex flex-col items-center justify-center text-white font-sans overflow-hidden">
        {/* Animated background waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 text-center space-y-8 animate-fade-in px-8 max-w-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="relative">
              <Waves className="w-20 h-20 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 w-20 h-20 bg-cyan-400 rounded-full blur-xl opacity-30 animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent">
              UrbanShade OS
            </span>
          </h1>

          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-light text-cyan-100/90">
              It's now safe to close this window
            </h2>
            <p className="text-lg text-cyan-200/60">
              All facility systems have been shut down successfully
            </p>
          </div>

          {/* Status indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-cyan-300/50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Data Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Session Ended</span>
            </div>
          </div>

          {/* Version info */}
          <div className="mt-16 pt-8 border-t border-cyan-500/20 text-sm text-cyan-400/40">
            <p>UrbanShade OS v2.2.1 • Facility Management System</p>
            <p className="mt-1">© 2024 UrbanShade Corporation. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center text-white font-mono">
      {/* Header */}
      <div className="absolute top-8 left-8 flex items-center gap-3 text-cyan-400/60">
        <Waves className="w-6 h-6" />
        <span className="text-sm font-medium">UrbanShade OS</span>
      </div>

      <div className="w-full max-w-3xl px-8">
        {/* Shutdown title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-cyan-100 mb-2">Shutting down...</h1>
          <p className="text-sm text-cyan-400/60">Please wait while facility systems are secured</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-thin">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className="text-sm text-cyan-400/80 animate-fade-in font-mono"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
