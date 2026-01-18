import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Power, Terminal, Database, HardDrive, 
  Shield, RefreshCw, Settings, Check, AlertTriangle,
  Cpu, Trash2, Upload, ChevronRight
} from "lucide-react";
import { RecoveryTerminal } from "./RecoveryTerminal";

type RecoveryScreen = 
  | "main" 
  | "troubleshoot" 
  | "startup-settings" 
  | "data-recovery" 
  | "system-image"
  | "recovery-image"
  | "terminal"
  | "rebooting";

interface RecoveryEnvironmentProps {
  onContinue: () => void;
  onShutdown: () => void;
  onBootToBios: () => void;
  onTerminalBoot: () => void;
  onSafeMode: () => void;
  onOfflineMode: () => void;
}

export const RecoveryEnvironment = ({
  onContinue,
  onShutdown,
  onBootToBios,
  onTerminalBoot,
  onSafeMode,
  onOfflineMode,
}: RecoveryEnvironmentProps) => {
  const [screen, setScreen] = useState<RecoveryScreen>("main");
  const [selectedOption, setSelectedOption] = useState(0);
  const [recoveryProgress, setRecoveryProgress] = useState(0);
  const [recoveryStatus, setRecoveryStatus] = useState("");
  const [recoveredItems, setRecoveredItems] = useState<string[]>([]);
  const [recoveryImages, setRecoveryImages] = useState<any[]>([]);
  const [rebootTarget, setRebootTarget] = useState<string | null>(null);
  const [rebootProgress, setRebootProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load recovery images from localStorage
  useEffect(() => {
    const images = localStorage.getItem("urbanshade_recovery_images");
    if (images) {
      try {
        setRecoveryImages(JSON.parse(images));
      } catch {}
    }
  }, []);

  // Handle reboot animation
  useEffect(() => {
    if (screen === "rebooting") {
      const interval = setInterval(() => {
        setRebootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Execute the reboot target
            setTimeout(() => {
              if (rebootTarget === "bios") onBootToBios();
              else if (rebootTarget === "safe-mode") onSafeMode();
              else if (rebootTarget === "safe-mode-terminal") onTerminalBoot();
              else if (rebootTarget === "offline-mode") onOfflineMode();
              else if (rebootTarget === "normal") onContinue();
            }, 300);
            return 100;
          }
          return prev + 8;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [screen, rebootTarget]);

  // Keyboard navigation
  useEffect(() => {
    if (screen === "terminal" || screen === "rebooting") return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedOption(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowDown") {
        setSelectedOption(prev => prev + 1);
      } else if (e.key === "Escape" || e.key === "Backspace") {
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, selectedOption]);

  const handleBack = () => {
    if (screen === "troubleshoot") setScreen("main");
    else if (["startup-settings", "data-recovery", "system-image", "recovery-image"].includes(screen)) {
      setScreen("troubleshoot");
    }
    setSelectedOption(0);
  };

  const initiateReboot = (target: string) => {
    setRebootTarget(target);
    setRebootProgress(0);
    setScreen("rebooting");
  };

  const runDataRecovery = async () => {
    setRecoveryProgress(0);
    setRecoveryStatus("Scanning localStorage...");
    setRecoveredItems([]);

    const steps = [
      { progress: 10, status: "Checking key integrity..." },
      { progress: 30, status: "Validating JSON structures..." },
      { progress: 50, status: "Scanning for orphaned data..." },
      { progress: 70, status: "Attempting repairs..." },
      { progress: 90, status: "Verifying data consistency..." },
      { progress: 100, status: "Scan complete" },
    ];

    const recovered: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value) JSON.parse(value);
        } catch {
          recovered.push(key);
        }
      }
    }

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 400));
      setRecoveryProgress(step.progress);
      setRecoveryStatus(step.status);
    }
    setRecoveredItems(recovered);
  };

  const applyStartupSetting = (setting: string) => {
    switch (setting) {
      case "safe-mode":
        sessionStorage.setItem("urbanshade_safe_mode", "true");
        initiateReboot("safe-mode");
        break;
      case "safe-mode-terminal":
        sessionStorage.setItem("urbanshade_safe_mode", "true");
        sessionStorage.setItem("urbanshade_terminal_only", "true");
        initiateReboot("safe-mode-terminal");
        break;
      case "offline-mode":
        sessionStorage.setItem("urbanshade_offline_mode", "true");
        initiateReboot("offline-mode");
        break;
      case "boot-logging":
        sessionStorage.setItem("urbanshade_boot_logging", "true");
        initiateReboot("normal");
        break;
      case "force-verification":
        sessionStorage.setItem("urbanshade_force_verify", "true");
        initiateReboot("normal");
        break;
      case "disable-auto-restart":
        sessionStorage.setItem("urbanshade_no_auto_restart", "true");
        initiateReboot("normal");
        break;
      case "clear-cache":
        const essentialKeys = [
          "urbanshade_admin", "urbanshade_accounts", "urbanshade_oobe_complete",
          "urbanshade_disclaimer_accepted", "urbanshade_install_type",
        ];
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && !essentialKeys.includes(key) && !key.startsWith("urbanshade_admin")) {
            if (key.includes("cache") || key.includes("temp") || key.includes("session")) {
              localStorage.removeItem(key);
            }
          }
        }
        initiateReboot("normal");
        break;
      case "normal":
        initiateReboot("normal");
        break;
    }
  };

  const loadRecoveryImage = (image: any) => {
    if (!image?.data) return;
    Object.entries(image.data).forEach(([key, value]) => {
      if (key !== "urbanshade_recovery_images") {
        localStorage.setItem(key, value as string);
      }
    });
    onContinue();
  };

  const handleImportImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });
        onContinue();
      } catch {
        alert("Invalid image file");
      }
    };
    reader.readAsText(file);
  };

  // Rebooting screen
  if (screen === "rebooting") {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-cyan-500 mx-auto mb-4 animate-spin" />
          <div className="text-white text-sm font-mono mb-2">Restarting...</div>
          <div className="w-48 h-1 bg-zinc-800">
            <div 
              className="h-full bg-cyan-500 transition-all"
              style={{ width: `${rebootProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Terminal screen
  if (screen === "terminal") {
    return (
      <RecoveryTerminal 
        onExit={() => setScreen("troubleshoot")}
        onReboot={() => initiateReboot("normal")}
      />
    );
  }

  // Utilitarian button component
  const RecoveryButton = ({ 
    selected, 
    onClick, 
    onMouseEnter,
    icon: Icon, 
    label, 
    desc,
    number
  }: { 
    selected: boolean; 
    onClick: () => void; 
    onMouseEnter: () => void;
    icon?: any; 
    label: string; 
    desc?: string;
    number?: string;
  }) => (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`w-full p-3 border text-left flex items-center gap-3 transition-colors ${
        selected
          ? "bg-cyan-900/40 border-cyan-600 text-white"
          : "bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:border-zinc-500"
      }`}
    >
      {number && (
        <div className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold ${
          selected ? "bg-cyan-500 text-black" : "bg-zinc-700 text-zinc-300"
        }`}>
          {number}
        </div>
      )}
      {Icon && !number && (
        <Icon className={`w-5 h-5 ${selected ? "text-cyan-400" : "text-zinc-500"}`} />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        {desc && <div className="text-xs text-zinc-500 truncate">{desc}</div>}
      </div>
      {selected && <ChevronRight className="w-4 h-4 text-cyan-400" />}
    </button>
  );

  // Main Menu
  if (screen === "main") {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <Shield className="w-6 h-6 text-cyan-500" />
          <div>
            <h1 className="text-lg font-medium text-white">Recovery Environment</h1>
            <p className="text-xs text-zinc-500">Choose an option</p>
          </div>
        </div>

        {/* Options */}
        <div className="flex-1 max-w-lg space-y-1">
          <RecoveryButton
            selected={selectedOption === 0}
            onClick={onContinue}
            onMouseEnter={() => setSelectedOption(0)}
            icon={ChevronRight}
            label="Continue"
            desc="Exit and boot to UrbanShade OS"
          />
          <RecoveryButton
            selected={selectedOption === 1}
            onClick={onShutdown}
            onMouseEnter={() => setSelectedOption(1)}
            icon={Power}
            label="Turn off your PC"
            desc="Shut down the system"
          />
          <RecoveryButton
            selected={selectedOption === 2}
            onClick={() => { setScreen("troubleshoot"); setSelectedOption(0); }}
            onMouseEnter={() => setSelectedOption(2)}
            icon={Settings}
            label="Troubleshoot"
            desc="Advanced options and recovery tools"
          />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-600 font-mono">
          Use ↑↓ to navigate, Enter to select
        </div>
      </div>
    );
  }

  // Troubleshoot
  if (screen === "troubleshoot") {
    const options = [
      { id: "data-recovery", icon: Database, label: "Data Recovery", desc: "Scan and repair corrupted data" },
      { id: "terminal", icon: Terminal, label: "Terminal", desc: "Recovery command line" },
      { id: "bios", icon: Cpu, label: "UEFI/BIOS Settings", desc: "Change firmware settings" },
      { id: "system-image", icon: HardDrive, label: "System Image Recovery", desc: "Restore from image file" },
      { id: "recovery-image", icon: RefreshCw, label: "DEF-DEV Snapshots", desc: "Load recovery snapshot" },
      { id: "startup-settings", icon: Settings, label: "Startup Settings", desc: "Change boot behavior" },
    ];

    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <button
            onClick={handleBack}
            className="p-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <div>
            <h1 className="text-lg font-medium text-white">Advanced Options</h1>
            <p className="text-xs text-zinc-500">Select a recovery tool</p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="flex-1 grid grid-cols-2 gap-1 max-w-2xl content-start">
          {options.map((opt, i) => (
            <RecoveryButton
              key={opt.id}
              selected={selectedOption === i}
              onClick={() => {
                if (opt.id === "terminal") setScreen("terminal");
                else if (opt.id === "bios") initiateReboot("bios");
                else if (opt.id === "data-recovery") { setScreen("data-recovery"); runDataRecovery(); }
                else if (opt.id === "startup-settings") { setScreen("startup-settings"); setSelectedOption(0); }
                else if (opt.id === "system-image") setScreen("system-image");
                else if (opt.id === "recovery-image") setScreen("recovery-image");
              }}
              onMouseEnter={() => setSelectedOption(i)}
              icon={opt.icon}
              label={opt.label}
              desc={opt.desc}
            />
          ))}
        </div>
      </div>
    );
  }

  // Startup Settings
  if (screen === "startup-settings") {
    const settings = [
      { id: "safe-mode", num: "1", label: "Enable Safe Mode", desc: "Minimal drivers" },
      { id: "safe-mode-terminal", num: "2", label: "Safe Mode + Terminal", desc: "Command line only" },
      { id: "offline-mode", num: "3", label: "Enable Offline Mode", desc: "Disable network" },
      { id: "boot-logging", num: "4", label: "Enable Boot Logging", desc: "Log boot stages" },
      { id: "force-verification", num: "5", label: "Force Verification", desc: "Verify data on boot" },
      { id: "disable-auto-restart", num: "6", label: "Disable Auto-Restart", desc: "Show errors instead" },
      { id: "clear-cache", num: "7", label: "Clear Cache & Restart", desc: "Reset temp storage" },
      { id: "normal", num: "8", label: "Normal Restart", desc: "Boot normally" },
    ];

    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <button
            onClick={handleBack}
            className="p-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <div>
            <h1 className="text-lg font-medium text-white">Startup Settings</h1>
            <p className="text-xs text-zinc-500">Select to apply and restart</p>
          </div>
        </div>

        {/* Settings List */}
        <div className="flex-1 max-w-lg space-y-1">
          {settings.map((s, i) => (
            <RecoveryButton
              key={s.id}
              selected={selectedOption === i}
              onClick={() => applyStartupSetting(s.id)}
              onMouseEnter={() => setSelectedOption(i)}
              number={s.num}
              label={s.label}
              desc={s.desc}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-600 font-mono">
          All options trigger a system restart
        </div>
      </div>
    );
  }

  // Data Recovery
  if (screen === "data-recovery") {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <button
            onClick={handleBack}
            className="p-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <div>
            <h1 className="text-lg font-medium text-white">Data Recovery</h1>
            <p className="text-xs text-zinc-500">Scanning for issues...</p>
          </div>
        </div>

        <div className="flex-1 max-w-lg">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 text-xs font-mono">
              <span className="text-zinc-400">{recoveryStatus}</span>
              <span className="text-cyan-400">{recoveryProgress}%</span>
            </div>
            <div className="h-1 bg-zinc-800">
              <div 
                className="h-full bg-cyan-500 transition-all"
                style={{ width: `${recoveryProgress}%` }}
              />
            </div>
          </div>

          {/* Results */}
          {recoveryProgress === 100 && (
            <div className="space-y-3">
              {recoveredItems.length === 0 ? (
                <div className="p-4 bg-green-900/20 border border-green-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">No issues found</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-900/20 border border-amber-800">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm">{recoveredItems.length} issues found</span>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {recoveredItems.map(key => (
                      <div key={key} className="flex items-center justify-between p-2 bg-zinc-900 text-xs">
                        <span className="font-mono text-zinc-300 truncate">{key}</span>
                        <button
                          onClick={() => {
                            localStorage.removeItem(key);
                            setRecoveredItems(prev => prev.filter(k => k !== key));
                          }}
                          className="p-1 text-red-400 hover:bg-red-900/30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleBack}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition-colors"
              >
                Return to Advanced Options
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // System Image / Recovery Image
  if (screen === "system-image" || screen === "recovery-image") {
    const isSystemImage = screen === "system-image";
    
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <button
            onClick={handleBack}
            className="p-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <div>
            <h1 className="text-lg font-medium text-white">
              {isSystemImage ? "System Image Recovery" : "DEF-DEV Snapshots"}
            </h1>
            <p className="text-xs text-zinc-500">
              {isSystemImage ? "Restore from image file" : "Load a recovery snapshot"}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-lg space-y-3">
          {/* Import Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border border-dashed border-zinc-600 bg-zinc-900/50 hover:border-cyan-600 hover:bg-cyan-900/10 transition-colors flex items-center justify-center gap-2 text-zinc-400"
          >
            <Upload className="w-5 h-5" />
            <span className="text-sm">Import {isSystemImage ? 'System Image' : 'Snapshot'} File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportImage}
            className="hidden"
          />

          {/* Saved Images */}
          {recoveryImages.length > 0 ? (
            <div className="space-y-1">
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Saved Snapshots</div>
              {recoveryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => loadRecoveryImage(img)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 hover:border-cyan-600 transition-colors flex items-center gap-3 text-left"
                >
                  <HardDrive className="w-5 h-5 text-cyan-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{img.name || `Snapshot ${i + 1}`}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(img.timestamp).toLocaleString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-zinc-900 border border-zinc-800 text-center">
              <HardDrive className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <div className="text-sm text-zinc-400">No snapshots found</div>
              <div className="text-xs text-zinc-600 mt-1">
                Create snapshots in DEF-DEV or import a file
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
