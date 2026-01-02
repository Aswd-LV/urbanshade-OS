import { Terminal, Activity, Send, Database, HardDrive, Shield, Skull, Cloud, Gavel, Cpu, Globe, Zap, Layers, Power, MemoryStick, Package } from "lucide-react";
import { TabId } from "./hooks/useDefDevState";

interface DefDevTabsProps {
  selectedTab: TabId;
  onTabChange: (tab: TabId) => void;
  bugcheckCount: number;
  crashEntry: boolean;
}

const DefDevTabs = ({ selectedTab, onTabChange, bugcheckCount, crashEntry }: DefDevTabsProps) => {
  const tabs = [
    { id: "console" as TabId, label: "Console", icon: Terminal, color: "cyan" },
    { id: "actions" as TabId, label: "Actions", icon: Activity, color: "purple" },
    { id: "terminal" as TabId, label: "Terminal", icon: Send, color: "green" },
    { id: "storage" as TabId, label: "Storage", icon: Database, color: "blue" },
    { id: "images" as TabId, label: "Recovery", icon: HardDrive, color: "orange" },
    { id: "bugchecks" as TabId, label: `Bugchecks${bugcheckCount > 0 ? ` (${bugcheckCount})` : ''}`, icon: Shield, color: "red" },
    { id: "performance" as TabId, label: "Performance", icon: Cpu, color: "teal" },
    { id: "network" as TabId, label: "Network", icon: Globe, color: "sky" },
    { id: "events" as TabId, label: "Events", icon: Zap, color: "yellow" },
    { id: "components" as TabId, label: "Components", icon: Layers, color: "indigo" },
    { id: "boot" as TabId, label: "Boot", icon: Power, color: "violet" },
    { id: "crashes" as TabId, label: "Crashes", icon: Skull, color: "rose" },
    { id: "memory" as TabId, label: "Memory", icon: MemoryStick, color: "emerald" },
    { id: "mods" as TabId, label: "Mods", icon: Package, color: "pink" },
    { id: "supabase" as TabId, label: "Supabase", icon: Cloud, color: "emerald" },
    { id: "fakemod" as TabId, label: "FakeMod", icon: Gavel, color: "rose" },
    { id: "admin" as TabId, label: "Admin", icon: Skull, color: "amber" },
  ];

  return (
    <div className="flex border-b-2 border-slate-800/80 bg-slate-950/50 overflow-x-auto justify-end">
      <div className="flex">
        {tabs.map(tab => {
          const isActive = selectedTab === tab.id;
          const isCrashTab = crashEntry && tab.id === "bugchecks";
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-all whitespace-nowrap ${
                isActive 
                  ? `border-amber-500 text-amber-400 bg-amber-500/10` 
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              } ${isCrashTab ? "ring-1 ring-red-500/50" : ""}`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
              <span className="font-medium">{tab.label}</span>
              {isCrashTab && (
                <span className="ml-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DefDevTabs;
