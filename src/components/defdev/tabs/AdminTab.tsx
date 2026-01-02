import { Skull, Zap, RefreshCw, Power, Lock, HardDrive, AlertTriangle, Trash2, Shield, Bomb, MonitorX, Cpu, MemoryStick, Flame, Bug, Radio, Wifi, WifiOff, Volume2, VolumeX, Sparkles, Ban, AlertOctagon, UserX, Clock, Gavel, Eye } from "lucide-react";
import { commandQueue } from "@/lib/commandQueue";
import { toast } from "sonner";
import { useState } from "react";

export interface UserPenalty {
  id: string;
  type: 'warn' | 'ban';
  reason: string;
  issuedAt: string;
  expiresAt?: string;
  issuedBy: string;
  acknowledged: boolean;
}

// Helper to get/set penalties
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

  const crashTypes = [
    { name: "KERNEL_PANIC", color: "red", icon: Skull, desc: "Fatal kernel error" },
    { name: "CRITICAL_PROCESS_DIED", color: "red", icon: MonitorX, desc: "Core process failed" },
    { name: "MEMORY_MANAGEMENT", color: "orange", icon: MemoryStick, desc: "Memory corruption" },
    { name: "SYSTEM_SERVICE_EXCEPTION", color: "orange", icon: Bug, desc: "Service failure" },
    { name: "DRIVER_IRQL_NOT_LESS_OR_EQUAL", color: "amber", icon: Cpu, desc: "Driver error" },
    { name: "PAGE_FAULT_IN_NONPAGED_AREA", color: "amber", icon: HardDrive, desc: "Page fault" },
    { name: "UNEXPECTED_KERNEL_MODE_TRAP", color: "red", icon: Zap, desc: "Kernel trap" },
    { name: "INACCESSIBLE_BOOT_DEVICE", color: "red", icon: HardDrive, desc: "Boot failure" },
  ];

  const lockdownProtocols = [
    { name: "ALPHA", color: "amber", desc: "Standard lockdown" },
    { name: "BETA", color: "orange", desc: "Enhanced security" },
    { name: "GAMMA", color: "red", desc: "Critical threat" },
    { name: "OMEGA", color: "purple", desc: "Total containment" },
  ];

  const systemActions = [
    { 
      name: "Reboot", 
      icon: RefreshCw, 
      color: "blue", 
      action: () => { commandQueue.queueReboot(); toast.success('Reboot queued'); } 
    },
    { 
      name: "Shutdown", 
      icon: Power, 
      color: "purple", 
      action: () => { commandQueue.queueShutdown(); toast.success('Shutdown queued'); } 
    },
    { 
      name: "Recovery", 
      icon: HardDrive, 
      color: "cyan", 
      action: () => { commandQueue.queueRecovery(); toast.success('Recovery queued'); } 
    },
    { 
      name: "Maintenance", 
      icon: Shield, 
      color: "emerald", 
      action: () => { 
        localStorage.setItem('urbanshade_maintenance', 'true');
        toast.success('Maintenance mode enabled');
        setTimeout(() => window.location.href = '/', 500);
      } 
    },
  ];

  const quickToggles = [
    { 
      name: "Network", 
      iconOn: Wifi, 
      iconOff: WifiOff, 
      key: "network_disabled",
      color: "cyan"
    },
    { 
      name: "Audio", 
      iconOn: Volume2, 
      iconOff: VolumeX, 
      key: "audio_disabled",
      color: "green"
    },
    { 
      name: "Effects", 
      iconOn: Sparkles, 
      iconOff: Eye, 
      key: "effects_disabled",
      color: "purple"
    },
  ];

  // Fake moderation actions
  const fakeWarnReasons = [
    "Inappropriate behavior in chat",
    "Spamming system notifications",
    "Unauthorized access attempt",
    "Violating facility protocols",
    "Misuse of admin privileges",
    "Harassment of personnel",
  ];

  const fakeBanReasons = [
    "Repeated policy violations",
    "Security breach attempt",
    "Unauthorized data access",
    "Sabotage of system operations",
    "Critical protocol violation",
    "Threat to facility security",
  ];

  const triggerFakeWarn = (reason?: string) => {
    const warnReason = reason || fakeWarnReasons[Math.floor(Math.random() * fakeWarnReasons.length)];
    const penalty = addUserPenalty({
      type: 'warn',
      reason: warnReason,
      issuedBy: 'SYSTEM_ADMIN',
    });
    toast.warning(`⚠️ Warning issued: ${warnReason}`, {
      duration: 5000,
      icon: <AlertOctagon className="w-5 h-5 text-amber-400" />,
    });
    return penalty;
  };

  const triggerFakeBan = (duration: 'temp' | 'permanent', reason?: string) => {
    const banReason = reason || fakeBanReasons[Math.floor(Math.random() * fakeBanReasons.length)];
    const expiresAt = duration === 'temp' 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      : undefined;
    
    const penalty = addUserPenalty({
      type: 'ban',
      reason: banReason,
      expiresAt,
      issuedBy: 'SYSTEM_ADMIN',
    });
    
    toast.error(`🚫 ${duration === 'temp' ? 'Temporary' : 'Permanent'} Ban issued: ${banReason}`, {
      duration: 5000,
      icon: <Ban className="w-5 h-5 text-red-400" />,
    });
    return penalty;
  };

  const moderationActions = [
    {
      name: "Issue Warning",
      icon: AlertOctagon,
      color: "amber",
      desc: "Add a warning to user record",
      action: () => triggerFakeWarn(),
    },
    {
      name: "Temp Ban (24h)",
      icon: Clock,
      color: "orange",
      desc: "Temporary 24-hour ban",
      action: () => triggerFakeBan('temp'),
    },
    {
      name: "Permanent Ban",
      icon: Ban,
      color: "red",
      desc: "Permanent account ban",
      action: () => triggerFakeBan('permanent'),
    },
    {
      name: "Clear Penalties",
      icon: Trash2,
      color: "green",
      desc: "Clear all penalties",
      action: () => {
        clearUserPenalties();
        toast.success('All penalties cleared');
      },
    },
  ];

  const viewPenalties = () => {
    const penalties = getUserPenalties();
    if (penalties.length === 0) {
      toast.info('No penalties on record');
    } else {
      toast.info(`${penalties.length} penalties on record. Check Account Status for details.`);
    }
  };

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30">
          <Skull className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-amber-400">Admin Control Center</h2>
          <p className="text-xs text-slate-500">Advanced system controls and crash triggers</p>
        </div>
      </div>

      {/* Fake Moderation Actions */}
      <div className="p-4 bg-purple-500/5 border border-purple-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-purple-400 flex items-center gap-2">
            <Gavel className="w-4 h-4" /> Moderation Actions (Fake)
          </h3>
          <button
            onClick={viewPenalties}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <Eye className="w-3 h-3" /> View Penalties
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moderationActions.map(action => (
            <button
              key={action.name}
              onClick={action.action}
              className={`p-3 rounded-xl border transition-all hover:scale-105 bg-${action.color}-500/10 hover:bg-${action.color}-500/20 border-${action.color}-500/30`}
            >
              <action.icon className={`w-5 h-5 mx-auto mb-2 text-${action.color}-400`} />
              <div className={`text-sm font-bold text-${action.color}-400 mb-1`}>{action.name}</div>
              <div className="text-[10px] text-slate-500">{action.desc}</div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 text-center">
          💡 These are simulated actions. View your status in Account Settings → Status
        </p>
      </div>

      {/* System Controls */}
      <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
          <Power className="w-4 h-4 text-blue-400" /> System Controls
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {systemActions.map(action => (
            <button
              key={action.name}
              onClick={action.action}
              className={`p-4 rounded-xl border transition-all hover:scale-105 flex flex-col items-center gap-2 bg-${action.color}-500/10 hover:bg-${action.color}-500/20 border-${action.color}-500/30 text-${action.color}-400`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lockdown Protocols */}
      <div className="p-4 bg-orange-500/5 border border-orange-500/30 rounded-xl">
        <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Lockdown Protocols
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {lockdownProtocols.map(protocol => (
            <button
              key={protocol.name}
              onClick={() => { commandQueue.queueLockdown(protocol.name); toast.warning(`Lockdown ${protocol.name} queued`); }}
              className={`p-3 rounded-xl border transition-all hover:scale-105 bg-${protocol.color}-500/10 hover:bg-${protocol.color}-500/20 border-${protocol.color}-500/30`}
            >
              <div className={`text-lg font-black text-${protocol.color}-400 mb-1`}>{protocol.name}</div>
              <div className="text-xs text-slate-500">{protocol.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Crash Triggers */}
      <div className="p-4 bg-red-500/5 border border-red-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-red-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Crash Triggers
          </h3>
          <span className="text-xs text-red-400/50">⚠️ Will crash the system</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {crashTypes.map(crash => (
            <button
              key={crash.name}
              onClick={() => { commandQueue.queueCrash(crash.name); toast.error(`Crash queued: ${crash.name}`); }}
              className={`p-3 rounded-xl border transition-all hover:scale-105 bg-${crash.color}-500/10 hover:bg-${crash.color}-500/20 border-${crash.color}-500/40 text-left`}
            >
              <div className="flex items-center gap-2 mb-1">
                <crash.icon className={`w-4 h-4 text-${crash.color}-400`} />
                <span className={`text-xs font-bold text-${crash.color}-400`}>{crash.name.slice(0, 12)}...</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">{crash.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-400" /> Quick Toggles (Simulated)
        </h3>
        <div className="flex gap-3">
          {quickToggles.map(toggle => {
            const isDisabled = localStorage.getItem(toggle.key) === 'true';
            const Icon = isDisabled ? toggle.iconOff : toggle.iconOn;
            return (
              <button
                key={toggle.name}
                onClick={() => {
                  const newState = !isDisabled;
                  localStorage.setItem(toggle.key, String(newState));
                  toast.info(`${toggle.name}: ${newState ? 'Disabled' : 'Enabled'}`);
                }}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  isDisabled 
                    ? 'bg-slate-800 border-slate-700 text-slate-500' 
                    : `bg-${toggle.color}-500/20 border-${toggle.color}-500/40 text-${toggle.color}-400`
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-medium">{toggle.name}</div>
                <div className="text-[10px] opacity-50">{isDisabled ? 'OFF' : 'ON'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-900/10 border-2 border-red-500/40 rounded-xl">
        <button 
          onClick={() => setShowDanger(!showDanger)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <h3 className="font-bold text-red-400">Danger Zone</h3>
          </div>
          <span className="text-xs text-red-400/50">{showDanger ? 'Click to hide' : 'Click to reveal'}</span>
        </button>
        
        {showDanger && (
          <div className="mt-4 pt-4 border-t border-red-500/30 space-y-3 animate-fade-in">
            <button
              onClick={() => { 
                if(confirm('⚠️ WIPE ALL SYSTEM DATA?\n\nThis action cannot be undone!')) { 
                  commandQueue.queueWipe(); 
                  toast.error('System wipe queued'); 
                }
              }}
              className="w-full p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-400 flex items-center justify-center gap-3 transition-all group"
            >
              <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
              <span className="font-bold">Wipe All System Data</span>
            </button>

            <button
              onClick={() => { 
                if(confirm('⚠️ TRIGGER NUCLEAR CRASH?\n\nThis will crash with KERNEL_PANIC!')) { 
                  commandQueue.queueCrash('KERNEL_PANIC', 'admin.exe'); 
                  toast.error('Nuclear crash triggered!'); 
                }
              }}
              className="w-full p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-400 flex items-center justify-center gap-3 transition-all group"
            >
              <Bomb className="w-5 h-5 group-hover:animate-spin" />
              <span className="font-bold">Nuclear Crash</span>
            </button>

            <button
              onClick={() => { 
                localStorage.clear();
                toast.error('All storage cleared - reloading...');
                setTimeout(() => window.location.href = '/', 1000);
              }}
              className="w-full p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-400 flex items-center justify-center gap-3 transition-all group"
            >
              <Flame className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-bold">Clear LocalStorage & Reload</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTab;