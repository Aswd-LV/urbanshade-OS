import { useState, useEffect } from "react";
import { Cpu, X, Activity, MemoryStick, HardDrive, Wifi, TrendingUp, AlertTriangle } from "lucide-react";

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: string;
  status: "running" | "sleeping" | "critical";
  priority: "high" | "normal" | "low";
  isApp?: boolean;
  appId?: string;
}

interface TaskManagerProps {
  windows: Array<{ id: string; app: { id: string; name: string } }>;
  onCloseWindow: (id: string) => void;
  onCriticalKill: (processName: string, type?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void;
}

export const TaskManager = ({ windows, onCloseWindow, onCriticalKill }: TaskManagerProps) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    // Only critical system processes
    const systemProcesses: Process[] = [
      { pid: 1, name: "urbcore.dll", cpu: 12, memory: "2.4 GB", status: "critical", priority: "high" },
      { pid: 2, name: "security.sys", cpu: 8, memory: "1.2 GB", status: "critical", priority: "high" },
      { pid: 3, name: "pressure_monitor", cpu: 15, memory: "890 MB", status: "critical", priority: "high" },
    ];

    // Convert open windows to processes
    const appProcesses: Process[] = windows.map((window, index) => ({
      pid: 1000 + index,
      name: window.app.name,
      cpu: Math.random() * 15 + 5,
      memory: `${Math.floor(Math.random() * 300 + 100)} MB`,
      status: "running" as const,
      priority: "normal" as const,
      isApp: true,
      appId: window.id
    }));

    setProcesses([...systemProcesses, ...appProcesses]);

    // Simulate CPU fluctuations
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(proc => ({
        ...proc,
        cpu: Math.max(1, proc.cpu + (Math.random() - 0.5) * 4)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, [windows]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-destructive";
      case "running": return "text-primary";
      case "sleeping": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "normal": return "text-primary";
      case "low": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  const [selectedView, setSelectedView] = useState<"processes" | "performance">("processes");
  const totalCpu = processes.reduce((sum, proc) => sum + proc.cpu, 0).toFixed(1);
  const totalMemory = "32 GB";
  const usedMemory = "18.4 GB";
  const memoryPercent = ((18.4 / 32) * 100).toFixed(0);

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Sidebar Navigation */}
      <div className="w-56 border-r border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-sm">Task Manager</div>
              <div className="text-xs text-gray-400">Urbanshade OS</div>
            </div>
          </div>
        </div>

        <div className="p-2">
          <button
            onClick={() => setSelectedView("processes")}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-all flex items-center gap-3 ${
              selectedView === "processes" 
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span className="text-sm font-medium">Processes</span>
          </button>

          <button
            onClick={() => setSelectedView("performance")}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
              selectedView === "performance" 
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Performance</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-slate-900/80">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">CPU</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${Math.min(100, parseFloat(totalCpu))}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">{totalCpu}%</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Memory</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${memoryPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-purple-400">{memoryPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedView === "processes" ? (
          <>
            {/* Processes Header */}
            <div className="p-4 border-b border-white/10 bg-slate-900/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Processes</h2>
                  <p className="text-sm text-gray-400">{processes.length} processes running</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
                    {processes.filter(p => p.status === "critical").length} CRITICAL
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <div>
                  <div className="font-bold mb-1">⚠️ WARNING</div>
                  <div className="text-amber-400/80">Ending critical system processes will cause system instability or immediate crash.</div>
                </div>
              </div>
            </div>

            {/* Process List */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-800/80 backdrop-blur-sm border-b border-white/10">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium text-xs text-gray-400 uppercase">Name</th>
                    <th className="px-4 py-3 font-medium text-xs text-gray-400 uppercase">PID</th>
                    <th className="px-4 py-3 font-medium text-xs text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 font-medium text-xs text-gray-400 uppercase">CPU</th>
                    <th className="px-4 py-3 font-medium text-xs text-gray-400 uppercase">Memory</th>
                    <th className="px-4 py-3 font-medium text-xs text-gray-400 uppercase"></th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((proc) => (
                    <tr
                      key={proc.pid}
                      onClick={() => setSelected(proc.pid)}
                      className={`border-b border-white/5 cursor-pointer transition-all ${
                        selected === proc.pid 
                          ? "bg-cyan-500/10" 
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {proc.status === "critical" && (
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          )}
                          <span className="font-medium">{proc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-400">{proc.pid}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          proc.status === "critical" ? "bg-red-500/20 text-red-400" :
                          proc.status === "running" ? "bg-green-500/20 text-green-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {proc.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm font-bold ${
                            proc.cpu > 15 ? "text-red-400" : 
                            proc.cpu > 10 ? "text-amber-400" : 
                            "text-cyan-400"
                          }`}>
                            {proc.cpu.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-400">{proc.memory}</td>
                      <td className="px-4 py-3">
                        <button
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all group"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (proc.status === "critical") {
                              const crashTypes: Array<"kernel" | "memory" | "overload"> = ["kernel", "memory", "overload"];
                              const randomType = crashTypes[Math.floor(Math.random() * crashTypes.length)];
                              onCriticalKill(proc.name, randomType);
                            } else if (proc.isApp && proc.appId) {
                              onCloseWindow(proc.appId);
                            }
                          }}
                        >
                          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-6">Performance</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* CPU Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-cyan-500/20">
                    <Cpu className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">CPU</div>
                    <div className="text-3xl font-bold text-cyan-400">{totalCpu}%</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Utilization</span>
                    <span className="font-mono text-cyan-400">{totalCpu}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                      style={{ width: `${Math.min(100, parseFloat(totalCpu))}%` }}
                    />
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400">Processes</div>
                        <div className="font-mono font-bold text-cyan-400">{processes.length}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Threads</div>
                        <div className="font-mono font-bold text-cyan-400">{processes.length * 4}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <MemoryStick className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Memory</div>
                    <div className="text-3xl font-bold text-purple-400">{usedMemory}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">In use</span>
                    <span className="font-mono text-purple-400">{usedMemory} / {totalMemory}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${memoryPercent}%` }}
                    />
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400">Available</div>
                        <div className="font-mono font-bold text-purple-400">13.6 GB</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Cached</div>
                        <div className="font-mono font-bold text-purple-400">4.2 GB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disk Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <HardDrive className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Disk (C:)</div>
                    <div className="text-3xl font-bold text-green-400">12%</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active time</span>
                    <span className="font-mono text-green-400">12%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[12%] transition-all" />
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400">Read speed</div>
                        <div className="font-mono font-bold text-green-400">24 MB/s</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Write speed</div>
                        <div className="font-mono font-bold text-green-400">18 MB/s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Wifi className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Network</div>
                    <div className="text-3xl font-bold text-blue-400">5%</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Utilization</span>
                    <span className="font-mono text-blue-400">5%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[5%] transition-all" />
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400">Send</div>
                        <div className="font-mono font-bold text-blue-400">1.2 Mbps</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Receive</div>
                        <div className="font-mono font-bold text-blue-400">8.4 Mbps</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
