import { useState, useEffect, useRef } from "react";
import { Bug, AlertTriangle, Info, CheckCircle, Trash2, Download, Copy, Upload, Database, RefreshCw, HardDrive, FileText, X, Eye, EyeOff, Play, Terminal, Zap, Shield, Activity, ExternalLink, BookOpen, Skull, MonitorX, Cpu, MemoryStick, AlertOctagon, Power, Bomb } from "lucide-react";
import { toast } from "sonner";
import { loadState } from "@/lib/persistence";
import { Link } from "react-router-dom";
import { actionDispatcher } from "@/lib/actionDispatcher";

interface LogEntry {
  id: number;
  type: "info" | "warn" | "error" | "success" | "debug" | "system";
  timestamp: Date;
  message: string;
  simplified?: string;
  raw?: string;
  stack?: string;
}

interface ActionEntry {
  id: number;
  type: "SYSTEM" | "APP" | "FILE" | "USER" | "SECURITY" | "WINDOW";
  timestamp: Date;
  message: string;
}

interface RecoveryImage {
  name: string;
  data: Record<string, string>;
  created: string;
  size: number;
}

interface BugcheckEntry {
  code: string;
  description: string;
  timestamp: string;
  location?: string;
  systemInfo?: Record<string, string>;
}

const simplifyError = (message: string): string => {
  const simplifications: [RegExp, string][] = [
    [/cannot read propert(y|ies) of (undefined|null)/i, "Something tried to use data that doesn't exist yet"],
    [/is not a function/i, "The system tried to run something that isn't runnable"],
    [/is not defined/i, "The system is looking for something that doesn't exist"],
    [/syntax error/i, "There's a typo or formatting problem"],
    [/network error|failed to fetch/i, "Couldn't connect to the internet or server"],
    [/timeout/i, "The operation took too long and was stopped"],
    [/permission denied|unauthorized/i, "You don't have permission to do this"],
    [/out of memory/i, "The system ran out of memory"],
    [/maximum call stack/i, "The system got stuck in a loop"],
    [/unexpected token/i, "The system found something it didn't expect"],
    [/failed to load/i, "Couldn't load a required file"],
    [/cors|cross-origin/i, "Security blocked a connection to another website"],
  ];

  for (const [pattern, simple] of simplifications) {
    if (pattern.test(message)) return simple;
  }
  return message.length > 100 ? "An unexpected error occurred" : message;
};

