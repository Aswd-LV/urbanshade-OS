import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, HardDrive, Shield, Cpu, Zap } from "lucide-react";

interface InstallerWizardProps {
  onComplete: (adminData: { username: string; password: string }) => void;
}

type Stage = "welcome" | "license" | "install-type" | "installing" | "config" | "complete";

// Bugcheck-inspired retro text-based installer
export const InstallerWizard = ({ onComplete }: InstallerWizardProps) => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [selectedOption, setSelectedOption] = useState(0);
  const [acceptLicense, setAcceptLicense] = useState(false);
  const [installType, setInstallType] = useState<"minimal" | "standard" | "full">("standard");
  const [installProgress, setInstallProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [computerName, setComputerName] = useState("URBANSHADE-01");
  const [counter, setCounter] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === "installing") return;
      
      const maxOptions = getMaxOptions();
      
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedOption(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedOption(prev => Math.min(maxOptions - 1, prev + 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleEnter();
      } else if (e.key === "Escape" && canGoBack()) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, selectedOption, acceptLicense]);

  // Memory counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => (prev + 1) % 9999);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Installation progress simulation
  useEffect(() => {
    if (stage !== "installing") return;

    const actions = [
      "Initializing system core...",
      "Extracting kernel modules...",
      "Installing HAL subsystem...",
      "Configuring security protocols...",
      "Loading containment drivers...",
      "Setting up network stack...",
      "Installing facility applications...",
      "Registering system components...",
      "Applying configuration...",
      "Finalizing installation...",
    ];

    let progress = 0;
    const speed = installType === "minimal" ? 80 : installType === "standard" ? 60 : 45;

    const interval = setInterval(() => {
      progress += 1;
      const actionIndex = Math.min(Math.floor((progress / 100) * actions.length), actions.length - 1);
      setCurrentAction(actions[actionIndex]);
      setInstallProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStage("config"), 500);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [stage, installType]);

  const getMaxOptions = () => {
    switch (stage) {
      case "welcome": return 2;
      case "license": return 2;
      case "install-type": return 3;
      case "config": return 2;
      case "complete": return 1;
      default: return 1;
    }
  };

  const canGoBack = () => {
    return ["license", "install-type"].includes(stage);
  };

  const handleBack = () => {
    setSelectedOption(0);
    if (stage === "license") setStage("welcome");
    else if (stage === "install-type") setStage("license");
  };

  const handleEnter = () => {
    switch (stage) {
      case "welcome":
        if (selectedOption === 0) {
          setStage("license");
          setSelectedOption(0);
        }
        break;
      case "license":
        if (selectedOption === 0) {
          setAcceptLicense(true);
          setStage("install-type");
          setSelectedOption(1); // Default to standard
        }
        break;
      case "install-type":
        setInstallType(["minimal", "standard", "full"][selectedOption] as "minimal" | "standard" | "full");
        setStage("installing");
        break;
      case "config":
        if (selectedOption === 0) {
          setStage("complete");
          setSelectedOption(0);
        }
        break;
      case "complete":
        handleFinish();
        break;
    }
  };

  const handleFinish = () => {
    localStorage.setItem("urbanshade_first_boot", "true");
    localStorage.setItem("urbanshade_install_type", installType);
    localStorage.setItem("urbanshade_computer_name", computerName);
    onComplete({ username: "Administrator", password: "admin" });
  };

  const renderOption = (index: number, label: string, description?: string, disabled?: boolean) => (
    <div
      onClick={() => !disabled && setSelectedOption(index)}
      onDoubleClick={() => !disabled && handleEnter()}
      className={`py-2 px-4 cursor-pointer flex items-center gap-3 transition-colors ${
        selectedOption === index 
          ? 'bg-white text-black' 
          : disabled 
            ? 'text-gray-600 cursor-not-allowed'
            : 'hover:bg-white/10'
      }`}
    >
      <span className={`w-4 font-bold ${selectedOption === index ? 'text-black' : 'text-gray-500'}`}>
        {selectedOption === index ? '►' : ' '}
      </span>
      <div>
        <span className={`text-sm ${disabled ? 'text-gray-600' : ''}`}>{label}</span>
        {description && (
          <span className={`text-xs ml-3 ${selectedOption === index ? 'text-black/60' : 'text-gray-500'}`}>
            {description}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black text-white font-mono flex flex-col select-none">
      {/* Top accent */}
      <div className="h-1 bg-white" />

      {/* Header */}
      <div className="px-8 py-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">UrbanShade OS Setup</h1>
          <p className="text-sm text-gray-400 mt-1">
            {stage === "welcome" && "Welcome to the installation wizard"}
            {stage === "license" && "License Agreement"}
            {stage === "install-type" && "Select installation type"}
            {stage === "installing" && "Installing UrbanShade OS..."}
            {stage === "config" && "System Configuration"}
            {stage === "complete" && "Installation Complete"}
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <div>Build 3.0.0</div>
          <div className="font-mono">0x{counter.toString(16).padStart(8, '0').toUpperCase()}</div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mx-8 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {["Welcome", "License", "Type", "Install", "Config", "Done"].map((step, i) => {
            const stages: Stage[] = ["welcome", "license", "install-type", "installing", "config", "complete"];
            const currentIndex = stages.indexOf(stage);
            const isActive = i === currentIndex;
            const isComplete = i < currentIndex;
            return (
              <div key={step} className="flex items-center gap-2">
                <span className={`
                  px-2 py-0.5 border 
                  ${isComplete ? 'border-white bg-white text-black' : ''}
                  ${isActive ? 'border-white' : 'border-gray-700'}
                `}>
                  {isComplete ? '✓' : i + 1}
                </span>
                <span className={isActive ? 'text-white' : ''}>{step}</span>
                {i < 5 && <span className="text-gray-700">—</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="mx-8 border-t border-white/20" />

      {/* Main content */}
      <div className="flex-1 px-8 py-6 overflow-auto">
        {stage === "welcome" && (
          <div className="max-w-2xl space-y-6">
            <div className="border border-white p-6">
              <div className="flex items-center gap-4 mb-4">
                <img src="/favicon.svg" alt="UrbanShade" className="w-12 h-12 invert" />
                <div>
                  <div className="text-xl font-bold">URBANSHADE OS</div>
                  <div className="text-sm text-gray-400">Deep Sea Facility Management System</div>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                This wizard will guide you through the installation of UrbanShade OS 
                on your facility terminal. The process takes approximately 2-10 minutes 
                depending on your selected configuration.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500 mb-2">Installation will:</div>
              <div className="text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-500" /> Install core system files
              </div>
              <div className="text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-gray-500" /> Configure storage subsystems
              </div>
              <div className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" /> Set up security protocols
              </div>
              <div className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-500" /> Initialize facility applications
              </div>
            </div>

            <div className="border border-white/40 p-4 mt-8">
              <div className="text-xs text-gray-400 mb-3">Select an option:</div>
              {renderOption(0, "Continue with installation")}
              {renderOption(1, "Cancel and exit", undefined, true)}
            </div>
          </div>
        )}

        {stage === "license" && (
          <div className="max-w-2xl space-y-6">
            <div className="border border-white p-4 h-64 overflow-y-auto text-xs text-gray-300 leading-relaxed">
              <div className="text-white font-bold mb-4">URBANSHADE OS LICENSE AGREEMENT</div>
              <p className="mb-3">
                By installing this software, you acknowledge that UrbanShade OS is 
                a simulated operating system environment for entertainment and educational 
                purposes only.
              </p>
              <p className="mb-3">
                This software does not access your real file system, modify system settings, 
                or perform any operations outside of your web browser's sandbox environment.
              </p>
              <p className="mb-3">
                All "files," "settings," and "system data" exist only within your browser's 
                localStorage and will be lost if you clear your browser data.
              </p>
              <p className="mb-3">
                The creators of UrbanShade OS are not responsible for:
              </p>
              <ul className="list-disc ml-6 mb-3 space-y-1">
                <li>Confusion between real and simulated operating systems</li>
                <li>Uncontrollable urges to explore underwater facilities</li>
                <li>Sudden interest in containment protocols</li>
                <li>Time lost exploring fictional terminal commands</li>
              </ul>
              <p className="mb-3">
                By selecting "I Accept," you agree to have fun and not take things too seriously.
              </p>
              <div className="mt-6 pt-4 border-t border-white/20 text-gray-500">
                © 2024 UrbanShade Corporation. All rights reserved.
                <br />
                Depth: 8,247m • Pressure: 824 atm • Document ID: LICENSE-V3.0
              </div>
            </div>

            <div className="border border-white/40 p-4">
              <div className="text-xs text-gray-400 mb-3">Do you accept the license agreement?</div>
              {renderOption(0, "I Accept", "Continue installation")}
              {renderOption(1, "I Decline", "Cancel installation", true)}
            </div>
          </div>
        )}

        {stage === "install-type" && (
          <div className="max-w-2xl space-y-6">
            <div className="text-sm text-gray-300 mb-4">
              Select the installation type that best suits your facility needs:
            </div>

            <div className="border border-white/40 p-4">
              <div className="text-xs text-gray-400 mb-3">Installation Types:</div>
              {renderOption(0, "Minimal", "Core system only — 2.4 GB, ~2 min")}
              {renderOption(1, "Standard (Recommended)", "Essential tools — 5.7 GB, ~5 min")}
              {renderOption(2, "Complete", "All applications — 12.3 GB, ~10 min")}
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex gap-4">
                <span className="text-gray-500 w-24">Target:</span>
                <span className="font-mono text-white">C:\URBANSHADE</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-24">Available:</span>
                <span className="font-mono">847.2 GB</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-24">Required:</span>
                <span className="font-mono">
                  {selectedOption === 0 ? "2.4 GB" : selectedOption === 1 ? "5.7 GB" : "12.3 GB"}
                </span>
              </div>
            </div>
          </div>
        )}

        {stage === "installing" && (
          <div className="max-w-2xl space-y-6">
            <div className="border border-white p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">Installing UrbanShade OS...</span>
                <span className="font-mono text-sm">{installProgress}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-4 border border-white">
                <div 
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${installProgress}%` }}
                />
              </div>

              <div className="mt-4 text-sm text-gray-400">{currentAction}</div>
            </div>

            {/* ASCII-style progress visualization */}
            <div className="font-mono text-xs text-gray-500 space-y-1">
              <div>Installing: {installType.toUpperCase()} configuration</div>
              <div>
                [{"█".repeat(Math.floor(installProgress / 5))}{"░".repeat(20 - Math.floor(installProgress / 5))}]
              </div>
              <div className="text-gray-600">
                Memory: 0x{counter.toString(16).padStart(8, '0').toUpperCase()} | 
                Sector: {Math.floor(installProgress * 10)} | 
                Status: WRITING
              </div>
            </div>

            <div className="text-xs text-gray-600">
              Please wait while UrbanShade OS is being installed. 
              Do not close this window or power off your terminal.
            </div>
          </div>
        )}

        {stage === "config" && (
          <div className="max-w-2xl space-y-6">
            <div className="text-sm text-gray-300 mb-4">
              Installation complete. Configure your system settings:
            </div>

            <div className="border border-white p-4 space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2">Computer Name:</label>
                <input
                  type="text"
                  value={computerName}
                  onChange={(e) => setComputerName(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
                  className="w-full bg-transparent border border-white/40 px-3 py-2 text-sm font-mono focus:outline-none focus:border-white"
                  maxLength={15}
                />
              </div>
            </div>

            <div className="border border-white/40 p-4">
              <div className="text-xs text-gray-400 mb-3">Ready to complete setup:</div>
              {renderOption(0, "Apply settings and continue")}
              {renderOption(1, "Advanced options", undefined, true)}
            </div>

            <div className="space-y-2 text-xs text-gray-500">
              <div>✓ Core system installed</div>
              <div>✓ Security protocols configured</div>
              <div>✓ Facility applications ready</div>
              <div>○ Pending: First-time setup (OOBE)</div>
            </div>
          </div>
        )}

        {stage === "complete" && (
          <div className="max-w-2xl space-y-6">
            <div className="border border-white p-6 text-center">
              <div className="text-4xl mb-4">✓</div>
              <div className="text-xl font-bold mb-2">Installation Complete</div>
              <div className="text-sm text-gray-400">
                UrbanShade OS has been successfully installed.
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span className="text-gray-500 w-32">Install Type:</span>
                <span className="capitalize">{installType}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-32">Computer Name:</span>
                <span className="font-mono">{computerName}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-32">Location:</span>
                <span className="font-mono">C:\URBANSHADE</span>
              </div>
            </div>

            <div className="border border-white/40 p-4">
              {renderOption(0, "Restart and begin first-time setup")}
            </div>

            <div className="text-xs text-gray-500">
              Your terminal will restart to complete the Out-of-Box Experience (OOBE).
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/20 px-8 py-4 flex items-center justify-between">
        <div className="text-xs text-gray-500 space-x-6">
          <span>ENTER=Select</span>
          <span>↑↓=Navigate</span>
          {canGoBack() && <span>ESC=Back</span>}
        </div>
        <div className="flex items-center gap-3">
          {canGoBack() && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-xs border border-white/40 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-3 h-3" />
              BACK
            </button>
          )}
          {stage !== "installing" && (
            <button
              onClick={handleEnter}
              className="px-4 py-2 text-xs bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {stage === "complete" ? "FINISH" : "NEXT"}
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-1 bg-white" />
    </div>
  );
};