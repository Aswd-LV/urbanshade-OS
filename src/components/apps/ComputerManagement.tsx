import { useState, useEffect } from "react";
import { Monitor, Cpu, HardDrive, Wifi, WifiOff, Power, RefreshCw, Settings, AlertTriangle, CheckCircle, Clock, User, Terminal, Activity, X, Maximize2, Minimize2, Send } from "lucide-react";

interface Computer {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance" | "warning";
  type: "workstation" | "server" | "terminal" | "embedded";
  ip: string;
  lastSeen: string;
  cpu: number;
  memory: number;
  disk: number;
  user?: string;
  os: string;
  uptime?: string;
  processes?: number;
}

export const ComputerManagement = () => {
  const [computers, setComputers] = useState<Computer[]>([
    { id: "WS-001", name: "Control Room Primary", location: "Operations Center", status: "online", type: "workstation", ip: "10.0.1.10", lastSeen: "Now", cpu: 45, memory: 62, disk: 34, user: "Dr. Chen", os: "UrbanShade OS 2.2", uptime: "4d 12h 33m", processes: 127 },
    { id: "WS-002", name: "Research Terminal A", location: "Research Lab A", status: "online", type: "workstation", ip: "10.0.2.20", lastSeen: "Now", cpu: 78, memory: 85, disk: 56, user: "Dr. Martinez", os: "UrbanShade OS 2.2", uptime: "2d 8h 15m", processes: 203 },
    { id: "WS-003", name: "Engineering Console", location: "Engineering Deck", status: "online", type: "workstation", ip: "10.0.3.30", lastSeen: "Now", cpu: 23, memory: 41, disk: 28, os: "UrbanShade OS 2.2", uptime: "12d 3h 45m", processes: 89 },
    { id: "SRV-001", name: "Primary Database Server", location: "Server Bay", status: "online", type: "server", ip: "10.0.0.1", lastSeen: "Now", cpu: 67, memory: 72, disk: 45, os: "UrbanShade Server 2.2", uptime: "45d 6h 12m", processes: 312 },
    { id: "SRV-002", name: "Backup Server", location: "Server Bay", status: "online", type: "server", ip: "10.0.0.2", lastSeen: "Now", cpu: 12, memory: 35, disk: 89, os: "UrbanShade Server 2.2", uptime: "45d 6h 12m", processes: 156 },
    { id: "SRV-003", name: "Security Server", location: "Server Bay", status: "warning", type: "server", ip: "10.0.0.3", lastSeen: "2 min ago", cpu: 95, memory: 91, disk: 67, os: "UrbanShade Server 2.2", uptime: "45d 6h 12m", processes: 445 },
    { id: "TERM-001", name: "Airlock Terminal", location: "Airlock Alpha", status: "online", type: "terminal", ip: "10.0.4.100", lastSeen: "Now", cpu: 15, memory: 28, disk: 12, os: "UrbanShade Embedded", uptime: "120d 4h 22m", processes: 23 },
    { id: "TERM-002", name: "Medical Bay Terminal", location: "Medical Division", status: "online", type: "terminal", ip: "10.0.4.101", lastSeen: "Now", cpu: 8, memory: 22, disk: 18, os: "UrbanShade Embedded", uptime: "89d 15h 8m", processes: 19 },
    { id: "TERM-003", name: "Zone 4 Access Terminal", location: "Zone 4", status: "offline", type: "terminal", ip: "10.0.4.102", lastSeen: "3 hours ago", cpu: 0, memory: 0, disk: 0, os: "UrbanShade Embedded" },
    { id: "EMB-001", name: "Containment Controller", location: "Zone 4", status: "online", type: "embedded", ip: "10.0.5.50", lastSeen: "Now", cpu: 34, memory: 45, disk: 5, os: "UrbanShade Realtime", uptime: "365d 0h 0m", processes: 8 },
    { id: "EMB-002", name: "Power Grid Controller", location: "Engineering", status: "maintenance", type: "embedded", ip: "10.0.5.51", lastSeen: "1 hour ago", cpu: 0, memory: 0, disk: 0, os: "UrbanShade Realtime" },
    { id: "WS-004", name: "Security Office", location: "Security Hub", status: "online", type: "workstation", ip: "10.0.1.15", lastSeen: "Now", cpu: 31, memory: 54, disk: 42, user: "Officer Davis", os: "UrbanShade OS 2.2", uptime: "1d 4h 56m", processes: 98 },
  ]);

  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [filter, setFilter] = useState<"all" | "online" | "offline" | "warning">("all");
  const [remoteDesktopOpen, setRemoteDesktopOpen] = useState(false);
  const [remoteDesktopMaximized, setRemoteDesktopMaximized] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "processes" | "terminal">("overview");

  // Simulate live resource updates
  useEffect(() => {
    const interval = setInterval(() => {
      setComputers(prev => prev.map(c => {
        if (c.status === "online" || c.status === "warning") {
          return {
            ...c,
            cpu: Math.max(5, Math.min(99, c.cpu + (Math.random() - 0.5) * 10)),
            memory: Math.max(10, Math.min(95, c.memory + (Math.random() - 0.5) * 5)),
          };
        }
        return c;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "offline": return <WifiOff className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "maintenance": return <Settings className="w-4 h-4 text-blue-400 animate-spin" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "workstation": return <Monitor className="w-4 h-4" />;
      case "server": return <HardDrive className="w-4 h-4" />;
      case "terminal": return <Cpu className="w-4 h-4" />;
      case "embedded": return <Cpu className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getUsageColor = (value: number) => {
    if (value >= 90) return "bg-red-500";
    if (value >= 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const filteredComputers = computers.filter(c => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const stats = {
    total: computers.length,
    online: computers.filter(c => c.status === "online").length,
    offline: computers.filter(c => c.status === "offline").length,
    warning: computers.filter(c => c.status === "warning" || c.status === "maintenance").length,
  };

  const handleTerminalCommand = () => {
    if (!terminalInput.trim()) return;
    
    const cmd = terminalInput.trim().toLowerCase();
    const newOutput = [...terminalOutput, `$ ${terminalInput}`];
    
    if (cmd === "help") {
      newOutput.push("Available commands: help, uptime, whoami, hostname, df, ps, clear, exit");
    } else if (cmd === "uptime") {
      newOutput.push(`Uptime: ${selectedComputer?.uptime || "Unknown"}`);
    } else if (cmd === "whoami") {
      newOutput.push(selectedComputer?.user || "root");
    } else if (cmd === "hostname") {
      newOutput.push(selectedComputer?.name || "Unknown");
    } else if (cmd === "df") {
      newOutput.push(`Filesystem      Size   Used  Avail  Use%`);
      newOutput.push(`/dev/sda1       500G   ${selectedComputer?.disk || 0}%    ${100 - (selectedComputer?.disk || 0)}%   ${selectedComputer?.disk || 0}%`);
    } else if (cmd === "ps") {
      newOutput.push(`PID   USER   CPU%  MEM%  COMMAND`);
      newOutput.push(`1     root   0.1   0.5   systemd`);
      newOutput.push(`245   root   2.3   1.2   urbanshade-core`);
      newOutput.push(`...`);
      newOutput.push(`Total processes: ${selectedComputer?.processes || 0}`);
    } else if (cmd === "clear") {
      setTerminalOutput([]);
      setTerminalInput("");
      return;
    } else if (cmd === "exit") {
      setRemoteDesktopOpen(false);
      setTerminalOutput([]);
    } else {
      newOutput.push(`Command not found: ${cmd}`);
    }
    
    setTerminalOutput(newOutput);
    setTerminalInput("");
  };

  const openRemoteDesktop = () => {
    if (selectedComputer && selectedComputer.status === "online") {
      setRemoteDesktopOpen(true);
      setTerminalOutput([
        `Connected to ${selectedComputer.name} (${selectedComputer.ip})`,
        `${selectedComputer.os}`,
        `Last login: ${new Date().toLocaleString()}`,
        `Type 'help' for available commands.`,
        ``
      ]);
    }
  };

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 relative">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-lg">Facility Computers</h2>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-lg font-bold text-slate-100">{stats.total}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-lg font-bold text-emerald-400">{stats.online}</div>
              <div className="text-xs text-slate-500">Online</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="text-lg font-bold text-red-400">{stats.offline}</div>
              <div className="text-xs text-slate-500">Offline</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="text-lg font-bold text-amber-400">{stats.warning}</div>
              <div className="text-xs text-slate-500">Issues</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-2 border-b border-slate-800 flex gap-1">
          {(["all", "online", "offline", "warning"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                filter === f 
                  ? "bg-cyan-500 text-white" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Computer List */}
        <div className="flex-1 overflow-y-auto">
          {filteredComputers.map((computer) => (
            <div
              key={computer.id}
              onClick={() => setSelectedComputer(computer)}
              className={`p-3 border-b border-slate-800 cursor-pointer transition-all ${
                selectedComputer?.id === computer.id 
                  ? "bg-cyan-500/20 border-l-2 border-l-cyan-400" 
                  : "hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-slate-400">{getTypeIcon(computer.type)}</span>
                <span className="font-medium text-sm flex-1 truncate">{computer.name}</span>
                {getStatusIcon(computer.status)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Wifi className="w-3 h-3" />
                <span className="font-mono">{computer.ip}</span>
                <span className="ml-auto truncate max-w-[100px]">{computer.location}</span>
              </div>
              {computer.status === "online" && (
                <div className="mt-2 flex gap-1">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${getUsageColor(computer.cpu)}`} style={{ width: `${computer.cpu}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500 w-8">{Math.round(computer.cpu)}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="flex-1 flex flex-col">
        {selectedComputer ? (
          <>
            <div className="p-4 border-b border-slate-800 bg-slate-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    {getTypeIcon(selectedComputer.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedComputer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="font-mono">{selectedComputer.id}</span>
                      <span>•</span>
                      <span>{selectedComputer.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedComputer.status)}
                  <span className={`font-medium uppercase text-sm ${
                    selectedComputer.status === "online" ? "text-emerald-400" :
                    selectedComputer.status === "offline" ? "text-red-400" :
                    "text-amber-400"
                  }`}>
                    {selectedComputer.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              {(["overview", "processes", "terminal"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab
                      ? "text-cyan-400 border-cyan-400 bg-cyan-500/10"
                      : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {activeTab === "overview" && (
                <>
                  {/* System Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">IP Address</div>
                      <div className="font-mono font-bold text-cyan-400">{selectedComputer.ip}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Operating System</div>
                      <div className="font-bold">{selectedComputer.os}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Type</div>
                      <div className="font-bold capitalize">{selectedComputer.type}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Clock className="w-3 h-3" />
                        Uptime
                      </div>
                      <div className="font-bold font-mono">{selectedComputer.uptime || "N/A"}</div>
                    </div>
                  </div>

                  {/* Current User */}
                  {selectedComputer.user && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-blue-400">Active User</span>
                      </div>
                      <div className="font-bold">{selectedComputer.user}</div>
                    </div>
                  )}

                  {/* Resource Usage */}
                  {selectedComputer.status !== "offline" && selectedComputer.status !== "maintenance" && (
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-bold">Resource Usage</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">CPU</span>
                            <span className="font-mono font-bold">{Math.round(selectedComputer.cpu)}%</span>
                          </div>
                          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getUsageColor(selectedComputer.cpu)} transition-all duration-500`}
                              style={{ width: `${selectedComputer.cpu}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Memory</span>
                            <span className="font-mono font-bold">{Math.round(selectedComputer.memory)}%</span>
                          </div>
                          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getUsageColor(selectedComputer.memory)} transition-all duration-500`}
                              style={{ width: `${selectedComputer.memory}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Disk</span>
                            <span className="font-mono font-bold">{selectedComputer.disk}%</span>
                          </div>
                          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getUsageColor(selectedComputer.disk)} transition-all duration-500`}
                              style={{ width: `${selectedComputer.disk}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      onClick={openRemoteDesktop}
                      disabled={selectedComputer.status !== "online"}
                      className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Terminal className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs">Remote</span>
                    </button>
                    <button className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs">Restart</span>
                    </button>
                    <button className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors flex flex-col items-center gap-2">
                      <Power className="w-5 h-5 text-red-400" />
                      <span className="text-xs">Shutdown</span>
                    </button>
                    <button className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors flex flex-col items-center gap-2">
                      <Settings className="w-5 h-5 text-slate-400" />
                      <span className="text-xs">Config</span>
                    </button>
                  </div>
                </>
              )}

              {activeTab === "processes" && (
                <div className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-slate-400 font-medium">PID</th>
                        <th className="px-4 py-2 text-left text-slate-400 font-medium">Process</th>
                        <th className="px-4 py-2 text-right text-slate-400 font-medium">CPU</th>
                        <th className="px-4 py-2 text-right text-slate-400 font-medium">MEM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { pid: 1, name: "systemd", cpu: 0.1, mem: 0.5 },
                        { pid: 245, name: "urbanshade-core", cpu: 12.3, mem: 8.2 },
                        { pid: 312, name: "security-monitor", cpu: 5.4, mem: 4.1 },
                        { pid: 456, name: "db-connector", cpu: 3.2, mem: 12.5 },
                        { pid: 589, name: "facility-daemon", cpu: 8.7, mem: 6.3 },
                        { pid: 702, name: "network-scanner", cpu: 2.1, mem: 3.8 },
                        { pid: 834, name: "log-collector", cpu: 1.5, mem: 2.1 },
                      ].map((proc) => (
                        <tr key={proc.pid} className="border-t border-slate-800 hover:bg-slate-800/30">
                          <td className="px-4 py-2 font-mono text-slate-500">{proc.pid}</td>
                          <td className="px-4 py-2">{proc.name}</td>
                          <td className="px-4 py-2 text-right font-mono">{proc.cpu}%</td>
                          <td className="px-4 py-2 text-right font-mono">{proc.mem}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "terminal" && (
                <div className="h-full flex flex-col rounded-xl bg-black border border-slate-800 overflow-hidden">
                  <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-mono">{selectedComputer.name} - Terminal</span>
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-green-400">
                    {terminalOutput.map((line, i) => (
                      <div key={i} className={line.startsWith('$') ? 'text-cyan-400' : ''}>{line}</div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-2 border-t border-slate-800 bg-slate-900/50">
                    <span className="text-cyan-400 font-mono">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
                      className="flex-1 bg-transparent outline-none font-mono text-green-400"
                      placeholder="Type a command..."
                    />
                    <button onClick={handleTerminalCommand} className="p-1 hover:bg-slate-800 rounded">
                      <Send className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <Monitor className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Select a computer to view details</p>
              <p className="text-sm text-slate-600 mt-1">Choose from the list on the left</p>
            </div>
          </div>
        )}
      </div>

      {/* Remote Desktop Modal */}
      {remoteDesktopOpen && selectedComputer && (
        <div className={`absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 ${remoteDesktopMaximized ? 'p-0' : 'p-8'}`}>
          <div className={`bg-slate-950 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-2xl ${remoteDesktopMaximized ? 'w-full h-full rounded-none' : 'w-[90%] h-[85%]'}`}>
            {/* Title Bar */}
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">Remote Desktop - {selectedComputer.name}</span>
                <span className="text-xs text-slate-500 font-mono">({selectedComputer.ip})</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setRemoteDesktopMaximized(!remoteDesktopMaximized)}
                  className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                >
                  {remoteDesktopMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => { setRemoteDesktopOpen(false); setTerminalOutput([]); }}
                  className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Remote Terminal */}
            <div className="flex-1 bg-black p-4 font-mono text-sm overflow-y-auto">
              <div className="text-green-400">
                {terminalOutput.map((line, i) => (
                  <div key={i} className={`${line.startsWith('$') ? 'text-cyan-400' : ''} leading-relaxed`}>{line}</div>
                ))}
              </div>
            </div>
            
            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-slate-800 bg-slate-900/50">
              <span className="text-cyan-400 font-mono text-sm">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
                className="flex-1 bg-transparent outline-none font-mono text-sm text-green-400"
                placeholder="Type a command..."
                autoFocus
              />
              <button 
                onClick={handleTerminalCommand}
                className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded text-cyan-400 text-sm transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
