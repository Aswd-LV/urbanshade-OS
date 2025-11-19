import { useState, useEffect } from "react";

interface BiosScreenProps {
  onExit: () => void;
}

export const BiosScreen = ({ onExit }: BiosScreenProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onExit]);

  const tabs = ["Main", "Advanced", "Boot", "Security", "Exit"];

  return (
    <div className="h-screen w-full bg-[#0000AA] text-white font-mono flex flex-col p-4">
      <div className="text-center border-b border-white pb-2 mb-4">
        <h1 className="text-xl font-bold">URBANSHADE BIOS SETUP UTILITY</h1>
        <p className="text-sm">Version 3.2.1 - Copyright (C) 2024</p>
      </div>

      <div className="flex border-b border-white mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(i)}
            className={`px-4 py-2 ${selectedTab === i ? 'bg-cyan-400 text-black' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-2">
          <div className="bg-cyan-400 text-black px-2">System Information</div>
          <div>BIOS Version: 3.2.1</div>
          <div>CPU: Urbanshade Quantum Core</div>
          <div>Memory: 32GB DDR5</div>
          <div>Boot Device: HDD-0</div>
        </div>
        <div className="space-y-2">
          <div className="bg-cyan-400 text-black px-2">System Time</div>
          <div>{new Date().toLocaleString()}</div>
        </div>
      </div>

      <div className="border-t border-white pt-2 text-center">
        <p>Exiting BIOS in {countdown} seconds...</p>
        <p className="text-xs mt-2">F1=Help | F10=Save & Exit | ESC=Exit</p>
      </div>
    </div>
  );
};
