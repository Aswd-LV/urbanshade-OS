import { ArrowLeft, Keyboard } from "lucide-react";
import { Link } from "react-router-dom";

const Shortcuts = () => {
  const bootShortcuts = [
    { keys: ["DEL"], action: "Access BIOS", context: "During boot" },
    { keys: ["F2"], action: "Recovery Mode", context: "During boot" },
    { keys: ["F8"], action: "Safe Mode", context: "During boot" },
    { keys: ["ESC"], action: "Skip boot animation", context: "During boot" },
  ];

  const desktopShortcuts = [
    { keys: ["Win"], action: "Open Start Menu", context: "Desktop" },
    { keys: ["Alt", "F4"], action: "Close active window", context: "Desktop" },
    { keys: ["Alt", "Tab"], action: "Switch windows", context: "Desktop" },
    { keys: ["Ctrl", "Shift", "Esc"], action: "Open Task Manager", context: "Desktop" },
  ];

  const terminalShortcuts = [
    { keys: ["↑"], action: "Previous command", context: "Terminal" },
    { keys: ["↓"], action: "Next command", context: "Terminal" },
    { keys: ["Tab"], action: "Auto-complete", context: "Terminal" },
    { keys: ["Ctrl", "C"], action: "Cancel command", context: "Terminal" },
    { keys: ["Ctrl", "L"], action: "Clear screen", context: "Terminal" },
  ];

  const renderKeys = (keys: string[]) => (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-slate-900 rounded border border-cyan-500/30 font-mono text-sm text-cyan-400">
            {key}
          </kbd>
          {i < keys.length - 1 && <span className="text-slate-500">+</span>}
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">Keyboard Shortcuts</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center space-y-4">
          <Keyboard className="w-16 h-16 mx-auto text-cyan-400" />
          <h2 className="text-4xl font-bold text-white">Become a Keyboard Ninja</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Why click when you can clack? Master these shortcuts and navigate 
            URBANSHADE OS like you've been doing it for years.
          </p>
        </section>

        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-center text-slate-400">
            <span className="font-bold text-cyan-400">Note:</span> Some shortcuts only work in specific contexts. 
            Don't try to Ctrl+C your way out of a containment breach.
          </p>
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Boot Sequence</h3>
          <p className="text-slate-400">
            These need to be pressed at the right moment during system startup. 
            Timing is everything!
          </p>
          <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 overflow-hidden">
            {bootShortcuts.map((shortcut, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/30"
              >
                {renderKeys(shortcut.keys)}
                <span className="text-white">{shortcut.action}</span>
                <span className="text-xs text-slate-500">{shortcut.context}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Desktop Navigation</h3>
          <p className="text-slate-400">
            Navigate around the desktop like a pro. Impress absolutely no one!
          </p>
          <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 overflow-hidden">
            {desktopShortcuts.map((shortcut, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/30"
              >
                {renderKeys(shortcut.keys)}
                <span className="text-white">{shortcut.action}</span>
                <span className="text-xs text-slate-500">{shortcut.context}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Terminal</h3>
          <p className="text-slate-400">
            Command line efficiency. Because real hackers don't use mice.
          </p>
          <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 overflow-hidden">
            {terminalShortcuts.map((shortcut, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/30"
              >
                {renderKeys(shortcut.keys)}
                <span className="text-white">{shortcut.action}</span>
                <span className="text-xs text-slate-500">{shortcut.context}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">The Secret Combo</h3>
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <p className="text-slate-400">
              There's a secret key combination that does something special. 
              We're not going to tell you what it is. That's the point of a secret.
            </p>
            <p className="text-sm text-amber-500 italic">
              Hint: It involves the Konami Code. Or does it? 🤔
            </p>
          </div>
        </section>

        <div className="p-6 rounded-xl bg-slate-800/50 border border-cyan-500/20">
          <h3 className="font-bold text-cyan-400 mb-4">Quick Reference Card</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-slate-400">🚀 <strong className="text-white">DEL</strong> = BIOS</p>
              <p className="text-slate-400">🔄 <strong className="text-white">F2</strong> = Recovery</p>
              <p className="text-slate-400">🏠 <strong className="text-white">Win</strong> = Start Menu</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400">❌ <strong className="text-white">Alt+F4</strong> = Close Window</p>
              <p className="text-slate-400">🔀 <strong className="text-white">Alt+Tab</strong> = Switch Apps</p>
              <p className="text-slate-400">📊 <strong className="text-white">Ctrl+Shift+Esc</strong> = Task Manager</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-cyan-500/20">
          <Link to="/docs/advanced" className="text-cyan-400 hover:underline">← Advanced Features</Link>
          <Link to="/docs/troubleshooting" className="text-cyan-400 hover:underline">Troubleshooting →</Link>
        </div>
      </main>
    </div>
  );
};

export default Shortcuts;
