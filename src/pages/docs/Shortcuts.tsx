import { Keyboard, Power, Monitor, Terminal, Lightbulb } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocTable, DocAlert } from "@/components/docs";

const Shortcuts = () => {
  const bootShortcuts = [
    [<kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">DEL</kbd>, "Access BIOS", "During boot"],
    [<kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">F2</kbd>, "Recovery Mode", "During boot"],
    [<kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">F8</kbd>, "Safe Mode", "During boot"],
    [<kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">ESC</kbd>, "Skip boot animation", "During boot"],
  ];

  const desktopShortcuts = [
    [<span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">Win</kbd></span>, "Open Start Menu", "Desktop"],
    [<span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">Alt</kbd><span className="text-slate-500">+</span><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">F4</kbd></span>, "Close active window", "Desktop"],
    [<span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">Alt</kbd><span className="text-slate-500">+</span><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">Tab</kbd></span>, "Switch windows", "Desktop"],
    [<span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">Ctrl</kbd><span className="text-slate-500">+</span><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">Shift</kbd><span className="text-slate-500">+</span><kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">Esc</kbd></span>, "Open Task Manager", "Desktop"],
  ];

  const terminalShortcuts = [
    [<kbd className="px-2 py-1 bg-slate-900 rounded border border-green-500/30 font-mono text-sm text-green-400">↑</kbd>, "Previous command", "Terminal"],
    [<kbd className="px-2 py-1 bg-slate-900 rounded border border-green-500/30 font-mono text-sm text-green-400">↓</kbd>, "Next command", "Terminal"],
    [<kbd className="px-2 py-1 bg-slate-900 rounded border border-green-500/30 font-mono text-sm text-green-400">Tab</kbd>, "Auto-complete", "Terminal"],
    [<span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-900 rounded border border-green-500/30 font-mono text-sm text-green-400">Ctrl</kbd><span className="text-slate-500">+</span><kbd className="px-2 py-1 bg-slate-900 rounded border border-green-500/30 font-mono text-sm text-green-400">C</kbd></span>, "Cancel command", "Terminal"],
    [<span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-900 rounded border border-green-500/30 font-mono text-sm text-green-400">Ctrl</kbd><span className="text-slate-500">+</span><kbd className="px-2 py-1 bg-slate-900 rounded border border-green-500/30 font-mono text-sm text-green-400">L</kbd></span>, "Clear screen", "Terminal"],
  ];

  return (
    <DocLayout
      title="Keyboard Shortcuts"
      description="All keyboard shortcuts and hotkeys for Urbanshade OS - boot, desktop, and terminal shortcuts."
      keywords={["shortcuts", "keyboard", "hotkeys", "keys", "commands"]}
      accentColor="blue"
      prevPage={{ title: "Admin Panel", path: "/docs/admin-panel" }}
      nextPage={{ title: "Troubleshooting", path: "/docs/troubleshooting" }}
    >
      <DocHero
        icon={Keyboard}
        title="Become a Keyboard Ninja"
        subtitle="Why click when you can clack? Master these shortcuts and navigate 
        URBANSHADE OS like you've been doing it for years."
        accentColor="blue"
      />

      <DocAlert variant="info">
        Some shortcuts only work in specific contexts. Don't try to Ctrl+C your way 
        out of a containment breach.
      </DocAlert>

      <DocSection title="Boot Sequence" icon={Power} accentColor="cyan" id="boot">
        <p className="mb-4">
          These need to be pressed at the right moment during system startup. Timing is everything!
        </p>
        <DocTable
          headers={["Shortcut", "Action", "Context"]}
          rows={bootShortcuts}
          accentColor="cyan"
        />
      </DocSection>

      <DocSection title="Desktop Navigation" icon={Monitor} accentColor="blue" id="desktop">
        <p className="mb-4">
          Navigate around the desktop like a pro. Impress absolutely no one!
        </p>
        <DocTable
          headers={["Shortcut", "Action", "Context"]}
          rows={desktopShortcuts}
          accentColor="blue"
        />
      </DocSection>

      <DocSection title="Terminal" icon={Terminal} accentColor="green" id="terminal">
        <p className="mb-4">
          Command line efficiency. Because real hackers don't use mice.
        </p>
        <DocTable
          headers={["Shortcut", "Action", "Context"]}
          rows={terminalShortcuts}
          accentColor="green"
        />
      </DocSection>

      <DocSection title="The Secret Combo" icon={Lightbulb} accentColor="amber" id="secret">
        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <p className="text-slate-300">
            There's a secret key combination that does something special. 
            We're not going to tell you what it is. That's the point of a secret.
          </p>
          <p className="text-sm text-amber-400 italic">
            Hint: It involves the Konami Code. Or does it? 🤔
          </p>
        </div>
      </DocSection>

      <DocSection title="Quick Reference" icon={Keyboard} accentColor="cyan" id="reference">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-2">
            <p className="text-slate-300">🚀 <strong className="text-cyan-400">DEL</strong> = BIOS</p>
            <p className="text-slate-300">🔄 <strong className="text-cyan-400">F2</strong> = Recovery</p>
            <p className="text-slate-300">🏠 <strong className="text-cyan-400">Win</strong> = Start Menu</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-2">
            <p className="text-slate-300">❌ <strong className="text-cyan-400">Alt+F4</strong> = Close Window</p>
            <p className="text-slate-300">🔀 <strong className="text-cyan-400">Alt+Tab</strong> = Switch Apps</p>
            <p className="text-slate-300">📊 <strong className="text-cyan-400">Ctrl+Shift+Esc</strong> = Task Manager</p>
          </div>
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Shortcuts;