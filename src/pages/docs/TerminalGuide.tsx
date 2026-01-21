import { Terminal, Folder, Cpu, Sparkles, HelpCircle, Zap } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCode, DocAlert, DocTable } from "@/components/docs";

const TerminalGuide = () => {
  return (
    <DocLayout
      title="Terminal Guide"
      description="Complete command-line reference for Urbanshade OS terminal - basic commands, file operations, system commands, and hidden secrets."
      keywords={["terminal", "command line", "cli", "commands", "bash", "shell", "scripting"]}
      accentColor="cyan"
      prevPage={{ title: "Facility Apps", path: "/docs/facility" }}
      nextPage={{ title: "Admin Panel", path: "/docs/admin-panel" }}
    >
      <DocHero
        icon={Terminal}
        title="Terminal Guide"
        subtitle="The command-line interface is where the real power users thrive. Master these commands to control the facility like a true operator."
        accentColor="cyan"
      />

      <DocSection id="prompt">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-cyan-500/30 font-mono text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-cyan-400">user@urbanshade</span>
            <span>:</span>
            <span className="text-blue-400">~</span>
            <span>$</span>
            <span className="text-slate-200 ml-1 animate-pulse">_</span>
          </div>
          <p className="text-slate-500 text-xs mt-3">
            This is your terminal prompt. Type commands after the $ symbol and press Enter.
          </p>
        </div>
      </DocSection>

      <DocSection title="Basic Commands" icon={HelpCircle} accentColor="cyan" id="basic">
        <p>Start here if you're new to command-line interfaces.</p>

        <DocTable
          headers={["Command", "Description"]}
          rows={[
            [<code className="text-cyan-400">help</code>, "Show all available commands — run this first!"],
            [<code className="text-cyan-400">clear</code>, "Clear the terminal screen"],
            [<code className="text-cyan-400">status</code>, "Display current system status"],
            [<code className="text-cyan-400">whoami</code>, "Show current user identity"],
            [<code className="text-cyan-400">date</code>, "Display current date and time"],
            [<code className="text-cyan-400">echo [text]</code>, "Print text to the terminal"],
            [<code className="text-cyan-400">history</code>, "Show command history"],
          ]}
          accentColor="cyan"
        />

        <DocCode
          title="Example: Getting Help"
          code={`$ help
Available commands:
  help        - Show this help message
  clear       - Clear the terminal
  status      - Show system status
  ...`}
        />
      </DocSection>

      <DocSection title="File System Commands" icon={Folder} accentColor="cyan" id="filesystem">
        <p>Navigate and manage the virtual file system.</p>

        <DocTable
          headers={["Command", "Description"]}
          rows={[
            [<code className="text-cyan-400">ls</code>, "List files in current directory"],
            [<code className="text-cyan-400">ls -la</code>, "List all files with details"],
            [<code className="text-cyan-400">cd [dir]</code>, "Change directory"],
            [<code className="text-cyan-400">cd ..</code>, "Go up one directory"],
            [<code className="text-cyan-400">pwd</code>, "Print working directory path"],
            [<code className="text-cyan-400">cat [file]</code>, "Display file contents"],
            [<code className="text-cyan-400">mkdir [name]</code>, "Create a new directory"],
            [<code className="text-cyan-400">rm [file]</code>, "Remove a file"],
            [<code className="text-cyan-400">cp [src] [dst]</code>, "Copy a file"],
            [<code className="text-cyan-400">mv [src] [dst]</code>, "Move or rename a file"],
          ]}
          accentColor="cyan"
        />

        <DocCode
          title="Example: Navigating Files"
          code={`$ pwd
/home/user

$ ls
documents  downloads  pictures  notes.txt

$ cd documents
$ ls
report.md  specs.pdf  logs/

$ cat report.md
# Monthly Report
Facility status: Normal...`}
        />
      </DocSection>

      <DocSection title="System Commands" icon={Cpu} accentColor="cyan" id="system">
        <p>Power commands for system administration.</p>

        <DocTable
          headers={["Command", "Description"]}
          rows={[
            [<code className="text-cyan-400">neofetch</code>, "Show system information in style"],
            [<code className="text-cyan-400">uptime</code>, "Display system uptime"],
            [<code className="text-cyan-400">ps</code>, "List running processes"],
            [<code className="text-cyan-400">kill [pid]</code>, "Terminate a process by ID"],
            [<code className="text-cyan-400">top</code>, "Interactive process viewer"],
            [<code className="text-cyan-400">free</code>, "Show memory usage"],
            [<code className="text-cyan-400">df</code>, "Show disk space usage"],
            [<code className="text-cyan-400">reboot</code>, "Restart the system"],
            [<code className="text-cyan-400">shutdown</code>, "Power off the system"],
          ]}
          accentColor="cyan"
        />

        <DocAlert variant="warning" title="Careful!">
          The <code className="text-cyan-400">reboot</code> and <code className="text-cyan-400">shutdown</code> commands 
          will actually restart/shutdown the simulation. Make sure to save your work!
        </DocAlert>
      </DocSection>

      <DocSection title="Network Commands" icon={Zap} accentColor="cyan" id="network">
        <DocTable
          headers={["Command", "Description"]}
          rows={[
            [<code className="text-cyan-400">ping [host]</code>, "Test network connectivity"],
            [<code className="text-cyan-400">ifconfig</code>, "Show network interfaces"],
            [<code className="text-cyan-400">netstat</code>, "Display network statistics"],
            [<code className="text-cyan-400">curl [url]</code>, "Fetch content from URL"],
            [<code className="text-cyan-400">wget [url]</code>, "Download file from URL"],
          ]}
          accentColor="cyan"
        />
      </DocSection>

      <DocSection title="Secret Commands" icon={Sparkles} accentColor="amber" id="secrets">
        <DocAlert variant="tip" title="Easter Eggs Ahead!">
          These hidden commands unlock special features. Don't tell anyone we told you about them!
        </DocAlert>

        <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-500/5 border-b border-amber-500/20">
                <th className="text-left p-4 font-mono text-amber-400">Command</th>
                <th className="text-left p-4 text-slate-300">Hint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              <tr className="hover:bg-amber-500/5">
                <td className="p-4 font-mono text-amber-400">secret</td>
                <td className="p-4 text-slate-400">Opens something special...</td>
              </tr>
              <tr className="hover:bg-amber-500/5">
                <td className="p-4 font-mono text-amber-400">matrix</td>
                <td className="p-4 text-slate-400">Feel like Neo</td>
              </tr>
              <tr className="hover:bg-amber-500/5">
                <td className="p-4 font-mono text-amber-400">panic</td>
                <td className="p-4 text-slate-400">Don't actually panic</td>
              </tr>
              <tr className="hover:bg-amber-500/5">
                <td className="p-4 font-mono text-amber-400">fortune</td>
                <td className="p-4 text-slate-400">Wisdom from the deep</td>
              </tr>
              <tr className="hover:bg-amber-500/5">
                <td className="p-4 font-mono text-amber-400">cow [text]</td>
                <td className="p-4 text-slate-400">Moo</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-500 italic">
          There might be more secret commands hidden in the system. Experiment and explore!
        </p>
      </DocSection>

      <DocSection title="Keyboard Shortcuts" icon={Terminal} accentColor="cyan" id="shortcuts">
        <DocTable
          headers={["Shortcut", "Action"]}
          rows={[
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">↑ / ↓</kbd>, "Navigate command history"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Tab</kbd>, "Auto-complete commands"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Ctrl + C</kbd>, "Cancel current command"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Ctrl + L</kbd>, "Clear screen (same as 'clear')"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Ctrl + U</kbd>, "Clear current line"],
          ]}
          accentColor="cyan"
        />
      </DocSection>
    </DocLayout>
  );
};

export default TerminalGuide;
