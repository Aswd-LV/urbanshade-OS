import { useState, useEffect } from "react";
import { Ban, AlertTriangle, Clock, PartyPopper, Skull, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannedScreenProps {
  reason: string | null;
  expiresAt: Date | null;
  isFakeBan: boolean;
  onFakeBanDismiss?: () => void;
}

export const BannedScreen = ({ reason, expiresAt, isFakeBan, onFakeBanDismiss }: BannedScreenProps) => {
  const [showJoke, setShowJoke] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [glitchText, setGlitchText] = useState(false);

  // For fake bans, show the "just kidding" after 5 seconds
  useEffect(() => {
    if (isFakeBan) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowJoke(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFakeBan]);

  // Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = () => {
    if (!expiresAt) return null;
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  if (isFakeBan && showJoke) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-green-950 to-emerald-900 flex items-center justify-center z-[9999]">
        <div className="text-center p-8 max-w-lg animate-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
            <PartyPopper className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            JUST KIDDING! 🎉
          </h1>
          <p className="text-xl text-green-300 mb-6">
            You're not actually banned. This was a prank by an admin!
          </p>
          <p className="text-sm text-green-400/70 mb-8">
            "{reason || 'No reason given'}" - lol gottem
          </p>
          <Button 
            onClick={onFakeBanDismiss}
            className="bg-green-600 hover:bg-green-500 text-lg px-8 py-6"
          >
            Continue to UrbanShade OS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-red-950 via-slate-950 to-black flex items-center justify-center z-[9999] overflow-hidden">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
            style={{
              top: `${10 + i * 10}%`,
              left: 0,
              right: 0,
              animation: `pulse 2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Skulls in background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Skull className="w-[600px] h-[600px]" />
      </div>

      <div className="relative z-10 text-center p-8 max-w-2xl">
        {/* Ban icon with pulse effect */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-red-500/20 flex items-center justify-center border-4 border-red-500/50 animate-pulse">
            <Ban className="w-16 h-16 text-red-500" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-red-500/10 animate-ping" />
        </div>

        {/* Title with glitch effect */}
        <h1 
          className={`text-5xl font-bold text-red-500 mb-4 font-mono tracking-wider ${glitchText ? 'animate-pulse text-red-400' : ''}`}
          style={{ textShadow: glitchText ? '2px 0 cyan, -2px 0 magenta' : 'none' }}
        >
          ACCESS DENIED
        </h1>
        
        <div className="text-xl text-red-400 mb-8 font-mono">
          YOUR ACCOUNT HAS BEEN {expiresAt ? 'TEMPORARILY' : 'PERMANENTLY'} SUSPENDED
        </div>

        {/* Reason box */}
        <div className="bg-red-950/50 border-2 border-red-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 text-red-400 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-mono text-sm">VIOLATION REASON</span>
          </div>
          <p className="text-lg text-red-300">
            {reason || "No reason provided. Contact support for more information."}
          </p>
        </div>

        {/* Time remaining for temp bans */}
        {expiresAt && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTimeRemaining()}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Your access will be restored on {expiresAt.toLocaleString()}
            </p>
          </div>
        )}

        {/* ALL online features blocked notice */}
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold">ALL ONLINE FEATURES DISABLED</span>
          </div>
          <p className="text-xs text-amber-300/70">
            While banned, you cannot access Messages, Cloud Sync, Moderation Panel, 
            or any other features requiring cloud connectivity.
          </p>
        </div>

        {/* Contact info */}
        <div className="text-sm text-slate-500">
          <p className="mb-2">If you believe this is a mistake, please contact:</p>
          <a 
            href="mailto:support@urbanshade.app" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Mail className="w-4 h-4" />
            support@urbanshade.app
          </a>
        </div>

        {/* Fake ban countdown (hidden from user) */}
        {isFakeBan && !showJoke && (
          <div className="absolute bottom-4 right-4 text-xs text-slate-700 font-mono opacity-30">
            [{countdown}]
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};
