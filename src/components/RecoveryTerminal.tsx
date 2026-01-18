import { useState, useEffect, useRef } from "react";

interface RecoveryTerminalProps {
  onExit: () => void;
  onReboot: () => void;
}

export const RecoveryTerminal = ({ onExit, onReboot }: RecoveryTerminalProps) => {
  const [lines, setLines] = useState<string[]>([
    "UrbanShade Recovery Console",
    "Type 'help' for available commands",
    ""
  ]);
  const [input, setInput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLine = (text: string) => setLines(prev => [...prev, text]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addLine(`> ${cmd}`);

    if (!trimmed) return;

    switch (trimmed) {
      case "help":
        addLine("Available commands:");
        addLine("  help       - Show this help");
        addLine("  clear      - Clear screen");
        addLine("  exit       - Exit to recovery menu");
        addLine("  reboot     - Restart the system");
        addLine("  sysinfo    - Show system information");
        addLine("  storage    - Show storage usage");
        addLine("  fixboot    - Attempt to fix boot issues");
        addLine("  clearcache - Clear cached data");
        addLine("  resetprefs - Reset preferences to defaults");
        addLine("  ls         - List localStorage keys");
        addLine("  get <key>  - Get value of key");
        addLine("  del <key>  - Delete key from storage");
        addLine("");
        break;

      case "clear":
        setLines(["UrbanShade Recovery Console", ""]);
        break;

      case "exit":
        addLine("Exiting to recovery menu...");
        setTimeout(onExit, 500);
        break;

      case "reboot":
        addLine("Rebooting system...");
        setTimeout(onReboot, 1000);
        break;

      case "sysinfo":
        addLine("System Information:");
        addLine(`  OS: UrbanShade Recovery Environment`);
        addLine(`  User Agent: ${navigator.userAgent.slice(0, 60)}...`);
        addLine(`  Screen: ${window.screen.width}x${window.screen.height}`);
        addLine(`  Memory: ${(performance as any).memory?.usedJSHeapSize ? 
          Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) + ' MB' : 'N/A'}`);
        addLine(`  LocalStorage Keys: ${localStorage.length}`);
        addLine("");
        break;

      case "storage":
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) total += (localStorage.getItem(key)?.length || 0) * 2;
        }
        addLine(`Storage: ${(total / 1024).toFixed(2)} KB used`);
        addLine(`Keys: ${localStorage.length}`);
        addLine("");
        break;

      case "fixboot":
        addLine("Attempting boot repair...");
        sessionStorage.clear();
        addLine("  [OK] Cleared session data");
        localStorage.removeItem("urbanshade_bugcheck");
        addLine("  [OK] Cleared bugcheck data");
        localStorage.removeItem("urbanshade_crash_recovery");
        addLine("  [OK] Cleared crash recovery flags");
        addLine("Boot repair complete. Reboot recommended.");
        addLine("");
        break;

      case "clearcache":
        let cleared = 0;
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.includes("cache") || key.includes("temp"))) {
            localStorage.removeItem(key);
            cleared++;
          }
        }
        addLine(`Cleared ${cleared} cache entries.`);
        addLine("");
        break;

      case "resetprefs":
        const prefKeys = ["settings_theme", "settings_volume", "settings_notifications"];
        prefKeys.forEach(k => localStorage.removeItem(k));
        addLine("Preferences reset to defaults.");
        addLine("");
        break;

      case "ls":
        addLine("LocalStorage keys:");
        for (let i = 0; i < Math.min(localStorage.length, 20); i++) {
          const key = localStorage.key(i);
          if (key) addLine(`  ${key}`);
        }
        if (localStorage.length > 20) addLine(`  ... and ${localStorage.length - 20} more`);
        addLine("");
        break;

      default:
        if (trimmed.startsWith("get ")) {
          const key = cmd.trim().slice(4);
          const val = localStorage.getItem(key);
          if (val) {
            addLine(`${key} = ${val.slice(0, 200)}${val.length > 200 ? '...' : ''}`);
          } else {
            addLine(`Key not found: ${key}`);
          }
          addLine("");
        } else if (trimmed.startsWith("del ")) {
          const key = cmd.trim().slice(4);
          if (localStorage.getItem(key) !== null) {
            localStorage.removeItem(key);
            addLine(`Deleted: ${key}`);
          } else {
            addLine(`Key not found: ${key}`);
          }
          addLine("");
        } else {
          addLine(`Unknown command: ${trimmed}`);
          addLine("Type 'help' for available commands.");
          addLine("");
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black font-mono text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output */}
      <div 
        ref={outputRef}
        className="absolute inset-0 p-4 overflow-y-auto pb-12 text-green-400"
        style={{ fontFamily: "Consolas, Monaco, 'Courier New', monospace" }}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        
        {/* Input line */}
        <div className="flex items-center">
          <span className="text-green-500">&gt; </span>
          <span>{input}</span>
          <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>█</span>
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />

      {/* Scanline effect */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }}
      />
    </div>
  );
};
