import { useState, useEffect } from "react";
import { Wifi, Server, Radio, AlertCircle, Activity, Shield, Terminal, RefreshCw, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Node {
  id: string;
  name: string;
  type: "server" | "terminal" | "sensor" | "comms";
  status: "online" | "offline" | "warning";
  ip: string;
  location: string;
  latency: number;
}

export const NetworkScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selected, setSelected] = useState<Node | null>(null);
  const [pinging, setPinging] = useState(false);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const allNodes: Node[] = [
    { id: "N001", name: "Main Server", type: "server", status: "online", ip: "10.0.0.1", location: "Control Room", latency: 2 },
    { id: "N002", name: "Backup Server", type: "server", status: "online", ip: "10.0.0.2", location: "Server Bay", latency: 3 },
    { id: "T001", name: "Terminal Alpha", type: "terminal", status: "online", ip: "10.0.1.15", location: "Research Lab", latency: 12 },
    { id: "T002", name: "Terminal Beta", type: "terminal", status: "online", ip: "10.0.1.16", location: "Medical Bay", latency: 15 },
    { id: "T003", name: "Terminal Gamma", type: "terminal", status: "warning", ip: "10.0.1.17", location: "Engineering", latency: 245 },
    { id: "T007", name: "Zone 4 Terminal (DESTROYED)", type: "terminal", status: "offline", ip: "10.0.1.21", location: "Zone 4 Access", latency: 0 },
    { id: "S001", name: "Pressure Sensor Array", type: "sensor", status: "online", ip: "10.0.2.10", location: "Hull Monitors", latency: 8 },
    { id: "S002", name: "Temperature Sensors", type: "sensor", status: "online", ip: "10.0.2.11", location: "All Zones", latency: 6 },
    { id: "C001", name: "CommLink Relay", type: "comms", status: "online", ip: "10.0.3.5", location: "Communications", latency: 5 },
    { id: "C002", name: "Emergency Broadcast", type: "comms", status: "online", ip: "10.0.3.6", location: "Control Room", latency: 4 },
  ];

  const runScan = () => {
    setScanning(true);
    setNodes([]);
    setSelected(null);
    setDiagnostics([]);

    allNodes.forEach((node, idx) => {
      setTimeout(() => {
        setNodes(prev => [...prev, node]);
        if (idx === allNodes.length - 1) {
          setScanning(false);
        }
      }, idx * 200);
    });
  };

  const pingNode = () => {
    if (!selected) return;
    setPinging(true);
    setDiagnostics([]);
    
    if (selected.id === "T007") {
      const results = [
        `PING ${selected.ip} (${selected.name})`,
        ``,
        `Request timeout for icmp_seq 1`,
        `Request timeout for icmp_seq 2`,
        `Request timeout for icmp_seq 3`,
        `Request timeout for icmp_seq 4`,
        ``,
        `--- ${selected.ip} ping statistics ---`,
        `4 packets transmitted, 0 received, 100% packet loss`,
        ``,
        `[WARNING] Node unresponsive - possible hardware failure`
      ];
      
      results.forEach((line, i) => {
        setTimeout(() => {
          setDiagnostics(prev => [...prev, line]);
          if (i === results.length - 1) setPinging(false);
        }, i * 200);
      });
      return;
    }
    
    const results = [
      `PING ${selected.ip} (${selected.name})`,
      `64 bytes from ${selected.ip}: icmp_seq=1 ttl=64 time=${selected.latency}ms`,
      `64 bytes from ${selected.ip}: icmp_seq=2 ttl=64 time=${selected.latency + 1}ms`,
      `64 bytes from ${selected.ip}: icmp_seq=3 ttl=64 time=${selected.latency - 1}ms`,
      `64 bytes from ${selected.ip}: icmp_seq=4 ttl=64 time=${selected.latency + 2}ms`,
      ``,
      `--- ${selected.ip} ping statistics ---`,
      `4 packets transmitted, 4 received, 0% packet loss`,
      `rtt min/avg/max = ${selected.latency - 1}/${selected.latency}/${selected.latency + 2}ms`
    ];

    results.forEach((line, i) => {
      setTimeout(() => {
        setDiagnostics(prev => [...prev, line]);
        if (i === results.length - 1) setPinging(false);
      }, i * 150);
    });
  };

  const traceroute = () => {
    if (!selected) return;
    setPinging(true);
    setDiagnostics([]);
    
    const results = [
      `Traceroute to ${selected.name} (${selected.ip})`,
      `1  gateway (10.0.0.1)  1ms  1ms  1ms`,
      `2  switch-a (10.0.0.254)  ${Math.floor(selected.latency * 0.3)}ms  ${Math.floor(selected.latency * 0.3)}ms  ${Math.floor(selected.latency * 0.3)}ms`,
      `3  ${selected.name} (${selected.ip})  ${selected.latency}ms  ${selected.latency}ms  ${selected.latency}ms`,
      ``,
      `Trace complete.`
    ];

    results.forEach((line, i) => {
      setTimeout(() => {
        setDiagnostics(prev => [...prev, line]);
        if (i === results.length - 1) setPinging(false);
      }, i * 300);
    });
  };

  const portScan = () => {
    if (!selected) return;
    setPinging(true);
    setDiagnostics([]);
    
    const ports = selected.type === "server" 
      ? [22, 80, 443, 3306, 5432]
      : selected.type === "terminal"
      ? [22, 3389, 5900]
      : selected.type === "sensor"
      ? [80, 443, 8080]
      : [22, 80, 443];

    const results = [
      `Scanning ${selected.name} (${selected.ip})`,
      `Starting port scan...`,
      ``
    ];

    ports.forEach(port => {
      results.push(`PORT ${port}/tcp    OPEN    ${getServiceName(port)}`);
    });

    results.push(``);
    results.push(`Scan complete: ${ports.length} ports open`);

    results.forEach((line, i) => {
      setTimeout(() => {
        setDiagnostics(prev => [...prev, line]);
        if (i === results.length - 1) setPinging(false);
      }, i * 200);
    });
  };

  const getServiceName = (port: number) => {
    const services: Record<number, string> = {
      22: "SSH",
      80: "HTTP",
      443: "HTTPS",
      3306: "MySQL",
      5432: "PostgreSQL",
      3389: "RDP",
      5900: "VNC",
      8080: "HTTP-Alt"
    };
    return services[port] || "Unknown";
  };

  useEffect(() => {
    runScan();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "offline": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500/10 border-green-500/20";
      case "warning": return "bg-yellow-500/10 border-yellow-500/20";
      case "offline": return "bg-red-500/10 border-red-500/20";
      default: return "bg-muted/10";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "server": return Server;
      case "terminal": return Terminal;
      case "sensor": return Activity;
      case "comms": return Radio;
      default: return Server;
    }
  };

  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.ip.includes(searchQuery) ||
    node.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = {
    online: nodes.filter(n => n.status === "online").length,
    warning: nodes.filter(n => n.status === "warning").length,
    offline: nodes.filter(n => n.status === "offline").length,
  };

  return (
    <div className="flex h-full bg-background/50">
      {/* Left Panel - Node List */}
      <div className="w-80 border-r border-border/30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/30 bg-muted/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Network Nodes</h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={runScan}
              disabled={scanning}
              className="h-8"
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? "Scanning" : "Rescan"}
            </Button>
          </div>
          
          {/* Status Summary */}
          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-green-400 font-medium">{statusCounts.online}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">{statusCounts.warning}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-xs text-red-400 font-medium">{statusCounts.offline}</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm bg-background/50"
            />
          </div>
        </div>

        {/* Node List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {scanning && nodes.length < allNodes.length && (
              <div className="p-3 text-xs text-primary font-mono flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Discovering nodes... {nodes.length}/{allNodes.length}
              </div>
            )}
            
            {filteredNodes.map((node) => {
              const Icon = getIcon(node.type);
              return (
                <button
                  key={node.id}
                  onClick={() => setSelected(node)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                    selected?.id === node.id 
                      ? "bg-primary/10 border border-primary/30" 
                      : "hover:bg-muted/30 border border-transparent"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getStatusBg(node.status)}`}>
                    <Icon className={`w-4 h-4 ${getStatusColor(node.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{node.name}</div>
                    <div className="text-xs text-muted-foreground">{node.ip}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    node.status === "online" ? "bg-green-400" :
                    node.status === "warning" ? "bg-yellow-400" : "bg-red-400"
                  }`} />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Node Details */}
      <div className="flex-1 flex flex-col bg-muted/5">
        {selected ? (
          <>
            {/* Node Header */}
            <div className="p-5 border-b border-border/30">
              <div className="flex items-center gap-4">
                {(() => {
                  const Icon = getIcon(selected.type);
                  return (
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getStatusBg(selected.status)}`}>
                      <Icon className={`w-7 h-7 ${getStatusColor(selected.status)}`} />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="font-bold text-lg">{selected.name}</h3>
                  <div className="text-sm text-muted-foreground">{selected.id} - {selected.type.toUpperCase()}</div>
                </div>
              </div>
            </div>

            {/* Node Info */}
            <ScrollArea className="flex-1 p-5">
              <div className="space-y-4">
                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <div className={`font-bold ${getStatusColor(selected.status)}`}>
                      {selected.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Latency</div>
                    <div className={`font-mono font-bold ${
                      selected.latency === 0 ? "text-red-400" :
                      selected.latency > 100 ? "text-yellow-400" : "text-green-400"
                    }`}>
                      {selected.latency === 0 ? "N/A" : `${selected.latency}ms`}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                    <div className="font-mono font-bold text-primary">{selected.ip}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Location</div>
                    <div className="font-bold">{selected.location}</div>
                  </div>
                </div>

                {/* Alerts */}
                {selected.status === "warning" && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-bold text-sm">High Latency Warning</span>
                    </div>
                    <div className="text-xs text-yellow-400/80">Connection unstable. Check network path.</div>
                  </div>
                )}

                {selected.status === "offline" && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-400 mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-bold text-sm">Node Offline</span>
                    </div>
                    <div className="text-xs text-red-400/80">Not responding to network requests.</div>
                  </div>
                )}

                {/* Diagnostic Tools */}
                <div className="pt-3 border-t border-border/30">
                  <div className="text-xs text-muted-foreground mb-3 font-medium">DIAGNOSTIC TOOLS</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={pingNode}
                      disabled={pinging}
                      className="flex-1"
                    >
                      Ping
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={traceroute}
                      disabled={pinging}
                      className="flex-1"
                    >
                      Traceroute
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={portScan}
                      disabled={pinging}
                      className="flex-1"
                    >
                      Port Scan
                    </Button>
                  </div>
                </div>

                {/* Diagnostic Output */}
                {diagnostics.length > 0 && (
                  <div className="p-4 rounded-lg bg-black/40 border border-border/30">
                    <ScrollArea className="h-40">
                      <div className="text-xs font-mono space-y-0.5">
                        {diagnostics.map((line, i) => (
                          <div key={i} className={`${line ? "text-primary" : "h-2"} ${
                            line.includes("WARNING") || line.includes("timeout") ? "text-red-400" : ""
                          }`}>{line}</div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Wifi className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a node to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
