import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface LogoutScreenProps {
  onComplete: () => void;
  username?: string;
}

export const LogoutScreen = ({ onComplete, username = "User" }: LogoutScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);

  const steps = [
    "Signing out...",
    "Saving user preferences...",
    "Closing active sessions...",
    "Clearing secure cache...",
    "Disconnecting from services...",
    "Goodbye!"
  ];

  useEffect(() => {
    // Fade in logo
    setTimeout(() => setLogoVisible(true), 100);
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setCurrentStep(step);
        setProgress(((step + 1) / steps.length) * 100);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className={`mb-8 transition-opacity duration-500 ${logoVisible ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src="/favicon.png" 
            alt="UrbanShade" 
            className="w-20 h-20"
          />
        </div>

        {/* User info */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-cyan-400/70" />
          </div>
          <span className="text-lg font-medium text-cyan-400/80">{username}</span>
        </div>

        {/* Status text */}
        <p className="text-cyan-500/60 text-sm font-mono mb-8">
          {steps[currentStep]}
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Status on the right */}
        <div className="flex justify-end px-4 mb-1">
          <span className="text-xs text-cyan-500/50 font-mono">
            {Math.round(progress)}%
          </span>
        </div>
        
        {/* Thin blue progress bar */}
        <div className="h-1 bg-slate-900">
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
