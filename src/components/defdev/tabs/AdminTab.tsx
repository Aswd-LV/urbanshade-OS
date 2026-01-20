import { 
  Skull, Zap, RefreshCw, Power, Lock, HardDrive, AlertTriangle, 
  Trash2, Shield, Bug, Terminal, Database, Flame
} from "lucide-react";
import { commandQueue } from "@/lib/commandQueue";
import { toast } from "sonner";
import { useState } from "react";
import { systemBus } from "@/lib/systemBus";

// Penalty system - exported for AccountSettings
export interface UserPenalty {
  id: string;
  type: 'warn' | 'ban';
  reason: string;
  issuedAt: string;
  expiresAt?: string;
  issuedBy: string;
  acknowledged: boolean;
}

export const getUserPenalties = (): UserPenalty[] => {
  return JSON.parse(localStorage.getItem('urbanshade_user_penalties') || '[]');
};

export const addUserPenalty = (penalty: Omit<UserPenalty, 'id' | 'issuedAt' | 'acknowledged'>) => {
  const penalties = getUserPenalties();
  const newPenalty: UserPenalty = {
    ...penalty,
    id: `penalty_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    issuedAt: new Date().toISOString(),
    acknowledged: false,
  };
  penalties.unshift(newPenalty);
  localStorage.setItem('urbanshade_user_penalties', JSON.stringify(penalties));
  return newPenalty;
};

export const clearUserPenalties = () => {
  localStorage.removeItem('urbanshade_user_penalties');
};

const AdminTab = () => {
  const [showDanger, setShowDanger] = useState(false);

  // Quick actions - most used
  const quickActions = [
    { 
      name: "Reboot", 
      icon: RefreshCw, 
      desc: "Restart system",
      action: () => { commandQueue.queueReboot(); toast.success('Reboot queued'); } 
    },
    { 
      name: "Shutdown", 
      icon: Power, 
      desc: "Power off",
      action: () => { commandQueue.queueShutdown(); toast.success('Shutdown queued'); } 
    },
    { 
      name: "Recovery", 
      icon: HardDrive, 
      desc: "Enter recovery",
      action: () => { commandQueue.queueRecovery(); toast.success('Recovery queued'); } 
    },
    { 
      name: "DEF-DEV", 
      icon: Terminal, 
      desc: "Open console",
      action: () => { systemBus.openDevMode(); } 
    },
  ];

  // Bugcheck triggers
  const bugcheckActions = [
    { code: "DEV_TEST", desc: "Test bugcheck" },
    { code: "DATA_INCONSISTENCY_ERROR", desc: "Data validation fail" },
    { code: "SYSTEM_ERROR_HANDLE", desc: "Error handler fail" },
    { code: "RENDER_FAILURE", desc: "Render crash" },
    { code: "STATE_CORRUPTION", desc: "State corruption" },
    { code: "MEMORY_PRESSURE", desc: "Memory pressure" },
  ];

  // Crash triggers
  const crashTriggers = [
    { type: "KERNEL_PANIC", desc: "Kernel panic" },
    { type: "CRITICAL_PROCESS_DIED", desc: "Process died" },
    { type: "MEMORY_MANAGEMENT", desc: "Memory error" },
  ];

  // Lockdown protocols
  const lockdowns = [
    { name: "ALPHA", desc: "Standard" },
    { name: "BETA", desc: "Enhanced" },
    { name: "GAMMA", desc: "Critical" },
    { name: "OMEGA", desc: "Total" },
  ];

  // System info
  const getSystemInfo = () => ({
    storage: `${localStorage.length} keys`,
    memory: typeof (performance as any).memory !== 'undefined' 
      ? `${Math.round((performance as any).memory.usedJSHeapSize / 1048576)}MB` 
      : 'N/A',
    uptime: `${Math.floor(performance.now() / 60000)}m`,
  });

  const sysInfo = getSystemInfo();

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-amber-400">Admin</h2>
        </div>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>Storage: {sysInfo.storage}</span>
          <span>Memory: {sysInfo.memory}</span>
          <span>Uptime: {sysInfo.uptime}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs text-slate-500 uppercase mb-2">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map(action => (
            <button
              key={action.name}
              onClick={action.action}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-all group"
            >
              <action.icon className="w-5 h-5 mx-auto mb-1 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <div className="text-xs font-medium text-slate-300">{action.name}</div>
              <div className="text-[10px] text-slate-600">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bugcheck Triggers */}
      <div>
        <h3 className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-2">
          <Bug className="w-3 h-3" /> Bugchecks
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {bugcheckActions.map(bc => (
            <button
              key={bc.code}
              onClick={() => { 
                commandQueue.queueBugcheck(bc.code, bc.desc);
                toast.error(`Bugcheck: ${bc.code}`);
              }}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-left transition-all"
            >
              <div className="text-xs font-mono text-red-400 truncate">{bc.code}</div>
              <div className="text-[10px] text-slate-500">{bc.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Crash & Lockdown row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Crash Triggers */}
        <div>
          <h3 className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-2">
            <Skull className="w-3 h-3" /> Crashes
          </h3>
          <div className="space-y-1">
            {crashTriggers.map(crash => (
              <button
                key={crash.type}
                onClick={() => { 
                  commandQueue.queueCrash(crash.type);
                  toast.error(`Crash: ${crash.type}`);
                }}
                className="w-full p-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded text-left transition-all flex items-center justify-between"
              >
                <span className="text-xs text-orange-400">{crash.type}</span>
                <span className="text-[10px] text-slate-500">{crash.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lockdown Protocols */}
        <div>
          <h3 className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Lockdown
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {lockdowns.map(ld => (
              <button
                key={ld.name}
                onClick={() => { 
                  commandQueue.queueLockdown(ld.name);
                  toast.warning(`Lockdown ${ld.name}`);
                }}
                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-center transition-all"
              >
                <div className="text-sm font-bold text-amber-400">{ld.name}</div>
                <div className="text-[10px] text-slate-500">{ld.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/30 bg-red-500/5 rounded-lg overflow-hidden">
        <button 
          onClick={() => setShowDanger(!showDanger)}
          className="w-full p-3 flex items-center justify-between hover:bg-red-500/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Danger Zone</span>
          </div>
          <span className="text-xs text-red-400/50">{showDanger ? '▲' : '▼'}</span>
        </button>
        
        {showDanger && (
          <div className="p-3 pt-0 grid grid-cols-2 gap-2">
            <button
              onClick={() => { 
                if(confirm('WIPE ALL DATA?')) { 
                  commandQueue.queueWipe();
                  toast.error('Wipe queued');
                }
              }}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">Wipe Data</span>
            </button>

            <button
              onClick={() => { 
                if(confirm('NUCLEAR CRASH?')) { 
                  commandQueue.queueCrash('KERNEL_PANIC', 'admin.exe');
                  toast.error('Nuclear crash!');
                }
              }}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded flex items-center gap-2 transition-all"
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">Nuclear</span>
            </button>

            <button
              onClick={() => { 
                localStorage.clear();
                toast.error('Storage cleared');
                setTimeout(() => window.location.href = '/', 1000);
              }}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded flex items-center gap-2 transition-all col-span-2"
            >
              <Database className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">Clear LocalStorage & Reload</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTab;