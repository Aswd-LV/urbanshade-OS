import { useState, useEffect } from "react";
import { toast } from "sonner";

interface BiosScreenProps {
  onExit: () => void;
}

interface CustomApp {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
}

export const BiosScreen = ({ onExit }: BiosScreenProps) => {
  const [selectedTab, setSelectedTab] = useState<"main" | "boot" | "advanced" | "security" | "exit">("main");
  const [countdown, setCountdown] = useState(3);
  const [exitRequested, setExitRequested] = useState(false);
  
  const [bootOrder, setBootOrder] = useState(() => 
    localStorage.getItem('bios_boot_order') || 'hdd'
  );
  const [securityEnabled, setSecurityEnabled] = useState(() => 
    localStorage.getItem('bios_security_enabled') !== 'false'
  );
  const [fastBoot, setFastBoot] = useState(() => 
    localStorage.getItem('bios_fast_boot') === 'true'
  );
  const [biosPassword, setBiosPassword] = useState(() => 
    localStorage.getItem('bios_password') || ''
  );
  const [customApps, setCustomApps] = useState<CustomApp[]>(() => {
    const saved = localStorage.getItem('bios_custom_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const [cpuVirtualization, setCpuVirtualization] = useState(() =>
    localStorage.getItem('bios_cpu_virtualization') !== 'false'
  );

  useEffect(() => {
    if (exitRequested) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onExit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [exitRequested, onExit]);

  const oemUnlocked = localStorage.getItem('settings_oem_unlocked') === 'true';

  const saveSetting = (key: string, value: string | boolean) => {
    localStorage.setItem(`bios_${key}`, String(value));
    toast.success("Setting saved");
  };

  const handleBootOrderChange = (order: string) => {
    setBootOrder(order);
    saveSetting('boot_order', order);
  };

  const handleSecurityToggle = () => {
    const newValue = !securityEnabled;
    setSecurityEnabled(newValue);
    saveSetting('security_enabled', newValue);
  };

  const handleFastBootToggle = () => {
    const newValue = !fastBoot;
    setFastBoot(newValue);
    saveSetting('fast_boot', newValue);
  };

  const handlePasswordSet = () => {
    const password = prompt("Set BIOS password (or leave empty to remove):");
    if (password !== null) {
      setBiosPassword(password);
      saveSetting('password', password);
      toast.success(password ? "BIOS password set" : "BIOS password removed");
    }
  };

  const handleCpuVirtualizationToggle = () => {
    const newValue = !cpuVirtualization;
    setCpuVirtualization(newValue);
    saveSetting('cpu_virtualization', newValue);
  };

  const handleImportApp = () => {
    if (!oemUnlocked) {
      toast.error("Enable OEM unlock in Settings first");
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const appData = JSON.parse(event.target?.result as string);
          const newApp: CustomApp = {
            id: Date.now().toString(),
            name: appData.name || 'Custom App',
            code: appData.code || '',
            enabled: true,
          };
          const updated = [...customApps, newApp];
          setCustomApps(updated);
          localStorage.setItem('bios_custom_apps', JSON.stringify(updated));
          toast.success(`App "${newApp.name}" imported`);
        } catch (err) {
          toast.error("Invalid app file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const toggleApp = (appId: string) => {
    const updated = customApps.map(app => 
      app.id === appId ? { ...app, enabled: !app.enabled } : app
    );
    setCustomApps(updated);
    localStorage.setItem('bios_custom_apps', JSON.stringify(updated));
  };

  const deleteApp = (appId: string) => {
    const updated = customApps.filter(app => app.id !== appId);
    setCustomApps(updated);
    localStorage.setItem('bios_custom_apps', JSON.stringify(updated));
    toast.success("App deleted");
  };

  const loadDefaults = () => {
    setBootOrder('hdd');
    setSecurityEnabled(true);
    setFastBoot(false);
    setCpuVirtualization(true);
    saveSetting('boot_order', 'hdd');
    saveSetting('security_enabled', true);
    saveSetting('fast_boot', false);
    saveSetting('cpu_virtualization', true);
    toast.success("Loaded optimal defaults");
  };

  const saveAndExit = () => {
    toast.success("Settings saved");
    setExitRequested(true);
  };

  const exitWithoutSaving = () => {
    setExitRequested(true);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "main":
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 text-[#FFFF00]">SYSTEM INFORMATION</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>BIOS Version:</span>
                  <span className="text-white">URBANSHADE v2.7.1</span>
                </div>
                <div className="flex justify-between">
                  <span>Build Date:</span>
                  <span className="text-white">2025-01-15</span>
                </div>
                <div className="flex justify-between">
                  <span>System Type:</span>
                  <span className="text-white">x64-based PC</span>
                </div>
                <div className="flex justify-between">
                  <span>Processor:</span>
                  <span className="text-white">Intel Core i7-12700K @ 3.60GHz</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Memory:</span>
                  <span className="text-white">32768 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Speed:</span>
                  <span className="text-white">3200 MHz DDR4</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="text-white">1TB NVMe SSD</span>
                </div>
                <div className="flex justify-between">
                  <span>System Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>System Time:</span>
                  <span className="text-white">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "boot":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-[#FFFF00]">BOOT CONFIGURATION</h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-2">Boot Device Priority:</label>
                <select
                  value={bootOrder}
                  onChange={(e) => handleBootOrderChange(e.target.value)}
                  className="w-full bg-[#000080] text-white border border-[#00FFFF] px-2 py-1"
                >
                  <option value="hdd">1. Hard Disk Drive</option>
                  <option value="network">2. Network Boot</option>
                  <option value="usb">3. USB Device</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Fast Boot:</span>
                <button
                  onClick={handleFastBootToggle}
                  className="px-4 py-1 bg-[#000080] border border-[#00FFFF] text-white hover:bg-[#0000CD]"
                >
                  [{fastBoot ? 'X' : ' '}] {fastBoot ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="text-xs text-[#00FFFF] mt-2">
                * Fast Boot skips some POST tests for faster startup
              </div>
            </div>
          </div>
        );

      case "advanced":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-[#FFFF00]">ADVANCED SETTINGS</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>CPU Virtualization:</span>
                <button
                  onClick={handleCpuVirtualizationToggle}
                  className="px-4 py-1 bg-[#000080] border border-[#00FFFF] text-white hover:bg-[#0000CD]"
                >
                  [{cpuVirtualization ? 'X' : ' '}] {cpuVirtualization ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="border-t border-[#00FFFF] pt-3 mt-4">
                <h4 className="font-bold mb-2 text-[#FFFF00]">CUSTOM APPLICATIONS {!oemUnlocked && '(LOCKED)'}</h4>
                {!oemUnlocked ? (
                  <div className="text-xs text-[#FF0000]">
                    ⚠ Enable OEM unlock in Settings app to manage custom applications
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleImportApp}
                      className="px-4 py-1 mb-3 bg-[#000080] border border-[#00FFFF] text-white hover:bg-[#0000CD]"
                    >
                      + Import Application
                    </button>
                    {customApps.length === 0 ? (
                      <div className="text-xs text-[#00FFFF]">No custom apps installed</div>
                    ) : (
                      <div className="space-y-2">
                        {customApps.map(app => (
                          <div key={app.id} className="flex items-center justify-between text-sm border-b border-[#00FFFF] pb-1">
                            <span>{app.name}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleApp(app.id)}
                                className="px-2 py-1 bg-[#000080] border border-[#00FFFF] text-xs hover:bg-[#0000CD]"
                              >
                                [{app.enabled ? 'X' : ' '}]
                              </button>
                              <button
                                onClick={() => deleteApp(app.id)}
                                className="px-2 py-1 bg-[#800000] border border-[#FF0000] text-xs hover:bg-[#A00000]"
                              >
                                DEL
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-[#FFFF00]">SECURITY SETTINGS</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Security Mode:</span>
                <button
                  onClick={handleSecurityToggle}
                  className="px-4 py-1 bg-[#000080] border border-[#00FFFF] text-white hover:bg-[#0000CD]"
                >
                  [{securityEnabled ? 'X' : ' '}] {securityEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>BIOS Password:</span>
                <button
                  onClick={handlePasswordSet}
                  className="px-4 py-1 bg-[#000080] border border-[#00FFFF] text-white hover:bg-[#0000CD]"
                >
                  {biosPassword ? '[Set]' : '[Not Set]'}
                </button>
              </div>
              {!securityEnabled && (
                <div className="text-xs text-[#FF0000] mt-2">
                  ⚠ WARNING: Security features are disabled!
                </div>
              )}
            </div>
          </div>
        );

      case "exit":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-[#FFFF00]">EXIT OPTIONS</h3>
            <div className="space-y-3">
              <button
                onClick={saveAndExit}
                className="w-full px-4 py-2 bg-[#000080] border-2 border-[#00FFFF] text-white hover:bg-[#0000CD] text-left"
              >
                Save Changes and Exit
              </button>
              <button
                onClick={exitWithoutSaving}
                className="w-full px-4 py-2 bg-[#000080] border-2 border-[#00FFFF] text-white hover:bg-[#0000CD] text-left"
              >
                Exit Without Saving
              </button>
              <button
                onClick={loadDefaults}
                className="w-full px-4 py-2 bg-[#000080] border-2 border-[#00FFFF] text-white hover:bg-[#0000CD] text-left"
              >
                Load Optimal Defaults
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (exitRequested) {
    return (
      <div className="fixed inset-0 bg-[#000080] text-[#C0C0C0] flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-2xl mb-4">Exiting BIOS...</div>
          <div className="text-lg">System will boot in {countdown} seconds</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#000080] text-[#C0C0C0] font-mono overflow-hidden">
      <div className="bg-[#0000CD] text-white px-4 py-2 flex items-center justify-between">
        <div className="text-lg font-bold">URBANSHADE BIOS SETUP UTILITY</div>
        <div className="text-sm">Version 2.7.1</div>
      </div>

      <div className="bg-[#000040] border-b border-[#00FFFF]">
        <div className="flex">
          {[
            { id: 'main', label: 'Main' },
            { id: 'boot', label: 'Boot' },
            { id: 'advanced', label: 'Advanced' },
            { id: 'security', label: 'Security' },
            { id: 'exit', label: 'Exit' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-6 py-2 border-r border-[#00FFFF] ${
                selectedTab === tab.id 
                  ? 'bg-[#00008B] text-[#FFFF00]' 
                  : 'text-[#C0C0C0] hover:bg-[#000060]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 h-[calc(100vh-140px)] overflow-auto">
        {renderTabContent()}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#000040] border-t border-[#00FFFF] px-4 py-2 text-xs">
        <div className="flex justify-between">
          <span>↑↓: Select Item</span>
          <span>←→: Change Tab</span>
          <span>F10: Save & Exit</span>
          <span>ESC: Exit</span>
        </div>
      </div>
    </div>
  );
};
