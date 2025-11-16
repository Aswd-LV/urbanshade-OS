import { useState } from "react";
import { Terminal, RotateCcw, HardDrive, Image, Settings, ArrowLeft } from "lucide-react";

interface RecoveryModeProps {
  onExit: () => void;
}

export const RecoveryMode = ({ onExit }: RecoveryModeProps) => {
  const [view, setView] = useState<"menu" | "restore" | "flash" | "cmd" | "advanced">("menu");
  const [cmdOutput, setCmdOutput] = useState<string[]>([
    "URBANSHADE Recovery Console v3.7",
    "Type 'help' for available commands",
    ""
  ]);
  const [cmdInput, setCmdInput] = useState("");
  const [restorePoints, setRestorePoints] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_restore_points');
    return saved ? JSON.parse(saved) : ['2025-01-15 14:30:00 - Initial Setup', '2025-01-14 09:15:00 - System Update'];
  });
  const [systemImages, setSystemImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('recovery_system_images');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCmdCommand = (cmd: string) => {
    const newOutput = [...cmdOutput, `> ${cmd}`];
    
    const commands: Record<string, () => string[]> = {
      help: () => [
        "Available commands:",
        "  help     - Show this help",
        "  sfc      - System File Checker",
        "  chkdsk   - Check disk",
        "  bootrec  - Boot recovery",
        "  clear    - Clear screen",
        "  exit     - Exit console",
        ""
      ],
      sfc: () => [
        "System File Checker...",
        "Scanning system files...",
        "[OK] All protected system files are intact.",
        ""
      ],
      chkdsk: () => [
        "Checking disk C:...",
        "[OK] No errors found.",
        "Disk check complete.",
        ""
      ],
      bootrec: () => [
        "Boot Configuration Data Store...",
        "Rebuilding boot records...",
        "[OK] Boot files successfully repaired.",
        ""
      ],
      clear: () => [""],
      exit: () => {
        setView("menu");
        return ["Exiting console..."];
      }
    };

    if (cmd.toLowerCase() === 'clear') {
      setCmdOutput(["URBANSHADE Recovery Console v3.7", "Type 'help' for available commands", ""]);
    } else if (commands[cmd.toLowerCase()]) {
      setCmdOutput([...newOutput, ...commands[cmd.toLowerCase()]()]);
    } else {
      setCmdOutput([...newOutput, `'${cmd}' is not recognized as a command.`, ""]);
    }
    setCmdInput("");
  };

  const createRestorePoint = () => {
    const timestamp = new Date().toLocaleString();
    const newPoint = `${timestamp} - Manual Restore Point`;
    const updated = [newPoint, ...restorePoints];
    setRestorePoints(updated);
    localStorage.setItem('recovery_restore_points', JSON.stringify(updated));
  };

  const handleImportImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.img,.iso';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const newImage = `${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        const updated = [...systemImages, newImage];
        setSystemImages(updated);
        localStorage.setItem('recovery_system_images', JSON.stringify(updated));
      }
    };
    input.click();
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Recovery</h1>
        <p className="text-lg opacity-80">Choose an option to continue</p>
      </div>

      <div className="grid gap-4 w-full max-w-2xl px-8">
        <button
          onClick={onExit}
          className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-6 text-left transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Continue</div>
              <div className="text-sm opacity-70">Exit recovery and continue to system</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setView("restore")}
          className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-6 text-left transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">System Restore</div>
              <div className="text-sm opacity-70">Restore system to a previous restore point</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setView("flash")}
          className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-6 text-left transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
              <Image className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Flash System Image</div>
              <div className="text-sm opacity-70">Install or restore from system image</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setView("cmd")}
          className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-6 text-left transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Command Prompt</div>
              <div className="text-sm opacity-70">Open command line for advanced tasks</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setView("advanced")}
          className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-6 text-left transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Advanced Options</div>
              <div className="text-sm opacity-70">Startup settings, safe mode, and more</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderRestore = () => (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => setView("menu")} className="mb-6 flex items-center gap-2 hover:opacity-70">
        <ArrowLeft className="w-4 h-4" />
        Back to menu
      </button>
      <h2 className="text-3xl font-bold mb-4">System Restore</h2>
      <p className="mb-6 opacity-80">Select a restore point to restore your system to a previous state</p>
      
      <div className="bg-white/10 border border-white/30 rounded-lg p-6 mb-4">
        <button
          onClick={createRestorePoint}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded mb-4"
        >
          + Create New Restore Point
        </button>
        <div className="space-y-2">
          {restorePoints.map((point, i) => (
            <div key={i} className="bg-white/5 border border-white/20 rounded p-3 hover:bg-white/10 cursor-pointer">
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFlash = () => (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => setView("menu")} className="mb-6 flex items-center gap-2 hover:opacity-70">
        <ArrowLeft className="w-4 h-4" />
        Back to menu
      </button>
      <h2 className="text-3xl font-bold mb-4">Flash System Image</h2>
      <p className="mb-6 opacity-80">Restore your system from a complete system image backup</p>
      
      <div className="bg-white/10 border border-white/30 rounded-lg p-6">
        <button
          onClick={handleImportImage}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded mb-4"
        >
          + Import Image File
        </button>
        <div className="space-y-2">
          {systemImages.length === 0 ? (
            <div className="text-center py-8 opacity-50">No system images available</div>
          ) : (
            systemImages.map((img, i) => (
              <div key={i} className="bg-white/5 border border-white/20 rounded p-3 hover:bg-white/10 cursor-pointer">
                {img}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderCmd = () => (
    <div className="fixed inset-0 bg-black text-white font-mono p-4 flex flex-col">
      <button onClick={() => setView("menu")} className="mb-2 text-sm hover:opacity-70 self-start">
        ← Back to menu
      </button>
      <div className="flex-1 overflow-auto mb-2">
        {cmdOutput.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span>&gt;</span>
        <input
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && cmdInput.trim()) {
              handleCmdCommand(cmdInput.trim());
            }
          }}
          className="flex-1 bg-transparent border-none outline-none"
          autoFocus
        />
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => setView("menu")} className="mb-6 flex items-center gap-2 hover:opacity-70">
        <ArrowLeft className="w-4 h-4" />
        Back to menu
      </button>
      <h2 className="text-3xl font-bold mb-4">Advanced Options</h2>
      
      <div className="space-y-3">
        <div className="bg-white/10 border border-white/30 rounded-lg p-4 hover:bg-white/20 cursor-pointer">
          Startup Repair - Fix problems that prevent system from loading
        </div>
        <div className="bg-white/10 border border-white/30 rounded-lg p-4 hover:bg-white/20 cursor-pointer">
          Startup Settings - Change Windows startup behavior
        </div>
        <div className="bg-white/10 border border-white/30 rounded-lg p-4 hover:bg-white/20 cursor-pointer">
          UEFI Firmware Settings - Change settings in your PC's firmware
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0078D7] to-[#0063B1] text-white">
      {view === "menu" && renderMenu()}
      {view === "restore" && renderRestore()}
      {view === "flash" && renderFlash()}
      {view === "cmd" && renderCmd()}
      {view === "advanced" && renderAdvanced()}
    </div>
  );
};
