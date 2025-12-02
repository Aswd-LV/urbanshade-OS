import { useState, useEffect, useRef } from "react";
import { Monitor, HardDrive, Disc, Folder, FileText, Check, ChevronRight, Waves, Shield, Terminal } from "lucide-react";

interface InstallerWizardProps {
  onComplete: (adminData: { username: string; password: string }) => void;
}

type Stage = "disk-load" | "welcome" | "install-type" | "directory" | "product-key" | "installing" | "complete";

const VALID_KEYS = ["URBSH-2024-FACIL-MGMT", "DEMO-KEY-URBANSHADE", "TEST-INSTALL-KEY", "DEPTH-8247-FACILITY"];

export const InstallerWizard = ({ onComplete }: InstallerWizardProps) => {
  const [stage, setStage] = useState<Stage>("disk-load");
  const [diskLoaded, setDiskLoaded] = useState(false);
  const [diskProgress, setDiskProgress] = useState(0);
  const [diskLogs, setDiskLogs] = useState<string[]>([]);
  
  // Installation options
  const [installType, setInstallType] = useState<"minimal" | "standard" | "full">("standard");
  const [installDir, setInstallDir] = useState("C:\\URBANSHADE");
  const [productKey, setProductKey] = useState("");
  const [keySegments, setKeySegments] = useState(["", "", "", ""]);
  
  // Installation progress
  const [installProgress, setInstallProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [installComplete, setInstallComplete] = useState(false);
  const [userConfigComplete, setUserConfigComplete] = useState(false);
  
  // Configuration during install
  const [configStep, setConfigStep] = useState(0);
  const [timezone, setTimezone] = useState("UTC-8 Pacific");
  const [computerName, setComputerName] = useState("URBANSHADE-01");
  const [networkType, setNetworkType] = useState("corporate");
  const [autoUpdates, setAutoUpdates] = useState(true);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-load disk with terminal messages
  useEffect(() => {
    if (stage === "disk-load") {
      const bootMessages = [
        "Initializing URBANSHADE Setup...",
        "Loading STNDT UI Framework v2.2.0...",
        "Mounting virtual disk: urbanshade_v2.img",
        "Verifying disk integrity... OK",
        "Loading kernel modules...",
        "ACPI: Detected deep-sea pressure sensors",
        "Initializing containment subsystems...",
        "Loading security certificates...",
        "STNDT: Standard Terminal Display loaded",
        "Decompressing setup files...",
        "Validating system requirements...",
        "Depth sensors: CALIBRATED",
        "Pressure compensation: ACTIVE",
        "Setup environment ready.",
      ];
      
      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        if (msgIndex < bootMessages.length) {
          setDiskLogs(prev => [...prev, bootMessages[msgIndex]]);
          setDiskProgress(((msgIndex + 1) / bootMessages.length) * 100);
          msgIndex++;
        } else {
          clearInterval(msgInterval);
          setDiskLoaded(true);
          setTimeout(() => setStage("welcome"), 800);
        }
      }, 300);
      
      return () => clearInterval(msgInterval);
    }
  }, [stage]);

  // Installation simulation
  useEffect(() => {
    if (stage === "installing" && !installComplete) {
      const files = getInstallFiles();
      let fileIndex = 0;
      let isCancelled = false;
      
      const interval = setInterval(() => {
        if (isCancelled) return;
        
        const currentFileData = files[fileIndex];
        if (currentFileData && fileIndex < files.length) {
          setCurrentFile(currentFileData.file);
          setInstallLogs(prev => [...prev.slice(-12), `[${currentFileData.action}] ${currentFileData.file}`]);
          setInstallProgress(((fileIndex + 1) / files.length) * 100);
          fileIndex++;
        } else {
          clearInterval(interval);
          if (!isCancelled) {
            setInstallComplete(true);
            setInstallLogs(prev => [...prev, "", "═══════════════════════════════════════", "  INSTALLATION COMPLETE - SYSTEM READY", "═══════════════════════════════════════"]);
          }
        }
      }, getInstallSpeed());
      
      return () => {
        isCancelled = true;
        clearInterval(interval);
      };
    }
  }, [stage, installType]);

  const getInstallSpeed = () => {
    switch (installType) {
      case "minimal": return 180;
      case "standard": return 140;
      case "full": return 100;
      default: return 150;
    }
  };

  const getInstallFiles = () => {
    const baseFiles = [
      { action: "EXTRACT", file: "kernel\\urbanshade.sys" },
      { action: "EXTRACT", file: "kernel\\hal_deepsea.dll" },
      { action: "EXTRACT", file: "kernel\\pressure_mgmt.sys" },
      { action: "INSTALL", file: "system32\\stndt_ui.dll" },
      { action: "INSTALL", file: "system32\\containment.dll" },
      { action: "CONFIG", file: "system32\\config\\FACILITY" },
      { action: "CONFIG", file: "system32\\config\\SECURITY" },
      { action: "INSTALL", file: "drivers\\depth_sensor.sys" },
      { action: "INSTALL", file: "drivers\\pressure_valve.sys" },
      { action: "COPY", file: "fonts\\urbanshade_mono.ttf" },
    ];
    
    const standardFiles = [
      { action: "INSTALL", file: "apps\\terminal.exe" },
      { action: "INSTALL", file: "apps\\explorer.exe" },
      { action: "INSTALL", file: "apps\\containment_monitor.exe" },
      { action: "INSTALL", file: "apps\\facility_map.exe" },
      { action: "INSTALL", file: "apps\\security_cam.exe" },
      { action: "CONFIG", file: "modules\\auth_biometric.dll" },
      { action: "CONFIG", file: "modules\\network_secure.dll" },
      { action: "INIT", file: "data\\personnel.udb" },
      { action: "INIT", file: "data\\containment.udb" },
      { action: "INIT", file: "data\\facility_zones.udb" },
      { action: "VERIFY", file: "security\\certificates.pem" },
      { action: "VERIFY", file: "security\\clearance_levels.cfg" },
    ];
    
    const fullFiles = [
      { action: "INSTALL", file: "apps\\specimen_tracker.exe" },
      { action: "INSTALL", file: "apps\\power_grid.exe" },
      { action: "INSTALL", file: "apps\\emergency_protocols.exe" },
      { action: "INSTALL", file: "apps\\research_notes.exe" },
      { action: "INSTALL", file: "apps\\comms_array.exe" },
      { action: "INSTALL", file: "apps\\environmental_ctrl.exe" },
      { action: "CONFIG", file: "modules\\specimen_bio.dll" },
      { action: "CONFIG", file: "modules\\lockdown_proto.dll" },
      { action: "INIT", file: "data\\specimens.udb" },
      { action: "INIT", file: "data\\research_logs.udb" },
      { action: "INIT", file: "data\\incident_reports.udb" },
      { action: "COPY", file: "assets\\maps\\facility_full.fmap" },
      { action: "COPY", file: "assets\\sounds\\alerts.wav" },
      { action: "COPY", file: "assets\\sounds\\lockdown.wav" },
      { action: "VERIFY", file: "protocols\\containment_breach.xml" },
      { action: "VERIFY", file: "protocols\\evacuation.xml" },
    ];
    
    if (installType === "minimal") return baseFiles;
    if (installType === "standard") return [...baseFiles, ...standardFiles];
    return [...baseFiles, ...standardFiles, ...fullFiles];
  };

  const handleKeySegmentChange = (index: number, value: string) => {
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    const newSegments = [...keySegments];
    newSegments[index] = cleanValue;
    setKeySegments(newSegments);
    setProductKey(newSegments.join("-"));
    
    if (cleanValue.length === 5 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const isValidKey = VALID_KEYS.includes(productKey);

  const handleFinish = () => {
    localStorage.setItem("urbanshade_first_boot", "true");
    localStorage.setItem("urbanshade_install_type", installType);
    localStorage.setItem("urbanshade_computer_name", computerName);
    onComplete({ username: "Administrator", password: "admin" });
  };

  const canFinish = installComplete && userConfigComplete;

  // Sidebar progress items
  const sidebarItems = [
    { id: "disk-load", label: "Loading Setup", done: stage !== "disk-load" },
    { id: "welcome", label: "Welcome", done: ["install-type", "directory", "product-key", "installing", "complete"].includes(stage) },
    { id: "install-type", label: "Installation Type", done: ["directory", "product-key", "installing", "complete"].includes(stage) },
    { id: "directory", label: "Select Directory", done: ["product-key", "installing", "complete"].includes(stage) },
    { id: "product-key", label: "Product Key", done: ["installing", "complete"].includes(stage) },
    { id: "installing", label: "Installing", done: stage === "complete" || installComplete },
    { id: "complete", label: "Finishing", done: stage === "complete" },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Main window */}
      <div className="relative w-full max-w-4xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm rounded-lg overflow-hidden">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 px-4 py-2 flex items-center gap-3 border-b border-cyan-500/30">
          <Waves className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-100 font-bold text-sm tracking-wide">URBANSHADE OS — Setup Wizard v2.2.0</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400/70">STNDT ACTIVE</span>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex min-h-[480px]">
          {/* Sidebar */}
          <div className="w-52 bg-gradient-to-b from-slate-800 to-slate-900 p-4 text-white border-r border-cyan-500/20">
            <div className="mb-6 text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-10 h-10 text-cyan-400" />
              </div>
              <div className="text-cyan-400 font-bold tracking-wider text-sm">URBANSHADE</div>
              <div className="text-cyan-600 text-xs">Deep Sea Division</div>
            </div>
            
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.id} className={`flex items-center gap-2 py-2 px-2 rounded text-xs transition-all ${
                  stage === item.id 
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border-l-2 border-cyan-400" 
                    : item.done 
                      ? "text-cyan-600" 
                      : "text-slate-500"
                }`}>
                  {item.done ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : stage === item.id ? (
                    <ChevronRight className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-slate-600" />
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
            
            {stage === "installing" && (
              <div className="mt-6 p-3 rounded bg-slate-800/50 border border-cyan-500/20">
                <div className="text-[10px] text-cyan-600 mb-1">ESTIMATED TIME</div>
                <div className="text-cyan-400 font-mono text-lg">{Math.ceil((100 - installProgress) / 12)} min</div>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 right-4 text-[9px] text-slate-600">
              Depth: 8,247m • Pressure: 824 atm
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-6 flex flex-col">
            {stage === "disk-load" && (
              <DiskLoadScreen progress={diskProgress} loaded={diskLoaded} logs={diskLogs} />
            )}
            
            {stage === "welcome" && (
              <WelcomeScreen onNext={() => setStage("install-type")} />
            )}
            
            {stage === "install-type" && (
              <InstallTypeScreen 
                installType={installType}
                setInstallType={setInstallType}
                onBack={() => setStage("welcome")}
                onNext={() => setStage("directory")}
              />
            )}
            
            {stage === "directory" && (
              <DirectoryScreen
                installDir={installDir}
                setInstallDir={setInstallDir}
                onBack={() => setStage("install-type")}
                onNext={() => setStage("product-key")}
              />
            )}
            
            {stage === "product-key" && (
              <ProductKeyScreen
                keySegments={keySegments}
                inputRefs={inputRefs}
                handleKeySegmentChange={handleKeySegmentChange}
                isValidKey={isValidKey}
                onBack={() => setStage("directory")}
                onNext={() => setStage("installing")}
              />
            )}
            
            {stage === "installing" && (
              <InstallingScreen
                installProgress={installProgress}
                currentFile={currentFile}
                installLogs={installLogs}
                installComplete={installComplete}
                userConfigComplete={userConfigComplete}
                configStep={configStep}
                setConfigStep={setConfigStep}
                timezone={timezone}
                setTimezone={setTimezone}
                computerName={computerName}
                setComputerName={setComputerName}
                networkType={networkType}
                setNetworkType={setNetworkType}
                autoUpdates={autoUpdates}
                setAutoUpdates={setAutoUpdates}
                setUserConfigComplete={setUserConfigComplete}
                canFinish={canFinish}
                onFinish={handleFinish}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components

const DiskLoadScreen = ({ progress, loaded, logs }: { progress: number; loaded: boolean; logs: string[] }) => (
  <div className="flex-1 flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <Terminal className="w-5 h-5 text-cyan-400" />
      <h2 className="text-lg font-bold text-cyan-400">
        {loaded ? "Setup Ready" : "Initializing Setup Environment"}
      </h2>
    </div>
    
    {/* Terminal output */}
    <div className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg p-4 font-mono text-xs overflow-hidden">
      <div className="text-cyan-600 mb-2">URBANSHADE SETUP LOADER v2.2.0</div>
      <div className="text-slate-600 mb-3">════════════════════════════════════════════</div>
      
      <div className="space-y-1 overflow-y-auto max-h-64">
        {logs.filter(Boolean).map((log, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-cyan-600">&gt;</span>
            <span className={`${log?.includes("OK") || log?.includes("loaded") || log?.includes("ready") || log?.includes("CALIBRATED") || log?.includes("ACTIVE") 
              ? "text-green-400" 
              : "text-cyan-300"}`}>
              {log}
            </span>
          </div>
        ))}
        {!loaded && <span className="text-cyan-400 animate-pulse">█</span>}
      </div>
    </div>
    
    {/* Progress bar */}
    <div className="mt-4">
      <div className="flex justify-between text-xs text-cyan-600 mb-1">
        <span>Loading setup files from urbanshade_v2.img</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/20">
        <div 
          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
);

const WelcomeScreen = ({ onNext }: { onNext: () => void }) => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-2xl font-bold text-cyan-400 mb-2">Welcome to UrbanShade OS</h2>
    <p className="text-cyan-600 text-sm mb-6">Deep Sea Facility Management System</p>
    
    <div className="flex-1 space-y-4">
      <p className="text-slate-300 text-sm">
        This wizard will install the UrbanShade Operating System on your facility terminal.
      </p>
      
      <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
        <p className="font-bold text-cyan-400 mb-3 text-sm">Setup will configure:</p>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Core STNDT operating system
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Facility management & monitoring tools
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Security & containment protocols
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Administrator account creation
          </li>
        </ul>
      </div>
      
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-xs text-cyan-300">
        <strong>Tip:</strong> You can configure system options while files are being installed.
      </div>
    </div>
    
    <div className="flex justify-end pt-4 border-t border-cyan-500/20">
      <UrbanButton onClick={onNext}>Begin Installation →</UrbanButton>
    </div>
  </div>
);

const InstallTypeScreen = ({ installType, setInstallType, onBack, onNext }: {
  installType: string;
  setInstallType: (type: "minimal" | "standard" | "full") => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-xl font-bold text-cyan-400 mb-1">Installation Type</h2>
    <p className="text-cyan-600 text-sm mb-6">Select the components to install</p>
    
    <div className="flex-1 space-y-3">
      {[
        { id: "minimal", label: "Minimal", desc: "Core system only — backup terminals", size: "2.4 GB", icon: "○" },
        { id: "standard", label: "Standard", desc: "Essential facility tools — recommended", size: "5.7 GB", icon: "◎", recommended: true },
        { id: "full", label: "Full Installation", desc: "All applications and research modules", size: "12.3 GB", icon: "●" },
      ].map(opt => (
        <button
          key={opt.id}
          onClick={() => setInstallType(opt.id as any)}
          className={`w-full p-4 rounded-lg border text-left transition-all ${
            installType === opt.id 
              ? "border-cyan-400 bg-cyan-500/10" 
              : "border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              installType === opt.id ? "border-cyan-400 bg-cyan-400" : "border-slate-600"
            }`}>
              {installType === opt.id && <Check className="w-3 h-3 text-slate-900" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-300">{opt.label}</span>
                {opt.recommended && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-400 mt-1">{opt.desc}</div>
              <div className="text-xs text-cyan-600 mt-2 font-mono">{opt.size} required</div>
            </div>
          </div>
        </button>
      ))}
      
      <div className="flex items-center gap-3 p-3 rounded bg-slate-800/50 border border-slate-700 text-xs">
        <HardDrive className="w-4 h-4 text-cyan-500" />
        <span className="text-slate-400">Available space: <span className="text-cyan-400 font-mono">847.2 GB</span></span>
      </div>
    </div>
    
    <div className="flex justify-between pt-4 border-t border-cyan-500/20">
      <UrbanButton variant="ghost" onClick={onBack}>← Back</UrbanButton>
      <UrbanButton onClick={onNext}>Next →</UrbanButton>
    </div>
  </div>
);

const DirectoryScreen = ({ installDir, setInstallDir, onBack, onNext }: {
  installDir: string;
  setInstallDir: (dir: string) => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-xl font-bold text-cyan-400 mb-1">Installation Directory</h2>
    <p className="text-cyan-600 text-sm mb-6">Select where to install UrbanShade OS</p>
    
    <div className="flex-1">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg">
          <Folder className="w-5 h-5 text-cyan-500" />
          <input
            type="text"
            value={installDir}
            onChange={(e) => setInstallDir(e.target.value)}
            className="flex-1 bg-transparent text-cyan-300 font-mono text-sm focus:outline-none"
          />
        </div>
        <UrbanButton variant="ghost">Browse</UrbanButton>
      </div>
      
      <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-3 h-48 overflow-y-auto">
        <div className="text-xs space-y-1 font-mono">
          {[
            { icon: HardDrive, name: "C:\\ (System)", indent: 0 },
            { icon: Folder, name: "Program Files", indent: 1 },
            { icon: Folder, name: "URBANSHADE", indent: 1, active: true },
            { icon: Folder, name: "Windows", indent: 1 },
            { icon: Folder, name: "Users", indent: 1 },
          ].map((item, i) => (
            <div 
              key={i}
              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-all ${
                item.active ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:bg-slate-700/50 hover:text-cyan-300"
              }`}
              style={{ paddingLeft: `${item.indent * 16 + 8}px` }}
            >
              <item.icon className={`w-4 h-4 ${item.active ? "text-cyan-400" : "text-cyan-600"}`} />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
    
    <div className="flex justify-between pt-4 border-t border-cyan-500/20">
      <UrbanButton variant="ghost" onClick={onBack}>← Back</UrbanButton>
      <UrbanButton onClick={onNext}>Next →</UrbanButton>
    </div>
  </div>
);

const ProductKeyScreen = ({ keySegments, inputRefs, handleKeySegmentChange, isValidKey, onBack, onNext }: {
  keySegments: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleKeySegmentChange: (index: number, value: string) => void;
  isValidKey: boolean;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-xl font-bold text-cyan-400 mb-1">Product Activation</h2>
    <p className="text-cyan-600 text-sm mb-6">Enter your facility license key</p>
    
    <div className="flex-1">
      <div className="flex gap-4 mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
          <Disc className="w-12 h-12 text-cyan-400" />
        </div>
        <div className="flex-1 text-sm text-slate-300">
          <p className="mb-2">Your Product Key was provided with your UrbanShade OS facility license.</p>
          <p className="text-slate-500 text-xs">Located on the back of the installation media container.</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-400 mb-3">Enter the Product Key:</p>
      
      <div className="flex items-center gap-2 justify-center mb-4">
        {keySegments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              ref={el => inputRefs.current[i] = el}
              type="text"
              value={seg}
              onChange={(e) => handleKeySegmentChange(i, e.target.value)}
              maxLength={5}
              className="w-20 px-3 py-2 bg-slate-800 border border-cyan-500/30 rounded text-center font-mono text-cyan-300 text-sm uppercase focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
            {i < 3 && <span className="text-cyan-600 text-lg font-bold">-</span>}
          </div>
        ))}
      </div>
      
      {isValidKey && (
        <div className="text-center text-green-400 text-sm flex items-center justify-center gap-2 mb-4">
          <Check className="w-4 h-4" /> License key validated
        </div>
      )}
      
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-xs text-cyan-400">
        <strong>Demo Keys:</strong>
        <div className="mt-1 font-mono text-cyan-300 space-y-0.5">
          <div>URBSH-2024-FACIL-MGMT</div>
          <div>DEMO-KEY-URBANSHADE</div>
          <div>DEPTH-8247-FACILITY</div>
        </div>
      </div>
    </div>
    
    <div className="flex justify-between pt-4 border-t border-cyan-500/20">
      <UrbanButton variant="ghost" onClick={onBack}>← Back</UrbanButton>
      <UrbanButton onClick={onNext} disabled={!isValidKey}>Next →</UrbanButton>
    </div>
  </div>
);

const InstallingScreen = ({
  installProgress, currentFile, installLogs, installComplete,
  userConfigComplete, configStep, setConfigStep,
  timezone, setTimezone, computerName, setComputerName,
  networkType, setNetworkType, autoUpdates, setAutoUpdates,
  setUserConfigComplete, canFinish, onFinish
}: {
  installProgress: number;
  currentFile: string;
  installLogs: string[];
  installComplete: boolean;
  userConfigComplete: boolean;
  configStep: number;
  setConfigStep: (step: number) => void;
  timezone: string;
  setTimezone: (tz: string) => void;
  computerName: string;
  setComputerName: (name: string) => void;
  networkType: string;
  setNetworkType: (type: string) => void;
  autoUpdates: boolean;
  setAutoUpdates: (updates: boolean) => void;
  setUserConfigComplete: (complete: boolean) => void;
  canFinish: boolean;
  onFinish: () => void;
}) => {
  const configSteps = [
    { title: "Time Zone", content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-400">Select facility time zone:</p>
        <select 
          value={timezone} 
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full p-2 bg-slate-800 border border-cyan-500/30 rounded text-cyan-300 text-sm focus:outline-none focus:border-cyan-400"
        >
          <option>UTC-8 Pacific (HQ)</option>
          <option>UTC-5 Eastern</option>
          <option>UTC+0 London</option>
          <option>UTC+9 Tokyo</option>
          <option>UTC-11 Mariana Trench</option>
        </select>
      </div>
    )},
    { title: "Terminal ID", content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-400">Terminal identification:</p>
        <input
          type="text"
          value={computerName}
          onChange={(e) => setComputerName(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
          maxLength={15}
          className="w-full p-2 bg-slate-800 border border-cyan-500/30 rounded font-mono text-cyan-300 text-sm focus:outline-none focus:border-cyan-400"
        />
        <p className="text-xs text-slate-500">Identifies this terminal on the facility network.</p>
      </div>
    )},
    { title: "Network", content: (
      <div className="space-y-2">
        <p className="text-sm text-slate-400 mb-2">Network access level:</p>
        {[
          { id: "corporate", label: "Facility Network", desc: "Full access" },
          { id: "guest", label: "Guest Access", desc: "Limited" },
          { id: "isolated", label: "Isolated Mode", desc: "Offline" },
        ].map(opt => (
          <label key={opt.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-800/50 cursor-pointer">
            <input
              type="radio"
              name="network"
              checked={networkType === opt.id}
              onChange={() => setNetworkType(opt.id)}
              className="text-cyan-400"
            />
            <div>
              <div className="text-sm text-cyan-300">{opt.label}</div>
              <div className="text-xs text-slate-500">{opt.desc}</div>
            </div>
          </label>
        ))}
      </div>
    )},
    { title: "Updates", content: (
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-slate-800/50">
          <input
            type="checkbox"
            checked={autoUpdates}
            onChange={(e) => setAutoUpdates(e.target.checked)}
            className="mt-1"
          />
          <div>
            <div className="text-sm text-cyan-300">Enable automatic updates</div>
            <div className="text-xs text-slate-500">Recommended for security patches</div>
          </div>
        </label>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 text-xs text-amber-400">
          ⚠ Keeping updates enabled is recommended for facility security.
        </div>
      </div>
    )},
  ];

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xl font-bold text-cyan-400 mb-1">
        {installComplete && userConfigComplete ? "Installation Complete" : "Installing UrbanShade OS"}
      </h2>
      <p className="text-cyan-600 text-sm mb-4">
        {installComplete && userConfigComplete ? "System ready to launch" : "Copying files and configuring system"}
      </p>
      
      <div className="flex-1 flex gap-4">
        {/* Left: Install progress */}
        <div className="flex-1 flex flex-col">
          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-cyan-400">{installComplete ? "Complete" : `Installing: ${Math.round(installProgress)}%`}</span>
              <span className="text-slate-500 font-mono truncate max-w-48">{currentFile}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/20">
              <div 
                className={`h-full transition-all duration-300 ${installComplete ? "bg-green-500" : "bg-gradient-to-r from-cyan-600 to-cyan-400"}`}
                style={{ width: `${installProgress}%` }}
              />
            </div>
          </div>
          
          {/* Terminal */}
          <div className="flex-1 bg-black/60 border border-cyan-500/20 rounded-lg p-3 font-mono text-[11px] overflow-y-auto">
            <div className="text-cyan-600 mb-1">URBANSHADE INSTALLER LOG</div>
            {installLogs.map((log, i) => (
              <div key={i} className={`${
                log.includes("COMPLETE") ? "text-green-400 font-bold" :
                log.includes("═") ? "text-cyan-500" :
                log.startsWith("[VERIFY]") ? "text-yellow-400" :
                log.startsWith("[CONFIG]") ? "text-purple-400" :
                log.startsWith("[INIT]") ? "text-blue-400" :
                "text-cyan-300"
              }`}>{log}</div>
            ))}
            {!installComplete && <span className="text-cyan-400 animate-pulse">█</span>}
          </div>
        </div>
        
        {/* Right: Configuration */}
        <div className="w-56 flex flex-col">
          <div className="text-xs font-bold text-cyan-500 mb-2">
            CONFIGURE WHILE INSTALLING
          </div>
          
          {!userConfigComplete ? (
            <>
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-3 flex-1">
                <div className="text-xs text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                    {configStep + 1}
                  </span>
                  {configSteps[configStep].title}
                </div>
                {configSteps[configStep].content}
              </div>
              
              <div className="flex justify-between mt-2 gap-2">
                <UrbanButton 
                  variant="ghost"
                  onClick={() => setConfigStep(Math.max(0, configStep - 1))}
                  disabled={configStep === 0}
                  size="sm"
                >
                  ←
                </UrbanButton>
                <div className="flex gap-1">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= configStep ? "bg-cyan-400" : "bg-slate-700"}`} />
                  ))}
                </div>
                {configStep < 3 ? (
                  <UrbanButton onClick={() => setConfigStep(configStep + 1)} size="sm">
                    →
                  </UrbanButton>
                ) : (
                  <UrbanButton onClick={() => setUserConfigComplete(true)} size="sm">
                    Done
                  </UrbanButton>
                )}
              </div>
            </>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex-1 flex flex-col items-center justify-center">
              <Check className="w-10 h-10 text-green-400 mb-2" />
              <div className="text-sm font-bold text-green-300">Config Complete</div>
              <div className="text-xs text-green-500 mt-1 text-center">
                {installComplete ? "Ready to finish!" : "Waiting for files..."}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-cyan-500/20 mt-4">
        <UrbanButton onClick={onFinish} disabled={!canFinish}>
          {canFinish ? "Launch UrbanShade →" : "Please wait..."}
        </UrbanButton>
      </div>
    </div>
  );
};

// UrbanShade themed button
const UrbanButton = ({ children, onClick, disabled, variant = "primary", size = "md" }: { 
  children: React.ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`font-medium transition-all ${
      size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
    } ${
      variant === "primary"
        ? "bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg shadow-lg shadow-cyan-500/20"
        : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg"
    } ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {children}
  </button>
);

export default InstallerWizard;
