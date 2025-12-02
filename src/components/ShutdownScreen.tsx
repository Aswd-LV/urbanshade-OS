import { useEffect, useState } from "react";

interface ShutdownScreenProps {
  onComplete: () => void;
}

export const ShutdownScreen = ({ onComplete }: ShutdownScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [showFinalScreen, setShowFinalScreen] = useState(false);

  const shutdownMessages = [
    "[  OK  ] Stopping Security Cameras",
    "[  OK  ] Stopping Containment Monitor",
    "[  OK  ] Stopping Network Scanner",
    "[  OK  ] Stopping System Monitor",
    "[  OK  ] Unmounting /data/research",
    "[  OK  ] Unmounting /data/specimens",
    "[  OK  ] Unmounting /data/logs",
    "[  OK  ] Stopped Database Manager",
    "[  OK  ] Stopped Authentication Service",
    "[  OK  ] Reached target Shutdown",
    "[  OK  ] Stopping Facility Monitor",
    "[  OK  ] Powering down...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < shutdownMessages.length) {
        setMessages(prev => [...prev, shutdownMessages[index]]);
        index++;
      } else {
        clearInterval(interval);
        // Show final Windows 95 style screen
        setTimeout(() => setShowFinalScreen(true), 500);
        // Complete shutdown after showing the message
        setTimeout(onComplete, 5000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (showFinalScreen) {
    return (
      <div className="fixed inset-0 bg-[#008080] flex flex-col items-center justify-center text-white font-sans">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-6xl mb-8">💤</div>
          <h1 className="text-5xl font-bold mb-6" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}>
            It's now safe to turn off
          </h1>
          <h1 className="text-5xl font-bold" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}>
            your computer.
          </h1>
          
          <div className="mt-16 text-lg opacity-80">
            <div className="mb-2">UrbanShade OS has shut down successfully.</div>
            <div className="text-sm opacity-70">You may now close this window 🌊</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white font-mono">
      <div className="w-full max-w-3xl px-8">
        <div className="space-y-1 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm text-green-400 animate-fade-in">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};