import { useEffect, useState } from "react";
import { Waves, User } from "lucide-react";

interface LogoutScreenProps {
  onComplete: () => void;
  username?: string;
}

export const LogoutScreen = ({ onComplete, username = "User" }: LogoutScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Signing out...");

  const statuses = [
    "Signing out...",
    "Saving user preferences...",
    "Closing active sessions...",
    "Clearing secure cache...",
    "Disconnecting from services...",
    "Goodbye!"
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < statuses.length) {
        setStatus(statuses[step]);
        setProgress(((step + 1) / statuses.length) * 100);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex flex-col items-center justify-center">
      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <Waves className="w-16 h-16 text-cyan-400" />
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <User className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-xl font-bold text-cyan-400">{username}</span>
        </div>

        {/* Status */}
        <p className="text-cyan-300 mb-8 text-lg">{status}</p>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Spinner */}
        <div className="mt-8">
          <div className="w-8 h-8 mx-auto border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-slate-600">
        UrbanShade OS v2.9
      </div>
    </div>
  );
};
