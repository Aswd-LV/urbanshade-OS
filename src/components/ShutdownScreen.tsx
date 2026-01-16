import { useEffect, useState } from "react";

interface ShutdownScreenProps {
  onComplete: () => void;
}

export const ShutdownScreen = ({ onComplete }: ShutdownScreenProps) => {
  const [stage, setStage] = useState<"closing" | "black" | "final">("closing");

  useEffect(() => {
    // Show "Shutting down..." for 2 seconds
    const timer1 = setTimeout(() => setStage("black"), 2000);
    // Black screen for 3 seconds
    const timer2 = setTimeout(() => setStage("final"), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (stage === "closing") {
    return (
      <div className="fixed inset-0 bg-black">
        <p className="absolute top-4 left-4 text-white text-sm font-mono">
          Shutting down...
        </p>
      </div>
    );
  }

  if (stage === "black") {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <p 
        className="text-amber-500 text-2xl tracking-wide"
        style={{ 
          fontFamily: '"Courier New", Courier, monospace',
          imageRendering: 'pixelated',
          textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
        }}
      >
        You may shut down your computer.
      </p>
      <p 
        className="text-slate-500 text-sm mt-8"
        style={{ fontFamily: '"Courier New", Courier, monospace' }}
      >
        Thank you for using Urbanshade OS.
      </p>
    </div>
  );
};
