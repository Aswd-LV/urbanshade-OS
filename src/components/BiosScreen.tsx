import { useState, useEffect } from "react";
import { Monitor, Cpu, HardDrive, Shield, Power, Settings, Package, Clock, Zap, Thermometer } from "lucide-react";

interface BiosScreenProps {
  onExit: () => void;
}

export const BiosScreen = ({ onExit }: BiosScreenProps) => {
  const [selectedSection, setSelectedSection] = useState<"main" | "advanced" | "boot" | "security" | "exit" | "custom">("main");
  const [showingExit, setShowingExit] = useState(false);
  const [exitCountdown, setExitCountdown] = useState<number | null>(null);
  const [oemUnlocked] = useState(() => localStorage.getItem("settings_oem_unlocked") === "true");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F10') {
        setShowingExit(true);
        setExitCountdown(3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showingExit]);

  useEffect(() => {
    if (exitCountdown !== null && exitCountdown > 0) {
      const timer = setTimeout(() => setExitCountdown(exitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (exitCountdown === 0) {
      onExit();
    }
  }, [exitCountdown, onExit]);

  const sections = [
    { id: "main", label: "Main", icon: <Monitor className="w-5 h-5" /> },
    { id: "advanced", label: "Advanced", icon: <Settings className="w-5 h-5" /> },
    { id: "boot", label: "Boot", icon: <Power className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
    { id: "exit", label: "Exit", icon: <Power className="w-5 h-5" /> },
  ];

  if (oemUnlocked) {
    sections.push({ id: "custom", label: "Custom Apps", icon: <Package className="w-5 h-5" /> });
  }

  const renderMain = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-6">
        {/* System Information Card */}
        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0078D7]/30 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#0078D7]" />
            </div>
            <h3 className="text-lg font-bold">System Information</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">UEFI Version:</span>
              <span className="font-mono text-[#0078D7]">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Processor:</span>
              <span className="font-mono">Urbanshade Quantum Core v4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Speed:</span>
              <span className="font-mono">4.2 GHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cores:</span>
              <span className="font-mono">8 Cores / 16 Threads</span>
            </div>
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0078D7]/30 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#0078D7]" />
            </div>
            <h3 className="text-lg font-bold">Memory</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Memory:</span>
              <span className="font-mono">32 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="font-mono">DDR5-6400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Channels:</span>
              <span className="font-mono">Dual Channel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Speed:</span>
              <span className="font-mono">6400 MT/s</span>
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0078D7]/30 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-[#0078D7]" />
            </div>
            <h3 className="text-lg font-bold">Storage Devices</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">NVMe SSD:</span>
                <span className="font-mono text-[#0078D7]">Primary</span>
              </div>
              <div className="text-xs text-gray-500">URBANSHADE-SSD-01 (2TB)</div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Interface:</span>
              <span className="font-mono">PCIe 4.0 x4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health:</span>
              <span className="text-green-400 font-mono">100%</span>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0078D7]/30 rounded-lg flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-[#0078D7]" />
            </div>
            <h3 className="text-lg font-bold">System Status</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">CPU Temperature:</span>
              <span className="font-mono text-green-400">42°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fan Speed:</span>
              <span className="font-mono">1200 RPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">System Voltage:</span>
              <span className="font-mono">12.0V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Power State:</span>
              <span className="text-green-400 font-mono">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#0078D7]" />
          <div className="flex-1">
            <div className="text-sm text-gray-400">System Time</div>
            <div className="font-mono text-lg">{new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#0078D7]" />
            CPU Configuration
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>Hyper-Threading</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>Virtualization (VT-x)</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>Turbo Boost</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>C-States</span>
              <span className="text-green-400">Enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0078D7]" />
            Chipset Configuration
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>SATA Mode</span>
              <span className="text-[#0078D7]">AHCI</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>USB Support</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>PCIe Link Speed</span>
              <span className="text-[#0078D7]">Gen 4</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>IOMMU</span>
              <span className="text-green-400">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <div className="font-bold text-amber-400 mb-1">Warning</div>
            <div className="text-sm text-gray-300">
              Modifying advanced settings may cause system instability. Only change these settings if you understand their purpose.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBoot = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Power className="w-5 h-5 text-[#0078D7]" />
          Boot Priority
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-[#0078D7]/20 border border-[#0078D7] rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0078D7]/40 rounded flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <div className="font-semibold">URBANSHADE-SSD-01</div>
              <div className="text-xs text-gray-400">NVMe SSD (2TB)</div>
            </div>
            <div className="text-green-400 text-sm">Primary</div>
          </div>
          <div className="p-3 bg-[#0078D7]/10 border border-[#0078D7]/30 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0078D7]/20 rounded flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <div className="font-semibold">Network Boot (PXE)</div>
              <div className="text-xs text-gray-400">Ethernet Adapter</div>
            </div>
          </div>
          <div className="p-3 bg-[#0078D7]/10 border border-[#0078D7]/30 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0078D7]/20 rounded flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <div className="font-semibold">USB Storage</div>
              <div className="text-xs text-gray-400">Removable Media</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Boot Options</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>Fast Boot</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>Boot Logo</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">
              <span>Secure Boot</span>
              <span className="text-green-400">Enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Boot Keys</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div><span className="text-[#0078D7] font-mono">DEL</span> - Enter UEFI Setup</div>
            <div><span className="text-[#0078D7] font-mono">F2</span> - Recovery Mode</div>
            <div><span className="text-[#0078D7] font-mono">F8</span> - Boot Menu</div>
            <div><span className="text-[#0078D7] font-mono">F10</span> - Save & Exit</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#0078D7]" />
          Security Features
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 hover:bg-[#0078D7]/10 rounded cursor-pointer border border-[#0078D7]/30">
            <div>
              <div className="font-semibold">Secure Boot</div>
              <div className="text-xs text-gray-400">UEFI firmware security feature</div>
            </div>
            <span className="text-green-400 font-semibold">Enabled</span>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-[#0078D7]/10 rounded cursor-pointer border border-[#0078D7]/30">
            <div>
              <div className="font-semibold">TPM 2.0</div>
              <div className="text-xs text-gray-400">Trusted Platform Module</div>
            </div>
            <span className="text-green-400 font-semibold">Active</span>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-[#0078D7]/10 rounded cursor-pointer border border-[#0078D7]/30">
            <div>
              <div className="font-semibold">Administrator Password</div>
              <div className="text-xs text-gray-400">UEFI setup password</div>
            </div>
            <span className="text-gray-400 font-semibold">Not Set</span>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-[#0078D7]/10 rounded cursor-pointer border border-[#0078D7]/30">
            <div>
              <div className="font-semibold">Boot Password</div>
              <div className="text-xs text-gray-400">Pre-boot authentication</div>
            </div>
            <span className="text-gray-400 font-semibold">Not Set</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400">
          <Shield className="w-5 h-5" />
          OEM Unlock Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Developer Options</span>
            <span className={`font-semibold ${oemUnlocked ? 'text-green-400' : 'text-gray-400'}`}>
              {oemUnlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
          <div className="text-xs text-gray-300">
            {oemUnlocked 
              ? 'Custom applications are enabled in UEFI. System warranty may be voided.'
              : 'Enable in Settings → Developer Options to unlock custom features.'
            }
          </div>
        </div>
      </div>
    </div>
  );

  const renderExit = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => {
            setShowingExit(true);
            setExitCountdown(3);
          }}
          className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 hover:from-[#0078D7]/30 hover:to-[#0063B1]/30 border border-[#0078D7]/50 rounded-lg p-8 text-left transition-all group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-[#0078D7]/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Power className="w-7 h-7 text-[#0078D7]" />
            </div>
            <div>
              <div className="text-lg font-bold">Save & Exit</div>
              <div className="text-sm text-gray-400">Save changes and restart</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Press F10 or click to exit</div>
        </button>

        <button
          onClick={onExit}
          className="bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/50 rounded-lg p-8 text-left transition-all group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-red-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Power className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <div className="text-lg font-bold">Discard & Exit</div>
              <div className="text-sm text-gray-400">Exit without saving</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Press ESC to discard changes</div>
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Load Defaults</h3>
        <button className="w-full p-3 bg-[#0078D7]/20 hover:bg-[#0078D7]/30 border border-[#0078D7]/50 rounded-lg transition-all">
          Load Optimized Defaults
        </button>
      </div>
    </div>
  );

  const renderCustom = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/50 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <Package className="w-6 h-6 text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">Custom Applications</h3>
            <div className="text-sm text-gray-300">
              OEM Unlock is enabled. You can now install custom applications and modifications.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Available Custom Apps</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">• Custom Facility Tools</div>
            <div className="p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">• Advanced Diagnostics</div>
            <div className="p-2 hover:bg-[#0078D7]/10 rounded cursor-pointer">• System Modding Tools</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0078D7]/20 to-[#0063B1]/20 border border-[#0078D7]/50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Installation Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Custom Apps:</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Warranty:</span>
              <span className="text-amber-400">Voided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showingExit) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a1929] to-[#001f3f] flex items-center justify-center text-white">
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-[#0078D7]/20 rounded-full animate-ping"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-[#0078D7] to-[#0063B1] rounded-full flex items-center justify-center">
              <Power className="w-16 h-16" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Exiting UEFI Setup...</h2>
          <p className="text-xl text-gray-300">System will restart in {exitCountdown} seconds</p>
          <div className="flex gap-4 justify-center">
            <div className="w-3 h-3 bg-[#0078D7] rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-[#0078D7] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-[#0078D7] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a1929] to-[#001f3f] text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0078D7] to-[#0063B1] p-6 border-b border-[#0078D7]/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">URBANSHADE UEFI FIRMWARE</h1>
            <p className="text-sm opacity-80">Version 2.1.0 - Secure Boot Enabled</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">System Time</div>
            <div className="text-lg font-mono">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#0078D7]/10 border-b border-[#0078D7]/30 px-6 py-3">
        <div className="flex gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedSection === section.id
                  ? 'bg-[#0078D7] text-white shadow-lg scale-105'
                  : 'bg-[#0078D7]/20 hover:bg-[#0078D7]/30 text-gray-300'
              }`}
            >
              {section.icon}
              <span className="font-semibold">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {selectedSection === "main" && renderMain()}
          {selectedSection === "advanced" && renderAdvanced()}
          {selectedSection === "boot" && renderBoot()}
          {selectedSection === "security" && renderSecurity()}
          {selectedSection === "exit" && renderExit()}
          {selectedSection === "custom" && oemUnlocked && renderCustom()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#0078D7]/10 border-t border-[#0078D7]/30 px-6 py-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-6 text-gray-400">
            <div><span className="text-[#0078D7] font-mono">F1</span> Help</div>
            <div><span className="text-[#0078D7] font-mono">F9</span> Load Defaults</div>
            <div><span className="text-[#0078D7] font-mono">F10</span> Save & Exit</div>
            <div><span className="text-[#0078D7] font-mono">ESC</span> Discard & Exit</div>
          </div>
          <div className="text-gray-500">© 2025 Urbanshade Corporation</div>
        </div>
      </div>
    </div>
  );
};