const DevMode = () => {
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [showActionConsent, setShowActionConsent] = useState(false);
  const [actionConsentChecked, setActionConsentChecked] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [actions, setActions] = useState<ActionEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "error" | "warn" | "info" | "system">("all");
  const [actionFilter, setActionFilter] = useState<"ALL" | "SYSTEM" | "APP" | "FILE" | "USER" | "SECURITY" | "WINDOW">("ALL");
  const [showTechnical, setShowTechnical] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"console" | "actions" | "storage" | "images" | "bugchecks" | "admin">("console");
  const [recoveryImages, setRecoveryImages] = useState<RecoveryImage[]>([]);
  const [bugchecks, setBugchecks] = useState<BugcheckEntry[]>([]);
  const [selectedImage, setSelectedImage] = useState<RecoveryImage | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [storageSearch, setStorageSearch] = useState("");
  const [actionPersistenceEnabled, setActionPersistenceEnabled] = useState(false);
  const logIdRef = useRef(0);
  const actionIdRef = useRef(0);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if dev mode is enabled
  useEffect(() => {
    const devEnabled = loadState("settings_developer_mode", false) || loadState("urbanshade_dev_mode_install", false);
    setDevModeEnabled(devEnabled);
    
    // Check if action persistence consent exists
    const hasConsent = localStorage.getItem('def_dev_actions_consent') === 'true';
    setActionPersistenceEnabled(hasConsent);
    
    // Load recovery images
    const saved = localStorage.getItem('urbanshade_recovery_images_data');
    if (saved) setRecoveryImages(JSON.parse(saved));

    // Load bugchecks
    const bugcheckData = localStorage.getItem('urbanshade_bugchecks');
    if (bugcheckData) setBugchecks(JSON.parse(bugcheckData));
  }, []);

  // Console capture
  useEffect(() => {
    if (!devModeEnabled || showWarning) return;

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
    };

    const addLog = (type: LogEntry["type"], ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" ");
      
      const newLog: LogEntry = {
        id: logIdRef.current++,
        type,
        timestamp: new Date(),
        message,
        simplified: type === "error" ? simplifyError(message) : undefined,
        raw: message,
      };

      setLogs(prev => [...prev.slice(-500), newLog]);
    };

    const addAction = (type: ActionEntry["type"], message: string) => {
      const newAction: ActionEntry = {
        id: actionIdRef.current++,
        type,
        timestamp: new Date(),
        message
      };
      setActions(prev => [...prev.slice(-200), newAction]);
    };

    console.log = (...args) => { originalConsole.log(...args); addLog("info", ...args); };
    console.warn = (...args) => { originalConsole.warn(...args); addLog("warn", ...args); };
    console.error = (...args) => { originalConsole.error(...args); addLog("error", ...args); };
    console.info = (...args) => { originalConsole.info(...args); addLog("info", ...args); };
    console.debug = (...args) => { originalConsole.debug(...args); addLog("debug", ...args); };

    // Listen for custom action events
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, message } = customEvent.detail || {};
      if (type && message) addAction(type, message);
    };

    const handleError = (event: ErrorEvent) => {
      addLog("error", `CRASH: ${event.message} at ${event.filename}:${event.lineno}`);
      addAction("SYSTEM", `Fatal error: ${event.message}`);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addLog("error", `ASYNC ERROR: ${event.reason}`);
      addAction("SYSTEM", `Unhandled rejection: ${event.reason}`);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("defdev-action", handleAction);

    addLog("system", "DEF-DEV Console initialized - Capturing all system events");
    addLog("system", `LocalStorage: ${localStorage.length} entries, ${(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB`);
    addAction("SYSTEM", "DEF-DEV Console initialized");

    return () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.info = originalConsole.info;
      console.debug = originalConsole.debug;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("defdev-action", handleAction);
    };
  }, [devModeEnabled, showWarning]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // If dev mode not enabled, show error
  if (!devModeEnabled) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">!COULDN'T BIND TO PAGE!</h1>
          <p className="text-gray-400 mb-6">
            Developer Mode is not enabled on this system. Enable it in Settings → Developer Options or during installation.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400"
          >
            Return to System
          </button>
        </div>
      </div>
    );
  }

  // Warning popup - Enhanced
  if (showWarning) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-2xl bg-slate-900 border border-amber-500/50 rounded-lg overflow-hidden shadow-2xl shadow-amber-500/20">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Developer Environment</h2>
              <p className="text-amber-100 text-sm">DEF-DEV Debug Console v2.0</p>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-cyan-400 mb-2">What is DEF-DEV?</p>
                <p>DEF-DEV is an <strong>open, free-to-use debugging and development console</strong> for UrbanShade OS. It provides comprehensive access to:</p>
                <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-400">
                  <li>Real-time console logs, warnings, and errors</li>
                  <li>System action monitoring (apps, files, security events)</li>
                  <li>LocalStorage inspection and management</li>
                  <li>Recovery image creation, editing, and restoration</li>
                  <li>Bugcheck reports and crash diagnostics</li>
                  <li><strong className="text-amber-400">Admin commands</strong> (crash triggers, system controls)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-amber-400 mb-2">A Friendly Heads-Up</p>
                <p>If you're a casual user just exploring the system, these tools are probably not what you're looking for. They're intended for developers, troubleshooters, and anyone who knows what they're doing.</p>
                <p className="mt-2 text-amber-300/80 font-medium">Modifying values incorrectly could cause system instability, data loss, or unexpected behavior. Proceed with caution.</p>
              </div>
            </div>

            {/* Action Logging Consent */}
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Database className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300 flex-1">
                <p className="font-semibold text-green-400 mb-2">Action Logging Storage</p>
                <p className="mb-3">Enable persistent action logging to save OS events to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs">def-dev-actions</code> localStorage. This allows you to review actions across sessions.</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actionConsentChecked}
                    onChange={(e) => setActionConsentChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-green-500 bg-slate-800 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-green-300">I consent to creating <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs">def-dev-actions</code> localStorage</span>
                </label>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Database className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-purple-400 mb-2">Developer Mode Notice</p>
                <p>While Developer Mode is active, some persistence features may be bypassed for testing purposes. Your changes may not persist across sessions as expected.</p>
              </div>
            </div>

            <Link 
              to="/docs/def-dev" 
              className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-semibold">Read the Documentation</p>
                <p className="text-sm text-green-400/70">Learn how to use DEF-DEV effectively</p>
              </div>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-4 bg-slate-800 flex gap-3">
            <button
              onClick={() => window.location.href = "/"}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                if (actionConsentChecked) {
                  actionDispatcher.setPersistence(true);
                  setActionPersistenceEnabled(true);
                  toast.success("Action logging enabled - events will persist to localStorage");
                }
                setShowWarning(false);
              }}
              className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-semibold"
            >
              I Understand, Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "error": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "warn": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "system": return <Terminal className="w-4 h-4 text-purple-400" />;
      default: return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getActionTypeColor = (type: ActionEntry["type"]) => {
    switch (type) {
      case "SYSTEM": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "APP": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "FILE": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "USER": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "SECURITY": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "WINDOW": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredLogs = logs.filter(log => filter === "all" || log.type === filter);
  const filteredActions = actionFilter === "ALL" ? actions : actions.filter(a => a.type === actionFilter);

  const exportLogs = () => {
    const content = logs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.type.toUpperCase()}] ${log.message}`
    ).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `urbanshade_devlogs_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exported");
  };

  const handleImportImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const newImage: RecoveryImage = {
          name: file.name.replace(/\.(img|json)$/, ''),
          data,
          created: new Date().toISOString(),
          size: JSON.stringify(data).length
        };
        const updated = [...recoveryImages, newImage];
        setRecoveryImages(updated);
        localStorage.setItem('urbanshade_recovery_images_data', JSON.stringify(updated));
        toast.success(`Imported ${file.name}`);
      } catch {
        toast.error("Failed to parse file");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleEditValue = (key: string, value: string) => {
    if (!selectedImage) return;
    const updated = { ...selectedImage, data: { ...selectedImage.data, [key]: value } };
    setSelectedImage(updated);
    const newImages = recoveryImages.map(img => img.name === selectedImage.name ? updated : img);
    setRecoveryImages(newImages);
    localStorage.setItem('urbanshade_recovery_images_data', JSON.stringify(newImages));
    setEditingKey(null);
    toast.success(`Updated ${key}`);
  };

  const loadImageToLive = () => {
    if (!selectedImage) return;
    if (!confirm("Load this image to current system? This will replace all localStorage.")) return;
    localStorage.clear();
    Object.entries(selectedImage.data).forEach(([k, v]) => localStorage.setItem(k, v));
    toast.success("Image loaded. Reloading...");
    setTimeout(() => window.location.reload(), 1000);
  };

  const exportImage = () => {
    if (!selectedImage) return;
    const blob = new Blob([JSON.stringify(selectedImage.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedImage.name}.img`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const captureCurrentAsImage = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes('recovery_images')) data[key] = localStorage.getItem(key) || "";
    }
    const newImage: RecoveryImage = {
      name: `Snapshot_${new Date().toLocaleTimeString().replace(/:/g, '-')}`,
      data,
      created: new Date().toISOString(),
      size: JSON.stringify(data).length
    };
    const updated = [...recoveryImages, newImage];
    setRecoveryImages(updated);
    localStorage.setItem('urbanshade_recovery_images_data', JSON.stringify(updated));
    setSelectedImage(newImage);
    toast.success("Current state captured");
  };

  const clearBugchecks = () => {
    setBugchecks([]);
    localStorage.removeItem('urbanshade_bugchecks');
    toast.success("Bugcheck reports cleared");
  };

  const exportBugchecks = () => {
    const blob = new Blob([JSON.stringify(bugchecks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugchecks_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bugchecks exported");
  };

  const storageEntries = Object.entries(localStorage).filter(([key]) => 
    !key.includes('recovery_images') && key.toLowerCase().includes(storageSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#0d1117] text-gray-100 flex flex-col font-mono">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border-b border-amber-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bug className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="font-bold text-amber-400">DEF-DEV Console</h1>
            <p className="text-xs text-gray-500">UrbanShade Developer Environment</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/docs/def-dev" className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Docs
          </Link>
          <span className="text-xs text-gray-500">Session: {new Date().toLocaleTimeString()}</span>
          <button onClick={() => window.location.href = "/"} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm">
            Exit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { id: "console", label: "Console", icon: <Terminal className="w-4 h-4" /> },
          { id: "actions", label: "Actions", icon: <Activity className="w-4 h-4" /> },
          { id: "storage", label: "Storage", icon: <Database className="w-4 h-4" /> },
          { id: "images", label: "Recovery Images", icon: <HardDrive className="w-4 h-4" /> },
          { id: "bugchecks", label: `Bugchecks${bugchecks.length > 0 ? ` (${bugchecks.length})` : ''}`, icon: <Shield className="w-4 h-4" /> },
          { id: "admin", label: "Admin", icon: <Skull className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 transition-colors ${
              selectedTab === tab.id 
                ? "border-amber-500 text-amber-400 bg-amber-500/10" 
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedTab === "console" && (
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-2 border-b border-gray-800 flex items-center gap-2 flex-wrap">
              <div className="flex gap-1">
                {(["all", "error", "warn", "info", "system"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-1 rounded text-xs capitalize ${
                      filter === f ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {f} {f !== "all" && `(${logs.filter(l => l.type === f).length})`}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <button onClick={() => setShowTechnical(!showTechnical)} className="p-1.5 hover:bg-gray-800 rounded" title="Toggle technical view">
                {showTechnical ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => navigator.clipboard.writeText(logs.map(l => `[${l.type}] ${l.message}`).join("\n"))} className="p-1.5 hover:bg-gray-800 rounded">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={exportLogs} className="p-1.5 hover:bg-gray-800 rounded">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={() => setLogs([])} className="p-1.5 hover:bg-gray-800 rounded text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-auto p-2 space-y-1 text-xs">
              {filteredLogs.length === 0 ? (
                <div className="text-center text-gray-600 py-8">Waiting for events...</div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className={`p-2 rounded border ${
                    log.type === "error" ? "bg-red-500/5 border-red-500/20" :
                    log.type === "warn" ? "bg-amber-500/5 border-amber-500/20" :
                    log.type === "system" ? "bg-purple-500/5 border-purple-500/20" :
                    "bg-gray-800/50 border-gray-700/50"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getIcon(log.type)}
                      <span className="text-gray-600">{log.timestamp.toLocaleTimeString()}</span>
                      <span className={`uppercase font-bold ${
                        log.type === "error" ? "text-red-400" :
                        log.type === "warn" ? "text-amber-400" :
                        log.type === "system" ? "text-purple-400" : "text-cyan-400"
                      }`}>{log.type}</span>
                    </div>
                    {showTechnical ? (
                      <pre className="whitespace-pre-wrap break-all text-gray-300">{log.message}</pre>
                    ) : (
                      <div className="text-gray-300">{log.simplified || log.message}</div>
                    )}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Stats */}
            <div className="p-2 border-t border-gray-800 flex gap-4 text-xs text-gray-500">
              <span>Total: {logs.length}</span>
              <span className="text-red-400">Errors: {logs.filter(l => l.type === "error").length}</span>
              <span className="text-amber-400">Warnings: {logs.filter(l => l.type === "warn").length}</span>
            </div>
          </div>
        )}

        {selectedTab === "actions" && (
          <div className="h-full flex flex-col">
            {/* Filter */}
            <div className="p-2 border-b border-gray-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Filter:</span>
              {(["ALL", "SYSTEM", "APP", "FILE", "USER", "SECURITY", "WINDOW"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setActionFilter(type)}
                  className={`px-2 py-1 rounded text-xs ${
                    actionFilter === type ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
              <div className="flex-1" />
              <div className="flex items-center gap-2 mr-2">
                <span className={`text-xs ${actionPersistenceEnabled ? 'text-green-400' : 'text-gray-500'}`}>
                  {actionPersistenceEnabled ? '● Persisting' : '○ Not persisting'}
                </span>
              </div>
              <button 
                onClick={() => {
                  const stored = actionDispatcher.refreshFromStorage();
                  const converted = stored.map((a, idx) => ({
                    id: idx,
                    type: a.type as ActionEntry["type"],
                    timestamp: a.timestamp,
                    message: a.message
                  }));
                  setActions(converted);
                  toast.success(`Loaded ${stored.length} actions from storage`);
                }}
                className="p-1.5 hover:bg-gray-800 rounded text-cyan-400"
                title="Refresh from localStorage"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setActions([])} className="p-1.5 hover:bg-gray-800 rounded text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex-1 overflow-auto p-2 space-y-1 text-xs">
              {filteredActions.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  <p>No actions recorded yet...</p>
                  {actionPersistenceEnabled && (
                    <button 
                      onClick={() => {
                        const stored = actionDispatcher.refreshFromStorage();
                        const converted = stored.map((a, idx) => ({
                          id: idx,
                          type: a.type as ActionEntry["type"],
                          timestamp: a.timestamp,
                          message: a.message
                        }));
                        setActions(converted);
                      }}
                      className="mt-2 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded text-cyan-400"
                    >
                      <RefreshCw className="w-3 h-3 inline mr-1" />Load from storage
                    </button>
                  )}
                </div>
              ) : (
                filteredActions.map(action => (
                  <div key={action.id} className="p-2 rounded bg-gray-800/50 border border-gray-700/50 flex items-center gap-3">
                    <span className="text-gray-600 min-w-[65px]">{action.timestamp.toLocaleTimeString()}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getActionTypeColor(action.type)}`}>
                      {action.type}
                    </span>
                    <span className="text-gray-300">{action.message}</span>
                  </div>
                ))
              )}
            </div>

            {/* Stats */}
            <div className="p-2 border-t border-gray-800 text-xs text-gray-500">
              Total Actions: {actions.length}
            </div>
          </div>
        )}

        {selectedTab === "storage" && (
          <div className="h-full flex flex-col p-4">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={storageSearch}
                onChange={(e) => setStorageSearch(e.target.value)}
                placeholder="Search keys..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
              />
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-400 text-sm">
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-auto space-y-1">
              {storageEntries.map(([key, value]) => (
                <div key={key} className="p-2 bg-gray-800/50 border border-gray-700/50 rounded text-xs">
                  <div className="font-semibold text-cyan-400 mb-1">{key}</div>
                  <pre className="text-gray-400 whitespace-pre-wrap break-all max-h-20 overflow-auto">{value}</pre>
                </div>
              ))}
            </div>
            <div className="pt-2 text-xs text-gray-500">{storageEntries.length} entries • {(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB</div>
          </div>
        )}

        {selectedTab === "images" && (
          <div className="h-full flex">
            {/* Image List */}
            <div className="w-64 border-r border-gray-800 p-3 flex flex-col">
              <div className="flex gap-2 mb-3">
                <button onClick={captureCurrentAsImage} className="flex-1 px-2 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded text-xs text-cyan-400">
                  <Zap className="w-3 h-3 inline mr-1" />Capture
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 px-2 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded text-xs text-amber-400">
                  <Upload className="w-3 h-3 inline mr-1" />Import
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept=".img,.json" onChange={handleImportImage} className="hidden" />
              <div className="flex-1 overflow-auto space-y-1">
                {recoveryImages.map(img => (
                  <button
                    key={img.name}
                    onClick={() => setSelectedImage(img)}
                    className={`w-full p-2 rounded text-left text-xs ${
                      selectedImage?.name === img.name ? "bg-amber-500/20 border border-amber-500/30" : "bg-gray-800/50 hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="font-semibold truncate">{img.name}</div>
                    <div className="text-gray-500">{(img.size / 1024).toFixed(1)} KB</div>
                  </button>
                ))}
                {recoveryImages.length === 0 && <div className="text-gray-600 text-center py-4 text-xs">No images</div>}
              </div>
            </div>

            {/* Image Editor */}
            <div className="flex-1 p-4 overflow-auto">
              {selectedImage ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-amber-400">{selectedImage.name}</h3>
                      <p className="text-xs text-gray-500">{Object.keys(selectedImage.data).length} keys • {(selectedImage.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={exportImage} className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded text-xs text-cyan-400">
                        <Download className="w-3 h-3 inline mr-1" />Export
                      </button>
                      <button onClick={loadImageToLive} className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded text-xs text-green-400">
                        <Play className="w-3 h-3 inline mr-1" />Load to System
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(selectedImage.data).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-800/50 border border-gray-700/50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-cyan-400">{key}</span>
                          <button
                            onClick={() => { setEditingKey(key); setEditValue(value); }}
                            className="text-xs text-gray-500 hover:text-amber-400"
                          >
                            Edit
                          </button>
                        </div>
                        {editingKey === key ? (
                          <div className="flex gap-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 bg-gray-900 border border-gray-600 rounded text-xs"
                              rows={3}
                            />
                            <div className="flex flex-col gap-1">
                              <button onClick={() => handleEditValue(key, editValue)} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Save</button>
                              <button onClick={() => setEditingKey(null)} className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <pre className="text-xs text-gray-400 whitespace-pre-wrap break-all max-h-16 overflow-auto">{value}</pre>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600">
                  Select an image or capture current state
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === "bugchecks" && (
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-2 border-b border-gray-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-400">Bugcheck Reports</span>
              <div className="flex-1" />
              {bugchecks.length > 0 && (
                <>
                  <button onClick={exportBugchecks} className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded text-xs text-cyan-400">
                    <Download className="w-3 h-3 inline mr-1" />Export All
                  </button>
                  <button onClick={clearBugchecks} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-xs text-red-400">
                    <Trash2 className="w-3 h-3 inline mr-1" />Clear All
                  </button>
                </>
              )}
            </div>

            {/* Bugcheck List */}
            <div className="flex-1 overflow-auto p-4">
              {bugchecks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
                  <p className="text-gray-500">No bugcheck reports</p>
                  <p className="text-xs text-gray-600 mt-1">System is running without critical errors</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bugchecks.map((bc, idx) => (
                    <div key={idx} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-red-400 font-mono">{bc.code}</span>
                        <span className="text-xs text-gray-500">{new Date(bc.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{bc.description}</p>
                      {bc.location && <p className="text-xs text-gray-500">Location: {bc.location}</p>}
                      {bc.systemInfo && (
                        <div className="mt-2 pt-2 border-t border-red-500/10 grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(bc.systemInfo).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-gray-500">{k}: </span>
                              <span className="text-gray-400">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(bc, null, 2));
                          toast.success("Bugcheck copied");
                        }}
                        className="mt-3 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                      >
                        <Copy className="w-3 h-3 inline mr-1" />Copy Report
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === "admin" && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-red-900/30 to-orange-900/30">
              <div className="flex items-center gap-3">
                <Skull className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="font-bold text-red-400">Admin Commands</h3>
                  <p className="text-xs text-gray-500">Advanced system control and crash triggers</p>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="flex-1 overflow-auto p-4 space-y-6">
              {/* Crash Triggers */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <MonitorX className="w-4 h-4" /> Crash Screen Triggers
                </h4>
                <p className="text-xs text-gray-500 mb-3">Trigger various crash screens (BSOD) for testing crash handlers</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { code: "CRITICAL_PROCESS_DIED", label: "Critical Process", desc: "System process terminated", icon: <AlertOctagon className="w-4 h-4" /> },
                    { code: "KERNEL_PANIC", label: "Kernel Panic", desc: "Core system failure", icon: <Cpu className="w-4 h-4" /> },
                    { code: "MEMORY_MANAGEMENT", label: "Memory Error", desc: "Memory allocation failed", icon: <MemoryStick className="w-4 h-4" /> },
                    { code: "SYSTEM_SERVICE_EXCEPTION", label: "Service Exception", desc: "System service error", icon: <AlertTriangle className="w-4 h-4" /> },
                    { code: "VIDEO_TDR_FAILURE", label: "Video Failure", desc: "Display driver timeout", icon: <MonitorX className="w-4 h-4" /> },
                    { code: "WHEA_UNCORRECTABLE_ERROR", label: "Hardware Error", desc: "Fatal hardware failure", icon: <Bomb className="w-4 h-4" /> },
                  ].map((crash) => (
                    <button
                      key={crash.code}
                      onClick={() => {
                        if (confirm(`Trigger ${crash.label}?\n\nThis will display a crash screen and may restart the system.`)) {
                          actionDispatcher.system(`Admin triggered crash: ${crash.code}`);
                          // Store crash to trigger on main page
                          localStorage.setItem('urbanshade_pending_crash', JSON.stringify({
                            type: crash.code,
                            process: 'admin.exe',
                            triggeredAt: new Date().toISOString()
                          }));
                          window.location.href = '/';
                        }
                      }}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-left transition-all group"
                    >
                      <div className="flex items-center gap-2 text-red-400 mb-1">
                        {crash.icon}
                        <span className="font-semibold text-sm">{crash.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{crash.desc}</p>
                      <code className="text-xs text-red-400/50 mt-1 block">{crash.code}</code>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bugcheck Triggers */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Bugcheck Triggers
                </h4>
                <p className="text-xs text-gray-500 mb-3">Trigger system bugchecks (detailed error reports)</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { code: "FATAL_EXCEPTION", label: "Fatal Exception", desc: "Unhandled system exception" },
                    { code: "SYSTEM_CORRUPTION", label: "System Corruption", desc: "Critical data integrity failure" },
                    { code: "SECURITY_BREACH", label: "Security Breach", desc: "Security violation detected" },
                    { code: "DRIVER_FAILURE", label: "Driver Failure", desc: "Driver crashed unexpectedly" },
                  ].map((bug) => (
                    <button
                      key={bug.code}
                      onClick={() => {
                        if (confirm(`Trigger ${bug.label} bugcheck?`)) {
                          actionDispatcher.system(`Admin triggered bugcheck: ${bug.code}`);
                          localStorage.setItem('urbanshade_pending_bugcheck', JSON.stringify({
                            code: bug.code,
                            description: bug.desc,
                            triggeredAt: new Date().toISOString()
                          }));
                          window.location.href = '/';
                        }
                      }}
                      className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-left transition-all"
                    >
                      <div className="font-semibold text-sm text-purple-400 mb-1">{bug.label}</div>
                      <p className="text-xs text-gray-500">{bug.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Controls */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                  <Power className="w-4 h-4" /> System Controls
                </h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      if (confirm('Force system reboot?')) {
                        actionDispatcher.system('Admin forced reboot');
                        window.location.href = '/';
                      }
                    }}
                    className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg"
                  >
                    <Power className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <span className="text-xs text-cyan-400">Force Reboot</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      actionDispatcher.clearStorage();
                      setActions([]);
                      toast.success('Action history cleared');
                    }}
                    className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <span className="text-xs text-amber-400">Clear Actions</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const enabled = !actionPersistenceEnabled;
                      actionDispatcher.setPersistence(enabled);
                      setActionPersistenceEnabled(enabled);
                      toast.success(enabled ? 'Action persistence enabled' : 'Action persistence disabled');
                    }}
                    className={`p-3 border rounded-lg ${actionPersistenceEnabled ? 'bg-green-500/20 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}
                  >
                    <Database className={`w-5 h-5 mx-auto mb-1 ${actionPersistenceEnabled ? 'text-green-400' : 'text-gray-400'}`} />
                    <span className={`text-xs ${actionPersistenceEnabled ? 'text-green-400' : 'text-gray-400'}`}>
                      {actionPersistenceEnabled ? 'Persist: ON' : 'Persist: OFF'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Dangerous Zone */}
              <div className="space-y-3 pt-4 border-t border-red-500/20">
                <h4 className="text-sm font-semibold text-red-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      if (confirm('DANGER: This will clear ALL localStorage and reset the entire system. Continue?')) {
                        if (confirm('Are you ABSOLUTELY sure? This cannot be undone!')) {
                          actionDispatcher.system('Admin triggered full system wipe');
                          localStorage.clear();
                          toast.success('System wiped. Reloading...');
                          setTimeout(() => window.location.href = '/', 1000);
                        }
                      }
                    }}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg"
                  >
                    <Bomb className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <span className="text-xs text-red-500 font-bold">WIPE SYSTEM</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Dispatch multiple error types
                      actionDispatcher.dispatchError("FILE_NOT_FOUND", "Test file missing");
                      actionDispatcher.dispatchError("STORAGE_ERROR", "Storage access denied");
                      actionDispatcher.dispatchError("PERMISSION_DENIED", "Admin test");
                      actionDispatcher.dispatchError("PROCESS_CRASH", "Test process terminated");
                      toast.info('Dispatched 4 test errors');
                    }}
                    className="p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg"
                  >
                    <AlertTriangle className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                    <span className="text-xs text-orange-400">Spam Errors</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevMode;