import { useState, useEffect, useRef } from "react";
import { Monitor, HardDrive, Disc, Folder, FileText, Check, ChevronRight } from "lucide-react";

interface InstallerWizardProps {
  onComplete: (adminData: { username: string; password: string }) => void;
}

type Stage = "disk-load" | "welcome" | "install-type" | "directory" | "product-key" | "installing" | "complete";

const VALID_KEYS = ["URBSH-2024-FACIL-MGMT", "DEMO-KEY-URBANSHADE", "TEST-INSTALL-KEY"];

export const InstallerWizard = ({ onComplete }: InstallerWizardProps) => {
  const [stage, setStage] = useState<Stage>("disk-load");
  const [diskLoaded, setDiskLoaded] = useState(false);
  const [diskProgress, setDiskProgress] = useState(0);
  
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

  // Auto-load disk on mount
  useEffect(() => {
    if (stage === "disk-load") {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setDiskProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setDiskLoaded(true);
              setTimeout(() => setStage("welcome"), 500);
              return 100;
            }
            return prev + 2;
          });
        }, 50);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Installation simulation
  useEffect(() => {
    if (stage === "installing" && !installComplete) {
      const files = getInstallFiles();
      let fileIndex = 0;
      
      const interval = setInterval(() => {
        if (fileIndex < files.length) {
          setCurrentFile(files[fileIndex]);
          setInstallLogs(prev => [...prev.slice(-15), `Copying: ${files[fileIndex]}`]);
          setInstallProgress(((fileIndex + 1) / files.length) * 100);
          fileIndex++;
        } else {
          clearInterval(interval);
          setInstallComplete(true);
        }
      }, getInstallSpeed());
      
      return () => clearInterval(interval);
    }
  }, [stage, installType]);

  const getInstallSpeed = () => {
    switch (installType) {
      case "minimal": return 200;
      case "standard": return 150;
      case "full": return 100;
    }
  };

  const getInstallFiles = () => {
    const baseFiles = [
      "system32\\kernel.sys", "system32\\hal.dll", "system32\\ntoskrnl.exe",
      "system32\\drivers\\acpi.sys", "system32\\drivers\\disk.sys",
      "system32\\config\\SYSTEM", "system32\\config\\SOFTWARE",
      "fonts\\arial.ttf", "fonts\\tahoma.ttf", "fonts\\courier.ttf",
    ];
    
    const standardFiles = [
      "apps\\terminal.exe", "apps\\explorer.exe", "apps\\notepad.exe",
      "apps\\monitor.exe", "apps\\settings.exe", "apps\\browser.exe",
      "modules\\security.dll", "modules\\network.dll", "modules\\auth.dll",
      "data\\containment.db", "data\\personnel.db", "data\\facility.db",
    ];
    
    const fullFiles = [
      "apps\\cameras.exe", "apps\\power.exe", "apps\\emergency.exe",
      "apps\\planner.exe", "apps\\research.exe", "apps\\comms.exe",
      "modules\\specimen.dll", "modules\\protocols.dll", "modules\\tracking.dll",
      "data\\specimens.db", "data\\research.db", "data\\logs.db",
      "assets\\maps\\facility.map", "assets\\sounds\\alerts.wav",
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
    { id: "disk-load", label: "Loading Setup Files", done: stage !== "disk-load" },
    { id: "welcome", label: "Welcome", done: ["install-type", "directory", "product-key", "installing", "complete"].includes(stage) },
    { id: "install-type", label: "Installation Type", done: ["directory", "product-key", "installing", "complete"].includes(stage) },
    { id: "directory", label: "Select Directory", done: ["product-key", "installing", "complete"].includes(stage) },
    { id: "product-key", label: "Product Key", done: ["installing", "complete"].includes(stage) },
    { id: "installing", label: "Installing", done: stage === "complete" || installComplete },
    { id: "complete", label: "Finishing Setup", done: stage === "complete" },
  ];

  return (
    <div className="fixed inset-0 bg-[#008080] flex items-center justify-center p-4">
      {/* Main window */}
      <div className="w-full max-w-4xl bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-lg">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">UrbanShade OS Setup</span>
        </div>
        
        {/* Content area */}
        <div className="flex min-h-[450px]">
          {/* Sidebar */}
          <div className="w-48 bg-gradient-to-b from-[#000080] to-[#0000a8] p-4 text-white">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-2 bg-[#c0c0c0] rounded flex items-center justify-center border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080]">
                <HardDrive className="w-10 h-10 text-[#000080]" />
              </div>
              <div className="text-center text-xs font-bold">URBANSHADE</div>
              <div className="text-center text-[10px] opacity-80">Setup Wizard</div>
            </div>
            
            <div className="space-y-1 text-xs">
              {sidebarItems.map((item, i) => (
                <div key={item.id} className={`flex items-center gap-1 py-1 ${
                  stage === item.id ? "font-bold" : "opacity-70"
                }`}>
                  {item.done ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : stage === item.id ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : (
                    <span className="w-3" />
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
            
            {stage === "installing" && (
              <div className="mt-6 text-xs">
                <div className="opacity-70 mb-1">Estimated time:</div>
                <div className="font-bold">{Math.ceil((100 - installProgress) / 10)} minutes</div>
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-4 flex flex-col">
            {stage === "disk-load" && (
              <DiskLoadScreen progress={diskProgress} loaded={diskLoaded} />
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

const DiskLoadScreen = ({ progress, loaded }: { progress: number; loaded: boolean }) => (
  <div className="flex-1 flex flex-col items-center justify-center">
    <Disc className={`w-16 h-16 text-[#000080] mb-4 ${!loaded ? "animate-spin" : ""}`} />
    <h2 className="text-lg font-bold text-[#000080] mb-2">
      {loaded ? "Setup Files Loaded" : "Reading UrbanShade.img..."}
    </h2>
    <p className="text-sm text-gray-600 mb-4">
      {loaded ? "Starting setup wizard..." : "Please wait while setup files are loaded from disk"}
    </p>
    <div className="w-64 h-5 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white">
      <div 
        className="h-full bg-[#000080] transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-gray-500 mt-2">{progress}% Complete</p>
  </div>
);

const WelcomeScreen = ({ onNext }: { onNext: () => void }) => (
  <div className="flex-1 flex flex-col">
    <h2 className="text-xl font-bold text-[#000080] mb-4">Welcome to UrbanShade OS Setup</h2>
    <div className="flex-1 space-y-4 text-sm">
      <p>This wizard will install UrbanShade Operating System on your computer.</p>
      <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-3">
        <p className="font-bold text-[#000080] mb-2">Setup will:</p>
        <ul className="space-y-1 text-gray-700">
          <li>• Install the UrbanShade OS core system</li>
          <li>• Configure facility management tools</li>
          <li>• Set up security and containment modules</li>
          <li>• Create your administrator account</li>
        </ul>
      </div>
      <p className="text-gray-600 text-xs">
        Tip: You can configure system options while files are being copied.
      </p>
    </div>
    <div className="flex justify-end gap-2 pt-4 border-t border-[#808080]">
      <Win98Button onClick={onNext}>Next &gt;</Win98Button>
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
    <h2 className="text-xl font-bold text-[#000080] mb-4">Select Installation Type</h2>
    <div className="flex-1 space-y-3">
      <p className="text-sm mb-4">Choose the type of installation you want:</p>
      
      {[
        { id: "minimal", label: "Minimal", desc: "Core system only (~2.4 GB)", size: "2.4 GB" },
        { id: "standard", label: "Standard (Recommended)", desc: "Essential facility tools (~5.7 GB)", size: "5.7 GB" },
        { id: "full", label: "Full Installation", desc: "All applications and modules (~12.3 GB)", size: "12.3 GB" },
      ].map(opt => (
        <label key={opt.id} className={`flex items-start gap-3 p-3 cursor-pointer border-2 ${
          installType === opt.id 
            ? "border-[#000080] bg-[#d4d0c8]" 
            : "border-transparent hover:bg-[#d4d0c8]"
        }`}>
          <input
            type="radio"
            name="installType"
            checked={installType === opt.id}
            onChange={() => setInstallType(opt.id as any)}
            className="mt-1"
          />
          <div>
            <div className="font-bold text-sm">{opt.label}</div>
            <div className="text-xs text-gray-600">{opt.desc}</div>
          </div>
        </label>
      ))}
      
      <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-2 mt-4">
        <div className="flex items-center gap-2 text-xs">
          <HardDrive className="w-4 h-4" />
          <span>Space required: {installType === "minimal" ? "2.4" : installType === "standard" ? "5.7" : "12.3"} GB</span>
          <span className="text-gray-500">| Available: 847.2 GB</span>
        </div>
      </div>
    </div>
    <div className="flex justify-between pt-4 border-t border-[#808080]">
      <Win98Button onClick={onBack}>&lt; Back</Win98Button>
      <Win98Button onClick={onNext}>Next &gt;</Win98Button>
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
    <h2 className="text-xl font-bold text-[#000080] mb-4">Select Directory</h2>
    <div className="flex-1">
      <p className="text-sm mb-4">Select the directory where you want to install UrbanShade OS:</p>
      
      <div className="flex gap-2 mb-4">
        <Folder className="w-8 h-8 text-yellow-600" />
        <input
          type="text"
          value={installDir}
          onChange={(e) => setInstallDir(e.target.value)}
          className="flex-1 px-2 py-1 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white text-sm font-mono"
        />
        <Win98Button>Browse...</Win98Button>
      </div>
      
      <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-3 h-40 overflow-y-auto">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-[#000080] hover:text-white p-1">
            <HardDrive className="w-4 h-4" /> C:\ (System)
          </div>
          <div className="pl-4 flex items-center gap-2 cursor-pointer hover:bg-[#000080] hover:text-white p-1">
            <Folder className="w-4 h-4 text-yellow-600" /> Program Files
          </div>
          <div className="pl-4 flex items-center gap-2 cursor-pointer hover:bg-[#000080] hover:text-white p-1">
            <Folder className="w-4 h-4 text-yellow-600" /> URBANSHADE
          </div>
          <div className="pl-4 flex items-center gap-2 cursor-pointer hover:bg-[#000080] hover:text-white p-1">
            <Folder className="w-4 h-4 text-yellow-600" /> Windows
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-between pt-4 border-t border-[#808080]">
      <Win98Button onClick={onBack}>&lt; Back</Win98Button>
      <Win98Button onClick={onNext}>Next &gt;</Win98Button>
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
    <h2 className="text-xl font-bold text-[#000080] mb-4">Product Key</h2>
    <div className="flex-1">
      <div className="flex gap-4 mb-6">
        <div className="w-24 h-24 bg-yellow-100 border-2 border-yellow-400 rounded flex items-center justify-center">
          <Disc className="w-12 h-12 text-yellow-600" />
        </div>
        <div className="flex-1 text-sm">
          <p className="mb-2">You received a Product Key with the materials that came with your UrbanShade OS software.</p>
          <p className="text-gray-600 text-xs">The Product Key can be found on the back of the CD container.</p>
        </div>
      </div>
      
      <p className="text-sm mb-3">Type the Product Key, excluding the dashes:</p>
      
      <div className="flex items-center gap-1 mb-4 justify-center">
        {keySegments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              ref={el => inputRefs.current[i] = el}
              type="text"
              value={seg}
              onChange={(e) => handleKeySegmentChange(i, e.target.value)}
              maxLength={5}
              className="w-16 px-2 py-1 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white text-center font-mono text-sm uppercase"
            />
            {i < 3 && <span className="text-lg font-bold">-</span>}
          </div>
        ))}
      </div>
      
      {isValidKey && (
        <div className="text-center text-green-700 text-sm flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> Valid product key
        </div>
      )}
      
      <div className="bg-[#ffffd0] border border-[#808080] p-2 mt-4 text-xs">
        <strong>Demo Keys:</strong> URBSH-2024-FACIL-MGMT, DEMO-KEY-URBANSHADE, TEST-INSTALL-KEY
      </div>
    </div>
    <div className="flex justify-between pt-4 border-t border-[#808080]">
      <Win98Button onClick={onBack}>&lt; Back</Win98Button>
      <Win98Button onClick={onNext} disabled={!isValidKey}>Next &gt;</Win98Button>
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
        <p className="text-sm">Select your time zone:</p>
        <select 
          value={timezone} 
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full p-2 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white"
        >
          <option>UTC-8 Pacific</option>
          <option>UTC-5 Eastern</option>
          <option>UTC+0 London</option>
          <option>UTC+1 Berlin</option>
          <option>UTC+9 Tokyo</option>
        </select>
      </div>
    )},
    { title: "Computer Name", content: (
      <div className="space-y-3">
        <p className="text-sm">Enter a name for this computer:</p>
        <input
          type="text"
          value={computerName}
          onChange={(e) => setComputerName(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
          maxLength={15}
          className="w-full p-2 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white font-mono"
        />
        <p className="text-xs text-gray-500">This name identifies your facility terminal on the network.</p>
      </div>
    )},
    { title: "Network Settings", content: (
      <div className="space-y-3">
        <p className="text-sm">Select network type:</p>
        {[
          { id: "corporate", label: "Corporate Network", desc: "Full facility access" },
          { id: "guest", label: "Guest Network", desc: "Limited access" },
          { id: "isolated", label: "Isolated Mode", desc: "No network connection" },
        ].map(opt => (
          <label key={opt.id} className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="network"
              checked={networkType === opt.id}
              onChange={() => setNetworkType(opt.id)}
              className="mt-1"
            />
            <div>
              <div className="text-sm font-bold">{opt.label}</div>
              <div className="text-xs text-gray-500">{opt.desc}</div>
            </div>
          </label>
        ))}
      </div>
    )},
    { title: "Updates", content: (
      <div className="space-y-3">
        <p className="text-sm">Configure automatic updates:</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoUpdates}
            onChange={(e) => setAutoUpdates(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Enable automatic system updates</span>
        </label>
        <div className="bg-[#ffffd0] border border-[#808080] p-2 text-xs">
          Recommended: Keep automatic updates enabled to receive security patches.
        </div>
      </div>
    )},
  ];

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xl font-bold text-[#000080] mb-4">
        {installComplete && userConfigComplete ? "Setup Complete" : "Installing UrbanShade OS"}
      </h2>
      
      <div className="flex-1 flex gap-4">
        {/* Left: Install progress */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-2 mb-2">
            <div className="h-4 bg-[#c0c0c0] border border-[#808080]">
              <div 
                className="h-full bg-[#000080] transition-all"
                style={{ width: `${installProgress}%` }}
              />
            </div>
          </div>
          
          <div className="text-xs mb-2 flex justify-between">
            <span>{installComplete ? "Installation complete!" : `Installing: ${Math.round(installProgress)}%`}</span>
            <span className="text-gray-500">{currentFile}</span>
          </div>
          
          <div className="flex-1 bg-black text-green-400 p-2 font-mono text-[10px] overflow-y-auto border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white">
            {installLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            {installComplete && <div className="text-white mt-2">✓ All files copied successfully</div>}
          </div>
        </div>
        
        {/* Right: Configuration */}
        <div className="w-56 flex flex-col">
          <div className="text-sm font-bold text-[#000080] mb-2">
            Configure while installing:
          </div>
          
          {!userConfigComplete ? (
            <>
              <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-3 flex-1">
                <div className="text-xs font-bold text-[#000080] mb-3">
                  Step {configStep + 1}/4: {configSteps[configStep].title}
                </div>
                {configSteps[configStep].content}
              </div>
              
              <div className="flex justify-between mt-2">
                <Win98Button 
                  onClick={() => setConfigStep(Math.max(0, configStep - 1))}
                  disabled={configStep === 0}
                >
                  &lt; Back
                </Win98Button>
                {configStep < 3 ? (
                  <Win98Button onClick={() => setConfigStep(configStep + 1)}>
                    Next &gt;
                  </Win98Button>
                ) : (
                  <Win98Button onClick={() => setUserConfigComplete(true)}>
                    Done
                  </Win98Button>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#d4ffd4] border-2 border-green-600 p-3 flex-1 flex flex-col items-center justify-center">
              <Check className="w-12 h-12 text-green-600 mb-2" />
              <div className="text-sm font-bold text-green-800">Configuration Complete</div>
              <div className="text-xs text-green-600 mt-1">
                {installComplete ? "Ready to finish!" : "Waiting for files..."}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-[#808080] mt-4">
        <Win98Button onClick={onFinish} disabled={!canFinish}>
          {canFinish ? "Finish" : "Please wait..."}
        </Win98Button>
      </div>
    </div>
  );
};

// Win98-style button
const Win98Button = ({ children, onClick, disabled }: { 
  children: React.ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-1 text-sm border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d0c8]"
    }`}
  >
    {children}
  </button>
);

export default InstallerWizard;
