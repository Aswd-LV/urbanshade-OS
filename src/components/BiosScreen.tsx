import { useState, useEffect, useCallback, useRef } from "react";
import { Monitor, Cpu, HardDrive, Shield, Power, Settings, Package, Clock, Zap, Thermometer, GripVertical, HelpCircle, ChevronUp, ChevronDown, Lock, Unlock, AlertTriangle, Download, Upload, Save, RotateCcw } from "lucide-react";
import { useBiosSettings, BiosSettings, exportBiosConfig, importBiosConfig } from "@/hooks/useBiosSettings";
import { toast } from "sonner";

interface BiosScreenProps {
  onExit: () => void;
}

type Section = "main" | "advanced" | "boot" | "security" | "backup" | "exit" | "custom";

export const BiosScreen = ({ onExit }: BiosScreenProps) => {
  const [selectedSection, setSelectedSection] = useState<Section>("main");
  const [showingExit, setShowingExit] = useState(false);
  const [exitCountdown, setExitCountdown] = useState<number | null>(null);
  const [oemUnlocked] = useState(() => localStorage.getItem("settings_oem_unlocked") === "true");
  const [showHelp, setShowHelp] = useState(false);
  const [showLoadDefaults, setShowLoadDefaults] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState<'admin' | 'boot' | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemUptime, setSystemUptime] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    settings,
    hasChanges,
    updateSetting,
    toggleSetting,
    setBootOrder,
    loadDefaults,
    saveChanges,
    setAdminPassword,
    setBootPassword,
  } = useBiosSettings();

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setSystemUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showPasswordDialog || showHelp || showLoadDefaults) {
        if (e.key === 'Escape') {
          setShowPasswordDialog(null);
          setShowHelp(false);
          setShowLoadDefaults(false);
          setPasswordInput('');
          setPasswordConfirm('');
          setPasswordError('');
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          onExit();
          break;
        case 'F1':
          e.preventDefault();
          setShowHelp(true);
          break;
        case 'F9':
          e.preventDefault();
          setShowLoadDefaults(true);
          break;
        case 'F10':
          e.preventDefault();
          saveChanges();
          setShowingExit(true);
          setExitCountdown(3);
          break;
        case 'Tab':
          e.preventDefault();
          const sectionOrder: Section[] = ['main', 'advanced', 'boot', 'security', 'backup', 'exit'];
          if (oemUnlocked) sectionOrder.push('custom');
          const currentIndex = sectionOrder.indexOf(selectedSection);
          const nextIndex = e.shiftKey 
            ? (currentIndex - 1 + sectionOrder.length) % sectionOrder.length
            : (currentIndex + 1) % sectionOrder.length;
          setSelectedSection(sectionOrder[nextIndex]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSection, oemUnlocked, showPasswordDialog, showHelp, showLoadDefaults, saveChanges, onExit]);

  // Exit countdown
  useEffect(() => {
    if (exitCountdown !== null && exitCountdown > 0) {
      const timer = setTimeout(() => setExitCountdown(exitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (exitCountdown === 0) {
      onExit();
    }
  }, [exitCountdown, onExit]);

  const sections = [
    { id: "main", label: "Main", icon: <Monitor className="w-4 h-4" /> },
    { id: "advanced", label: "Advanced", icon: <Settings className="w-4 h-4" /> },
    { id: "boot", label: "Boot", icon: <Power className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "backup", label: "Backup", icon: <Save className="w-4 h-4" /> },
    { id: "exit", label: "Exit", icon: <Power className="w-4 h-4" /> },
  ];

  if (oemUnlocked) {
    sections.push({ id: "custom", label: "Custom", icon: <Package className="w-4 h-4" /> });
  }

  // Boot order drag handlers
  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    
    const newOrder = [...settings.bootOrder];
    const [removed] = newOrder.splice(draggingIndex, 1);
    newOrder.splice(index, 0, removed);
    setBootOrder(newOrder);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const moveBootDevice = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= settings.bootOrder.length) return;
    
    const newOrder = [...settings.bootOrder];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    setBootOrder(newOrder);
  };

  const getBootDeviceLabel = (device: string) => {
    const labels: Record<string, { name: string; desc: string }> = {
      hdd: { name: 'URBANSHADE-SSD-01', desc: 'NVMe SSD (2TB)' },
      usb: { name: 'USB Storage', desc: 'Removable Media' },
      network: { name: 'Network Boot (PXE)', desc: 'Ethernet Adapter' },
    };
    return labels[device] || { name: device, desc: 'Unknown Device' };
  };

  const handleSetPassword = (type: 'admin' | 'boot') => {
    if (passwordInput !== passwordConfirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordInput.length > 0 && passwordInput.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      return;
    }
    
    if (type === 'admin') {
      setAdminPassword(passwordInput.length > 0 ? passwordInput : null);
    } else {
      setBootPassword(passwordInput.length > 0 ? passwordInput : null);
    }
    
    setShowPasswordDialog(null);
    setPasswordInput('');
    setPasswordConfirm('');
    setPasswordError('');
    toast.success(`${type === 'admin' ? 'Administrator' : 'Boot'} password ${passwordInput ? 'set' : 'cleared'}`);
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Backup/Restore handlers
  const handleExportConfig = () => {
    const config = exportBiosConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bios_config_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('BIOS configuration exported');
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = importBiosConfig(e.target?.result as string);
      if (result.success) {
        toast.success('BIOS configuration imported. Reloading...');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.error || 'Failed to import configuration');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const ToggleItem = ({ label, description, value, onToggle }: {
    label: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-2 rounded cursor-pointer transition-all border border-transparent hover:border-[#00ff00]/30 hover:bg-[#00ff00]/5"
    >
      <div className="text-left">
        <div className="font-medium text-sm">{label}</div>
        {description && <div className="text-xs text-[#00ff00]/60">{description}</div>}
      </div>
      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
        value 
          ? 'bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/50' 
          : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
      }`}>
        {value ? "ON" : "OFF"}
      </span>
    </button>
  );

  const SliderItem = ({ label, value, min, max, unit, onChange }: {
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    onChange: (v: number) => void;
  }) => (
    <div className="p-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-[#00ff00] font-mono text-sm">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#00ff00] cursor-pointer h-1"
      />
    </div>
  );

  const renderMain = () => (
    <div className="space-y-4 text-sm">
      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> System Information
        </div>
        <div className="space-y-1 text-[#00ff00]/80 font-mono text-xs">
          <div className="flex justify-between"><span>UEFI Version:</span><span>2.9.0</span></div>
          <div className="flex justify-between"><span>Processor:</span><span>Urbanshade Quantum Core v4</span></div>
          <div className="flex justify-between"><span>Speed:</span><span>4.2 GHz</span></div>
          <div className="flex justify-between"><span>Cores:</span><span>8C / 16T</span></div>
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Memory
        </div>
        <div className="space-y-1 text-[#00ff00]/80 font-mono text-xs">
          <div className="flex justify-between"><span>Total:</span><span>32 GB DDR5-6400</span></div>
          <div className="flex justify-between"><span>Status:</span><span className="text-[#00ff00]">OK</span></div>
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2 flex items-center gap-2">
          <HardDrive className="w-4 h-4" /> Storage
        </div>
        <div className="space-y-1 text-[#00ff00]/80 font-mono text-xs">
          <div className="flex justify-between"><span>NVMe SSD:</span><span>URBANSHADE-SSD-01 (2TB)</span></div>
          <div className="flex justify-between"><span>Health:</span><span className="text-[#00ff00]">100%</span></div>
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> System Time
        </div>
        <div className="font-mono text-[#00ff00]">{currentTime.toLocaleString()}</div>
        <div className="text-xs text-[#00ff00]/60">Uptime: {formatUptime(systemUptime)}</div>
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-4 text-sm">
      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">CPU Configuration</div>
        <div className="space-y-1">
          <ToggleItem label="Hyper-Threading" description="Virtual cores" value={settings.hyperThreading} onToggle={() => toggleSetting('hyperThreading')} />
          <ToggleItem label="Virtualization (VT-x)" description="Hardware VM support" value={settings.virtualization} onToggle={() => toggleSetting('virtualization')} />
          <ToggleItem label="Turbo Boost" description="Dynamic frequency" value={settings.turboBoost} onToggle={() => toggleSetting('turboBoost')} />
          <ToggleItem label="C-States" description="Power saving" value={settings.cStates} onToggle={() => toggleSetting('cStates')} />
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Chipset</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm">SATA Mode</span>
            <select
              value={settings.sataMode}
              onChange={(e) => updateSetting('sataMode', e.target.value as any)}
              className="bg-black border border-[#00ff00]/50 rounded px-2 py-1 text-xs text-[#00ff00] cursor-pointer"
            >
              <option value="ahci">AHCI</option>
              <option value="raid">RAID</option>
              <option value="ide">IDE</option>
            </select>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-sm">PCIe Link Speed</span>
            <select
              value={settings.pcieLinkSpeed}
              onChange={(e) => updateSetting('pcieLinkSpeed', e.target.value as any)}
              className="bg-black border border-[#00ff00]/50 rounded px-2 py-1 text-xs text-[#00ff00] cursor-pointer"
            >
              <option value="auto">Auto</option>
              <option value="gen3">Gen 3</option>
              <option value="gen4">Gen 4</option>
              <option value="gen5">Gen 5</option>
            </select>
          </div>
          <ToggleItem label="IOMMU" description="I/O Memory Management" value={settings.iommu} onToggle={() => toggleSetting('iommu')} />
        </div>
      </div>

      <div className="border border-yellow-500/30 rounded p-3 bg-yellow-500/5">
        <div className="flex items-start gap-2 text-yellow-400 text-xs">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Modifying advanced settings may cause system instability.</span>
        </div>
      </div>
    </div>
  );

  const renderBoot = () => (
    <div className="space-y-4 text-sm">
      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Boot Priority (drag to reorder)</div>
        <div className="space-y-1">
          {settings.bootOrder.map((device, index) => {
            const { name, desc } = getBootDeviceLabel(device);
            return (
              <div
                key={device}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-2 rounded flex items-center gap-2 cursor-grab active:cursor-grabbing transition-all ${
                  index === 0 ? 'bg-[#00ff00]/10 border border-[#00ff00]/50' : 'border border-[#00ff00]/20'
                } ${draggingIndex === index ? 'opacity-50' : ''}`}
              >
                <GripVertical className="w-3 h-3 text-[#00ff00]/50" />
                <span className="w-5 h-5 bg-[#00ff00]/20 rounded text-xs flex items-center justify-center font-bold">{index + 1}</span>
                <div className="flex-1">
                  <div className="text-xs font-medium">{name}</div>
                  <div className="text-[10px] text-[#00ff00]/50">{desc}</div>
                </div>
                {index === 0 && <span className="text-[10px] text-[#00ff00]">PRIMARY</span>}
                <div className="flex flex-col">
                  <button onClick={() => moveBootDevice(index, 'up')} disabled={index === 0} className="p-0.5 hover:bg-[#00ff00]/20 rounded disabled:opacity-30">
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveBootDevice(index, 'down')} disabled={index === settings.bootOrder.length - 1} className="p-0.5 hover:bg-[#00ff00]/20 rounded disabled:opacity-30">
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Boot Options</div>
        <div className="space-y-1">
          <ToggleItem label="Fast Boot" description="Skip POST memory test" value={settings.fastBoot} onToggle={() => toggleSetting('fastBoot')} />
          <ToggleItem label="Boot Logo" description="Show logo during boot" value={settings.bootLogo} onToggle={() => toggleSetting('bootLogo')} />
          <ToggleItem label="Secure Boot" description="UEFI security validation" value={settings.secureBoot} onToggle={() => toggleSetting('secureBoot')} />
          <SliderItem label="Boot Timeout" value={settings.bootTimeout} min={1} max={10} unit="s" onChange={(v) => updateSetting('bootTimeout', v)} />
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Boot Keys</div>
        <div className="grid grid-cols-2 gap-1 text-xs text-[#00ff00]/70">
          <div><span className="font-mono bg-[#00ff00]/10 px-1 rounded">DEL</span> UEFI Setup</div>
          <div><span className="font-mono bg-[#00ff00]/10 px-1 rounded">F2</span> UEFI Setup</div>
          <div><span className="font-mono bg-[#00ff00]/10 px-1 rounded">F8</span> Safe Mode</div>
          <div><span className="font-mono bg-[#00ff00]/10 px-1 rounded">F10</span> Save & Exit</div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-4 text-sm">
      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Security Features</div>
        <div className="space-y-1">
          <ToggleItem label="Secure Boot" description="UEFI firmware security" value={settings.secureBoot} onToggle={() => toggleSetting('secureBoot')} />
          <ToggleItem label="TPM 2.0" description="Trusted Platform Module" value={settings.tpmEnabled} onToggle={() => toggleSetting('tpmEnabled')} />
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Passwords</div>
        <div className="space-y-2">
          <button
            onClick={() => setShowPasswordDialog('admin')}
            className="w-full flex justify-between items-center p-2 rounded border border-[#00ff00]/20 hover:border-[#00ff00]/50 transition-all"
          >
            <div className="flex items-center gap-2">
              {settings.adminPassword ? <Lock className="w-4 h-4 text-[#00ff00]" /> : <Unlock className="w-4 h-4 text-gray-500" />}
              <div className="text-left">
                <div className="text-sm">Administrator Password</div>
                <div className="text-[10px] text-[#00ff00]/50">UEFI setup access</div>
              </div>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${settings.adminPassword ? 'bg-[#00ff00]/20 text-[#00ff00]' : 'bg-gray-500/20 text-gray-400'}`}>
              {settings.adminPassword ? "SET" : "NOT SET"}
            </span>
          </button>

          <button
            onClick={() => setShowPasswordDialog('boot')}
            className="w-full flex justify-between items-center p-2 rounded border border-[#00ff00]/20 hover:border-[#00ff00]/50 transition-all"
          >
            <div className="flex items-center gap-2">
              {settings.bootPassword ? <Lock className="w-4 h-4 text-[#00ff00]" /> : <Unlock className="w-4 h-4 text-gray-500" />}
              <div className="text-left">
                <div className="text-sm">Boot Password</div>
                <div className="text-[10px] text-[#00ff00]/50">Pre-boot authentication</div>
              </div>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${settings.bootPassword ? 'bg-[#00ff00]/20 text-[#00ff00]' : 'bg-gray-500/20 text-gray-400'}`}>
              {settings.bootPassword ? "SET" : "NOT SET"}
            </span>
          </button>
        </div>
      </div>

      <div className="border border-yellow-500/30 rounded p-3 bg-yellow-500/5">
        <div className="text-yellow-400 font-bold mb-1 text-xs">OEM Status</div>
        <div className="text-xs text-yellow-400/70">
          {oemUnlocked ? 'Developer options unlocked. System warranty voided.' : 'Locked. Enable in Settings → Developer Options.'}
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-4 text-sm">
      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2 flex items-center gap-2">
          <Save className="w-4 h-4" /> Configuration Backup
        </div>
        <p className="text-xs text-[#00ff00]/60 mb-3">
          Export your BIOS settings to a file or restore from a previous backup.
        </p>
        <div className="space-y-2">
          <button
            onClick={handleExportConfig}
            className="w-full flex items-center justify-center gap-2 p-2 rounded border border-[#00ff00]/50 hover:bg-[#00ff00]/10 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Configuration</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-2 rounded border border-[#00ff00]/50 hover:bg-[#00ff00]/10 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import Configuration</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportConfig}
          />
        </div>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset Options
        </div>
        <button
          onClick={() => setShowLoadDefaults(true)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Load Optimized Defaults</span>
        </button>
      </div>

      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Current Settings Summary</div>
        <div className="space-y-1 text-xs font-mono text-[#00ff00]/70">
          <div className="flex justify-between"><span>Fast Boot:</span><span>{settings.fastBoot ? 'ON' : 'OFF'}</span></div>
          <div className="flex justify-between"><span>Secure Boot:</span><span>{settings.secureBoot ? 'ON' : 'OFF'}</span></div>
          <div className="flex justify-between"><span>TPM:</span><span>{settings.tpmEnabled ? 'ON' : 'OFF'}</span></div>
          <div className="flex justify-between"><span>Boot Timeout:</span><span>{settings.bootTimeout}s</span></div>
          <div className="flex justify-between"><span>Admin Password:</span><span>{settings.adminPassword ? 'SET' : 'NONE'}</span></div>
          <div className="flex justify-between"><span>Boot Password:</span><span>{settings.bootPassword ? 'SET' : 'NONE'}</span></div>
        </div>
      </div>
    </div>
  );

  const renderExit = () => (
    <div className="space-y-4 text-sm">
      <button
        onClick={() => {
          saveChanges();
          setShowingExit(true);
          setExitCountdown(3);
        }}
        className="w-full p-4 rounded border border-[#00ff00]/50 hover:bg-[#00ff00]/10 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <Power className="w-6 h-6 text-[#00ff00]" />
          <div>
            <div className="font-bold">Save & Exit</div>
            <div className="text-xs text-[#00ff00]/60">Save changes and restart (F10)</div>
          </div>
        </div>
        {hasChanges && <div className="mt-2 text-xs text-yellow-400">⚠ You have unsaved changes</div>}
      </button>

      <button
        onClick={onExit}
        className="w-full p-4 rounded border border-red-500/50 hover:bg-red-500/10 transition-all text-left text-red-400"
      >
        <div className="flex items-center gap-3">
          <Power className="w-6 h-6" />
          <div>
            <div className="font-bold">Discard & Exit</div>
            <div className="text-xs text-red-400/60">Exit without saving (ESC)</div>
          </div>
        </div>
      </button>

      <button
        onClick={() => setShowLoadDefaults(true)}
        className="w-full p-4 rounded border border-[#00ff00]/30 hover:bg-[#00ff00]/5 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-[#00ff00]/70" />
          <div>
            <div className="font-bold">Load Defaults</div>
            <div className="text-xs text-[#00ff00]/60">Reset all settings (F9)</div>
          </div>
        </div>
      </button>
    </div>
  );

  const renderCustom = () => (
    <div className="space-y-4 text-sm">
      <div className="border border-yellow-500/30 rounded p-3 bg-yellow-500/5">
        <div className="flex items-start gap-2 text-yellow-400">
          <Package className="w-4 h-4 mt-0.5" />
          <div>
            <div className="font-bold">Custom Applications</div>
            <div className="text-xs text-yellow-400/70">OEM unlock enabled. Custom apps available.</div>
          </div>
        </div>
      </div>
      <div className="border border-[#00ff00]/30 rounded p-3">
        <div className="text-[#00ff00] font-bold mb-2">Available Apps</div>
        <div className="space-y-1 text-xs text-[#00ff00]/70">
          <div className="p-2 hover:bg-[#00ff00]/5 rounded cursor-pointer">• Custom Facility Tools</div>
          <div className="p-2 hover:bg-[#00ff00]/5 rounded cursor-pointer">• Advanced Diagnostics</div>
          <div className="p-2 hover:bg-[#00ff00]/5 rounded cursor-pointer">• System Modding Tools</div>
        </div>
      </div>
    </div>
  );

  // Help Dialog
  const renderHelpDialog = () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-black border border-[#00ff00]/50 rounded p-4 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-3 text-[#00ff00]">
          <HelpCircle className="w-5 h-5" />
          <h2 className="font-bold">UEFI Help</h2>
        </div>
        <div className="space-y-3 text-xs text-[#00ff00]/80">
          <div>
            <div className="font-bold mb-1">Keyboard Shortcuts</div>
            <div className="grid grid-cols-2 gap-1 font-mono">
              <div><span className="bg-[#00ff00]/10 px-1 rounded">Tab</span> Switch sections</div>
              <div><span className="bg-[#00ff00]/10 px-1 rounded">F1</span> Help</div>
              <div><span className="bg-[#00ff00]/10 px-1 rounded">F9</span> Load defaults</div>
              <div><span className="bg-[#00ff00]/10 px-1 rounded">F10</span> Save & Exit</div>
              <div><span className="bg-[#00ff00]/10 px-1 rounded">ESC</span> Discard & Exit</div>
            </div>
          </div>
          <div className="border-t border-[#00ff00]/30 pt-2">
            <div className="font-bold mb-1">Sections</div>
            <ul className="space-y-0.5">
              <li><strong>Main:</strong> System information</li>
              <li><strong>Advanced:</strong> CPU and chipset</li>
              <li><strong>Boot:</strong> Boot priority and options</li>
              <li><strong>Security:</strong> Passwords and TPM</li>
              <li><strong>Backup:</strong> Export/import settings</li>
              <li><strong>Exit:</strong> Save or discard</li>
            </ul>
          </div>
        </div>
        <button
          onClick={() => setShowHelp(false)}
          className="w-full mt-4 p-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-all"
        >
          Close (ESC)
        </button>
      </div>
    </div>
  );

  // Load Defaults Dialog
  const renderLoadDefaultsDialog = () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-black border border-[#00ff00]/50 rounded p-4 max-w-sm w-full mx-4">
        <div className="flex items-center gap-2 mb-3 text-[#00ff00]">
          <RotateCcw className="w-5 h-5" />
          <h2 className="font-bold">Load Defaults?</h2>
        </div>
        <p className="text-xs text-[#00ff00]/70 mb-4">
          This will reset all BIOS settings to default values. Passwords will be cleared.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              loadDefaults();
              setShowLoadDefaults(false);
              toast.success('Defaults loaded');
            }}
            className="flex-1 p-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-all text-sm"
          >
            Yes, Load Defaults
          </button>
          <button
            onClick={() => setShowLoadDefaults(false)}
            className="flex-1 p-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 rounded transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Password Dialog
  const renderPasswordDialog = () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-black border border-[#00ff00]/50 rounded p-4 max-w-sm w-full mx-4">
        <div className="flex items-center gap-2 mb-3 text-[#00ff00]">
          <Lock className="w-5 h-5" />
          <h2 className="font-bold">{showPasswordDialog === 'admin' ? 'Administrator' : 'Boot'} Password</h2>
        </div>
        <p className="text-xs text-[#00ff00]/70 mb-3">
          {(showPasswordDialog === 'admin' ? settings.adminPassword : settings.bootPassword)
            ? 'Enter new password or leave empty to clear.'
            : 'Set a password to protect access.'}
        </p>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="New password (or empty to clear)"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
            className="w-full p-2 bg-black border border-[#00ff00]/50 rounded focus:border-[#00ff00] outline-none text-sm"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={passwordConfirm}
            onChange={(e) => { setPasswordConfirm(e.target.value); setPasswordError(''); }}
            className="w-full p-2 bg-black border border-[#00ff00]/50 rounded focus:border-[#00ff00] outline-none text-sm"
          />
          {passwordError && <div className="text-red-400 text-xs">{passwordError}</div>}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleSetPassword(showPasswordDialog!)}
            className="flex-1 p-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-all text-sm"
          >
            {passwordInput ? 'Set Password' : 'Clear Password'}
          </button>
          <button
            onClick={() => { setShowPasswordDialog(null); setPasswordInput(''); setPasswordConfirm(''); setPasswordError(''); }}
            className="flex-1 p-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 rounded transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (showingExit) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-[#00ff00] font-mono">
        <div className="text-center space-y-4">
          <Power className="w-16 h-16 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">Exiting UEFI Setup...</h2>
          <p className="text-lg">Restarting in {exitCountdown}s</p>
          {hasChanges && <p className="text-sm">✓ Changes saved</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-[#00ff00] flex flex-col font-mono">
      {/* Header */}
      <div className="bg-[#00ff00]/10 border-b border-[#00ff00]/30 p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">URBANSHADE UEFI FIRMWARE v2.9.0</h1>
            <p className="text-xs text-[#00ff00]/60">
              {settings.secureBoot ? 'Secure Boot: ON' : 'Secure Boot: OFF'}
              {hasChanges && <span className="ml-2 text-yellow-400">• Unsaved changes</span>}
            </p>
          </div>
          <div className="text-right text-xs">
            <div className="text-[#00ff00]/60">System Time</div>
            <div>{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#00ff00]/5 border-b border-[#00ff00]/20 px-3 py-2">
        <div className="flex gap-1 flex-wrap">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id as Section)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${
                selectedSection === section.id
                  ? 'bg-[#00ff00] text-black font-bold'
                  : 'hover:bg-[#00ff00]/20'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          {selectedSection === "main" && renderMain()}
          {selectedSection === "advanced" && renderAdvanced()}
          {selectedSection === "boot" && renderBoot()}
          {selectedSection === "security" && renderSecurity()}
          {selectedSection === "backup" && renderBackup()}
          {selectedSection === "exit" && renderExit()}
          {selectedSection === "custom" && oemUnlocked && renderCustom()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#00ff00]/5 border-t border-[#00ff00]/20 px-4 py-2">
        <div className="flex justify-between items-center text-[10px] text-[#00ff00]/60">
          <div className="flex gap-4">
            <span><span className="font-bold">F1</span> Help</span>
            <span><span className="font-bold">F9</span> Defaults</span>
            <span><span className="font-bold">F10</span> Save & Exit</span>
            <span><span className="font-bold">ESC</span> Exit</span>
            <span><span className="font-bold">Tab</span> Switch</span>
          </div>
          <div>© 2025 Urbanshade Corporation</div>
        </div>
      </div>

      {/* Dialogs */}
      {showHelp && renderHelpDialog()}
      {showLoadDefaults && renderLoadDefaultsDialog()}
      {showPasswordDialog && renderPasswordDialog()}
    </div>
  );
};
