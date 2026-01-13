import { useEffect, useState } from "react";

interface RebootScreenProps {
  onComplete: () => void;
}

export const RebootScreen = ({ onComplete }: RebootScreenProps) => {
  const [messages, setMessages] = useState<{ text: string; status: 'pending' | 'done' }[]>([]);
  const [stage, setStage] = useState<"shutting" | "black" | "starting">("shutting");
  const [logoVisible, setLogoVisible] = useState(false);

  const rebootMessages = [
    { text: "Stopping all processes", duration: 300 },
    { text: "Closing active sessions", duration: 400 },
    { text: "Unmounting file systems", duration: 350 },
    { text: "Stopping containment systems", duration: 450 },
    { text: "Stopping security services", duration: 300 },
    { text: "Stopping network services", duration: 350 },
    { text: "Flushing system cache", duration: 250 },
    { text: "Preparing for restart", duration: 400 },
  ];

  useEffect(() => {
    // Fade in logo
    setTimeout(() => setLogoVisible(true), 100);
    
    let currentIndex = 0;
    
    const showNextMessage = () => {
      if (currentIndex < rebootMessages.length) {
        const item = rebootMessages[currentIndex];
        // Add message as pending
        setMessages(prev => [...prev, { text: item.text, status: 'pending' }]);
        
        // Mark as done after duration
        setTimeout(() => {
          setMessages(prev => 
            prev.map((m, i) => i === currentIndex ? { ...m, status: 'done' } : m)
          );
          currentIndex++;
          setTimeout(showNextMessage, 100);
        }, item.duration);
      } else {
        // All messages done, transition to black
        setTimeout(() => {
          setStage("black");
          setTimeout(() => {
            setStage("starting");
            setTimeout(onComplete, 800);
          }, 1000);
        }, 500);
      }
    };

    setTimeout(showNextMessage, 500);
  }, [onComplete]);

  if (stage === "black") {
    return <div className="fixed inset-0 bg-black" />;
  }

  if (stage === "starting") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <img 
          src="/favicon.png" 
          alt="UrbanShade" 
          className="w-20 h-20 animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Logo */}
        <div className={`mb-10 transition-opacity duration-500 ${logoVisible ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src="/favicon.png" 
            alt="UrbanShade" 
            className="w-20 h-20"
          />
        </div>

        {/* Status title */}
        <h2 className="text-cyan-400 text-lg font-medium mb-6">Restarting...</h2>

        {/* Messages list */}
        <div className="w-full max-w-sm space-y-2">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 px-4 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 animate-fade-in"
            >
              {msg.status === 'done' ? (
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
              ) : (
                <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
              )}
              <span className={`text-sm font-mono ${msg.status === 'done' ? 'text-slate-400' : 'text-cyan-300'}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="pb-6 text-center">
        <p className="text-xs text-slate-600 font-mono">
          Press DEL to enter BIOS Setup
        </p>
      </div>
    </div>
  );
};
