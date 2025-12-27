import { useState, useRef } from "react";
import { Send, Terminal } from "lucide-react";
import { TerminalResult, commandQueue, parseTerminalCommand, TERMINAL_COMMANDS, UUR_COMMANDS, UUR_AVAILABLE_PACKAGES } from "@/lib/commandQueue";

const TerminalTab = () => {
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<{ input: string; output: TerminalResult }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const executeTerminalCommand = (input: string): TerminalResult => {
    const { command, args } = parseTerminalCommand(input);
    
    switch (command) {
      case 'help':
        if (args[0]) {
          const cmd = TERMINAL_COMMANDS[args[0]];
          if (cmd) return { output: `${args[0]}: ${cmd.desc}\nUsage: ${cmd.usage}`, success: true, type: 'info' };
          return { output: `Unknown command: ${args[0]}`, success: false, type: 'error' };
        }
        const categories: Record<string, string[]> = {};
        Object.entries(TERMINAL_COMMANDS).forEach(([name, info]) => {
          if (!categories[info.category]) categories[info.category] = [];
          categories[info.category].push(name);
        });
        let helpOutput = "Available commands:\n";
        Object.entries(categories).forEach(([cat, cmds]) => {
          helpOutput += `\n[${cat.toUpperCase()}]\n  ${cmds.join(', ')}`;
        });
        return { output: helpOutput, success: true, type: 'info' };
        
      case 'echo':
        return { output: args.join(' '), success: true, type: 'output' };
        
      case 'clear':
        setTerminalHistory([]);
        return { output: '', success: true, type: 'output' };
        
      case 'date':
        return { output: new Date().toString(), success: true, type: 'output' };
        
      case 'whoami':
        return { output: 'def-dev@urbanshade (root)', success: true, type: 'output' };
        
      case 'uptime':
        const perf = performance.now();
        const mins = Math.floor(perf / 60000);
        return { output: `System uptime: ${mins} minutes`, success: true, type: 'output' };
        
      case 'crash':
        const crashType = args[0] || 'KERNEL_PANIC';
        commandQueue.queueCrash(crashType, 'def-dev.exe');
        return { output: `Crash queued: ${crashType}`, success: true, type: 'system' };
        
      case 'bugcheck':
        const code = args[0] || 'FATAL_ERROR';
        const desc = args.slice(1).join(' ') || 'Triggered from DEF-DEV terminal';
        commandQueue.queueBugcheck(code, desc);
        return { output: `Bugcheck queued: ${code}`, success: true, type: 'system' };
        
      case 'reboot':
        commandQueue.queueReboot();
        return { output: 'System reboot queued', success: true, type: 'system' };
        
      case 'shutdown':
        commandQueue.queueShutdown();
        return { output: 'System shutdown queued', success: true, type: 'system' };
        
      case 'lockdown':
        const protocol = args[0] || 'ALPHA';
        commandQueue.queueLockdown(protocol);
        return { output: `Lockdown protocol ${protocol} queued`, success: true, type: 'system' };
        
      case 'recovery':
        commandQueue.queueRecovery();
        return { output: 'Recovery mode queued', success: true, type: 'system' };
        
      case 'wipe':
        if (args[0] !== '--confirm') {
          return { output: 'WARNING: This will wipe ALL system data!\nUse: wipe --confirm', success: false, type: 'error' };
        }
        commandQueue.queueWipe();
        return { output: 'System wipe queued - all data will be erased', success: true, type: 'system' };
        
      case 'ls':
        const filterKey = args[0]?.toLowerCase() || '';
        const keys = Object.keys(localStorage).filter(k => k.toLowerCase().includes(filterKey));
        return { output: keys.length > 0 ? keys.join('\n') : 'No matching keys found', success: true, type: 'output' };
        
      case 'get':
        if (!args[0]) return { output: 'Usage: get <key>', success: false, type: 'error' };
        const value = localStorage.getItem(args[0]);
        if (value === null) return { output: `Key not found: ${args[0]}`, success: false, type: 'error' };
        return { output: value, success: true, type: 'output' };
        
      case 'set':
        if (args.length < 2) return { output: 'Usage: set <key> <value>', success: false, type: 'error' };
        const setKey = args[0];
        const setValue = args.slice(1).join(' ');
        commandQueue.queueStorageWrite(setKey, setValue);
        return { output: `Storage write queued: ${setKey}`, success: true, type: 'system' };
        
      case 'del':
        if (!args[0]) return { output: 'Usage: del <key>', success: false, type: 'error' };
        commandQueue.queueStorageDelete(args[0]);
        return { output: `Storage delete queued: ${args[0]}`, success: true, type: 'system' };
        
      case 'toast':
        const toastType = args[0] as 'success' | 'error' | 'info' | 'warning';
        const toastMsg = args.slice(1).join(' ');
        if (!toastMsg) return { output: 'Usage: toast <type> <message>', success: false, type: 'error' };
        commandQueue.queueToast(toastMsg, toastType);
        return { output: `Toast queued: [${toastType}] ${toastMsg}`, success: true, type: 'system' };
        
      case 'status':
        const queueLen = commandQueue.getQueue().length;
        const persistence = commandQueue.isPersistenceEnabled();
        return { 
          output: `System Status:\n  Queue: ${queueLen} pending commands\n  Persistence: ${persistence ? 'enabled' : 'disabled'}\n  Storage: ${localStorage.length} keys (${(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB)`, 
          success: true, 
          type: 'info' 
        };
        
      case 'queue':
        const pending = commandQueue.getQueue();
        if (pending.length === 0) return { output: 'Command queue is empty', success: true, type: 'info' };
        const queueOutput = pending.map((c, i) => `  ${i + 1}. [${c.type}] ${JSON.stringify(c.payload)}`).join('\n');
        return { output: `Pending commands:\n${queueOutput}`, success: true, type: 'info' };

      case 'uur':
        const uurCmd = args[0]?.toLowerCase();
        if (!uurCmd) {
          const uurHelp = Object.entries(UUR_COMMANDS).map(([cmd, info]) => `  ${cmd} - ${info.desc}`).join('\n');
          return { output: `UUR Commands:\n${uurHelp}`, success: true, type: 'info' };
        }
        
        switch (uurCmd) {
          case 'lst':
            const installed = commandQueue.getInstalledPackages();
            const pkgList = Object.entries(installed).map(([name, info]) => `  ${name} (${info.version})`).join('\n');
            return { output: pkgList || 'No packages installed', success: true, type: 'output' };
          case 'search':
            const query = args[1]?.toLowerCase() || '';
            const matches = Object.entries(UUR_AVAILABLE_PACKAGES)
              .filter(([name, pkg]) => name.includes(query) || pkg.description.toLowerCase().includes(query))
              .map(([name, pkg]) => `  ${name} - ${pkg.description} (v${pkg.version})`)
              .join('\n');
            return { output: matches || 'No matching packages', success: true, type: 'output' };
          default:
            return { output: `Unknown UUR command: ${uurCmd}`, success: false, type: 'error' };
        }
        
      default:
        if (!command) return { output: '', success: true, type: 'output' };
        return { output: `Command not found: ${command}\nType 'help' for available commands`, success: false, type: 'error' };
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const result = executeTerminalCommand(terminalInput);
    if (result.output || result.type === 'error') {
      setTerminalHistory(prev => [...prev, { input: terminalInput, output: result }]);
    }
    setTerminalInput("");
    setHistoryIndex(-1);
    setTimeout(() => terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    const inputs = terminalHistory.map(h => h.input);
    if (e.key === 'ArrowUp' && inputs.length > 0) {
      e.preventDefault();
      const newIdx = Math.min(historyIndex + 1, inputs.length - 1);
      setHistoryIndex(newIdx);
      setTerminalInput(inputs[inputs.length - 1 - newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setTerminalInput(inputs[inputs.length - 1 - newIdx]);
      } else {
        setHistoryIndex(-1);
        setTerminalInput('');
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="px-4 py-2 border-b border-green-500/30 bg-green-500/5 flex items-center gap-3">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-green-400 font-mono text-sm">def-dev@urbanshade:~</span>
        <span className="text-green-600 text-xs">Type 'help' for commands</span>
      </div>
      
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {terminalHistory.map((entry, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <span className="text-white">{entry.input}</span>
            </div>
            <pre className={`whitespace-pre-wrap mt-1 pl-4 ${
              entry.output.type === 'error' ? 'text-red-400' :
              entry.output.type === 'system' ? 'text-purple-400' :
              entry.output.type === 'info' ? 'text-cyan-400' :
              'text-gray-300'
            }`}>{entry.output.output}</pre>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      
      <form onSubmit={handleTerminalSubmit} className="p-3 border-t border-green-500/30 bg-green-500/5">
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono">$</span>
          <input
            ref={terminalInputRef}
            type="text"
            value={terminalInput}
            onChange={e => setTerminalInput(e.target.value)}
            onKeyDown={handleTerminalKeyDown}
            className="flex-1 bg-transparent text-white font-mono outline-none placeholder-green-600"
            placeholder="Enter command..."
            autoFocus
          />
          <button 
            type="submit" 
            className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded text-green-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TerminalTab;
