import { useState, useEffect, useMemo } from "react";
import { 
  Cpu, X, Activity, MemoryStick, HardDrive, Wifi, 
  TrendingUp, AlertTriangle, Search, ArrowUpDown,
  ChevronDown, Thermometer, Gauge, BarChart3, RefreshCw
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  memoryStr: string;
  status: "running" | "sleeping" | "critical";
  priority: "high" | "normal" | "low";
  isApp?: boolean;
  appId?: string;
  threads: number;
}

interface TaskManagerProps {
  windows: Array<{ id: string; app: { id: string; name: string } }>;
  onCloseWindow: (id: string) => void;
  onCriticalKill: (processName: string, type?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void;
}

type SortKey = "name" | "cpu" | "memory" | "pid";
type ViewType = "processes" | "performance" | "details";

export const TaskManager = ({ windows, onCloseWindow, onCriticalKill }: TaskManagerProps) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<ViewType>("processes");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("cpu");
  const [sortAsc, setSortAsc] = useState(false);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(30).fill(0));
  const [memHistory, setMemHistory] = useState<number[]>(Array(30).fill(0));

  // System metrics
  const [systemMetrics, setSystemMetrics] = useState({
    cpuTemp: 42,
    gpuTemp: 38,
    fanSpeed: 1200,
    uptime: 0
  });

  useEffect(() => {
    // Critical system processes
    const systemProcesses: Process[] = [
      { pid: 1, name: "urbcore.dll", cpu: 12, memory: 2400, memoryStr: "2.4 GB", status: "critical", priority: "high", threads: 24 },
      { pid: 2, name: "security.sys", cpu: 8, memory: 1200, memoryStr: "1.2 GB", status: "critical", priority: "high", threads: 16 },
      { pid: 3, name: "pressure_monitor", cpu: 15, memory: 890, memoryStr: "890 MB", status: "critical", priority: "high", threads: 8 },
      { pid: 4, name: "navi-daemon", cpu: 3, memory: 256, memoryStr: "256 MB", status: "running", priority: "normal", threads: 4 },
      { pid: 5, name: "theme-engine", cpu: 1, memory: 128, memoryStr: "128 MB", status: "sleeping", priority: "low", threads: 2 },
      { pid: 6, name: "sync-service", cpu: 2, memory: 64, memoryStr: "64 MB", status: "running", priority: "normal", threads: 2 },
      { pid: 7, name: "notification-hub", cpu: 1, memory: 48, memoryStr: "48 MB", status: "running", priority: "normal", threads: 1 },
    ];

    // Convert open windows to processes
    const appProcesses: Process[] = windows.map((window, index) => {
      const memMB = Math.floor(Math.random() * 300 + 100);
      return {
        pid: 1000 + index,
        name: window.app.name,
        cpu: Math.random() * 15 + 5,
        memory: memMB,
        memoryStr: `${memMB} MB`,
        status: "running" as const,
        priority: "normal" as const,
        isApp: true,
        appId: window.id,
        threads: Math.floor(Math.random() * 8) + 2
      };
    });

    setProcesses([...systemProcesses, ...appProcesses]);

    // Simulate CPU fluctuations and history
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(proc => ({
        ...proc,
        cpu: Math.max(0.5, Math.min(99, proc.cpu + (Math.random() - 0.5) * 6))
      })));

      // Update history
      setCpuHistory(prev => {
        const totalCpu = processes.reduce((sum, proc) => sum + proc.cpu, 0);
        return [...prev.slice(1), Math.min(100, totalCpu)];
      });
      setMemHistory(prev => [...prev.slice(1), 57.5 + (Math.random() - 0.5) * 3]);

      // Update system metrics
      setSystemMetrics(prev => ({
        cpuTemp: Math.floor(40 + Math.random() * 15),
        gpuTemp: Math.floor(35 + Math.random() * 10),
        fanSpeed: Math.floor(1000 + Math.random() * 500),
        uptime: prev.uptime + 1
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [windows]);

  const totalCpu = useMemo(() => processes.reduce((sum, proc) => sum + proc.cpu, 0), [processes]);
  const totalMemory = 32768; // 32 GB in MB
  const usedMemory = 18841; // ~18.4 GB in MB
  const memoryPercent = ((usedMemory / totalMemory) * 100);

  const filteredProcesses = useMemo(() => {
    let result = processes.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    
    return result;
  }, [processes, searchQuery, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const MiniGraph = ({ data, color }: { data: number[]; color: string }) => (
    <svg className="w-full h-12" viewBox="0 0 100 40" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0 40 ${data.map((v, i) => `L ${(i / (data.length - 1)) * 100} ${40 - (v / 100) * 40}`).join(' ')} L 100 40 Z`}
        fill={`url(#gradient-${color})`}
      />
      <path
        d={`M ${data.map((v, i) => `${(i / (data.length - 1)) * 100} ${40 - (v / 100) * 40}`).join(' L ')}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-52 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">Task Manager</div>
              <div className="text-[10px] text-muted-foreground">System Monitor</div>
            </div>
          </div>
        </div>

        <div className="p-2 space-y-1">
          {[
            { id: "processes" as const, icon: Cpu, label: "Processes" },
            { id: "performance" as const, icon: TrendingUp, label: "Performance" },
            { id: "details" as const, icon: BarChart3, label: "Details" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedView === item.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-auto p-3 border-t border-border space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">CPU</span>
              <span className="font-mono text-primary">{totalCpu.toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(100, totalCpu)} className="h-1.5" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Memory</span>
              <span className="font-mono text-purple-400">{memoryPercent.toFixed(0)}%</span>
            </div>
            <Progress value={memoryPercent} className="h-1.5 [&>div]:bg-purple-500" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {selectedView === "processes" && (
          <>
            {/* Search & controls */}
            <div className="p-3 border-b border-border flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search processes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{processes.length} processes</span>
                <span className="px-2 py-1 rounded bg-destructive/10 text-destructive font-medium">
                  {processes.filter(p => p.status === "critical").length} critical
                </span>
              </div>
            </div>

            {/* Warning banner */}
            <div className="mx-3 mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Ending critical processes will cause system instability</span>
            </div>

            {/* Process table */}
            <ScrollArea className="flex-1 mt-2">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border">
                  <tr>
                    {[
                      { key: "name" as const, label: "Name", width: "flex-1" },
                      { key: "pid" as const, label: "PID", width: "w-16" },
                      { key: "cpu" as const, label: "CPU", width: "w-24" },
                      { key: "memory" as const, label: "Memory", width: "w-24" },
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={`px-3 py-2 text-left font-medium text-xs text-muted-foreground cursor-pointer hover:text-foreground ${col.width}`}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {sortKey === col.key && (
                            <ArrowUpDown className={`w-3 h-3 ${sortAsc ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {filteredProcesses.map(proc => (
                    <tr
                      key={proc.pid}
                      onClick={() => setSelected(proc.pid)}
                      className={`border-b border-border/50 cursor-pointer transition-colors ${
                        selected === proc.pid ? 'bg-primary/10' : 'hover:bg-muted/30'
                      }`}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {proc.status === "critical" && (
                            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                          )}
                          <span className={proc.status === "critical" ? "text-destructive font-medium" : ""}>
                            {proc.name}
                          </span>
                          {proc.isApp && (
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary">APP</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{proc.pid}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                proc.cpu > 50 ? 'bg-destructive' : proc.cpu > 25 ? 'bg-amber-500' : 'bg-primary'
                              }`}
                              style={{ width: `${Math.min(100, proc.cpu)}%` }}
                            />
                          </div>
                          <span className={`font-mono text-xs ${
                            proc.cpu > 50 ? 'text-destructive' : proc.cpu > 25 ? 'text-amber-400' : 'text-muted-foreground'
                          }`}>
                            {proc.cpu.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{proc.memoryStr}</td>
                      <td className="px-3 py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (proc.status === "critical") {
                              const crashTypes: Array<"kernel" | "memory" | "overload"> = ["kernel", "memory", "overload"];
                              onCriticalKill(proc.name, crashTypes[Math.floor(Math.random() * crashTypes.length)]);
                            } else if (proc.isApp && proc.appId) {
                              onCloseWindow(proc.appId);
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </>
        )}

        {selectedView === "performance" && (
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* CPU */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">CPU</div>
                    <div className="text-2xl font-bold text-primary">{totalCpu.toFixed(0)}%</div>
                  </div>
                </div>
                <MiniGraph data={cpuHistory} color="hsl(var(--primary))" />
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border text-xs">
                  <div>
                    <div className="text-muted-foreground">Processes</div>
                    <div className="font-mono font-medium">{processes.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Threads</div>
                    <div className="font-mono font-medium">{processes.reduce((s, p) => s + p.threads, 0)}</div>
                  </div>
                </div>
              </div>

              {/* Memory */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <MemoryStick className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Memory</div>
                    <div className="text-2xl font-bold text-purple-400">18.4 GB</div>
                  </div>
                </div>
                <MiniGraph data={memHistory} color="#a855f7" />
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border text-xs">
                  <div>
                    <div className="text-muted-foreground">Available</div>
                    <div className="font-mono font-medium">13.6 GB</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cached</div>
                    <div className="font-mono font-medium">4.2 GB</div>
                  </div>
                </div>
              </div>

              {/* Disk */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <HardDrive className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Disk (C:)</div>
                    <div className="text-2xl font-bold text-green-400">12%</div>
                  </div>
                </div>
                <Progress value={12} className="h-2 [&>div]:bg-green-500" />
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border text-xs">
                  <div>
                    <div className="text-muted-foreground">Read</div>
                    <div className="font-mono font-medium">24 MB/s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Write</div>
                    <div className="font-mono font-medium">18 MB/s</div>
                  </div>
                </div>
              </div>

              {/* Network */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Wifi className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Network</div>
                    <div className="text-2xl font-bold text-blue-400">5%</div>
                  </div>
                </div>
                <Progress value={5} className="h-2 [&>div]:bg-blue-500" />
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border text-xs">
                  <div>
                    <div className="text-muted-foreground">Send</div>
                    <div className="font-mono font-medium">12.5 KB/s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Receive</div>
                    <div className="font-mono font-medium">3.2 KB/s</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        {selectedView === "details" && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* System health */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-primary" />
                  System Health
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-primary">{systemMetrics.cpuTemp}°C</div>
                    <div className="text-xs text-muted-foreground mt-1">CPU Temp</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-green-400">{systemMetrics.gpuTemp}°C</div>
                    <div className="text-xs text-muted-foreground mt-1">GPU Temp</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-blue-400">{systemMetrics.fanSpeed}</div>
                    <div className="text-xs text-muted-foreground mt-1">Fan RPM</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-amber-400">{formatUptime(systemMetrics.uptime)}</div>
                    <div className="text-xs text-muted-foreground mt-1">Uptime</div>
                  </div>
                </div>
              </div>

              {/* Process details table */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  Process Details
                </h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">PID</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Priority</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Threads</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">CPU</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Memory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map(proc => (
                      <tr key={proc.pid} className="border-b border-border/50">
                        <td className="py-2 font-medium">{proc.name}</td>
                        <td className="py-2 font-mono text-muted-foreground">{proc.pid}</td>
                        <td className="py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            proc.status === "critical" ? "bg-destructive/20 text-destructive" :
                            proc.status === "running" ? "bg-green-500/20 text-green-400" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {proc.status}
                          </span>
                        </td>
                        <td className="py-2">
                          <span className={`text-[10px] ${
                            proc.priority === "high" ? "text-destructive" :
                            proc.priority === "normal" ? "text-primary" :
                            "text-muted-foreground"
                          }`}>
                            {proc.priority}
                          </span>
                        </td>
                        <td className="py-2 font-mono text-muted-foreground">{proc.threads}</td>
                        <td className="py-2 font-mono">{proc.cpu.toFixed(1)}%</td>
                        <td className="py-2 font-mono text-muted-foreground">{proc.memoryStr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
