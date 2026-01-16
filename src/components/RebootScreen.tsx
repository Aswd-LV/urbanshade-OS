import { useEffect, useState } from "react";

interface RebootScreenProps {
  onComplete: () => void;
}

export const RebootScreen = ({ onComplete }: RebootScreenProps) => {
  const [stage, setStage] = useState<"closing" | "black" | "starting">("closing");

  useEffect(() => {
    // Show "Restarting..." for 2 seconds
    const timer1 = setTimeout(() => setStage("black"), 2000);
    // Black screen for 3 seconds
    const timer2 = setTimeout(() => setStage("starting"), 5000);
    // Complete after brief logo flash
    const timer3 = setTimeout(() => onComplete(), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (stage === "closing") {
    return (
      <div className="fixed inset-0 bg-black">
        <p className="absolute top-4 left-4 text-white text-sm font-mono">
          Restarting...
        </p>
      </div>
    );
  }

  if (stage === "black") {
    return <div className="fixed inset-0 bg-black" />;
  }

  // Brief logo flash before completing
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <img 
        src="/favicon.svg" 
        alt="UrbanShade" 
        className="w-16 h-16 animate-pulse"
      />
    </div>
  );
};
