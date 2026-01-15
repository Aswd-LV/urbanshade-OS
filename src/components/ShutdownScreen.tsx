import { useEffect, useState } from "react";

interface ShutdownScreenProps {
  onComplete: () => void;
}

export const ShutdownScreen = ({ onComplete }: ShutdownScreenProps) => {
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar quickly
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setShowFinalScreen(true), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, []);

  if (showFinalScreen) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p 
          className="text-amber-500 text-2xl tracking-wide"
          style={{ 
            fontFamily: '"Courier New", Courier, monospace',
            imageRendering: 'pixelated',
            textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
          }}
        >
          It is now safe to turn off your computer.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      {/* Logo */}
      <img 
        src="/favicon.svg" 
        alt="UrbanShade" 
        className="w-16 h-16 mb-8 animate-pulse"
      />
      
      {/* Shutting down text */}
      <p className="text-slate-400 text-sm mb-4">Shutting down...</p>
      
      {/* Progress bar */}
      <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cyan-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
